<template>
  <div id="container" class="MobileContact" :class="{'Engap': $Storage.get('locale') === 'E'}">
    <!-- 联络我们页面 -->
    <div class="Cmsbg" v-if="NewcateId=='40112'">
      <transition name="slide">
        <div key="1" v-if="!waiting" style="display:flex;">
           <div class="DetailTitle"><img :src="ImgList" v-show="ImgList!==null"><div class="TitleBg"><div class="innerBoxText">{{CateName}}</div></div></div>
      </div>
      </transition>
      <transition name="slide">
        <div class="faker" key="2" v-if="waiting" v-loading="true"></div>
      </transition>
      <!-- 表单信息 -->
        <div class="FormMain">
          <!-- <p class="FormTitle">
            用心關愛，<br>
            我們是您最優的選擇
          </p> -->
          <div v-html="htmlString" class="to_vertical" id="content"></div>
          <div id="preview" style="display:none;"></div>
        </div>
      <div class="CmsContent">
          <!-- <p class="OurStores">{{$t('Cms.OurStores')}}</p> -->
          <!-- <p class="BusinessHours">{{$t('Cms.BusinessHours')}}: 07:30 - 19:00</p> -->
          <p v-html="content.Body"></p>
         <div class="clear"></div>
      </div>
      <!-- <div class="CmsMap">
            <p class="addressIcon"><i></i>{{$t('home.Address')}}：</p>
            <div class="perList" v-for="(val,index) in ShopList" :key="index" v-on:click="showContent(val.Id,index)" :class="{'activeColor':cindex==index}">
                <div class="icon"><i></i></div>
                <div class="content">
                  <p>{{val.Title}}</p>
                  <p>{{val.DescOne}}</p>
                  <p>{{val.DescTwo}}</p>
                </div>
            </div>
            <p v-html="MapInfo" class="MapInfo"></p>
      </div> -->
      <!-- <div class="borderline"></div> -->

    </div>
    <!-- 其他页面 -->
    <div class="CmsNormal" v-if="NewcateId!='40112'">
      <transition name="slide">
        <div key="1" v-if="!waiting" style="display:flex;">
            <div class="DetailTitle" v-if="OtherPageImg">
              <img :src="OtherPageImg" v-show="OtherPageImg!==null">
              <div class="TitleBg">
                <div class="innerBoxText">{{TitleName}}</div>
              </div>
            </div>
            <div class="DetailTitle" v-else>
              <div class="TitleBg TitleBgNo">
                <div class="innerBoxText">{{TitleName}}</div>
              </div>
            </div>
        </div>
      </transition>
      <transition name="slide">
        <div class="faker" key="2" v-if="waiting" v-loading="true"></div>
      </transition>
      <div class="CmsContent" :class="{'CmsContent_health': NewcmsId == '20322','CmsContent_social': NewcmsId == '20305'}">
        <!-- <p class="TitleName">{{TitleName}}</p> -->
        <div class="contentBody" v-html="content.Body"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { FrontE } from '@/sdk/common/SysConst';
import Cookie from 'js-cookie';
@Component({
  components: {
    PkcmsBanner: () => import('@/components/hkTasteBusiness/mobile/cms/PkcmsBanner.vue')
  }
})
export default class InsCmsContent extends Vue {
  NewsNav: string = 'NewsNav';
  CateName: string = '';
  CateDesc: string = '';
  content: any[] = [];
  FormContent:any='';
  private ImgList: string[] = [];
  private ispic:boolean=false;
  IsPay:boolean= false;
  IsLogin:boolean=false;
  IsMobile:boolean=true;
  MapInfo:string='';
  ShopList:any[]=[];
  cindex:number=0;
  private htmlString: string = '';
  Signer: any = null;
  FormTitle:string='';
  NewcateId:string='';
  NewcmsId: string='';
  private waiting: boolean = true;
  OtherPageImg:string='';
  TitleName:string='';

