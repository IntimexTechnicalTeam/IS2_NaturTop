<template>
    <div class="in_pdWindow_page_item" :style="styla" @mouseenter="Enter=true" @mouseleave="Enter=false" @click="click" v-if="item">
        <img :src="(item.Image?item.Image:item.Img_L?item.Img_L:item.Img)"  :class="{'height_line':Enter}" :style="imgStyla" :data-key="item.Sku" @error="loadError" />
        <div class="in_pdWindow_item_description">
             <router-link :to="'/product/detail/'+item.Sku" class="in_pdWindow_item_title" >&nbsp;{{item.Name}}</router-link >
            <!-- <div class="in_pdWindow_item_code">&nbsp;{{item.Code}}</div> -->
            <!-- <div class="in_pdWindow_item_price">
              <inPrices :primePrices="item.ListPrice" :currentPrices="item.SalePrice" :currency="item.Currency" :DefaultListPrice="item.DefaultListPrice" :DefaultSalePrice="item.DefaultSalePrice" :DefaultCurrency="item.DefaultCurrency" size="small"></inPrices>
            </div> -->
            <div class="in_pdWindow_item_text" v-html="item.OverView" v-if="item.OverView"></div>
            <div class="in_pdWindow_item_text" v-html="item.Description" v-if="item.Description"></div>
            <div class="buy" v-if="$route.name !== 'ProductsDetail'">
              <router-link :to="'/product/detail/'+item.Sku" class="buy_title" >{{$t('product.buyNow')}}</router-link >
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import inButton from '@/components/base/mobile/InsButton.vue';
import inPrices from '@/components/base/mobile/InsPrices.vue';
import YouWouldLike from '@/model/youWouldLike';
import { Vue, Prop, Component } from 'vue-property-decorator';
@Component({ components: { inButton, inPrices } })
export default class InsProductWindow extends Vue {
    private Enter:boolean = false;
    @Prop() private item!:YouWouldLike;
    @Prop() private imgStyla!:string;
    @Prop() private styla!:string;
    buttonSubmit (item) {
      this.$router.push({
        path: '/product/detail',
        name: 'ProductsDetail',
        params: {
          id: item.Sku
        }
      });
    }
    click (e) {
      let target = e.target as HTMLElement;
      if (target.nodeName === 'IMG') { this.$router.push('/product/detail/' + target.dataset.key); };
    }
    loadError (e) {
      e.target.src = '/static/Image/proddef.jpg';
    }
}
</script>
<style lang="less">
.in_pdWindow_item_price .currentPricesMain ,.in_pdWindow_item_price .primePricesMain{
  width: 100%;
  display: inline-block;
  text-align: center;
}
.in_pdWindow_item_price .currentPricesMain  .small:nth-child(1) {
  font-size: 1.2rem;
  word-break: break-all;
  text-align: center;
  color: #0b0b0b;
  display: inline-block;
}
.in_pdWindow_item_price .currentPricesMain .small:nth-child(2) {
    font-size: 1.4rem;
    color: #cd0909;
    display: inline-block;
}
.in_pdWindow_item_price .primePricesMain  .small:nth-child(1) {
  font-size: 1.2rem;
  word-break: break-all;
  text-align: center;
  color: #999;
  display: inline-block;
  text-decoration: line-through;
}
.in_pdWindow_item_price .primePricesMain .small:nth-child(2) {
    font-size: 1.2rem;
    color: #999;
  display: inline-block;
}
</style>
<style lang="less" scoped>
.in_pdWindow_page_item img {
  box-sizing: border-box;
  cursor: pointer;
  width: 100%;
  // border: 1px solid #cdcdcd;
}
// .height_line {
//   border: 1px solid black !important;
// }
.in_pdWindow_page_item{
  border: 1px solid #dbba7a;
  border-radius: 5px;
  overflow: hidden;
  background-color: #fff;
  box-sizing: border-box;
  width: calc( 100% - 2px);
  padding-bottom: 1.5rem;
}
.in_pdWindow_item_title {
    font-size: 1.4rem;
    width: 96%;
    margin: 0 auto;
    text-align: center;
    color: #d9b672;
    line-height: 25px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    word-break: break-word;
    margin-top: .5rem;
    margin-bottom: 1rem;
    font-family: 'SourceHanSans-Regular';
    font-weight: bold;
}
.in_pdWindow_item_text{
  text-align: center;
  /deep/ p{
    font-size: 1.2rem;
    color: #666666;
    margin-bottom: 1rem;
  }
}
.buy{
  text-align: center;
  .buy_title{
    padding: 0 2rem;
    height: 3rem;
    background-color: #d9b672;
    border-radius: 6px;
    text-align: center;
    line-height: 3rem;
    font-family: 'SourceHanSans-Regular';
    color: #fff;
    font-size: 1.4rem;
    display: inline-block;
  }
}
.in_pdWindow_item_code {
  margin-top: 1rem;
  color: #999999;
  text-align: center;
}
</style>
