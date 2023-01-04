<template>
<div class="in_panel_header">
    <div class="p-name-box">
      <p style="width: 88%;">{{panelDetail.Name}}</p>
      <div class="OverView" v-html="panelDetail.OverView"></div>
      <div class="fix">
        <!-- <div class="ProductCode">{{$t("product.ProductCode")}}:{{panelDetail.Code}}</div> -->
        <!-- <div class="ProductRate">
          <Rate  v-model="panelDetail.Score" disabled  disabled-void-color="#5f6548" disabled-void-icon-class="el-icon-star-off"></Rate>
        </div> -->
      </div>
      <div class="Specification fix" v-if="panelDetail.Specification">
        <div v-html="panelDetail.Specification"></div>
      </div>

      <div class="in_pannel_addtofav"><img :src="panelDetail.IsFavorite ? '/images/pc/productDetail_01.png': '/images/pc/productDetail_05.png'" @click="addFavorite"/></div>
    </div>
    <div class="in_panel_subTitle">
      <p>{{$t('product.priceTitle')}}: </p>
      <inPrices :primePrices="panelDetail.ListPrice+AddPrice" :currentPrices="panelDetail.SalePrice+AddPrice"  :currency="panelDetail.Currency" :DefaultListPrice="panelDetail.DefaultListPrice+AddPrice" :DefaultSalePrice="panelDetail.DefaultSalePrice+AddPrice" :DefaultCurrency="panelDetail.DefaultCurrency" size="huge" :heightLine="true" styla="margin: 20px 0;" :max="panelDetail.MaxPurQty" :min="panelDetail.MinPurQty"></inPrices></div>
    <!-- <div class="in_unitInfo" v-if="panelDetail.UnitInfo.Desc!==null">{{$t('product.Unit')}}:{{panelDetail.UnitInfo.Desc}}</div> -->
    <!-- <div class="in_panel_product">
        <div class="ProductCode">
            <div class="leftpart">{{$t("product.ProductCode")}}: {{panelDetail.Code}}</div>
            <div class="rightpart"><HkProductShare></HkProductShare></div>
        </div>
    </div> -->
</div>
</template>
<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import PanelDetail from '@/model/PanelDetail';
import inPrices from '@/components/base/pc/InsPrices.vue';
import HkProductShare from '@/components/hkTasteBusiness/pc/product/HkProductShare.vue';
import { Rate } from 'element-ui';
@Component({ components: { inPrices, HkProductShare, Rate } })
export default class PkProductInfo extends Vue {
  @Prop() private readonly panelDetail!: PanelDetail;
  @Prop() private readonly ProductSku!: string;
  @Prop() private readonly AddPrice!: string;
  private Score:number=0;
  addFavorite () {
    let ps;
    if (this.panelDetail.IsFavorite) {
      ps = this.$Api.product.removeFavorite(this.ProductSku).then((result) => {
        if (result.Succeeded) {
        // Vue.prototype.$Confirm(this.$t('Message.Message'), this.$t('product.successInRemoving'));
          this.$message({
            message: this.$t('product.successInRemoving') as string,
            type: 'success',
            customClass: 'messageBoxMobile'
          });
          this.panelDetail.IsFavorite = false;
        } else if (result.ReturnValue.Code === 1000) {
          Vue.prototype.$Confirm(this.$t('product.logouted'), this.$t('product.loginow'), () => { this.$Login(this.addFavorite); });
        }
      });
    } else {
      ps = this.$Api.product.addFavorite(this.ProductSku).then((result) => {
        if (result.Succeeded) {
          // Vue.prototype.$Confirm(this.$t('Message.Message'), this.$t('product.successInAdding'));
          this.$message({
            message: this.$t('product.successInAdding') as string,
            type: 'success',
            customClass: 'messageBoxMobile'
          });
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
}
</script>
<style lang="less">
.messageBoxMobile{
      z-index: 100000!important;
}
</style>
<style scoped lang="less">
.in_unitInfo{
  font-size: 16px;
  color:@base_color;
  text-align: right;
}
.p-name-box {
    width: 100%;
    position: relative;
    margin-top: 10px;
    .ProductCode{
      font-size: 14px;
      color: #333;
      font-family: 'SourceHanSans-Regular';
      margin-top: 10px;
      float: left;
    }
    .ProductRate{
      float: right;
      margin-top: 15px;
    }
}
.p-name-box p {
    width: 100%;
    color: #d9b672;
    font-size: 32px;
    line-height: 36px;
    overflow: hidden;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    text-align: left;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    font-family: 'SourceHanSans-Regular';
    margin-bottom: 10px;
    font-weight: bold;
}
.p-name-box .Specification{
  margin-top: 10px;
  /deep/ p{
    font-size: 18px;
    color: #333;
    font-family: 'SourceHanSans-Regular';
    span{
      font-size: 18px;
    color: #333;
    font-family: 'SourceHanSans-Regular';
    }
  }
}
.p-name-box .in_pannel_addtofav{
    position: absolute;
    right: 30px;
    top: 0;
    display: block;
    width: 30px;
    height: 37px;
}
.p-name-box .in_pannel_addtofav img{
    width: 30px;
    cursor: pointer;
}
.p-name-box .OverView{
  /deep/ p{
    color: #333;
    line-height: 32px;
    font-size: 18px;
    font-family: 'SourceHanSans-Regular';
  }
}
.in_panel_header{
  width: 100%;
  display: block;
}
.in_panel_product{
    width: 100%;
    padding-bottom: 40px;
    border-bottom: 1px solid #505050;
    padding-top: 30px;
    margin-bottom: 10px;
}

.in_panel_product .ProductCode{
    width: 100%;
    display: block;
}
.in_panel_product .ProductCode .leftpart{
    width: 60%;
    float: left;
    font-size: 14px;
    word-break: break-all;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding-top: 0.5rem;
}
.in_panel_product .ProductCode .rightpart{
    width: 40%;
    float:left;
}
.in_panel_subTitle{
    // font-size: 16px!important;
    position: relative;
    width: 100%;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: left;
  >img{
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(0,-50%);
  }
  p{
    font-size: 24px;
    color: #e27368;
    margin-right: 14px;
  }
}
</style>
