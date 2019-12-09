import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login',
        },
        {
            path: '/home',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '系统首页', requireAuth: true },
            children:[
                // 通知列表
                {
                    path: '/notifity',
                    component: resolve => require(['../components/page/notify.vue'], resolve),
                    meta: { title: '通知列表', requireAuth: true }
                },
                {
                    path: '/details',
                    component: resolve => require(['../components/page/details.vue'], resolve),
                    meta: { title: '消息详情', requireAuth: true }
                },
                {
                    path: '/orders',
                    component: resolve => require(['../components/page/orders.vue'], resolve),
                    meta: { title: '订单列表', requireAuth: true }
                },
                {
                    path: '/events',
                    component: resolve => require(['../components/page/events.vue'], resolve),
                    meta: { title: '活动列表', requireAuth: true }
                },
                {
                    path: '/events_refund',
                    component: resolve => require(['../components/page/ordersfund.vue'], resolve),
                    meta: { title: '活动订单', requireAuth: true }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
