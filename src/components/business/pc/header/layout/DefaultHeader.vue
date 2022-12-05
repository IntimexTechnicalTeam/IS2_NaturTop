<template>
<div class="header-layout"  v-cloak>
  <div class="headerBg">
      <div class="headerTop">
          <div class="inner">
              <!-- 搜索框开始 -->
              <div class="search-box">
                <input type="text" v-model="key" class="inputBox" />
                <span class="searchBtn" @click="searchFun(key)"></span>
              </div>
              <!--搜索框结束  -->
              <!-- 会员登陆开始 -->
              <InsLogin class="memberLogin"></InsLogin>
              <!-- 我的喜爱开始 -->
              <div class="cartTop">
                  <router-link to="/account/MyFavorite">
                          <i class="handle-icon fav-icon"></i>
                  </router-link>
              </div>
              <!-- 我的喜爱结束 -->
              <!-- 购物车开始 -->
              <Shopcart class="memberLogin"></Shopcart>
              <!-- 购物车结束 -->
              <!-- 切换语言开始 -->
              <CodeSelect/>
              <div class="langBox">
                  <InsLangSwitch></InsLangSwitch>
              </div>
              <!-- 切换语言结束 -->
          </div>
      </div>
      <!-- logo开始 -->
      <div class="logoBox" v-if="!showInFixed">
          <a href="/"><img src="/images/pc/pcindex_09.png"></a>
      </div>
      <!-- logo结束 -->
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
    CodeSelect: () =>
      import('@/components/business/pc/header/InsCodeSelect.vue')
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
    padding-top: 10px;
    height: 34px;
}
.headerTop .inner{
    float: right;
}
.search-box {
    border: 1px solid #808080;
    width: 340px;
    display: flex;
    float: left;
    align-items: center;
    margin-right: 20px;
}
.searchBtn{
    width: 25px;
    height: 25px;
    display: inline-block;
    background: url('/images/pc/pcindex_03.png') no-repeat center center;
    background-size: 100%;
    cursor: pointer;
}
.search-box .inputBox {
    width: 305px;
    float: left;
    border:none;
    background: transparent;
    line-height: 30px;
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
    margin-right: 10px;
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
.logoBox{
    width: 100%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 40px;
}
.logoBox a{
    display: flex;
}
.logoBox a img{
   width: 100%;
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
   width: 1200px;
   margin: 30px auto 10px;
   > ul {
     > li {
      float: left;
      display: flex;
      align-items: center;
      position: relative;
      width: 14.28%;

      > a {
        width: 100%;
        font-size: 20px;
        color: #666666;
        display: block;
        text-align: center;
        font-weight: 500;
        text-transform: uppercase;
        padding: 10px 5px;
      }

      &:hover{
        > a  {
          background: @base_color;
          color: #fff;
        }
      }

      ul {
        box-shadow: 0 0 5px #ccc;

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
              background: @base_color;
              color: #fff;
            }
          }
        }
      }
     }
   }
 }
}
</style>
