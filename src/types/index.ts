export type DepositPayload = {
  amount: number
  token: string
}

export type WithdrawPayload = DepositPayload

export type TransferPayload = DepositPayload & {
  to: string
}
