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
            </el-submenu>
          </el-menu>
        </el-aside>

        <!-- 主要内容 -->
        <el-main
          style="flex: 1; overflow: auto; background-color: #fff; height: 620px; margin-left: 8px; position: relative;">
          <div style="height: 40px; margin-bottom: 6px; position: relative;">
            <el-button type="success" plain style="position: absolute; right: 450px;" @click="add">新增</el-button>
            <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
              <el-form :model="form"
                style="display: flex; justify-content:space-between; flex-wrap: wrap; padding: 0 20px;" :rules="rules">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="form.name" autocomplete="off" style="width: 300px;"></el-input>
                </el-form-item>
                <el-form-item label="服务分类" prop="serviceCategory">
                  <el-select v-model="form.serviceCategory" placeholder="请选择服务类别" style="width: 250px;">
                    <!-- 使用 v-for 动态生成选项 -->
                    <el-option v-for="(label, value) in serviceCategoryMap" :key="value" :label="label" :value="value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="个人简介" prop="introduction">
                  <el-input type="textarea" placeholder="请输入内容" v-model="form.introduction" maxlength="300"
                    show-word-limit style="width: 300px;">
                  </el-input>
                </el-form-item>
                <el-form-item label="价格(元/时)" prop="hourlyRate">
                  <el-input v-model="form.hourlyRate" autocomplete="off" style="width: 250px;" type="number"></el-input>
                </el-form-item>
                <el-form-item label="电话号码" prop="phoneNumber">
                  <el-input v-model="form.phoneNumber" autocomplete="off" style="width: 300px;"></el-input>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                  <el-input v-model="form.age" autocomplete="off" style="width: 250px;" type="number"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                  <el-select v-model="form.gender" placeholder="请选择性别" style="width: 250px;">
                    <el-option label="男" value=0></el-option>
                    <el-option label="女" value=1></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所在地区" prop="region">
                  <el-input v-model="form.region" autocomplete="off" style="width: 300px;"></el-input>
                </el-form-item>
                <el-form-item label="图片" prop="profilePicture">
                  <el-upload class="avatar-uploader" :show-file-list="false" :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload" action="http://localhost:8080/domesticWorker/upload">
                    <img v-if="form.profilePicture" :src="form.profilePicture" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                  <el-select v-model="form.status" placeholder="请选择状态" style="width: 250px;">
                    <el-option label="正常" value=0></el-option>
                    <el-option label="下架" value=1></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleFlag">确 定</el-button>
              </div>
            </el-dialog>

            <el-button type="danger" plain style="position: absolute; right: 330px;"
              @click="handleMultipleDelete">批量删除</el-button>
            <el-input v-model="input" placeholder="请输入姓名"
              style="position: absolute; width: 250px; right: 70px;"></el-input>
            <el-button icon="el-icon-search" circle style="position: absolute; right: 20px;"
              @click="handleSearchData"></el-button>
          </div>

          <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column label="姓名" width="120" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column label="价格(元/时)" width="120" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.hourlyRate }}</template>
            </el-table-column>
            <el-table-column label="手机号" width="160" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.phoneNumber }}</template>
            </el-table-column>
            <el-table-column label="年龄" width="100" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.age }}</template>
            </el-table-column>
            <el-table-column label="性别" width="120" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.gender === 0 ? '男' : scope.row.gender === 1 ? '女' : '未知'
              }}</template>
            </el-table-column>
            <el-table-column label="所在地" width="240" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.region }}</template>
            </el-table-column>
            <el-table-column label="状态" width="120" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.status === 0 ? '正常' : scope.row.status === 1 ? '下架' : '已被预约'
              }}</template>
            </el-table-column>
            <el-table-column label="操作" width="140" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button type="primary" plain style="width: 50px; padding-left: 10px; margin-top: 12px;"
                  @click="handleGetById(scope.row)">
                  <span>编辑</span>
                </el-button>
                <el-button type="danger" plain style="width: 50px; padding-left: 10px; margin-top: 12px;"
                  @click="handleDelete(scope.row)">
                  <span>删除</span>
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination background layout="total, prev, pager, next" :total="total" :current-page.sync="currentPage"
            @current-change="handleCurrentChange" style="position: absolute; right: 20px; margin-top: 20px;">
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
      // 0新增1编辑
      flag: 0,
      dialogTitle: "新增数据",
      total: 0,
      currentPage: 1,
      tableData: [
        {
          "id": 13,
          "name": "张三",
          "serviceCategory": 1,
          "profilePicture": "http://example.com/zhangsan.jpg",
          "introduction": "有10年家政经验",
          "hourlyRate": 50.0,
          "phoneNumber": "12345678901",
          "age": 45,
          "gender": 0,
          "region": "北京",
          "status": 0,
          "createTime": "2025-02-26T17:02:09",
          "updateTime": "2025-02-26T17:02:09"
        },
        {
          "id": 14,
          "name": "张三",
          "serviceCategory": 1,
          "profilePicture": "http://example.com/zhangsan.jpg",
          "introduction": "有10年家政经验",
          "hourlyRate": 50.0,
          "phoneNumber": "12345678901",
          "age": 45,
          "gender": 0,
          "region": "北京",
          "status": 1,
          "createTime": "2025-02-26T17:02:09",
          "updateTime": "2025-02-26T17:02:09"
        },
        {
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
        }
      ],
      multipleSelection: [],
      input: '',
      dialogFormVisible: false,
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
        "status": "",
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
      genderMap: {
        0: "男",
        1: "女",
      },
      genderReverseMap: {
        "男": 0,
        "女": 1
      },
      statusMap: {
        0: "正常",
        1: "下架",
      },
      statusReverseMap: {
        "正常": 0,
        "下架": 1
      },
      serviceCategoryMap: {
        1: "家庭保洁",
        2: "宠物护理",
        3: "母婴护理",
        4: "老人护理",
        5: "服装护理服务",
        6: "节日装饰服务"
      },
      serviceCategoryReverseMap: {
        "家庭保洁": 1,
        "宠物护理": 2,
        "母婴护理": 3,
        "老人护理": 4,
        "服装护理服务": 5,
        "节日装饰服务": 6
      }
    }
  },

  methods: {
    handleFlag() {
      if (this.flag === 0) {
        this.handleAdd()
      } else {
        this.handleEdit()
      }
    },
    add() {
      this.flag = 0
      this.dialogTitle = "新增数据"
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
        "status": "",
      }
      this.dialogFormVisible = true
    },
    handleGetById(row) {
      this.flag = 1
      this.dialogTitle = "编辑数据"
      console.log(row.id);
      axios({
        method: "get",
        url: `http://localhost:8080/domesticWorker/${row.id}`
      }).then(response => {
        console.log(response.data.data);
        this.form = response.data.data
        this.form.gender = this.genderMap[this.form.gender]
        this.form.status = this.statusMap[this.form.status]
        this.form.serviceCategory = this.serviceCategoryMap[this.form.serviceCategory]
        console.log(this.form.gender);

        this.dialogFormVisible = true
      })
    },
    handleEdit() {
      const regex = /^1\d{10}$|^(0[2-9]\d{1,2}-?|\(0[2-9]\d{1,2}\))?[1-9]\d{4,7}(-\d{1,4})?$/;
      const keys = Object.keys(this.serviceCategoryMap);
      const lastKey = keys[keys.length - 1];

      if (this.form.name.length === 0) {
        this.open("请输入姓名")
        return
      }
      if (this.form.serviceCategory.length === 0) {
        this.open("请选择服务种类")
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
      if (this.form.age <= 0) {
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
      if (this.form.status.length === 0) {
        this.open("请选择状态")
        return
      }
      if (!(this.form.serviceCategory >= 1 && this.form.serviceCategory <= lastKey)) {
        this.form.serviceCategory = this.serviceCategoryReverseMap[this.form.serviceCategory]
      }
      if (!(this.form.gender >= 0 && this.form.gender <= 1)) {
        this.form.gender = this.genderReverseMap[this.form.gender]
      }
      if (!(this.form.status >= 0 && this.form.status <= 2)) {
        this.form.status = this.statusReverseMap[this.form.status]
      }

      console.log(this.form);

      axios({
        method: "put",
        url: `http://localhost:8080/domesticWorker`, // 请求路径
        data: this.form,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          console.log(response.data);
          this.$message.success("修改成功");
          this.render();

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
            "status": "",
          }
        })
        .catch(error => {
          console.error(error);
        });

      this.dialogFormVisible = false;
    },
    handleMultipleDelete() {
      const ids = this.multipleSelection.map(item => item.id);
      const idsString = ids.join(",");
      console.log(idsString);
      this.$confirm("确定要删除选中记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 用户点击“确定”按钮后执行删除操作
          axios({
            method: "delete", // 指定请求方法为 DELETE
            url: `http://localhost:8080/domesticWorker/ids`, // 请求路径
            params: {
              ids: idsString
            },
            headers: {
              "Content-Type": "application/json"
            }
          })
            .then(response => {
              console.log("删除成功", response.data);
              // 在这里处理删除成功后的逻辑
              this.$message.success("删除成功");
              this.render(); // 重新加载表格数据
              console.log(this.multipleSelection);

            })
            .catch(error => {
              console.error("删除失败", error);
              this.$message.error("没有选中数据,无法删除");
            });
        })
        .catch(() => {
          // 用户点击“取消”按钮
          this.$message.info("已取消删除");
        });
    },
    // 多选实现
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.render({ page: val, pageSize: 10, name: this.input });
    },
    handleDelete(row) {
      console.log(row.id);
      this.$confirm("确定要删除该记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 用户点击“确定”按钮后执行删除操作
          axios({
            method: "delete", // 指定请求方法为 DELETE
            url: `http://localhost:8080/domesticWorker/${row.id}`, // 请求路径
            headers: {
              "Content-Type": "application/json"
            }
          })
            .then(response => {
              console.log("删除成功", response.data);
              // 在这里处理删除成功后的逻辑
              this.$message.success("删除成功");
              this.render(); // 重新加载表格数据
              setTimeout(() => {
                location.reload();
              }, 600);
            })
            .catch(error => {
              console.error("删除失败", error);
              this.$message.error("删除失败");
            });
        })
        .catch(() => {
          // 用户点击“取消”按钮
          this.$message.info("已取消删除");
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
      if (this.form.hourlyRate <= 0) {
        this.open("价格(元/时)应当是大于0的值")
        return
      }
      if (!regex.test(this.form.phoneNumber)) {
        this.open("请输入正确的电话号码")
        return
      }
      if (this.form.age <= 0) {
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
      if (this.form.status.length === 0) {
        this.open("请选择状态")
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
          this.$message.success("新增成功");
          this.render();

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
            "status": "",
          }
        })
        .catch(error => {
          console.error(error);
        });

      this.dialogFormVisible = false;
    },
    handleSearchData() {
      console.log(this.input);
      this.currentPage = 1;
      this.render({ page: 1, pageSize: 10, name: this.input });
      this.input = '';
    },
    render({ page = 1, pageSize = 10, name = null } = {}) {
      console.log({ page, pageSize, name });
      axios({
        method: "get", // 指定请求方法为 GET
        url: "http://localhost:8080/domesticWorker/page", // 请求的 URL
        params: {
          page: page, // 如果未传递 page，则使用默认值 1
          pageSize: pageSize, // 如果未传递 size，则使用默认值 10
          name: name
        }
      })
        .then(response => {
          // 假设接口返回的数据结构是 { data: { rows: [...] } }
          const rows = response.data.data.rows;
          if (rows) {
            this.total = response.data.data.total;
            this.tableData = rows;
            // this.tableData = [];
            console.log("数据加载成功", response.data.data);
          } else {
            console.error("接口返回数据格式不符合预期");
          }
        })
        .catch(error => {
          console.error("请求失败", error);
        });
    },
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

          // 反转只保留id和name的数据（name为键，id为值）
          const newReversedRows = {};

          for (const [key, value] of Object.entries(this.serviceCategoryMap)) {
            newReversedRows[value] = key;
          }
          this.serviceCategoryReverseMap = newReversedRows

          console.log(Object.keys(this.serviceCategoryMap));
          console.log("数据加载成功", this.serviceCategoryReverseMap);
        } else {
          console.error("接口返回数据格式不符合预期");
        }
      })
      .catch(error => {
        console.error("请求失败", error);
      });
    this.render();
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
  width: 160px;
  padding-left: 40px;
  display: block;
  /* width: 100%; */
  text-decoration: none;
}

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