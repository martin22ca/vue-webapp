<template>
    <div class="text-center">
        <Icon :icon="this.model[this.prop] ? 'mdi:checkbox-marked' : 'mdi:checkbox-blank'"
            :class="'text-4xl m-auto text-'+ color">
        </Icon>
    </div>
</template>
  
<script>
import { Icon } from '@iconify/vue';

export default {
  props: ['model', 'prop'],
  components: {
    Icon
  },
  computed: {
    color() {
      const firstLetter = this.prop.charAt(0).toLowerCase();
      const firstHalfAlphabet = 'abcdefghijklm';
      
      return firstHalfAlphabet.includes(firstLetter) ? 'primary' : 'secondary';
    }
  }
};
</script>