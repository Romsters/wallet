<script lang="ts">
import { defineComponent } from 'vue'
import { TOKEN, TOKEN_LABEL_ADDRESS_MAP } from '../config'
import { depositToL2 } from '../clients/wallet'
import TransferForm from './TransferForm.vue'
import type { DepositPayload } from '../types'

type State = {
  isDepositing: boolean
  error: string
  amount: number
  token: TOKEN
  transactionHashL1: string
  transactionHashL2: string
}

export default defineComponent({
  props: {
    accountPrivateKey: {
      type: String,
      required: true
    }
  },
  data(): State {
    return {
      amount: 0,
      error: '',
      token: TOKEN.ETH,
      isDepositing: false,
      transactionHashL1: '',
      transactionHashL2: ''
    }
  },
  components: {
    TransferForm
  },
  methods: {
    async submitDepositToL2(data: DepositPayload) {
      try {
        this.isDepositing = true
        this.amount = data.amount
        this.token = data.token as TOKEN

        const deposit = await depositToL2(
          this.accountPrivateKey,
          data.amount,
          TOKEN_LABEL_ADDRESS_MAP[data.token].l1
        )

        // Await processing of the deposit on L1
        const ethereumTxReceipt = await deposit.waitL1Commit()
        this.transactionHashL1 = ethereumTxReceipt.transactionHash
        this.$emit('refetchBalances')

        // Await processing the deposit on L2
        const depositReceipt = await deposit.wait()
        this.transactionHashL2 = depositReceipt.transactionHash
        this.$emit('refetchBalances')
      } catch (err) {
        this.error = err as string
      }
    },
    resetForm() {
      this.isDepositing = false
      this.error = ''
      this.amount = 0
      this.transactionHashL1 = ''
      this.transactionHashL2 = ''
      this.$emit('refetchBalances')
    }
  }
})
</script>

<template>
  <h1>Deposit</h1>
  <div v-if="isDepositing">
    <div v-if="error" class="error">
      Transaction for {{ amount }} {{ token }} failed
      <div>Reason: {{ error }}</div>
    </div>
    <div v-if="!transactionHashL2 && !error">Waiting for transaction {{ amount }} {{ token }}</div>
    <div v-if="transactionHashL2 && !error">
      Transaction for {{ amount }} {{ token }} is commited successfully
    </div>
    <div>L1 transaction hash: {{ transactionHashL1 }}</div>
    <div>L2 transaction hash: {{ transactionHashL2 }}</div>
    <div v-if="transactionHashL1 || error">
      <button @click="resetForm">Ok</button>
    </div>
  </div>
  <div v-if="!isDepositing">
    <TransferForm @submit-transfer="submitDepositToL2" />
  </div>
</template>

<style scoped>
.error {
  word-break: break-all;
}
</style>
