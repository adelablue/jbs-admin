<template>
    <div class="containers">
        <div class="headers">
          <el-input type="text" clearable @keyup.enter="searchEvent" v-model="keyword" style="width: 200px; margin-left: 10px; margin-right: 10px; z-index: 999" placeholder="请输入剧本名称或微信昵称进行搜索"></el-input>
          <span class="btn" @click="searchEvent">搜索</span>
        </div>
        <div class="content">
            <el-table
              :data="eventList"
              border
              v-loading="loading"
              :header-cell-style="{
                  'background-color': '#ccc',
                  'color': '#000'
              }"
              :row-key="getRowKeys"  
              :expand-row-keys="expands"    
              @expand-change="toggleRowExpansion"            
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
                    width="180"
                    type="expand"
                    label="查看订单">
                    <template>
                      <el-table
                      :data="refundsList"
                      border
                      :header-cell-style="{
                        'background-color': '#fafafa',
                        'color': '#000'
                      }"
                      style="width: 100%; padding: 0">
                        <el-table-column
                          prop="outTradeNo"
                          width="350"
                          label="订单号">
                          <template slot-scope="scope">
                            <span>{{scope.row.outTradeNo}}</span>
                          </template>
                        </el-table-column>
                          <el-table-column
                            prop="refundDesc"
                            label="返现描述">
                          </el-table-column>
                          <el-table-column
                            prop="create_time"
                            label="创建时间">
                          </el-table-column>
                          <el-table-column
                            prop="amont2"
                            label="价格(元)">
                          </el-table-column>
                          <el-table-column
                            prop="orderStatus2"
                            label="订单状态">
                          </el-table-column>
                          <el-table-column
                            prop="returnMsg"
                            label="状态描述">
                            <template slot-scope="scope">
                                <span type="primary"  v-if="scope.row.returnMsg">{{scope.row.returnMsg}}</span>
                            </template>
                          </el-table-column>
                          <el-table-column
                            label="操作">
                            <template slot-scope="scope">
                              <el-button type="primary"  v-if="scope.row.orderStatus2 == '创建返现' || scope.row.orderStatus2 == '可返现'" @click="getRefunds(scope.row)">返现</el-button>
                              <el-button type="primary"  v-if="scope.row.status == 'failed'" @click="getRefunds(scope.row)">再次尝试</el-button>
                              <el-button type="primary"  v-else disabled>返现</el-button>
                            </template>
                          </el-table-column>
                      </el-table>
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
import {
  allEvents,
  formatDate,
  eventOrder,
  updateOrder
} from "../../api/api.js";

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
      keyword: "",
      refundsList: [],
      haveRefund: false,
      loading: false,
      expands: [],
      getRowKeys: row => {
        return row.id;
      }
    };
  },
  mounted() {
    let status = encodeURIComponent(JSON.stringify(this.status));
    let data = {
      limit: 10,
      offset: 0,
      status: status
    };
    if (this.$common.getSessionStorage('currentPage')) {
      data.offset = (this.$common.getSessionStorage('currentPage')  - 1) * this.postData.limit
      this.currentPage = Number(this.$common.getSessionStorage('currentPage'))
    }
    if (this.$common.getSessionStorage('keyword')) {
      data.keyword = this.$common.getSessionStorage('keyword');
      this.keyword = this.$common.getSessionStorage('keyword');
    }
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
        this.$common.setSessionStorage('keyword', this.keyword)        
      }
      this.getEvents(data);
    },
    handleCurrentChange(val) {
      this.postData.offset = (val - 1) * this.postData.limit;
      this.currentPage = val;
      this.$common.setSessionStorage('currentPage', this.currentPage)
      let status = encodeURIComponent(JSON.stringify(this.status));
      let data = {
        limit: 10,
        offset: (val - 1) * this.postData.limit,
        status: status
      };
      if (this.keyword) {
        data.keyword = this.keyword;
        this.$common.setSessionStorage('keyword', this.keyword)
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
      this.$common.setSessionStorage('keyword', this.keyword)
      this.getEvents(data);
    },
    toggleRowExpansion(row, rowList) {
      var that = this;
      if (rowList.length) {
        that.expands = [];
        if (row) {
          that.expands.push(row.id);
          that.refundsList = []
          eventOrder(row.id).then(res => {
            if (res.status == 200) {
              let refundsList = []
              refundsList = res.data.data;
              that.haveRefund = true;
              for (let i = 0; i < refundsList.length; i++) {
                for (let j = 0; j < refundsList[i].refunds.length; j++) {
                  refundsList[i].refunds[j].amont2 = (
                    refundsList[i].refunds[j].refundAmount / 100
                  ).toFixed(2);
                  refundsList[i].refunds[j].create_time = formatDate(
                    new Date(refundsList[i].refunds[j].createdAt)
                  );
                  if (refundsList[i].refunds[j].status == "created") {
                    refundsList[i].refunds[j].orderStatus2 = "创建返现";
                  }
                  if (refundsList[i].refunds[j].status == "refund") {
                    refundsList[i].refunds[j].orderStatus2 = "可返现";
                  }
                  if (
                    refundsList[i].refunds[j].status == "refund" &&
                    refundsList[i].refunds[j].resultCode == "SUCCESS"
                  ) {
                    refundsList[i].refunds[j].orderStatus2 = "已返现";
                  }
                  if (refundsList[i].refunds[j].status == "approved") {
                    refundsList[i].refunds[j].orderStatus2 = "返现中";
                  }
                  if (refundsList[i].refunds[j].status == "failed") {
                    refundsList[i].refunds[j].orderStatus2 = "返现失败";
                  }
                  refundsList[i].refunds[j].order_id = refundsList[i].id;
                  that.refundsList.push(refundsList[i].refunds[j]);
                }
              }
            }
          });
        }
      } else {
        // 说明收起了
        that.expands = [];
      }
    },
    getRefunds(item) {
      if (item.refundStatus2 == "已退款") {
        this.$message({
          type: "error",
          message: "~@o@~ 已退款的订单不能退款哦! ~@o@~ "
        });
        return false;
      }
      if (item.orderStatus == "paid" && item.refunds.length == 0) {
        this.$message({
          type: "error",
          message: "~@o@~ 未申请退款的订单不能退款哦! ~@o@~ "
        });
        return false;
      }
      let data = {
        orderId: item.order,
        refundId: item.id
      };
      let body = {
        status: "approved"
      };
      updateOrder(data, body).then(res => {
        if (res.status == 200) {
          this.$message({
            type: "success",
            message: "退款操作进行中!"
          });
        } else {
          this.$message({
            type: "error",
            message: "订单退款状态修改失败!"
          });
        }
      });
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
