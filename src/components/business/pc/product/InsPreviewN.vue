<template>
  <div class="in_preview_warpper  PcVersionPreview" :style="warpperStyle" @mousemove.stop>
        <div class="in_preview_img_warpper" >
            <img :src="isClick?AttrImg:CurrentPic" @click="viewImg(currentIndex)">
          </div>
        <div class="swiper-father">
          <swiper :options="SwiperOptionN" ref="mySwiper">
            <swiperSlide v-for="(item,idx) in ShowItems" :key="idx">
              <div class="in_slider_page_container">
                <div class="in_slider_page_item" v-if="!item.Virtual" :class="{ 'item':!item.Virtual }">
                    <img :src="item.Src[1]" :data-key="item.Src[1]" @error="loadError" @click="getImg(item.Src[0],idx)"/>
                  </div>
              </div>
            </swiperSlide>
          </swiper>
            <div class="swiper-button-prev swiper-button-prevN" slot="button-prev"></div>
            <div class="swiper-button-next swiper-button-nextN" slot="button-next"></div>
          </div>
          <div v-if="!isClick">
            <Viewer :images="ShowItems"
                      class="viewer" ref="viewer"
                      @inited="inited"
              >
              <img v-for="(item,index) in ShowItems" :src="item.Src" :key="index" :alt="ProductTitleName" class="PreViewimage">
              </Viewer>
          </div>
            <div v-else>
                <Viewer
                      class="viewerN" ref="viewerN"
                      @inited="initedN"
              >
              <img :src="AttrImg"  :alt="ProductTitleName" class="PreViewimage">
              </Viewer>
            </div>

        </div>
</template>
<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import { swiper, swiperSlide } from 'vue-awesome-swiper/src';
import 'viewerjs/dist/viewer.css';
// import { component as Viewer } from 'v-viewer';

import Viewer from 'v-viewer/src/component.vue';
// Vue.use(Viewer, {
//   defaultOptions: {
//     zIndex: 9999
//   }
// });
class ImgItem {
  Src:string;
  Virtual:boolean;
  constructor (src:string, vertual:boolean = false) {
    this.Src = src;
    this.Virtual = vertual;
  }
}
@Component({ components: { swiper, swiperSlide, Viewer } })
export default class InsPreview extends Vue {
  // data
  private mirrorShow: boolean = false;
  private currentIndex = 0;
  // private InnerItems: ImgItem[] = [];
  private ShowItems: ImgItem[] = [];
  @Prop() private readonly ProductTitleName!: string[];
  private MiddlePic = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  };
