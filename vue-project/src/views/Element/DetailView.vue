<template>
  <div style="background-color: #fff; min-height: 100vh;">
    <el-container>
      <el-header style="height: 65px; background-color: #fff; margin-bottom: 16px; border-bottom: 1px solid #ccc;">
        <div style="margin-left: 16px; display: flex; align-items: center; position: relative;">
          <i class="el-icon-magic-stick" style="font-size: 32px; color: #409eff;"></i>
          <span style="font-size: 20px; font-weight: 700; margin-left: 8px; line-height: 65px;">家政预约系统前台</span>
          <el-button style="position: absolute; right: 206px;">
            <router-link to="/appointment" style="text-decoration: none; color: #000;">
              我的预约
            </router-link>
          </el-button>
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

            <el-dialog title="预约信息" :visible.sync="dialogFormVisible">
              <el-form :model="dialogForm"
                style="display: flex; justify-content:space-between; flex-wrap: wrap; padding: 0 20px;" :rules="rules">
                <el-form-item label="预约日期(若不可选则表示已被预约)" prop="appointmentDate">
                  <el-date-picker v-model="dialogForm.appointmentDate" type="date" placeholder="选择日期"
                    style="width: 300px;" :picker-options="pickerOptions" @change="handleDateChange">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="预约时间段(若不可选则表示已被预约)" prop="appointmentSession">
                  <el-select v-model="dialogForm.appointmentSession" placeholder="请选择预约时间段" style="width: 270px;">
                    <el-option label="上午" value=0 :disabled="disabledSessions.includes(0)"></el-option>
                    <el-option label="下午" value=1 :disabled="disabledSessions.includes(1)"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="您的姓名" prop="clientName">
                  <el-input v-model="dialogForm.clientName" autocomplete="off" style="width: 300px;"
                    placeholder="请输入您的姓名"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="clientPhone">
                  <el-input v-model="dialogForm.clientPhone" autocomplete="off" style="width: 270px;"
                    placeholder="请输入联系电话"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="clientAddress">
                  <el-input v-model="dialogForm.clientAddress" autocomplete="off" style="width: 500px;"
                    placeholder="请输入地址"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleOrder">确 定</el-button>
              </div>
            </el-dialog>
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
      disabledSessions: [],// 用于存储禁用的时间段
      disabledDates: [], // 用于存储禁用日期
      pickerOptions: {
        disabledDate: this.isDateDisabled // 使用同步函数
      },
      form: {
        "id": 16,
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
      },
      rules: {
        clientName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        clientPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
        ],
        clientAddress: [
          { required: true, message: '请输入地址', trigger: 'blur' },
        ],
      },
      dialogFormVisible: false,
      dialogForm: {
        staffId: '',
        appointmentDate: '',
        appointmentSession: '',
        clientName: '',
        clientPhone: '',
        clientAddress: '',
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    handleDateChange(value) {
      if (value) {
        const formattedDate = this.formatDate(value);
        console.log("选中的日期是：", formattedDate);

        axios({
          method: "get",
          url: "http://localhost:8080/appointment/session",
          params: {
            staffId: this.form.id,
            appointmentDate: formattedDate,
          }
        }).then(response => {
          const array = response.data.data
          console.log("非空闲时间段:" + array);
          this.disabledSessions = array
        })
      }
    },

    formatDate(date) {
      if (!date) return null; // 如果日期为空，返回 null
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，需要加 1
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    isDateDisabled(time) {
      const date = new Date(time.getTime());
      const today = new Date(); // 获取当前日期

      const todayStartOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      // 检查日期是否小于当天的 00:00:00
      if (date < todayStartOfDay) {
        return true; // 如果小于当天的 00:00:00，则禁用
      }

      return this.disabledDates.some(disabledDate => {
        return (
          disabledDate.getFullYear() === date.getFullYear() &&
          disabledDate.getMonth() === date.getMonth() &&
          disabledDate.getDate() === date.getDate()
        );
      });
    },

    // 获取禁用日期的异步方法
    async fetchDisabledDates() {
      try {
        const response = await axios({
          method: "get",
          url: `http://localhost:8080/appointment/${this.form.id}`
        });
        const dates = response.data.data.map(dateString => {
          const date = new Date(dateString);
          return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        });
        this.disabledDates = dates; // 将禁用日期存储到 data 中
      } catch (error) {
        console.error("Error fetching disabled dates:", error);
      }
    },

    handleOrder() {
      const regex = /^1\d{10}$|^(0[2-9]\d{1,2}-?|\(0[2-9]\d{1,2}\))?[1-9]\d{4,7}(-\d{1,4})?$/;

      if (this.dialogForm.appointmentDate.length === 0) {
        this.open("请选择预约日期")
        return
      }
      if (this.dialogForm.appointmentSession.length === 0) {
        this.open("请选择预约时间段")
        return
      }
      if (this.dialogForm.clientName.length === 0) {
        this.open("请输入您的姓名")
        return
      }
      if (!regex.test(this.dialogForm.clientPhone)) {
        this.open("请输入正确的电话号码")
        return
      }
      if (this.dialogForm.clientAddress.length === 0) {
        this.open("请输入您的地址")
        return
      }

      const appointmentDate = this.dialogForm.appointmentDate;

      // 格式化日期为 YYYY-MM-DD
      const formattedDate = this.formatDate(appointmentDate);

      // 更新 dialogForm 中的 appointmentDate
      this.dialogForm.appointmentDate = formattedDate;

      this.dialogForm.staffId = this.form.id
      console.log(this.dialogForm);

      axios({
        method: "post",
        url: `http://localhost:8080/appointment`, // 请求路径
        data: this.dialogForm,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          console.log(response.data);
          this.$message.success("预约成功");

          this.dialogForm = {
            staffId: '',
            appointmentDate: '',
            appointmentSession: '',
            clientName: '',
            clientPhone: '',
            clientAddress: '',
          }
        })
        .catch(error => {
          console.error(error);
        });

      this.dialogFormVisible = false
    },

    handleImmediateBooking() {
      this.dialogFormVisible = true
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
      this.form = response.data.data
      this.form.gender = this.genderMap[this.form.gender]
      this.form.status = this.statusMap[this.form.status]
      this.form.serviceCategory = this.serviceCategoryMap[this.form.serviceCategory]
      console.log(this.form);

      console.log("this.form.id:" + this.form.id);
      this.fetchDisabledDates();
    })

  }
};
</script>

<style scoped></style>