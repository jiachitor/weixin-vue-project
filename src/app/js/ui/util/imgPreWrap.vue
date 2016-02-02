<template>
  <div>
    <img-pre v-for="i in len" :src=items[i].src :fileid=items[i].fileid></img-pre>
  </div>
</template>
<style></style>
<script>
  import imgPre from './imgPre.vue';
  export default {
    props:['items','len'],

    components:{
      imgPre
    },

    methods:{
      get:function(){
        var _this = this,result = [];
        this.$children.forEach(function(vm,i){
          var val = vm.get();
          val && (result.push(val));
        });
        return result;
      }
    }
  }
</script>