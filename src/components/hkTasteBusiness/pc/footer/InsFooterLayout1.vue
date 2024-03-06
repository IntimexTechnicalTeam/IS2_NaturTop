<template>
<div id="footer">
  <div class="footbg">
    <div class="footerMain">
        <div class="footerTop">
            <!-- <p><span>whatsapp&nbsp;{{$t('home.Order')}}</span><b>6289 1789</b></p>
            <p><span>{{$t('home.TelSearch')}}</span><b>6289 1789</b></p> -->
            <p><img src="/images/pc/pcindex_14.png" /></p>
        </div>
        <div class="footerBotttom" :class="{'Engap': $Storage.get('locale') === 'E'}">
          <div class="footerLeft">
              <ul>
          <li
            v-for="(item, index) in footerMenus"
            :key="index"
            class="indexMeun"
          >
            <a
              href="javascript:;"
              v-if="item.Type === -1"
              @click="toUrl(item.Url)"
            >
              {{ item.Name }}
            </a>
            <router-link v-else :to="To(item)" slot="title">
              {{ item.Name }}
            </router-link>
            <i
              :class="{ downIcon: item.showSub, upIcon: !item.showSub }"
              class="downIcon"
              @click="showMeun(item, index)"
              v-if="item.Childs && item.Childs.length > 0"
            ></i>
            <transition name="sub-comments">
              <ul
                v-show="item.showSub"
                v-if="item.Childs && item.Childs.length"
                :class="'SubMeun' + index"
              >
                <li v-for="(child, index2) in item.Childs" :key="index2">
                  <router-link :to="To(child)">{{ child.Name }}</router-link>
                  <!-- <router-link  @click.native="closeSlideMenu(item.Childs)" :to="To(item.Childs)" slot="title">
                                        <b>{{child.Name}}</b>
                                    </router-link> -->
                </li>
              </ul>
            </transition>
          </li>
        </ul>
          </div>
          <div class="footerRight">

            <div class="footer_Contactus">
              <!-- <div class="title">
                {{footername}}
              </div> -->
              <div class="cnetr" v-html="footercontent"></div>
            </div>
          </div>
          <div class="clear"></div>
          <div class="footer_information">
            <div class="cnetr" v-html="footercontent2"></div>
          </div>
        </div>
        <p class="footercopy">
             <span>Copyright {{currentYear}} © Wellfit Resources Limited Powerd by Eventizer
               <a href="https://eventizer.hk/" target="_blank">
               <img src="/images/pc/footerlogo.png">
               </a>
              </span>
             <!-- <span>{{$t('home.Weaccept')}}
               <img src="/images/pc/pcindex_15.png" />
              </span> -->
            </p>
    </div>
  </div>
</div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class InsFooterLayout1 extends Vue {
  currentYear: number = 0;
  footerMenus: any[] = [];
  footername: string = '';
  footercontent: string = '';
  footercontent2: string = '';
  goToTop () {
    let sTop = document.documentElement.scrollTop;
    let times = setInterval(() => {
      sTop -= 50;
      if (sTop <= 0) {
        document.documentElement.scrollTop = 0;
        clearInterval(times);
      } else {
        document.documentElement.scrollTop = sTop;
      }
    }, 1);
  }
  toUrl (n) {
    if (!n.IsNewWin && n.Url) {
      window.location.href = n.Url;
    } else if (n.IsNewWin && n.Url) {
      window.open(n.Url);
    }
  }
  To (n) {
    let url = '';
    if (n.Type === 0) {
      url = n.Url;
    } else if (n.Type === 1 && n.IsAnchor === false) {
      url = '/cms/catDetail/' + n.Value.Id;
    } else if (n.Type === 1 && n.IsAnchor === true) {
      url = '/CMS/catDetail/' + n.ParentId + '#' + n.Value.Id;
    } else if (n.Type === 2) {
      url = '/CMS/content/' + n.Value.Id;
    } else if (n.Type === 3) {
      url = '/RegNPay/Form/' + n.Value.Id;
    } else if (n.Type === 4 && !this.$store.state.catMenuType) {
      url = '/product/cat/' + n.Value.Id;
    } else if (n.Type === 4 && this.$store.state.catMenuType) {
      url =
        '/product/search/-?catalogs=' +
        JSON.stringify([parseInt(n.Value.Id)]) +
        '&type=0';
    } else if (n.Type === 5) {
      url =
        '/product/search/-?attrs=' +
        JSON.stringify([{ Id: parseInt(n.Value.Id), Vals: [] }]) +
        '&type=0';
    } else {
      url =
        '/product/search/-?attrs=' +
        JSON.stringify([
          { Id: parseInt(n.ParentId), Vals: [parseInt(n.Value.Id)] }
        ]) +
        '&type=0';
    }
    return url;
    // return n.Type === 1 ? '/cms/catDetail/' + n.Value.Id : n.Type === 2 ? '/CMS/content/' + n.Value.Id : n.Type === 3 ? '/RegNPay/Form/' + n.Value.Id : n.Type === 4 && !this.$store.state.catMenuType ? '/product/cat/' + n.Value.Id : n.Type === 4 && this.$store.state.catMenuType ? '/product/search/-?catalogs=' + JSON.stringify([parseInt(n.Value.Id)]) + '&type=0' : n.Type === 5 ? '/product/search/-?attrs=' + JSON.stringify([{ Id: parseInt(n.Value.Id), Vals: [] }]) + '&type=0' : '/product/search/-?attrs=' + JSON.stringify([{ Id: parseInt(n.ParentId), Vals: [parseInt(n.Value.Id)] }]) + '&type=0';
  }
  getMenu () {
    this.$Api.promotion.getMenu().then((result) => {
      this.footerMenus = result.ReturnValue.FooterMenus;
    });
  }
  getFooter () {
    this.$Api.cms.getContentByDevice({ Key: 'home_footer', IsMobile: false }).then((result) => {
      this.footername = result.CMS.Title;
      this.footercontent = result.CMS.Body;
      console.log(result, 'ddd');
    });

    this.$Api.cms.getContentByDevice({ Key: 'footer_information', IsMobile: false }).then((result) => {
      this.footercontent2 = result.CMS.Body;
      console.log(result, 'footer_information');
    });
  }
  created () {
    var date = new Date();
    this.currentYear = date.getFullYear();
    this.getMenu();
    this.getFooter();
  }
}
</script>

