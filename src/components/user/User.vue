<template>
  <div>
    <el-card class="box-card">
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable @clear="getRequest" v-model="queryInfoParams.query">
            <el-button slot="append" icon="el-icon-search" @click="getRequest"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserBtn">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表展示区 -->
      <el-table :data="userList" stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- enterable鼠标是否可进入到 tooltip 中 -->
          <template v-slot="scope">
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle @click="editUserBtn(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" circle @click="deleteUser(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="角色管理" placement="top" :enterable="false">
              <el-button @click="setRole(scope.row)" type="warning" icon="el-icon-setting" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfoParams.pagenum" :page-sizes="[2, 5, 10, 15]" :page-size="queryInfoParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <DialogView :user-info="queryInfoParams" :is-show-this="isShow" :edit-info="EditInfo">
    </DialogView>
    <!-- 角色管理 -->
    <el-dialog title="角色管理" :visible.sync="setRoleDialogVisible" width="30%" @close="setRoleDialogClose">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>

        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>


</template>

<script>
import { getUserListFun, changeStateFun, SelectUserFun, DeleteUser, getRolesListFun, descributionRole } from '../../api/request-api'
import DialogView from '../../views/Dialog.vue'
import bus from '../../plugins/eventBus'
export default {
  name: 'User',
  data() {
    return {
      queryInfoParams: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 查询到用户的信息
      EditInfo: {},
      isShow: false,
      // 控制角色分配对话框显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色id值
      selectRoleId: ''
    }
  },
  methods: {
    async getRequest() {
      // const res = await getUserListFun({...this.queryInfoParams})
      const res = await getUserListFun(this.queryInfoParams)
      // console.log(res)
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.msg)
      }
      this.userList = res.data.users
      this.total = res.data.total

      // console.log(res);
    },
    // 监听 pagesize 改变事件
    handleSizeChange(newSize) {
      this.queryInfoParams.pagesize = newSize
      this.getRequest()
    },
    // 监听 pagenum 改变事件
    handleCurrentChange(newPage) {
      this.queryInfoParams.pagenum = newPage
      this.getRequest()
    },
    // 监听 switch 开关状态的改变
    async userStateChange(userInfo) {
      const res = await changeStateFun(userInfo)
      if (res.meta.status != 200) {
        // 修改失败要重置回去
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    addUserBtn() {
      this.isShow = true
      this.$store.commit('handleDialog')
    },
    
    async editUserBtn(id) {
      this.isShow = false
      const res = await SelectUserFun('users' , id)
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.EditInfo = res.data
      this.$store.commit('handleDialog')
    },
    async deleteUser(id) {
      const confirmRes = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
        // 捕捉错误
      ).catch(err => err)
      // 如果用户确认删除，则返回值为字符串confirm
      // 如果用户取消了删除，则返回值为字符串cancel
      if (confirmRes !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // 发送请求
      const res = await DeleteUser('users' , id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      // 刷新列表
      this.getRequest()
    },
    // 分配角色
    async setRole(userInfo) {
      this.userInfo = userInfo
      const res = await getRolesListFun()
      this.setRoleDialogVisible = true
      if (res.meta.status != 200) {
        this.$message.error(res.mata.msg)
      }
      this.rolesList = res.data
    },
    // 保存用户的角色设置
    async saveRoleInfo() {
      // 判断是否有选择新的角色
      if (!this.selectRoleId) {
        return this.$message.error('请选择需要分配的角色')
      }
      const res = await descributionRole(this.userInfo.id, this.selectRoleId)
      if (res.meta.status != 200) {
        this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getRequest()
      this.setRoleDialogVisible = false

    },
    // 修改完初始化数据
    setRoleDialogClose(){
      this.selectRoleId = ''
      this.userInfo = {}
    }

  },
  async created() {
    this.getRequest()
    bus.$on('refreshList', val => {
      this.userList = val.data.users
      this.total = val.data.total
    })
  },
  components: {
    DialogView
  },



}
</script>

<style lang="less" scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 100%;
  border: 0;
}

.el-table {
  margin-top: 15px;
  border-top: 1px solid #EBEEF5;
  font-size: 12px;

  /deep/.el-table__header {
    font-size: 14px !important;
  }

  /deep/ .el-table__cell {
    text-align: center;

  }
}

.el-pagination {
  margin-top: 20px;
}
</style>