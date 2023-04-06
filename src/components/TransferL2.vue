<script lang="ts">
import { defineComponent } from 'vue'
import { TOKEN, TOKEN_LABEL_ADDRESS_MAP } from '../config'
import { transferL2 } from '../clients/wallet'
import TransferForm from './TransferForm.vue'
import type { TransferPayload } from '../types'

type State = {
  isTransfering: boolean
  error: string
  amount: number
  token: TOKEN
  to: string
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
      isTransfering: false,
      error: '',
      amount: 0,
      to: '',
      token: TOKEN.ETH,
      transactionHash: ''
    }
  },
  components: {
    TransferForm
  },
  methods: {
    async submitTransfer(data: TransferPayload) {
      try {
        this.isTransfering = true
        this.amount = data.amount
        this.token = data.token as TOKEN
        this.to = data.to

        const transferResponse = await transferL2(
          this.accountPrivateKey,
          data.to,
          data.amount,
          TOKEN_LABEL_ADDRESS_MAP[data.token].l2
        )

        // Await commitment
        const committedTxReceipt = await transferResponse.wait()
        this.transactionHash = committedTxReceipt.transactionHash

        this.$emit('refetchBalances')
      } catch (err) {
        this.error = err as string
      }
    },
    resetForm() {
      this.isTransfering = false
      this.error = ''
      this.to = ''
      this.amount = 0
      this.transactionHash = ''
      this.token = TOKEN.ETH

      this.$emit('refetchBalances')
    }
  }
})
</script>

<template>
  <h1>Transfer L2 -> L2</h1>
  <div v-if="isTransfering">
    <div v-if="error" class="error">
      Transaction for {{ amount }} {{ token }} to {{ to }} failed
      <div>Reason: {{ error }}</div>
    </div>
    <div v-if="!transactionHash && !error">
      Waiting for transaction {{ amount }} {{ token }} to {{ to }}
    </div>
    <div v-if="transactionHash && !error">
      Transaction for {{ amount }} {{ token }} to {{ to }} is commited successfully
    </div>
    <div>Transaction hash: {{ transactionHash }}</div>
    <div>
      <button @click="resetForm">Ok</button>
    </div>
  </div>
  <div v-if="!isTransfering">
    <TransferForm @submit-transfer="submitTransfer" form-type="transfer" />
  </div>
</template>

<style scoped>
.error {
  word-break: break-all;
}
</style>
