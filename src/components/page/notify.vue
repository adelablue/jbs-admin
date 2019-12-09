<template>
    <div class="userList">
        <div class="container">
          <div class="search_container">
            <el-dropdown split-button   size="medium" type="primary" @command="handleCommand" style="float: left; text-align: left;  margin-bottom: 22px">
              {{event_type}}
              <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item, i) in eventType" :key="i" :command="item.id">{{item.name}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-input type="text" v-model="weChat" style="width: 200px; margin-left: 10px; margin-right: 10px; z-index: 999" placeholder="请输入用户微信进行搜索"></el-input>
            <span class="btn" @click="searchEvent">搜索</span>
          </div>
          <div class="notify" v-for="item in notifyList" :key = "item.index" >
            <div class="wrap" @click="showDetail(item)">
              <div class="descript text">状态: <span class="read">{{item.read? '已读': '未读'}}</span></div>
              <div class="creatAt text">时间: {{item.create_time}}</div>
              <div class="smsMessage text">信息: {{item.smsMessage}}</div>
              <div class="smsMessage text">信息: {{item.message}}</div>
            </div>
          </div>
        </div>
        <div class="Pagination Pagination1" v-if="pageShow">
          <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 25, 50, 100]"
              :page-size="10"
              :total = "total"
              layout="total, prev, pager, next, jumper"
              >
          </el-pagination>
        </div>
        <div class="Pagination Pagination2" v-if="pageShow">
          <el-pagination
              background
              small
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :pager-count="5"
              :page-sizes="[10, 20, 25, 50, 100]"
              :page-size="10"
              :total = "total"
              layout="prev, pager, next"
              >
          </el-pagination>
        </div>
    </div>

</template>
<script>
import {
  getAllNotify,
  formatDate,
  checkAllNotify,
  getNotifyBySearch
} from "../../api/api.js";
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  data() {
    return {
      notifyList: [],
      links: null,
      pagination: null,
      pageShow: false,
      total: 0,
      currentPage: 1,
      postData: {
        limit: 10,
        offset: 0,
        audience: "shop"
      },
      eventType: [
        {
          id: 0,
          type: "",
          name: "默认选择"
        },
        {
          id: 1,
          type: "event_joined",
          name: "已参加"
        },
        {
          id: 2,
          type: "event_created",
          name: "已参团"
        },
        {
          id: 3,
          type: "event_completed",
          name: "拼团成功"
        }
      ],
      event_type: "活动类型",
      search_type: "",
      weChat: ""
    };
  },
  mounted() {},
  created() {
    this.getNotify(this.postData);
  },
  methods: {
    getNotify(data) {
      getAllNotify(data).then(res => {
        if (res.status == 200) {
          this.$message({
            type: "success",
            message: "获取数据成功!"
          });
          this.notifyList = res.data.data;
          this.links = res.data.links;
          this.pagination = res.data.pagination;
          this.total = this.pagination.total;
          if (this.notifyList.length > 0) {
            this.pageShow = true;
          }
          for (let i = 0; i < this.notifyList.length; i++) {
            this.notifyList[i].create_time = formatDate(
              new Date(this.notifyList[i].createdAt)
            );
          }
        }
      });
    },
    // 筛选活动类型
    handleCommand(command) {
      for (let i = 0; i < this.eventType.length; i++) {
        if (command == this.eventType[i].id) {
          this.event_type = this.eventType[i].name;
          this.search_type = this.eventType[i].type;
        }
      }
    },
    searchEvent() {
      this.postData.eventType = this.search_type;
      this.postData.message = this.weChat;
      this.getNotify(this.postData);
    },
    handleSizeChange(val) {
      this.postData.limit = val;
      this.getNotify(this.postData);
    },
    handleCurrentChange(val) {
      this.postData.offset = (val - 1) * this.postData.limit;
      this.currentPage = val;
      this.getNotify(this.postData);
    },
    showDetail(item) {
      let serialNumber = item.serialNumber;
      let data = {
        serialNumber: serialNumber
      };
      let body = {
        read: true
      };
      let objectId = item.objectId;
      this.$common.setSessionStorage("objectId", objectId);
      this.$router.push("details");
      checkAllNotify(data, body).then(res => {
        if (res.status == 200) {
          this.$message({
            type: "success",
            message: "该条消息已读!"
          });
          setTimeout(() => {
            this.postData.offset = (this.currentPage - 1) * this.postData.limit;
            this.getNotify(this.postData);
          }, 1000);
        } else {
          this.$message({
            type: "success",
            message: "系统错误!"
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.userList {
  .container {
    .search_container {
      margin-bottom: 10px;
      height: 40px;
      .btn {
        height: 36px;
        line-height: 36px;
        width: 60px;
        background-color: #409eff;
        display: inline-block;
        text-align: center;
        border-radius: 5px;
        color: #fff;
        cursor: pointer;
      }
    }
    .notify {
      padding: 10px;
      border: 1px solid #cccccc;
      box-shadow: 3px 3px 3px #666999;
      border-radius: 5px;
      margin-bottom: 20px;
      cursor: pointer;
      .wrap {
        padding: 20px;
        .text {
          margin-bottom: 5px;
          .read {
            height: 22px;
            line-height: 22px;
            padding: 0 5px;
            background-color: #409eff;
            float: right;
            color: #fff;
            border-radius: 5px;
            cursor: pointer;
          }
        }
      }
    }
  }
  .Pagination {
    margin-top: 25px;
    float: right;
  }
  .Pagination1 {
    display: block;
  }
  .Pagination2 {
    display: none;
  }
}
@media screen and (max-width: 480px) {
  .userList {
    .container {
      .search_container {
        height: 2rem;
        .el-dropdown {
          margin-bottom: 0.1rem !important;
        }
        .el-input--small {
          margin-left: 0 !important;
          margin-right: 0 !important;
          width: 3.2rem !important;
        }
        .btn {
          width: 1rem;
        }
      }
      padding: 0.5rem;
      font-size: 0.25rem;
      .notify {
        .wrap {
          padding: 5px;
          .text {
            width: 100%;
            .read {
              padding: 0.05rem 0.15rem;
              height: 0.3rem;
              line-height: 0.3rem;
              font-size: 0.2rem;
            }
          }
        }
      }
    }
    .Pagination1 {
      display: none;
    }
    .Pagination2 {
      display: block;
      width: 100%;
      text-align: right;
    }
  }
}
</style>
