<template>
  <div class="in_panel_warpper mobileWarper" :class="{'Engap': $Storage.get('locale') === 'E'}" :style="warpperStyle">
    <div class="in_panel_content">
      <!-- <inSelect
        v-for="(item,index) in panelDetail.AttrList"
        :items="item"
        :key="index"
        placeholder="请选择"
        v-model="ProductInfor['Attr'+(index+1)]"
        @input="changeAttr"
        @changePrice="AdditionalPrice"
      ></inSelect> -->
      <inNum v-model="ProductInfor.Qty" :v="ProductInfor.Qty" :min="panelDetail.MinPurQty" :max="panelDetail.MaxPurQty" styla="text-align:center;"></inNum>
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
        :nama="$i18n.t('product.'+item.nama)"
        :key="item.nama"
        :loading="(item.action === 'addToCart')?Loading:buyLoading"
        :type="(item.action === 'addToCart' || item.action === 'favorite' || item.action === 'buy') ? 'primary' : 'error'"
        :action="item.action"
        @click="click"
        :class="{'CartBtn' : item.action == 'addToCart', 'BuyBtn' : item.action == 'buy'}"
      ></inButton>
    </div>
      <div class="in_panel_footer " v-else>
        <button type="button" :disabled="SoldOutAttr" @click="click('addToCart')" class="CartBtn">{{$t('product.addToCart')}}</button>
        <button type="button" :disabled="SoldOutAttr" @click="click('buy')" class="BuyBtn">{{$t('product.buy')}}</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import PanelDetail from '@/model/PanelDetail';
import inNum from '@/components/base/mobile/InsNum.vue';
import inSelect from '@/components/base/mobile/InsRadio.vue';
import inButton from '@/components/base/pc/InsButton.vue';
import inPrices from '@/components/base/mobile/InsPrices.vue';
import HkProductShare from '@/components/hkTasteBusiness/mobile/product/HkProductShare.vue';
import ShopCartItem from '@/model/shopCartItem';
import { Button as ElButton } from 'element-ui';
@Component({ components: { inNum, inSelect, inButton, inPrices, HkProductShare, ElButton } })
export default class InsPanel extends Vue {
  @Prop() private readonly width!: string;
  @Prop() private readonly height!: string;
  @Prop() private readonly panelDetail!: PanelDetail;
  @Prop() private readonly ProductSku!: string;
  Loading:boolean=false;
  buyLoading:boolean=false;
  private delay = 0;
  private NewPrice:number=0;
  private attrPrices:any[]=[];
  private SoldOutAttr:boolean= false;
  private AttrArray:any = '';
  private AttrComboImgList:any ='';
  private AttrSelectImg:string ='';
  private ProductInfor: ShopCartItem = new ShopCartItem();
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
  created () {

  }
  addFavorite () {
    let ps;
    if (this.panelDetail.IsFavorite) {
      ps = this.$Api.product.removeFavorite(this.ProductSku).then((result) => {
        if (result.Succeeded) {
          // Vue.prototype.$Confirm(this.$t('Message.Message'), this.$t('product.successInRemoving'));
          this.$message(this.$t('product.successInRemoving') as string);
          this.panelDetail.IsFavorite = false;
        } else if (result.ReturnValue.Code === 1000) {
          Vue.prototype.$Confirm(this.$t('product.logouted'), this.$t('product.loginow'), () => { this.$Login(this.addFavorite); });
        }
      });
    } else {
      ps = this.$Api.product.addFavorite(this.ProductSku).then((result) => {
        if (result.Succeeded) {
          // Vue.prototype.$Confirm(this.$t('Message.Message'), this.$t('product.successInAdding'));
          this.$message(this.$t('product.successInAdding') as string);
          this.panelDetail.IsFavorite = true;
        } else if (result.ReturnValue.Code === 1000) {
          Vue.prototype.$Confirm(this.$t('product.logouted'), this.$t('product.loginow'), () => { this.$Login(this.addFavorite); });
        }
      });
    }
    return ps;
    // return this.$Api.product.addFavorite(this.ProductSku).then((result) => {
    //   if (result.Succeeded) {
    //     // Vue.prototype.$Confirm('succeed', this.$t('product.successInAdding'));
    //   } else if (result.ReturnValue.Code === 1000) {
    //     Vue.prototype.$Confirm(this.$t('product.logouted'), this.$t('product.loginow'), () => { this.$Login(this.addFavorite); });
    //   }
    // });
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
      console.log(this.AttrComboImgList, 'this.AttrComboImgListthis.AttrComboImgList');
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
    // if (this.panelDetail.AttrList !== null) this.changeAttr();
  }
}
</script>
<style lang="less">
.messageboxNoraml{
  z-index: 1000000000!important;
}
</style>

