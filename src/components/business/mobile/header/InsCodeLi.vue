<template>
   <div class="main-code">
      <p v-on:click="showCurr=!showCurr;">
        <span>{{currentCurrency}}</span>
        <img src="/images/mobile/l-Arrow.png" :class="{'rotate':showCurr}">
      </p>
      <transition name="el-fade-in-linear" >
      <ul v-if="showCurr">
          <li v-for="(item,index) in currencyList" :key="index">
              <p v-on:click="changeCurrency(item.Id)" v-if="item.Id!=codeId">{{item.Name}}</p>
          </li>
      </ul>
      </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component
export default class InsCodeLi extends Vue {
  showCurr:boolean = false;
  currentCurrency:string ='HKD';
  currencyList:object = [{
    Id: '1',
    Name: 'HKD'
  }, {
    Id: '2',
    Name: 'USD'
  }
  // {
  //   Id: '3',
  //   Name: 'RMB'
  // }
  ];
  codeId:number=1;

  getCurrList (coId) {
    (this as any).currencyList.forEach((element, index) => {
      if (element.Id === String(coId)) {
        this.currentCurrency = (this as any).currencyList[index]['Name'];
        (this as any).currencyList.splice(index, 1);
      }
    });
  }
  changeCurrency (val) {
    this.$Api.member.setCurrency(val).then((result) => {
      this.$message({
        message: this.$t('changeCurSuccess') as string,
        type: 'success'
      });
      this.$Storage.set('currency', result.Currency.Id);
      this.Reload();
    }).catch((error) => {
      console.log(error);
    });
  }
  LoadData () {
    this.codeId = this.$Storage.get('currency');
    this.getCurrList(this.codeId);
  }
  mounted () {
    this.LoadData();
  }
}
</script>
<style scoped lang="less">
.main-code{
  width: 7rem;
  position: relative;
  z-index: 1;
  display: inline-block;
  // float: right;
  margin-right: 1rem;
  p{
    width: 100%;
    // height: 2.8rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    border: 1px solid #fff;
    border-radius: 4px;
    padding:0.3rem 1.6rem;
    box-sizing: border-box;
    position: relative;
    span{
      color: #fff;
      font-size: 1.2rem;
    }
    img{
      width:1rem;
      transition: all 0.3s;
      margin-left: 1rem;
      position: absolute;
      right: 1rem;
      &.rotate{
        transform: rotate(180deg);
      }
    }
  }
  ul{
    position: absolute;
    width:100%;
    background-color: #fff;
    li{
      cursor: pointer;
      height:2.8rem;
      line-height: 2.8rem;
      border-top:0;
      transition: all 0.3s;
      box-sizing: border-box;
      border: 1px solid #999999;
      margin-top: -1px;
      // border-bottom: 1px solid #999999;
      border-radius: 3px;
          overflow: hidden;
      p{
        border-top:0;
        justify-content: center;
        box-sizing:border-box;
        color:#333;
        font-size:1.2rem;
        padding: 0;
      }
      &:hover{
        p{
          font-weight: bold;
        }
      }
      // &:last-child{
      //   border-bottom: none;
      // }
    }
  }
}
</style>
