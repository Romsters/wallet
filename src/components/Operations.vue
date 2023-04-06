<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import Balances from './Balances.vue'
import Deposit from './Deposit.vue'
import Withdraw from './Withdraw.vue'
import TransferL2 from './TransferL2.vue'
import { TOKEN_LABEL_ADDRESS_MAP } from '../config'
import { getL1Balance, getL2Balance } from '../clients/wallet'

type State = {
  l1Balances: Record<string, number>
  l2Balances: Record<string, number>
  selectedTabIndex: number
  error: string
}

export default defineComponent({
  components: {
    Balances,
    Deposit,
    Withdraw,
    TransferL2
  },
  props: {
    accountPrivateKey: {
      type: String,
      required: true
    },
    tokens: {
      type: Array as PropType<Array<string>>,
      required: true,
      default: []
    }
  },
  data(): State {
    return {
      l1Balances: {},
      l2Balances: {},
      selectedTabIndex: 0,
      error: ''
    }
  },
  mounted() {
    this.fetchBalances()
  },
  methods: {
    selectTab(index: number) {
      this.selectedTabIndex = index
    },
    async fetchBalances() {
      try {
        await Promise.all(
          this.tokens.map(async (token) => {
            const l1Balance = await getL1Balance(
              this.accountPrivateKey,
              TOKEN_LABEL_ADDRESS_MAP[token].l1
            )
            const l2Balance = await getL2Balance(
              this.accountPrivateKey,
              TOKEN_LABEL_ADDRESS_MAP[token].l2
            )
            this.l1Balances[token] = parseFloat(l1Balance)
            this.l2Balances[token] = parseFloat(l2Balance)
          })
        )
      } catch (err) {
        this.error = err as string
      }
    }
  }
})
</script>

<template>
  <div class="error" v-if="error">Failed to fetch balances, reason {{ error }}.</div>
  <div v-else>
    <Balances :l1-balances="l1Balances" :l2-balances="l2Balances" />
  </div>
  <nav>
    <div class="tab" :class="{ selected: selectedTabIndex === 0 }" @click="() => selectTab(0)">
      Deposit to L2
    </div>
    <div class="tab" :class="{ selected: selectedTabIndex === 1 }" @click="() => selectTab(1)">
      Transfer L2 -> L2
    </div>
    <div class="tab" :class="{ selected: selectedTabIndex === 2 }" @click="() => selectTab(2)">
      Withdraw to L1
    </div>
  </nav>
  <div v-if="selectedTabIndex === 0">
    <Deposit @refetch-balances="fetchBalances" :account-private-key="accountPrivateKey" />
  </div>
  <div v-if="selectedTabIndex === 1">
    <TransferL2 @refetch-balances="fetchBalances" :account-private-key="accountPrivateKey" />
  </div>
  <div v-if="selectedTabIndex === 2">
    <Withdraw @refetch-balances="fetchBalances" :account-private-key="accountPrivateKey" />
  </div>
</template>

<style scoped>
.error {
  word-break: break-all;
  color: red;
  margin-bottom: 20px;
}

nav {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.tab {
  cursor: pointer;
}

.tab:hover,
.selected {
  color: white;
}
</style>
