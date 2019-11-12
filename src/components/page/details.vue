<template>
    <div class="container">
        <div class="item">
            <div class="script_name">剧本:   <span class="name_">{{scripts.name}}</span></div>
        </div>
        <div class="shop item">
            <div class="shop_name">店名:   <span class="name_">{{shop.name}}</span></div>
        </div>
        <div class="startTime item">
            <div class="start_time">时间:   <span class="time_">{{startTime_2}}</span></div>
        </div>
        <div class="price item">
            <div class="script_price">价格:   <span class="price_">{{price}} 元/人</span></div>
        </div>
        <div class="process item">
            <div class="script_process">进度:   <span class="process_"><i>{{now}}</i> == <i>{{wait}}</i> </span></div>
        </div>
        <div class="host item">
            <div class="host_">发团人:   <span class="host_name">昵称: {{host_name}}</span> <span class="host_wechat">微信: <i class="i_host_wechat" v-clipboard:copy="host_wechat" v-clipboard:success="copyHost" v-clipboard:error="copyHostError">{{host_wechat}}</i></span></div>
        </div>
        <div class="host_mobile item">
            <div class="host_m">发团人手机号:   <span class="mobile">{{host_mobile}}</span></div>
        </div>
        <div class="joiner item">
            <div class="joiner_m">参团人:</div>
            <div class="joiners">
                <li v-for="item in joiners" :key="item.index">
                    <span class="nickName">昵称: <i class="niname">{{item.user.nickName}}</i> <i class="weixin" v-clipboard:copy="item.user.wechatId" v-clipboard:success="copyJoiner" v-clipboard:error="copyJoinerError">{{item.user.wechatId}}</i></span>
                </li>
            </div>
            <div style="clear: both"></div>
        </div>
        <div class="btns">
            <span class="nocallback" v-if="!status">返现</span>
            <span class="callback" v-if="status" @click="showCallBack">返现</span>
        </div>
        <div class="dialog_warp">
            <el-dialog
                title="返现详情"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
                <div class="content">
                    <li>总共返现: {{total}}元</li>
                    <li>发团人: {{host_name}} <i>{{hostBack}}元</i></li>
                    <li>
                        <div class="joiner_m">参团人:</div>
                        <div class="joiners">
                            <li v-for="item in allBacks" :key="item.index">
                                <span class="nickName">昵称: <i class="niname">{{item.nick}}</i> <i class="weixin">{{item.money}}元</i></span>
                            </li>
                        </div>
                        <div style="clear: both"></div>
                    </li>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
                </el-dialog>
        </div>
    </div>
</template>

<script>
import {
  showDetails,
  formatDate2,
  formatDate3,
  formatDate4
} from "../../api/api.js";
export default {
  data() {
    return {
      infomations: null,
      startTime_2: null,
      shop: {},
      scripts: {},
      price: "",
      now: "",
      wait: "",
      host_name: "",
      host_wechat: "",
      host_mobile: "",
      joiners: {},
      status: false,
      dialogVisible: false,
      commission: [],
      total: 0,
      hostBack: 0,
      joinerBack: 0,
      joinerBacks: 0,
      allBacks: []
    };
  },
  mounted() {
    let objectId = this.$common.getSessionStorage("objectId");
    this.getInfo(objectId);
  },
  methods: {
    getInfo(data) {
      showDetails(data).then(res => {
        if (res.status == 200) {
          this.$message({
            type: "success",
            message: "获取数据成功!"
          });
          this.infomations = res.data.data;
          this.shop = this.infomations.shop;
          this.scripts = this.infomations.script;
          this.startTime_2 =
            formatDate2(new Date(this.infomations.startTime)) +
            " " +
            formatDate4(new Date(this.infomations.startTime)) +
            " " +
            formatDate3(new Date(this.infomations.startTime));
          this.price = this.infomations.price;
          this.now =
            this.infomations.numberOfParticipators +
            this.infomations.numberOfOfflinePersons +
            "人";
          // 等待人数
          this.wait =
            "(" +
            this.infomations.minNumberOfAvailableSpots +
            "~" +
            this.infomations.maxNumberOfAvailableSpots +
            ")人";
          this.host_name = this.infomations.hostUser.nickName;
          this.host_wechat = this.infomations.hostUser.wechatId;
          this.host_mobile = this.infomations.hostUser.mobile;
          this.joiners = this.infomations.members;
          if (this.infomations.commissions.length > 0) {
            this.commission = this.infomations.commissions[0].commissions;
            let hostBack = this.commission.host;
            let joinerBack = this.commission.participators;
            this.hostBack = hostBack.amount;
            this.joinerBacks = joinerBack.length * joinerBack[0].amount;
            this.joinerBack = joinerBack[0].amount;
            this.total = this.hostBack + this.joinerBacks;
            for (let i = 0; i < joinerBack.length; i++) {
                for (let j = 0; j < this.joiners.length; j++) {
                    if (this.joiners[j].user.id == joinerBack[i].user) {
                        var data = {
                            nick: this.joiners[j].user.nickName,
                            money: joinerBack[0].amount
                        }
                        this.allBacks.push(data)
                    }
                }
            }
          }
          if (this.infomations.status == "completed") {
            this.status = true;
          } else {
            this.status = false;
          }
        } else {
          this.$message({
            type: "success",
            message: "系统错误!"
          });
        }
      });
    },
    copyHost(e) {
      if (e.text != undefined) {
        this.$message({
          type: "success",
          message: "发团人微信号 " + e.text + " 复制成功!"
        });
      }
    },
    copyHostError(e) {
      this.$message({
        type: "success",
        message: "发团人微信复制失败!"
      });
    },
    copyJoiner(e) {
      this.$message({
        type: "success",
        message: "参团人微信号 " + e.text + " 复制成功!"
      });
    },
    copyJoinerError(e) {
      this.$message({
        type: "success",
        message: "参团人微信复制失败!"
      });
    },
    showCallBack() {
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  .item {
    margin-bottom: 15px;
  }
  .process {
    .process_ {
      i {
        color: red;
        font-style: normal;
      }
    }
  }
  .host {
    .host_wechat {
      i {
        color: red;
        font-style: normal;
      }
    }
  }
  .host_mobile {
    .mobile {
      color: red;
    }
  }
  .joiner {
    .joiner_m {
      float: left;
    }
    .joiners {
      float: left;
      margin-left: 10px;
      .nickName {
        margin-bottom: 10px;
        display: inline-block;
        i {
          color: red;
          font-style: normal;
          margin-right: 10px;
        }
      }
    }
  }
  .btns {
    position: absolute;
    top: 15px;
    right: 15px;
    .callback {
      padding: 5px 10px;
      background-color: blue;
      color: #fff;
      cursor: pointer;
      border-radius: 5px;
    }
    .nocallback {
      padding: 5px 10px;
      background-color: grey;
      color: #fff;
      cursor: pointer;
      border-radius: 5px;
    }
  }
  .dialog_warp{
      .content{
          li{
                font-style: normal;
                list-style: none;
                margin-bottom: 10px;
              i{
                  color: red;
                  font-style: normal;
              }
              .joiner_m{
                  float: left;
              }
              .joiners{
                  float: left;
                  margin-left: 10px;
                  li{
                      font-style: normal;
                      .weixin{
                          margin-left: 10px;
                      }
                  }
              }
          }
      }
  }
}
</style>
