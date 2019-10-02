<template>
  <div id="app">

    <!-- <v-main></v-main> -->
    <router-view></router-view>


  </div>
</template>

<script>
import Vue from 'vue'
import Main from './component/Main.vue'

export default {
  name: "app",
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  data() {
    return {

    }
  },
  mounted(){

  },
  components: {
    'v-main': Main,
  }
};
</script>


<style>
/* scoped */
  * {
    margin: 0;
    padding: 0;
  }
  .body {
    /* margin: 10px; */
    margin-top: 10px;
    border: 1px solid #eee;
  }
 .head {
   /* background-image: url("./assets/sad-girl-1382940_1280.jpg"); */
   width: 100%;
   height: 100px;
   background-color: #304156;
   background-size: 100% 250px;
   box-shadow: 1px 1px 1px #ccc;
 }
 .head h1 {
   color: #fff;
   line-height: 100px;
   margin-left: 30px;
 }
 .container{
    margin-left: 10px;
    margin-right: 10px;
    border: 1px solid #eee;
    border-bottom: none;

 }

  .add-btn {
    border: 1px solid #eee;
    margin: 10px;
    padding: 5px;
    background-color: #304156;
    border-radius: 5px;
  }

  .container .block{
    text-align: center;
    margin: 30px;
  }

  a {
    text-decoration: none;
  }
  .router-link-active {
    text-decoration: none;
    color: #FFD04B;
  }
</style>
