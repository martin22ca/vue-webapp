<template>
    <button class="btn btn-primary " v-on:click="iAmClicked">You clicked me {{ count }} times.</button>
</template>
<script>
export default {
    // access any cell properties here
    props: ["rowIndex", "prop"],
    name: "myVue",
    data() {
        return {
            count: 0,
        };
    },
    methods: {
        iAmClicked(e) {
            this.count++;
        },
    }
};
</script>
  