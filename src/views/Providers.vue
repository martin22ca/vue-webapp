<template>
    <defaultLayout>
        <div class="bg-base-300 h-auto">
            <div class="text-sm breadcrumbs p-2">
                <ul>
                    <li><a>Home</a></li>
                    <li><a>Prestadores</a></li>
                </ul>
            </div>
            <div>
                <h1 class="text-2xl p-2">Prestadores</h1>
            </div>
            <DataTable :rows="providers" :cols="headers" :loading="loading" @updateFilters="updateFilters"></DataTable>
        </div>
    </defaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DataTable from '@/components/DataTable/DataTable.vue';
import defaultLayout from '@/layouts/defaultLayout.vue';
import { getProviders } from '@/services/providers'

const headers = [
    { prop: 'id', name: 'ID', editor: 'number', pin: 'colPinStart', autoSize: true, valType: 'number', editable: false },
    { prop: 'coordinator_number', name: 'Coordinador', autoSize: true, valType: 'number', editable: false },
    { prop: 'cuit', name: 'CUIT', valType: 'string' },
    { prop: 'business_name', name: 'Ubicacion', editor: 'text', size: 200, valType: 'string', editable: false },
    { prop: 'business_location', name: 'Locaclidad', size: 200, valType: 'string', editable: false ,filter:'string'},
    { prop: 'sancor_zone', name: 'Zona Sancor', size: 200, valType: 'string', editable: false },
    { prop: 'observation', name: 'Observacion', valType: 'string', editable: false },
    { prop: 'id_priority', name: 'Prioridad', valType: 'number', editable: false },
    { prop: 'id_pecularity', name: 'Peculariedad', valType: 'number' },
]

let filters = []
const providers = ref([])
const loading = ref(true)

const fetchResources = async () => {
    const { data } = await getProviders(filters)
    providers.value = data
    setTimeout(() => {
        loading.value = false
    }, 500)
}

onMounted(async () => {
    fetchResources()
})

const updateFilters = (appliedFilters) => {
    filters = appliedFilters;
    fetchResources()
}

</script>