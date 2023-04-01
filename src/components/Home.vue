<template>
  <el-container class="home-container">
    <el-aside width="initial">
      <AsideView></AsideView>
    </el-aside>
    <el-container>
      <el-header style="height: 40px">
        <!-- 头部导航组件 -->
        <HeaderView></HeaderView>
      </el-header>

      <el-main>
        <Tags></Tags>
        <!-- welcome占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import HeaderView from '../views/Header.vue'
import AsideView from '../views/Aside.vue'
import Tags from '../views/Tags.vue'
export default {
  name: 'Home',
  components: {
    HeaderView,
    AsideView,
    Tags
  },
  methods: {
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100vh;

  .el-header {
    background-color: #e8e8e8;
    border-bottom: .5px solid #ccc;
  }

  .el-aside {
    background-color: #233648;
  }

  .el-main {
    background-color: #f3f3f3;
  }
}
</style>