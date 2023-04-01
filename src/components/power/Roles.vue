<template>
    <div>
        <el-card>
            <!-- 添加角色按钮 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="DialogTF = true">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data="rolesList" ref="rolesTable" border stripe @cell-click="handleRowHandle">
                <!-- 展开列 -->
                <el-table-column class="expand" type="expand">
                    <template v-slot="scope">
                        <el-row class="firLevelTree vcenter" v-for="firstItem in scope.row.children"
                            :key="firstItem.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRight(scope.row, firstItem.id)">{{ firstItem.authName }}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二三级权限 -->
                            <el-col :span="19">
                                <el-row class="secLevelTree" v-for="secondItem in firstItem.children"
                                    :key="secondItem.id">
                                    <!-- 二级 -->
                                    <el-col :span="6">
                                        <el-tag closable @close="removeRight(scope.row, secondItem.id)" type="success">
                                            {{ secondItem.authName }}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 一行24列 -->
                                    <!-- 三级 -->
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="threeItem in secondItem.children"
                                            :key="threeItem.id" closable @close="removeRight(scope.row, threeItem.id)">
                                            {{ threeItem.authName }}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <el-button size="mini" type="primary" round icon="el-icon-edit" @click="editRole(scope.row.id)">
                            编辑</el-button>
                        <el-button size="mini" type="danger" round icon="el-icon-delete"
                            @click="deleteRole(scope.row.id)">删除</el-button>
                        <el-button size="mini" type="warning" round icon="el-icon-setting" @click="setRight(scope.row)">
                            分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限的对话框 -->
        <el-dialog title="分配权限" :visible.sync="setRightVisible" width="30%">
            <el-tree show-checkbox default-expand-all node-key="id" :default-checked-keys="defKeys" :data="rightsList"
                :props="treeProps" ref="treeRef"></el-tree>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加用户对话框 -->
        <el-dialog @close="DialogClose" title="添加角色" :visible.sync="DialogTF" width="40%">
            <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="100px"
                class="demo-ruleForm">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="DialogTF = false">取 消</el-button>
                <el-button type="primary" @click="sendData('add')">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改角色对话框 -->
        <el-dialog @close="DialogClose" title="编辑角色信息" :visible.sync="DialogTF" width="40%">
            <el-form :model="roleInfo" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="100px"
                class="demo-ruleForm">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="roleInfo.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="roleInfo.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="DialogTF = false">取 消</el-button>
                <el-button type="primary" @click="sendData('edit')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getRolesListFun, DeleteRight, getRightListFun, allotRights, addRolesFun, SelectUserFun, EditUserFun, DeleteUser } from '@/api/request-api'
