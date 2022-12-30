<template>
  <div class="indexShop">
    <div class="shopMain">
        <div class="leftSide">
          <!-- <div class="title">
            <h2>{{IndexShopname}}</h2>
            <p>{{IndexShopDesc}}</p>
          </div> -->
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
  IndexShopname:string='';
  IndexShopDesc: string='';
  IndexShopList:any[]=[];
  IndexShopAds:any[]=[];
  cindex:number=0;
  // getIndexshop () {
  //   var _this = this;
  //   this.$Api.cms.getContentsByCatId(40108, 1, 12).then(result => {
  //     this.IndexShopList = result.Data;
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
  // // 获取广告标语
  // getShopADS () {
  //   var _this = this;
  //   this.$Api.cms.getContentsByCatId(40111, 1, 12).then(result => {
  //     this.IndexShopAds = result.Data;
  //   });
  // }
  showContent () {
    this.$Api.cms.getContentByDevice({ Key: 'social', IsMobile: false }).then(result => {
      this.MapInfo = result.CMS.Body;
      this.IndexShopname = result.CMS.Title;
      this.IndexShopDesc = result.CMS.Desc;
      // this.cindex = index;
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
      var elemTop = rect.top + 200; // 200 = buffer
      var elemBottom = rect.bottom;
      return elemTop < window.innerHeight && elemBottom >= 0;
    }
  mounted () {
    // this.getIndexshop();
    // this.getShopADS();
    this.showContent();
    document.addEventListener('scroll', this.socialScroll);
  }
  destroyed() {
    document.removeEventListener('scroll', this.socialScroll);
  }
}
</script>
<style  lang="less">
// .indexShop .leftSide img{
//   width: 100%;
// }
// .indexShop .leftSide iframe{
//   height: 450px;
// }
// .indexShop .activeColor span{
//   color: #333333!important;
//   text-decoration: underline;
//   font-weight: 700;
// }
// .indexShop .activeColor .contentSide p{
//     color: #333333!important;
// }
</style>
<style scoped lang="less">
  .OurStores{
    font-size: 40px;
    font-weight: 700;
    color:#333333;
    text-align: right;
  }
  .BusinessHours{
    font-size: 24px;
    color:#333333;
    margin-bottom: 30px;
    text-align: right;
  }
.indexShop{
    width: 100%;
    background: transparent;
}
.shopMain{
    width: 1200px;
    margin: 0 auto;
}
.shopMain .leftSide{
    width: 100%;
    // float: left;
    margin-bottom: 80px;
  .title{
    text-align: center;
    margin-bottom: 20px;
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

        }
        p{
          font-family: 'SourceHanSans-Regular';
          font-size: 18px;
          color: #333333;
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
      margin-bottom: 10px;
      font-size: 36px;
      font-family: 'SourceHanSans-Heavy';
      background: linear-gradient(90deg, #db9307, #f4de91, #db9307);
      -webkit-background-clip: text;
      color: transparent;
      display: flex;
      justify-content: center;

    }
    /deep/ p{
      font-family: 'SourceHanSans-Regular';
      font-size: 18px;
      color: #333333;
      text-align: center;
      word-break: break-word;
      margin-bottom: 20px;
    }
    /deep/ .social_table{
      border: 6px solid #d9b672;
      border-radius: 5px;
      padding: 35px 94px;
      box-sizing: border-box;
    }
    /deep/ table{
      width: 100%;
      tr{
        td{
          text-align: center;
          padding: 10px 20px;
          display: inline-block;
          width: 25%;
          box-sizing: border-box;
          p{
            margin-top: 10px;
            img{
              width: 100%;
              height: 110px;
              display: block;
              object-fit: contain;
            }
          }
        }

      }
      &:last-child{
        td{
          border-top: 1px solid #999999;
          width: 100%;
          color: #d9b672;
          font-family: 'SourceHanSans-Regular';
          font-size: 18px;
          a{
            color: #d9b672;
            font-family: 'SourceHanSans-Regular';
            font-size: 18px;
          }
        }
      }
    }
  }
}
.shopMain .Etitle{
  text-align: right;
  margin-bottom: 2rem;
}
.shopMain .leftSide img{
    width: 100%;
}
.shopMain .leftSide iframe{
    width: 100%;
}
.shopMain .rightSideE{
    width: 50%;
    float: left;
    min-height: 400px;
    margin-left: 4%;
    padding-right: 10%;
}
.shopMain .rightSide{
    width: 50%;
    float: left;
    background:transparent;
    min-height: 400px;
    margin-left: 4%;
    padding-right: 10%;
}
.shopMain  .listImg{
    width: 100%;
    display: inline-block;
 }
 .shopMain  .listImg >li{
     width: 46%;
     margin-right: 8%;
     float: left;
     margin-bottom: 8%;
 }
 .shopMain  .listImg >li a span, .shopMain  .listImg >li a p{
     font-size: 18px;
     color:#333333;
 }
 .shopMain  .listImg > li:nth-child(2n){
     margin-right: 0%!important;
 }
 .shopMain  .onlineTimeTitle{
     font-size: 22px;
     color:#333333;
 }
 .shopMain   .onlineTimeContent{
    font-size: 22px;
    color:#333333;
    font-weight: 100;
    word-break: break-all;
    width: 150px;
    display: block;
    transform: rotate(90deg);
}
 .shopMain  .iconSide{
     width: 30px;
     height: 30px;
     background: url('/images/mobile/Mobile-Contact-05.png') no-repeat center center;
     background-size: 100%;
     display: block;
     float: left;
     margin-right: 10px;

 }
 .shopMain  .contentSide{
    float: left;
    width: calc(100% - 40px);
}
 .shopMain  .contentSide span{
   display: inline-block;
 }
 .shopMain  .contentSide:hover span{
   text-decoration: underline;
   transform: translateY(-3px);
 }
.shopBottom{
    width: 1200px;
    margin: 0 auto;
    text-align: center;
    margin-top: 50px;
}
.shopBottom a{
    background:#4d4d4d;
    border:3px solid #999999;
    background-size: 100% 100%;
    display: inline-block;
    height: 3.5rem;
    text-align: center;
    line-height: 3.5rem;
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
    width: 20%;
    margin-right: 7rem;
    color:#fff;
    font-weight: 500;
}
.shopBottom a img{
   width: 100%;
}
.fade-in-hot {
  opacity: 0;
  transition: 1s all ease-out;
  // transform: translate(0, -30px);
  box-sizing: border-box;
}
</style>
