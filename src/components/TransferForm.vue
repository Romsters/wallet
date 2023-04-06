<script lang="ts">
import { defineComponent } from 'vue'
import { TOKEN } from '../config'

export default defineComponent({
  props: {
    formType: String
  },
  data() {
    return {
      amount: 0,
      availableTokens: Object.keys(TOKEN),
      token: TOKEN.ETH,
      to: ''
    }
  },
  methods: {
    async submit() {
      this.$emit('submitTransfer', {
        amount: this.amount,
        token: this.token,
        ...(this.formType === 'transfer' && {
          to: this.to
        })
      })
    }
  }
})
</script>

<template>
  <form @submit.prevent="submit">
    <div v-if="formType === 'transfer'">
      <input type="text" placeholder="To" v-model="to" />
    </div>
    <input
      type="number"
      placeholder="Amount"
      v-model="amount"
      min="0.0001"
      max="1000000"
      step="0.0001"
    />
    <select v-model="token">
      <option v-for="tokenSybmol in availableTokens" :value="tokenSybmol" :key="tokenSybmol">
        {{ tokenSybmol }}
      </option>
    </select>
    <button type="submit">Submit</button>
  </form>
</template>
