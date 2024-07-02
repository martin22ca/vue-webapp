<template>
    <div class="bg-base-200 header flex flex-row gap-4 px-4 mx-1 mb-4 rounded-xl shadow">
        <h2 class="card-title text-4xl py-4">
            Rol:
            <div class="badge badge-lg badge-primary">{{ role.title }}</div>
        </h2>
        <span class="grow"></span>
        <button class="btn btn-secondary btn-circle mt-4" @click="clearProp()">
            <Icon icon="mdi:keyboard-return" class="text-xl"></Icon>
        </button>
    </div>
    <form @submit.prevent="submit" class="">
        <div class="bg-base-200 px-4 rounded-xl overflow-y-auto mx-1 shadow" style="max-height: 80vh;"> <!--This DIV-->
            <div class="flex flex-row gap-4 ">
                <MCInput class="w-full" textIcon="mdi:text-account" textLabel="Descripcion"
                    :textError="description.errorMessage.value">
                    <textarea v-model="description.value.value" class="input input-bordered w-full h-40" />
                </MCInput>
            </div>
            <h3 class="mb-2 ">Permisos</h3>
            <div class="flex flex-row gap-4 ">
                <div className="grid grid-cols-2 grid-rows-1 gap-3 overflow-y-auto w-full rounded-xl p-2 bg-base-100"
                    style="max-height: 40vh;">
                    <div>
                        <h2 class="text-xl mb-2">Permisos disponibles</h2>
                        <draggable class="dragArea list-group" :list="paths"
                            :group="{ name: 'columns', pull: 'clone', put: false }" item-key="prop" :clone="cloneCol">
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
                        <draggable class="dragArea list-group h-3/4" :list="configs" group="columns" item-key="prop">
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
            <div class="flex flex-row gap-4 ">
                <button class="btn btn-primary m-auto my-2 mr-0 " type="submit" :disabled="disableBTN">
                    Guardar <Icon icon="mdi:content-save" class="text-xl"></Icon>
                </button>
            </div>
        </div>
    </form>
</template>

<script setup>
import { computed } from 'vue';
import draggable from 'vuedraggable'
import { Icon } from '@iconify/vue';
import { ref, onMounted } from 'vue';
import MCInput from '@/components/MCInput.vue';
import * as Yup from "yup";
import { updateRole } from '@/services/roles'
import { useField, useForm } from 'vee-validate'
import { Items as paths } from '@/components/Drawer/menuItems'

const baseRoutes = [{ title: 'reportFeeback', route: '/report' }]


const filteredRoutes = (array) => {
    const baseTitles = baseRoutes.map(route => route.title);
    return array.filter(route => !baseTitles.includes(route.title));
}

const props = defineProps({
    role: { default: null, type: Object },
    clearProp: { default: null, type: Function }
});

const createValidationSchema = () => {
    const baseSchema = {
        description: Yup.string(),
        configs: Yup.string().nullable(),
    };
    return Yup.object().shape(baseSchema);
};

const validationSchema = createValidationSchema()

const { handleSubmit, handleReset, errors } = useForm({
    validationSchema,
    validateOnMount: false
});

const id = ref(0)
const description = useField('description');
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


const submit = handleSubmit(async (values) => {
    let valuesSend = {}
    for (const i in values) {
        if (Object.hasOwnProperty.call(values, i)) {
            valuesSend[i] = values[i];
        }
    }
    valuesSend['id_role'] = id.value
    const optConfigs = configs.value.map((obj) => ({
        title: obj.title,
        route: obj.route,
    }));

    for (let i = 0; i < baseRoutes.length; i++) {
        const element = baseRoutes[i];
        optConfigs.push(element)
    }

    valuesSend['configs'] = configs.value.length === 0 ? null : JSON.stringify(optConfigs);
    console.log(optConfigs)
    const { data } = await updateRole(valuesSend)
    console.log(data)
    props.clearProp()
});

onMounted(() => {
    id.value = props.role.id
    description.value.value = props.role.description
    if (props.role.configs != null) {
        configs.value = filteredRoutes(JSON.parse(props.role.configs))
    }
})

</script>