<style lang="less">
.in_panel_footer .el-button+.el-button{
  margin-left: 0px!important;
}
.in_panel_footer .actionBtn span{
  font-size: 1.6rem;
}
.in_panel_warpper.mobileWarper .in_num_label{
  display: inline-block;
  width: auto!important;
  margin-right: 1rem;
}
.in_panel_warpper.mobileWarper .el-input-number{
  border:1px solid #333333!important;
  box-sizing: border-box;
  border-radius: 8px;
}
.in_panel_warpper.mobileWarper .el-input__inner{
  border:none!important;
  box-sizing: border-box;
  width: 4rem;
}
.in_panel_warpper.mobileWarper .in_num_main .el-input-number__decrease, .in_panel_warpper.mobileWarper .in_num_main .el-input-number__increase{
    width: 3rem!important;
    border: none;
    // border-radius: 5px;
    height: 3.1rem;
    line-height: 3.4rem;
    overflow: hidden;
    margin-top: -1px;
    background-color: transparent;
}
.in_panel_warpper.mobileWarper .in_num_main .el-input-number__decrease{
  border-right: 1px solid #333333;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
      // margin-left: -2px;
  left: 0;
}
.in_panel_warpper.mobileWarper .in_num_main .el-input-number__increase{
  border-left: 1px solid #333333;
  // margin-right: -2px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  right: 0;
}
.in_panel_warpper.mobileWarper .in_num_main .el-input-number__decrease i, .in_panel_warpper.mobileWarper .in_num_main .el-input-number__increase i{
  color:#d9b672;
  font-size: 1.4rem;
  font-weight: bold;
}
.in_panel_warpper.mobileWarper  .el-input-number{
  width: auto!important;
}
.in_panel_warpper.mobileWarper .el-input-number .el-input__inner{
  padding-left: 0rem;
  padding-right: 0rem;
  background: transparent!important;
  width: 10rem;
  line-height: 3.4rem!important;
  height: 2.5rem!important;
  color:#000!important;
  font-weight: 500;
  font-size: 1.4rem;
  font-family: 'SourceHanSans-Regular';
  font-weight: bold;
}
.mobileWarper{
  .in_num_warpper{
    margin-top: 1rem;
    .in_num_label{
      color:#666666;
    }
  }
  .in_panel_footer {
      .CartBtn{
      height: 4rem;
      font-size:1.4rem;
      color: #fff;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      background-color: #d9b672;
      color: #fff;
      border-radius: 5px;
      margin-bottom: 1rem;
      text-transform: uppercase;
      width: 48%;
      float: left;
      margin-left: 0px!important;
      position: relative;
      border: none;
      overflow: hidden;
      padding-left: 4rem;
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
          width: 2.4rem;
          height: 1.8rem;
          background: url(/images/pc/CartBtn.png) no-repeat;
          position: absolute;
          left: 2rem;
          background-size: contain;
        }
        span{
          padding-left: 3rem;
          font-size:1.4rem;
        }
      }
      .BuyBtn{
      height: 4rem;
      font-size:1.4rem;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      background-color: #244871;
      color: #fff;
      border-radius: 5px;
      margin-bottom: 1rem;
      border:none;
      text-transform: uppercase;
      width: 48%;
      float: left;
      margin-left: 4%;
      position: relative;
      overflow: hidden;
      padding-left: 4rem;

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
          width: 2.4rem;
          height: 1.8rem;
          background: url(/images/pc/BuyBtn.png) no-repeat;
          position: absolute;
          left: 2rem;
          background-size: contain;
        }

      }
    // .in_btn {
    //   height: 3.5rem;
    //   font-size:1.8rem;
    //   color: #333333;
    //   display: inline-flex;
    //   justify-content: center;
    //   align-items: center;
    //   background-color: #333333;
    //   color: #fff;
    //   border-radius: 3px;
    //   margin-bottom: 1rem;
    //   border:1px solid #333333;
    //   text-transform: uppercase;
    //   width: 48%;
    //   float: left;
    //   margin-left: 4%;
    //   span{
    //     font-size:1.4rem;
    //   }
    //   &:first-child {
    //     margin-left: 0px!important;
    //   }
    // }
  }
  .in_panel_footer_top{
    .CartBtn{
      padding-left: 0;
      span{
          padding-left: 3rem;
          font-size:1.4rem;
        }
    }
    .BuyBtn{
      padding-left: 0;
      span{
          padding-left: 3rem;
          font-size:1.4rem;
        }
    }
  }
}
</style>
<style lang="less" scoped>
.in_panel_content{
  width: 90%;
  margin: 0 auto;
}
.in_panel_footer{
  width: 90%;
  margin: 0 auto;
}
.in_panel_footer .actionBtn{
  width: 100%;
  font-size: 1.6rem;
  display: block;
  text-align: center;
}
.in_panel_footer .addToCart{
  border:1px solid #262626;
  background: #fff;
  color:#242424;
  margin-bottom: 1rem;
  padding: 15px 20px!important;
}
.in_panel_footer .buyNow{
  border:1px solid #262626;
  background:#262626;
  color:#fff;
  padding: 15px 20px!important;
}

.in_pannel_addtofav {
  width:90%;
  margin: 0 auto;
}
.in_panel_header {
  text-align: left;
}
.in_panel_subTitle{
    font-size: 2rem;
    position: relative;
    width: 90%;
    margin: 0 auto;
    text-align: center;
  >img{
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(0,-50%);
  }
}
.in_panel_footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 1.6rem;
}

.productDetail_price_warpper {
  display: flex;
  flex-wrap: nowrap;
  height: 5rem;
  line-height: 5rem;
  justify-content: space-between;
  background-color: #f5f5f5;
  padding: 0 1rem;
  margin: 1rem 0;
}
.productDetail_price {
  display: flex;
  flex-wrap: nowrap;
}
.productDetail_price_lable {
  font-size: 1.3rem;
}
.productDetail_precentPrice_content {
  margin-left: 1.6rem;
  font-size: 1.3rem;
}
.productDetail_precentPrice_content_heightLine {
  color: red;
}
.productDetail_primePrice_content {
  margin-left: 1.6rem;
  font-size: 1.3rem;
  text-decoration: line-through;
}
.in_panel_iconList {
  margin-top: 1rem;
  text-align: left;
  display: flex;
  flex-wrap: nowrap;
}
.in_panel_icon_warpper {
  margin-right: 1rem;
}
.Engap{
  .in_panel_footer{
    .CartBtn{
      &::after{
        content: '';
        left: 1rem;
      }
    }
    .BuyBtn{
      &::after{
        content: '';
        left: 1rem;
      }
      span{
        padding-left: 2rem;
      }
    }
  }
}
</style>
