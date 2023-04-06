<script lang="ts">
import { defineComponent } from 'vue'
import { TOKEN } from '../config'
import Operations from '../components/Operations.vue'
import LoginForm from '../components/LoginForm.vue'

export default defineComponent({
  components: {
    Operations,
    LoginForm
  },
  data() {
    return {
      // bring back TOKEN.ROPE once it's bridged
      tokens: [TOKEN.ETH, /*TOKEN.ROPE,*/ TOKEN.USDC],
      accountPrivateKey: localStorage.getItem('accountPrivateKey') || ''
    }
  },
  methods: {
    updateAccount() {
      this.accountPrivateKey = localStorage.getItem('accountPrivateKey') || ''
    }
  }
})
</script>

<template>
  <main>
    <LoginForm @update-account="updateAccount" />
    <div v-if="accountPrivateKey">
      <Operations :account-private-key="accountPrivateKey" :tokens="tokens" />
    </div>
    <div v-else>Please login</div>
  </main>
</template>
