<template>
  <div>
    <!-- 卡片视图区域 -->
    <el-card>
      <div id="main" style="width:800px; height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import { getCateListFun } from '@/api/request-api'
// 引入echarts
import * as echarts from 'echarts'

export default {
  name: '',
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  props: {
  },
  components: {

  },
  methods: {
    async getReportData() {
      const res = await getCateListFun('reports/type/1')
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }

      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'));
      const dataResult = { ...this.options, ...res.data }
      // const dataResult = Object.assign(this.options , res.data)
      // 绘制图表
      myChart.setOption(dataResult);
    }
  },
  //  此时页面上的元素已经渲染完毕了
  mounted() {

    // 拿到图表的数据
    this.getReportData()

  },
  created() {
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

</style>