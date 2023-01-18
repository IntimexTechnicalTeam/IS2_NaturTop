<template>
<div class="header-layout"  v-cloak>
  <div class="headerBg" :class="{'Engap': $Storage.get('locale') === 'E'}">
      <div class="headerTop fix">
          <!-- logo开始 -->
          <div class="logoBox">
              <a href="/" v-if="!showInFixed"><img src="/images/pc/pcindex_09.png"></a>
              <a href="/" v-if="showInFixed"><img src="/images/pc/pcindex_14.png"></a>
          </div>
          <!-- logo结束 -->
          <div class="inner">
              <!-- 搜索框开始 -->
              <div class="search-box">
                <span class="searchBtn" @click="searchFun(key)"></span>
                <input type="text" v-model="key" class="inputBox" />
              </div>
              <!--搜索框结束  -->

              <!-- 切换语言开始 -->

              <div class="langBox">
                  <!-- <InsLangSwitch></InsLangSwitch> -->
                  <InsLangLi/>
              </div>
              <CodeLi/>
              <!-- 切换语言结束 -->
              <!-- 会员登陆开始 -->
              <InsLogin class="memberLogin"></InsLogin>
              <!-- 我的喜爱开始 -->
              <!-- <div class="cartTop">
                  <router-link to="/account/MyFavorite">
                          <i class="handle-icon fav-icon"></i>
                  </router-link>
              </div> -->
              <!-- 我的喜爱结束 -->
              <!-- 购物车开始 -->
              <Shopcart class="memberLogin"></Shopcart>
              <!-- 购物车结束 -->
          </div>
      </div>

      <!-- 导航栏开始 -->
      <Menu />
      <!-- 导航栏结束 -->
  </div>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
@Component({
  components: {
    Menu: () =>
      import('@/components/business/pc/header/InsMenu.vue'),
    Shopcart: () =>
      import('@/components/business/pc/header/InsShoppingCart.vue'),
    InsLogin: () =>
      import('@/components/business/pc/header/InsLogin.vue'),
    InsLangSwitch: () =>
      import('@/components/business/pc/header/InsLangSwitch.vue'),
    CodeLi: () =>
      import('@/components/business/pc/header/InsCodeLi.vue'),
    CodeSelect: () =>
      import('@/components/business/pc/header/InsCodeSelect.vue'),
    InsLangLi: () =>
      import('@/components/business/pc/header/InsLangLi.vue')
  }
})
export default class DefaultHeader extends Vue {
  @Prop() private showInFixed!: boolean;

  private key: string = '';

  getMenu () {
    this.$Api.promotion
      .getMenu()
      .then(result => {
        this.$store.dispatch('setHeaderMenus', result.ReturnValue.HeaderMenus);
        this.$store.dispatch('setFooterMenus', result.ReturnValue.FooterMenus);
      })
      .catch(error => {
        console.log(error);
      });
  }

  searchFun (key) {
    this.$store.dispatch('setSearchKey', key);
    if (key !== '') {
      this.$router.push({
        path: '/product/search',
        name: 'productSearch',
        params: {
          key: key
        }
      });
    } else {
      this.$router.push({
        path: '/product/search/-'
      });
    }
  }
  get currentlang () {
    return this.$i18n.locale;
  }
  private changLange (lang) {
    this.$Api.member
      .setUILanguage(lang)
      .then(result => {
        this.$i18n.locale = lang;
        localStorage.setItem('locale', lang);
        this.Reload();
      })
      .catch(error => {
        console.log(error);
      });
  }

  created () {
    this.$store.dispatch('setShopCart', this.$Api.shoppingCart.getShoppingCart());
  }

  mounted () {
    this.getMenu();
  }
}
</script>

