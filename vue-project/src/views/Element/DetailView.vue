<template>
  <div style="background-color: #fff; min-height: 100vh;">
    <el-container>
      <el-header style="height: 65px; background-color: #fff; margin-bottom: 16px; border-bottom: 1px solid #ccc;">
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

      <el-main>
        <div style="width: 1100px; margin: 0 auto; display: flex;">
          <img :src="form.profilePicture" style="display: block; width: 240px; height: 240px; margin-right: 80px;">
          <div style="margin-top: -15px; width: 750px;">
            <h2 style="font-weight: 500;">{{ form.name }}</h2>
            <p><span style="color: #315c9e; font-weight: 500; font-size: 20px; margin-right: 3px;">
                {{ form.hourlyRate }}</span>元/时
            </p>
            <p>服务类别：<span style="color: #315c9e;">{{ form.serviceCategory }}</span></p>
            <p>性别：<span style="color: #315c9e;">{{ form.gender }}</span></p>
            <p>年龄：<span style="color: #315c9e;">{{ form.age }}</span></p>
            <p>地区：<span style="color: #315c9e;">{{ form.region }}</span></p>
            <el-button type="primary" plain style="margin-top: 10px;" @click="handleImmediateBooking">
              <i class="el-icon-circle-plus-outline" style="font-size: 16px; color: #409eff; padding-top: 3px;">
              </i>
              <span>立即预约</span>
            </el-button>
          </div>
        </div>
        <div style="width: 1100px; margin: 20px auto;">
          <el-tabs type="border-card">
            <el-tab-pane label="简介">
              {{ form.introduction }}
            </el-tab-pane>
          </el-tabs>
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
      form: {
        "id": 15,
        "name": "张三",
        "serviceCategory": 1,
        "profilePicture": "http://example.com/zhangsan.jpg",
        "introduction": "有10年家政经验",
        "hourlyRate": 50.0,
        "phoneNumber": "12345678901",
        "age": 45,
        "gender": 1,
        "region": "北京",
        "status": 2,
        "createTime": "2025-02-26T17:02:09",
        "updateTime": "2025-02-26T17:02:09"
      },
      genderMap: {
        0: "男",
        1: "女",
      },
      statusMap: {
        0: "正常",
        1: "下架",
      },
      serviceCategoryMap: {
        1: "家庭保洁",
        2: "宠物护理",
        3: "母婴护理",
        4: "老人护理",
        5: "服装护理服务",
        6: "节日装饰服务"
      }
    }
  },
  methods: {
    handleImmediateBooking() {
      axios({
        method: "post",
        url: `http://localhost:8080/orders?staffId=${this.form.id}`, // 请求路径
      })
        .then(response => {
          console.log(response.data);
          this.$message.success("预约成功");
          this.$router.push("/home");
        })
        .catch(error => {
          console.error(error);
          this.$message.error("预约失败，请稍后重试");
        });
    }
  },
  mounted() {
    const id = this.$route.params.id
    console.log("查询ID:" + id);

    axios({
      method: "get",
      url: "http://localhost:8080/category/page",
      params: {
        page: 1,
        pageSize: 1000,
      }
    })
      .then(response => {
        // 后端传输过来的完整数据
        const rows = response.data.data.rows;
        if (rows) {
          // 只保留id和name后的数据（id为键，name为值）
          const newRows = rows.map(item => {
            return {
              id: item.id,
              name: item.name
            };
          }).reduce((acc, item) => {
            acc[item.id] = item.name;
            return acc;
          }, {});
          this.serviceCategoryMap = newRows;

          console.log("数据加载成功", this.serviceCategoryMap);
        } else {
          console.error("接口返回数据格式不符合预期");
        }
      })
      .catch(error => {
        console.error("请求失败", error);
      });

    axios({
      method: "get",
      url: `http://localhost:8080/domesticWorker/${id}`
    }).then(response => {
      console.log(response.data.data);
      this.form = response.data.data
      this.form.gender = this.genderMap[this.form.gender]
      this.form.status = this.statusMap[this.form.status]
      this.form.serviceCategory = this.serviceCategoryMap[this.form.serviceCategory]
      console.log("信息回显:" + this.form);

    })
  }
};
</script>

<style scoped></style>