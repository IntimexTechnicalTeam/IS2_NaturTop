<template>
  <div class="productSearchSwiper" :class="{'Engap': $Storage.get('locale') === 'E'}">
    <div class="DetailTitle">
        <div v-for="(slide, index) in hotProducts" :key="index">
          <img :src="slide.Image" class="BannerImg">
        </div>
        <div class="TitleBg"><div class="innerBoxText">{{hotTitleName}}</div></div>
    </div>
    <div class="productSearchtitle">
      <h2>{{hotTitleName}}</h2>
      <p>
        {{hotDuct}}
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { swiper, swiperSlide } from 'vue-awesome-swiper/src';
@Component({ components: { swiper, swiperSlide } })
export default class PkProductListSwiper extends Vue {
    hotProducts:any[]=[];
    bannerImg: string = '';
    hotTitleName:string='';
    hotDuct: string='';
    @Prop() private TitleName!: string;
    swiperOption: object = {
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    };
    loadHotProducts () {
      this.$Api.promotion.getPromotion('PromProductList', 0).then((result) => {
        this.hotTitleName = result.Promotion.Name;
        this.hotDuct = result.Promotion.Desc;
        if (result.Promotion.BannerList.length > 0) {
          this.hotProducts = result.Promotion.BannerList;
        }
      });
    }
    mounted () {
      this.loadHotProducts();
    }
}
</script>
<style lang="less">
.productSearchSwiper  .swiper-pagination-bullet {
    width: 1rem!important;
    height: 1rem!important;
    margin-left: 5px;
}
.productSearchSwiper  .swiper-pagination-bullet-active{
    background: #f7a13a !important;
}
.productSearchSwiper   .swiper-pagination{
    margin-top: -4rem;
    transform: translateX(-50%) translateY(-50%);
    left: 50%;
}
</style>
<style lang="less" scoped>
.BannerImg{
    width: 100%;
    display: block;
}
.DetailTitle{
  width: 100%;
  display: flex;
  flex-wrap:wrap;
  position: relative;
  align-items: center;
  justify-content: center;
  img{
    width: 100%;
  }
  .TitleBg{
    top: 12rem;
    position: absolute;
    left: 5rem;
    .innerBoxText{
      text-align: center;
      font-size: 2.4rem;
      font-family: 'SourceHanSans-Heavy';
      background: linear-gradient(90deg, #db9307, #f4de91, #db9307);
      -webkit-background-clip: text;
      color: transparent;
      display: flex;
      justify-content: center;
    }
  }
  .TitleBgNo{
    position: static;
    margin: 2rem auto;
  }
}
.productSearchtitle{
  >h2{
    text-align: center;

    font-size: 2rem;
    font-family: 'SourceHanSans-Heavy';
    background: linear-gradient(90deg, #db9307, #f4de91, #db9307);
    -webkit-background-clip: text;
    color: transparent;
    display: flex;
    justify-content: center;
    letter-spacing: 2px;
  }
  p{
    font-family: 'SourceHanSans-Regular';
    font-size: 1.2rem;
    color: #666666;
    text-align: center;
    word-break: break-word;
    padding: 0 1rem !important;
    margin-top: 1rem !important;
    margin-bottom: 2rem;
  }
}
.Engap{
  .DetailTitle .TitleBg{
    top: 13rem;
    position: absolute;
    left: 3rem;
    width: 13.4rem;
    .innerBoxText{
      font-size: 1.8rem;
    }
  }

}
</style>
