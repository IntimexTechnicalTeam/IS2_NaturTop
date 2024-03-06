<template>
  <transition name="fade">
      <div v-if="show" id="level1Layer" @scroll.prevent @mousewheel.prevent>
        <div v-if="userAgent==='pc' && !pcBuilding"></div>
        <div ref="layerbody" class="layer_body animate__animated" :class="{'layer_body_mobile':userAgent==='mobile'}"> </div>
      </div>
  </transition>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Loading } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { FrontE } from '@/sdk/common/SysConst';
import lang from '@/lang';
import storage from '@/sdk/common/Storage';
@Component
export default class InsLayer extends Vue {
  public show:boolean = false;
  created () {
  }
  get pcBuilding () {
    return FrontE.pcBuilding;
  }
  mounted () {
    if (this.$refs.layerbody) {
      Loading.service({
        target: this.$refs.layerbody as any,
        text: '',
        fullscreen: true,
        spinner: 'el-loading-spinner2',
        customClass: 'IconSize'
      });
    }
  }
  updated () {
    if (this.$refs.layerbody) {
      Loading.service({
        target: this.$refs.layerbody as any,
        text: '',
        fullscreen: true,
        spinner: 'el-loading-spinner2',
        customClass: 'IconSize'
      });
    }
  }
  public hidden () {
    this.show = false;
    document.body.style.overflowY = 'auto';
  }
  public showL () {
    this.show = true;
    setTimeout(() => { window.scrollTo(0, 0); document.body.style.overflowY = 'hidden'; }, 50);
  }
}
</script>
<style lang="less">
// .IconSize{
//   .el-icon-loading{
//    font-size: 30px;
//   }
// }
.el-loading-mask{
  background: #fff!important;
}
.IconSize{
  background: #fff!important;
  // .el-icon-loading{
  //  font-size: 30px;
  // }
  .el-loading-spinner2 {
    background-image: url('/images/pc/pcindex_09.png');
    background-repeat: no-repeat;
    background-size: contain;
    height: 200px;
    width: 200px;
    background-position: center;
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%,-50%);
}
}
@media (min-width:320px)and(max-width:640px){
  .IconSize .el-loading-spinner2{
    height: 150px;
    width: 150px;
    background-image: url('/images/pc/pcindex_09.png');
    background-repeat: no-repeat;
    background-size: contain;
  }
}
</style>
<style lang="less" scoped>
/* body::-webkit-scrollbar{
    display: none;
} */
#level1Layer{
  z-index: 99999;
  min-height: 100vh;
  width: 100vw;
  position: absolute;
}
.layer_header{
  height: 115px;
}
.layer_body{
  background:rgba(255,255,255,.6);
  height: 100vh;
}
.layer_body_mobile{
  height: 100vh !important;
}
.fade-enter-active{
  transition: opacity 0s;
}
.fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
