<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#242f42"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs && item.show">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index"  :key="subItem.index">
                                <template slot="title">{{ subItem.title }}111</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from "../common/bus";
export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: "el-icon-s-grid",
          index: "0",
          title: "通知管理",
          show: true,
          roleType: ['admin'],
          subs: [
            {
              index: "notifity",
              title: "通知列表"
            }
          ]
        },
        {
          icon: "el-icon-tickets",
          index: "1",
          title: "活动管理",
          show: true,
          roleType: ['admin'],
          subs: [
            {
              index: "events",
              title: "活动列表"
            }
          ]
        },
        {
          icon: "el-icon-date",
          index: "2",
          title: "业务报表", 
          show: true,    
          roleType: ['admin','shopstaff'],                 
          subs: [
            {
              index: "buss_report",
              title: "订单报表"
            }
          ]
        }
      ],
      userInfo: {},
      roleType: ''
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
    this.userInfo = JSON.parse(this.$common.getSessionStorage("user"));
    this.roles = this.userInfo.roles;
    for(let i = 0; i < this.roles.length; i++) {
      if (this.roles[i] == '5da33b6c78dc3d815895803b') {
        this.roleType = 'shopstaff'
        this.$router.push("/buss_report");        
        for (let i = 0; i < this.items.length; i++) {
          this.items[i].show = false
          for (let j = 0; j < this.items[i].roleType.length; j++) {
            if (this.roleType == this.items[i].roleType[j]) {
              this.items[i].show = true
            }
          }
        }
      } 
      if (this.roles[i] == '5d7f8cc124f808a2e89d6aeb') {
        this.roleType = 'admin'
        this.$router.push("/notifity");        
         for (let i = 0; i < this.items.length; i++) {
            this.items[i].show = true
        }
      }
    }
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
