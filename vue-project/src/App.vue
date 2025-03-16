<template>
  <div id="app">
    <!-- {{ message }} -->
    <!-- <element-view></element-view> -->
    <router-view></router-view>
  </div>
</template>

<script>
// import ElementView from './views/Element/ElementView.vue'
export default {
  components: {},
  data() {
    return {
      "message": "hello world"
    }
  }
}
</script>
<style></style>