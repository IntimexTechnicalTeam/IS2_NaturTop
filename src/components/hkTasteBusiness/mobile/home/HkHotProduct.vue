<template>
  <div class="productBox fade-in-hot">
    <div class="TitleBg">
      <div class="innerBox">
        <h2>{{HotName}}</h2>
        <p>{{HotDesc}}</p>
      </div>
    </div>
    <div class="swiper-container swiper-container-hot">
      <div class="swiper-containerbox">
        <swiper :options="swiperOptionhot" ref="mySwiper">
          <swiperSlide v-for="(slide, index) in hotProducts" :key="index">
            <inProductWindow :item="slide" class="insProductHot"></inProductWindow>
          </swiperSlide>
        </swiper>
      </div>
      <div class="swiper-button-prev swiper-button-prev-hot" slot="button-prev"></div>
      <div class="swiper-button-next swiper-button-next-hot" slot="button-next"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import inProductWindow from '@/components/hkTasteBusiness/mobile/product/HkProductWindow.vue';
import { swiper, swiperSlide } from 'vue-awesome-swiper/src';
@Component({
  components: {
    inProductWindow,
    swiper,
    swiperSlide
  }
})
export default class PkHotProduct extends Vue {
    hotProducts:any[]=[];
    bannerImg: string = '';
    HotName: string ='';
    HotDesc: string = '';
    swiperOptionhot: object = {
      spaceBetween: 20,
      slidesPerView: 1,
      navigation: {
        nextEl: '.swiper-button-next-hot',
        prevEl: '.swiper-button-prev-hot'
      }
    };
    loadHotProducts () {
      var page = 'Home';
      this.$Api.promotion.getPromotion('Home', 4).then((result) => {
        this.HotName = result.Promotion.Name;
        this.HotDesc = result.Promotion.Desc;
        if (result.Promotion.PrmtProductList.length > 0) {
          this.hotProducts = result.Promotion.PrmtProductList;
        }
      });
    }
    HotScroll () {
      let fadeInElements = document.getElementsByClassName('fade-in-hot');
      // console.log(document.getElementsByClassName('fade-in'), '滚动');
      for (var i = 0; i < fadeInElements.length; i++) {
        let elem = fadeInElements[i] as HTMLElement;
        if (this.isElemVisible(elem)) {
          elem.style.opacity = '1';
          elem.style.transform = 'translate(0, 0)';
          // fadeInElements.splice(i, 1); // 只让它运行一次
        }
      }
      // document.removeEventListener('scroll', this.handleScroll);
    }
    isElemVisible (el) {
      var rect = el.getBoundingClientRect();
      var elemTop = rect.top + 300; // 200 = buffer
      var elemBottom = rect.bottom;
      return elemTop < window.innerHeight && elemBottom >= 0;
    }
    mounted () {
      this.loadHotProducts();
      document.addEventListener('scroll', this.HotScroll);
    }
    destroyed() {
     document.removeEventListener('scroll', this.HotScroll);
    }
}
</script>
<style>
.swiper-scrollbar {
    border-radius:0px!important;
    position: relative;
    background: #fff!important;
}
.swiper-scrollbar-drag{
      background: #666666;
      border-radius: 0px;
}
.swiper-container-horizontal > .swiper-scrollbar{
      height: 8px!important;
}
.productBox  .insProductHot img{
    width: 100%!important;
    margin: 0 auto;
    display: block;
}
</style>
<style lang="less" scoped>
.TitleBg{
  margin-bottom: 2rem;
  .innerBox{
    >h2{
      text-align: center;
      margin-bottom: 1rem;
      font-size: 3rem;
      font-family: 'SourceHanSans-Heavy';
      background: linear-gradient(90deg, #db9307, #f4de91, #db9307);
      -webkit-background-clip: text;
      color: transparent;
      display: flex;
      justify-content: center;

    }
    p{
      font-family: 'SourceHanSans-Regular';
      font-size: 1.2rem;
      color: #333333;
      text-align: center;
      word-break: break-word;
    }
  }
}
.productBox {
  // margin-top: 3rem;
}
.productBox a{
    text-decoration: none;
    color: #383838;
    display: block;
}
.productBox .ProductName{
    font-size: 1.8rem;
    width: 90%;
    margin: 0 auto;
    word-break: break-all;
    text-align: center;
    padding-bottom: 1rem;
    padding-top: 1rem;
    color:#0b0b0b;
}
.productBox .ProductPrice{
    font-size: 1.5rem;
    width: 90%;
    margin:0 auto;
    word-break: break-all;
    text-align: center;
    color:#0b0b0b;
    span{
      font-size: 1.8rem;
      color:#cd0909;
    }
}
.productBox .swiper-container {
  // height: 22rem;
  .swiper-button-prev, .swiper-button-next{
    width: 2rem;
    height: 2.5rem;
    background-size: contain !important;
  }
  .swiper-button-prev-hot{
    background: url(/images/pc/hotprev.png) no-repeat;
    left: 0;
  }
  .swiper-button-next-hot{
    background: url(/images/pc/hotnext.png) no-repeat;
    right: 0;
  }
  .swiper-containerbox{
    width: 76%;
    margin: 0 auto;
  }
}
// .productBox .swiper-wrapper {
//   height: 22rem;
// }
.productBox_title {
    font-size: 2.4rem;
    text-align: center;
    text-transform: uppercase;
    color: #0b0b0b;
    margin-bottom: 5rem;
    margin-top: 5rem;
}
.gradient {
    position: relative;
    border-bottom: 1px transparent solid;
    -o-border-image: linear-gradient(to right, #fff, #3d3d3d, #fff) 10;
    border-image: -webkit-gradient(linear, left top, right top, from(#fff), color-stop(#3d3d3d), to(#fff)) 10;
    border-image: linear-gradient(to right, #fff, #3d3d3d, #fff) 10;
}
.BannerImg{
    width: 85%;
    margin: 0 auto;
    display: block;
    border: 1px solid #000;
    border-radius: 10px;
}
.fade-in-hot {
  opacity: 0;
  transition: 1s all ease-out;
  // transform: translate(0, -30px);
  box-sizing: border-box;
}
</style>
