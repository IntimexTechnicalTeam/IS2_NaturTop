<template>
  <transition name="slide-fade">
    <div class="FixedHeader" v-show="showFixedHeader">
        <DefaultHeader v-if="!$slots.default" :showInFixed="true" />
        <slot></slot>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
    DefaultHeader: () => import('@/components/business/pc/header/layout/DefaultHeader.vue')
  }
})
export default class FixedHeader extends Vue {
  // 是否處於顯示固定頭部狀態
  get showFixedHeader () {
    return this.$store.state.showFixedHeader;
  }

  created () {
    // 添加滾動判斷顯示
    addEventListener('scroll', () => {
      var _this = this;

      let headerHeight = (document.getElementById('header') as HTMLElement).clientHeight;
      let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

      if (scrollTop >= headerHeight) {
        this.$store.dispatch('setShowFixedHeader', true);
      } else {
        this.$store.dispatch('setShowFixedHeader', false);
      }
    }, false);
  }
}
</script>

<style scoped lang="less">
.FixedHeader {
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  // box-shadow: 0 0 10px 0 #d4d5d1;
  /deep/ .headerBg{
    background-color: #d9b672;
    box-shadow: 0 0 10px #333333;
    .headerTop{
      padding-top: 10px;
      .search-box{
        border: 1px solid #fff;
      }
      .langSwitch .langList .curLang{
        border: 1px solid #fff;
        color: #fff;
        p{
          color: #fff;
        }
      }
      .main-code p{
        border: 1px solid #fff;
        color: #fff;
        span{
          color: #fff;
        }
      }
      .searchBtn{
        background: url('/images/pc/pcindex_03w.png') no-repeat center center;
      }
      .langSwitch .langList .langOne .langArrow{
        background: url(/images/pc/l-BlueArroww.png) right center no-repeat;
      }
      .main-code ul li{
        p{
          border: 1px solid #fff;
          border-bottom: 1px solid #999999;
          border-radius: 0;
          color: #666;
          border-top: 0;

        }
        &:last-child p{
            border-bottom: none;
            border-bottom-left-radius: 3px;
            border-bottom-right-radius: 3px;
          }
      }
      .member-icon{
        background: url('/images/pc/pcindex_06w.png') no-repeat center center;
      }
      .cart-icon{
        background: url("/images/pc/pcindex_07w.png") no-repeat center center;
      }
    }
    .header_menu{
      margin-top: 0 !important;
    }
  }
  /deep/ .langSwitch .langList .langSelect {
    p{
      border: 1px solid #fff;
      border-bottom: 1px solid #999999;
      border-radius: 0;
      &:last-child{
        border-bottom: none;
      }
    }
  }
}

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  // transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  transition: all .3s ease;
}
.slide-fade-enter
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(-100%);
}

.slide-fade-leave-to {
  opacity: 0;
}
</style>
