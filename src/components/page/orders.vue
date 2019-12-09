<template>
    <div class="container">
       <div class="search">
            <el-input  placeholder="输入订单号查询" v-model="searId" @keyup.enter.native="searchOrder" clearable></el-input>
       </div>
        <div class="content">
            <el-table
            :data="ordersList"
            border
            :header-cell-style="{
                'background-color': '#fafafa',
                'color': '#000'
            }"
            style="width: 100%">
            <el-table-column
                prop="outTradeNo"
                label="订单号">
                <template slot-scope="scope">
                    <span>{{scope.row.outTradeNo}}</span>
                    <span class="i_host_wechat" v-clipboard:copy="scope.row.outTradeNo" v-clipboard:success="copyOrderS" v-clipboard:error="copyOrderE">复制</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="money"
                label="金额(元)">
            </el-table-column>
            <el-table-column
                prop="orderStatus2"
                label="订单状态">
            </el-table-column>
            <el-table-column
                prop="refundStatus"
                label="退款状态">
            </el-table-column>
            <el-table-column
                prop="type2"
                label="类型">
            </el-table-column>
            <el-table-column
                prop="create_time"
                label="创建时间">
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="update(scope.row)" v-if="scope.row.refundStatus4 != 'success'">更新状态</el-button>
                    <el-button type="primary" style="width: 80px" v-if="scope.row.refundStatus4 == 'success'">已退款</el-button>
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
        <div style="clear: both"></div>
    </div>
</template>

<script>
import {
  getOrders,
  formatDate,
  updateOrder,
  refundOrder
} from "../../api/api.js";

export default {
  data() {
    return {
      ordersList: [],
      links: null,
      pagination: null,
      pageShow: false,
      total: 0,
      currentPage: 1,
      postData: {
        limit: 10,
        offset: 0
      },
      searId: ""
    };
  },
  created() {
    this.getAllOrders(this.postData);
  },
  methods: {
    getAllOrders(data) {
      getOrders(data).then(res => {
        if (res.status == 200) {
          this.$message({
            type: "success",
            message: "获取数据成功!"
          });
          this.pageShow = true;
          let ordersList = res.data.data;
          for (let i = 0; i < ordersList.length; i++) {
            ordersList[i].money = ordersList[i].amount / 100;
            ordersList[i].create_time = formatDate(
              new Date(ordersList[i].createdAt)
            );
            ordersList[i].orderStatus = ordersList[i].orderStatus;
            if (ordersList[i].orderStatus == "paid") {
              ordersList[i].orderStatus2 = "已支付";
            } else if (ordersList[i].orderStatus == "unpaid") {
              ordersList[i].orderStatus2 = "未支付";
            } else if (ordersList[i].orderStatus == "refund") {
              ordersList[i].orderStatus2 = "申请退款";
            } else if (ordersList[i].orderStatus == "created") {
              ordersList[i].orderStatus2 = "创建订单";
            } else if (ordersList[i].orderStatus == "approved") {
              ordersList[i].orderStatus2 = "待退款";
            } else if (ordersList[i].orderStatus == "failed") {
              ordersList[i].orderStatus2 = "退款失败";
            }
            if (ordersList[i].type == "event_created") {
              ordersList[i].type2 = "创建活动";
            } else if (ordersList[i].type == "event_join") {
              ordersList[i].type2 = "参与活动";
            } else if (ordersList[i].type == "event_completed") {
              ordersList[i].type2 = "活动完成";
            }
            if (ordersList[i].refunds.length > 0) {
              if (ordersList[i].refunds[0].status == "refund") {
                ordersList[i].refundStatus = "退款成功";
                ordersList[i].refundStatus2 = "success";
                ordersList[i].refundStatus4 = "success";
              } else if (ordersList[i].refunds[0].status == "created") {
                ordersList[i].refundStatus = "申请退款";
                ordersList[i].refundStatus5 = "success";
              } else if (ordersList[i].refunds[0].status == "approved") {
                ordersList[i].refundStatus = "退款审核";
              } else if (ordersList[i].refunds[0].status == "failed") {
                ordersList[i].refundStatus = "状态错误";
              }
            } else {
              ordersList[i].refundStatus = "未申请";
            }
          }

          this.links = res.data.links;
          this.pagination = res.data.pagination;
          this.total = this.pagination.total;
          this.ordersList = ordersList;
        }
      });
    },
    handleSizeChange(val) {
      this.postData.limit = val;
      this.getAllOrders(this.postData);
    },
    handleCurrentChange(val) {
      this.postData.offset = (val - 1) * this.postData.limit;
      this.currentPage = val;
      this.getAllOrders(this.postData);
    },
    searchOrder() {
      this.postData.tradeNo = this.searId;
      this.getAllOrders(this.postData);
    },
    update(item) {
      if (item.orderStatus == "created") {
        this.$message({
          type: "error",
          message: "~@o@~ 未解散的团不能更改状态! ~@o@~ "
        });
        return;
      }
      let data = {
        orderId: item.id,
        refundId: item.refunds[0].id
      };
      let body = {
        status: "approved"
      };
      updateOrder(data, body).then(res => {
        if (res.status == 200) {
          this.$message({
            type: "success",
            message: "订单状态修改成功!"
          });
          this.getAllOrders(this.postData);
        } else {
          this.$message({
            type: "error",
            message: "订单状态修改失败!"
          });
        }
      });
    },
    update2() {
      console.log(222);
    },
    torefund() {
      refundOrder().then(res => {
        if (res.status == 200) {
          this.$message({
            type: "success",
            message: "退款操作已完成!"
          });
          this.getAllOrders(this.postData);
        }
      });
    },
    torefund2() {
      this.$message({
        type: "error",
        message: "该订单暂不支持退款!"
      });
    },
    copyOrderS(e) {
      if (e.text != undefined) {
        this.$message({
          type: "success",
          message: "订单号 " + e.text + " 复制成功!"
        });
      }
    },
    copyOrderE(e) {
      this.$message({
        type: "success",
        message: "订单号复制失败!"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.i_host_wechat {
  padding: 4px 8px;
  border-radius: 2px;
  background-color: #409eff;
  color: #ffffff;
  cursor: pointer;
  float: right;
}
.search {
  width: 300px;
  margin-bottom: 15px;
}
.content {
  padding: 0;
}
.Pagination {
  margin-top: 25px;
  float: right;
}
</style>
