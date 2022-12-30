<template>
  <div class="indexHotVideo">
    <!-- <div class="TitleBg"><div class="innerBox">{{$t('Cms.WhatNews')}}</div></div> -->
    <div class="HotVideoMain">
      <div class="leftVideo fade-in-hot">
        <div class="videoBg">
          <div class="TitleBg">
          <div class="innerBox">
            <h2>{{PlatforTitle}}</h2>
            <p>{{PlatforDuct}}</p>
          </div>
        </div>
            <div class="pathwayList">
              <ul>
                <li v-for="(item, index) in PlatforContents" :key="index">
                  <a href="javascript:;" @click="toUrl(item)">
                    <img :src="item.Cover" alt="">
                    <span>{{item.Title}}</span>
                  </a>
                </li>
              </ul>
            </div>
        </div>
      </div>

      <div class="rightVideo fade-in-hot"><div class="text" v-html="fbContent.Body"></div></div>
    </div>
  </div>
</template>
<script lang="ts" scoped>
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component
export default class PkLiveBox extends Vue {
  PlatforContents:string='';
  fbContent:string='';
  PlatforTitle: string = '';
  PlatforDuct: string = '';
  toUrl (n) {
    if (!n.IsOpenWindows && n.Url) {
      window.location.href = n.Url;
    } else if (n.IsOpenWindows && n.Url) {
      window.open(n.Url);
    }
  }
  getVideoContent () {
    this.$Api.cms.getCategoryByDevice({ Key: 'pathway', IsMobile: true }).then(result => {
      this.PlatforContents = result.Contents.splice(0, 8);
      this.PlatforDuct = result.Description;
      this.PlatforTitle = result.Name;
      console.log(result, '购买');
    });
  }
  getFbContent () {
    this.$Api.cms.getContentByDevice({ Key: 'facebook', IsMobile: false }).then(result => {
      this.fbContent = result.CMS;
    });
  }
  get lang () {
    return this.$Storage.get('locale');
  }
  pathwayScroll () {
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
  mounted() {
    document.addEventListener('scroll', this.pathwayScroll);
  }
  destroyed() {
    document.removeEventListener('scroll', this.pathwayScroll);
  }
  created () {
    this.getVideoContent();
    this.getFbContent();
  }
}
</script>
<style  lang="less">
.HotVideoMain .leftVideo iframe{
  width: 100%;
  height: 500px;
}
.HotVideoMain .leftVideo img{
  width: 100%;
}
.HotVideoMain .rightVideo iframe{
  width: 100%;
  height: 500px;
}
.HotVideoMain .rightVideo img{
  width: 100%;
}
</style>
<style scoped lang="less">
.TitleBg{
  margin-bottom: 28px;
  .innerBox{
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
}
.indexHotVideo{
    width: 100%;
    background-size: 100% 100%;
    display: inline-block;
    padding-top: 80px;
    padding-bottom: 76px;
    background-color: #fff;
}
.HotVideoMain{
    width: 1200px;
    margin: 0 auto;

}
.HotVideoMain .leftVideo{
    width: 55%;
    float: left;
    margin-right: 5%;
    background-size: 100% 100%;
    box-sizing: border-box;
    padding: 30px;

    .pathwayList{
          padding: 10px 30px;
          border: 6px solid #d9b672;
          border-radius: 8px;
          box-sizing: border-box;
          ul{
            display: flex;
            flex-wrap: wrap;
            li{
              width: 25%;
              // margin-bottom: 1rem;
              padding: 20px;
              box-sizing: border-box;
              text-align: center;

              a{
                color: #333333;
                text-align: center;
                font-size: 16px;
                font-family: 'SourceHanSans-Regular';
                word-break: break-word;
                span{
                  color: #333333;
                  text-align: center;
                  font-size: 14px;
                  font-family: 'SourceHanSans-Regular';
                  word-break: break-word;
                  margin-top: 14px;
                }
              }
              img{
                width: 100%;
                height: 80px;
                object-fit: contain;
              }
            }
          }
        }

}
.HotVideoMain .leftVideo img{
    width: 100%;
    margin: 0 auto;
}
.HotVideoMain .rightVideo{
    width: 278px;
    height: 466px;
    float: left;
    background-size: 100% 100%;
    box-sizing: border-box;
    // padding: 30px;
    .text{
      border: 6px solid #d9b672;
      border-radius: 5px;
      width: 278px;
      height: 469px;
      img{
        height: 100%;
      }
    }
}
.HotVideoMain .rightVideo img{
    width: 100%;
}
.indexVideoTitle{
    width: 544px;
    height: 114px;
    background-size: 100%;
    margin: 0 auto;
    margin-bottom: 70px;
}
.indexVideoTitleE{
    width: 544px;
    height: 114px;
    background-size: 100%;
    margin: 0 auto;
    margin-bottom: 70px;
}
.fade-in-hot {
  opacity: 0;
  transition: 1s all ease-out;
  // transform: translate(0, -30px);
  box-sizing: border-box;
}
</style>
