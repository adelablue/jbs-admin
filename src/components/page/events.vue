<template>
    <div class="containers">
        <div class="headers">
          <el-input type="text" @keyup.enter="searchEvent" v-model="keyword" style="width: 200px; margin-left: 10px; margin-right: 10px; z-index: 999" placeholder="请输入剧本名称或微信昵称进行搜索"></el-input>
          <span class="btn" @click="searchEvent">搜索</span>
        </div>
        <div class="content">
            <el-table
            :data="eventList"
            border
            :header-cell-style="{
                'background-color': '#fafafa',
                'color': '#000'
            }"
            style="width: 100%">
                <el-table-column
                    prop="script"
                    label="剧本名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.script?scope.row.script.name: ''}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="hostUser"
                    label="创建者">
                    <template slot-scope="scope">
                        <span>{{scope.row.hostUser.nickName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="status2"
                    label="活动状态">
                </el-table-column>
                <el-table-column
                    prop="create_time"
                    label="创建时间">
                </el-table-column>
                <el-table-column
                    prop="start_time"
                    label="开始时间">
                </el-table-column>
                <el-table-column
                    prop="end_time"
                    label="结束时间">
                </el-table-column>
                <el-table-column
                    prop="price"
                    label="价格(元)">
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="showOrder(scope.row)" >查看订单</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="Pagination Pagination2" v-if="pageShow">
          <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :pager-count="5"
              :page-sizes="[10, 20, 25, 50, 100]"
              :page-size="10"
              :total = "total"
              layout="total, prev, pager, next"
              >
          </el-pagination>
        </div>
    </div>
</template>
<script>
import { allEvents, formatDate } from "../../api/api.js";

export default {
  data() {
    return {
      postData: {
        limit: 10,
        offset: 0
      },
      status: { status: ["ready", "cancelled", "completed"] },
      eventList: [],
      pagination: null,
      total: 0,
      pageShow: false,
      currentPage: 1,
      script: {},
      shop: {},
      keyword: ""
    };
  },
  mounted() {
    let status = encodeURIComponent(JSON.stringify(this.status));
    let data = {
      limit: 10,
      offset: 0,
      status: status
    };
    this.getEvents(data);
  },
  methods: {
    getEvents(data) {
      allEvents(data).then(res => {
        if (res.status == 200) {
          this.$message({
            type: "success",
            message: "获取数据成功!"
          });
          this.pageShow = true;
          let eventList = res.data.data;
          for (let i = 0; i < eventList.length; i++) {
            eventList[i].create_time = formatDate(
              new Date(eventList[i].createdAt)
            );
            eventList[i].start_time = formatDate(
              new Date(eventList[i].startTime)
            );
            eventList[i].end_time = formatDate(new Date(eventList[i].endTime));
            if (eventList[i].status == "ready") {
              eventList[i].status2 = "已成团";
            } else if (eventList[i].status == "cancelled") {
              eventList[i].status2 = "已解散";
            } else if (eventList[i].status == "completed") {
              eventList[i].status2 = "已完成";
            }
          }
          this.eventList = eventList;
          this.total = res.data.pagination.total;
        }
      });
    },
    handleSizeChange(val) {
      this.postData.limit = val;
      let status = encodeURIComponent(JSON.stringify(this.status));
      let data = {
        limit: val,
        offset: 0,
        status: status
      };
      if (this.keyword) {
        data.keyword = this.keyword;
      }
      this.getEvents(data);
    },
    handleCurrentChange(val) {
      this.postData.offset = (val - 1) * this.postData.limit;
      this.currentPage = val;
      let status = encodeURIComponent(JSON.stringify(this.status));
      let data = {
        limit: 10,
        offset: (val - 1) * this.postData.limit,
        status: status
      };
      if (this.keyword) {
        data.keyword = this.keyword;
      }
      this.getEvents(data);
    },
    // 查看活动的订单
    showOrder(item) {
      this.$common.setSessionStorage("eventId", item.id);
      this.$router.push("events_refund");
    },
    searchEvent() {
      let status = encodeURIComponent(JSON.stringify(this.status));
      let data = {
        limit: 10,
        offset: 0,
        status: status
      };
      data.keyword = this.keyword;
      this.getEvents(data);
    }
  }
};
</script>
<style lang="scss" scoped>
.headers {
  .btn {
    padding: 5px 10px;
    background-color: #559ef8;
    border-radius: 5px;
    cursor: pointer;
    color: #fff;
  }
}
.Pagination {
  float: right;
  margin-top: 15px;
}
</style>
