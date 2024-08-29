<template>
    <div class="h-full flex flex-col">
        <div class="bg-base-200 header flex flex-row gap-4 px-4 mx-1 mb-4 rounded-xl shadow">
            <h2 class="card-title text-4xl py-4">
                Rol:
                <div class="badge badge-lg badge-primary">{{ role.title }}</div>
            </h2>
            <span class="grow"></span>
        </div>
        <form class="grow">
            <div class="bg-base-200 px-4 rounded-xl overflow-y-auto mx-1 shadow h-full">
                <!--This DIV-->
                <div class="flex flex-row gap-4 ">
                    <MCInput class="w-full" textIcon="mdi:text-account" textLabel="Descripcion">
                        <textarea v-model="description" class="input input-bordered w-full h-40" />
                    </MCInput>
                </div>
                <h3 class="mb-2 ">Permisos</h3>
                <div class="flex flex-row gap-4 ">
                    <div className="grid grid-cols-2 grid-rows-1 gap-3 overflow-y-auto w-full rounded-xl">
                        <div>
                            <h2 class="text-xl mb-2">Permisos disponibles</h2>
                            <draggable class="dragArea list-group" :list="paths"
                                :group="{ name: 'columns', pull: 'clone', put: false }" item-key="prop"
                                :clone="cloneCol">
                                <template #item="{ element }">
                                    <div class="list-group-item">
                                        <div
                                            class="my-1 p-2 bg-neutral text-neutral-content items-center rounded-lg justify-between flex flex-row">
                                            <div>
                                                <Icon icon="mdi:drag" class="text-2xl handle" />
                                            </div>
                                            <div>
                                                {{ element.title }}
                                            </div>
                                            <button class="" />
                                        </div>
                                    </div>
                                </template>
                            </draggable>
                        </div>
                        <div>
                            <h2 class="text-xl text-end mb-2">Permisos Selecionadas</h2>
                            <draggable class="dragArea list-group h-3/4" :list="configs" group="columns"
                                item-key="prop">
                                <template #item="{ element, index }">
                                    <div class="list-group-item">
                                        <div
                                            class='my-1 p-1 items-center bg-neutral text-neutral-content rounded-lg jus justify-between flex flex-row '>
                                            <div>
                                                <Icon icon="mdi:drag" class="text-2xl handle" />
                                            </div>
                                            <div>
                                                {{ element.title }}
                                            </div>
                                            <button class="btn btn-circle btn-sm my-auto btn-error mx-2 self-end"
                                                type="button" @click="removePermit(element.title)">
                                                X
                                            </button>
                                        </div>
                                    </div>
                                </template>
                            </draggable>
                        </div>
                    </div>
                </div>

            </div>
        </form>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import draggable from 'vuedraggable'
import { Icon } from '@iconify/vue';
import { ref, onMounted } from 'vue';
import MCInput from '@/components/MCInput.vue';
import { Items as paths } from '@/components/Drawer/menuItems'

const baseRoutes = [{ title: 'reportFeeback', route: '/reportFeedback' }]

const filteredRoutes = (array) => {
    const baseTitles = baseRoutes.map(route => route.title);
    return array.filter(route => !baseTitles.includes(route.title));
}

const props = defineProps({
    role: { default: null, type: Object },
});

const id = ref(0)
const description = ref('')
const configs = ref([])

const disableBTN = computed(() => {
    const comp = configs.value
    console.log(comp)
    return comp == JSON.parse(props.role.configs)
});

const cloneCol = (col) => {
    const index = configs.value.findIndex((item) => item.title === col.title)
    if (index == -1) {
        return col
    }
    configs.value.splice(index, 1)
    return col
}

const removePermit = (prop, all = false) => {
    const index = configs.value.findIndex((item) => item.title === prop)
    configs.value.splice(index, 1)
}

const getValues = async () => {
    let valuesSend = {
        id_role: id.value,
        description: description.value
    }
    const optConfigs = configs.value.map((obj) => ({
        title: obj.title,
        route: obj.route,
    }));
    for (let i = 0; i < baseRoutes.length; i++) {
        const element = baseRoutes[i];
        optConfigs.push(element)
    }
    valuesSend['configs'] = configs.value.length === 0 ? null : JSON.stringify(optConfigs);
    return valuesSend
}

defineExpose({
    getValues
})

onMounted(() => {
    id.value = props.role.id
    description.value = props.role.description
    if (props.role.configs != null) {
        configs.value = filteredRoutes(JSON.parse(props.role.configs))
    }
})

</script>