<template>

    <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse"
       :default-active="activePath" router unique-opened background-color="#233648" text-color="#fff" active-text-color="#0097e6">
        <div class="brandBox">
            <h3 class="brand" v-if="!isCollapse" @click="welPage">Wong's Manage</h3>
            <img v-else src="../assets/images/user.jpg" alt="">
        </div>
        <!-- 一级菜单 -->
        <!-- 这里的index要求传字符串，所以要转换一下 -->
        <el-submenu :index="String(item.id)" v-for="item in menuList" :key="item.id">

            <template slot="title" class="txt">
                <i :class="iconObj[item.id]" ></i>
                <span slot="title">{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+chItem.path" v-for="chItem in item.children"
                :key="chItem.id"
                @click="saveNavState('/'+chItem.path)"    
            >
                <i class="el-icon-menu"></i>
                {{ chItem.authName }}
            </el-menu-item>
        </el-submenu>
       
    </el-menu>
</template>

<script>
import { mapState } from 'vuex';
import { getAsideFun } from '../api/request-api'
export default {
    name: 'Aside',
    data() {
        return {
            menuList: [],
            iconObj:{
                "125":"fa fa-user-o",
                "103":"fa fa-bookmark",
                "101":"fa fa-shopping-bag",
                "102":"fa fa-file-text",
                "145":"fa fa-bar-chart",
            },
            activePath:''
        };
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        async getRequest() {
            const res = await getAsideFun()
            this.menuList = res.data
            // console.log(res.data)
        },
        // 保存链接的激活状态
        saveNavState(){
            // 获取当前路由的路径
            this.activePath = sessionStorage.setItem("activePath" , this.$route.path)
            this.activePath = this.$route.path
        },
        welPage(){
            this.$router.push('/welcome')
        }

    },
    computed: {
        ...mapState(['isCollapse'])
    },
    async created() {
        this.getRequest()
        // 一开始就赋值到activePath上
        this.activePath = sessionStorage.getItem("activePath")
    }
}
</script>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}

.el-menu {
    background-color: #233648;
    border-right: none;

    .brandBox {
        width: 100%;
        height: 40px;   
        background-color: #233648;

        img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin: 5px 0 0 18px;
        }

        .brand {
            color: #fff;
            margin: 0 0 0 25px;
            line-height: 40px;
            cursor: pointer;
            transition: all .3s linear;
            &:hover{
                text-shadow: 0 0 10px #fff,
            }
        }
    }
    .el-submenu__title{
        i{
            margin-right:8px;
            color: #fff;
        }
        span{
             font-size: 12px;
        }
        
    }
    .el-menu-item{
            font-size: 12px;
        }

}
</style>