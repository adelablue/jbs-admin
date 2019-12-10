<template>
    <div class="refund">
        <div class="content">
            <el-table
            :data="refundsList"
            border
            :header-cell-style="{
                'background-color': '#fafafa',
                'color': '#000'
            }"
            style="width: 100%">
                <el-table-column
                    prop="outTradeNo"
                    label="订单号">
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
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary"  v-if="scope.row.orderStatus2 != '已退款'" @click="updateOrder(scope.row)">返现</el-button>
                        <el-button type="primary"  v-if="scope.row.orderStatus2 == '已退款'"  @click="updateOrder2(scope.row.orderStatus2)">返现</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import {
  eventOrder,
  formatDate,
  updateOrder,
  refundOrder
} from "../../api/api.js";

export default {
  data() {
    return {
      refundsList: [],
      pagination: null,
      total: 0,
      pageShow: false,
      currentPage: 1
    };
  },
  mounted() {
    let eventId = this.$common.getSessionStorage("eventId");
    this.getRefund(eventId);
  },
  methods: {
    getRefund(data) {
      eventOrder(data).then(res => {
        if (res.status == 200) {
          this.$message({
            type: "success",
            message: "获取数据成功!"
          });
        }
        this.pageShow = true;
        let refundsList = res.data.data;
        for (let i = 0; i < refundsList.length; i++) {
          console.log(refundsList[i])
          for (let j = 0; j < refundsList[i].refunds.length; j++) {
            if (
              refundsList[i].orderStatus == "paid" ||
              refundsList[i].orderStatus == "refund"
            ) {
              refundsList[i].amont2 = (refundsList[i].amount / 100).toFixed(2);
              refundsList[i].create_time = formatDate(
                new Date(refundsList[i].createdAt)
              );
              if (
                refundsList[i].orderStatus == "paid" &&
                refundsList[i].refunds.length == 0
              ) {
                refundsList[i].orderStatus2 = "已支付";
              } else if (
                refundsList[i].refunds.length > 0 &&
                refundsList[i].refunds[j].resultCode == "SUCCESS"
              ) {
                refundsList[i].orderStatus2 = "已退款";
              } else if (
                refundsList[i].orderStatus == "refund" &&
                refundsList[i].refunds[j].type == "refund" &&
                refundsList[i].refunds.length > 0
              ) {
                refundsList[i].orderStatus2 = "申请退款";
              } else if (
                refundsList[i].orderStatus == "paid" &&
                refundsList[i].refunds[j].status == "approved" &&
                refundsList[i].refunds.length > 0
              ) {
                refundsList[i].orderStatus2 = "退款中";
              } else if (
                refundsList[i].orderStatus == "refund" &&
                refundsList[i].refunds[j].status == "approved" &&
                refundsList[i].refunds.length > 0
              ) {
                refundsList[i].orderStatus2 = "退款中";
              } else if (
                refundsList[i].orderStatus == "refund" &&
                refundsList[i].refunds[j].resultCode == "SUCCESS" &&
                refundsList[i].refunds.length > 0
              ) {
                refundsList[i].orderStatus2 = "申请退款";
              } else if (
                refundsList[i].orderStatus == "paid" &&
                refundsList[i].refunds[j].type == "commission" &&
                refundsList[i].refunds.length > 0
              ) {
                refundsList[i].orderStatus2 = "待返现";
              }
              this.refundsList.push(refundsList[i]);
            }
          }
        }
      });
    },
    updateOrder(item) {
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
            message: "退款操作进行中!"
          });
        } else {
          this.$message({
            type: "error",
            message: "订单退款状态修改失败!"
          });
        }
      });
    },
    updateOrder2(item) {
      if (item == "已退款") {
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
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
