<template>
    <div class="products_container">
        <inProductWindow v-for="item in allItems" :key="item.id" :item="item"
        class="product_item"></inProductWindow>
    </div>
</template>
<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import Product from '@/model/youWouldLike';
@Component({ components: { inProductWindow: () => import(/* webpackChunkName: "product" */ '@/components/hkTasteBusiness/pc/product/HkProductWindow.vue') } })
export default class InsProductList extends Vue {
    @Prop() private readonly column!: number;
    @Prop() private readonly allItems!: Product[];
}
</script>
<style scoped>
.products_container{
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin: 0 auto;
    margin-top: 30px;
}
.product_item{
    box-sizing: border-box;
    width: 380px;
    float: left;
    margin-right: 28px;
    margin-bottom: 40px;
    border: 2px solid #ebd9b6;
    border-radius: 6px;
    overflow: hidden;
    transition: all 0.3s;
}
.product_item:hover{
    background-color: #e1c58e;
    border-radius: 6px;
}
.product_item:nth-child(3n){
    margin-right: 0%!important;
}
</style>
