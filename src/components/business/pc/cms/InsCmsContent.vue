<template>
  <div id="container" class="PcContact" :class="{'Engap': $Storage.get('locale') === 'E'}">
  <!-- 联络我们页面 -->
    <div class="Cmsbg" v-if="NewcateId=='40112'">
      <transition name="slide">
        <div key="1" v-if="!waiting" style="display:flex;">
           <div class="DetailTitle">
            <div v-if="OtherPageImg">
              <img :src="OtherPageImg" v-show="OtherPageImg!==null">
              <div class="TitleBg TitleBgEng">
                <div class="innerBoxText">{{CateName}}</div>
              </div>
            </div>
            <div v-else>
              <div class="TitleBg TitleBgNo">
                <div class="innerBoxText">{{CateName}}</div>
              </div>
            </div>
          </div>
      </div>
      </transition>
      <transition name="slide">
        <div class="faker" key="2" v-if="waiting" v-loading="true"></div>
      </transition>
      <div class="FormMain fix">
        <!-- <p class="FormTitle">
          用心關愛，<br>
          我們是您最優的選擇
        </p> -->
        <div v-html="htmlString" class="to_vertical" id="content"></div>
        <div id="preview" style="display:none;"></div>
      </div>
      <div class="clear"></div>
      <div class="CmsContent">
        <!-- <div class="MapInfo">
          <p class="OurStores">{{$t('Cms.OurStores')}}</p>
          <p class="BusinessHours">{{$t('Cms.BusinessHours')}}: 07:30 - 19:00</p>
          <p v-html="MapInfo" ></p>
        </div> -->
          <div class="CmsMap">
            <p v-html="content.Body" class="cmsbody"></p>
            <!-- <p class="addressIcon"><i></i>{{$t('home.Address')}}：</p>
            <div class="addressBox">
            <div class="perList" v-for="(val,index) in ShopList" :key="index" v-on:click="showContent(val.Id,index)" :class="{'activeColor':cindex==index}">
                <div class="icon"><i></i></div>
                <div class="content">
                  <p>{{val.Title}}</p>
                  <p>{{val.DescOne}}</p>
                  <p>{{val.DescTwo}}</p>
                </div>
              </div>
            </div> -->
          </div>
         <div class="clear"></div>
      </div>
      <!-- <div class="borderline"></div> -->

    </div>
    <!-- 其他页面 -->
    <div class="CmsNormal" v-if="NewcateId!='40112'" :class="{'Engap': $Storage.get('locale') === 'E'}">
      <transition name="slide">
        <div key="1" v-if="!waiting" style="display:flex;">
            <div class="DetailTitle" v-if="OtherPageImg">
              <img :src="OtherPageImg" v-if="OtherPageImg!==null">
              <div class="TitleBg"><div class="innerBoxText">{{TitleName}}</div></div>
            </div>
            <div class="DetailTitle" v-else>
              <div class="TitleBg TitleBgNo"><div class="innerBoxText">{{TitleName}}</div></div>
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
    PkcmsBanner: () => import('@/components/hkTasteBusiness/pc/cms/PkcmsBanner.vue')
  }
})
export default class InsCmsContent extends Vue {
  NewsNav: string = 'NewsNav';
  CateName: string = '';
  CateDesc: string = '';
  content: any[] = [];
  private ImgList: string[] = [];
  private ispic:boolean=false;
  IsMobile:boolean=false;
  MapInfo:string='';
  ShopList:any[]=[];
  FormContent:any='';
  IsPay:boolean= false;
  IsLogin:boolean=false;
  cindex:number=0;
  private htmlString: string = '';
  Signer: any = null;
  FormTitle:string='';
  NewcateId:string='';
  NewcmsId: string='';
  private waiting: boolean = true;
  OtherPageImg:string='';
  TitleName:string='';

