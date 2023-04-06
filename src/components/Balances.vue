<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  props: {
    l1Balances: {
      type: Object as PropType<Record<string, number>>,
      required: true
    },
    l2Balances: {
      type: Object as PropType<Record<string, number>>,
      required: true
    }
  }
})
</script>

<template>
  <div class="container">
    <h2>Your Balances:</h2>
    <ul class="balances">
      <li class="balance">
        <h3>L1:</h3>
        <div v-for="token in Object.keys(l1Balances)" :key="token">
          <div>{{ token }} : {{ l1Balances[token].toFixed(4) }}</div>
        </div>
      </li>
      <li class="balance">
        <h3>L2:</h3>
        <div v-for="token in Object.keys(l2Balances)" :key="token">
          <div>{{ token }} : {{ l2Balances[token].toFixed(4) }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container {
  margin-bottom: 20px;
}

.balances {
  display: flex;
  gap: 30px;
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
