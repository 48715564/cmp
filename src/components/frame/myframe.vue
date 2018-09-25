<template>
  <div class="main">
    <iframe :src="src" frameborder="0"></iframe>
  </div>
</template>
<script>
export default {
  name: 'myframe',
  props: ['src'],
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  background-color: #fff;
  border-top-left-radius: 10px;
  iframe {
    width: 100%;
    height: calc(100% - 10px);
  }
}
</style>
