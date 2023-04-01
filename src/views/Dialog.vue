<template>
    <div>
        <el-dialog v-if="isShowThis" title="添加用户" :visible.sync="dialogVisible" width="40%"
            :before-close="handleDialogFun" @close="DialogClosed">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username" type="text"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email" type="email"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleDialogFun">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户 -->
        <el-dialog title="修改用户" v-if="!isShowThis" :visible.sync="dialogVisible" width="40%"
            :before-close="handleDialogFun" @close="DialogClosed">
            <el-form :model="EditInfo" :rules="addFormRules" ref="addFormRef" label-width="80px">
                <el-form-item label="用户名">
                    <el-input disabled v-model="EditInfo.username" type="text"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="EditInfo.email" type="email"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="mobile">
                    <el-input v-model="EditInfo.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleDialogFun">取 消</el-button>
                <el-button type="primary" @click="EditUserInfo">确 定</el-button>
            </span>
        </el-dialog>

    </div>

</template>

<script>
import { mapState } from 'vuex'
import { addUserFun, getUserListFun, EditUserFun } from '../api/request-api'
import bus from '../plugins/eventBus'
export default {
    name: 'Dialog',
    props: [
        'userInfo',
        'EditInfo',
        'isShowThis',

    ],
    components: {

    },
    data() {
        // 验证邮箱规则
        let checkEmail = (rule, value, callback) => {
            // 验证邮箱的正则表达式
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if (regEmail.test(value)) {
                // 合法邮箱
                return callback()
            }
            // 不合法
            callback(new Error('请输入合法邮箱'))
        }

        // 验证手机号规则
        let checkMobile = (rule, value, callback) => {
            const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if (regMobile.test(value)) {
                return callback()
            }
            callback(new Error('请输入合法手机号'))
        }
        return {
            // 添加用户 的表单数据
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            // 添加表单的验证规则对象
            addFormRules: {
                username: [
                    { required: true, message: "请输入用户名称", trigger: "blur" },
                    { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
                ],
                password: [
                    { required: true, message: "请输入用户密码", trigger: "blur" },
                    {
                        min: 6,
                        max: 16,
                        message: "长度在 6 到 16 个字符",
                        trigger: "blur",
                    },
                ],
                email: [
                    { required: true, message: "请输入邮箱", trigger: "blur" },
                    // validator:校验是否输入了邮箱
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: "请输入手机号", trigger: "blur" },
                    // validator:校验是否输入了邮箱
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },
            queryInfoParams: {
                query: "",
                pagenum: 1,
                pagesize: 2
            },
        }
    },
    methods: {
        handleDialogFun() {
            this.$store.commit('handleDialog')
        },
        DialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        // 添加用户
        addUser() {
            this.$refs.addFormRef.validate(async valid => {
                // validate返回一个boolean类型的值 表示验证成功或失败
                if (!valid) return
                // 通过
                const res = await addUserFun(this.addForm)
                if (res.meta.status !== 201) {
                   return this.$message.error(res.meta.msg)
                }
                this.$message.success(res.meta.msg)
                // 关闭对话框
                this.$store.commit('handleDialog')
                // 使用eventBus传值：获取新列表，将数据传到User.vue
                const share = await getUserListFun(this.userInfo)
                bus.$emit('refreshList', share)
            })
        },
        // 修改用户信息
        EditUserInfo() {
            // 预校验
            this.$refs.addFormRef.validate(async valid => {
                // 修改不成功
                if (!valid) return
                const res = await EditUserFun('users' ,this.EditInfo.id, {
                    email: this.EditInfo.email,
                    mobile: this.EditInfo.mobile
                })
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg)
                }
                this.$message.success(res.meta.msg)
                // 关闭对话框
                this.$store.commit('handleDialog')
                // 使用eventBus传值：获取新列表，将数据传到User.vue
                const edited = await getUserListFun(this.userInfo)
                bus.$emit('refreshList', edited)
            })
        }
    },
    mounted() {

    },
    watch: {

    },
    computed: {
        ...mapState(['dialogVisible'])
    },
    filters: {

    },
    created() {



    }
}
</script>

<style scoped lang='less'>
</style>