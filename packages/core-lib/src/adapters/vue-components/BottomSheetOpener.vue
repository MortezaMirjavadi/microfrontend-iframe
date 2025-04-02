<template>
  <button class="bottom-sheet-opener" :class="className" :style="buttonStyle" @click="openBottomSheet">
    <slot>Open {{ appId }}</slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useBottomSheet } from '../vue';

const props = defineProps({
  appId: {
    type: String,
    required: true
  },
  path: {
    type: String,
    default: '/'
  },
  height: {
    type: [String, Number],
    default: '50vh'
  },
  className: {
    type: String,
    default: ''
  },
  customStyle: {
    type: Object,
    default: () => ({})
  }
});

const buttonStyle = computed(() => ({
  padding: '8px 16px',
  backgroundColor: '#42b883',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  ...props.customStyle
}));

const { openApp } = useBottomSheet();

const openBottomSheet = () => {
  openApp(props.appId, props.path, props.height);
};
</script>

<style scoped>
.bottom-sheet-opener:hover {
  background-color: #359268;
}
</style>