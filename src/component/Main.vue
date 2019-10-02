<!-- 导航 -->
<template>
    <div>
        <div class="head">
        <h1>资产管理系统</h1>
        <div class="head-right">
          <img class="avatar" src="
https://teenyda-blog.oss-cn-shenzhen.aliyuncs.com/blog-image/u%3D558219988%2C3903772744%26fm%3D26%26gp%3D0.jpg" />
          <el-button type="info" size="small" @click="loginout">退出</el-button>
        </div>
    </div>
      <el-col :span="4">
      <div class="body">
        <!-- <h5>自定义颜色</h5> -->

        <!-- :default-openeds="openeds" -->
        <el-menu
          :default-active="$route.path"
          router
          :unique-opened="true"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#304156"
          active-text-color="#fff"
          text-color="#909399">

          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-tickets"></i>
              <span>资产管理</span>
            </template>

            <el-menu-item-group class="over-hide">
              <!-- <template slot="title">分组一</template> -->
              <el-menu-item index="/assetsStorage">
                资产入库
              </el-menu-item>

              <el-menu-item index="/assetsBorrow">
                资产借用
              </el-menu-item>

              <el-menu-item index="/assetsReturn">
                资产归还
              </el-menu-item>

              <el-menu-item index="/assetsRetirement">
                资产报废
              </el-menu-item>

            </el-menu-item-group>
          </el-submenu>

          <!-- 资产类别 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>资产类别</span>
            </template>
            <el-menu-item-group class="over-hide">
              <el-menu-item index="/assetsClassManager">
                类别管理
                </el-menu-item>
              <el-menu-item index="/assetsClassRetirement">
                类别报废
              </el-menu-item>
            </el-menu-item-group>
        </el-submenu>

        <el-menu-item index="/brand">
              <i class="el-icon-info"></i>
              <span slot="title">品牌</span>
          </el-menu-item>

          <el-menu-item index="/place">
            <i class="el-icon-location"></i>
            <span slot="title">存放地点</span>
          </el-menu-item>
          <el-menu-item index="/supplier">
            <i class="el-icon-phone"></i>
            <span slot="title">供应商</span>
          </el-menu-item>
          <el-menu-item index="/department">
            <i class="el-icon-service"></i>
            <span slot="title">部门管理</span>
          </el-menu-item>
          <el-menu-item index="/information">
              <i class="el-icon-info"></i>
              <span slot="title">个人信息</span>
          </el-menu-item>


        </el-menu>
       </div>
      </el-col>

      <router-view></router-view>

    </div>
</template>

<script>
import storage from '../model/storage.js'

export default {
  methods: {
    handleOpen(key, keyPath) {
      console.log('handleOpen()')
      let obj = {
        'open': key
      }
      // storage.set('menu',obj)
      console.log(key, keyPath);
      // if (key[0] === '1'){
      //   this.openeds = ['1']
      // }else if(key[0] === '2'){
      //   this.openeds = ['2']
      // }


      console.log(this.openeds)
    },
    handleClose(key, keyPath) {
      console.log('handleClose()')
      // storage.remove('menu')
      console.log(key, keyPath);
    },
    loginout(){
      this.$router.push('/login')
    }
  },
  data() {
    return {
      // openeds: ['1']
    };
  },
  mounted() {}
};
</script>

<style>
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.head h1 {
  display: inline-block;
  margin: 0 auto;
}


.el-menu {
  border-right: none;
}

.over-hide{
    overflow: hidden;
  }
.body {
  margin: 0;
  padding: 0;
}


.head-right {
  display: inherit;
  margin-right: 20px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 10px
}
</style>
