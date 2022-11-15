import { NetworkMessage } from "../shared/messages/NetworkMessage"
import { getNetwork, getNetworkByChainId, getNetworks } from "../shared/network"
import { UnhandledMessage } from "./background"
import { HandleMessage } from "./background"
import { getNetworkStatuses } from "./networkStatus"

export const handleNetworkMessage: HandleMessage<NetworkMessage> = async ({
  msg,
  background: { actionQueue },
  sendToTabAndUi,
}) => {
  switch (msg.type) {
    case "GET_NETWORKS": {
      return sendToTabAndUi({
        type: "GET_NETWORKS_RES",
        data: await getNetworks(),
      })
    }

    case "GET_NETWORK": {
      const allNetworks = await getNetworks()

      const network = allNetworks.find((n) => n.id === msg.data)

      if (!network) {
        throw new Error(`Network with id ${msg.data} not found`)
      }

      return sendToTabAndUi({
        type: "GET_NETWORK_RES",
        data: network,
      })
    }

    case "GET_NETWORK_STATUSES": {
      const networks = msg.data?.length ? msg.data : await getNetworks()
      const statuses = await getNetworkStatuses(networks)
      return sendToTabAndUi({
        type: "GET_NETWORK_STATUSES_RES",
        data: statuses,
      })
    }

    case "REQUEST_ADD_CUSTOM_NETWORK": {
      const exists = await getNetwork(msg.data.chainId)

      if (exists) {
        return sendToTabAndUi({
          type: "REQUEST_ADD_CUSTOM_NETWORK_RES",
          data: {},
        })
      }

      const { meta } = await actionQueue.push({
        type: "REQUEST_ADD_CUSTOM_NETWORK",
        payload: msg.data,
      })

      return sendToTabAndUi({
        type: "REQUEST_ADD_CUSTOM_NETWORK_RES",
        data: {
          actionHash: meta.hash,
        },
      })
    }

    case "REQUEST_SWITCH_CUSTOM_NETWORK": {
      const network = await getNetworkByChainId(msg.data.chainId)

      if (!network) {
        return sendToTabAndUi({
          type: "REQUEST_SWITCH_CUSTOM_NETWORK_RES",
          data: {},
        })
      }

      const { meta } = await actionQueue.push({
        type: "REQUEST_SWITCH_CUSTOM_NETWORK",
        payload: network,
      })

      return sendToTabAndUi({
        type: "REQUEST_SWITCH_CUSTOM_NETWORK_RES",
        data: {
          actionHash: meta.hash,
        },
      })
    }

    case "REJECT_REQUEST_ADD_CUSTOM_NETWORK":
    case "REJECT_REQUEST_SWITCH_CUSTOM_NETWORK": {
      return await actionQueue.remove(msg.data.actionHash)
    }
  }

  throw new UnhandledMessage()
}
