<template>
  <div>
    <el-container style="height: 100%">
      <!-- 顶部栏 -->
      <el-header style="height: 65px; background-color: #fff; margin-bottom: 16px;">
        <div style="margin-left: 16px; display: flex; align-items: center; position: relative;">
          <i class="el-icon-s-home" style="font-size: 32px; color: #409eff;"></i>
          <span style="font-size: 20px; font-weight: 700; margin-left: 8px; line-height: 65px;">家政预约系统后台</span>
          <el-button style="position: absolute; right: 16px;">
            <router-link to="/home" style="text-decoration: none; color: #000;">
              前台预览
            </router-link>
          </el-button>
        </div>
      </el-header>

      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px" style="background-color: rgb(238, 241, 246); height: 620px;">
          <el-menu :default-openeds="['2']" style="height: 100%;">
            <el-submenu index="2">
              <template slot="title"><i class="el-icon-menu"></i>导航栏</template>
              <el-menu-item index="2-1" style="padding-left: 0 !important; padding-right: 0 !important;">
                <router-link to="/worker" style="color: #000;">
                  人员管理
                </router-link>
              </el-menu-item>

              <el-menu-item index="2-2" style="padding-left: 0 !important; padding-right: 0 !important;">
                <router-link to="/category" style="color: #000;">
                  服务分类
                </router-link>
              </el-menu-item>

              <el-menu-item index="2-3" style="padding-left: 0 !important; padding-right: 0 !important;">
                <router-link to="/stats" style="color: #000;">
                  信息统计
                </router-link>
              </el-menu-item>

              <el-menu-item index="2-4" style="padding-left: 0 !important; padding-right: 0 !important;">
                <router-link to="/order" style="color: #000;">
                  订单跟踪
                </router-link>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>

        <!-- 主要内容 -->
        <el-main
          style="flex: 1; overflow: auto; background-color: #fff; height: 620px; margin-left: 8px; display: flex; justify-content: space-between; flex-wrap: wrap;">
          <div id="echart1" style="width: 600px; height:400px;"></div>
          <div id="echart2" style="width: 580px; height:400px;"></div>
          <div id="echart3" style="width: 600px; height:400px;"></div>
          <div id="echart4" style="width: 580px; height:400px;"></div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";
import * as echarts from 'echarts';
export default {
  data() {
    return {
      top10EmployeesWeekly: [],
      top10EmployeesDataWeekly: [],
      top10EmployeesMonthly: [],
      top10EmployeesDataMonthly: [],
      topCategoriesWeekly: [],
      topCategoriesDataWeekly: [],
      topCategoriesMonthly: [],
      topCategoriesDataMonthly: [],
    }
  },
  methods: {
    render() {
      axios({
        method: "get",
        url: "http://localhost:8080/orders/top"
      }).then(response => {
        // console.log(response.data.data);
        const topData = response.data.data
        this.top10EmployeesWeekly = topData.top10EmployeesWeekly;
        this.top10EmployeesDataWeekly = topData.top10EmployeesDataWeekly;
        this.top10EmployeesMonthly = topData.top10EmployeesMonthly;
        this.top10EmployeesDataMonthly = topData.top10EmployeesDataMonthly;
        this.topCategoriesWeekly = topData.topCategoriesWeekly;
        this.topCategoriesDataWeekly = topData.topCategoriesDataWeekly;
        this.topCategoriesMonthly = topData.topCategoriesMonthly;
        this.topCategoriesDataMonthly = topData.topCategoriesDataMonthly;

        this.initEmployeesWeeklyChart()
        this.initEmployeesMonthlyChart()
        this.initCategoriesWeeklyChart()
        this.initCategoriesMonthlyChart()
      }).catch(error => {
        console.error("请求失败", error);
      });
    },
    initEmployeesWeeklyChart() {
      var myChart = echarts.init(document.getElementById('echart1'));
      // 绘制图表
      myChart.setOption({
        title: {
          text: '员工周数据Top10'
        },
        tooltip: {},
        xAxis: {
          data: this.top10EmployeesWeekly
        },
        yAxis: {},
        series: [
          {
            name: '订单数量',
            type: 'bar',
            data: this.top10EmployeesDataWeekly
          }
        ]
      });
    },
    initEmployeesMonthlyChart() {
      var myChart = echarts.init(document.getElementById('echart3'));
      // 绘制图表
      myChart.setOption({
        title: {
          text: '员工月数据Top10'
        },
        tooltip: {},
        xAxis: {
          data: this.top10EmployeesMonthly
        },
        yAxis: {},
        series: [
          {
            name: '订单数量',
            type: 'bar',
            data: this.top10EmployeesDataMonthly
          }
        ]
      });
    },
    initCategoriesWeeklyChart() {
      var chartDom = document.getElementById('echart2');
      var myChart = echarts.init(chartDom);
      var option;

      var data = [];
      for (var i = 0; i < this.topCategoriesWeekly.length; i++) {
        data.push({
          name: this.topCategoriesWeekly[i],
          value: this.topCategoriesDataWeekly[i]
        });
      }

      option = {
        title: {
          text: '服务类别周数据'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '7%',
          left: 'center'
        },
        series: [
          {
            name: '服务类别周数据',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: data
          }
        ]
      };

      option && myChart.setOption(option);
    },
    initCategoriesMonthlyChart() {
      var chartDom = document.getElementById('echart4');
      var myChart = echarts.init(chartDom);
      var option;

      var data = [];
      for (var i = 0; i < this.topCategoriesMonthly.length; i++) {
        data.push({
          name: this.topCategoriesMonthly[i],
          value: this.topCategoriesDataMonthly[i]
        });
      }

      option = {
        title: {
          text: '服务类别月数据'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '7%',
          left: 'center'
        },
        series: [
          {
            name: '服务类别月数据',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: data
          }
        ]
      };

      option && myChart.setOption(option);
    }
  },
  mounted() {
    this.render()

  }
}
</script>

<style>
html,
body {
  height: 100%;
  background-color: #f0f2f5;
  margin: 0;
  /* 确保没有默认的外边距 */
}

.el-menu-item a {
  padding-left: 40px;
  display: block;
  width: 100%;
  text-decoration: none;
}
</style>