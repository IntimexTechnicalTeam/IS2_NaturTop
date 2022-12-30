<template>
  <div id="container" class="catDetail" :class="{'Engap': $Storage.get('locale') === 'E'}">
    <div class="DetailTitle">
      <div v-if="cmsCategory.ImagePath">
        <img :src="cmsCategory.ImagePath" v-if="cmsCategory.ImagePath">
        <div class="TitleBg">
          <div class="innerBoxText">{{cmsCategory.Name}}</div>
        </div>
      </div>
      <div v-else>
        <div class="TitleBg TitleBgNo">
          <div class="innerBoxText">{{cmsCategory.Name}}</div>
        </div>
      </div>
    </div>

    <div class="catContent">
        <div class="TitleBg" v-if="catKey == 'pathway'">
            <div class="innerBox">
                <h2>{{PlatforTitle}}</h2>
                <p>{{PlatforDuct}}</p>
            </div>
        </div>
        <template v-if="cmsCategory.PageStyle === '0' || cmsCategory.PageStyle === '1'">
          <div class="PageStyle1" v-if="catKey == 'concept'">
            <div class="content">
              <h2>{{cmsCategory.Name}}</h2>
              <div class="logo">
                <img src="/images/pc/conceptlogo.png" alt="">
              </div>
              <div v-html="cmsCategory.Content" class="layer"></div>
            </div>
            <div class="swiperbg">
              <div class="swiperlist">
                <swiper :options="swiperOptionPageStyle" v-if="cmsCategory.Contents">
                  <!-- slides -->
                  <swiperSlide
                    v-for="(slide, index) in cmsCategory.Contents"
                    :key="index"
                    class="swiper-container-indexMain"
                  >
                    <img :src="slide.Cover"/>
                  </swiperSlide>

                </swiper>
              </div>
              <div
                  class="swiper-button-prev swiper-button-prev-PageStyle"
                  slot="button-prev"
                ></div>
                <div
                  class="swiper-button-next swiper-button-next-PageStyle"
                  slot="button-next"
                ></div>
            </div>
          </div>
          <div v-else>
            <div v-html="cmsCategory.Content" class="layer"></div>
          </div>
        </template>

        <ins-cat-layout2 :catData="cmsCatTree" :cmsData="contentList" @changeCatSelect="changeCatSelect" v-if="cmsCategory.PageStyle === '2'" />

        <ins-cat-layout3 :cmsData="contentList" v-if="cmsCategory.PageStyle === '3'" />

        <ins-cat-layout4 :cmsData="contentList" :cmsCatId="CatCatId" :pager="pager" v-if="cmsCategory.PageStyle === '4'" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { swiper, swiperSlide } from 'vue-awesome-swiper/src';
@Component({
  components: {
    // InsBanner: () => import('@/components/base/InsBanner.vue'),
    InsCatLayout2: () => import('@/components/business/pc/cms/InsCatLayout2.vue'),
    InsCatLayout3: () => import('@/components/business/pc/cms/InsCatLayout3.vue'),
    InsCatLayout4: () => import('@/components/business/pc/cms/InsCatLayout4.vue'),
    swiper,
    swiperSlide
  }
})
export default class insNews extends Vue {
    cmsCategory: object = {}; // cms下单个目录的信息
    cmsCatTree: object[] = []; // cms目录
    contentList: object[] = []; // cms内容列表
    catKey: string = '';
    catId: number = 0; // Tree点击获取内容列表的目录id
    PageStyle: string = '0'; // catDetail页面类型
    pager: any = {
      currentPage: 1, // 当前页
      pageSize: 12, // 每页显示条目个数
      totalRecord: 0 // 总条目数
    }
    CatCatId: string ='';
    PlatforTitle: string = '';
    PlatforDuct: string = '';
    swiperOptionPageStyle: object = {
    slidesPerView: 3,
    spaceBetween: 48,
    slidesPerGroup: 3,
    // loop: true,
    // loopFillGroupWithBlank: true,
    navigation: {
      nextEl: '.swiper-button-next-PageStyle',
      prevEl: '.swiper-button-prev-PageStyle'
    }
  };

    // 根据设备类型获取CMSCategory信息
    getCategoryByDevice () {
      this.$Api.cms.getCategoryByDevice({ CatId: this.id, IsMobile: false }).then((result) => {
        this.cmsCategory = result;
        this.PageStyle = result.PageStyle;
        this.catKey = result.Key;
        this.PlatforTitle = result.Name;
        this.PlatforDuct = result.Description;
        console.log(result, 'style1');
        switch (result.PageStyle) {
            case '2':
              this.getCategoryTree();
              break;
            case '3':
              this.getSubCatContents();
              break;
            case '4':
              this.getContentsByCatId();
              break;
        }

        this.$nextTick(() => {
          if (result.Name) document.title = result.Name;
          (document.getElementsByName('keywords')[0] as any).content = result.SeoKeyword;
          (document.getElementsByName('description')[0] as any).content = result.SeoDesc;
          (document.getElementsByName('twitter:description')[0] as any).content = result.SeoDesc;
          (document.getElementsByName('twitter:title')[0] as any).content = result.Name;
        });
      }).catch((error) => {
        console.log(error, 'error');
        this.$message({
          message: error,
          type: 'error'
        });
      });
    }

    // 获取cms该id下所有的Category
    getCategoryTree () {
      this.$Api.cms.getCategoryTree({ id: this.id }).then((result) => {
        console.log(result, '获取Cat');
        if (result && result.length) {
          this.cmsCatTree = result;
          this.catId = result[0].Id;
          this.getContentsByCatId();
        } else {
          this.getContentsByCatId();
        }
      });
    }

