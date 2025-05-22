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

      <el-main>
        <div style="width: 800px; margin: 0 auto;">
          <div style="width: 800px; border-bottom: 1px solid #ccc; margin-bottom: 20px;">
            <h2>家政入驻</h2>
          </div>
          <el-form :model="form" :rules="rules">
            <el-form-item label="姓名" label-width="100px" prop="name">
              <el-input v-model="form.name" autocomplete="off" style="width: 300px;" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="服务分类" label-width="100px" prop="serviceCategory">
              <el-select v-model="form.serviceCategory" placeholder="请选择服务类别" style="width: 250px;">
                <!-- 使用 v-for 动态生成选项 -->
                <el-option v-for="(label, value) in serviceCategoryMap" :key="value" :label="label" :value="value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="个人简介" label-width="100px" prop="introduction">
              <el-input type="textarea" placeholder="请输入内容" v-model="form.introduction" maxlength="300" show-word-limit
                style="width: 400px;">
              </el-input>
            </el-form-item>
            <el-form-item label="价格(元/时)" label-width="100px" prop="hourlyRate">
              <el-input v-model="form.hourlyRate" autocomplete="off" style="width: 250px;" type="number"></el-input>
            </el-form-item>
            <el-form-item label="电话号码" label-width="100px" prop="phoneNumber">
              <el-input v-model="form.phoneNumber" autocomplete="off" style="width: 300px;"
                placeholder="请输入电话号码"></el-input>
            </el-form-item>
            <el-form-item label="年龄" label-width="100px" prop="age">
              <el-input v-model="form.age" autocomplete="off" style="width: 250px;" type="number"></el-input>
            </el-form-item>
            <el-form-item label="性别" label-width="100px" prop="gender">
              <el-select v-model="form.gender" placeholder="请选择性别" style="width: 250px;">
                <el-option label="男" value=0></el-option>
                <el-option label="女" value=1></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所在地区" label-width="100px" prop="region">
              <el-input v-model="form.region" autocomplete="off" style="width: 300px;" placeholder="请输入所在地区"></el-input>
            </el-form-item>
            <el-form-item label="图片" label-width="100px" prop="profilePicture">
              <el-upload class="avatar-uploader" :show-file-list="false" :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload" action="http://localhost:8080/domesticWorker/upload">
                <img v-if="form.profilePicture" :src="form.profilePicture" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-form>
          <el-button type="primary" style="margin-left: 100px;" @click="confirmSubmit">
            确认提交
          </el-button>
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
        "name": "",
        "serviceCategory": "",
        "profilePicture": "",
        "introduction": "无",
        "hourlyRate": 0,
        "phoneNumber": "",
        "age": 0,
        "gender": "",
        "region": "",
        "status": "0",
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        introduction: [
          { required: true, message: '请输入个人简介', trigger: 'blur' },
        ],
        hourlyRate: [
          { required: true, message: '请填写价格(元/时)', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请填写电话号码', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请填写年龄', trigger: 'blur' },
        ],
        region: [
          { required: true, message: '请填写所在地区', trigger: 'blur' },
        ],
      },
      serviceCategoryMap: {
        1: "家庭保洁",
        2: "宠物护理",
        3: "母婴护理",
        4: "老人护理",
        5: "服装护理服务",
        6: "节日装饰服务"
      },
    }
  },
  methods: {
    handleAvatarSuccess(res) {
      console.log(res.data);
      this.form.profilePicture = res.data
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      // return isJPG && isLt2M;

      if (isJPG && isLt2M) {
        const formData = new FormData();
        formData.append("image", file); // 确保字段名与后端接口一致

        axios.post("http://localhost:8080/domesticWorker/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
          .then((response) => {
            console.log("文件上传成功", response);
            this.handleAvatarSuccess(response.data); // 处理上传成功后的逻辑
          })
          .catch((error) => {
            console.error("文件上传失败", error);
            this.$message.error("文件上传失败，请稍后再试");
          });
      }
      return false
    },
    confirmSubmit() {
      this.$confirm('是否确认提交?', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleAdd();
      }).catch(() => {
        this.$message.info('已取消提交');
      });
    },
    handleAdd() {
      const regex = /^1\d{10}$|^(0[2-9]\d{1,2}-?|\(0[2-9]\d{1,2}\))?[1-9]\d{4,7}(-\d{1,4})?$/;

      if (this.form.name.length === 0) {
        this.open("请输入姓名")
        return
      }
      if (this.form.serviceCategory.length === 0) {
        this.open("请选择服务种类")
        return
      }
      if (this.form.introduction.length === 0) {
        this.open("请输入个人简介")
        return
      }
      if (this.form.hourlyRate <= 0) {
        this.open("价格(元/时)应当是大于0的值")
        return
      }
      if (!regex.test(this.form.phoneNumber)) {
        this.open("请输入正确的电话号码")
        return
      }
      if (this.form.age <= 0 || this.form.age >= 100) {
        this.open("请填写正确的年龄")
        return
      }
      if (this.form.gender.length === 0) {
        this.open("请选择性别")
        return
      }
      if (this.form.region.length === 0) {
        this.open("请输入所在地区")
        return
      }

      console.log(this.form);

      axios({
        method: "post",
        url: `http://localhost:8080/domesticWorker`, // 请求路径
        data: this.form,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          console.log(response.data);
          this.$message.success("提交成功");

          this.form = {
            "name": "",
            "serviceCategory": "",
            "profilePicture": "",
            "introduction": "无",
            "hourlyRate": 0,
            "phoneNumber": "",
            "age": 0,
            "gender": "",
            "region": "",
            "status": "0",
          }
        })
        .catch(error => {
          console.error(error);
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
  }
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>