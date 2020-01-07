<template>
    <div class="containers">  
        <div class="headers">
          <el-input type="text" clearable @keyup.enter="searchEvent" v-model="shopName" style="width: 200px; margin-left: 10px; margin-right: 10px" placeholder="请输入店家进行搜索"></el-input>
          <div class="add_content2">
            <el-date-picker
                v-model="beginTime"
                type="datetime"
                clearable
                @blur="selectStart"
                value-format="yyyy-MM-dd"
                placeholder="开始时间"
                default-time="00:00:00">
            </el-date-picker>
            <el-date-picker
                v-model="endTime"
                type="datetime"
                clearable
                @blur="selectStart2"
                value-format="yyyy-MM-dd"
                placeholder="结束时间"
                default-time="00:00:00">
            </el-date-picker>
            </div>
          <span class="btn" @click="searchEvent">搜索</span>
          <span class="btn" @click="handleExport">导出</span>
          
        </div>
        <div class="content">
          <el-table
            border
            :data="reportList"
            :header-cell-style="{
              'background-color': '#ccc',
              'color': '#000'
            }"
            style="width: 100%">
            <el-table-column
              prop="script"
              label="剧本名称">
            </el-table-column>
            <el-table-column
                prop="hostUser"
                label="发车人">
            </el-table-column>
            <el-table-column
                prop="hostWechat"
                label="发车人微信">
            </el-table-column>
            <el-table-column
                prop="status2"
                width="100"
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
                prop="person"
                label="人数">
            </el-table-column>
             <el-table-column
                prop="amount"
                label="总金额">
            </el-table-column>
            <el-table-column
                prop="back"
                label="总返现">
            </el-table-column>
            <el-table-column
                prop="supportPayment"
                label="支持支付?">
            </el-table-column>
          </el-table>
        </div>
        <div class="Pagination" v-if="pageShow">
          <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
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
import { formatDate, allReports } from "../../api/api.js";
export default {
  data() {
    return {
      postData: {
        limit: 10,
        offset: 0,
        shopName: "梧桐树",
        fromDate: "2019-12-09",
        toDate: "2019-12-31"
      },
      reportList: [],
      pagination: null,
      total: 0,
      pageShow: false,
      currentPage: 1,
      shopName: "",
      beginTime: "",
      endTime: "",
      fromDate: "",
      toDate: "",
      excelData: [],
      allList: [],
      temList: []
    };
  },
  mounted() {
    let data = {
      limit: 10,
      offset: 0,
      shopName: "梧桐树",
      fromDate: "2019-12-01",
      toDate: "2019-12-31"
    };
    if (this.$common.getSessionStorage("currentPage_report")) {
      data.offset =
        (this.$common.getSessionStorage("currentPage_report") - 1) *
        this.postData.limit;
      this.currentPage = Number(
        this.$common.getSessionStorage("currentPage_report")
      );
    }
    if (this.$common.getSessionStorage("shopName")) {
      data.shopName = this.$common.getSessionStorage("shopName");
      this.shopName = this.$common.getSessionStorage("shopName");
    } else {
      this.shopName = data.shopName
    }
    if (this.$common.getSessionStorage("fromDate")) {
      data.fromDate = this.$common.getSessionStorage("fromDate");
      this.fromDate = this.$common.getSessionStorage("fromDate");
      this.beginTime = this.fromDate;
    } else {
      this.beginTime = data.fromDate
      this.fromDate = data.fromDate
      
    }
    if (this.$common.getSessionStorage("toDate")) {
      data.toDate = this.$common.getSessionStorage("toDate");
      this.toDate = this.$common.getSessionStorage("toDate");
      this.endTime = this.toDate;
    } else {
      this.endTime = data.toDate
      this.toDate = data.toDate
    }
    this.getAllReports(data);
  },
  methods: {
    getAllReports(data) {
      allReports(data).then(res => {
        if (res.status == 200) {
          let reportList = res.data.data;
          let alllback = 0;
          this.pageShow = true
          this.reportList = [];
          this.total = res.data.pagination.total.total;
          for (let i = 0; i < reportList.length; i++) {
            if (reportList[i].commissions.length == 0) {
              alllback = 0;
            } else {
              let host = reportList[i].commissions[0].commissions.host;
              let participators =
                reportList[i].commissions[0].commissions.participators;
              let host_back = Number(host.amount);
              let joiner_back = Number(
                participators.length * participators[0].amount
              );
              alllback = host_back + joiner_back;
            }
            if (reportList[i].status == "cancelled") {
              reportList[i].status2 = "已取消";
            } else if (reportList[i].status == "completed") {
              reportList[i].status2 = "已锁场";
            } else if (reportList[i].status == "expried") {
              reportList[i].status2 = "已过期";
            } else if (reportList[i].status == "ready") {
              reportList[i].status2 = "组团中";
            }
            var res = {
              script: reportList[i].scriptObj.name,
              hostUser: reportList[i].hostUserObj.nickName,
              hostWechat: reportList[i].hostUserObj.wechatId,
              create_time: formatDate(new Date(reportList[i].createdAt)),
              start_time: formatDate(new Date(reportList[i].startTime)),
              end_time: formatDate(new Date(reportList[i].endTime)),
              price: reportList[i].price,
              person: reportList[i].members.length,
              status2: reportList[i].status2,
              amount: (
                Number(reportList[i].price) *
                Number(reportList[i].members.length)
              ).toFixed(2),
              back: Number(alllback).toFixed(2),
              complete: Number(
                Number(reportList[i].price) *
                  Number(reportList[i].members.length) -
                  alllback
              ).toFixed(2),
              supportPayment: reportList[i].supportPayment ? '是' : '否'
            };
            this.reportList.push(res);
          }
        }
      });
    },
    // 根据时间选择
    selectStart() {
      if (this.beginTime == "" || this.beginTime == null) {
        this.fromDate = "";
      } else {
        this.fromDate = this.beginTime;
      }
    },
    selectStart2() {
      if (this.endTime == "" || this.endTime == null) {
        this.toDate = "";
      } else {
        this.toDate = this.endTime;
      }
    },
    searchEvent() {
      let data = {
        limit: this.postData.limit,
        offset: this.postData.offset,
        shopName: this.shopName,
        fromDate: this.fromDate,
        toDate: this.toDate
      };
      if (this.shopName) {
        this.$common.setSessionStorage("shopName", this.shopName);
      }
      if (this.fromDate) {
        this.$common.setSessionStorage("fromDate", this.fromDate);
      }
      if (this.toDate) {
        this.$common.setSessionStorage("toDate", this.toDate);
      }
      this.getAllReports(data);
    },
    handleSizeChange(val) {
      this.postData.limit = val;
      let data = {
        limit: val,
        offset: 0,
        shopName: "梧桐树",
        fromDate: "2019-12-01",
        toDate: "2019-12-31"
      };
      if (this.shopName) {
        data.shopName = this.shopName;
        this.$common.setSessionStorage("shopName", this.shopName);
      }
      if (this.fromDate) {
        data.fromDate = this.fromDate;
        this.$common.setSessionStorage("fromDate", this.fromDate);
      }
      if (this.toDate) {
        data.toDate = this.toDate;
        this.$common.setSessionStorage("toDate", this.toDate);
      }
      this.getAllReports(data);
    },
    handleCurrentChange(val) {
      this.postData.offset = (val - 1) * 10;
      this.currentPage = val;
      this.$common.setSessionStorage("currentPage_report", this.currentPage);
      let data = {
        limit: 10,
        offset: (val - 1) * 10,
        shopName: "梧桐树",
        fromDate: "2019-12-01",
        toDate: "2019-12-31"
      };
      if (this.shopName) {
        data.shopName = this.shopName;
        this.$common.setSessionStorage("shopName", this.shopName);
      }
      if (this.fromDate) {
        data.fromDate = this.fromDate;
        this.$common.setSessionStorage("fromDate", this.fromDate);
      }
      if (this.toDate) {
        data.toDate = this.toDate;
        this.$common.setSessionStorage("toDate", this.toDate);
      }
      this.getAllReports(data);
    },
    handleExport() {
      this.$confirm("此操作将导出excel文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.excelData = this.reportList;
          this.export2Excel();
        })
        .catch(() => {});
    },
    async export2Excel() {
      this.allList = [];
      let count = this.total;
      let page_size = Math.ceil(count / 10);
      let shopName = ''
      let fromDate = ''
      let toDate   = ''
      if(this.shopName) {
        shopName = this.shopName
      } else {
        shopName = this.postData.shopName
      }
      if(this.fromDate) {
        fromDate = this.fromDate
      } else {
        fromDate = this.postData.fromDate
      }
      if(this.toDate) {
        toDate = this.toDate
      } else {
        toDate = this.postData.toDate
      }
      for (let i = 0; i <= page_size; i++) {
        var data = {
          limit: 10,
          offset: i * 10 ,
          shopName: shopName,
          fromDate: fromDate,
          toDate: toDate
        };
        var res = await allReports(data).then(res => {
          if (res.status == 200) {
            let allList = res.data.data;
            if (allList == null) {
              this.allList = [];
            } else {
              this.allList = this.allList.concat(allList);
            }
          } else {
            this.$message({
              type: "error",
              message: "生成Excel失败!"
            });
          }
        });
      }
      this.exportExcel(this.allList);
    },
    exportExcel(data) {
      this.temList = data;
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require("../../vendor/Export2Excel.js");
        const tHeader = [
          "剧本名称",
          "发车人",
          "发车人微信",
          "活动状态",
          "创建时间",
          "开始时间",
          "结束时间",
          "活动单价",
          "活动人数",
          "总金额",
          "总返现",
          "结算金额",
          "支持支付"
        ];
        const filterVal = [
          "script",
          "hostUser",
          "hostWechat",
          "status",
          "create_time",
          "start_time",
          "end_time",
          "price",
          "person",
          "amount",
          "back",
          "complete",
          "supportPayment"
        ];
        let exportData = [];
        let alllback = 0;
        const reportList = this.temList; //把data里的tableData存到list
        for (let i = 0; i < reportList.length; i++) {
          if (reportList[i].commissions.length == 0) {
            alllback = 0;
          } else {
            let host = reportList[i].commissions[0].commissions.host;
            let participators =
              reportList[i].commissions[0].commissions.participators;
            let host_back = Number(host.amount);
            let joiner_back = Number(
              participators.length * participators[0].amount
            );
            alllback = host_back + joiner_back;
          }
          if (reportList[i].status == "cancelled") {
            reportList[i].status2 = "已取消";
          } else if (reportList[i].status == "completed") {
            reportList[i].status2 = "已锁场";
          } else if (reportList[i].status == "expried") {
            reportList[i].status2 = "已过期";
          } else if (reportList[i].status == "ready") {
            reportList[i].status2 = "组团中";
          }
          var res = {
            script: reportList[i].scriptObj.name,
            hostUser: reportList[i].hostUserObj.nickName,
            hostWechat: reportList[i].hostUserObj.wechatId,
            create_time: formatDate(new Date(reportList[i].createdAt)),
            start_time: formatDate(new Date(reportList[i].startTime)),
            end_time: formatDate(new Date(reportList[i].endTime)),
            price: reportList[i].price,
            person: reportList[i].members.length,
            status: reportList[i].status2,
            amount: (
              Number(reportList[i].price) * Number(reportList[i].members.length)
            ).toFixed(2),
            back: Number(alllback).toFixed(2),
            complete: Number(
              Number(reportList[i].price) *
                Number(reportList[i].members.length) -
                alllback
            ).toFixed(2),
            supportPayment: reportList[i].supportPayment ? '是' : '否'
          };
          exportData.push(res);
        }
        const data = this.formatJson(filterVal, exportData);
        export_json_to_excel(tHeader, data, this.shopName + "活动结算");
        this.$message({
          type: "success",
          message: "Excel导出成功!"
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  }
};
</script>
<style lang="scss" scoped>
.containers {
  .headers {
    .add_content2 {
      float: left;
    }
    .btn {
      background-color: #559ef8;
      padding: 5px 10px;
      border-radius: 5px;
      cursor: pointer;
      color: #fff;
    }
  }
}
.Pagination {
  float: right;
  margin-top: 15px;
}
</style>
