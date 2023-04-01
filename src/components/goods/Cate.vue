<template>
    <div>
        <el-card>
            <el-row>
                <el-col :span="4">
                    <el-button type="primary" @click="openDialog('add')">添加商品</el-button>
                </el-col>
                <el-col :span="10">

                    <el-input clearable placeholder="请输入分类的Id" v-model="CateId" class="input-with-select">

                        <el-button slot="append" icon="el-icon-search" @click="searchCate"></el-button>

                    </el-input>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <!-- 
                data: 要渲染的数据
                columns: 列表的格式
                selection-type：是否需要复选框
                expand-type：是否需要展开箭头
             -->
            <zk-table :data="goodsList" :columns="columns" :selection-type="false" :expand-type="false" show-index
                index-text="#" border>
                <!-- 是否有效列 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="!scope.row.cat_deteled" style="color:lightgreen"></i>
                    <i class="el-icon-error" v-else style="color:red"></i>
                </template>
                <!-- 级别列 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag size="mini" type="warning" v-else>三级</el-tag>
                </template>
                <!-- 操作列 -->
                <template slot="opt">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="openDialog('edit')">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </zk-table>

            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加和编辑对话框 -->
        <el-dialog :title="openTips=='add'?'添加分类' : '编辑商品分类'" :visible.sync="addDialogTF" width="40%"
            @close="DialogClose">
            <!-- 表单验证 -->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px"
                class="demo-ruleForm">
                <!-- 表单第一项 -->
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name" placeholder="请输入分类名称"></el-input>
                </el-form-item>
                <!-- 表单第二项 -->
                <el-form-item label="父级分类：">
                    <!-- options用来指定数据源 -->
                    <el-cascader v-model="selectedKeys" :options="parentCateList"
                        :props="{ expandTrigger: 'hover' , ...cascaderProps , }" @change="parentCateChange" clearable>
                    </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogTF = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getGoodsListFun, addCateFun, searchCateIdFun } from '../../api/request-api'
export default {
    name: '',
    data() {
        return {
            // 查询条件
            queryInfo: {
                // 值：1，2，3 分别表示显示一层二层三层分类列表【可选参数】如果不传递，则默认获取所有级别的分类
                type: 3,
                // 当前页码值
                pagenum: 1,
                //每页显示多少条数据
                pagesize: 5
            },
            // 存放商品信息
            goodsList: [],
            // 总数
            total: 0,
            // 表格展开列的配置
            columns: [
                { label: '分类名称', prop: 'cat_name' },
                {
                    label: '是否有效',
                    // 表示当前列定义为模板列
                    type: 'template',
                    // 表示当前这一列使用模板名称
                    template: 'isok'
                },
                {
                    label: '排序',
                    // 表示当前列定义为模板列
                    type: 'template',
                    // 表示当前这一列使用模板名称
                    template: 'order'
                },
                {
                    label: '操作',
                    // 表示当前列定义为模板列
                    type: 'template',
                    // 表示当前这一列使用模板名称
                    template: 'opt'
                }
            ],
            // 控制对话框的显示与隐藏
            addDialogTF: false,
            // 控制表单提示语
            openTips: '',
            // 添加分类表单数据对象
            addCateForm: {
                // 将要添加的分类的名称
                cat_name: '',
                // 父级分类的Id
                cat_pid: 0,
                // 分类的等级，默认要添加的是一级分类
                cat_level: 0
            },
            // 添加分类表单的验证规则对象
            addCateFormRules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            },
            // 存放父级分类的数据
            parentCateList: [],
            // 指定联级选择器的配置对象
            cascaderProps: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children'
            },
            // 选中父级类的id数组
            selectedKeys: [],
            // 根据id查询分类
            CateId: ''
        }

    },
    props: {
    },
    components: {

    },
    methods: {
        async getGoodsList() {
            const res = await getGoodsListFun('/categories' , this.queryInfo)
            if (res.meta.status != 200) {
               return this.$message.error(res.meta.msg)
            }
            // console.log(res)
            this.goodsList = res.data.result
            this.total = res.data.total
        },
        // 监听pagesize的改变
        handleSizeChange(newSize) {
            // 当点击某一页或者下一页的时候会收到一个新的pageSize，然后更新data中的pagesize达到更新数据的目的
            this.queryInfo.pagesize = newSize
            // 刷新数据
            this.getGoodsList()
        },
        // pagenum
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            // 刷新数据
            this.getGoodsList()
        },
        // 添加商品分类和编辑商品的对话框
        openDialog(openType) {
            this.addDialogTF = true
            if (openType == 'add') {
                this.getParentCateList()
                this.openTips = 'add'
            }
            if (openType == 'edit') {
                this.getParentCateList()
                this.openTips = 'edit'
            }

        },
        // 获取父级分类的数据列表
        async getParentCateList() {
            const res = await getGoodsListFun('/categories' ,{ type: 2 })
            if (res.meta.status != 200) {
              return this.$message.error(res.meta.msg)
            }
            this.parentCateList = res.data
        },
        // 选择项发生变化触发
        parentCateChange() {
            // 点击了分类之后会往selectKeys中插入id号， 每次都将最后一个id号当做父级分类
            if (this.selectedKeys.length > 0) {
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                // level值和selectKeys长度一致
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            } else {
                this.addCateForm.cat_pid = 0

                this.addCateForm.cat_level = 0
            }

        },
        // 提交数据
        addCate() {
            // 数据预校验
            this.$refs.addCateFormRef.validate(async valid => {
                if (!valid) return
                const res = await addCateFun('/categories' , this.addCateForm)

                if (res.meta.status != 201) {
                    return this.$message.error('添加分类失败！')
                }
                this.$message.success('添加分类成功！')
                this.getGoodsList()
                this.addDialogTF = false
            })

        },
        // 监听关闭对话框的函数,重置表单
        DialogClose() {
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys = []
            this.addCateForm.cat_level = 0
            this.addCateForm.cat_pid = 0
        },
        // 根据id查询分类
        async searchCate() {
            // console.log(this.CateId)
            const res = await searchCateIdFun(this.CateId)
            if (res.meta.status != 200) {
                return this.$message.error('查询失败！')
            }
            this.$message.success('查询成功！')
            // 因为goodsList是一个数组，而这里返回的是一个对象，所以要先清空再push进去
            this.goodsList = []
            this.goodsList.push(res.data)
        }

    },
    watch: {
        // 监听对话框
        CateId(newval) {
            if (newval == '') {
                this.getGoodsList()
            }
        }
    },
    updated() {
        
    },
    created() {
        this.getGoodsList()

    },
    computed: {

    },
    filters: {

    }
}
</script>

<style scoped lang='less'>
.zk-table {
    margin: 20px 0;

    /deep/.zk-table--firstProp-header-inner {
        padding-left: 12px;
    }

}




.el-cascader {
    width: 100%;
}
</style>