import CurrencyConversionNumber from "bignumber.js"
import { BigNumber, BigNumberish, utils } from "ethers"
import { uint256 } from "starknet"
import useSWR from "swr"
import urlJoin from "url-join"

import { fetchData } from "../http/fetcher"
import { withPolling } from "../http/swr"
import {
  isNumeric,
  prettifyCurrencyNumber,
  prettifyTokenNumber,
} from "../utils/number"
import { Token, TokenWithBalance } from "./token"

const { UINT_256_MAX } = uint256

/** shape of individual entity in the /tokens/info endpoint */
export interface ApiTokenDetails {
  id: number
  address: string
  pricingId: number
}

export interface ApiTokenDataResponse {
  tokens: ApiTokenDetails[]
}

/** shape of individual entity in the /tokens/prices endpoint */
export interface ApiPriceDetails {
  pricingId: number
  ethValue: string
  ccyValue: string
  ethDayChange: string
  ccyDayChange: string
}

export interface ApiPriceDataResponse {
  prices: ApiPriceDetails[]
}

export interface ILookupTokenPriceDetails {
  /** the token to query */
  token: Token
  /** reponse from `/tokens/prices` endpoint */
  pricesData: ApiPriceDataResponse
  /** reponse from `/tokens/info` endpoint */
  tokenData: ApiTokenDataResponse
}

const tokensApiUrl = (apiBaseUrl: string) => ({
  prices: urlJoin(apiBaseUrl, "tokens/prices?chain=starknet"),
  info: urlJoin(apiBaseUrl, "tokens/info?chain=starknet"),
})

// if apiBaseUrl is undefined, then we don't want to fetch anything
// this can be used in argent-x when checking ARGENT_API_ENABLED
export const fetchPriceAndTokenDataFromApi = (
  apiBaseUrl?: string,
  apiHeaders?: Record<string, string>,
) => {
  if (!apiBaseUrl) {
    return {
      pricesData: null,
      tokenData: null,
    }
  }
  const { prices: pricesUrl, info: infoUrl } = tokensApiUrl(apiBaseUrl)
  const { data: pricesData } = useSWR(
    `tokenPrices`,
    () =>
      fetchData(pricesUrl, {
        headers: apiHeaders,
      }),
    withPolling(60 * 1000) /** 60 seconds */,
  )
  const { data: tokenData } = useSWR(
    `tokenData`,
    () => fetchData(infoUrl, { headers: apiHeaders }),
    withPolling(5 * 60 * 1000) /** 5 minutes */,
  )

  return {
    pricesData,
    tokenData,
  }
}

/**
 * Given `token`, find the token in the `tokenData` and then the price details in `priceData`
 */

export const lookupTokenPriceDetails = ({
  token,
  pricesData,
  tokenData,
}: ILookupTokenPriceDetails) => {
  if (!tokenData?.tokens) {
    return
  }
  /** find token from tokenData by matching address */
  const tokenInPriceData = tokenData.tokens.find(
    ({ address }) => address.toLowerCase() === token.address.toLowerCase(),
  )
  if (tokenInPriceData) {
    /** find token price details from pricesData by matching priceId */
    const priceDetails = pricesData.prices.find(
      ({ pricingId }) => pricingId === tokenInPriceData.pricingId,
    )
    return priceDetails
  }
  return null
}

export interface ISumTokenBalancesToCurrencyValue {
  /** the tokens to sum */
  tokens: TokenWithBalance[]
  /** reponse from `/tokens/prices` endpoint */
  pricesData: ApiPriceDataResponse
  /** reponse from `/tokens/info` endpoint */
  tokenData: ApiTokenDataResponse
}

export interface IConvertTokenAmountToCurrencyValue {
  /** the token decimal amount */
  amount: BigNumberish
  /** number of decimals used in token amount */
  decimals: BigNumberish
  /** the currency value of 1 unit of token */
  unitCurrencyValue: number | string
}

/**
 * Converts a token amount and decimals into a final currency value, returning a raw string with many decimals
 */

