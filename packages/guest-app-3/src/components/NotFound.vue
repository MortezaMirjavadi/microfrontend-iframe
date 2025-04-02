<template>
  <div class="not-found">
    <h2>404 - Page Not Found</h2>
    <p>The page you are looking for does not exist.</p>
    <button @click="goToDashboard" class="btn">Go to Dashboard</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToDashboard = () => {
  router.push('/dashboard');
};
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 40px;
}

.btn {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}

.btn:hover {
  background-color: #359268;
}
</style>