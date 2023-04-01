<template>
  <div>
    <!-- 卡片试图区 -->
    <el-card>

      <!-- 提示 -->
      <el-alert title="消息提示的文案" type="info" center show-icon :closable="false">
      </el-alert>

      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="parseInt(activeIndex)" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs @tab-click="tabClicked" :before-leave="beforeTabLeave" v-model="activeIndex" :tab-position="'left'">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addForm.goods_cat" :options="CateList"
                :props="{ expandTrigger: 'hover' , ...cateProps}" @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="check" v-for="(check , index) in item.attr_vals" :key="index" ></el-checkbox>
              </el-checkbox-group> -->
              <el-tag v-model="item.attr_vals" v-for="(p , index) in item.attr_vals" :key="index" closable
                @close="removeTag(index , item)">{{p}}</el-tag>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 
              action: 上传地址
              headers: 设置请求头，不然图片上传不成功
             -->
            <el-upload :action="UploadURL" :headers="headerObj" :on-preview="handlePreview" :on-remove="handleRemove"
              list-type="picture" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- <button @click="btn">点击添加dom</button>
    <div class="box">
      <span :ref="refArr" v-for="(item , index) in n" :key="index"></span>
    </div> -->

    <!-- 展示大图的对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%" :before-close="handleClose">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>



</template>

<script>
import { getCateListFun, getGoodsListFun, addCateFun } from '@/api/request-api'
export default {
  name: '',
  data() {
    return {
      activeIndex: "0",
      // 存放商品的数据列表
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片数组
        pics: [],
        // 商品的详情描述
        goods_introduce: '',
        // 处理动态参数和静态属性
        attrs: []
      },
      // 验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 商品分类列表
      CateList: [],
      // 
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },

      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      // 上传图片的地址
      UploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 设置图片上传的请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 大图的url
      previewPath: '',
      // 控制展示大图的对话框
      previewVisible: false
    }
  },
  props: {
  },
  components: {

  },
  methods: {
    // 获取所有商品分类数据
    async getCateList() {
      const res = await getCateListFun('/categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败！')
      }
      this.CateList = res.data
    },
    // 级联选择器选中项变化时触发
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },

    // btn(){
    //     // let ele = document.createElement('span')
    //     // ele.setAttribute('ref' , 'span')
    //     // ele.innerHTML = 'abc'
    //     // document.querySelector('.box').appendChild(ele)
    //     this.n++
    //     this.refArr.push(this.n)
    //     // console.log(this.refArr[0])
    //     console.log(this.$refs.refArr[0])
    //   }

    // tab标签是否可以切换
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    // 面板切换时发送请求
    async tabClicked() {
      // 证明访问的是动态参数面板
      if (this.activeIndex === '1') {
        const res = await getGoodsListFun(`/categories/${this.cateId}/attributes`, { sel: 'many' })
        if (res.meta.status !== 200) {
          this.$message.error('获取动态参数列表失败！')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === '0' ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
        // 商品属性
      } else if (this.activeIndex === '2') {
        const res = await getGoodsListFun(`/categories/${this.cateId}/attributes`, { sel: 'only' })
        if (res.meta.status !== 200) {
          this.$message.error('获取静态属性列表失败！')
        }
        this.onlyTableData = res.data
      }
    },

    // 商品图片
    // 监听图片上传成功的事件
    handleSuccess(response) {
      // 1. 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 2. 将图片信息对象push到pics中
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    // 处理图片预览效果
    handlePreview(file) {
      // 保存图片的路径
      this.previewPath = file.response.data.url
      // 打开大图对话框
      this.previewVisible = true
    },
    // 处理移除图片的操作
    handleRemove(file) {
      // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // console.log(filePath)
      // 2. 从 pics 数组中，找到这个图片对应的索引值
      // 这里的item就是数组中的每一项 
      this.addForm.pics = this.addForm.pics.filter(item => {
        // 使用过滤器将不等于当前图片途径的都过滤掉
        return item.pic !== filePath
      })
    },
    // 对话框关闭
    handleClose() {
      this.previewVisible = false
    },
    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必填项！')
        }

        const deepForm = JSON.parse(JSON.stringify(this.addForm))
        // goods_cat要求是个字符串，所以对数组做转化
        deepForm.goods_cat = deepForm.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            // 将数组转化为字符串
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)

        })

        // 将处理完的addForm统一赋值给深拷贝出来的attrs
        deepForm.attrs = this.addForm.attrs

        // 发起请求
        // 商品名称必须是唯一的
        const res = await addCateFun('/goods', deepForm)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        
        this.$message.success('商品添加成功！')
        this.$router.push('/goods')
      })
    },
    async removeTag(index, row) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 用户取消了操作
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      row.attr_vals.splice(index, 1)
    }


  },
  mounted() {
    
  },
  created() {
    this.getCateList()
    
  },
  watch: {
    // manyTableData: {
    //   handler (val) {
    //     console.log(val)
    //   },
    //   // 这里是关键，代表递归监听 demo 的变化
    //   deep: true
    // }
  },
  computed: {
    cateId() {
      return this.addForm.goods_cat[2]
    }
  },
  filters: {

  },
  updated() {

  }
}
</script>

<style scoped lang='less'>
.el-steps {
  margin: 15px 0;
  text-align: center;
}

/deep/.el-step_title {
  font-size: 13px;
}

.el-checkbox {
  margin: 0 10px 0 0 !important;
}

.el-upload__tip {
  font-size: 12px;
  margin: 10px 0;
}

.previewImg {
  width: 100%
}

/deep/.ql-editor {
  min-height: 300px;
}

.addBtn {
  margin: 20px 0;
}

.el-tag {
  margin: 0 10px;
}
</style>