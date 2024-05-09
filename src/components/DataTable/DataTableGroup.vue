<template>
  <div :class="colorClass" class="text-center mt-4 rounded-xl">
    {{ value }}
  </div>
</template>


<script>
export default {
  props: ['model', 'prop'],
  computed: {
    colorClass() {
      if (this.model[this.prop] == null) {
        return 'bg-error';
      }
      const group = parseInt(this.model[this.prop]);
      return group === 61 ? 'bg-primary' : 'bg-warning';
    },
    value() {
      return this.model[this.prop] != null ? this.model[this.prop] : '!!';
    }
  }
};
</script>