  getIndexshop () {
    var _this = this;
    this.$Api.cms.getContentsByCatId(40108, 1, 12).then(result => {
      this.ShopList = result.Data;
      result.Data.forEach(function (item) {
        var colon = item.Desc.indexOf('*');
        var a = item.Desc.substring(0, item.Desc.indexOf('*'));
        var b = item.Desc.substr(
          item.Desc.indexOf('*') + 1,
          item.Desc.length
        );
        _this.$set(item, 'DescOne', a);
        _this.$set(item, 'DescTwo', b);
      });
    });
  }
  showContent (val, index) {
    this.$Api.cms.getContentByDevice({ ContentId: val, IsMobile: true }).then(result => {
      this.MapInfo = result.CMS.Body;
      this.cindex = index;
    });
  }
  get currentlang () {
    return this.$Storage.get('locale');
  }
  get id () {
    return this.$route.params.id ? this.$route.params.id : '';
  }
  getForm () {
    this.$Api.regAndPay.getHtml('ContactUs', this.lang, false).then(result => {
      this.htmlString = result.HtmlString;
      this.FormTitle = result.Title;
      this.$nextTick(() => {
        if (document.querySelectorAll('#Sign').length > 0) {
          this.Signer = new intimex.CanvasSigner('#NewSignCanvas', '#Signature', {
            color: '#58B63A',
            width: 5
          });
          this.Signer.initCanvas();
          window['Signer'] = this.Signer;
        }
      });
    });
  }
  getContent () {
    this.$Api.cms.getContentByDevice({ Key: this.id, ContentId: this.id, IsMobile: true }).then(result => {
      this.content = result.CMS;
      this.TitleName = result.CMS.Title;
      this.OtherPageImg = result.CMS.Cover;
      this.NewcateId = result.CMS.CatId;
      this.NewcmsId = result.CMS.Id;
      this.getCategoryByDevice(result.CMS.CatId);
      this.CateDesc = result.CMS.Desc;
      this.waiting = false;
      if (result.CMS.Title) document.title = result.CMS.Title;
    });
  }
  // 根据设备类型获取CMSCategory信息
  getCategoryByDevice (cateId) {
    this.$Api.cms.getCategoryByDevice({ CatId: cateId, IsMobile: true }).then(async (result) => {
      this.ImgList = result.ImagePath;
      this.MapInfo = result.Content;
      this.CateName = result.Name;
      this.waiting = false;
    }).catch((error) => {
      console.log(error, 'error');
      this.$message({
        message: error,
        type: 'error'
      });
    });
  }
  get lang () {
    return this.$Storage.get('locale');
  }
  get queryLang () {
    return this.$route.query.Lang || '';
  }
  Regnay () {
    window['jsData'] = {
      HasPreview: true,
      UploadButtonText: this.$t('RegNPay.UploadButtonText'),
      UploadingText: this.$t('RegNPay.UploadingText'),
      UploadSuccessfulText: this.$t('RegNPay.UploadSuccessfulText'),
      UploadFailText: this.$t('RegNPay.UploadFailText'),
      NoFileText: this.$t('RegNPay.NoFileText'),
      UploadLengthText: this.$t('RegNPay.UploadLengthText'),
      UploadSizeText: this.$t('RegNPay.UploadSizeText'),
      BackText: this.$t('RegNPay.BackText'),
      ConfirmText: this.$t('RegNPay.ConfirmText'),
      PleaseSelect: this.$t('RegNPay.PleaseSelect'),
      PreviewTitleText: this.$t('RegNPay.PreviewTitleText'),
      RequiredText: this.$t('RegNPay.RequiredText'),
      FormatErrorText: this.$t('RegNPay.FormatErrorText'),
      Version: '2.0',
      HasRNPConfirm: false
    };
    this.$LoadScript('/static/js/CanvasSigner.js');
    this.$LoadScript('/static/js/ajaxFileUpload.js');

    document.dispatchEvent(new Event('rnpFinshed'));

    // RNP Form后台预览跳转语言判断
    if (this.queryLang) {
      this.$Api.member.setUILanguage(this.queryLang).then((result) => {
        this.$i18n.locale = this.queryLang as string;
        localStorage.setItem('locale', this.queryLang as string);
        this.getForm();
      }).catch((error) => {
        console.log(error);
      });
    } else {
      this.getForm();
    }
  }
  created () {
    this.getContent();
    this.Regnay();
    this.getIndexshop();
    this.showContent(20288, 0);
  }
  mounted () {
    window['regAndPay'] = this.$Api.regAndPay;
    window['router'] = this.$router;
    window['Elalert'] = this.$alert;
  }
  @Watch('$route', { deep: true })
  onIdChange () {
    this.getContent();
  }
}
</script>
<style lang="less">
.MobileContact .FormMain{
  #preview{
    width: 100%;
    // float:right;
    .title{
      margin-bottom: 15px;
      font-size: 2rem;
    }
    .question{
      margin-bottom: 10px;
      font-size: 1.4rem;
      color:#d9b672;
    }
    .anwer{
      margin-bottom: 20px;
      font-size: 1.2rem;
    }
    .back{
      background: #ccc;
      color:#FFF;
      padding:10px 20px 10px 20px;
      border:none;
      margin-right: 20px;
      margin-top: 30px;
    }
    .confirm{
      background: #d9b672;
      color:#FFF;
      padding:10px 20px 10px 20px;
      border:none;
      margin-top: 30px;
      margin-right: 30px;
    }
  }
}
.MobileContact{
    .OurStores{
      font-size: 2.5rem;
      font-weight: 700;
      color:#333333;
      text-align: right;
    }
    .BusinessHours{
      font-size: 1.6rem;
      color:#333333;
      margin-bottom: 30px;
      text-align: right;
    }
    .aboutUSbg{
      width: 100%;
      float: left;
      background: #FFF;
      border-radius: 10px;
      padding: 5px;
     .innerBox{
       border:1px solid #000;
       border-radius: 10px;
       position: relative;
        min-height: 400px;
        padding: 20px;
        p{
          font-size: 1.4rem;
          text-align: justify;
        }
        &::before{
            content: '';
            width: 98%;
            height: 20px;
            background: url(/images/mobile/productList_icon.png) no-repeat center center;
            background-size: 100%;
            position: absolute;
            top: 10px;
            left: 1%;
        }
        &::after{
            content: '';
            width: 98%;
            height: 20px;
            background: url(/images/mobile/productList_icon.png) no-repeat center center;
            background-size: 100%;
            position: absolute;
            bottom: 10px;
            left: 1%;
        }
     }
   }
  }
