<template>
    <div>
        <!-- 卡片试图区域 -->
        <el-card>
            <!-- 警告区域 -->
            <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false"></el-alert>
            <!-- 选择商品分类区域 -->
            <el-row class="selectRegion">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader :options="CateList" :props="{expandTrigger: 'hover', ...cateProps }"
                        v-model="selectedKeys" @change="handleChange">

                    </el-cascader>
                </el-col>
            </el-row>

            <!-- tabs选项 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" @click="addDialogVisible = true" :disabled="isBtnDisabled">
                        添加参数</el-button>
                    <!-- 动态属性表格数据 -->
                    <el-table :data="tableData" ref="paramsTable" border stripe @cell-click="handleRowHandle">
                        <!-- 展开行 -->
                        <el-table-column class="expand" type="expand">
                            <template v-slot="scope">
                                <!-- 循环渲染tag标签 -->
                                <el-tag :key="index" v-for="(item , index) in scope.row.attr_vals" closable @close="handleClose(index , scope.row)">
                                    {{item}}
                                </el-tag>
                                <!-- 文本框 -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>

                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit"
                                    @click="editInfo(scope.row.attr_id)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete"
                                    @click="deleteParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                </el-tab-pane>
                <!-- 静态属性 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" @click="addDialogVisible = true" :disabled="isBtnDisabled">
                        添加属性</el-button>
                    <!-- 动态属性表格数据 -->
                    <el-table :data="tableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column class="expand" type="expand">
                            <template v-slot="scope">
                                <!-- 循环渲染tag标签 -->
                                <el-tag :key="index" v-for="(item , index) in scope.row.attr_vals" closable @close="handleClose(index , scope.row)">
                                    {{item}}
                                </el-tag>
                                <!-- 文本框 -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>

                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit"
                                    @click="editInfo(scope.row.attr_id)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete"
                                    @click="deleteParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加参数的对话框 -->
        <el-dialog :title="titleText" :visible.sync="addDialogVisible" width="40%" @close="addDialogClosed">
            <el-form :model="addParamsForm" :rules="addParamsRules" ref="addParamsRef" label-width="120px"
                class="demo-ruleForm">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams" @keyup.enter.native="addParams">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑参数对话框 -->
        <el-dialog title="编辑参数" :visible.sync="editDialogVisible" width="40%" @close="editDialogClosed">
            <el-form :model="editParamsForm" :rules="addParamsRules" ref="editParamsRef" label-width="120px"
                class="demo-ruleForm">
                <el-form-item label="编辑参数" prop="attr_name">
                    <el-input v-model="editParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getGoodsListFun, addCateFun, editParamsInfo, deleteParamsFun } from '@/api/request-api.js'
