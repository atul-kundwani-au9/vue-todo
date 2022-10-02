<template>
  <div class="loading text-white text-3xl" v-if="loading">Loading...</div>
</template>

<script>
export default {
  computed: {
    loading() {
      return this.$store.state.loading;
    },
  },
};
</script>

<style>
.loading {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #000;
  opacity: 0.4;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