<style scoped lang="less">
.showMenuYes{
  height:151px;
  transition:all 1s;
}
#header{
  z-index: 9999;
  top:0px;
  width: 100%;
  display: flex;
}
.headerBg{
   width: 100%;
   background:#fff;
   background-size: cover;
   display: inline-block;
   box-shadow: 0 0 10px 0 #d4d5d1;
}
.headerTop{
    width: 1200px;
    margin: 0 auto;
    padding-top: 24px;
    // height: 34px;
}
.headerTop .logoBox{
    width: 221px;
    float: left;
}
.logoBox a{
    display: flex;
}
.logoBox a img{
   width: 100%;
}
.headerTop .inner{
    float: right;
    display: flex;
    padding-top: 12px;
    align-items: center;
}
.search-box {
    border: 1px solid #333333;
    width: 230px;
    display: flex;
    float: left;
    align-items: center;
    margin-right: 20px;
    box-sizing: border-box;
    border-radius: 3px;
}
.searchBtn{
    width: 20px;
    height: 21px;
    display: inline-block;
    background: url('/images/pc/pcindex_03.png') no-repeat center center;
    background-size: contain;
    cursor: pointer;
    margin-left: 10px;
}
.search-box .inputBox {
    width: 194px;
    float: left;
    border: none;
    background: transparent;
    line-height: 28px;
    text-indent: 10px;
}
.search-box  .btn-send {
    position: absolute;
    right: 10px;
    top: 6px;
    line-height: 1;
    background: none;
    border: none;
    color: #555;
}
.search-box form {
    position: relative;
    font-size: 12px;
}
.search-box input {
    font-family: inherit;
    font-size: inherit;
    font-style: inherit;
    font-weight: inherit;
    outline: 0;
}
.memberLogin{
    display: flex;
    float: left;
    align-items: center;
    position: relative;
    margin-right: 20px;
}
.cartTop{
    display: flex;
    float: left;
    align-items: center;
    position: relative;
    margin-right: 10px;
}
.langBox{
    display: flex;
    float: left;
    align-items: center;
    position: relative;
    justify-content: center;
    margin-left: 20px;
}
.langBox a{
   color:#323232;
   font-size: 14px;
    line-height: 32px;
    margin-right: 10px;
    width: 40px;
    display: inline-block;
    text-align: center;
}
.langBox a:nth-child(2){
    margin-right: 0px!important;
}
.langActive{
    background: #808080;
    color:#FFF!important;
}

.fav-icon {
    background: url('/images/pc/pcindex_08.png') no-repeat center center;
    display: inline-block;
    width: 25px;
    height: 25px;
    background-size: contain;
}

// new css
.header-layout {
 /deep/ .header_menu {
   width: 100%;
   background-color: #2DB368;
  //  border-bottom: 1px solid #cda975;
   margin-top: 27px;
   > ul {
    width: 1200px;
    margin: 0 auto;
    justify-content: center;
     > li {
      float: left;
      display: flex;
      align-items: center;
      position: relative;
      width: auto;
      justify-content: center;
      padding: 7px 23px;
      height: 40px;
      &::after{
          content: '';
          width: 1px;
          height: 21px;
          background-color: #fff;
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
        }
      > a {
        width: 100%;
        font-size: 16px;
        color: #fff;
        display: block;
        text-align: center;
        font-weight: 500;
        text-transform: uppercase;
        padding: 0;
        position: relative;
        font-family: 'SourceHanSans-Regular';
         padding: 6px 18px;
          border-radius: 5px;
          transition: all 0.3s;

      }
      &:last-child{

          &::after{
          content: '';
          display: none;
        }

      }

      &:hover{
        > a  {
          background: #ffffff;
          color: #2DB368;

        }
      }

      ul {
        box-shadow: 0 0 5px transparent;

        li {
          border: 0;
          > a {
            font-size: 18px;
            color: #666666;
            display: block;
            text-align: center;
            font-weight: 500;
            text-transform: uppercase;
            padding: 10px 5px;
          }

          &:hover{
             > a {
              background: #fff;
              color: #d9b672;
            }
          }
        }
      }
     }
   }
 }
}
.header-layout{
    .Engap{
    /deep/ .header_menu > ul > li {
      padding: 7px 20px;
      > a{
        text-transform: none;
        padding: 6px 12px;
      }
    }
  }
}
</style>
