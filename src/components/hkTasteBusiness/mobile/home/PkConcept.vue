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
            <div class="swiper-pagination swiper-pagination-conept" slot="pagination"></div>
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
    slidesPerView: 1,
    spaceBetween: 16,
    slidesPerGroup: 1,
    // loop: true,
    // loopFillGroupWithBlank: true,
    pagination: {
      el: '.swiper-pagination.swiper-pagination-conept',
      clickable: true
    }
  };

  getNews () {
    var cond = {
      Page: 1,
      PageSize: 3,
      catId: 40118
    };
    this.$Api.cms.getCategoryByDevice({ Key: 'concept', IsMobile: true }).then(result => {
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
  ConceptScroll () {
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
    this.getNews();
    // document.addEventListener('scroll', this.ConceptScroll);
  }
  destroyed () {
    // document.removeEventListener('scroll', this.ConceptScroll);
  }
}
</script>

<style scoped lang="less">
.news {
  width: 90%;
  margin: 0 auto;
  /*height:800px;*/
  padding-bottom: 2rem;
  padding-top: 5rem;
  box-sizing: border-box;
  .conceptbox{
    width: 100%;
    background-color: #DC9D18;
    padding: 0 1.5rem;
    position: relative;
    box-sizing: border-box;
    padding-bottom: 10rem;
    margin-bottom: 14rem;
    .logo{
      width: 80%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -2.8rem;
      img{
        width: 100%;
        display: block;
      }
    }
    .content{
      padding-top: 5rem;
      h2{
        color: #fff;
        font-family: 'SourceHanSans-Heavy';
        font-size: 3rem;
        text-align: left;
        position: relative;
        margin-bottom: 2rem;
        &::after{
          content: '';
          width: 90%;
          height: 1px;
          background-color: #fff;
          position: absolute;
          bottom: -10px;
          left: 0;
        }
      }
    }
    .text{
      /deep/ p{
        color: #fff;
        font-size: 1.4rem;
        font-family: 'SourceHanSans-Regular';
        line-height: 2rem;
        text-align: justify;
      }
    }
    .swiperbg{
      width: 90%;
      position: absolute;
      bottom: -13rem;
      left: 50%;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
      /deep/ .swiper-pagination-bullet{
        width: 14px;
        height: 14px;
        background-color: #fff;
        opacity: 1;
      }
      /deep/ .swiper-pagination-bullet-active{
        background-color: #cda975;
      }
      .swiper-container-indexMain{
        img{
          width: 100%;
          height: 20rem;
          border-radius: 5px;
          object-fit: cover;
          object-position: 50% 50%;
        }
      }
    }
    .more{
      text-align: center;
      margin-top: 2rem;
      display: flex;
      justify-content: center;
      a{
        // width: 140px;
        padding: 0 2rem;
        height: 3rem;
        // border: 1px solid #fff;
        background-color: #fff;
        border-radius: 6px;
        text-align: center;
        line-height: 3rem;
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
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  margin-top: 3rem;
}
.news .more a {
  color: #7e7e7e;
  font-size: 1.4rem;
  float: right;
}
.fade-in-hot {
  // background-color: #2ecc71;
  // height: 500px;
  // margin-bottom: 50px;
  opacity: 0;
  transition: 1s all ease-out;
  // transform: translate(0, -30px);
  box-sizing: border-box;
  // padding: 20px;
  display: inline-block;
}
</style>
