<template>
  <div class="in_panel_warpper PcVersion" :style="warpperStyle">
    <div class="in_panel_content">
      <!-- <inSelect
        v-for="(item,index) in panelDetail.AttrList"
        :items="item"
        :key="index"
        placeholder="请选择"
        v-model="ProductInfor['Attr'+(index+1)]"
        styla="padding: 0 10px;"
        @input="changeAttr"
        @changePrice="AdditionalPrice"
      ></inSelect> -->
      <inNum v-model="ProductInfor.Qty" :v="ProductInfor.Qty" size="middle" :min="panelDetail.MinPurQty" :max="panelDetail.MaxPurQty" styla="padding: 0 0;"></inNum>
      <div class="in_panel_iconList">
        <div v-for="item in panelDetail.icons" :key="item.id" class="in_panel_icon_warpper">
          <img :src="item.src" />
        </div>
      </div>
    </div>
    <!-- <div class="in_panel_footer">
      <ElButton @click="click('addToCart')" class="actionBtn addToCart" :loading="Loading">{{$t('product.addToCart')}}</ElButton>
      <ElButton @click="click('buy')" class="actionBtn buyNow" :loading="buyLoading">{{$t('product.buy')}}</ElButton>
    </div> -->
    <div class="in_panel_footer in_panel_footer_top" v-if="panelDetail.ProductStatus!==-1 && panelDetail.SoldOutAttrComboList.length===0">
      <inButton
        v-for="item in panelDetail.button"
       :loading="(item.action === 'addToCart')?Loading:buyLoading"
        :nama="$i18n.t('product.'+item.nama)"
        :key="item.nama"
        :type="(item.action === 'addToCart' || item.action === 'favorite' || item.action === 'buy') ? 'primary' : 'error'"
        :action="item.action"
        @click="click"
        :class="{'CartBtn' : item.action == 'addToCart', 'BuyBtn' : item.action == 'buy'}"
      ></inButton>
    </div>
    <div class="in_panel_footer" v-else>
        <button type="button" :disabled="SoldOutAttr" @click="click('addToCart')" class="CartBtn">{{$t('product.addToCart')}}</button>
        <button type="button" :disabled="SoldOutAttr" @click="click('buy')" class="BuyBtn">{{$t('product.buy')}}</button>
    </div>
    <!-- <inRecommend :Skus="ProductSku"></inRecommend> -->
  </div>
