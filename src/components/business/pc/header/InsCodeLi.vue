<template>
   <div class="main-code">
      <p v-on:click="showCurr=!showCurr;">
        <span>{{currentCurrency}}</span>
        <img v-if="!showFixedHeader" src="/images/pc/l-BlueArrow.png" :class="{'rotate':showCurr}">
        <img v-if="showFixedHeader" src="/images/pc/l-BlueArroww.png" :class="{'rotate':showCurr}">
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

  get showFixedHeader () {
    return this.$store.state.showFixedHeader;
  }

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
// @media screen and (max-width:1400px) {
//   .main-code{
//     width: 54px;
//     p{
//       span{
//         width:34px;
//         height: 17px;
//         font-size: 13px;
//       }
//       img{
//         width:9px!important;
//         margin-right:5px!important;
//       }
//     }
//      ul{
//       li{
//         p{
//           height:25px;
//           font-size:13px;
//         }
//       }
//     }
//   }
// }
// @media screen and (min-width:1401px) {
//   .main-code{
//     width: 85px;
//     p{
//       span{
//         width:56px;
//         height: 29px;
//         font-size: 18px;
//       }
//     }
//     ul{
//       li{
//         p{
//           height:35px;
//           font-size:18px;
//         }
//       }
//     }
//   }
// }
.header-default{
  .main-code{
    p{
      span{
        height: 20px;
        font-size: 16px;
      }
    }
    ul{
      li{
        p{
          height:25px;
          font-size:16px;
        }
      }
    }
  }
}
.main-code{
  width: 80px;
  p{
    span{
      // width:56px;
      height: 29px;
      font-size: 16px;
    }
  }
  ul{
    li{
      p{
        height:29px;
        font-size:16px;
      }
    }
  }
}
.main-code{
  position: relative;
  z-index: 2;
  display: inline-block;
  margin-right: 40px;
  p{
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    // justify-content: space-between;
    justify-content: center;
    cursor: pointer;
    border: 1px solid #333;
    border-radius: 3px;
    box-sizing: border-box;
    position: relative;
    font-family: 'SourceHanSans-Regular';
    span{
      color: #333;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'SourceHanSans-Regular';
      margin-left: -6px;
    }
    img{
      width:8px;
      transition: all 0.3s;
      // margin-right: 8px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%) rotate(0);
      right: 7px;
      &.rotate{
        transform: rotate(180deg) translateY(50%);
      }
    }
  }
  ul{
    position: absolute;
    width:100%;
    li{
      cursor: pointer;
      border-top:0;
      transition: all 0.3s;
      box-sizing: border-box;
      p{
        border-top:0;
        justify-content: center;
        box-sizing:border-box;
        color:#666666;
        background:#fff;
        // text-indent: 8px;
      }
      &:hover{
        p{
          font-weight: bold;
        }
      }
    }
  }
}
</style>
