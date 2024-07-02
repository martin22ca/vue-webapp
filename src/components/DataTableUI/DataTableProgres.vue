<template>
    <div class="flex-col">
        <p class="text-center">{{ this.model[this.prop] }} %</p>
        <progress :class="colorClass" :value="this.model[this.prop]" :max="100"></progress>
    </div>
</template>
  
<script>

export default {
    props: ['model', 'prop'],
    computed: {
        colorClass() {
            const num = parseFloat(this.model[this.prop])
            let color = 'progress progress-neutral'
            if (num != null) {
                if (num < 50) {
                    color = 'progress progress-warning'
                } else if (num > 100) {
                    color = 'progress progress-error'
                } else color = 'progress progress-success'
            } else {
                color = 'progress progress-secondary'
            } 
            return color
        }
    },

};
</script>