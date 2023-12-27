<template>
    <div :class="'flex-col'">
        <p :class="'text-center'">{{ this.model[this.prop] }} %</p>
        <progress :class="colorClass" :value="this.model[this.prop]" :max="100"></progress>
    </div>
</template>
  
<script>

export default {
    props: ['model', 'prop'],
    computed: {
        colorClass() {
            const num = parseFloat(this.model[this.prop])
            let color = 'neutral'
            if (num != null) {
                if (num < 50) {
                    color = 'warning'
                } else if (num > 100) {
                    color = 'error'
                } else color = 'success'
            } else {
                color = 'secondary'
            }
            return 'progress progress-' + color
        }
    },

};
</script>