export default {
    name: '',
    data() {
        return {
            // 商品分类的列表
            CateList: [],
            // 级联选择框的配置对象
            cateProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            // 级联选择框双向绑定的数组
            selectedKeys: [],
            // tabs选项栏默认打开的选项
            activeName: 'many',
            // 表格数据
            tableData: [],
            // 控制对话框的显示与隐藏
            addDialogVisible: false,
            // 添加参数的表单数据对象
            addParamsForm: {

            },
            // 添加的表单验证规则对象
            addParamsRules: {
                attr_name: [
                    { required: true, message: "请输入参数名称", trigger: "blur"},
                ]
            },

            // 编辑参数的数据
            editDialogVisible: false,
            editParamsForm: {},

            // 版式下的tag标签数组——》曲面电视
            // arr_vals:['49寸超薄曲面']
            // 控制按钮与文本框的切换形式
            inputVisible: false,
            // 文本框输入的内容
            inputValue: ''
        }
    },
    props: {
    },
    components: {

    },
    methods: {
        async getCateList() {
            const res = await getGoodsListFun('/categories')
            if (res.meta.status != 200) {
                return this.$message.error('获取商品列表失败！')
            }
            this.CateList = res.data
        },
        // 级联选择框选中变化，会触发这个函数
        handleChange() {
            this.getParamsData()
        },
        // tab选项栏的点击事件
        handleTabClick() {
            this.getParamsData()
        },
        // 获取参数的列表数据
        async getParamsData() {
            if (this.selectedKeys.length !== 3) {
                this.selectedKeys = []
                this.tableData = []
                return
            }
            // 根据所选分类的id，和当前所处的面板，获取对应的参数
            const res = await getGoodsListFun(`categories/${this.cateId}/attributes`, { sel: this.activeName })
            if (res.meta.status != 200) {
                return this.$message.error(res.meta.msg)
            }
            // 扩展内容都存在attr_val中，在返回的数据中它是以字符串的形式返回的，但是要渲染时应该将其转化为数组，然后再用forEach循环到tag标签上
            // 要选择空调——》变频空调
            res.data.forEach(item => {
                // 判断item.attr_vals是否为空
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                // 动态添加文本框的显示与隐藏
                this.$set(item, "inputVisible", false)
                // 文本框输入的值
                this.$set(item, "inputValue", '')
            })
            // console.log(res.data)
            this.tableData = res.data
        },
        // 监听添加对话框的关闭
        addDialogClosed() {
            this.$refs.addParamsRef.resetFields()
        },
        // 添加参数
        addParams() {
            this.$refs.addParamsRef.validate(async valid => {
                if (!valid) return
                const res = await addCateFun(`/categories/${this.cateId}/attributes`, {
                    attr_name: this.addParamsForm.attr_name,
                    attr_sel: this.activeName
                })

                if (res.meta.status != 201) {
                    return this.$message.error('添加参数失败！')
                }
                this.$message.success('添加参数成功！')
                this.getParamsData()
                this.addDialogVisible = false
            })
        },
        // 编辑参数的函数
        editDialogClosed() {
            this.$refs.editParamsRef.resetFields()

        },
        // 查询当前参数信息
        async editInfo(id) {
            this.editDialogVisible = true
            const res = await getGoodsListFun(`/categories/${this.cateId}/attributes/${id}`, { attr_sel: this.activeName })
            if (res.meta.status !== 200) {
                return this.$message.error('参数修改失败！')
            }
            this.editParamsForm = res.data
        },
        // 提交数据
        editParams() {
            this.$refs.editParamsRef.validate(async valid => {
                if (!valid) return
                const res = await editParamsInfo(`/categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`, {
                    attr_name: this.editParamsForm.attr_name,
                    attr_sel: this.activeName
                })

                if (res.meta.status !== 200) {
                    return this.$message.error('参数修改失败！')
                }
                this.$message.success('参数修改成功！')
                this.getParamsData()
                this.editDialogVisible = false
            })
        },
        // 删除参数
        async deleteParams(attr_id) {
            const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            // 用户取消了操作
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除！')
            }

            const res = await deleteParamsFun(`categories/${this.cateId}/attributes/${attr_id}`)
            if (res.meta.status !== 200) {
                return this.$message.error('删除参数失败！')
            }
            this.$message.success('删除参数成功！')
            this.getParamsData()
        },

        // 文本框失去焦点或按下enter都会触发
        handleInputConfirm(row) {
            if(row.inputValue.trim().length === 0 ){
                row.inputValue =  ''
            row.inputVisible = false
                return 
            }
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ''
            row.inputVisible = false
            // 更新到数据库
            this.saveAttrVals(row)
           
        },
         // 发送请求，将attr_vals的数据保存到数据库
        async saveAttrVals(row){
            const res = await editParamsInfo(`/categories/${this.cateId}/attributes/${row.attr_id}` , {
                attr_name:row.attr_name,
                attr_sel:row.attr_sel,
                attr_vals:row.attr_vals.join(' ')
            })
            if(res.meta.status !== 200 ){
                return this.$message.error('修改参数项失败！')
            }
            this.$message.success('添加参数选项成功！')
        },
        // 点击按钮展示文本输入框
        showInput(row) {
            row.inputVisible = true
            // $nextTick 方法的作用就是当页面上元素被重新渲染之后，才会执行回调函数中的代码
            this.$nextTick(_ => {
                // 第一个ref拿到el-input ，第二个ref从el-input身上拿到原生dom节点
                this.$refs.saveTagInput.$refs.input.focus();
                // this.$refs.saveTagInput.focus();
            })

        },
        // 关闭tag标签时触发
        handleClose(index , row){
            row.attr_vals.splice(index ,  1)
            this.saveAttrVals(row)
        },
        // 点击行展开扩展表格
        handleRowHandle(row,column){
            console.log(row +" ------------ "+column)
            if(column.label == '参数名称'){
                this.$refs.paramsTable.toggleRowExpansion(row)
            }
        }

    },
    mounted() {

    },
    created() {
        this.getCateList()
    },
    watch: {

    },
    computed: {
        isBtnDisabled() {
            return this.selectedKeys.length != 3
        },
        // 当前选中项的三级分类的id
        cateId() {
            if (this.selectedKeys.length === 3) {
                // 返回数组的最后一项
                return this.selectedKeys[2]
            }
            return null
        },
        titleText() {
            if (this.activeName === 'many') {
                return '添加动态属性'
            } else {
                return '添加静态参数'

            }
        }

    },
    filters: {

    }
}
</script>

<style scoped lang='less'>
.selectRegion {
    margin: 20px 0;
}

.el-tag {
    margin:10px 20px 10px 0;
    &:first-child{
        margin-left:40px;
    }
}

.input-new-tag {
    width: 120px;

}
.el-table{
    margin:20px 0;
}
</style>