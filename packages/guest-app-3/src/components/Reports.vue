<template>
  <div class="reports">
    <h2>Analytics Reports</h2>
    
    <div class="report-list">
      <div v-for="report in reports" :key="report.id" class="report-item">
        <div class="report-icon">{{ report.icon }}</div>
        <div class="report-content">
          <h3>{{ report.title }}</h3>
          <p>{{ report.description }}</p>
          <div class="report-meta">
            <span>Last updated: {{ report.lastUpdated }}</span>
            <button @click="viewReport(report.id)" class="btn">View Report</button>
          </div>
        </div>
      </div>
    </div>
    
    <p>Current path: {{ $route.path }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Report {
  id: number;
  title: string;
  description: string;
  lastUpdated: string;
  icon: string;
}

const reports = ref<Report[]>([
  {
    id: 1,
    title: 'Monthly Traffic Analysis',
    description: 'Overview of website traffic patterns for the past month',
    lastUpdated: '2025-03-28',
    icon: '📈'
  },
  {
    id: 2,
    title: 'Conversion Rate Report',
    description: 'Analysis of user conversion metrics across all funnels',
    lastUpdated: '2025-03-25',
    icon: '🔄'
  },
  {
    id: 3,
    title: 'User Engagement Summary',
    description: 'Detailed breakdown of user interactions with the platform',
    lastUpdated: '2025-03-20',
    icon: '👥'
  }
]);

const viewReport = (id: number) => {
  alert(`Viewing report #${id}`);
};
</script>

<style scoped>
.reports {
  padding: 20px;
}

.report-list {
  margin-top: 20px;
}

.report-item {
  display: flex;
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.report-icon {
  font-size: 32px;
  margin-right: 20px;
  display: flex;
  align-items: center;
}

.report-content {
  flex: 1;
}

.report-content h3 {
  margin-top: 0;
  color: #42b883;
}

.report-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  font-size: 14px;
  color: #666;
}

.btn {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: #359268;
}
</style>