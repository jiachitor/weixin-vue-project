<style lang="stylus">
.img-pre-wrap{
    display: inline-block;
    margin-right: 16px;
    position: relative;

  .img-detail-placeholder{
    position: relative;
    width: 136px;
    height: 106px;
    border: 1px solid rgba(0,0,0, .12);
    background-image: url(../../../assets/images/add_normal.png);
    background-size: cover;
    background-repeat: no-repeat;
    &:active{
      background-image: url(../../../assets/images/add_click.png);
    }

    img{
      position: absolute;
      top: 0;
      left: 0;
    }

    .upload-img-btn{
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
    }
  }

  span{
    position:absolute;
    bottom: 0;
    left: 0;
    width: 22px;
    height: 20px;
    background-image: url(../../../assets/images/delete_normal.png);
    &:active{
      background-image: url(../../../assets/images/delete_click.png);
    }
  }
}
</style>

<template>
  <div class="img-pre-wrap">
    <div class="img-detail-placeholder">
      <img :src="src" width=136 height=106>
      <input type="file" class="upload-img-btn" multiple accept="image/gif,image/png,image/jpeg" @change="change($event)" v-el:file/>
    </div>
    <span class="del" @click="del"></span>
  </div>
</template>

<script>
  export default {
    props:['src','fileid'],

    methods:{
      change:function(e){
        var el = e.target,file = el.files[0],reader,_this = this;
        if(file){
          reader = new FileReader();
          reader.onload = function(evt){
            _this.src = evt.target.result;
          }
          reader.readAsDataURL(el.files[0]);
        }
      },

      del:function(){
        this.src = '';
        this.$els.file.value = '';
      },

      get:function(){
        var file = this.$els.file.files[0],hasExits = typeof this.fileid !== 'undefined';
        if(hasExits && file){
          return {
            id:this.fileid,
            file : file
          };
        }
        if(file && !hasExits){
          return {
            file:file
          };
        }
        if(!file && hasExits){
          return{
            id: this.fileid
          };
        }
        return null;
      }
    }
  }
</script>