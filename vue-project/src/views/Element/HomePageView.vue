<template>
  <div style="background-color: #fff;">
    <el-container>
      <el-header style="height: 65px; background-color: #fff; margin-bottom: 16px; border-bottom: 1px solid #ccc;">
        <div style="margin-left: 16px; display: flex; align-items: center; position: relative;">
          <i class="el-icon-magic-stick" style="font-size: 32px; color: #409eff;"></i>
          <span style="font-size: 20px; font-weight: 700; margin-left: 8px; line-height: 65px;">家政预约系统前台</span>
          <el-button style="position: absolute; right: 256px;">
            <router-link to="/appointment" style="text-decoration: none; color: #000;">
              我的预约
            </router-link>
          </el-button>
          <el-button style="position: absolute; right: 136px;">
            <router-link to="/apply" style="text-decoration: none; color: #000;">
              家政入驻
            </router-link>
          </el-button>
          <el-button style="position: absolute; right: 16px;">
            <router-link to="/worker" style="text-decoration: none; color: #000;">
              后台预览
            </router-link>
          </el-button>
        </div>
      </el-header>

      <el-container>
        <el-aside width="200px" style="margin-right: 20px; border-right: 2px solid #ccc;">
          <h3 style="text-align: center;">服务分类</h3>
          <el-tabs tab-position="left" style="height: 600px;" :before-leave="beforeLeave" v-model="currentTab">
            <el-tab-pane label="全部" name="all">全部</el-tab-pane>
            <el-tab-pane v-for="(label, key) in serviceCategoryMap" :key="key" :label="label" :name="key.toString()">{{
              label }}</el-tab-pane>
          </el-tabs>
        </el-aside>

        <el-main style="margin-right: 50px;">
          <div style="height: 40px; margin-bottom: 16px; position: relative;">
            <!-- <el-button round style="position: absolute; left: 20px;" type="primary">AI智能推荐</el-button> -->
            <el-input v-model="input" placeholder="请输入姓名"
              style="position: absolute; width: 250px; right: 70px;"></el-input>
            <el-button icon="el-icon-search" circle style="position: absolute; right: 20px;"
              @click="handleSearchData"></el-button>
          </div>

          <el-row>
            <el-col :span="4" v-for="(worker, index) in tableData" :key="worker.id" :offset="(index % 5) > 0 ? 1 : 0"
              style="margin-bottom: 20px;">
              <el-card :body-style="{ padding: '0px' }">
                <img :src="worker.profilePicture" class="image">
                <div style="padding: 14px;">
                  <div style="display: flex; justify-content: space-between;">
                    <el-tooltip effect="dark" placement="top" :content="worker.name">
                      <div class="ellipsis">
                        {{ worker.name }}
                      </div>
                    </el-tooltip>
                    <div style="font-weight: 700; font-size: 15px;">{{ worker.hourlyRate }}元/时</div>
                  </div>
                  <div class="bottom clearfix">
                    <time class="time">{{ serviceCategoryMap[worker.serviceCategory] }}</time>
                    <el-button type="text" class="button">
                      <!-- <router-link to="/detail" style="text-decoration: none; color: #409EFF;">
                        查看详情
                      </router-link> -->
                      <router-link :to="{ name: 'detail', params: { id: worker.id } }"
                        style="text-decoration: none; color: #409EFF;">
                        查看详情
                      </router-link>
                    </el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-empty description="当前没有数据" v-if="tableData.length === 0"></el-empty>
          </el-row>

          <div style="background-color: #fff !important; height: 50px;">
            <el-pagination background layout="total, prev, pager, next" :total="total" :current-page.sync="currentPage"
              @current-change="handleCurrentChange" style="position: absolute; right: 150px; margin-top: 20px;">
            </el-pagination>
          </div>
        </el-main>
      </el-container>
    </el-container>

    <chat-bot />
  </div>
</template>

<script>
import axios from "axios";
import ChatBot from '../../components/ChatBot.vue';

export default {
  components: {
    ChatBot
  },
  data() {
    return {
      total: 15,
      currentPage: 1,
      input: '',
      currentTab: 'all',
      serviceCategoryMap: {
        1: "家庭保洁",
        2: "宠物护理",
        3: "母婴护理",
        4: "老人护理",
        5: "服装护理服务",
        6: "节日装饰服务"
      },
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
      ]
    };
  },
  methods: {
    render({ page = 1, pageSize = 10, name = null } = {}) {
      // 获取家政人员数据
      axios({
        method: "get", // 指定请求方法为 GET
        url: "http://localhost:8080/domesticWorker/newPage", // 请求的 URL
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
            console.log("数据加载成功", this.tableData);
          } else {
            console.error("接口返回数据格式不符合预期");
          }
        })
        .catch(error => {
          console.error("请求失败", error);
        });

      // 获取服务类别数据
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
    },
    handleCurrentChange(val) {
      console.log("handleCurrentChange..." + this.currentPage);
      axios({
        method: "get", // 指定请求方法为 GET
        url: "http://localhost:8080/domesticWorker/list", // 请求的 URL
        params: {
          page: val, // 如果未传递 page，则使用默认值 1
          pageSize: 10, // 如果未传递 size，则使用默认值 10
          name: this.input,
          serviceCategory: this.currentTab === 'all' ? null : this.currentTab
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
    handleSearchData() {
      console.log("handleSearchData...");
      this.currentPage = 1
      axios({
        method: "get", // 指定请求方法为 GET
        url: "http://localhost:8080/domesticWorker/list", // 请求的 URL
        params: {
          page: 1, // 如果未传递 page，则使用默认值 1
          pageSize: 10, // 如果未传递 size，则使用默认值 10
          name: this.input,
          serviceCategory: this.currentTab === 'all' ? null : this.currentTab
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

      // this.input = ''
    },
    beforeLeave(activeName, oldActiveName) {
      console.log("从", oldActiveName, "->", activeName);
      this.handleTabClick(activeName)
      return true;
    },
    handleTabClick(key) {
      // 根据 key 值跳转到对应的服务分类页面
      console.log("跳转到服务分类:", key);
      if (key === 'all') {
        console.log('all...');
        axios({
          method: "get", // 指定请求方法为 GET
          url: "http://localhost:8080/domesticWorker/list", // 请求的 URL
          params: {
            page: 1, // 如果未传递 page，则使用默认值 1
            pageSize: 10, // 如果未传递 size，则使用默认值 10
            name: this.input,
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
      } else {
        console.log(key + '...');
        axios({
          method: "get", // 指定请求方法为 GET
          url: "http://localhost:8080/domesticWorker/list", // 请求的 URL
          params: {
            page: 1, // 如果未传递 page，则使用默认值 1
            pageSize: 10, // 如果未传递 size，则使用默认值 10
            name: this.input,
            serviceCategory: key
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
      }
      this.currentPage = 1
    }
  },
  mounted() {
    this.render()
  }
};
</script>

<style>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  /* width: 100%; */
  display: block;
  width: 184px;
  height: 185px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.ellipsis {
  width: 100px;
  /* 设置固定宽度 */
  white-space: nowrap;
  /* 防止文本换行 */
  overflow: hidden;
  /* 隐藏超出部分 */
  text-overflow: ellipsis;
  /* 显示省略号 */
}
</style>