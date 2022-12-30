<template>
  <div :style="styla" v-if="ShowItemsLength>0" class="PcVersionYouLike">
    <div class="in_slider_title">{{title}}</div>
    <swiper :options="SwiperOption" ref="mySwiper">
      <!-- slides -->
      <swiperSlide v-for="(page,idx) in ShowItems" :key="idx">
        <div class="in_slider_page_container" @click="click">
          <div class="in_slider_page_item" v-for="(item,index) in page" :key="index">
            <div class="in_slider_page_item" v-if="!item.virtual">
              <inProductWindow :item="item" :imgStyla="imgStyla" styla="width:100%;margin:0 auto;"></inProductWindow>
            </div>
          </div>
        </div>
      </swiperSlide>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
  </div>
</template>
<script lang="ts">
import YouWouldLike from '@/model/youWouldLike';
import inButton from '@/components/base/pc/InsButton.vue';
import inProductWindow from '@/components/hkTasteBusiness/pc/product/HkProductWindow.vue';
import Currency from '@/model/currency';
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import { swiper, swiperSlide } from 'vue-awesome-swiper/src';
@Component({
  components: {
    inButton, inProductWindow, swiper, swiperSlide
  }
})
export default class InsYouWouldLike extends Vue {
  // data
  private SwiperOption = {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  };
  private InnerItems: YouWouldLike[] = [];
  private InnerItemsCopy: YouWouldLike[] = [];
  private ShowItems: YouWouldLike[][] = [];
  private Layer: boolean = false;
  private ShowItemsLength: number = 0;
  //   props
  @Prop() private readonly styla!: string;
  @Prop() private readonly imgStyla!: string;
  @Prop() private readonly title!: string;
  @Prop() private readonly pageNum!: number;
  // @Prop() private readonly items!: YouWouldLike[];
  @Prop() private readonly ProductSku!: string;
  //   method
  click (e: MouseEvent) {
    let target = e.target as HTMLElement;
    if (target.nodeName === 'IMG') {
    }
  }
  buttonClick (item: YouWouldLike) {
    console.log(item);
  }
  created () {
    this.$Api.product.getRltProduct(this.ProductSku).then((result) => {
      this.InnerItems = result.YouWouldLike;
      this.ShowItemsLength = result.YouWouldLike.length;
      console.log(result, '猜你喜欢');
    });
  }
  @Watch('InnerItems')
  onInnerItemsChange (o, n) {
    this.InnerItemsCopy = this.InnerItems.slice();
    this.ShowItems.splice(0, this.ShowItems.length);
    while (this.InnerItemsCopy.length > 0) {
      this.ShowItems.push(this.InnerItemsCopy.splice(0, this.pageNum));
    }
    while (
      this.ShowItems.length > 0 &&
      this.ShowItems[this.ShowItems.length - 1].length < this.pageNum
    ) {
      this.ShowItems[this.ShowItems.length - 1].push(
        new YouWouldLike('-1', '', '', '', '', '', new Currency(), '', '', new Currency(), true)
      );
    }
  }
  @Watch('ProductSku')
  onProductSkuChange (o, n) {
    this.$Api.product.getRltProduct(this.ProductSku).then(result => {
      this.InnerItems = result.YouWouldLike;
      this.ShowItemsLength = result.YouWouldLike.length;
    });
  }
}
</script>
<style>
.PcVersionYouLike .swiper-button-prev{
  background-image:url('/images/pc/cleft.png')!important;
  left:38px!important;
}
.PcVersionYouLike .swiper-button-next{
    background-image:url('/images/pc/cright.png')!important;
    right:38px!important;
}
.PcVersionYouLike  .swiper-button-prev,.PcVersionYouLike  .swiper-button-next{
    width: 20px!important;
    height: 37px!important;
    background-size:100%!important;
}
</style>
<style scoped>
.in_slider_title {
  text-align: center;
  margin: 4rem auto;
  text-align: center;
  font-size: 36px;
  font-family: 'SourceHanSans-Heavy';
  background: -webkit-gradient(linear, left top, right top, from(#db9307), color-stop(#f4de91), to(#db9307));
  background: linear-gradient(90deg, #db9307, #f4de91, #db9307);
  -webkit-background-clip: text;
  color: transparent;
  display: flex;
  justify-content: center;
  width: 310px;
}
.in_slider_page_container {
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
  width: 960px;
  margin: 0 auto;
  user-select: none;
  overflow: hidden;
}
.in_slider_page_item {
   width: 300px;
   margin-right: 30px;
}
</style>
