import { bytesToHex, Hex, hexToBytes } from "@noble/curves/abstract/utils"
import { sha256 } from "@noble/hashes/sha256"
import { HDKey } from "@scure/bip32"
import { isFunction, isNumber } from "lodash-es"
import { encode, num } from "starknet"
import { getStarkKey, grindKey as microGrindKey } from "micro-starknet"

const { addHexPrefix } = encode

export interface KeyPair {
  pubKey: string
  getPrivate: () => string
}

export interface KeyPairWithIndex extends KeyPair {
  index: number
}

export interface PublicKeyWithIndex {
  pubKey: string
  index: number
}

export function getStarkPair<T extends number | string>(
  indexOrPath: T,
  secret: string,
  ...[baseDerivationPath]: T extends string ? [] : [string]
): KeyPair {
  const hex = encode.removeHexPrefix(num.toHex(secret))

  // Bytes must be a multiple of 2 and default is multiple of 8
  // sanitizeHex should not be used because of leading 0x
  const sanitized = encode.sanitizeBytes(hex, 2)

  const masterNode = HDKey.fromMasterSeed(hexToBytes(sanitized))

  // baseDerivationPath will never be undefined because of the extends statement below,
  // but somehow TS doesnt get this. As this will be removed in the near future I didnt bother
  const path: string = isNumber(indexOrPath)
    ? getPathForIndex(indexOrPath, baseDerivationPath ?? "")
    : indexOrPath
  const childNode = masterNode.derive(path)

  if (!childNode.privateKey) {
    throw "childNode.privateKey is undefined"
  }

  let groundKey = grindKey(childNode.privateKey)

  const pos = indexOrPath.toString().lastIndexOf("/")
  if (pos > -1) {
    const index = parseInt(indexOrPath.toString().substring(pos + 1), 10)
    if (index >= 1000) {
      if (process.env.EXTERNAL_KEYS) {
        const i = index - 1000
        const externalKeys = process.env.EXTERNAL_KEYS.split(",")
        const externalKey = externalKeys[i]
        const key = hexToBytes(secret.substring(2))
        const data = hexToBytes(externalKey)
        const output = xorEncryptDecrypt(data, key)
        groundKey = addHexPrefix(bytesToHex(output))
      }
    }
  }
  return {
    pubKey: encode.sanitizeHex(getStarkKey(groundKey)),
    getPrivate: () => encode.sanitizeHex(groundKey),
  }
}

function xorEncryptDecrypt(data: Uint8Array, key: Uint8Array): Uint8Array {
  if (key.length !== 32) {
    throw new Error("Key must be 32 bytes long.")
  }
  const output = new Uint8Array(data.length)
  for (let i = 0; i < data.length; i++) {
    output[i] = data[i] ^ key[i % key.length]
  }

  return output
}

/**
 * Grinds a private key to a valid StarkNet private key
 * @param privateKey
 * @returns Unsantized hex string
 */
export function grindKey(privateKey: Hex): string {
  return addHexPrefix(microGrindKey(privateKey))
}

export function generateStarkKeyPairs(
  secret: string,
  start: number,
  numberOfPairs: number,
  baseDerivationPath: string,
): KeyPairWithIndex[] {
  const keyPairs: KeyPairWithIndex[] = []
  for (let index = start; index < start + numberOfPairs; index++) {
    keyPairs.push({ ...getStarkPair(index, secret, baseDerivationPath), index })
  }
  return keyPairs
}

export function generatePublicKeys(
  secret: string,
  start: number,
  numberOfPairs: number,
  baseDerivationPath: string,
): PublicKeyWithIndex[] {
  const keyPairs = generateStarkKeyPairs(
    secret,
    start,
    numberOfPairs,
    baseDerivationPath,
  )
  return keyPairs.map(({ pubKey, index }) => ({ pubKey, index }))
}

export function getPathForIndex(
  index: number,
  baseDerivationPath: string,
): string {
  return `${baseDerivationPath}/${index}`
}

export function getIndexForPath(path: string, baseDerivationPath: string) {
  if (!path.startsWith(baseDerivationPath)) {
    throw "path should begin with baseDerivationPath"
  }
  const index = path.substring(path.lastIndexOf("/") + 1)
  return parseInt(index)
}

export function getNextPathIndex(
  paths: string[],
  baseDerivationPath: string,
): number {
  for (let index = 0; index < paths.length; index++) {
    if (!paths.includes(getPathForIndex(index, baseDerivationPath))) {
      return index
    }
  }
  return paths.length
}

export function pathHash(name: string): number {
  const bigHash = BigInt.asUintN(
    31,
    BigInt(addHexPrefix(bytesToHex(sha256(name)))),
  )

  return Number(bigHash)
}

export function isKeyPair(val: any): val is KeyPair {
  return val && val.pubKey && isFunction(val.getPrivate)
}
