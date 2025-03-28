<template>
  <div style="background-color: #fff; min-height: 100vh;">
    <el-container>
      <el-header style="height: 65px; background-color: #fff; border-bottom: 1px solid #ccc;">
        <div style="margin-left: 16px; display: flex; align-items: center; position: relative;">
          <i class="el-icon-magic-stick" style="font-size: 32px; color: #409eff;"></i>
          <span style="font-size: 20px; font-weight: 700; margin-left: 8px; line-height: 65px;">家政预约系统前台</span>
          <el-button style="position: absolute; right: 126px;">
            <router-link to="/home" style="text-decoration: none; color: #000;">
              主页
            </router-link>
          </el-button>
          <el-button style="position: absolute; right: 16px;">
            <router-link to="/worker" style="text-decoration: none; color: #000;">
              后台预览
            </router-link>
          </el-button>
        </div>
      </el-header>

      <el-main style="background-color: #F8F8F8; padding: 0; min-height: 91vh;">
        <div style="width: 700px; margin: 0 auto;">
          <h2 style="font-size: 21px;">我的预约</h2>
          <div v-for="order in orders" :key="order.id"
            style="background-color: #fff; width: 100%; height: 220px; padding: 5px;  border-radius: 5px; margin-bottom: 20px;">
            <div style="margin: 0; padding-bottom: 3px; border-bottom: 1px solid #ccc;">
              <span style="color: #948f89; margin-right: 6px;">订单号 :</span>
              <span>#</span>
              <span style="color: #2e3f57; margin-right: 10px;">{{ order.orderNumber }}</span>
              <span style="font-size: 14px; color: #d2d2db;">{{ order.orderTime.replace('T', ' ') }}</span>
              <span style="color: #1a8e64; margin-left: 220px;" v-if="order.status === 1">预约成功</span>
              <span style="color: #007bff; margin-left: 220px;" v-else-if="order.status === 2">订单已完成</span>
              <span style="color: #e51218; margin-left: 220px;" v-else>已取消预约</span>
            </div>
            <div style="height: 155px; margin: 0; padding-bottom: 3px; border-bottom: 1px solid #ccc; display: flex;">
              <img :src="order.staffImage"
                style="display: block; width: 120px; height: 120px; margin-top: 17px; margin-left: 10px;">
              <h3 style="font-size: 18px; margin-left: 10px; color: #3d3550;">{{ order.staffName }}</h3>
              <div style="color: #fca578; margin-left: 400px; margin-top: 18px; font-size: 18px;">
                <span>¥</span>
                <span>{{ order.hourlyRate }}</span>
                <span>(元/小时)</span>
              </div>
            </div>
            <div style="padding-top: 6px; padding-left: 6px; display: flex; position: relative;">
              <el-link type="primary" style="margin-top: 6px;" @click="handleRedirect(order.staffId)">
                <!-- <router-link :to="{ name: 'detail', params: { id: order.staffId } }"
                  style="text-decoration: none; color: #409EFF;">
                  商品详情
                </router-link> -->
                商品详情
              </el-link>
              <el-link type="primary" style="margin-left: 10px;margin-top: 6px;" @click="cancelOrder(order.id)"
                v-if="order.status === 1">取消预约</el-link>
              <div style="color: #a6afbe; margin-top: 5px; position: absolute; right: 10px;">
                <span style="margin-right: 5px;">支付方式 :</span>
                <span>{{ order.paymentMethod }}</span>
              </div>
            </div>
          </div>
        </div>
        <div style="height: 50px;">
          <el-pagination background layout="total, prev, pager, next" :total="total" :current-page.sync="currentPage"
            :page-size.sync="pageSize" @current-change="handleCurrentChange" style="position: absolute; right: 150px;">
          </el-pagination>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      total: 10,
      currentPage: 1,
      pageSize: 5,
      orders: [
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
          "updateTime": "2025-03-13T16:10:11",
          "userId": 1
        }
      ]
    }
  },
  methods: {
    render({ page = 1, pageSize = 5, } = {}) {
      axios({
        method: "get", // 指定请求方法为 GET
        url: "http://localhost:8080/orders/page", // 请求的 URL
        params: {
          page: page, // 如果未传递 page，则使用默认值 1
          pageSize: pageSize, // 如果未传递 size，则使用默认值 5
        }
      })
        .then(response => {
          // 假设接口返回的数据结构是 { data: { rows: [...] } }
          const rows = response.data.data.rows;
          if (rows) {
            this.total = response.data.data.total;
            this.orders = rows;
            console.log("数据加载成功", this.orders);
          } else {
            console.error("接口返回数据格式不符合预期");
          }
        })
        .catch(error => {
          console.error("请求失败", error);
        });
    },
    handleRedirect(staffId) {
      console.log("员工ID:", staffId);
      axios({
        method: "get",
        url: `http://localhost:8080/domesticWorker/${staffId}`
      }).then(response => {
        // console.log(response.data.data);
        if (response.data.data == null) {
          this.open("商品已下架！")
        } else {
          this.$router.push({
            name: 'detail',
            params: { id: staffId }
          });
        }
      })
    },
    handleCurrentChange(val) {
      console.log("handleCurrentChange..." + val);
      this.render({ page: val })
    },
    cancelOrder(id) {
      this.$confirm("确定要取消该预约吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 如果用户点击“确定”，发送取消预约的请求
          axios({
            method: "put",
            url: `http://localhost:8080/orders?id=${id}`, // 请求路径
          })
            .then(response => {
              console.log(response.data);
              this.$message.success("预约已成功取消");
              this.render({ page: this.currentPage }); // 刷新当前页面的数据
            })
            .catch(error => {
              console.error(error);
              this.$message.error("取消预约失败，请稍后重试");
            });
        })
        .catch(() => {
          // 如果用户点击“取消”，不做任何操作
          console.log("取消操作");
        });
    },
    open(message) {
      this.$message({
        showClose: true,
        message: message,
        duration: 2500,
        type: 'error'
      });
    }
  },
  mounted() {
    this.render()
  }
};
</script>

<style scoped></style>