<script lang="ts">
import { defineComponent } from 'vue'
import { TOKEN, TOKEN_LABEL_ADDRESS_MAP } from '../config'
import { withdraw } from '../clients/wallet'
import TransferForm from './TransferForm.vue'
import type { WithdrawPayload } from '../types'

type State = {
  isWithdrowing: boolean
  error: string
  amount: number
  token: TOKEN
  transactionHash: string
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
      isWithdrowing: false,
      error: '',
      amount: 0,
      token: TOKEN.ETH,
      transactionHash: ''
    }
  },
  components: {
    TransferForm
  },
  methods: {
    async submitWithdraw(data: WithdrawPayload) {
      try {
        this.isWithdrowing = true
        this.amount = data.amount
        this.token = data.token as TOKEN

        const withdrawResponse = await withdraw(
          this.accountPrivateKey,
          data.amount,
          TOKEN_LABEL_ADDRESS_MAP[data.token].l2
        )
        this.$emit('refetchBalances')

        // Wait until the validity proof verification is complete
        const receipt = await withdrawResponse.waitFinalize()
        this.transactionHash = receipt.transactionHash

        this.$emit('refetchBalances')
      } catch (err) {
        this.error = err as string
      }
    },
    resetForm() {
      this.isWithdrowing = false
      this.error = ''
      this.amount = 0
      this.transactionHash = ''
      this.token = TOKEN.ETH

      this.$emit('refetchBalances')
    }
  }
})
</script>

<template>
  <h1>Withdraw</h1>
  <div v-if="isWithdrowing">
    <div v-if="error" class="error">
      Transaction for {{ amount }} {{ token }} failed
      <div>Reason: {{ error }}</div>
    </div>
    <div v-if="!transactionHash && !error">Waiting for transaction {{ amount }} {{ token }}</div>
    <div v-if="transactionHash && !error">
      Transaction for {{ amount }} {{ token }} is commited successfully
    </div>
    <div>Transaction hash: {{ transactionHash }}</div>
    <div>
      <button @click="resetForm">Ok</button>
    </div>
  </div>
  <div v-if="!isWithdrowing">
    <TransferForm @submit-transfer="submitWithdraw" />
  </div>
</template>

<style scoped>
.error {
  word-break: break-all;
}
</style>
