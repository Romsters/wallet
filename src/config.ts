import * as zksync from 'zksync-web3'

export const ZK_SYNC_PROVIDER_URL = 'https://testnet.era.zksync.dev'
export const ETHERIUM_NETWORK_NAME = 'goerli'

export enum TOKEN {
  ETH = 'ETH',
  USDC = 'USDC',
  ROPE = 'ROPE'
}

export const TOKEN_LABEL_ADDRESS_MAP: Record<string, Record<string, string>> = {
  [TOKEN.ETH]: {
    l1: zksync.utils.ETH_ADDRESS,
    l2: zksync.utils.ETH_ADDRESS
  },
  [TOKEN.ROPE]: {
    l1: '0xBa9ac54B292243e798516d03735f69867188DDeC',
    l2: '0xBa9ac54B292243e798516d03735f69867188DDeC'
  },
  [TOKEN.USDC]: {
    l1: '0xd35CCeEAD182dcee0F148EbaC9447DA2c4D449c4',
    l2: '0x0faF6df7054946141266420b43783387A78d82A9'
  }
}

export const DEFAULT_TOKEN_DECIMALS = 18
