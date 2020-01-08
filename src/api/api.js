import axios from 'axios'
import moment from 'moment'
/**
 * 
 * @param 登录接口
 */
const API_PREFIX = process.env.NODE_ENV === 'development' ? '' : '/api';

export function login(data) {
    return axios.post(`${API_PREFIX}/auth/login`, data)
}
/**
 * 获取所有的notify
 */
export function getAllNotify(data) {
    let query = `&audience=${data.audience}`
    if (data.eventType) {
        query += `&eventType=${data.eventType}`        
    }
    if (data.message) {
        query += `&message=${data.message}`                
    }
    return axios.get(`${API_PREFIX}/notifications?offset=${data.offset}&limit=${data.limit}` + query)
}
/** 
 * 通过查询获取notify
 */
export function getNotifyBySearch(data) {
    return axios.get(`${API_PREFIX}/notifications?offset=${data.offset}&limit=${data.limit}&event_type=${data.event_type}&wechat=${data.wechat}`)
}
/**
 * 查看详细的notify
 */
export function checkAllNotify(data, body) {
    return axios.put(`${API_PREFIX}/notifications/` + data.serialNumber, body)
}

/** 
 * 查看消息详情
 */
export function showDetails(data) {
    return axios.get(`${API_PREFIX}/events/${data}/simplified`)
}

/** 
 * 获取所有的订单
 */
export function getOrders(data) {
    let query = ``
    if (data.tradeNo) {
        query += `&tradeNo=${data.tradeNo}`        
    }
    return axios.get(`${API_PREFIX}/orders?offset=${data.offset}&limit=${data.limit}` + query)
}

/** 
 * 更新订单状态
 */
export function updateOrder(data, body) {
    return axios.put(`${API_PREFIX}/orders/${data.orderId}/refund/${data.refundId}`, body)
}

/** 
 * 退款
 */
export function refundOrder(data) {
    const API_PREFIX = process.env.NODE_ENV === 'development' ? '' : '/api';
    return axios.post(`${API_PREFIX}/orders/refund`)
}

/** 
 * 获取所有的活动列表
 */
export function allEvents(data) {
    let query = `&sort=%7B%22createdAt%22%3A+-1%7D&filter=${data.status}`
    if (data.keyword) {
        query += `&keyword=${data.keyword}`
    }
    return axios.get(`${API_PREFIX}/events?offset=${data.offset}&limit=${data.limit}` + query)
}
/** 
 * 查看该活动的订单
 */
export function eventOrder(eventIds) {
    return axios.get(`${API_PREFIX}/events/${eventIds}/orders`)
}

/** 
 * 获取所有的业务报表
 */
export function allReports(data) {
    return axios.get(`${API_PREFIX}/reports/events?offset=${data.offset}&limit=${data.limit}&shopName=${data.shopName}&fromDate=${data.fromDate}&toDate=${data.toDate}`)
}

/**
 * 通用方法
 */
// 将时间戳转化为时间格式

function add0(m) { return m < 10 ? '0' + m : m }
export function formatDate(datetime) {
    // 获取年月日时分秒值  slice(-2)过滤掉大于10日期前面的0
    var time = new Date(datetime);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}
export function formatDate2(datetime) {
    // 获取年月日时分秒值  slice(-2)过滤掉大于10日期前面的0
    var time = new Date(datetime);
    var m = time.getMonth() + 1;
    var d = time.getDate();
    return  add0(m) + '-' + add0(d);
}
export function formatDate3(datetime) {
    // 获取年月日时分秒值  slice(-2)过滤掉大于10日期前面的0
    var time = new Date(datetime);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return  add0(h) + ':' + add0(mm);
}
export function formatDate4(datetime) {
    var week = moment(datetime).format('E');
    var day = ""
    switch (week) {
        case '0':
            day = "周日";
            break;
        case '1':
            day = "周一";
            break;
        case '2':
            day = "周二";
            break;
        case '3':
            day = "周三";
            break;
        case '4':
            day = "周四";
            break;
        case '5':
            day = "周五";
            break;
        case '6':
            day = "周六";
            break;
    }
    return '(' + day + ')'
}
//  判断字符串长度 包括中英文
export function strlen(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1   
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            len++;
        }
        else {
            len += 2;
        }
    }
    return len;
}

