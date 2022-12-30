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
            <!-- <span class="langArrow" :class="{'rotate':showList}"></span> -->
            <img class="langArrow" src="/images/mobile/l-Arrow.png" :class="{'rotate':showList}">
          </div>
          <transition name="el-fade-in-linear" >
          <div class="langSelect" v-if="showList">
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
.langSwitch {
    width: 7rem;
    float: left;
    position: relative;
    cursor: pointer;
    z-index: 9;
    margin-right: 1rem;
    .langList{
      // position: absolute;
      // left:0;
      // top:0;
      width:100%;
      .curLang{
        border:1px solid #fff;
        box-sizing: border-box;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.3rem 1.6rem;
        // height: 2.8rem;
      }
      .langSelect{
        // border:1px solid #333;
        // border-top: 0;
        box-sizing: border-box;
        position: absolute;
        background-color: #fff;
        width: 100%;
        border-radius: 3px;
        p{
          width: 100%;
          // padding-right:63%;
          box-sizing: border-box;
          height: 2.8rem;
          line-height: 2.8rem;
          color: #333;
          margin: 0;
          border: 1px solid #999999;
          // border-top: 0;
          margin-top: -1px;
          border-radius: 3px;
              overflow: hidden;
              font-size: 1.2rem;
              display: block;
          // &:first-of-type{
          //   border-bottom:1px solid #333;
          // }
        }
      }
      .langOne{
        width: 100%;
        font-size: 14px;
        color: #fff;
        box-sizing: border-box;
        border-radius: 4px;
        position: relative;
        p{
          display: flex;
          justify-content: space-around;
          align-items: center;
          color: #fff;
          font-size: 1.2rem;
          &:hover{
            font-weight: bold;
          }
        }
        .langArrow{
          display: block;
          // width: 1rem;
          // height: 2.8rem;
          // background: url(/images/mobile/l-Arrow.png) center center no-repeat;
          // background-size: 100%;
          // transition: all 0.3s;
          width: 1rem;
          transition: all 0.3s;
          // margin-left: 1rem;
          position: absolute;
          right: 1rem;
          &.rotate{
            transform: rotate(180deg);
          }
        }
      }
    }

}
</style>
