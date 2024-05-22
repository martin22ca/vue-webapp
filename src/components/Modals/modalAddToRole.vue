<template>
    <MCModal :modalOpen="props.modalOpen" modalTitle="Modificar Usuario/s" :toggleModal="() => { props.toggleModal() }">
        <div style="height: 60vh;" class="flex ">
            <Autocomplete :items="availableUsers" textProp="user_name" keyProp="id" :addval="addVal"
                class="mt-8 basis-1/2" :is-open-on-mount="true">
            </Autocomplete>
            <div class="basis-1/2">
                <div class="flex justify-center items-center ">
                    <div class="w-full p-8 rounded-lg ">
                        <h3 class="mb-2">Usuarios</h3>
                        <ul style="max-height: 40vh; overflow-y: auto">
                            <li v-for="selected in selectedItems" :key="selected.id"
                                class="py-2 px-4 mb-2 rounded-md bg-neutral text-white flex justify-between items-center">
                                <div>
                                    <p>{{ selected.last_name }}, {{ selected.first_name }}</p>
                                </div>
                                <button class="btn btn-sm btn-error btn-circle" @click="removeVal(selected)">✕</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-actions justify-end">
            <button class="btn btn-primary " type="submit" :disabled="!checkChange"
                @click="saveChanges()">Guardar</button>
        </div>
    </MCModal>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import MCModal from './MCModal.vue';
import { getUsers } from '@/services/users';
import Autocomplete from '@/components/Autocomplete.vue';
import { updateUserRoles } from '@/services/users';

const props = defineProps({
    modalOpen: { default: false, type: Boolean },
    toggleModal: { default: null, type: Function },
    existingUsers: { required: true, type: Array },
    idRole: { required: true, type: Number }
});

const users = ref([])
const allUsers = ref([])
const selectedItems = ref([]);

const addVal = (val) => {
    if (!selectedItems.value.some(item => item.id === val.id)) {
        selectedItems.value.push(val);
    }
}

const removeVal = (val) => {
    const index = selectedItems.value.findIndex(item => item.id === val.id);
    if (index !== -1) {
        selectedItems.value.splice(index, 1);
    }
};

const availableUsers = computed(() => {
    const selectedUserIds = selectedItems.value.map(user => user.id);

    return users.value.filter(user =>
        !selectedUserIds.includes(user.id)
    );
});

const saveChanges = async () => {
    const sentData = {
        'users_ids':selectedItems.value.map(user => user.id),
        'id_role':props.idRole
    } 

    const { data } = await updateUserRoles(sentData)
    props.toggleModal()
    console.log(data)
}

const checkChange = computed(() => {
    const existingUserIds = new Set(props.existingUsers.map(user => user.id));
    const selectedUserIds = new Set(selectedItems.value.map(user => user.id));

    if (existingUserIds.size !== selectedUserIds.size) {
        return true; // There was a change
    }

    for (const id of existingUserIds) {
        if (!selectedUserIds.has(id)) {
            return true; // There was a change
        }
    }

    return false; // No change
});

const fetchResources = async () => {
    const { data } = await getUsers([])
    console.log(data)
    users.value = [...data]
    allUsers.value = [...data]
}

onMounted(async () => {
    props.existingUsers.forEach(element => {
        selectedItems.value.push(element)
    });
    fetchResources()
})


</script>