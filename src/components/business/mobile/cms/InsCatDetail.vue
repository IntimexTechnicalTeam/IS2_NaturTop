<template>
  <div id="container" class="catDetail" :class="{'Engap': $Storage.get('locale') === 'E'}">
    <div class="DetailTitle" >
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
                <img src="/images/pc/indexpc_29.png" alt="">
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
                <div class="swiper-pagination swiper-pagination-concept" slot="pagination"></div>
              </div>

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
    InsCatLayout2: () => import('@/components/business/mobile/cms/InsCatLayout2.vue'),
    InsCatLayout3: () => import('@/components/business/mobile/cms/InsCatLayout3.vue'),
    InsCatLayout4: () => import('@/components/business/mobile/cms/InsCatLayout4.vue'),
    swiper,
    swiperSlide
  }
})
export default class insNews extends Vue {
    cmsCategory: object = {}; // cms下单个目录的信息
    cmsCatTree: object[] = []; // cms目录
    contentList: object[] = []; // cms内容列表
    catId: number = 0; // Tree点击获取内容列表的目录id
    PageStyle: string = '0'; // catDetail页面类型
    pager: any = {
      currentPage: 1, // 当前页
      pageSize: 10, // 每页显示条目个数
      totalRecord: 0 // 总条目数
    }
    CatCatId: string ='';
    PlatforTitle: string = '';
    PlatforDuct: string = '';
    catKey: string = '';
    swiperOptionPageStyle: object = {
      slidesPerView: 1,
      spaceBetween: 30,
      slidesPerGroup: 1,
      // loop: true,
      // loopFillGroupWithBlank: true,
      pagination: {
      el: '.swiper-pagination.swiper-pagination-concept',
      clickable: true
    }
    };

    // 根据设备类型获取CMSCategory信息
    getCategoryByDevice () {
      this.$Api.cms.getCategoryByDevice({ CatId: this.id, IsMobile: true }).then((result) => {
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
        if (this.PageStyle === '4') {
          this.contentList = this.contentList.concat(result.Data);
        } else {
          this.contentList = result.Data;
        }

        result.Data.forEach(function (i) {
          var newDate = new Date(i.CreateDate.replace(/-/g, '/'));
          i.CreateDate = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate();
          _this.CatCatId = i.CatId;
        });
        this.pager.totalRecord = result.TotalRecord;
      });
    }

    // 获取 Category 和所有 SubCategory 的 cms 列表
    getSubCatContents () {
      this.$Api.cms.getSubCatContents({ CatId: this.id, IsMobile: true }).then((result) => {
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
    display: flex;
    flex-wrap:wrap;
    position: relative;
    align-items: center;
    justify-content: center;
    img{
      width: 100%;
      display: block;
    }
    .TitleBg{
      top: 6rem;
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
        height: 16rem;
        align-items: center;
      }
    }
    .TitleBgNo{
      position: static;
      margin: 2rem auto;
    }
  }

  .catContent {
    width: 90%;
    margin: 0 auto;
    margin-top: 2rem;
    margin-bottom: 2rem;

    .layer {
      font-size: 1.2rem;
    }
    .TitleBg{
  margin-bottom: 2rem;
  .innerBox{
    >h2{
      text-align: center;
      margin-bottom: 1rem;
      font-size: 2.4rem;
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
      color: #666666;
      text-align: center;
      word-break: break-word;
    }
  }
}
  }
}
.PageStyle1{
  .content{
    // border: 6px solid #d9b672;
    background-color: #d9b672;
    border-radius: 4px;
    padding: 2rem 1rem ;
    box-sizing: border-box;
    position: relative;
    padding-top: 4rem;
    >h2{
      text-align: left;
      font-size: 2rem;
      font-family: 'SourceHanSans-Heavy';
      color: #fff;
      position: relative;
      margin-bottom: 2rem;
      &::after{
        content: '';
        width: 50%;
        height: 1px;
        background-color: #fff;
        position: absolute;
        bottom: -10px;
        left: 0;
      }
    }
    /deep/ p{
      color: #fff;
      font-size: 1.3rem;
      font-family: 'SourceHanSans-Regular';
      line-height: 1.8rem;
      text-align: justify;
    }
    .logo{
      position: absolute;
      top: -2.85rem;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      img {
        display: block;
        width: 80%;
        margin: 0 auto;
      }
    }
  }
  .swiperbg{
    margin-top: 3rem;
    margin-bottom: 6rem;
    position: relative;
    /deep/ .swiper-container{
      .swiper-slide{
        border-radius: 5px;
        img{
          display: block;
          border-radius: 5px;
          width: 100%;
          height: 20rem;
          object-fit: cover;
        }
      }
    }
    .swiper-pagination-concept{
      left: 50%;
      transform: translateX(-50%);
      bottom: -30px;
      /deep/ .swiper-pagination-bullet{
        width: 14px;
        height: 14px;
        background-color: #f9eed9;
        opacity: 1;
        margin: 0 9px;
      }
      /deep/ .swiper-pagination-bullet-active{
        background-color: #cda975;
      }
    }
  }
}
.Engap{
  .DetailTitle .TitleBg {
    top: 6rem;
    position: absolute;
    left: 3rem;
    width: 13rem;
    text-align: center;
    .innerBoxText{
      font-size: 1.8rem;
      word-break: keep-all;
      line-height: 2.2rem;
    }
  }
}
</style>