.MobileContact .activeColor .content p:nth-child(1){
    text-decoration: underline;
    font-weight: 700;
}
.MobileContact .aboutBg{
    width: 80%;
    background-size: 100%;
    min-height: 65rem;
    padding: 10%;
    word-break: break-all;
}
.MobileContact .abooutImg{
    width: 70%;
    margin: 0 auto;
    margin-bottom: 1rem;
    img{
      width: 100%;
    }
}
.MobileContact .contactBox{
  width: 100%;
  display: inline-block;
  p{
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    border-top: 1px solid #666;
    &:last-child{
      border-bottom: 1px solid #666;
    }
    .icon1{
      background: url('/images/mobile/Mobile-Contact-02.png') no-repeat center center;
      background-size: 100%;
      width: 2.5rem;
      height: 2.5rem;
      display: inline-block;
      vertical-align: middle;
      margin-right:1rem;
    }
    .icon2{
      background: url('/images/mobile/Mobile-Contact-03.png') no-repeat center center;
      background-size: 100%;
      width: 2.5rem;
      height: 2.5rem;
      display: inline-block;
      vertical-align: middle;
      margin-right:1rem;
    }
    .icon3{
      background: url('/images/mobile/Mobile-Contact-04.png') no-repeat center center;
      background-size: 100%;
      width: 2.5rem;
      height:2.5rem;
      display: inline-block;
      vertical-align: middle;
      margin-right:1rem;
    }
  }
}
.MobileContact .CmsMap .MapInfo{
  width:100%;
  margin-bottom: 1rem;
  iframe{
    width:100%;
    height: 30rem;
  }
  img{
    width:100%;
  }
}
.MobileContact .FormMain{
  width:90%;
  margin:0 auto;
  padding: 3rem 1rem;
  position: relative;
  padding-top: 2rem;
  background-color: #fff8ea;
  box-sizing: border-box;
  margin-bottom: 3rem;
  .FormTitle{
    font-size: 2rem;
    color:#d9b672;
    position: relative;
    font-family: 'SourceHanSans-Regular';
    font-weight: bold;
    text-align: center;
    margin-bottom: 3rem;
    &::after{
      content: '';
      width: 100px;
      height: 6px;
      background-color: #d9b672;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: -21px;
    }
  }
  .to_vertical{
    .TopBorder{
      margin-bottom: 3rem;
      position: relative;
      p{
        font-size: 2rem;
        color:#d9b672;
        position: relative;
        font-family: 'SourceHanSans-Regular';
        font-weight: bold;
        text-align: center;
      }
      &::after{
        content: '';
        width: 100px;
        height: 6px;
        background-color: #d9b672;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -21px;
      }
    }
  }
  .FormImg{
    position: absolute;
    right: 0px;
    top:3rem;
    width: 20%;
    img{
      width: 100%;
    }
  }
  .form-group{
    .fieldset {
      border: none;
    }
    h4{
      background: #fff;
      background-size: 100% 100%;
      display: inline-block;
      height: 3.5rem;
      // width: 40%;
      text-align: center;
      line-height: 3.5rem;
      font-size: 1.2rem;
      margin-bottom: 1rem;
      // border:1px solid #808080;
      border-radius: 2px;
      display: none;
    }
    input[type="text"],input[type="email"]{
      border:1px solid #999999;
      height: 3.5rem;
      line-height: 3.5rem;
      width: 100%;
      box-sizing: border-box;
      border-radius: 2px;
      margin-bottom: .5rem;
      text-indent: 1rem;
      outline: none;
      font-size: 1.2rem;
      font-family: 'SourceHanSans-Regular';
    }
    textarea{
      border:1px solid #999999;
      height: 10rem;
      width: 100%;
      box-sizing: border-box;
      border-radius: 2px;
      margin-bottom: .5rem;
      outline: none;
      font-size: 1.2rem;
      text-indent: 1rem;
      // color: #cccccc;
      padding-top: 0.5rem;
      font-family: 'SourceHanSans-Regular';
    }
    p[name="error"]{
      color:red;
      margin-bottom:.5rem;
    }
    .col-md-10{
      text-align: center;
    }
    .btn-default{
      // width: 40%;
      // float: right;
      background: #d9b672;
      height: 3.5rem;
      line-height: 3.5rem;
      color:#fff;
      background-size: 100%;
      border:none;
      margin-top: 1rem;
      font-size: 1.4rem;
      // margin-bottom: 5rem;
      border-radius: 5px;
      padding: 0 2rem;
      font-family: 'SourceHanSans-Regular';
    }
    /* WebKit browsers */
    input::-webkit-input-placeholder {
        color: #cccccc;
    }
    /* Mozilla Firefox 4 to 18 */
    input:-moz-placeholder {
        color: #cccccc;
        opacity: 1;
    }
    /* Mozilla Firefox 19+ */
    input::-moz-placeholder {
        color: #cccccc;
        opacity: 1;
    }
    /* Internet Explorer 10+ */
    input:-ms-input-placeholder {
        color: #cccccc;
    }

    /* WebKit browsers */
    textarea::-webkit-input-placeholder {
        color: #cccccc;
    }
    /* Mozilla Firefox 4 to 18 */
    textarea:-moz-placeholder {
        color: #cccccc;
        opacity: 1;
    }
    /* Mozilla Firefox 19+ */
    textarea::-moz-placeholder {
        color: #cccccc;
        opacity: 1;
    }
    /* Internet Explorer 10+ */
    textarea:-ms-input-placeholder {
        color: #cccccc;
    }
  }
}
</style>
<style scoped lang="less">
.TitleName{
  text-align: center;
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 2rem;
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
.CmsNormal{
  width: 100%;
  display: inline-block;
  background: #FFF;
}
// .TitleBg{
//   width: 75%;
//   height: 4.5rem;
//   border:1px solid #ffffff;
//   margin: 0 auto;
//   padding: .8rem;
//   .innerBoxText{
//     width: 100%;
//     height: 100%;
//     background:#ffffff;
//     color: #333333;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 2.5rem;
//     font-weight: 700;
//     font-family: 'Arial';
//   }
// }
.cmsTitlebg{
    width: 50%;
    background: url(/images/mobile/contact_02.png) no-repeat center center;
    background-size: 100% 100%;
    display: flex;
    box-sizing: border-box;
    height: 6rem;
    align-items: center;
    justify-content: center;
    .p1{
      font-size: 1.5rem;
      width: 100%;
      text-align: center;
      font-weight: 700;
    }
    .p2{
      font-size: 1.2rem;
      text-align: center;
      color: #262626;
      font-weight: 600;
    }
}
.Cmsbg{
    width:100%;
    // background: url('/images/mobile/MobileIndex_03.jpg') no-repeat center center;
    background-color: #fff;
    background-size: 100% 100%;
    display: inline-block;
    box-sizing: border-box;
    // margin-top: -.5rem;
    padding-bottom: 2rem;
    .borderline{
      height:1px;
      width: 100%;
      display: inline-block;
      background: #000;
   }
}
.Banner {
  width: 100%;
  height: 15rem;
  display:flex;
  align-items: center;
  position: relative;
}
.Banner img {
  width: 100%;
  height: 15rem;
}
#container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.CmsMap {
    width: 90%;
    margin: 0 auto;
    padding-top: 2rem;
}
.CmsContent{
  position: relative;
    width: 90%;
    margin: 0 auto;
    // padding-top: 5rem;
    padding-bottom: 5rem;
  .CmsMapImg{
    width: 20%;
    position: absolute;
    right: 0px;
    top:3rem;
    img{
      width: 100%;
    }
  }
  /deep/ table.aboutus_table{
    width: 100% !important;
    border-spacing: 0;
    tbody{
      tr{
        td{
          width: 100%;
          border-spacing: 0;
          p{
            img{
              width: 100%;
              display: block;
            }
          }
          img{
            width: 100%;
            display: block;
            margin-top: 1rem;
            margin-bottom: 1rem;
            border-radius: 3px;
          }
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
            color: #333333;
            text-align: justify;
            word-break: break-word;
            padding: 0 1rem !important;
            margin-top: 1rem !important;
          }

        }
      }
    }
  }
  /deep/ .productlist{
    margin-top: 2rem;
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
      width: 50%;
      margin: 0 auto;
    }
    p{
      font-family: 'SourceHanSans-Regular';
      font-size: 1.2rem;
      color: #666666;
      text-align: center;
      word-break: break-word;
      margin-top: 10px !important;
      &:last-child{
        margin-bottom: 28px;
      }
      img{
        width: 100%;
        display: block;
      }
    }
    .product_table{
      width: 90% !important;
      margin: 0 auto;
      tr{
        td{
          border: 1px solid #d9b672;
          border-radius: 6px;
          display: block;
          margin: 0 auto;
          padding: 0 5px;
          box-sizing: border-box;
          margin-bottom: 2rem;
        }
      }
    }
  }
  /deep/ div {
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
      width: 50%;
      margin: 0 auto;
    }
    p{
      font-family: 'SourceHanSans-Regular';
      font-size: 1.2rem;
      color: #333333;
      text-align: center;
      word-break: break-word;
      margin-top: 10px !important;
      &:last-child{
        margin-bottom: 28px;
      }
    }
    .social_table{
      border: 4px solid #d9b672;
      border-radius: 5px;
      padding: 1rem 1.5rem;
      box-sizing: border-box;
      margin-top: 1rem;
      table{
      width: 100%;
      tr{
        td{
          text-align: center;
          padding: 1rem;
          display: inline-block;
          width: 50%;
          box-sizing: border-box;
          border: none;
          margin: 0;
          border-radius: 0;
          p{
            margin-top: 1rem;
            text-align: center;
            img{
              height: 6rem;
              display: inline-block;
              object-fit: contain;
            }
          }
          &:hover{
            background-color: #fff;
            border: none;
          }
        }

      }
      &:last-child{
        td{
          border-top: 1px solid #999999;
          width: 100%;
          color: #d9b672;
          font-family: 'SourceHanSans-Regular';
          font-size: 1.2rem;
          a{
            color: #d9b672;
            font-size: 1.2rem;
            font-family: 'SourceHanSans-Regular';
          }
          &:hover{
            border-top: 1px solid #999999;
          }
        }
      }
    }
    }
  }

}
.CmsContent_health{
  width: 100%;
  background:  url(/images/mobile/healthback.jpg) no-repeat bottom center;
  padding-bottom: 2rem;
  background-size: cover;
  // margin-bottom: -20px;
  position: relative;

  .contentBody{
    width: 90%;
    margin: 0 auto;
    background-color: #fff8ea;
    padding: 2rem;
    position: relative;
    margin-bottom: 5rem;
    box-sizing: border-box;
    /deep/ h2{
      text-align: center;
      font-size: 2rem;
      font-family: 'SourceHanSans-Heavy';
      background: linear-gradient(90deg, #db9307, #f4de91, #db9307);
      -webkit-background-clip: text;
      color: transparent;
      // width: 310px;
      // margin-left: 160px;
      transition: all 0.3s;
      margin-bottom: 1rem;
      width: 100%;
    }
    /deep/ p{
      color: #333333;
      font-size: 1.2rem;
      font-family: 'SourceHanSans-Regular';
      line-height: 1.8rem;
      text-align: justify;
      margin-top: 0;
      margin-bottom: 1rem;
      img{
        // position: absolute;
        // // bottom: 310px;
        // left: 50%;
        // transform: translateX(-50%);
        // width: 80%;
        display: block;
        border-radius: 5px;
        width: 100%;
      }
    }
  }
}
.CmsMap
{
  position: relative;
  .addressIcon{
    width: 100%;
    font-size: 1.4rem;
    margin-bottom: 2rem;
    align-items: center;
    display: flex;
    i{
      background: url('/images/mobile/Mobile-Contact-05.png') no-repeat center center;
      background-size: 100% 100%;
      width:2.5rem;
      height:2.5rem;
      display: inline-block;
      margin-right:.5rem;
    }
  }
  .perList{
    margin-bottom:3rem;
    width:calc(100% - 3rem);
    padding-left: 3rem;
    p{
      font-size:1.4rem;
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
  .CmsContent /deep/ table.aboutus_table tbody tr td>h2:first-child{
    letter-spacing: 0;
  }
  .CmsContent/deep/ div>h2{
    letter-spacing: 0;
  }
}
.clear {
  clear: both;
}
</style>
