<template>
    <defaultLayout>
        <div class="grid grid-cols-3 grid-rows-6 gap-4 h-full m-2" >
            <div class="bg-base-200 p-4 shadow-sm">1: Statistics</div>
            <div class="col-start-1 row-start-2 bg-base-200 p-4 shadow-sm">2: User Info</div>
            <div class="col-start-2 row-start-1 bg-base-200 p-4 shadow-sm">
                <h2 class="card-title text-4xl">
                    Bienvenido
                </h2>
                <h3 class="font-mono">
                    {{ name }}
                </h3>
            </div>
            <div class="col-start-2 row-start-2 bg-base-200 p-4 shadow-sm">
                <Countdown :targetDate="'2024-07-02'" />
            </div>
            <div class="row-span-2 col-start-1 row-start-5 bg-base-200 p-4 shadow-sm">
                7: Recent Activities
            </div>
            <div class="row-span-2 col-start-2 row-start-5 bg-base-200 p-4 shadow-sm">
                8: Notifications
            </div>
            <div class="row-span-3 col-start-3 row-start-4 bg-base-200 p-4 shadow-sm">
                <BarChart />
            </div>
            <div class="row-span-3 col-start-3 row-start-1 bg-base-200 p-4 shadow-sm">
                <PieChart />
            </div>
            <div class="col-span-2 row-span-2 col-start-1 row-start-3 bg-base-200 p-4 shadow-sm ">
            </div>
        </div>
    </defaultLayout>
</template>

<script setup>
import Countdown from '@/components/Countdown.vue'
import PieChart from '@/components/Graphs/PieChart.vue'
import BarChart from '@/components/Graphs/BarChart.vue'
import defaultLayout from '@/layouts/defaultLayout.vue';
import { ref, onMounted } from 'vue';
import { userDataStore } from '@/store/userStore'

const store = userDataStore()

const name = ref('')
const user_name = ref('')

onMounted(() => {
    name.value = store.name
})
</script>


<style scoped>
.shadow-sm {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
</style>