export const convertTokenAmountToCurrencyValue = ({
  amount,
  decimals,
  unitCurrencyValue,
}: IConvertTokenAmountToCurrencyValue) => {
  if (
    !isNumeric(amount) ||
    !isNumeric(decimals) ||
    !isNumeric(unitCurrencyValue)
  ) {
    return
  }
  const decimalsNumber = Number(decimals)
  /** amount to divide by to take amount to unit value */
  const unitDivideBy = Math.pow(10, decimalsNumber)
  /** take amount to unit value */
  const amountDecimal = new CurrencyConversionNumber(
    amount.toString(),
  ).dividedBy(unitDivideBy)
  /** multiply to convert to currency */
  const currencyValue = amountDecimal.multipliedBy(
    new CurrencyConversionNumber(unitCurrencyValue),
  )
  /** keep as string to avoid loss of precision elsewhere */
  return currencyValue.toString()
}

/**
 * Prettify a raw currency string value e.g. '1.23456' => '$1.23'
 */

export const prettifyCurrencyValue = (
  currencyValue?: string | number,
  currencySymbol = "$",
) => {
  if (currencyValue === undefined || !isNumeric(currencyValue)) {
    return null
  }
  const prettyValue = prettifyCurrencyNumber(currencyValue)
  const prettyValueWithSymbol = [currencySymbol, prettyValue]
    .filter(Boolean)
    .join("")
  return prettyValueWithSymbol
}

/**
 * Returns a string of token balance with symbol if available e.g.
 */

export const prettifyTokenBalance = (
  token: TokenWithBalance,
  withSymbol = true,
) => {
  const { balance, decimals, symbol } = token
  if (balance === undefined || decimals === undefined) {
    return null
  }
  return prettifyTokenAmount({
    amount: balance,
    decimals,
    symbol: withSymbol ? symbol : "",
  })
}

export const PRETTY_UNLIMITED = "Unlimited"

export const isUnlimitedAmount = (amount: BigNumberish) => {
  return String(amount) === String(UINT_256_MAX)
}

export interface IPrettifyTokenAmount {
  amount: BigNumberish
  decimals: BigNumberish
  symbol?: string
  showPlusSign?: boolean
  withSymbol?: boolean
  unlimitedText?: string
}

export interface IPrettifyTokenAmount {
  amount: BigNumberish
  decimals: BigNumberish
  symbol?: string
  showPlusSign?: boolean
  withSymbol?: boolean
  unlimitedText?: string
}

export const prettifyTokenAmount = ({
  amount,
  decimals,
  symbol,
  showPlusSign,
  withSymbol,
  unlimitedText,
}: IPrettifyTokenAmount) => {
  if (!isNumeric(amount)) {
    return null
  }
  let prettyValue
  let isPositiveValue = false
  if (isUnlimitedAmount(amount)) {
    prettyValue = unlimitedText
  } else {
    const decimalsNumber = Number(decimals)
    const balanceBn = BigNumber.from(amount)
    const balanceFullString = utils.formatUnits(balanceBn, decimalsNumber)
    prettyValue = prettifyTokenNumber(balanceFullString)
    isPositiveValue = balanceBn.gt(0)
  }
  const prettyValueWithSymbol = [
    showPlusSign && isPositiveValue && "+",
    prettyValue,
    withSymbol && symbol,
  ]
    .filter(Boolean)
    .join(" ")

  return prettyValueWithSymbol
}

export interface IConvertTokenAmount {
  unitAmount?: BigNumberish
  decimals?: BigNumberish
}

/**
 * Convert a unit amount of token into native amount, useful for user input
 *
 * @example
 * ```ts
 * // Prints '1000000000000000000'
 * convertTokenUnitAmountWithDecimals({ unitAmount: 1, decimals: 18 }),
 * ```
 *
 * @example
 * ```ts
 * // Prints '123'
 * convertTokenUnitAmountWithDecimals({ unitAmount: 1.23, decimals: 2 }),
 * ```
 */

export const convertTokenUnitAmountWithDecimals = ({
  unitAmount,
  decimals,
}: IConvertTokenAmount) => {
  if (
    unitAmount === undefined ||
    !isNumeric(unitAmount) ||
    decimals === undefined ||
    !isNumeric(decimals)
  ) {
    return
  }
  const decimalsNumber = Number(decimals)
  /** amount to multipy by to take unit amount to token value */
  const unitMultiplyBy = Math.pow(10, decimalsNumber)
  /** take unit amount to token amount, enforcing integer */
  const amount = new CurrencyConversionNumber(unitAmount.toString())
    .multipliedBy(unitMultiplyBy)
    .integerValue()
  /** keep as string to avoid loss of precision elsewhere */
  return amount.toString()
}
