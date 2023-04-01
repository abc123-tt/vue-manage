<template>
  <header class="headerBox">
    <!-- 头部左边按钮 -->
    <div class="l-content">
      <span class="control-menu" @click="changeMenu"><i class="fa fa-bars"></i></span>
    </div>
    <!-- 头部右边按钮 -->
    <div class="r-content">
      <!-- 用户信息 -->
      <!-- @command="skipPage(loginOut)" -->
      <span v-if="msgData.length !== 0" class="el-icon-message-solid msg" @click="showMsg('yes')"><sup></sup></span>
      <span v-else class="el-icon-message-solid msg" @click="showMsg('no')"></span>
      <el-dropdown trigger="hover" size="mini" @command="skipPage">
        <div class="userInfoBox">
          <!-- <div class="msg" icon="el-icon-message-solid"><sup><i class="fa-sharp fa-solid fa-circle"></i></sup></div> -->
          <span><img src="../assets/images/user.jpg" alt=""></span>
          <span>admin</span>
          <i class="fa fa-caret-down"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-s-home" command="welcome">首页</el-dropdown-item>
            <el-dropdown-item icon="el-icon-s-custom" command="personal">个人中心</el-dropdown-item>
            <el-dropdown-item icon="el-icon-switch-button" command="loginOut">注销</el-dropdown-item>
          </el-dropdown-menu>
        </div>
      </el-dropdown>

      <!-- 消息弹框 -->
      <el-drawer title="消息中心" :visible.sync="drawer" :direction="direction">
        <ul v-if="msgData.length !== 0">
          <li v-for="(item , index) in msgData" :key="index">
            <a href="#" class="clearfix">
              <span>{{item.title}}</span>
              <span>{{item.date}}</span>
            </a>
          </li>
        </ul>
        <el-empty v-else description="暂无消息"></el-empty>
      </el-drawer>
    </div>
  </header>
</template>

<script>

export default {
  name: 'Header',
  data() {
    return {
      // 消息弹框
      drawer: false,
      direction: 'rtl',

      // 消息弹框数据
      msgData: [
        {
          "title": "优惠券到期提醒",
          "date": "2022-06-01"
        },
        {
          "title": "618大促，请查看活动具体信息",
          "date": "2022-06-11"
        },
        {
          "title": "充值成功",
          "date": "2022-04-11"
        },
        {
          "title": "退货处理",
          "date": "2022-09-08"
        },
      ]
    }
  },
  methods: {
    // 控制侧边看的展开与收缩
    changeMenu() {
      this.$store.commit('handleCollapse')
      
    },
    // 用户下拉菜单选项的跳转
    skipPage(val) {
      if (val === "welcome") {
        this.$router.push("/welcome")
      } else if (val === "personal") {
        this.$router.push("/personal")
      } else if (val === "loginOut") {
        sessionStorage.clear();
        this.$router.push("/login");
        this.$message('操作成功');
      }
    },
    // 打开消息弹窗
    showMsg(val) {
      this.drawer = true
      if (val === "yes") {
        this.isEmpty = true
      } else if (val === "no") {
        this.isEmpty = false
      }
    }
  },


}
</script>

<style lang="less" scoped>
.headerBox {
  display: flex;
  justify-content: space-between;
  line-height: 40px;

  .l-content {
    .control-menu {
      font-size: 18px;
      cursor: pointer;
      color: #606266;
      padding: 0 5px;

      &:hover {
        transition: .2s;
        color: #192a56;
      }
    }
  }

  .r-content {
    margin-right: 20px;

    .msg {
      padding: 8px 10px;
      font-size: 20px;
      color: #606266;
      position: relative;
      cursor: pointer;
      vertical-align: middle;
      margin-right: 10px;

      &:hover {
        background-color: #eee;
      }

      sup {
        width: 8px;
        height: 8px;
        border: 1px solid #fff;
        border-radius: 50%;
        background: #f56c6c;
        position: absolute;
        top: 6px;
        left: 20px;
      }
    }

    .userInfoBox {
      cursor: pointer;

      img {
        width: 25px;
        height: 25px;
        vertical-align: middle;
        border-radius: 50%;
        border: 2px solid #fff;
        margin-bottom: 3px;
      }

      span {
        font-size: 12px;
        margin: 0 5px;
      }

      &:hover {
        color: #192a56;
      }
    }
  }
}

.el-dropdown-menu__item {
  font-size: 14px;
  padding: 10px 15px;
}

/deep/.el-drawer__header {
  margin-bottom: 0px;
  border-bottom: 1px solid #eee;
  padding: 0px 20px;
  height: 50px;
  color: #333;

}

.el-drawer {
  ul {
    color: #cbcccd;
    list-style: none;
    padding-left: 0;
    margin: 0;

    li {
      padding: 5px 20px;

      &:hover {
        span {
          &:first-child {
            color: #409eff;
          }
        }
      }

      a {
        font-size: 14px;
        color: #333;
        text-decoration: none;
        border-bottom: 1px solid #eee;

        span {
          &:last-child {
            float: right;
            color: #ccc;
          }
        }
      }
    }
  }
}

.clearfix {
  display: block;
  zoom: 1;

  &:after {
    content: '';
    display: block;
    visibility: hidden;
    clear: both;
    height: 0;
  }
}
</style>