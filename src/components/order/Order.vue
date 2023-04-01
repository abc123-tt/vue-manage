<template>
  <div>
    <el-card>
      <!-- 搜索框区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" @clear="getOrderList" clearable  @keyup.native.enter="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表区域 -->
      <el-table :data="orderTable" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template v-slot="scope">
            <el-tag type="success" v-if="!scope.row.pay_status === '0'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间"></el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit()"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="showExpressData"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" background>
      </el-pagination>
    </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="40%" @close="dialogClosed">
      <el-form :model="addressForm" :rules="addressFromRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader v-model="addressForm.address1" :props="{ expandTrigger: 'hover' }" :options="cityData">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 显示物流信息的对话框 -->
    <el-dialog title="物流信息" :visible.sync="expressDiaVisible" width="40%">
      <el-timeline>
    <el-timeline-item
      v-for="(item, index) in expressData"
      :key="index"
      :timestamp="item.time">
      {{item.context}}
    </el-timeline-item>
  </el-timeline>

    </el-dialog>
  </div>
</template>

<script>
import { getGoodsListFun } from '@/api/request-api'
import cityData from './cityData.js'
export default {
  name: '',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderTable: [],
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFromRules: {
        address1: [
          { required: true, message: "请选择省市区县", trigger: "blur" },
        ],
        address1: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ]
      },
      // 联级选择器的数据
      cityData,

      // 物流信息对话框
      expressDiaVisible: false,

      // 物流模拟数据
      expressData: [
        {
          "time": "2018-05-10 09:39:00",
          "ftime": "2018-05-10 09:39:00",
          "context": "已签收,感谢使用顺丰,期待再次为您服务",
          "location": ""
        },
        {
          "time": "2018-05-10 08:23:00",
          "ftime": "2018-05-10 08:23:00",
          "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          "location": ""
        },
        {
          "time": "2018-05-10 07:32:00",
          "ftime": "2018-05-10 07:32:00",
          "context": "快件到达 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-10 02:03:00",
          "ftime": "2018-05-10 02:03:00",
          "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-09 23:05:00",
          "ftime": "2018-05-09 23:05:00",
          "context": "快件到达 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 21:21:00",
          "ftime": "2018-05-09 21:21:00",
          "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 13:07:00",
          "ftime": "2018-05-09 13:07:00",
          "context": "顺丰速运 已收取快件",
          "location": ""
        },
        {
          "time": "2018-05-09 12:25:03",
          "ftime": "2018-05-09 12:25:03",
          "context": "卖家发货",
          "location": ""
        },
        {
          "time": "2018-05-09 12:22:24",
          "ftime": "2018-05-09 12:22:24",
          "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          "location": ""
        },
        {
          "time": "2018-05-08 21:36:04",
          "ftime": "2018-05-08 21:36:04",
          "context": "商品已经下单",
          "location": ""
        }
      ],

    }
  },
  props: {
  },
  components: {

  },
  methods: {
    async getOrderList() {

      const res = await getGoodsListFun('/orders', this.queryInfo)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error("订单列表获取失败！")
      }
      this.orderTable = res.data.goods
      this.total = res.data.total
      res.data.goods.forEach(item => {
        item.create_time = this.dayjs((item.create_time) * 1000).format("YYYY-MM-DD HH:mm:ss")
      })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()

    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()

    },
    // 修改对话框
    handleEdit() {
      this.addressVisible = true
    },
    dialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    // 显示物流信息
    showExpressData() {
      this.expressDiaVisible = true
    }
  },
  mounted() {

  },
  created() {
    this.getOrderList()
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
  margin: 20px 0;
}

.el-cascader {
  width: 100%;
}
</style>