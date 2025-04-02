<template>
  <div class="dashboard">
    <h2>Vue Analytics Dashboard</h2>
    <div class="chart-container">
      <div class="chart">
        <h3>Daily Visitors</h3>
        <div class="bar-chart">
          <div v-for="(value, day) in visitorData" :key="day" class="bar-container">
            <div class="bar" :style="{ height: value + 'px' }"></div>
            <div class="day">{{ day }}</div>
          </div>
        </div>
      </div>
    </div>
    <p>Current path: {{ $route.path }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visitorData = ref({
  Mon: 30,
  Tue: 45,
  Wed: 75,
  Thu: 60,
  Fri: 90,
  Sat: 40,
  Sun: 25
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.chart-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.chart {
  width: 400px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.bar-chart {
  height: 200px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 20px;
}

.bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
}

.bar {
  width: 30px;
  background-color: #42b883;
  transition: height 0.3s ease;
}

.day {
  margin-top: 8px;
  font-size: 12px;
}
</style>