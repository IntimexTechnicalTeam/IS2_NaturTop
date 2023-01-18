<template>
    <div class="indexSale fade-in-hot">
        <div class="TitleBg">
          <div class="innerBox">
            <h2>{{HotName}}</h2>
            <p>{{HotDesc}}</p>
          </div>
        </div>
        <div class="indexHotSale">
          <div class="HotSalebox">
            <swiper :options="swiperOptionHot" v-if="HotSales.length">
              <!-- slides -->
              <swiperSlide
                v-for="(val, index) in HotSales"
                :key="index"
              >
              <inProductWindow :item="val"></inProductWindow>
              </swiperSlide>
              <!-- Optional controls -->

            </swiper>
            <div
                class="swiper-button-prev swiper-button-prev-hot"
                slot="button-prev"
              ></div>
              <div
                class="swiper-button-next swiper-button-next-hot"
                slot="button-next"
              ></div>
          </div>

          </div>
    </div>
</template>
<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import inProductWindow from '@/components/hkTasteBusiness/pc/product/HkProductWindow.vue';
import { swiper, swiperSlide } from 'vue-awesome-swiper/src';
@Component({ components: { swiper, swiperSlide } })
@Component({
  components: {
    inProductWindow,
    swiper,
    swiperSlide
  }
})
export default class PkHotProduct extends Vue {
    HotSales:any[]=[];
    HotName: string ='';
    HotDesc: string = '';
    swiperOptionHot: object = {
      slidesPerView: 3,
      spaceBetween: 28,
      slidesPerGroup: 3,
      // loop: true,
      // loopFillGroupWithBlank: true,
      navigation: {
        nextEl: '.swiper-button-next-hot',
        prevEl: '.swiper-button-prev-hot'
      }
    };
    loadHotProducts () {
      var page = 'Home';
      this.$Api.promotion.getPromotion('Home', 4).then((result) => {
        console.log(result, '熱鬧產品');
        this.HotName = result.Promotion.Name;
        this.HotDesc = result.Promotion.Desc;
        if (result.Promotion.PrmtProductList.length > 0) {
          this.HotSales = result.Promotion.PrmtProductList;
        }
      });
    }
    get lang () {
      return this.$Storage.get('locale');
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
      var elemTop = rect.top + 200; // 200 = buffer
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
<style lang="less" scoped>
.TitleBg{
  margin-bottom: 28px;
  .innerBox{
    >h2{
      text-align: center;
      margin-bottom: 10px;
      font-size: 36px;
      font-family: 'SourceHanSans-Heavy';
      // background: linear-gradient(90deg, #db9307, #f4de91, #db9307);
      // -webkit-background-clip: text;
      color: #d9b672;
      display: flex;
      justify-content: center;

    }
    p{
      font-family: 'SourceHanSans-Regular';
      font-size: 18px;
      color: #333333;
      text-align: center;
      word-break: break-word;
    }
  }
}
.indexSale{
    width: 1200px;
    margin: 0 auto;
    // padding-top: 110px;

}

.indexHotSale{
    width: 1200px;
    margin: 0 auto;
    position: relative;
    .HotSalebox{
      width: 962px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
    }
    /deep/ .swiper-container{
      width: 100%;
      // .swiper-wrapper{
      //   width: 962px;
      //   margin: 0 auto;
      // }

    }
    /deep/ .productMain{
      border: 2px solid #ebd9b6;
    border-radius: 6px;
    overflow: hidden;
    }
    .swiper-button-prev, .swiper-button-next{
        width: 20px;
        height: 37px;
      }
      .swiper-button-prev-hot{
        background: url(/images/pc/hotprev.png) no-repeat;
        left: 40px;
      }
      .swiper-button-next-hot{
        background: url(/images/pc/hotnext.png) no-repeat;
        right: 40px;
      }
}
.perSale{
    box-sizing: border-box;
    width: 22%;
    float: left;
    margin-right: 4%;
    padding: 1.5%;
}
.perSale:nth-child(4n){
     margin-right: 0%!important;
}
.fade-in-hot {
  opacity: 0;
  transition: 1s all ease-out;
  // transform: translate(0, -30px);
  box-sizing: border-box;
}
</style>
