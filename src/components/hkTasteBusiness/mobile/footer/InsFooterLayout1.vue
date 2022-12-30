<template>
 <div id="footer">
    <div class="footer-box">
          <p><img src="/images/pc/pcindex_14.png"></p>
          <div class="footerNav">
                  <div class="nav">
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
              </div>
          <!-- <div class="footerAccept">
            <p>{{$t('home.Weaccept')}}<img src="/images/mobile/pcindex_15.png"></p>
          </div> -->
          <div class="footer_Contactus">
            <!-- <div class="title">
              {{footername}}
            </div> -->
            <div class="cnetr" v-html="footercontent"></div>
          </div>
          <div class="footer_information">
            <div class="cnetr" v-html="footercontent2"></div>
          </div>
    </div>
    <div class="footerCpy">
            <p>Copyright {{currentYear}} © Natur Top Powerd by Eventizer
            <a href="https://www.intimex.hk/" target="_blank">
              <img src="/images/mobile/footerlogo.png">
            </a>
            </p>
          </div>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  components: {}
})
export default class InsFooter extends Vue {
  currentYear: number = 0;
  clickIndex: number = 0;
  footerMenus: any[] = [];
  footername: string = '';
  footercontent: string = '';
  footercontent2: string = '';
  showMeun (item, index) {
    $('.sub' + index).slideToggle();
  }
  closeSlideMenu (n) {
    this.$store.dispatch('isShowMenu', false);
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
  // To (n) {
  //   return n.Type === 1 ? '/cms/catDetail/' + n.Value.Id : n.Type === 2 ? '/CMS/content/' + n.Value.Id : n.Type === 3 ? '/RegNPay/Form/' + n.Value.Id : n.Type === 4 && !this.$store.state.catMenuType ? '/product/cat/' + n.Value.Id : n.Type === 4 && this.$store.state.catMenuType ? '/product/search/-?catalogs=' + JSON.stringify([parseInt(n.Value.Id)]) + '&type=0' : n.Type === 5 ? '/product/search/-?attrs=' + JSON.stringify([{ Id: parseInt(n.Value.Id), Vals: [] }]) + '&type=0' : '/product/search/-?attrs=' + JSON.stringify([{ Id: parseInt(n.ParentId), Vals: [parseInt(n.Value.Id)] }]) + '&type=0';
  // }
  getMenu () {
    this.$Api.promotion.getMenu().then((result) => {
      this.footerMenus = result.ReturnValue.FooterMenus;
    });
  }
  getFooter () {
    this.$Api.cms.getContentByDevice({ Key: 'home_footer', IsMobile: true }).then((result) => {
      this.footername = result.CMS.Title;
      this.footercontent = result.CMS.Body;
      console.log(result, 'ddd');
    });
    this.$Api.cms.getContentByDevice({ Key: 'footer_information', IsMobile: true }).then((result) => {
      this.footercontent2 = result.CMS.Body;
    });
  }
  created () {
    var date = new Date();
    this.currentYear = date.getFullYear();
    this.getMenu();
    this.getFooter();
  }
  @Watch('$route', { deep: true })
  onIdChange () {
    $('.submeunMain').hide();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.submeunMain{
  display: none;
}
.SubMeun0{
  display: none;
}
.SubMeun1{
  display: none;
}
#footer{
  width: 100%;
  // background: url('/images/mobile/MobileIndex_04.jpg') no-repeat center center;
  background-color: #d9b672;
  background-size: cover;
  display: inline-block;
  .footer-box{
    width: 100%;
    margin: 0 auto;
    padding-top: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #fff;

    .footerAccept{
      width: 100%;
      >p{
        font-size: 1.4rem;
        color:#fff;
        display: flex;
        align-items: center;
        justify-content: center;
        img{
          display: block;
          margin-left: 1rem;
        }
      }
    }
    .footerNav{
      width: 80%;
      margin: 0 auto;
      margin-top: 2rem;
      margin-bottom: 2rem;
      .nav>ul>li{
        width: 100%;
        display: inline-block;
        // line-height: 4rem;
        text-align: center;
        // margin-bottom: 1rem;
        position: relative;
        height: 3rem;
        line-height: 3rem;
        >ul{
          position: relative;
        }
        >ul>li{
        width: 100%;
        display: inline-block;
        background: transparent;
        // border-radius: 10px;
        height: 3rem;
        line-height: 3rem;
        text-align: center;
        margin-bottom: .5rem;
          >a{
            font-size: 1.6rem;
            color:#fff;
            font-weight: 500;
            text-decoration: none;
          }
        }
        >a{
          font-size: 1.4rem;
          color:#fff;
          font-weight: 500;
          text-decoration: none;
          position: relative;
          display: block;
          // background: #ffffff;
          // border-radius: 5px;
          // margin-bottom: .5rem;
          i{
               background: url('/Images/mobile/downicon.png') no-repeat center center;
               background-size: contain;
               width: 1.2rem;
               height: 1.2rem;
               display: inline-block;
               position: absolute;
               right: 1rem;
               top: 1.4rem;
          }
        }
      }
    }

    .contactBox{
    width: 100%;
    display: inline-block;
    margin-top: 2rem;
      .w50{
        width: 50%;
        float: left;
        >p:nth-child(1){
          font-size: 1.4rem;
          text-align: center;
          color: #FFF;
          padding-bottom: .5rem;
        }
        >p:nth-child(2){
            font-size:2.2rem;
            text-align: center;
            color: #FFF;
        }
      }
    }
    >p{
      width:70%;
      margin: 0 auto;
      img{
        width: 100%;
      }
    }
    .footer_Contactus{
      text-align: center;
      margin-bottom: 2rem;
      .cnetr{

        /deep/ p{
          font-size: 1.4rem;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          a{
            font-size: 1.4rem;
          color: #fff;
          }
          img{
            margin-right: 1rem;
            display: block;
          }
        }
      }
    }
    .footer_information{
      width: 90%;
      margin: 0 auto;
      .cnetr{
        /deep/ p{
          text-align: center;
          font-size: 1.2rem;
          color: #fff;
          line-height: 2.4rem;
        }
      }
    }
  }
  .footerCpy{
      width: 100%;
      display: inline-block;
      margin-top: 1rem;
      padding-bottom: 1rem;
      >p{
        color:#FFF;
        font-size: 1.2rem;
        text-align: center;
        img{
          width: 4rem;
          display: inline-block;
          margin-left: 1rem;
          vertical-align: middle;
        }
      }
    }
}
</style>
