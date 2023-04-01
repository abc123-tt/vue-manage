<template>
<!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="item in breadList" :key="item.path" :to="item.path">{{item.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>

</template>

<script>
export default {
    name:'Tags',
    mounted(){
     
    },
    data(){
        return {}
    },
    computed:{
        // 使用计算属性的返回值拿到路径数组
        breadList(){
            return this.$route.matched
        }
    }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
    margin-bottom:15px;
    font-size: 12px;
}
</style>