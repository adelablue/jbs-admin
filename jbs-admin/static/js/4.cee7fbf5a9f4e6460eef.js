webpackJsonp([4],{"0mGQ":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=r("P9l9"),a={data:function(){return{refundsList:[],pagination:null,total:0,pageShow:!1,currentPage:1}},mounted:function(){var e=this.$common.getSessionStorage("eventId");this.getRefund(e)},methods:{getRefund:function(e){var t=this;Object(s.c)(e).then(function(e){200==e.status&&t.$message({type:"success",message:"获取数据成功!"}),t.pageShow=!0;for(var r=e.data.data,a=0;a<r.length;a++){console.log(r[a]);for(var n=0;n<r[a].refunds.length;n++)"paid"!=r[a].orderStatus&&"refund"!=r[a].orderStatus||(r[a].amont2=(r[a].amount/100).toFixed(2),r[a].create_time=Object(s.d)(new Date(r[a].createdAt)),"paid"==r[a].orderStatus&&0==r[a].refunds.length?r[a].orderStatus2="已支付":r[a].refunds.length>0&&"SUCCESS"==r[a].refunds[n].resultCode?r[a].orderStatus2="已退款":"refund"==r[a].orderStatus&&"refund"==r[a].refunds[n].type&&r[a].refunds.length>0?r[a].orderStatus2="申请退款":"paid"==r[a].orderStatus&&"approved"==r[a].refunds[n].status&&r[a].refunds.length>0?r[a].orderStatus2="退款中":"refund"==r[a].orderStatus&&"approved"==r[a].refunds[n].status&&r[a].refunds.length>0?r[a].orderStatus2="退款中":"refund"==r[a].orderStatus&&"SUCCESS"==r[a].refunds[n].resultCode&&r[a].refunds.length>0?r[a].orderStatus2="申请退款":"paid"==r[a].orderStatus&&"commission"==r[a].refunds[n].type&&r[a].refunds.length>0&&(r[a].orderStatus2="待返现"),t.refundsList.push(r[a]))}})},updateOrder:function(e){var t=this;if("已退款"==e.refundStatus2)return this.$message({type:"error",message:"~@o@~ 已退款的订单不能退款哦! ~@o@~ "}),!1;if("paid"==e.orderStatus&&0==e.refunds.length)return this.$message({type:"error",message:"~@o@~ 未申请退款的订单不能退款哦! ~@o@~ "}),!1;var r={orderId:e.id,refundId:e.refunds[0].id};Object(s.m)(r,{status:"approved"}).then(function(e){200==e.status?t.$message({type:"success",message:"退款操作进行中!"}):t.$message({type:"error",message:"订单退款状态修改失败!"})})},updateOrder2:function(e){return"已退款"==e?(this.$message({type:"error",message:"~@o@~ 已退款的订单不能退款哦! ~@o@~ "}),!1):"paid"==e.orderStatus&&0==e.refunds.length?(this.$message({type:"error",message:"~@o@~ 未申请退款的订单不能退款哦! ~@o@~ "}),!1):void 0}}},n={render:function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"refund"},[r("div",{staticClass:"content"},[r("el-table",{staticStyle:{width:"100%"},attrs:{data:e.refundsList,border:"","header-cell-style":{"background-color":"#fafafa",color:"#000"}}},[r("el-table-column",{attrs:{prop:"outTradeNo",label:"订单号"}}),e._v(" "),r("el-table-column",{attrs:{prop:"create_time",label:"创建时间"}}),e._v(" "),r("el-table-column",{attrs:{prop:"amont2",label:"价格(元)"}}),e._v(" "),r("el-table-column",{attrs:{prop:"orderStatus2",label:"订单状态"}}),e._v(" "),r("el-table-column",{attrs:{label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return["已退款"!=t.row.orderStatus2?r("el-button",{attrs:{type:"primary"},on:{click:function(r){return e.updateOrder(t.row)}}},[e._v("返现")]):e._e(),e._v(" "),"已退款"==t.row.orderStatus2?r("el-button",{attrs:{type:"primary"},on:{click:function(r){return e.updateOrder2(t.row.orderStatus2)}}},[e._v("返现")]):e._e()]}}])})],1)],1)])},staticRenderFns:[]};var u=r("VU/8")(a,n,!1,function(e){r("jugv")},"data-v-703dcd39",null);t.default=u.exports},jugv:function(e,t){}});