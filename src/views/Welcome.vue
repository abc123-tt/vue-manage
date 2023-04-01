<template>
  <div>
    <el-row :gutter="20">
      <!-- 用户信息区域 -->
      <el-col :span="8">
        <el-card class="lfCard">
          <el-row :gutter="20" style="border-bottom:1px solid #eee; padding-bottom:20px">
            <el-col :span="10">
              <div class="pic">
                <img :src="image" alt="">
              </div>
            </el-col>
            <el-col :span="10">
              <div class="info">
                <h3>Admin</h3>
                <span>超级管理员</span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="font-size:14px; margin-top:10px">
            <el-col :span="10">
              <p>上次登录的时间</p>
              <p>上次登录的地点</p>
            </el-col>
            <el-col :span="10">
              <p>2022-9-22</p>
              <p>广东</p>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <!-- 卡片视图区域 -->
      <el-col :span="16" class="card">
        <el-card v-for="(item , index) in EchartsData.countData" :key="index" :style="{background:item.color}">
          <countTo class="jumpNum" :startVal="startVal" :endVal="item.value" :duration="duration"
            style="font-size:25px; font-weight: bold;"></countTo>
          <p>{{item.name}}</p>
        </el-card>
        <!-- 订单状态区域 -->
        <el-card class="orderCard" shadow="hover">
          <el-descriptions title="代办事务">
            <el-descriptions-item label="待支付订单"><span>(5)</span></el-descriptions-item>
            <el-descriptions-item label="售后中"><span>(1)</span></el-descriptions-item>
            <el-descriptions-item label="退货中"><span>(2)</span></el-descriptions-item>
            <el-descriptions-item label="已支付订单"><span>(69)</span></el-descriptions-item>
            <el-descriptions-item label="售后完成"><span>(15)</span></el-descriptions-item>
            <el-descriptions-item label="换货中"><span>(8)</span></el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>


    <!-- 折线图 -->
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <div ref="lineChart" style="width:850px; height:300px"></div>
        </el-card>
      </el-col>
      <el-col :span="8" style="width:420px;">
        <el-card style="margin-bottom:20px;">
          <div style="width:100%;height:119px" ref="userEcharts"></div>
        </el-card>
        <el-card>
          <div style="width:100%;height:119px" ref="cakeEcharts"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import countTo from 'vue-count-to'
import EchartsData from '../assets/js/echartsData.js'

export default {
  name: '',
  data() {
    return {
      // 跳动数字
      startVal: 0,
      duration: 2000,
      // 头像
      image: require('../assets/images/user.jpg'),
      // echarts数据
      EchartsData,
       
    }
  },
  props: [

  ],
  components: {
    countTo,

  },
  methods: {
    getLineData() {
      // var myChart = echarts.init(document.getElementById('line'));
      // console.log(this.EchartsData)
      // 该数据已被vue接管监控，无论如何修改数据，返回给视图的都不会发生变化
      // 所以该数据就不能被枚举，常用的方法是直接深拷贝，相当于在内存中开辟出一个跟原来数据一样的数据。直接去操作新数据是可以的，而且能及时反馈给页面。
      // this.resData = JSON.parse(JSON.stringify(EchartsData))
      const res = JSON.parse(JSON.stringify(EchartsData))
      // 拿到数据中对象的key
      // 传入对象，返回属性名(key) 因为key都是一样的，所以只需要一条数据的key就行了
      const keyArry = Object.keys(res.linechart.data[0])
      // echarts中的series数组  有三个参数：name,type,data
      const series = []
      // 使用遍历将keyArry的元素推进series中
      keyArry.forEach((key) => {
        // console.log(key)
        series.push({
          // 图例中的键
          name: key,
          // 图例中的数据
          // 注意：这里的map不加{}
          data: res.linechart.data.map(item => item[key]),
          // 决定什么图形
          type: "line",
        })
      })

      // 拆分数据
      const options = {
        // x轴y轴
        xAxis: {
          data: res.linechart.date
        },
        yAxis: {},
        // 代表图例
        legend: {
          data: this.keyArray
        },
        series,
        grid: {
          left: "8%",
        },
      }

      // 拿到元素
      const lineChart = echarts.init(this.$refs.lineChart)
      // 绘图
      lineChart.setOption(options)



      // 柱状图
      // 画图
      const barOptions = {
        legend: {
          // 图例文字颜色
          textStyle: {
            color: "#333"
          },
        },
        grid: {
          left: "20%",
        },
        // 提示框
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category", // 类目轴
          data: res.userData.map((item) => item.date),
          axisLine: {
            // 线颜色
            lineStyle: {
              color: "#17b3a3"
            }
          },
          axisLabel: {
            interval: 0,
            color: "#333",
          },
        },
        yAxis: [
          {
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#17b3a3",
              },
            },
          }
        ],
        grid: {
          y: 100
        },
        color: ["#2ec7c9", "#b6a2de"],
        series: [
          {
            name: "新增用户",
            data: res.userData.map(item => item.new),
            type: "bar"
          },
          {
            name: "活跃用户",
            data: res.userData.map(item => item.active),
            type: "bar"
          }
        ]
      }
      const bar = echarts.init(this.$refs.userEcharts);
      bar.setOption(barOptions);


      // 饼图
      const cakeOption = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle:{
            "fontSize":10
          }
        },

        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '80%',
            center: ["70%", "50%"],
            data: res.cakeData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      const cake = echarts.init(this.$refs.cakeEcharts);
      cake.setOption(cakeOption);
    },

  },
  mounted() {
    // 渲染图
    this.getLineData()

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
.lfCard {
  transition: all 0.2s linear;
  cursor: pointer;

  &:hover {
    transform: translate3d(0, -5px, 0);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }

  .pic {
    width: 120px;
    height: 120px;

    img {
      border-radius: 50%;
      width: 100%;
      height: 100%;
      transition: all ease-in-out .5s;

      &:hover {
        transform: rotate(360deg);
      }
    }
  }

  .info {
    span {
      font-size: 12px;
    }
  }
}

.card {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;

  .el-card {
    width: 22%;
    height: 100px;
    color: #fff;
    transition: all 0.3s linear;
    cursor: pointer;
    &:hover {
      transform: translate3d(0, -5px, 0);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
      .jumpNum {
        text-shadow: 0 0 10px #fff,
      }
    }

    p {
      font-size: 12px;
    }
  }

  .orderCard {
    width: 97%;
    margin: 20px 0;
    height: 144px;

    &:hover {
      cursor: pointer;
    }

    /deep/.el-descriptions-item__label.has-colon {
      &:after {
        content: ''
      }
    }

    .el-descriptions {
      /deep/.el-descriptions__header {
        margin-bottom: 5px;
      }

      /deep/.el-descriptions-item {
        font-size: 12px;
        padding: 10px 40px;

        .el-descriptions-item__container {
          border-bottom: 1px solid #eee;
          padding-bottom: 5px;
          width: 180px;
        }

        .el-descriptions-item__content {
          margin-left: 85px;
          color: #ff7675;
        }
      }
    }

  }
}
</style>