    // 获取cms该id下所有的cms
    getContentsByCatId () {
      let catId = this.catId || this.id;
      let _this = this;
      this.$Api.cms.getContentsByCatId(catId, this.pager.currentPage, this.pager.pageSize).then((result) => {
        console.log(result, '获取CMS目录');
        this.contentList = result.Data;

        result.Data.forEach(function (i) {
          var newDate = new Date(i.CreateDate.replace(/-/g, '/'));
          i.CreateDate = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate();

          _this.CatCatId = i.CatId;
        });
        console.log(_this.CatCatId, '_this.CatCatId');
        this.pager.totalRecord = result.TotalRecord;
      });
    }

    // 获取 Category 和所有 SubCategory 的 cms 列表
    getSubCatContents () {
      this.$Api.cms.getSubCatContents({ CatId: this.id, IsMobile: false }).then((result) => {
        console.log(result, ' 获取 Category 和所有 SubCategory 的 cms 列表');
        this.contentList = result.Data;
      });
    }

    // 树形控件选择的cms目录改变
    changeCatSelect (Id) {
      this.catId = Id;
      this.getContentsByCatId();
    }

    get id () {
      return this.$route.params.id;
    }

    mounted () {
      this.getCategoryByDevice();
    }

    @Watch('id', { deep: true })
    onKeyChange () {
      this.cmsCategory = {};
      this.cmsCatTree = [];
      this.contentList = [];
      this.catId = 0;
      this.getCategoryByDevice();
    }

    @Watch('pager.currentPage', { deep: true })
    onPagerChange() {
      this.getContentsByCatId();
    }
}
</script>
<style scoped lang="less">
.catDetail {
  .DetailTitle{
  width: 100%;
  // display: flex;
  // flex-wrap:wrap;
  position: relative;
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
        margin-left: 160px;
        transition: all 0.3s;
    }
  }
  .TitleBgNo{
    position: static;
    transform: translateX(0);
    margin: 50px auto;
    width: 100%;
  }
}

  .catContent {
      width: 1200px;
      margin: 0 auto;
      padding: 15px 0;

      .layer {
          font-size: 16px;
      }
      .TitleBg{
  margin-bottom: 28px;
  .innerBox{
    >h2{
      text-align: center;
      margin-bottom: 10px;
      font-size: 36px;
      font-family: 'SourceHanSans-Heavy';
      background: linear-gradient(90deg, #db9307, #f4de91, #db9307);
      -webkit-background-clip: text;
      color: transparent;
      display: flex;
      justify-content: center;
      width: 280px;
      margin: 0 auto;

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
  }
  .swiperbg{

      position: relative;
      margin-top: 60px;
      margin-bottom: 65px;
      .swiperlist{
        width: 1000px;
        margin: 0 auto;
      }
      .swiper-button-prev, .swiper-button-next{
        width: 36px;
        height: 36px;
        bottom: 20px;
        top: 50%;
        transform: translateY(-50%);
        margin-top: 0;

      }
      .swiper-button-prev-PageStyle{
        background: url(/images/pc/prev.png) no-repeat;
        left: 20px;
      }
      .swiper-button-next-PageStyle{
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
}
.PageStyle1{
  .content{
    border: 6px solid #d9b672;
    border-radius: 4px;
    padding: 54px 24px ;
    box-sizing: border-box;
    position: relative;
    >h2{
      text-align: left;
      font-size: 48px;
      font-family: 'SourceHanSans-Heavy';
      background: linear-gradient(90deg, #db9307, #f4de91, #db9307);
      -webkit-background-clip: text;
      color: transparent;
      position: relative;
      margin-bottom: 40px;
      width: 250px;
      &::after{
        content: '';
        width: 285px;
        height: 1px;
        background-color: #d9b672;
        position: absolute;
        bottom: -18px;
        left: 0;
      }
    }
    /deep/ p{
      color: #d9b672;
      font-size: 24px;
      font-family: 'SourceHanSans-Regular';
      line-height: 36px;
      text-align: justify;
    }
    .logo{
      position: absolute;
      top: 54px;
      right:54px
    }
  }
}
.Engap{
  .DetailTitle .TitleBg {
    top: 60px;
    .innerBoxText{
      font-size: 38px;
      // width: 245px;
      margin-left: 164px;
      line-height: 38px;
      word-break: keep-all;
      height: 23rem;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 304px;
    }
  }
  .PageStyle1 .content > h2{
    width: 360px;
    &::after{
      width: 390px;
    }
  }
}
@media screen and (max-width: 1440px){
  .catDetail .DetailTitle{
    .TitleBg{
      top: 168px;
      .innerBoxText{
        width: 310px;
        margin-left: 214px;
      }
    }
    .TitleBgNo{
      .innerBoxText{
        margin: 50px auto;
        // width: 100%;
      }

    }
    img{
      height: 600px;
    }
  }
  .Engap{
    .DetailTitle .TitleBg {
      top: 38px;
      .innerBoxText{
        font-size: 34px;
        width: 245px;
        margin-left: 246px;
        line-height: 38px;
        word-break: keep-all;
        height: 19rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
@media screen and (max-width: 1366px){
  .catDetail .DetailTitle{
    .TitleBg{
      top: 168px;
      .innerBoxText{
        width: 310px;
        margin-left: 214px;
      }
    }
    .TitleBgNo{
      .innerBoxText{
        margin: 50px auto;
        // width: 100%;
      }

    }
    img{
      height: 600px;
    }
  }
  .Engap{
    .DetailTitle .TitleBg {
      top: 38px;
      .innerBoxText{
        font-size: 34px;
        width: 245px;
        margin-left: 246px;
        line-height: 38px;
        word-break: keep-all;
        height: 19rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
