<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      accountPrivateKey: localStorage.getItem('accountPrivateKey') || ''
    }
  },
  methods: {
    async submit() {
      localStorage.setItem('accountPrivateKey', this.accountPrivateKey)
      this.$emit('updateAccount')
    }
  }
})
</script>

<template>
  <div class="container">
    <h2>Your account:</h2>
    <form @submit.prevent="submit">
      <input type="text" placeholder="Enter account private key" v-model="accountPrivateKey" />
      <button type="submit">Save</button>
    </form>
  </div>
</template>

<style scoped>
.container {
  margin-bottom: 20px;
}

input {
  width: 600px;
}
</style>
