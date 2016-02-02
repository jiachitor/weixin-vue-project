<template>
  <div id="wrapper" class="wrapper container-fluid">
    <router-view
      keep-alive
      transition="slide"
      v-bind:app-config="appConfig">
    </router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      appConfig: {
        login:false
      }
    }
  },

  /*生命周期*/
  created () {
    
  },

  beforeCompile () {
    
  },

  compiled () {
    
  },

  compiled () {
    
  },

  ready () {
    
  },

  beforeDestroy () {
    
  },

  destroyed () {
    
  },


}
</script>
