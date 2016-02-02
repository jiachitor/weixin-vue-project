<style lang="stylus">
  .paging{
    margin-top: 20px;
    margin-bottom: 40px;
    width: 100%;
  }

  .page-section{
    display: inline-block;
    margin-left: 20px;
    float: right;
  }

  .page-btn{
    color: #fff;
    background-color: #f44336;
  }
</style>
<template>
  <form class="paging form-inline">
    <label for="item-count form-group">show the number of goods:&nbsp;&nbsp;</label>
    <select id="item-count" name="count" class="form-control input-lg" v-model="pageCount" @change="paging">
      <option selected>20</option>
      <option>50</option>
      <option>100</option>
      <option>200</option>
    </select>
    <div class="page-section">
      <button type="button" class="page-btn btn" @click="pre()" v-el:pre>&lt;&lt; </button>
      &nbsp;&nbsp;page: {{pageIndex}}&nbsp;&nbsp;
      <button type="button" class="page-btn btn" @click="next()" v-el:next>&gt;&gt;</button>
    </div>
  </form>
</template>
<script>
  export default{
    name: 'paging',

    props: {
      resetpage: Boolean
    },

    data(){
      return {
        pageIndex: 1,
        pageCount: 20
      }
    },

    watch: {
      'resetpage': function(){
        if(this.resetpage == true){
          this.pageIndex = 1;
        }
      }
    },

    methods: {
      paging: function(){
        var num = this.pageCount,
        pageIndex = this.pageIndex,
        params = {
          count: num,
          page: pageIndex
        };

        this.$dispatch('paging-update-data', params);
      },

      pre: function(){
        if(this.pageIndex < 2){
          this.$els.pre.disabled = true;
        }else{
          this.pageIndex--;
          this.paging();
        }
      },

      next: function(){
        this.$els.pre.disabled = false;
        this.pageIndex++;
        this.paging();
      }
    }
  }
</script>