<style scoped lang="less">
/* 底部文件 */
.footbg{
    // background: #9f2f34 url('/images/pc/pcindex_05.jpg') no-repeat center bottom;
    background-color: #2DB368;
    background-size: cover;
    width: 100%;
    display: inline-block;
    padding-bottom: 10px;
    min-height: 278px;
}
.footerMain{
    width: 100%;
    margin: 0 auto;
}
.footerTop{
    text-align: center;
    padding-top: 60px;
    padding-bottom: 46px;
    width: 100%;
}
.footerTop p{
    text-align: center;
    display: inline-block;
    margin-right: 50px;
}
.footerTop p span{
    font-size: 14px;
    color: #FFF;
    line-height: 35px;
    margin-right: 15px;
}
.footerTop p b{
    font-weight: 100;
    font-size: 35px;
    color: #FFF;
    line-height: 35px;
}
.footerBotttom{
    width: 1200px;
    margin: 0 auto;
    margin-top: 0;
    margin-bottom: 56px;
}
.footerLeft{
    // float: left;
    width: 100%;
    text-align: center;
}
.footerLeft > ul{
    // float: left;
    // margin-right: 10%;
    display: flex;
    justify-content: center;

}
.footerLeft > ul >li{
    // width: 100%;
    // line-height: 30px;
        padding: 0 18px;
}
.footerLeft > ul >li >a{
    font-size:20px;
    color:#FFF;
    font-family: 'SourceHanSans-Regular';
    letter-spacing: 2px;
}
.footerLeft > ul >li >ul{
  width: 100%;
}
.footerLeft > ul >li >ul a{
    font-size: 16px;
    color:#FFF;
    display: inline-block;
    text-transform: uppercase;
}
.footerLeft > ul >li >ul a:hover{
   transform: translateY(-3px);
}
.footerLeft p{
    width: 100%;
    display: block;
    font-size: 14px;
    color: #fff;
    padding-top: 20px;
}
.footerLeft p img{
    display: inline-block;
    vertical-align: middle;
    padding-left: 10px;
}
.Engap .footerLeft{
  > ul > li{
    padding: 0px 10px;
    >a{
      letter-spacing: 0;
    }
  }
}
.footerRight{
    // float: right;
    // width: 674px;
    text-align: center;
}
.footerRight img{
  // width: 60%;
  display: block;
}
.footerRight .footer_Contactus{
  margin-top: 30px;
  margin-bottom: 30px;
  .title{
    font-size: 32px;
    border-bottom: 1px solid #fff;
    text-align: left;
    color: #fff;
    font-weight: bold;
    padding-bottom: 14px;
    width: 365px;
    font-family: 'SourceHanSans-Regular';
    font-weight: bold;
    letter-spacing: 5px;
  }
  .cnetr{
    text-align: center;
    padding-top: 14px;
    /deep/ p{
      font-size: 20px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    a{
      font-size: 20px;
      color: #fff;
    }
    img{
      margin-right: 18px;
      display: block;
    }
    }
  }
}
.footer_information{
  .cnetr{
    /deep/ p{
      font-size: 16px;
      color: #fff;
      text-align: center;
      font-family: 'SourceHanSans-Regular';
      line-height: 30px;
      letter-spacing: 1px;
    }
  }
}
.footercopy{
  width: 100%;
  display: block;
  border-top: 1px solid #fff;
  margin-top: 20px;
  text-align: center;
  padding-top: 10px;
}
.footercopy span:nth-child(1){
  // float: left;
  color:#FFF;
  font-size: 14px;
}
.footercopy span:nth-child(1) img{
  display: inline-block;
  vertical-align:middle;
  padding-left: 10px;
}
.footercopy span:nth-child(2){
  float: right;
  width: 40%;
  text-align: center;
  color:#FFF;
  font-size: 14px;
}
.footercopy span:nth-child(2) img{
  display: inline-block;
  vertical-align:middle;
  padding-left: 10px;
}
</style>
