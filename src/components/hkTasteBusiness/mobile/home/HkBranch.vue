<template>
 <div class="indexShop">
   <div class="shopMain">
      <div class="leftSide">
        <div class="text fade-in-hot" v-html="MapInfo"></div>
      </div>
   </div>
 </div>
</template>
<script lang="ts" scoped>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
@Component
export default class PkNews extends Vue {
  lastestContents: any[] = [];
  MapInfo:string='';
  ShopList:any[]=[];
  cindex:number=0;
  IndexShopAds:any[]=[];
  // getIndexshop () {
  //   var _this = this;
  //   this.$Api.cms.getContentsByCatId(40108, 1, 12).then(result => {
  //     this.ShopList = result.Data;
  //     result.Data.forEach(function (item) {
  //       var colon = item.Desc.indexOf('*');
  //       var a = item.Desc.substring(0, item.Desc.indexOf('*'));
  //       var b = item.Desc.substr(
  //         item.Desc.indexOf('*') + 1,
  //         item.Desc.length
  //       );
  //       _this.$set(item, 'DescOne', a);
  //       _this.$set(item, 'DescTwo', b);
  //     });
  //   });
  // }
  // 获取广告标语
  // getShopADS () {
  //   var _this = this;
  //   this.$Api.cms.getContentsByCatId(40111, 1, 12).then(result => {
  //     this.IndexShopAds = result.Data;
  //   });
  // }
  showContent () {
    this.$Api.cms.getContentByDevice({ Key: 'social', IsMobile: true }).then(result => {
      this.MapInfo = result.CMS.Body;
    });
  }
  get lang () {
    return this.$Storage.get('locale');
  }
  socialScroll () {
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
    // this.getIndexshop();
    // this.getShopADS();
    this.showContent();
    document.addEventListener('Scroll', this.socialScroll);
  }
  destroyed() {
    document.removeEventListener('Scroll', this.socialScroll);
  }
}
</script>

<style scoped lang="less">
.clear{
  clear: both;
}
.shopMain .leftSide{
    width: 90%;
    margin: 0 auto;
    // float: left;
    margin-bottom: 4rem;
  .title{
    text-align: center;
    margin-bottom: 2rem;
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
          color: #666666;
          text-align: center;
          word-break: break-word;
        }
  }
  .text{
    // border: 6px solid #d9b672;
    // border-radius: 5px;
    // padding: 35px 94px;
    // box-sizing: border-box;
    /deep/ h2{
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
    /deep/ p{
      font-family: 'SourceHanSans-Regular';
          font-size: 1.2rem;
          color: #666666;
          text-align: center;
          word-break: break-word;
      margin-bottom: 2rem;
    }
    /deep/ .social_table{
      border: 6px solid #d9b672;
      border-radius: 5px;
      padding: 1rem;
      box-sizing: border-box;
    }
    /deep/ table{
      width: 100%;
      tr{
        td{
          text-align: center;
          padding: 1rem 1.5rem;
          display: inline-block;
          width: 50%;
          box-sizing: border-box;
          p{
            margin-top: 1rem;
            margin-bottom: 0;
          }
          img{
            width: 100%;
            display: block;
            height: 8rem;
            object-fit: contain;
          }
        }

      }
      &:last-child{
        td{
          border-top: 1px solid #999999;
          width: 100%;
          color: #d9b672;
          font-family: 'SourceHanSans-Regular';
          font-size: 1.4rem;
          word-break: break-word !important;
          padding: 1rem 0;
          a{
            color: #d9b672;
          font-family: 'SourceHanSans-Regular';
          font-size: 1.4rem;
          }
        }
      }
    }
  }
}
.fade-in-hot {
  opacity: 0;
  transition: 1s all ease-out;
  // transform: translate(0, -30px);
  box-sizing: border-box;
}
</style>
