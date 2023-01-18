<template>
    <div class="menu_headerTop">
        <div class="headerTop">
            <div class="left">
                <ins-login />
                <ins-lang-switch class="headerLang" />
                <CodeSelect class="header-code" />

            </div>
            <div class="right">
                <img class="close-meun" src="/images/mobile/out.png" @click="showSlideMenu" v-show="this.$store.state.isShowMenu"  />
            </div>

        </div>

        <div class="header_logo" v-if="!this.FrontE.slideMenu.Embedded">
            <i class="el-icon-close" @click="closeSlideMenu"></i>
        </div>
        <div class="searchBox">
            <div class="searchcentre">
                <input type="text" v-model="searchKey" />
                <span class="search_btn"  @click="searchFun(searchKey)"><img src="/images/mobile/searchbtn.png"></span>
            </div>
        </div>
        <div id="menu">
            <Menu :backColor="'@base_color'" :textColor="'#fff'" :uniqueOpened="true" />
        </div>
        <!-- <div class="menu_footer">
            <div class="innerShare">
                <a href="https://www.facebook.com/hktastefood/" class="nav" target="_blank"><img src="/images/mobile/facebook.png"/></a>
                <a href="https://www.facebook.com/hktastefood/" class="nav" target="_blank"><img src="/images/mobile/ig.png"/></a>
                <a href="https://www.youtube.com/embed/videoseries?list=PLeU-XfKN4KcjVolI4daTvRI2oNOSLCILM"  class="nav" target="_blank"><img src="/images/mobile/youtube.png" /></a>
            </div>
        </div> -->
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
    InsLogo: () => import('@/components/base/mobile/InsLogo.vue'),
    Menu: () => import('@/components/business/mobile/header/InsElMenu.vue'),
    InsLangSwitch: () => import('@/components/business/mobile/header/InsLangLi.vue'),
    InsLogin: () => import('@/components/business/mobile/header/InsLogin.vue'),
    CodeSelect: () =>
      import('@/components/business/mobile/header/InsCodeLi.vue')
  }
})
export default class InsMenuLayout extends Vue {
  showMemNav: boolean = false;
  searchKey: string = '';

closeDialog () {
    this.$store.dispatch('isShowMenu', false);
  }
  showSlideMenu () {
    let isShow = !JSON.parse(JSON.stringify(this.menuShow));
    this.$store.dispatch('isShowMenu', isShow);
  }

  get menuShow () {
    return this.$store.state.isShowMenu;
  }

  handleOpen (key, keyPath) {
    console.log(key, keyPath);
  }
  handleClose (key, keyPath) {
    console.log(key, keyPath);
  }

  closeSlideMenu () {
    this.$store.dispatch('isShowMenu', false);
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
      this.$store.dispatch('isShowMenu', !this.$store.state.isShowMenu);
    } else {
      this.$router.push({
        path: '/product/search/-'
      });
      this.$store.dispatch('isShowMenu', !this.$store.state.isShowMenu);
    }
  }

  get user () {
    return this.$store.state.user;
  }

  get isLogin () {
    return this.$store.state.isLogin;
  }
}
</script>

