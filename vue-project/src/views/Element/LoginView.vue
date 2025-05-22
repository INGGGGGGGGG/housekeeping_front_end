<template>
  <div>
    <div
      style="width: 500px; margin: 150px auto; padding: 40px; background-color: #fff; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); border-radius: 10px;">
      <el-form :model="form" :rules="rules" style="max-width: 400px; margin: 0 auto;">
        <h2 style="text-align: center; margin-bottom: 30px; color: #333;">用户登录</h2>

        <el-form-item label="用户名" label-width="100px" prop="username">
          <el-input v-model="form.username" autocomplete="off" placeholder="请输入用户名" style="width: 100%;">
            <i slot="prefix" class="el-input__icon el-icon-user"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="密码" label-width="100px" prop="password">
          <el-input v-model="form.password" type="password" autocomplete="off" placeholder="请输入密码" style="width: 100%;">
            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
          </el-input>
        </el-form-item>

        <div style="text-align: center;">
          <el-button type="primary" style="width: 100%; margin-top: 10px;" @click="confirmSubmit">
            登录
          </el-button>
        </div>

        <!-- <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
          <span @click="forgotPassword">忘记密码？</span>
        </div> -->
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ]
      },
    }
  },
  methods: {
    confirmSubmit() {
      if (this.form.username.length === 0) {
        this.open("请输入用户名")
        return
      }
      if (this.form.password.length === 0) {
        this.open("请输入用密码")
        return
      }
      console.log(this.form);

      axios({
        method: "post",
        url: `http://localhost:8080/user`, // 请求路径
        data: this.form,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          console.log(response.data.data.flag);
          if (!response.data.data.flag) {
            this.$message.error("用户名或密码错误！");
          } else {
            if (response.data.data.role == 0) {
              this.$router.push({
                name: 'worker',
              });
            } else {
              this.$router.push({
                name: 'home',
              });
            }

            this.$message.success("登录成功！");
          }
        })
        .catch(error => {
          this.$message.error("用户名或密码错误！");
          console.error(error);
        });
    },
    // forgotPassword() {
    //   // 这里可以添加忘记密码的逻辑
    //   console.log('忘记密码');
    // }
    open(message) {
      this.$message({
        showClose: true,
        message: message,
        duration: 2500,
        type: 'error'
      });
    }
  }
}
</script>

<style scoped>
:deep(.el-form-item__label) {
  font-weight: bold;
  color: #333;
}

:deep(.el-input__inner) {
  border-radius: 4px;
}
</style>