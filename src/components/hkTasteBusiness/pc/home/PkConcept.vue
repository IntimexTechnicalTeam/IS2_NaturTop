<template>
  <div class="news">
    <div class="conceptbox">
      <div class="logo">
        <img src="/images/pc/indexpc_29.png">
      </div>
      <div class="content">
        <h2>{{ConceptName}}</h2>
        <div class="text" v-html="ConceptContent"></div>
      </div>
      <div class="swiperbg">
          <swiper :options="swiperOptionconept" v-if="lastestContents.Contents">
            <!-- slides -->
            <swiperSlide
              v-for="(slide, index) in lastestContents.Contents"
              :key="index"
              class="swiper-container-indexMain"
            >
              <img :src="slide.Cover"/>
            </swiperSlide>
            <div
              class="swiper-button-prev swiper-button-prev-conept"
              slot="button-prev"
            ></div>
            <div
              class="swiper-button-next swiper-button-next-conept"
              slot="button-next"
            ></div>
          </swiper>
        </div>
        <div class="more">
          <a href="/cms/catDetail/40117">
            {{$t('home.shopping')}}
          </a>
        </div>
    </div>

    <!-- <ul>
      <li v-for="(n,index) in lastestContents" :key="index">
        <router-link :to="'/cms/content/'+n.Id">
          <img :src="n.Cover" class="NewsPart" />
        </router-link>
        <p class="news-date">{{n.CreateDate}}</p>
        <p class="news-title">{{n.Title}}</p>
      </li>
    </ul> -->
  </div>
</template>
<script lang="ts" scoped>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { swiper, swiperSlide } from 'vue-awesome-swiper/src';
@Component({ components: { swiper, swiperSlide } })
export default class PkNews extends Vue {
  lastestContents: any[] = [];
  ConceptName: string = '';
  ConceptContent: string = '';
  ConceptContents: any[] = [];

  swiperOptionconept: object = {
    slidesPerView: 3,
    spaceBetween: 16,
    slidesPerGroup: 3,
    // loop: true,
    // loopFillGroupWithBlank: true,
    navigation: {
      nextEl: '.swiper-button-next-conept',
      prevEl: '.swiper-button-prev-conept'
    }
  };

  getNews () {
    var cond = {
      Page: 1,
      PageSize: 3,
      catId: 40118
    };
    this.$Api.cms.getCategoryByDevice({ Key: 'concept', IsMobile: false }).then(result => {
      this.ConceptName = result.Name;
      this.ConceptContent = result.Content;
      // result.Data.forEach(function (item) {
      //   item.CreateDate = item.CreateDate.substring(
      //     0,
      //     item.CreateDate.indexOf(' ')
      //   );
      // });
      this.lastestContents = result;
      // for (var i = 0; i < result.Contents.length; i++) {
      //   this.ConceptContents = result.Contents[i];
      // }
      // console.log(this.ConceptContents, '品牌查到');
      console.log(result, '品牌理念');
    });
  }
  mounted () {
    this.getNews();
  }
}
</script>

<style scoped lang="less">
.news {
  width: 1200px;
  margin: 0 auto;
  /*height:800px;*/
  padding-bottom: 60px;
  padding-top: 80px;
  box-sizing: border-box;
  .conceptbox{
    width: 100%;
    background-color: #DC9D18;
    padding: 0 26px;
    position: relative;
    box-sizing: border-box;
    padding-bottom: 20px;
    .logo{
      width: 469px;
      margin-top: -58px;
      position: absolute;
    }
    .content{
      padding-top: 110px;
      h2{
        color: #fff;
        font-family: 'SourceHanSans-Heavy';
        font-size: 48px;
        text-align: left;
        position: relative;
        margin-bottom: 18px;
        &::after{
          content: '';
          width: 285px;
          height: 1px;
          background-color: #fff;
          position: absolute;
          bottom: -5px;
          left: 0;
        }
      }
    }
    .text{
      /deep/ p{
        color: #fff;
        font-size: 20px;
        font-family: 'SourceHanSans-Regular';
        line-height: 30px;
        text-align: justify;
      }
    }
    .swiperbg{
      width: 624px;
      position: absolute;
      top: -138px;
      right: 30px;
      .swiper-button-prev, .swiper-button-next{
        width: 36px;
        height: 36px;
        bottom: 20px;
        top: auto;
        margin-top: 0;

      }
      .swiper-button-prev-conept{
        background: url(/images/pc/prev.png) no-repeat;
        left: 20px;
      }
      .swiper-button-next-conept{
        background: url(/images/pc/next.png) no-repeat;
        right: 20px;
      }
      .swiper-container-indexMain{
        img{
          width: 100%;
          height: 360px;
          border-radius: 5px;
          object-fit: cover;
          object-position: 50% 50%;
        }
      }
    }
    .more{
      text-align: center;
      margin-top: 28px;
      display: flex;
      justify-content: center;
      a{
        // width: 140px;
        padding: 0 32px;
        height: 42px;
        // border: 1px solid #fff;
        background-color: #fff;
        border-radius: 6px;
        text-align: center;
        line-height: 42px;
        font-family: 'SourceHanSans-Regular';
        color: #DC9D18;
      }
    }
  }
}
.news h2 {
  font-size: 28px;
  color: #383838;
  text-align: center;
  margin-bottom: 65px;
}
.news ul {
  width: 1120px;
  margin: 0 auto;
  overflow: hidden;
}
.news li {
  width: 326px;
  margin-right: 71px;
  float: left;
  box-sizing: border-box;
}
.news li:nth-child(3n) {
  margin-right: 0;
}
.news li a {
  display: block;
  width: 100%;
  height: 210px;
  background-color: #ededed;
  display: flex;
  justify-content: center;
  align-items: center;
}
.news li a img {
  max-width: 100%;
  max-height: 100%;
}
.news li .news-date {
  display: inline-block;
  width: 100%;
  font-size: 16px;
  color: #7e7e7e;
  text-align: left;
  height: 48px;
  line-height: 60px;
  border-bottom: 1px solid #bdbdbd;
}
.news li .news-title {
  width: 100%;
  font-size: 16px;
  color: #424242;
  text-align: left;
  height: 40px;
  line-height: 20px;
  margin-top: 10px;
  display: flex;
  display: -webkit-box;
  display: -moz-box;
  line-clamp: 2;
  -moz-line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
}
.news .more {
  display: block;
  width: 1120px;
  margin: 0 auto;
  overflow: hidden;
  margin-top: 75px;
}
.news .more a {
  color: #7e7e7e;
  font-size: 16px;
  float: right;
}
</style>
