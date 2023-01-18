<template>
  <div class="liveBox mobileVersion" style="text-align: center;">
    <div class="liveBox_in">

        <div class="videoBg">
            <div class="TitleBg fade-in-hot">
          <div class="innerBox">
            <h2>{{PlatforTitle}}</h2>
            <p>{{PlatforDuct}}</p>
          </div>
        </div>
            <div class="pathwayList fade-in-hot">
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
        <div class="mapBg fade-in-hot">
           <p v-html="fbContent.Body"></p>
        </div>
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
      this.PlatforContents = result.Contents.splice(0, 6);
      this.PlatforDuct = result.Description;
      this.PlatforTitle = result.Name;
      console.log(result, '购买');
    });
  }
  getFbContent () {
    this.$Api.cms.getContentByDevice({ Key: 'facebook', IsMobile: true }).then(result => {
      this.fbContent = result.CMS;
    });
  }
  created () {
    this.getVideoContent();
    this.getFbContent();
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
      var elemTop = rect.top + 300; // 200 = buffer
      var elemBottom = rect.bottom;
      return elemTop < window.innerHeight && elemBottom >= 0;
    }
  get lang () {
    return this.$Storage.get('locale');
  }
  mounted() {
    document.addEventListener('scroll', this.pathwayScroll);
  }
  destroyed() {
    document.removeEventListener('scroll', this.pathwayScroll);
  }
}
</script>
<style  lang="less">
.mobileVersion{
  .videoBg{
    iframe{
      width: 100%;
      height: 20rem;
    }
    img{
      width: 100%;
    }
  }
  .mapBg{
    img{
      width: 100%;
    }
  }
}
</style>
<style scoped lang="less">
/*live*/
.TitleBg{
  margin-bottom: 2rem;
  .innerBox{
    >h2{
      text-align: center;
      margin-bottom: 1rem;
      font-size: 3rem;
      font-family: 'SourceHanSans-Heavy';
      // background: linear-gradient(90deg, #db9307, #f4de91, #db9307);
      // -webkit-background-clip: text;
      color: #d9b672;
      display: flex;
      justify-content: center;

    }
    p{
      font-family: 'SourceHanSans-Regular';
      font-size: 1.2rem;
      color: #333333;
      text-align: center;
      word-break: break-word;
    }
  }
}
.liveBox {
    width: 100%;
    padding-bottom: 4.5rem;
    // background: url('/images/mobile/Mobile-index_04.jpg') no-repeat center center;
    background-size: 100% 100%;
    .liveBox_in{
    width: 90%;
    margin: 0 auto;
    padding-top:3rem;
      // .mapBg{
        // background: url('/images/mobile/mobileIndex_27.png') center center no-repeat;
        // background-size: 100% 100%;
        // display: inline-block;
        // padding: 2.5rem;
        // box-sizing: border-box;
      // }
      .videoBg{

        .pathwayList{
          padding: 1rem 2rem;
          border: 4px solid #d9b672;
        border-radius: 6px;
        margin-bottom: 3rem;
          ul{
            display: flex;
            flex-wrap: wrap;
            li{
              width: 50%;
              // margin-bottom: 1rem;
              padding: 1rem;
              box-sizing: border-box;
              &:nth-child(2n){
                padding-right: 0;
              }
              &:nth-child(2n+1){
                padding-left: 0;
              }
              a{
                color: #333333;
                text-align: center;
                font-size: 1.2rem;
                font-family: 'SourceHanSans-Regular';
                word-break: break-word;
                span{
                  color: #333333;
                  text-align: center;
                  font-size: 1.2rem;
                  font-family: 'SourceHanSans-Regular';
                  word-break: break-word;
                  margin-top: 0.5rem;
                }
              }
              img{
                width: 100%;
                height: 6rem;
                object-fit: contain;
              }
            }
          }
        }
      }
      .mapBg{
        border: 4px solid #dcbb7b;
        border-radius: 6px;
      }
    }

}
.fade-in-hot {
  opacity: 0;
  transition: 1s all ease-out;
  // transform: translate(0, -30px);
  box-sizing: border-box;
}
</style>
