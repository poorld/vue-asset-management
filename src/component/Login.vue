<template>
    <div id="login">

        <div class="form"> 
            <h2>login</h2>
            
            <div class="item">
                <span>用户名</span>
                <input v-model="username" type="text"/>
            </div>

            <div class="item">
                <span>密 码 </span>
                <input v-model="password" type="password"/>
            </div>

            <div class="btn">
                 <button @click="login">go</button>
            </div>

           
        </div>
        
    </div>
</template>

<script>
import api from '../model/api.js'
import ajax from '../model/ajax.js'
import storage from '../model/storage.js'

export default {
  data() {
    return {
        username: '',
        password: '',
    }
  },
  methods: {
      login(){
        if (!this.username || !this.password)
            return
        console.log(`username:${this.username}`);
        console.log(`password:${this.password}`);
        let url = api.getUserLoginUrl()
        let method = 'POST'
        let user = JSON.stringify({
            'userName': this.username,
            'userPassword': this.password
        })
        ajax.request(method,url,user,this.$header)
        .then(res => {
            console.log(res);
            if (res.data.errorCode === -1){
                const h = this.$createElement;

                this.$notify({
                title: 'tip',
                message: h('i', { style: 'color: teal'}, '帐号或者密码错误!')
                });
            }else {
                storage.set('user',res.data.data.user)
                storage.setToken(res.data.data.token)

                this.$router.push('/information')
            }
            
        })
        .catch(err => {
            console.log(err);
            const h = this.$createElement;
            this.$notify({
                title: 'tip',
                message: h('i', { style: 'color: teal'}, '网络出错啦!')
                });
        })
      }
  },
  mounted(){
    
  }
}
</script>

<style scoped>

html,body{height: 100%;width: 100%;margin:0;padding:0;}

#login {
    background:url('../assets/login.jpg') no-repeat;
    width:100%;
    height:100%;
    background-size:100% 100%;
    position:absolute;
    filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../../assets/1.jpg.png',sizingMethod='scale');
    
}

.form {
    margin: 50px auto;
    width: 40%;
    height: 300px;
    background-color: #2aa6c0;
    opacity: 0.8;
    border-radius: 10px;
    box-shadow: 1px 1px 1px #19b4d3;
}
.form h2{
 text-align: center;   
}
.item {
    width: 80%;
    margin: 30px auto;
    text-align: center;
}
.item input {
    height: 20px;
    border-radius: 5px;
    text-indent: 5px;
}

.form .btn{
   text-align: center;
}

.btn button {
    width: 80px;
    height: 30px;
    background-color: #19b4d3;
    border-radius: 5px;
}


</style>

