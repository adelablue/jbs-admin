<template>
    <div class="userList">
        <div class="container">
            <div class="notify" v-for="item in notifyList" :key = "item.index" >
              <div class="wrap" @click="showDetail(item)">
                <div class="descript text">状态: {{item.description}} <span class="read">{{item.read? '已读': '未读'}}</span></div>
                <div class="creatAt text">时间: {{item.create_time}}</div>
                <div class="smsMessage text">信息: {{item.smsMessage}}</div>
              </div>
            </div>
            
        </div>
        <div class="Pagination" v-if="pageShow">
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
    </div>

</template>
<script>
import { getAllNotify, formatDate, checkAllNotify } from "../../api/api.js";
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
      }
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
      }
      let objectId = (item.objectId)
      this.$common.setSessionStorage('objectId', objectId)
      this.$router.push('details')
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
            padding: 3px 8px;
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
}
</style>