</template>
<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import PanelDetail from '@/model/PanelDetail';
import ProductAttr from '@/model/ProductAttr';
import Button from '@/model/Button';
import inNum from '@/components/base/pc/InsNum.vue';
import inSelect from '@/components/base/pc/InsRadio.vue';
import inButton from '@/components/base/pc/InsButton.vue';
import inPrices from '@/components/base/pc/InsPrices.vue';
import inRecommend from '@/components/business/pc/product/InsRecommend.vue';
import ShopCartItem from '@/model/shopCartItem';
import { Button as ElButton } from 'element-ui';
@Component({ components: { inNum, inSelect, inButton, inPrices, inRecommend, ElButton } })
export default class Panel extends Vue {
  @Prop() private panelDetail!: PanelDetail;
  @Prop() private readonly width!: string;
  @Prop() private readonly height!: string;
  @Prop() private readonly ProductSku!: string;
  private delay = 0;
  private Loading:boolean=false;
  private buyLoading:boolean=false;
  private ProductInfor: ShopCartItem = new ShopCartItem();
  private NewPrice:number=0;
  private attrPrices:any[]=[];
  private SoldOutAttr:boolean= false;
  private AttrArray:any = '';
  private AttrComboImgList:any ='';
  private AttrSelectImg:string ='';
  get warpperStyle (): string {
    return 'width:' + this.width + ';height:' + this.height + ';';
  }
    click (action: string) {
    if (action) {
      if (action === 'addToCart') {
        this.Loading = true;
        this.$Api.shoppingCart.addItem(this.ProductSku, this.ProductInfor.Qty, this.ProductInfor.Attr1, this.ProductInfor.Attr2, this.ProductInfor.Attr3)
          .then(
            (result) => {
              this.$message({
                message: result.Message.Message as string,
                type: 'success',
                customClass: 'messageboxNoraml'
              });
              this.Loading = false;
            }).then(() => {
            this.$store.dispatch('setShopCart', this.$Api.shoppingCart.getShoppingCart());
          }).catch();
      } else if (action === 'buy') {
        this.buyLoading = true;
        this.$Api.shoppingCart.addItem(this.ProductSku, this.ProductInfor.Qty, this.ProductInfor.Attr1, this.ProductInfor.Attr2, this.ProductInfor.Attr3)
          .then(
            (result) => {
              this.buyLoading = false;
               if (result.Message.Succeeded === true) {
                  this.$router.push({ name: 'shoppingcart' });
              } else {
                  this.$message({
                    message: result.Message.Message as string,
                    type: 'success',
                    customClass: 'messageboxNoraml'
                  });
              }
            }).catch();
      }
    } else {
      Vue.prototype.$Confirm('action', Object.create(this.ProductInfor));
    }
  }
  addFavorite () {
    if (this.panelDetail.IsFavorite) {
      this.$Api.product.removeFavorite(this.ProductSku).then((result) => {
        if (result.Succeeded) { Vue.prototype.$Confirm(this.$t('Message.Message'), this.$t('product.successInRemoving')); this.panelDetail.IsFavorite = false; } else if (result.ReturnValue.Code === 1000) {
          Vue.prototype.$Confirm(this.$t('product.logouted'), this.$t('product.loginow'), () => { this.$Login(this.addFavorite); });
        }
      });
    } else {
      this.$Api.product.addFavorite(this.ProductSku).then((result) => {
        if (result.Succeeded) { Vue.prototype.$Confirm(this.$t('Message.Message'), this.$t('product.successInAdding')); this.panelDetail.IsFavorite = true; } else if (result.ReturnValue.Code === 1000) {
          Vue.prototype.$Confirm(this.$t('product.logouted'), this.$t('product.loginow'), () => { this.$Login(this.addFavorite); });
        }
      });
    }
  }
  // Shake (fn) {
  //   if (!(fn instanceof Function)) return;
  //   let timeout = 1000;
  //   if (this.delay === 0) { this.delay = setTimeout(fn, timeout); } else { clearTimeout(this.delay); this.delay = setTimeout(fn, timeout); }
  // }
  changeAttr () {
    this.Shake(() => {
      // 根据选择的属性值赋值给不同的数组
      console.log(this.panelDetail, 'this.panelDetailthis.panelDetail');
      if (this.panelDetail.AttrList[0].length > 0) {
        this.AttrArray = this.ProductInfor.Attr1;
         this.AttrComboImgList = this.ProductInfor.Attr1;
      }
      if (this.panelDetail.AttrList[0].length > 0 && this.panelDetail.AttrList[1].length > 0) {
        this.AttrArray = this.ProductInfor.Attr1 + '-' + this.ProductInfor.Attr2;
        this.AttrComboImgList = this.ProductInfor.Attr1 + '-' + this.ProductInfor.Attr2;
      }
      if (this.panelDetail.AttrList[0].length > 0 && this.panelDetail.AttrList[1].length > 0 && this.panelDetail.AttrList[2].length) {
        this.AttrArray = this.ProductInfor.Attr1 + '-' + this.ProductInfor.Attr2 + '-' + this.ProductInfor.Attr3;
        this.AttrComboImgList = this.ProductInfor.Attr1 + '-' + this.ProductInfor.Attr2 + '-' + this.ProductInfor.Attr3;
      }
      // 判断后台商品列表上架情况
      if (this.panelDetail.SoldOutAttrComboList.length > 0) {
           let flag = false;
            for (var k = 0; k < this.panelDetail.SoldOutAttrComboList.length; k++) {
                if (this.panelDetail.SoldOutAttrComboList[k] === this.AttrArray.toString()) {
                        this.SoldOutAttr = true;
                        flag = true;
                           break;
                  };
                  }
                  if (!flag) {
                    this.SoldOutAttr = false;
                  }
            }
      // 根据后台选择属性图片显示不同的值
      if (this.panelDetail.AttrComboImgList.length > 0) {
           let flagN = false;
            for (var r = 0; r < this.panelDetail.AttrComboImgList.length; r++) {
                if ((this.panelDetail.AttrComboImgList[r] as any).Key === this.AttrComboImgList.toString()) {
                        this.AttrSelectImg = this.panelDetail.AttrComboImgList[r].Img;
                        console.log(this.AttrSelectImg, 'this.AttrSelectImgthis.AttrSelectImg');
                        this.$store.dispatch('setAttrImgList', this.AttrSelectImg);
                        flagN = true;
                        break;
                  };
                  }
                  if (!flagN) {
                    this.AttrSelectImg = '';
                    this.$store.dispatch('setAttrImgList', '/images/pc/proddef.jpg');
                  }
            }
        this.$Api.product.checkProductStatus(this.ProductSku, this.ProductInfor.Attr1, this.ProductInfor.Attr2, this.ProductInfor.Attr3).then((result) => {
          this.panelDetail.ProductStatus = result.object0.ReturnValue;
        });
    });
  }
  getAttrImage () {
    this.Shake(() => {
      this.$Api.product.getAttrImage(this.ProductSku, 1, this.ProductInfor.Attr1, this.ProductInfor.Attr2, 0).then((result) => {
        console.log(result, 'resultresult');
      });
    });
  }
  AdditionalPrice (getval) {
    let flag = false;
   for (var j = 0; j < this.attrPrices.length; j++) {
     if (this.attrPrices[j].TypeId === getval.TypeId) {
          flag = true;
          this.attrPrices[j] = {
          TypeId: getval.TypeId,
          AdditionalPrice: getval.AdditionalPrice
      };
        break;
      }
    }
    if (!flag) {
      this.attrPrices.push({
        TypeId: getval.TypeId,
        AdditionalPrice: getval.AdditionalPrice
      });
    }
    this.$emit('getPrice', this.attrPrices);
  }
  @Watch('panelDetail.AttrList', { deep: true })
  onPAChange () {
    if (this.panelDetail.AttrList.length > 0 && this.panelDetail.AttrList[0].length === 0) this.changeAttr();
  }
}
</script>
<style lang="less">
.messageboxNoraml{
  z-index: 1000000000!important;
}
</style>
<style lang="less">
.PcVersion .in_panel_footer .addToCart {
    border: 1px solid #242424!important;
    background: #fff!important;
    color: #242424!important;
    width: 35%!important;
}
.PcVersion .in_panel_footer .buyNow{
    border: 1px solid #262626!important;
    background: #262626!important;
    background-size: contain;
    color: #fff;
    width: 35%!important;
}
.PcVersion  .el-button{
  padding: 20px 10px!important;
}
.PcVersion .in_panel_footer button:hover{
  transform: translateY(-3px);
  // border:1px solid #262626!important;
}
.PcVersion .in_panel_footer .el-button+.el-button{
  margin-left:20px!important;
}
.PcVersion .in_panel_footer{
    justify-content: flex-start!important;
}
.PcVersion .in_panel_footer .actionBtn span{
  font-size: 18px;
}
.PcVersion  .in_num_label{
  display: inline-block;
  width: auto!important;
  margin-right: 1rem;
}
.PcVersion  .el-input-number{
  border:none!important;
  box-sizing: border-box;
}
.PcVersion  .el-input__inner{
  // border:none!important;
  box-sizing: border-box;
  // width: 4rem;
}
.PcVersion  .el-input-number__decrease,.PcVersion .el-input-number__increase{
    width: 38px !important;
    // border: 1px solid #000;
    // border-radius: 5px;
    height: 38px;
    line-height: 38px;
    background-color: transparent;

}
.PcVersion  .el-input-number__decrease{
  border-right: 1px solid #333333;
}
.PcVersion  .el-input-number__increase{
  border-left: 1px solid #333333;
}
.PcVersion .el-input-number__decrease i, .el-input-number__increase i{
  color:#d9b672;
  font-weight: bold;
}
.PcVersion  .el-input-number{
  width: auto!important;
}
.PcVersion .el-input-number .el-input__inner{
  padding-left: 0rem;
  padding-right: 0rem;
  background: transparent!important;
  width: 160px;
  line-height: 40px!important;
  height: 40px!important;
  color:#666666!important;
  font-weight: 500;
  font-size: 20px;
  border: 1px solid #333333;
  outline: none;
  font-weight: bold;
  font-family: 'SourceHanSans-Regular';
}
</style>
<style lang="less" scoped>
.in_panel_footer .actionBtn{
    width: 49%;
    display: block;
    text-align: center;
}
.in_panel_footer .addToCart{
  border:1px solid #f8ae57;
  background: #fff;
  color:#f8ae57;
}
.in_panel_footer .buyNow{
  border:1px solid #f8ae57;
  background: url('/static/Image/buynowbg.jpg') repeat-x center center;
  background-size: contain;
  color:#fff;
}
@media screen and (max-width: 800px)  {
  .in_panel_warpper {
    padding: 0 2rem;
  }
}
.Recommend{
  margin-top:12px;
}
.in_panel_header {
  text-align: left;
}
.in_panel_title {
  position: relative;
  font-size: 25px;
}
.in_panel_title img{
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0,-50%);
  cursor: pointer;
}
.in_panel_content {
  min-height: 70%;
}
.in_panel_footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.productDetail_price_warpper {
  display: flex;
  flex-wrap: nowrap;
  height: 60px;
  line-height: 60px;
  justify-content: space-between;
  background-color: #f5f5f5;
  padding: 0 10px;
  margin: 10px 0;
}
.productDetail_price {
  display: flex;
  flex-wrap: nowrap;
}
.productDetail_price_lable {
  font-size: 16px;
}
.productDetail_precentPrice_content {
  margin-left: 20px;
  font-size: 16px;
}
.productDetail_precentPrice_content_heightLine {
  color: red;
}
.productDetail_primePrice_content {
  margin-left: 20px;
  font-size: 16px;
  text-decoration: line-through;
}
.in_panel_iconList {
  margin-top: 40px;
  text-align: left;
  display: flex;
  flex-wrap: nowrap;
}
.in_panel_icon_warpper {
  margin-right: 10px;
}
    .in_panel_footer {
      .CartBtn{
        height: 70px;
        font-size: 20px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #d9b672;
        color: #fff;
        border-radius: 5px;
        transition: .1s;
        text-transform: uppercase;
        width: 48%;
        background-color: unset;
        margin-right: 4%;
        background-color: #d9b672;
        position: relative;
        overflow: hidden;
        padding-left: 30px;
        &:disabled{
          cursor:not-allowed;
          background: #ccc;
          border: 1px solid #ccc;
          color: #333333;
           &:hover{
           transform: translateY(0px)!important;
          }
        }
        &::after{
          content: '';
          width: 34px;
          height: 28px;
          background: url(/images/pc/CartBtn.png) no-repeat;
          position: absolute;
          left: 40px;
        }

      }
      .BuyBtn{
        height: 70px;
        font-size: 20px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #e27368;
        background-color: #e27368;
        color: #fff;
        border-radius: 5px;
        transition: .1s;
        text-transform: uppercase;
        width: 48%;
        position: relative;
        overflow: hidden;
        padding-left: 30px;
        &:disabled{
          cursor:not-allowed;
          background: #ccc;
          border: 1px solid #ccc;
          color: #333333;
           &:hover{
           transform: translateY(0px)!important;
          }
        }
        &::after{
          content: '';
          width: 34px;
          height: 28px;
          background: url(/images/pc/BuyBtn.png) no-repeat;
          position: absolute;
          left: 40px;
        }
      }
      // .in_btn {
      //   height: 60px;
      //   font-size: 24px;
      //   color: @base_color;
      //   display: inline-flex;
      //   justify-content: center;
      //   align-items: center;
      //   border: 1px solid @base_color;
      //   background-color: unset;
      //   border-radius: 5px;
      //   transition: .1s;
      //   &:hover{
      //     transform: translateY(-3px);
      //   }
      //   // &:first-child {
      //   //   background-color: @base_color;
      //   //   color: #fff;
      //   //   margin-right: 4%;
      //   // }
      // }
    }
    .in_panel_footer_top{
      .CartBtn{
        padding-left: 0;
        /deep/ span{
          padding-left: 20px;
        }
      }
      .BuyBtn{
        padding-left: 0;
        /deep/ span{
          padding-left: 20px;
        }
      }
    }
</style>
