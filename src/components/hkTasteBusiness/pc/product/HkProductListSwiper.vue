<template>
  <div class="productSearchSwiper" :class="{'Engap': $Storage.get('locale') === 'E'}">
    <div class="DetailTitle">
        <div v-for="(slide, index) in hotProducts" :key="index">
          <img :src="slide.Image" class="BannerImg">
        </div>
        <div class="TitleBg"><div class="innerBoxText">{{hotTitleName}}</div></div>
    </div>
    <div class="productSearchtitle" >
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
    hotTitleName:string='';
    hotDuct: string='';
    bannerImg: string = '';
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
        console.log(result, 'dddd');
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
<style lang="less" scoped>
.productSearchSwiper{
  position: relative;
}
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
.productSearchtitle{
 h2{
      text-align: center;

      font-size: 36px;
      font-family: 'SourceHanSans-Heavy';
      // background: linear-gradient(90deg, #db9307, #f4de91, #db9307);
      // -webkit-background-clip: text;
      // color: transparent;
      color: #d9b672;
      display: flex;
      justify-content: center;
      width: 250px;
      margin: 0 auto;
      margin-bottom: 10px;
    }
   p{
      font-family: 'SourceHanSans-Regular';
      font-size: 18px;
      color: #333333;
      text-align: center;
      word-break: break-word;
      margin-bottom: 20px;
    }
}
.DetailTitle{
  width: 100%;
  // display: flex;
  // flex-wrap:wrap;
  // position: relative;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  img{
    width: 100%;
    height: 740px;
    object-fit: cover;
    object-position: 50% 50%;
    transition: all 0.3s;
  }
  .TitleBg{
    width: 1200px;
    margin: 0 auto;
    position: absolute;
    top: 210px;
    transition: all 0.3s;
    z-index: 10;
    left: 50%;
    transform: translateX(-50%);
    .innerBoxText{
        text-align: center;
        font-size: 48px;
        font-family: 'SourceHanSans-Heavy';
        background: linear-gradient(90deg, #db9307, #f4de91, #db9307);
        -webkit-background-clip: text;
        color: transparent;
        width: 310px;
        margin-left: 124px;
        transition: all 0.3s;
        // background-image: linear-gradient(90deg, #db9307, #f4de91, #db9307);
        // color: #000;
        // padding: 5px 80px;
        // display: table;
    }
  }
}
.Engap{
  .DetailTitle .TitleBg .innerBoxText{
    font-size: 36px;
    margin-left: 112px;
  }
}
@media screen and (max-width: 1440px){
  .DetailTitle{
    .TitleBg{
      top: 168px;
      .innerBoxText{
        width: 310px;
        margin-left: 214px;
        // padding: 5px 60px;
      }
    }
    img{
      height: 600px;
    }
  }
  .Engap{
  .DetailTitle .TitleBg .innerBoxText{
      font-size: 36px;
      margin-left: 214px;
    }
  }
}
@media screen and (max-width: 1366px){
  .DetailTitle{
    .TitleBg{
      top: 168px;
      .innerBoxText{
        width: 310px;
        margin-left: 214px;
        // padding: 5px 60px;
      }
    }
    img{
      height: 600px;
    }
  }
  .Engap{
  .DetailTitle .TitleBg .innerBoxText{
    font-size: 36px;
    margin-left: 214px;
  }
}
}
</style>
