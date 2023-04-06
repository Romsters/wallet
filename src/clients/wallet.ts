import * as zksync from 'zksync-web3'
import * as ethers from 'ethers'

import {
  ZK_SYNC_PROVIDER_URL,
  ETHERIUM_NETWORK_NAME,
  TOKEN_LABEL_ADDRESS_MAP,
  DEFAULT_TOKEN_DECIMALS
} from '../config'
import ERC20BaseABI from '../contracts/ERC20Base.abi.json'

const zkSyncProvider = new zksync.Provider(ZK_SYNC_PROVIDER_URL)
const ethProvider = ethers.getDefaultProvider(ETHERIUM_NETWORK_NAME)

export const getL1Wallet = (accountPrivateKey: string) =>
  new ethers.Wallet(accountPrivateKey, ethProvider)

export const getL2Wallet = (accountPrivateKey: string) =>
  new zksync.Wallet(accountPrivateKey, zkSyncProvider, ethProvider)

const getTokenDecimals = async (tokenAddress: string, isL2 = false): Promise<number> => {
  if (tokenAddress === zksync.utils.ETH_ADDRESS) {
    return DEFAULT_TOKEN_DECIMALS
  }
  const utils = isL2 ? zksync : ethers
  const provider = isL2 ? zkSyncProvider : ethProvider

  const tokencContract = new utils.Contract(tokenAddress, ERC20BaseABI, provider)
  return tokencContract.decimals()
}

export const depositToL2 = async (
  accountPrivateKey: string,
  amount: number,
  token: string = zksync.utils.ETH_ADDRESS
) => {
  const wallet = getL2Wallet(accountPrivateKey)
  const tokenDecimals = await getTokenDecimals(token)
  const payload = {
    token,
    amount: ethers.utils.parseUnits(amount.toString(), tokenDecimals),
    ...(token !== zksync.utils.ETH_ADDRESS && { approveERC20: true })
  }
  return wallet.deposit(payload)
}

export const withdraw = async (
  accountPrivateKey: string,
  amount: number,
  token: string = zksync.utils.ETH_ADDRESS
) => {
  const wallet = getL2Wallet(accountPrivateKey)
  const tokenDecimals = await getTokenDecimals(token, true)
  return wallet.withdraw({
    token,
    amount: ethers.utils.parseUnits(amount.toString(), tokenDecimals)
  })
}

export const transferL2 = async (
  accountPrivateKey: string,
  to: string,
  amount: number,
  token: string = zksync.utils.ETH_ADDRESS
) => {
  const wallet = getL2Wallet(accountPrivateKey)
  const tokenDecimals = await getTokenDecimals(token, true)
  return wallet.transfer({
    to,
    token,
    amount: ethers.utils.parseUnits(amount.toString(), tokenDecimals)
  })
}

const getBalance = async (
  accountPrivateKey: string,
  token: string = zksync.utils.ETH_ADDRESS,
  isL2 = false
) => {
  const wallet = isL2 ? getL2Wallet(accountPrivateKey) : getL1Wallet(accountPrivateKey)
  if (token === zksync.utils.ETH_ADDRESS) {
    const balance = await wallet.getBalance()
    return ethers.utils.formatEther(balance)
  }
  const tokenName = Object.keys(TOKEN_LABEL_ADDRESS_MAP).find(
    (name) => TOKEN_LABEL_ADDRESS_MAP[name][isL2 ? 'l2' : 'l1'] === token
  )
  if (!tokenName) {
    return '0'
  }
  const utils = isL2 ? zksync : ethers
  const provider = isL2 ? zkSyncProvider : ethProvider
  const tokencContract = new utils.Contract(token, ERC20BaseABI, provider)
  const balance = await tokencContract.balanceOf(wallet.address)
  const decimals = await tokencContract.decimals()
  return ethers.utils.formatUnits(balance, decimals)
}

export const getL1Balance = async (
  accountPrivateKey: string,
  token: string = zksync.utils.ETH_ADDRESS
) => getBalance(accountPrivateKey, token)

export const getL2Balance = async (
  accountPrivateKey: string,
  token: string = zksync.utils.ETH_ADDRESS
) => getBalance(accountPrivateKey, token, true)
