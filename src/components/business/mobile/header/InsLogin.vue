<template>
    <div class="memberlogin" v-click-outside="closeDialog">
      <div class="menberCentral" @click="menberCentral">
        <img class="showMenberCentral" src="/images/mobile/Mobile-index_01.png">
        <transition name="slide-fade">
          <div class="lang_flow" v-show="showMenberCentral" @click="memberCentral">
              <div data-to="/account/memberInfo" class="ii">{{$t('Account.MemberInformation')}}</div>
              <div data-to="/account/notification" class="ii">{{$t('Account.MyMessages')}}</div>
              <div data-to="/order/List" class="ii">{{$t('Account.MyOrder')}}</div>
              <div data-to="/account/deliveryAddress" class="ii">{{$t('Account.DeliveryAddress')}}</div>
              <div data-to="/account/mycoupon" class="ii">{{$t('MyCoupon.MyCoupon')}}</div>
              <div class="ii" @click="logout">{{$t('Account.Logout')}}</div>
          </div>
        </transition>

      </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Cookie from 'js-cookie';
@Component
export default class InsLangSwitch extends Vue {
  private showMenberCentral:boolean = false;

  closeDialog () {
    this.showMenberCentral = false;
  }
  menberCentral () {
    if (!this.$Storage.get('isLogin')) {
      window.location.href = '/account/login';
    } else {
      this.showMenberCentral = !this.showMenberCentral;
    }
  }
  memberCentral (e) {
    let target = e.target as HTMLElement;
    if (target.className === 'ii' && target.dataset.to) {
      this.$router.push({
        path: target.dataset.to
      });
      this.$store.dispatch('isShowMenu', false);
    }
  }
  logout () {
    this.$Api.member.logout().then((result) => {
      if (result) this.$message('Message.SucceedInOperating');
      this.$router.push('/');
      this.Reload();
    });
  }
}
</script>
<style scoped lang="less">
  .menberCentral{
    // padding-left: 1rem;
    padding-right: 1.5rem;
    float: left;
    height: 3.5rem;
    // border-right: 1px solid #e6e6e6;
    display: flex;
    align-items: center;
    justify-content: center;
    .lang_flow{
    position: absolute;
    top: 6rem;
    left: 0px;
    width: 100%;
    background: #FFF;
    z-index: 999;
    .ii{
      color:#000;
      font-size: 1.4rem;
      height: 4rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid #ccc;
    }
    }
    img{
      width:2.5rem;
      margin: 0 auto;
      display: block;
    }
  }
  .slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
