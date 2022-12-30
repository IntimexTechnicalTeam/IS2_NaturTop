<template>
    <!-- <div class="langSwitch">
        <p @click="changeLang('S')" :class="{'active': $Storage.get('locale') === 'S'}">简</p> |
        <p @click="changeLang('C')" :class="{'active': $Storage.get('locale') === 'C'}">繁</p> |
        <p @click="changeLang('E')" :class="{'active': $Storage.get('locale') === 'E'}">Eng</p>
    </div> -->
    <div class="langSwitch" v-on:blur="showList=false">
      <div class="langList"  v-on:click.stop="showList=!showList">
          <div class="langOne curLang">
            <p v-if="currentLang==='C'">繁</p>
            <!-- <p v-if="currentLang==='S'">简</p> -->
            <p v-if="currentLang==='E'">ENG</p>
            <span class="langArrow" :class="{'rotate':showList}"></span>
          </div>
          <transition name="el-fade-in-linear" >
          <div class="langOne langSelect" v-if="showList">
            <p v-if="currentLang!=='E'" @click="changeLang('E')">ENG</p>
            <p v-if="currentLang!=='C'" @click="changeLang('C')">繁</p>
            <!-- <p v-if="currentLang!=='S'" @click="changeLang('S')">简</p> -->
          </div>
          </transition>
      </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class InsLangLi extends Vue {
  showList:boolean = false;
  get currentLang () {
    return this.$Storage.get('locale');
  }
  changeLang (lang) {
    this.$Api.member.setUILanguage(lang).then(result => {
        this.$i18n.locale = lang;
        localStorage.setItem('locale', lang);
        this.Reload();
      })
      .catch(error => {
        console.log(error);
      });
  }
}
</script>
<style scoped lang="less">
.header-default{
  .curLang{
    p{
      height:20px;
      font-size:16px;
    }
    .langArrow{
      width:20px;
      height:20px;
    }
  }
  .langSelect{
    p{
      height:25px;
      font-size:16px;
    }
  }

}
.curLang{
  p{
    // height:39px;
    // line-height: 34px;
  }
}
.langSelect{
  p{
    height:29px;
  }
}
.langOne{
  width: 80px;
  // display: flex;
  // justify-content: space-between;
  p{
    // width:54px;
    font-size:16px;
    line-height: 29px;
  }
  .langArrow{
    width:8px;
    height:7px;
  }
}
.langSwitch {
  width: 100px;
    position: relative;
    cursor: pointer;
    z-index: 9;
    .langList{
      width:100%;
      .curLang{
        border:1px solid #333333;
        background-color: transparent;
        box-sizing: border-box;
        border-radius: 3px;
        color: #333333;
        display: flex;
        // justify-content: space-between;
        justify-content: center;
        position: relative;
      }
      .langSelect{
        border-top: 0;
        box-sizing: border-box;
        background:#fff;
        // border: 1px solid #333333 ;
        border-radius: 3px;
        border-top:0;
        overflow: hidden;
        position:absolute;
        left:0;
        top:31px;
        p{
          width:100%;
          // padding-right: 35%;
          box-sizing: border-box;

          border:1px solid #333333;
          border-top: 0;
          transition: all 0.3s;
          color: #666666 !important;
          box-sizing: border-box;
          border-radius: 3px;
          &:last-of-type{
            // border-bottom: 0;
          }
          &:hover{
            font-weight: bold;
          }
        }
      }
      .langOne{
        width: 80px;
        // height: 31px;
        box-sizing: border-box;
        p{
          display: flex;
          justify-content: center;
          align-items: center;
          color: #333;
          padding: 0;
        }
        .langArrow{
          display: block;
          background: url(/images/pc/l-BlueArrow.png) right center no-repeat;
          background-size: 8px;
          transition: all 0.3s;
          position: absolute;
          top: 50%;
          transform: translateY(-50%) rotate(0);
          right: 7px;
          &.rotate{
            transform: rotate(180deg) translateY(50%);
          }
        }
      }
    }

}
</style>
