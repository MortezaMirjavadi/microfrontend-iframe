<template>
  <div id="app">
    <header>
      <h1>Vue Analytics App</h1>
      <div v-if="isBottomSheet" class="bottom-sheet-badge">Bottom Sheet Mode</div>
      <nav>
        <RouterLink to="/dashboard">Dashboard</RouterLink> |
        <RouterLink to="/reports">Reports</RouterLink>
      </nav>
    </header>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useVueRouteSync, useVueBottomSheetMode, useMicroFrontendClient } from '../../core-lib/src/adapters/vue';
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';

onMounted(() => {
  try {
    const client = useMicroFrontendClient();
    console.log('App.vue successfully got client:', client);
  } catch (error) {
    console.error('Failed to get client in App.vue:', error);
  }
});

const router = useRouter();
const route = useRoute();

const getCurrentPath = () => route.path;

useVueRouteSync(
  getCurrentPath,
  (path) => router.push(path)
);

const isBottomSheet = useVueBottomSheetMode();
</script>

<style>
.bottom-sheet-badge {
  background-color: #ff5722;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  display: inline-block;
  margin-left: 10px;
}
</style>