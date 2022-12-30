<template>
  <div class="mark">
    <div class="markback"></div>
    <div class="markbox fade-in-hot" v-html="lastestContents"></div>

  </div>
</template>
<script lang="ts" scoped>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
@Component
export default class PkNews extends Vue {
  lastestContents: any[] = [];
  getNews () {
    var cond = {
      Page: 1,
      PageSize: 3,
      catId: 10029
    };
    this.$Api.cms.getCategoryByDevice({ Key: 'mark', IsMobile: true }).then(result => {
      this.lastestContents = result.Content;
    });
  }
  MarkScroll () {
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
  mounted () {
    this.getNews();
    document.addEventListener('scroll', this.MarkScroll);
  }
  destroyed () {
    document.removeEventListener('scroll', this.MarkScroll);
  }
}
</script>

<style scoped lang="less">
.mark{
  width: 100%;
  background: url(/images/mobile/indexback_02.png) no-repeat top center;
  background-size: contain;
  padding-top: 6rem;
  padding-bottom: 5rem;
  // .markback{
  //   width: 100%;
  //   background: url(/images/pc/indexback_02.png) no-repeat top center;
  //   background-size: cover;
  //   height: 300px;
  // }
  .markbox{
    width: 90%;
    margin: 0 auto;
  /deep/ table{
    width: 100%;
    tr{
      td{
        width: 100%;
        >h2{
          text-align: center;
          margin-bottom: 10px;
          font-size: 3rem;
          font-family: 'SourceHanSans-Heavy';
          background: linear-gradient(90deg, #db9307, #f4de91, #db9307);
          -webkit-background-clip: text;
          color: transparent;
          display: flex;
          justify-content: center;

        }
        p{
          font-family: 'SourceHanSans-Regular';
          font-size: 1.4rem;
          color: #333333;
          text-align: justify;
          word-break: break-word;

        }
        img{
            width: 100%;
            display: block;
          }

        .more{
          text-align: center;
          margin-top: 20px;
          display: flex;
          justify-content: center;
          a{
            padding: 0 2rem;
            height: 3rem;
            background-color: #d9b672;
            border-radius: 6px;
            text-align: center;
            line-height: 3rem;
            font-family: 'SourceHanSans-Regular';
            color: #fff;
            font-size: 1.4rem;
          }
        }
      }
    }
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