  getForm () {
    this.$Api.regAndPay.getHtml('ContactUs', this.lang, false).then(result => {
      this.htmlString = result.HtmlString;
      this.FormTitle = result.Title;
      console.log(result, 'ContactUs');
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
  get id () {
    return this.$route.params.id ? this.$route.params.id : '';
  }
  get currentlang () {
    return this.$Storage.get('locale');
  }
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
    this.$Api.cms.getContentByDevice({ ContentId: val, IsMobile: false }).then(result => {
      this.MapInfo = result.CMS.Body;
      this.cindex = index;
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
    this.getIndexshop();
    this.showContent(20288, 0);
    this.Regnay();
  }
  getContent () {
    this.$Api.cms.getContentByDevice({ Key: this.id, ContentId: this.id, IsMobile: false }).then(result => {
    this.content = result.CMS;
    this.TitleName = result.CMS.Title;
    this.OtherPageImg = result.CMS.Cover;
    this.NewcateId = result.CMS.CatId;
    this.NewcmsId = result.CMS.Id;
    this.getCategoryByDevice(result.CMS.CatId);
    this.CateDesc = result.CMS.Desc;
    this.waiting = false;
    if (result.CMS.Title) document.title = result.CMS.Title;
    console.log(result, '獲取CMS');
  });
}
  // 根据设备类型获取CMSCategory信息
  getCategoryByDevice (cateId) {
      this.$Api.cms.getCategoryByDevice({ CatId: cateId, IsMobile: false }).then(async (result) => {
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
  @Watch('$route', { deep: true })
  onIdChange () {
    this.getContent();
  }
  mounted () {
    window['regAndPay'] = this.$Api.regAndPay;
    window['router'] = this.$router;
    // window['getPanel'] = this.$Api.getPanel;
    window['Elalert'] = this.$alert;
  }
}
</script>
<style lang="less">
.PcContact .activeColor .content p:nth-child(1){
    color: #333!important;
    text-decoration: underline;
    font-weight: 700;
}
.PcContact .aboutBg{
    width: 80%;
    background-size: 100%;
    min-height: 65rem;
    padding: 10%;
    word-break: break-all;
}
.PcContact .abooutImg{
    width: 70%;
    margin: 0 auto;
    margin-bottom: 1rem;
    img{
      width: 100%;
    }
}
.PcContact .contactBox{
  width: 100%;
  float: left;
  p{
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    border-top: 1px solid #000;
    &:last-child{
      border-bottom: 1px solid #000;
    }
    .icon1{
      background: url('/images/mobile/Mobile-Contact-02.png') no-repeat center center;
      background-size: 100%;
      width: 2rem;
      height: 2rem;
      display: inline-block;
      vertical-align: middle;
      margin-right:.5rem;
    }
    .icon2{
      background: url('/images/mobile/Mobile-Contact-03.png') no-repeat center center;
      background-size: 100%;
      width: 2rem;
      height: 2rem;
      display: inline-block;
      vertical-align: middle;
      margin-right:.5rem;
    }
    .icon3{
      background: url('/images/mobile/Mobile-Contact-04.png') no-repeat center center;
      background-size: 100%;
      width: 2rem;
      height: 2rem;
      display: inline-block;
      vertical-align: middle;
      margin-right:.5rem;
    }
  }
}
.PcContact  .MapInfo{
  width:45%;
  float:left;
  padding-top: 5rem;
  .OurStores{
    font-size: 40px;
    font-weight: 700;
    color:#333333;
  }
  .BusinessHours{
    font-size: 24px;
    color:#333333;
    margin-bottom: 30px;
  }
  iframe{
    width:100%;
    height: 450px;
  }
  img{
    width:100%;
  }
}
.PcContact .FormMain{
  width:1200px;
  margin:0 auto;
  margin-bottom: 60px;
  position: relative;
  // padding-top: 3rem;
  background-color: #fff8ea;
  padding: 40px 60px;
  box-sizing: border-box;
  .FormTitle{
    font-size: 36px;
    margin-top: 234px;
    // margin-bottom: 20px;
    color:#d9b672;
    float: left;
    margin-right: 140px;
    position: relative;
    font-family: 'SourceHanSans-Regular';
    font-weight: bold;
    &::after{
      content: '';
      width: 100px;
      height: 6px;
      background-color: #d9b672;
      position: absolute;
      left: 0;
      bottom: -21px;
    }
  }

  #preview{
    width: 100%;
    // float:right;
    .title{
      margin-bottom: 15px;
      font-size: 24px;
    }
    .question{
      margin-bottom: 10px;
      font-size: 18px;
      color:#d9b672;
    }
    .anwer{
      margin-bottom: 20px;
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
  .to_vertical{
    // width: 1200px;
    margin: 0 auto;
    // display: inline-block;
    // float: left;
    .TopBorder{
      width: 420px;
      float: left;
      // margin-left: 60px;
      margin-top: 215px;
      position: relative;
      p{
        font-size: 36px;
        // margin-bottom: 20px;
        color:#d9b672;
        float: left;
        // position: relative;
        font-family: 'SourceHanSans-Regular';
        font-weight: bold;
      }
      &::after{
        content: '';
        width: 100px;
        height: 6px;
        background-color: #d9b672;
        position: absolute;
        left: 0;
        bottom: -21px;
      }
    }
    .content{
      width: 600px;
      float: right;
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
  .FormImg{
    width: 20%;
    float: left;
    img{
      width: 40%;
    }
  }
  .form-group{
    .col-md-10{
      text-align: center;
    }
  }
  .btn-default{
      // width: 20%;
      // float: right;
      background: @buy_color;
      height: 60px;
      line-height: 60px;
      color:#fff;
      border:none;
      margin-top: 30px;
      font-size: 24px;
      border-radius: 5px;
      padding: 0 45px;
      font-family: 'SourceHanSans-Regular';
  }
  #Anwers{
    position: relative;
  .form-group{
    width: 100%;
    display: block;
    // &:nth-child(3){
    //   position: absolute;
    //   width: 50%;
    //   right: 0px;
    //   top:0px;
    // }
    .fieldset{
      border:none;
      padding: 0px;
    }
    h4{
      background: #fff;
      background-size: 100% 100%;
      display: inline-block;
      height: 3.5rem;
      width: 100%;
      text-align: center;
      line-height: 3.5rem;
      font-size: 1.2rem;
      margin-bottom: .5rem;
      border:1px solid #808080;
      border-radius: 2px;
      display: none;
    }
    input[type="text"],input[type="email"]{
      border:1px solid #808080;
      height: 58px;
      line-height: 58px;
      width: 100%;
      box-sizing: border-box;
      border-radius: 2px;
      margin-bottom: .5rem;
      text-indent: 1rem;
      outline: none;
      font-size: 20px;
      font-family: 'SourceHanSans-Regular';
    }
    textarea{
      border:1px solid #808080;
      height: 218px;
      width: 100%;
      box-sizing: border-box;
      border-radius: 2px;
      margin-bottom: .5rem;
      outline: none;
      font-size: 20px;
      font-family: 'SourceHanSans-Regular';
      text-indent: 1rem;
      padding-top: 10px;
      // color: #cccccc;
    }
    p[name="error"]{
      color:red;
      margin-bottom:.5rem;
    }
  }
 }
}
.PcContact .CmsContent{
    position: relative;
    width: 1200px;
    margin: 0 auto;
   .aboutUSImg{
     width:10%;
     float:left;
     box-sizing: border-box;
     display: flex;
     justify-content: flex-end;
     margin-left: 3%;
     padding-top: 10%;
     img{
       width: 100%;
     }
   }
   .aboutUSbg{
     width: 83%;
     float: left;
     background: #FFF;
     border-radius: 10px;
     padding: 20px;
     .innerBox{
       border:1px solid #000;
       border-radius: 10px;
       position: relative;
        min-height: 400px;
        padding: 30px;
        word-break: break-all;
        &::before{
            content: '';
            width: 98%;
            height: 20px;
            background-size: 100%;
            position: absolute;
            top: 10px;
            left: 1%;
        }
        &::after{
            content: '';
            width: 98%;
            height: 20px;
            background-size: 100%;
            position: absolute;
            bottom: 10px;
            left: 1%;
        }
     }
   }
  .CmsMapImg{
    width: 30%;
    position: absolute;
    right: 0px;
    top: 3rem;
    text-align: right;
    img{
      width:50%;
    }
  }
  table.aboutus_table{
    width: 100% !important;
    border-spacing: 0;
    tbody{
      tr{
        td{
          width: 50%;
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
          }
          >h2{
            text-align: center;

            font-size: 36px;
            font-family: 'SourceHanSans-Heavy';
            // background: linear-gradient(90deg, #db9307, #f4de91, #db9307);
            // -webkit-background-clip: text;
            color: #d9b672;
            display: flex;
            justify-content: center;
            letter-spacing: 2px;
          }
          p{
            font-family: 'SourceHanSans-Regular';
            font-size: 18px;
            color: #333333;
            text-align: justify;
            word-break: break-word;
            padding: 0 20px !important;
            margin-top: 15px !important;
          }

        }
        td{
            >h2:first-child{
              margin-top: 40px;
            }
          }
      }
    }
  }

  .productlist{
    margin-top: 60px;
    >h2{
      text-align: center;

      font-size: 36px;
      font-family: 'SourceHanSans-Heavy';
      // background: linear-gradient(90deg, #db9307, #f4de91, #db9307);
      // -webkit-background-clip: text;
      color: #d9b672;
      display: flex;
      justify-content: center;
      letter-spacing: 2px;
      width: 50%;
      margin: 0 auto;
    }
    p{
      font-family: 'SourceHanSans-Regular';
      font-size: 18px;
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
  }
  .product_table{
    width: 100%;
    margin-top: 28px;
    border-spacing: 0;
    tr{
      margin-bottom: 38px;
      display: inline-flex;
      td{
        text-align: center;
        width: 362px;
        border: 2px solid #ebd8b4;
        border-radius: 3px;
        box-sizing: border-box;
        border-spacing: 0;
        padding: 0 6px;
        box-sizing: border-box;
        &:nth-child(2n){
          margin: 0 55px;
          display: block;
        }
      }
    }
  }
}
.Engap{
  .CmsContent table.aboutus_table tbody tr td {
    > h2{
      letter-spacing:0;
      font-size: 34px;
      &:first-child{
        margin-top: 10px;
      }
    }
    p{
      font-size: 16px;
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
        // background-image: linear-gradient(90deg, #db9307, #f4de91, #db9307);
        // color: #000;
        // padding: 5px 60px;
        // display: table;
    }
  }
  .TitleBgNo{
    position: static;
    transform: translateX(0);
    margin: 50px auto;
    width: 100%;
    .innerBoxText{
      margin: 0;
      // height: 4rem;
      margin: 0 auto;
    }
  }
}

.CmsNormal{
  width: 100%;
  display: inline-block;
  background: #FFF;
  padding-bottom: 20px;
}
// .TitleBg{
//   width: 500px;
//   height: 70px;
//   border:1px solid #ffffff;
//   margin: 0 auto;
//   padding: 10px;
//   margin-bottom: 20px;
//   .innerBoxText{
//     width: 100%;
//     height: 100%;
//     background:#ffffff;
//     color: #333333;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 40px;
//     font-weight: 700;
//     font-family: 'Arial';
//   }
// }
.Cmsbg{
    width:100%;
    // background: url('/images/pc/pccontact_01.jpg') no-repeat center center;
    background-size:100% 100%;
    display: block;
    box-sizing: border-box;

}
.Banner {
  width: 100%;
  height: 20rem;
  display:flex;
  align-items: center;
  padding-left:2rem;
  .innerBox{
      width: 1200px;
      margin: 0 auto;
  }
}
.Banner img {
  width: 100%;
  height: 20rem;
}
.CmsMap {
    width: 1200px;
    margin: 0 auto;
    margin-bottom: 80px;
    // float: left;
    // margin-left: 5%;
    display: flex;
    flex-wrap: wrap;
    // padding-top: 5rem;
    .cmsbody{
      width:100%;
    }
    .addressBox{
      width: 100%;
      float: left;
      display: flex;
      flex-wrap: wrap;
    }
}

.CmsMap
{
  position: relative;
  .addressIcon{
    width: 100%;
    font-size: 1.4rem;
    margin-bottom: 2rem;
    padding-top: 2rem;
    align-items: center;
    display: flex;
    i{
      background: url('/images/mobile/Mobile-Contact-05.png') no-repeat center center;
      background-size: 100% 100%;
      width:2rem;
      height:2rem;
      display: inline-block;
      margin-right:.5rem;
    }
  }
  .perList{
    margin-bottom: 3rem;
    width: 48%;
    margin-right:4%;
    &:nth-child(2n){
      margin-right:0%!important;
    }
    p{
      font-size:1.4rem;
      cursor: pointer;
      &:nth-child(1):hover{
        color:#262626 ;
      }
    }
  }
}
.CmsContent_health{
  width: 100%;
  background:  url(/images/pc/healthback.png) no-repeat bottom center;
  padding-bottom: 40px;
  background-size: contain;
  margin-bottom: -20px;
  position: relative;

  .contentBody{
    width: 1200px;
    margin: 0 auto;
    background-color: #fff8ea;
    padding: 60px 100px 60px;
    position: relative;
    margin-bottom: 210px;
    box-sizing: border-box;
    /deep/ h2{
      text-align: center;
      font-size: 36px;
      font-family: 'SourceHanSans-Heavy';
      // background: linear-gradient(90deg, #db9307, #f4de91, #db9307);
      // -webkit-background-clip: text;
      color: #d9b672;
      // width: 310px;
      // margin-left: 160px;
      transition: all 0.3s;
      margin-bottom: 15px;
    }
    /deep/ p{
      color: #333333;
      font-size: 18px;
      font-family: 'SourceHanSans-Regular';
      line-height: 28px;
      text-align: justify;
      img{
        // position: absolute;
        // // bottom: 310px;
        // left: 50%;
        // transform: translateX(-50%);
        border-radius: 5px;
      }
    }
  }
}
.CmsContent_social{
  margin-bottom: 40px;
  .contentBody{
    /deep/ h2{
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
      table{
      width: 100%;
      tr{
        td{
          text-align: center;
          padding: 10px 20px;
          display: inline-block;
          width: 25%;
          box-sizing: border-box;
          border: none;
          margin: 0;
          border-radius: 0;
          p{
            margin-top: 10px;
            img{
              width: 100%;
              height: 110px;
              display: block;
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
          font-size: 18px;
          a{
            color: #d9b672;
            font-family: 'SourceHanSans-Regular';
            font-size: 18px;
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
.contentBody{
    /deep/ h2{
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
    // /deep/ table{
    //   width: 100%;
    //   tr{
    //     margin-bottom: 26px;
    //     display: flex;
    //     td{
    //       text-align: center;
    //       padding: 10px 20px;
    //       display: inline-block;
    //       width: calc( 25% - 26px );
    //       box-sizing: border-box;
    //       border: 1px solid #999999;
    //       border-radius: 3px;
    //       margin: 0 13px;
    //       transition: all 0.3s;
    //       p{
    //         margin-top: 10px;
    //         transition: all 0.3s;
    //         a{
    //           color: #333;
    //           cursor: pointer;
    //         }
    //       }
    //       &:hover{
    //         border: 1px solid transparent;
    //         background-color: #fff8ea;
    //         p{
    //           color: #d9b672;
    //           a{
    //             color: #d9b672;
    //           }
    //         }
    //       }
    //     }

    //   }
    //   // &:last-child{
    //   //   td{
    //   //     border-top: 1px solid #999999;
    //   //     width: 100%;
    //   //     color: #d9b672;
    //   //     font-family: 'SourceHanSans-Regular';
    //   //     font-size: 18px;
    //   //   }
    //   // }
    // }
  }

.clear {
  clear: both;
}
.Engap{
  .DetailTitle {
    .TitleBg {
      top: 210px;
      .innerBoxText{
        font-size: 34px;
        width: 245px;
        margin-left: 8rem;
        line-height: 38px;
        word-break: keep-all;
        // padding: 10px 45px;
        // width: 350px;
        box-sizing: border-box;
        // height: 24rem;
      // display: flex;
      // justify-content: center;
      // align-items: center;
      }
    }

  }

}
@media screen and (max-width: 1440px){
  .DetailTitle{
    .TitleBg{
      // top: 168px !important;
      .innerBoxText{
        width: 310px;
        margin-left: 214px;
      }
    }
    .TitleBgNo{
      .innerBoxText{
        margin: 50px auto;
        // width: 100%;
        margin: 0;
        height: 4rem;
        margin: 0 auto;
      }

    }
    img{
      height: 600px;
    }

  }
  .Engap{
  .DetailTitle {
    .TitleBg {
      top: 40px;
      .innerBoxText{
        font-size: 34px;
        width: 245px;
        margin-left: 11rem;
        line-height: 38px;
        word-break: keep-all;
        height: 19rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .TitleBgEng{
      top: 170px;
    }
  }
}
}
@media screen and (max-width: 1366px){
  .DetailTitle{
    .TitleBg{
      top: 168px;
      .innerBoxText{
        // width: 310px;
        margin-left: 214px;
      }
    }
    .TitleBgNo{
      .innerBoxText{
        // height: 4rem;
        // margin: 50px auto;
        // width: 100%;
      }

    }
    img{
      height: 600px;
    }
  }
  .Engap{
  .DetailTitle {
    .TitleBg {
      top: 40px;
      .innerBoxText{
        font-size: 34px;
        width: 245px;
        margin-left: 15.5rem;
        line-height: 38px;
        word-break: keep-all;
        height: 19rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .TitleBgEng{
      top: 170px;
    }
  }
}
}
</style>