// import { mapState } from 'vuex'
export default {
    name: '',
    data() {
        return {
            // 获取所有角色列表
            rolesList: [],
            // 控制分配权限对话框的显示与隐藏
            setRightVisible: false,
            // 获取所有权限数据
            rightsList: [],
            // 树形控件的属性绑定对象
            treeProps: {
                label: 'authName',
                children: 'children'
            },
            // 默认选中的节点Id数组
            defKeys: [],
            // 获取当前的角色id
            roleID: '',
            // 控制对话框的关闭与打开
            DialogTF: false,
            // 存放添加角色的数据列表
            addRoleForm: {
                roleName: "",
                roleDesc: ""
            },
            // 添加角色的验证规则
            addRoleFormRules: {
                roleName: [
                    { required: true, message: "请输入用户名称", trigger: "blur" },
                    { min: 2, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
                ]
            },
            // 查询到的用户信息
            roleInfo: {}
        }
    },
    props: {
    },
    components: {

    },
    methods: {
        async getRequest() {
            const res = await getRolesListFun()
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.rolesList = res.data
            console.log(this.rolesList)

        },
        // 通过id删除权限
        async removeRight(role, rightId) {
            const confirmRes = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示',
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
            const res = await DeleteRight(role, rightId)
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            // 每次删除完都会合上
            // this.getRequest()

            // 删除完将返回的数据赋值给它
            role.children = res.data
        },
        // 分配权限
        async setRight(role) {
            // 获取当前项的id，传到后台
            this.roleID = role.id
            // 获取所有权限
            const res = await getRightListFun('tree')
            if (res.meta.status !== 200) {
                this.$message.error(res.meta.mgs)
            }
            this.rightsList = res.data

            // 初始化数组，否则每次点完都会累加
            this.defKeys = []
            // 调用递归函数遍历所有children，传入数据源role，再传入要保存id的数组
            this.getDefKeys(role, this.defKeys)
            this.setRightVisible = true
        },
        // 通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
        // 传入一个节点来判断是否是三级节点，还要有一个数组来保存
        getDefKeys(node, arr) {
            // 判断是否包含children属性,如果没有children则是三级节点
            if (!node.children) {
                return arr.push(node.id)
            }

            // 包含children属性——递归
            node.children.forEach(item => this.getDefKeys(item, arr))
        },
        // 点击确定执行以下代码
        async allotRights() {
            // 使用数组的展开运算符将选中的和半选中的元素推进keys中
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            // 因为要传到后台的是一个id字符串，而keys是一个数组
            const idStr = keys.join(',')
            // 发送请求
            const res = await allotRights(this.roleID, idStr)
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.$message.success(res.meta.msg)
            this.getRequest()
            this.setRightVisible = false
        },
        // 编辑角色
        async editRole(id) {
            this.DialogTips = 'edit'
            this.DialogTF = true
            const res = await SelectUserFun('roles', id)
            if (res.meta.status != 200) {
                return this.$message.error('没有查询到该角色')
            }
            // 将查询到的数据存放到一个变量中，然后再通过v-model放到input
            this.roleInfo = res.data
        },
        // 提交数据
        sendData(sendType) {
            if (sendType == 'add') {
                // 发送请求
                this.$refs.addRoleFormRef.validate(async valid => {
                    if (!valid) return
                    const res = await addRolesFun(this.addRoleForm)
                    if (res.meta.status != 201) {
                        return this.$message.error("创建失败！")
                    }
                    this.$message.success('创建成功！')
                    this.DialogTF = false
                    this.getRequest()
                })
            } else if (sendType == 'edit') {
                // 预校验
                this.$refs.addRoleFormRef.validate(async valid => {
                    if (!valid) return
                    const res = await EditUserFun('roles', this.roleInfo.roleId, {
                        roleName: this.roleInfo.roleName,
                        roleDesc: this.roleInfo.roleDesc

                    })
                    if (res.meta.status !== 200) {
                        return this.$message.error('修改失败！')
                    }
                    this.$message.success('修改成功！')
                    this.DialogTF = false
                    this.getRequest()
                })
            }
        },
        // 删除角色
        async deleteRole(id) {
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
            const res = await DeleteUser('roles', id)
            this.$message.success(res.meta.msg)
            // 刷新列表
            this.getRequest()
        },
        // 关闭对话框清空数据
        DialogClose() {
            this.$refs.addRoleFormRef.resetFields()
        },
        // 双击可以打开扩展表格
        handleRowHandle(row,column){
            // row：点击的行
            if(column.label == "角色名称" || column.label == "角色描述" ){
                this.$refs.rolesTable.toggleRowExpansion(row)
            }
        }

    },
    mounted() {

    },
    async created() {
        this.getRequest()
    },
    watch: {

    },
    computed: {

    },
    filters: {

    }
}
</script>

<style scoped lang='less'>
.el-table {
    margin-top: 20px;

    .firLevelTree {
        margin: 0 40px;
        border-bottom: 1px solid #eee;

        &:first-child {
            border-top: 1px solid #eee;
        }

        .el-tag {
            margin: 5px;
        }
    }

    .secLevelTree {
        border-top: 1px solid #eee;

        &:first-child {
            border-top: 0;
        }
    }

}

.vcenter {
    display: flex;
    align-items: center;
}
</style>