<style lang="less">
.sidebar-container {
    background-color: #fff !important;
}
.menu_footer span{
    display: flex;
    float: left;
    border:1px solid #eee;
    padding-top: .5rem;
    padding-bottom: .5rem;
    padding-left: 2rem;
    padding-right: 2rem;
    margin-right: 1rem;
    font-size: 1.4rem;
}
.innerShare{
    width: 90%;
    margin: 0 auto;
    display: flex;
    margin-top: 2rem;
    padding-bottom: 5rem;
    align-items: center;
    justify-content: center;
}
.innerShare a {
    display: inline-block;
    margin-right: 1rem;
    vertical-align: middle;
}
.innerShare a img {
    width: 3rem;
}
.searchBox{
    width: 100%;
    margin-top: 1rem;

    margin-bottom: 2rem;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 2rem;
    .searchcentre{
        height: 4rem;
    margin: 0 1.5rem;
        border:2px solid #9f9f9f;
        box-sizing: border-box;
        border-radius: 6px;
        position: relative;
    overflow: hidden;
    }
    input{
        width: calc(100% - 4rem);
        height: 3.8rem;
        margin: 0 auto;
        text-indent: 10px;
        border:none;
        outline: none;
        margin-top: -2px;
        margin-left: -2px;
    }
    .search_btn{
        position: absolute;
        right: 0px;
        top:0rem;
        width: 3.8rem;
        height: 3.8rem;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: -2px;
        margin-right: -2px;
        margin-right: 0.5rem;
        img{
            width: 3rem;
            margin: 0 auto;
            display: block;

        }
    }
}
#menu {
    .el-submenu__icon-arrow {
        display: none;
    }

    .el-submenu__title {
        padding-top: 0.375rem;
        padding-bottom: 0.375rem;
        border: 1px solid #666;
        height: auto!important;
        line-height: unset;
        background-color:#fff!important;
        .name{
            font-size: 1.6rem!important;
            color:#666;
        }
    }

    .el-menu {
        // width: 90%;
        margin: 0 auto;
        padding: 0 3rem;
        background-color: transparent;
        border: 0;
        margin-bottom: 1rem;
        margin-top: 1rem;
        .el-submenu__icon-arrow {
            display: block;
            font-size: 1.6rem;
        }

        > li {
            height: auto;
            line-height: unset;
            text-align: center;
            margin-bottom: 1rem;
             >a {
                 color:#fff;
                 background: #cccccc;
                 background-size: 100% 100%;
                 display:block;
                 width: 100%;
                 padding-top: .8rem;
                 padding-bottom: .8rem;
                 margin: 0 auto;
                 font-weight: 500;
                 box-sizing: border-box;
                 border-radius: 6px;
                 b{
                     color:#fff;
                     display: block;
                     width: 100%;
                     font-weight: 500;
                     font-size: 1.6rem;
                    //  &:nth-child(1){
                    //     color:#fff;
                    //     font-weight: 500;
                    //     font-size: 1.6rem;
                    //  }
                    //  &:nth-child(2){
                    //      color:#262626;
                    //      font-size: 1.2rem;
                    //  }
                 }
            }

            a {
                text-decoration: none;
            }
            a.router-link-active{
                background-color: #2DB368;
                position: relative;
                &::before{
                    content: '';
                    width: 1.2rem;
                    height: 1.6rem;
                    background: url(/images/mobile/menuicon.png) no-repeat;
                    position: absolute;
                    background-size: contain;
                    left: 3rem;
                    top: 50%;
                    transform: translateY(-50%);
                }
                &::after{
                    content: '';
                    width: 1.2rem;
                    height: 1.6rem;
                    background: url(/images/mobile/menuicon.png) no-repeat;
                    position: absolute;
                    background-size: contain;
                    right: 3rem;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
        }

        li {
            line-height: unset;
            padding: 0 !important;
            min-width: unset;
        }
    }
}
#menu .is-opened > .el-submenu__title{
    background: #666!important;
    color:#fff!important;
    .name{
        color:#FFF!important;
    }
}
#menu .is-opened > .el-submenu__title .el-submenu__icon-arrow{
    color:#fff!important;
}
</style>

<style scoped lang="less">
.header_logo {
    height: 7rem;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem 0 1.5rem;
    border-bottom: 4px solid #acbd30;
    background-color: #fff;

    .el-icon-close {
        color: #777777;
        font-size: 2.8rem;
    }

    a {
        width: 12rem;
    }

    .slide-menu {
        cursor: pointer;
    }
}

/deep/ .langSwitch {
    font-size: 1.5rem;
    color: #106919;
    text-align: center;
    p {
        font-size: 1.5rem;
        display: inline-block;
        color: #fff;
        // margin: 0 0.8rem;

        &.active {
            color: #127437;
            font-weight: bold;
        }
    }
}
.menu_headerTop{
    .headerTop{
        height: 6rem;
        background-color: #2DB368;
        padding: 0 1.5rem;
        .left{
            float: left;
            display: flex;
            height: 6rem;
            align-items: center;
        }
        .right{
            float: right;
            display: flex;
            height: 6rem;
            align-items: center;
            img{
                width: 2rem;
            }
        }
    }
}
</style>
