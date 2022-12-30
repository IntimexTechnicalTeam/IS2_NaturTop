<template>
  <div class="PcVersion product_item" :class="{'Engap': $Storage.get('locale') === 'E'}">
  <div class="productMain" v-if="item">
    <div class="in_pdWindow_page_item" :style="styla" @mouseenter="Enter=true" @mouseleave="Enter=false" @click="click">
      <div class="topWindowsImg imgbox">
        <img :src="(item.Image?item.Image:item.Img_L?item.Img_L:item.Img)"  :class="{'height_line':Enter}" :style="imgStyla" :data-key="item.Sku" @error="loadError" />
        <div class="shopMark">
            <div class="innerBox">
                <a  href="javascript:;"><i class="indexfav" v-bind:class="{'indexfav_hover':item.IsFavorite}"  v-on:click="addToFavorite(item)"></i><span v-on:click="addToFavorite(item)">{{$t('MyFavorite.MyFavorite')}}</span></a>
                <a  href="javascript:;" ><i class="showDetail" v-on:click="addCart(item)"></i><span v-on:click="addCart(item)">{{$t('home.ViewDetail')}}</span></a>
            </div>
        </div>
      </div>
        <div class="in_pdWindow_item_description">
            <a  href="javascript:;" class="in_pdWindow_item_title" v-on:click="addCart(item)" :title="item.Name">{{item.Name}}</a>
            <div class="in_pdWindow_item_text" v-html="item.OverView" v-if="item.OverView"></div>
            <div class="in_pdWindow_item_text" v-html="item.Description" v-if="item.Description"></div>
            <!-- <div class="in_pdWindow_item_price">
              <inPrices :primePrices="item.ListPrice" :currentPrices="item.SalePrice" :currency="item.Currency" :DefaultListPrice="item.DefaultListPrice" :DefaultSalePrice="item.DefaultSalePrice" :DefaultCurrency="item.DefaultCurrency" size="small"></inPrices>
            </div> -->
            <div class="buy" v-if="$route.name !== 'ProductsDetail'">
              <a href="javascript:;" v-on:click="addCart(item)">{{$t('product.buyNow')}}</a>
            </div>
        </div>
    </div>
  </div>
  </div>
</template>
<script lang="ts">
import YouWouldLike from '@/model/youWouldLike';
import { Vue, Prop, Component } from 'vue-property-decorator';
@Component({ components: { inButton: () => import(/* webpackChunkName: "product" */ '@/components/base/pc/InsButton.vue'),
  inPrices: () => import(/* webpackChunkName: "product" */ '@/components/base/pc/InsPrices.vue') } })
