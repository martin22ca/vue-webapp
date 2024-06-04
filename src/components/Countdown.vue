<template>
    <div class="grid grid-flow-col gap-5 text-center auto-cols-max">
      <div class="flex flex-col">
        <span class="countdown font-mono text-5xl">
          <span :style="{ '--value':  days}"></span>
        </span>
        days
      </div>
      <div class="flex flex-col">
        <span class="countdown font-mono text-5xl">
          <span :style="{ '--value': hours }"></span>
        </span>
        hours
      </div>
      <div class="flex flex-col">
        <span class="countdown font-mono text-5xl">
          <span :style="{ '--value': minutes }"></span>
        </span>
        min
      </div>
      <div class="flex flex-col">
        <span class="countdown font-mono text-5xl">
          <span :style="{ '--value': seconds }"></span>
        </span>
        sec
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      targetDate: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        intervalId: null
      };
    },
    mounted() {
      this.calculateTime();
      this.intervalId = setInterval(this.calculateTime, 1000);
      console.log(this.days)
    },
    beforeUnmount() {
      clearInterval(this.intervalId);
    },
    methods: {
      calculateTime() {
        const target = new Date(this.targetDate).getTime();
        const now = new Date().getTime();
        const difference = target - now;
  
        if (difference > 0) {
          this.days = Math.floor(difference / (1000 * 60 * 60 * 24));
          this.hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          this.minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          this.seconds = Math.floor((difference % (1000 * 60)) / 1000);
        } else {
          this.days = 0;
          this.hours = 0;
          this.minutes = 0;
          this.seconds = 0;
          clearInterval(this.intervalId);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .countdown span {
    display: inline-block;
    width: 2ch;
    text-align: center;
  }
  </style>
  