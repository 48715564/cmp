<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
html, body, #app, .main{
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
.main {
  overflow-y: auto;
  box-shadow: 0 4px 30px 0 rgba(223,225,230,0.5);
  background-color: #F8FAFF;
}
</style>
