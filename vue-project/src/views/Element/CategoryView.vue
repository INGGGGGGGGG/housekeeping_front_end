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
            <el-button type="success" plain style="position: absolute; right: 50px;" @click="add">新增数据</el-button>
          </div>

          <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
            <el-form :model="form"
              style="display: flex; justify-content:space-between; flex-wrap: wrap; padding: 0 20px;" :rules="rules">
              <el-form-item label="服务名称" prop="name">
                <el-input v-model="form.name" autocomplete="off" style="width: 300px;" placeholder="请输入服务名称"></el-input>
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

          <el-table :data="tableData" style="width: 100%">
            <el-table-column label="服务名称" width="850" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column label="状态" width="200" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.status === 0 ? '正常' : scope.row.status === 1 ? '下架' : '已被预约'
              }}</template>
            </el-table-column>
            <el-table-column label="操作" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button type="primary" plain style="width: 50px; padding-left: 10px; margin-top: 12px;"
                  @click="handleGetById(scope.row)">
                  <span>编辑</span>
                </el-button>
              </template>
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
      tableData: [{
        name: '家庭保洁',
        status: 0
      }, {
        name: '宠物护理',
        status: 0
      },],
      total: 0,
      currentPage: 1,
      dialogTitle: "新增数据",
      dialogFormVisible: false,
      form: {
        name: '',
        status: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入服务名称', trigger: 'blur' }
        ]
      },
      // 0新增1编辑
      flag: 0,
      statusMap: {
        0: "正常",
        1: "下架",
      },
      statusReverseMap: {
        "正常": 0,
        "下架": 1
      },
    }
  },
  methods: {
    render({ page = 1, pageSize = 10 } = {}) {
      console.log({ page, pageSize });
      axios({
        method: "get", // 指定请求方法为 GET
        url: "http://localhost:8080/category/page", // 请求的 URL
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
            console.log("数据加载成功", response.data.data);
          } else {
            console.error("接口返回数据格式不符合预期");
          }
        })
        .catch(error => {
          console.error("请求失败", error);
        });
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.render({ page: val, pageSize: 10 });
    },
    handleGetById(row) {
      this.flag = 1
      this.dialogTitle = "编辑数据"
      console.log(row.id);
      axios({
        method: "get",
        url: `http://localhost:8080/category/${row.id}`
      }).then(response => {
        console.log(response.data.data);
        this.form = response.data.data
        this.form.status = this.statusMap[this.form.status]

        this.dialogFormVisible = true
      })
    },
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
        name: '',
        status: ''
      }
      this.dialogFormVisible = true
    },
    handleAdd() {
      if (this.form.name.length === 0) {
        this.open("请输入服务名称")
        return
      }
      if (this.form.status.length === 0) {
        this.open("请选择状态")
        return
      }

      console.log(this.form);

      axios({
        method: "post",
        url: `http://localhost:8080/category`, // 请求路径
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
            name: '',
            status: ''
          }
        })
        .catch(error => {
          this.$message.error("新增失败,不能存在相同的服务种类！");
          console.error(error);
        });

      this.dialogFormVisible = false;
    },
    handleEdit() {
      if (this.form.name.length === 0) {
        this.open("请输入服务名称")
        return
      }
      if (this.form.status.length === 0) {
        this.open("请选择状态")
        return
      }
      if (!(this.form.status >= 0 && this.form.status <= 2)) {
        this.form.status = this.statusReverseMap[this.form.status]
      }

      console.log(this.form);

      axios({
        method: "put",
        url: `http://localhost:8080/category`, // 请求路径
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
            name: '',
            status: ''
          }
        })
        .catch(error => {
          this.$message.error("修改失败,不能存在相同的服务种类！");
          console.error(error);
        });

      this.dialogFormVisible = false;
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