<template>
  <div>
    <h2>Line Chart</h2>
    <Line :chart-data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const chartData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [{
    label: 'Data One',
    backgroundColor: '#f87979',
    data: [40, 39, 10, 40, 39, 80],
  },],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
},

</script>
