<template>
    <div class="text-center">
        <Icon :icon="this.model[this.prop] ? 'mdi:checkbox-marked' : 'mdi:checkbox-blank'"
            class="text-4xl m-auto text-primary">
        </Icon>
    </div>
</template>
  
<script>
import { Icon } from '@iconify/vue';

export default {
    props: ['model', 'prop'],
    components: {
        Icon
    }

};
</script>