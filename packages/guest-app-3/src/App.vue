<template>
  <div id="app">
    <header>
      <h1>Vue Analytics App</h1>
      <nav>
        <RouterLink to="/dashboard">Dashboard</RouterLink> |
        <RouterLink to="/reports">Reports</RouterLink>
      </nav>
    </header>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const isInBottomSheet = ref(false)

const router = useRouter()
const route = useRoute()

const hostOrigin = import.meta.env.VITE_HOST_ORIGIN || window.location.origin

const handleBottomSheetMode = (event: any) => {
  isInBottomSheet.value = event.detail.isBottomSheet
}

const handleHostNavigation = (event: CustomEvent) => {
  const { path } = event.detail
  console.log(`Vue App received navigation request to: ${path}`)
  
  if (route.path !== path) {
    router.push(path)
  }
}

// Listen for navigation commands from the host
onMounted(() => {
  window.addEventListener('appNavigation', handleHostNavigation as EventListener)
  window.addEventListener('bottomSheetMode', handleBottomSheetMode)
  
  // Send ready message to the host
  if (window.parent !== window) {
    window.parent.postMessage({
      type: 'ready',
      guestId: 'app3',
      currentPath: route.path
    }, hostOrigin)
  }
})

onUnmounted(() => {
  window.removeEventListener('appNavigation', handleHostNavigation as EventListener)
  window.removeEventListener('bottomSheetMode', handleBottomSheetMode)
})

watch(() => route.path, (newPath) => {
  console.log(`Route changed to: ${newPath}`)
  
  if (window.parent !== window) {
    window.parent.postMessage({
      type: 'routeChange',
      path: newPath,
      appId: 'app3'
    }, hostOrigin)
  }
})
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 20px;
}

header {
  margin-bottom: 20px;
}

nav {
  padding: 15px 0;
}

nav a {
  color: #42b883;
  text-decoration: none;
  margin: 0 10px;
  font-weight: bold;
}

nav a.router-link-active {
  color: #359268;
  border-bottom: 2px solid #359268;
}
</style>