<template>
  <span class="loader">Cargando </span>
</template>

<style scoped>
.loader {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 10rem;
  margin-top: 3rem;
  margin-bottom: 3rem;
}

.loader:before,
.loader:after {
  content: "";
  position: absolute;
  border-radius: 50%;
  animation: pulsOut 1.8s ease-in-out infinite;
  filter: drop-shadow(0 0 1rem oklch(var(--p)/.7));
}

.loader:before {
  width: 100%;
  padding-bottom: 100%;
  box-shadow: inset 0 0 0 1rem oklch(var(--p));
  animation-name: pulsIn;
}

.loader:after {
  width: calc(100% - 2rem);
  padding-bottom: calc(100% - 2rem);
  box-shadow: 0 0 0 0 oklch(var(--p));
}

@keyframes pulsIn {
  0% {
    box-shadow: inset 0 0 0 1rem oklch(var(--p));
    opacity: 1;
  }

  50%,
  100% {
    box-shadow: inset 0 0 0 0 oklch(var(--p));
    opacity: 0;
  }
}

@keyframes pulsOut {

  0%,
  50% {
    box-shadow: 0 0 0 0 oklch(var(--p));
    opacity: 0;
  }

  100% {
    box-shadow: 0 0 0 1rem oklch(var(--p));
    opacity: 1;
  }
}</style>