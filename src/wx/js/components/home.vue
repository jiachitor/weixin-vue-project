<template>
<div class="page" transition="app">
  <div class="hd">
    <h1 class="page_title">Vue-WeUI</h1>
    <p class="page_desc">使用Vue封装，为微信Web服务量身设计</p>
  </div>
  <div class="bd">
    <cells type="access" class="global_navs">
      <cell v-for="item in list" :router-link="{path: item.url}">
        <img slot="header" :src="item.image" class="icon_nav">
        <p slot="body">{{item.text}}</p>
      </cell>
    </cells>
  </div>
</div>
</template>

<script>

import Cells from '../ui/weui/cells/cells.vue';  
import Cell from '../ui/weui/cells/cell.vue'; 

const icon_nav_button = './assets/images/icon_nav_button.png';
const icon_nav_cell = './assets/images/icon_nav_cell.png';
const icon_nav_toast = './assets/images/icon_nav_toast.png';
const icon_nav_dialog = './assets/images/icon_nav_dialog.png';
const icon_nav_msg = './assets/images/icon_nav_msg.png';
const icon_nav_article = './assets/images/icon_nav_article.png';
const icon_nav_actionSheet = './assets/images/icon_nav_actionSheet.png';
const icon_nav_icons = './assets/images/icon_nav_icons.png';

export default {
  data() {
    return {
      list: [{
        text: 'Button',
        url: 'button',
        image: icon_nav_button
      }, {
        text: 'Cell',
        url: 'cell',
        image: icon_nav_cell
      }, {
        text: 'Toast',
        url: 'toast',
        image: icon_nav_toast
      }, {
        text: 'Dialog',
        url: 'dialog',
        image: icon_nav_dialog
      }, {
        text: 'Progress',
        url: 'progress',
        image: icon_nav_button
      }, {
        text: 'Msg Page',
        url: 'message',
        image: icon_nav_msg
      }, {
        text: 'Article Page',
        url: 'article',
        image: icon_nav_article
      }, {
        text: 'ActionSheet',
        url: 'actionsheet',
        image: icon_nav_actionSheet
      }, {
        text: 'Icons',
        url: 'icons',
        image: icon_nav_icons
      }, {
        text: 'Jssdk',
        url: 'jssdk',
        image: icon_nav_cell
      }, ]
    };
  },

  components: {
    Cells,
    Cell
  }
}
</script>
