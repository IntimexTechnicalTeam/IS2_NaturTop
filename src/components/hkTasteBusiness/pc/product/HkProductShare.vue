<template>
  <div class="productshare_icon_warpper">
    <p>Share</p>
    <a @click="whatsApp" class="xq-whatsapp" data-action="share/whatsapp/share"
      ><img src="/images/mobile/productDetail_03.png"
    /></a>
    <a
      onclick="window.open('http://www.facebook.com/share.php?u=' + window.location.href+'&t=' + document.title);"
      ><img src="/images/mobile/productDetail_02.png"
    /></a>
    <a
      onclick="window.open('https://lineit.line.me/share/ui?url='+window.location.href);"
      ><img src="/images/mobile/productDetail_04.png"
    /></a>
  </div>
</template>
<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
@Component
export default class HkProductShare extends Vue {
  whatsApp() {
    var u = location.href;
    var t = document.title;
    window.open(
      'https://api.whatsapp.com/send?text=' +
        encodeURIComponent(t) +
        encodeURIComponent('\n\n' + u),
      '_blank'
    );
  }
}
</script>
<style lang="less" scoped>
.productshare_icon_warpper {
  text-align: right;
  margin-top: 44px;
      display: flex;
    align-items: center;
    justify-content: right;
    border-bottom: 1px solid #5c5c5c;
    padding-bottom: 10px;
}
.productshare_icon_warpper a {
  display: inline-block;
  margin-left: 14px;
}
.productshare_icon_warpper img {
  width: 40px;
  display: block;
  cursor: pointer;
}
</style>
