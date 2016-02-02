<style>
.view {
  transition: all .5s ease;
}
.test-enter, .test-leave {
  opacity: 0;
  transform: translate3d(10px, 0, 0);
}
.v-link-active {
  color: red;
}
[v-cloak] {
  display: none;  
}
</style>

<template>
  <div class="wrapper">
    <div class="loading" v-show="authenticating"  style="color:red">
      <p >Authenticating...</p>  
    </div>
    
    <router-view  class="view" transition="test" transition-mode="out-in" keep-alive></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      authenticating: false
    }
  }
}
</script>