export default class InsProductWindow extends Vue {
    private Enter:boolean = false;
    private newArray= [];
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
    addToFavorite (p) {
      if (p.IsFavorite) {
        this.$Api.member.removeFavorite(p.Sku).then((result) => {
          if (result.Succeeded) {
            p.IsFavorite = false;
            this.$message({
                message: this.$t('MyFavorite.RemoveSuccess') as string,
                type: 'error',
                customClass: 'messageboxNoraml'
              });
          }
        });
      } else {
        this.$Api.member.addFavorite(p.Sku).then((result) => {
          if (result.Succeeded) {
            p.IsFavorite = true;
            this.$message({
              message: this.$t('MyFavorite.AddSuccess') as string,
              type: 'success',
              customClass: 'messageboxNoraml'
            });
          } else {
            this.$router.push('/Account/login');
          }
        });
      }
    }
    addCart (val) {
      this.$router.push('/product/detail/' + val.Sku);
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
.messageboxNoraml{
  z-index: 1000000000!important;
}
</style>
<style lang="less">
.PcVersion .in_pdWindow_item_price .currentPricesMain ,.in_pdWindow_item_price .primePricesMain{
  width: 100%;
  display: inline-block;
  text-align: center;
}
.PcVersion .in_pdWindow_item_price .currentPricesMain  .small:nth-child(1) {
  font-size: 1.2rem;
  word-break: break-all;
  text-align: center;
  color: #0b0b0b;
  display: inline-block;
}
.PcVersion .in_pdWindow_item_price .currentPricesMain .small:nth-child(2) {
    font-size: 1.4rem;
    color: #cd0909;
    display: inline-block;
}
.PcVersion .in_pdWindow_item_price .primePricesMain  .small:nth-child(1) {
  font-size: 1rem;
  word-break: break-all;
  text-align: center;
  color: #999;
  display: inline-block;
  text-decoration:line-through;
}
.PcVersion .in_pdWindow_item_price .primePricesMain .small:nth-child(2) {
  font-size: 1rem;
  color: #999;
  display: inline-block;
}
// .productMain:hover .in_pdWindow_page_item img {
//     border: 1px solid #cd0909;
// }
// .productMain:hover .in_pdWindow_item_title {
//     transform: translateY(-3px);
//     color: #cd0909!important;
// }
// .PcVersion:hover {
//   background-color: #e1c58e;
//   border-radius: 5px;
// }
</style>
<style lang="less" scoped>
.imgbox{
    position: relative;
    display: inline-block;
    width: 100%;
    overflow: hidden;
}

.imgbox:hover .shopMark{
    bottom: 0px;
}
.imgbox .shopMark{
    position: absolute;
    left: 0px;
    bottom: -100%;
    right: 0px;
    height:100%;
    background:rgba(0,0,0,.5);
    transition: all .3s;
    display: flex;
    align-items: center;
    justify-content: center;
    .innerBox{
      width: 100%;
      display: inline-block;
    }
}
.imgbox .shopMark a{
    text-align: center;
    display: block;
}
.imgbox .shopMark a:hover{
  transform: translateY(-3px);
}
.imgbox .shopMark a:hover span{
    text-decoration: underline;
}
.imgbox .shopMark a:nth-child(1){
    // padding-top: 60px;
    padding-bottom: 20px;
}
.imgbox .shopMark a span{
    color: #FFF;
    font-size: 16px;
    margin-top: 5px;
    display: block;
}
.imgbox .shopMark i{
    width: 35px;
    height: 35px;
    display: block;
    margin: 0 auto;
}
.imgbox .shopMark .indexfav{
    background: url(/images/pc/index_42.png) no-repeat center center;
    background-size: 100%;
}
.imgbox .shopMark .indexfav_hover{
    background: url(/images/pc/index_42hover.png) no-repeat center center!important;
    background-size: 100%;
}
.imgbox .shopMark .showDetail{
    background: url(/images/pc/viewDetail.png) no-repeat center center;
    background-size: 100%;
}

.imgbox img{
    width: 100%;
    border-radius:0px;
    // border:1px solid #020202;
    transition: border all 1s;
    box-sizing: border-box;
    display: block;
}
.imgbox img:hover{
    // border:1px solid #e02533;
}
.in_pdWindow_page_item img {
  box-sizing: border-box;
  cursor: pointer;
  // border: 1px solid #cdcdcd;
  border-radius:0px;
}
// .height_line {
//   border: 1px solid black !important;
// }
.in_pdWindow_item_title {
    font-size: 24px;
    width: 96%;
    margin: 0 auto;
    text-align: center;
    color: #d9b672;
    display: inline-block;
    text-align: center;
    line-height: 32px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    word-break: break-word;
    margin-top: 10px;
    margin-bottom: 15px;
    font-family: 'SourceHanSans-Regular';
    font-weight: bold;
}
.in_pdWindow_item_code {
  margin-top: 1rem;
  color: #999999;
  text-align: center;
}
.productMain{
  // border: 2px solid #ebd9b6;
  // border-radius: 6px;
  // background-color: #fff;
  transition: all 0.3s;
  overflow: hidden;
  .in_pdWindow_item_description{
    .buy{
      text-align: center;
      margin-bottom: 18px;
      a{
        padding: 0 24px;
        height: 34px;
        background-color: #d9b672;
        border-radius: 6px;
        text-align: center;
        line-height: 32px;
        font-family: 'SourceHanSans-Regular';
        color: #fff;
        display: inline-block;
        border: 1px solid #fff;
        box-sizing: border-box;
      }
    }
    .in_pdWindow_item_text{
      text-align: center;
      /deep/ p{
        margin-bottom: 16px;
        color: #666666;
      }
    }
  }
  &:hover{
    // background-color: #e1c58e;
    .in_pdWindow_item_description{
      .in_pdWindow_item_title{
        color: #fff;
      }
      .in_pdWindow_item_text{
        /deep/ p{
          color: #fff;
        }
      }
      .buy{
        a{
          border: 1px solid #fff;
          background-color: transparent;
        }
      }
    }
  }
}
.Engap{
  .productMain .in_pdWindow_item_description .buy a{
    line-height: 32px;
  }
}
.product_item{
  transition: all 0.3s;
}
.product_item:hover{
  background-color: #e1c58e;
  border-radius: 6px;
}
</style>