SwiperOptionN: object = {
    // pagination: {
    //   el: '.swiper-pagination',
    //   clickable: true
    // },
    navigation: {
      nextEl: '.swiper-button-next.swiper-button-nextN',
      prevEl: '.swiper-button-prev.swiper-button-prevN'
    },
    slidesPerColumn: 1,
    slidesPerView: 4
  };
  private TranslateM: string = '';
  private MirrorImgM: string = '';
  private CurrentPic: string = '';
  private acceepClcik:boolean =false;
  // props
  @Prop() private readonly imgList!: string[];
  @Prop() private readonly height!: string;
  @Prop() private readonly width!: string;
  @Prop() private readonly styla!: string;
  @Prop() private readonly pageNum!: number;
  $Viewer: any;
  $viewer: any;
  // computed
  get warpperStyle (): string {
    return 'width:' + this.width + ';height:' + this.height + ';' + this.styla;
  }
  created () {
    let that = this;
    document.body.addEventListener(
      'mousemove',
      () => {
        // eslint-disable-next-line
        that.mirrorShow = false;
      },
      false
    );
  }
  get AttrImg () {
        return this.$store.state.AttrImgList;
  }
  @Watch('imgList', { deep: true })
  imgListChange () {
    if (this.AttrImg === '') {
         this.$store.dispatch('setAttrImgList', this.imgList[0][0]);
         this.CurrentPic = this.imgList[0][0];
    }
    this.$store.dispatch('setNormalImg', this.imgList[0][0]);
    this.CurrentPic = this.imgList[0][0];
    // this.InnerItems = [];
    this.ShowItems = [];
    this.imgList.forEach(element => {
      this.ShowItems.push(new ImgItem(element));
    });
    // while (this.InnerItems.length > 0) {
    //   this.ShowItems.push(this.InnerItems.splice(0, this.pageNum));
    // }
    // while (
    //   this.ShowItems.length > 0 &&
    //   this.ShowItems[this.ShowItems.length - 1].length < this.pageNum
    // ) {
    //   this.ShowItems[this.ShowItems.length - 1].push(
    //     new ImgItem('', true)
    //   );
    // }
  }
 inited(Viewer) {
    this.$viewer = Viewer;
  }
  initedN(Viewer) {
    this.$viewer = Viewer;
  }
  viewImg (val) {
    this.$viewer.view(val);
  }
   get isClick () {
    return this.$store.state.isClick;
  }
  getImg(src, index) {
    this.CurrentPic = src;
    this.$store.dispatch('isClick', false);
    this.currentIndex = index;
  }
  mounted () {

  }
  mirrorMove (e: MouseEvent) {
    let x, y, mx, my;
    x = e.pageX - this.MiddlePic.left;
    y = e.pageY - this.MiddlePic.top;
    mx = e.pageX - (this.MiddlePic.left + this.MiddlePic.right) / 2;
    my = e.pageY - (this.MiddlePic.top + this.MiddlePic.bottom) / 2;
    this.TranslateM =
      'transform:translate(-50%,-50%) translate(' + x + 'px,' + y + 'px);';
    this.MirrorImgM =
      'transform:translate(-50%,-50%) translate(' + (-mx) + 'px,' + (-my) + 'px);';
    if (e.pageX > this.MiddlePic.right * 1.1 || e.pageX < this.MiddlePic.left * 0.9) {
      this.mirrorShow = false;
      return;
    }
    if (e.pageY > this.MiddlePic.bottom * 1.1 || e.pageY < this.MiddlePic.top * 0.9) {
      this.mirrorShow = false;
    }
  }
  previewMove (e: MouseEvent) {
    let target = e.target as HTMLImageElement;
    this.MiddlePic.top = target.offsetTop;
    this.MiddlePic.left = target.offsetLeft;
    this.MiddlePic.right = target.offsetLeft + target.width;
    this.MiddlePic.bottom = target.offsetTop + target.height;
    this.mirrorShow = true;
  }
  changeBigpic (src: string) {
    this.CurrentPic = src;
  }
  click (e: MouseEvent) {
    let target = e.target as HTMLElement;
    if (target.nodeName === 'IMG') {
      this.CurrentPic = target.dataset.key as string;
    }
  }
  loadError (e) {
    e.target.src = '/static/Image/proddef.jpg';
  }
}
</script>
<style lang="less">
.viewer-container {
  z-index: 9999999!important;
}
.viewer-title{
  font-size: 16px!important;
  opacity: 0.9;
  color: #fff;
}
.PcVersionPreview .swiper-button-prev{
  background-image:url('/images/pc/pleft.png')!important;
  left:0px!important;
}
.PcVersionPreview .swiper-button-next{
    background-image:url('/images/pc/pright.png')!important;
    right:0px!important;
}
.PcVersionPreview  .swiper-button-prev, .PcVersionPreview  .swiper-button-next{
    width: 30px!important;
    height: 100px!important;
    background-size: 100%!important;
    outline: 0;
    margin: 0;
    top: 5px;
}
.PcVersionPreview{
  .swiper-father{
    width: 100%;
    position: relative;
  }
  .swiper-container{
    width: 88%;
    margin: 0 auto;
    flex-wrap: wrap;
  }
}
</style>
<style scoped lang="less">
.PreViewimage {
    display: none;
}
.in_preview_warpper {
  width: 100%;
  min-height: 460px;
  display: inline-block;
  vertical-align: top;
}
.in_preview_img_warpper {
  overflow: hidden;
    // border: 1px solid;
    // margin: 20px 0;
    line-height: 0;
    border: 1px solid #999999;
    box-sizing: border-box;
}
.in_preview_img_warpper > img {
  width: 100%;
  cursor: pointer;
  height: 520px;
}
.in_preview_img_mirror {
  position: absolute;
  height: 350px;
  width: 350px;
  border-radius: 50%;
  background-color: white;
  z-index: 2019;
  padding: 10px;
  box-sizing: border-box;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.1);
}
.mirror_img {
  position: relative;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}
.mirror_img img{
  position: absolute;
  top: 50%;
  left: 50%;
  height: 200%;
  width: 200%;
  z-index: 2018;
  transform:translate(-50%,-50%);
}
.in_preview_subImg_warpper {
  position: relative;
}
.in_slider_page_container {
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
  width: 95%;
  margin: 0 auto;
  padding: 0 0;
  user-select: none;
}
.in_slider_page_item{
  width: 100%;
  box-sizing: border-box;
  font-size: 0;
  border-radius: 2px;
  padding: 5px;
  .item{
    border: solid 1px#cccccc;
    padding: 0;
    &:hover{
      border:1px solid #d9b672;
    }
  }
}
.in_slider_page_item img {
  cursor: pointer;
  width: 100%;
}
// .swiper-slide{
//   width: 100% !important;
// }
</style>
