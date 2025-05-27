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
          style="flex: 1; overflow: auto; background-color: #fff; height: 620px; margin-left: 8px; position: relative;">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column label="订单号" width="300" show-overflow-tooltip>
              <template slot-scope="scope"><span>#</span>{{ scope.row.orderNumber }}</template>
            </el-table-column>
            <el-table-column label="家政人员" width="200" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.staffName }}</template>
            </el-table-column>
            <el-table-column label="小时价格(元/时)" width="150" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.hourlyRate }}</template>
            </el-table-column>
            <el-table-column label="预约日期" width="150" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.appointmentDate }}</template>
            </el-table-column>
            <el-table-column label="支付方式" width="200" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.paymentMethod }}</template>
            </el-table-column>
            <el-table-column label="状态" width="200" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.status === 0 ? '已取消' : scope.row.status === 1 ? '已预约' : '已完成'
              }}</template>
            </el-table-column>
          </el-table>

          <el-pagination background layout="total, prev, pager, next" :total="total" :current-page.sync="currentPage"
            @current-change="handleCurrentChange" style="position: absolute; right: 150px; margin-top: 20px;">
          </el-pagination>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      tableData: [
        {
          "id": 5,
          "orderNumber": "202503131610117455",
          "staffId": 32,
          "staffName": "赵六",
          "staffImage": "https://hmleadnews-web-test.oss-cn-hangzhou.aliyuncs.com/ee7210ad-b039-4a20-9b21-e8e9c5d78305.jpg",
          "hourlyRate": 40.0,
          "paymentMethod": "现场支付",
          "status": 1,
          "orderTime": "2025-03-13T16:10:11",
          "appointmentDate": "2025-03-13",
          "appointmentSession": 0
        }
      ],
      total: 0,
      currentPage: 1,
    }
  },
  methods: {
    render({ page = 1, pageSize = 10, } = {}) {
      axios({
        method: "get", // 指定请求方法为 GET
        url: "http://localhost:8080/orders/page", // 请求的 URL
        params: {
          page: page, // 如果未传递 page，则使用默认值 1
          pageSize: pageSize, // 如果未传递 size，则使用默认值 10
        }
      })
        .then(response => {
          // 假设接口返回的数据结构是 { data: { rows: [...] } }
          const rows = response.data.data.rows;
          if (rows) {
            this.total = response.data.data.total;
            this.tableData = rows;
            console.log("数据加载成功", this.tableData);
          } else {
            console.error("接口返回数据格式不符合预期");
          }
        })
        .catch(error => {
          console.error("请求失败", error);
        });
    },
    handleCurrentChange(val) {
      console.log("handleCurrentChange..." + val);
      this.render({ page: val })
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