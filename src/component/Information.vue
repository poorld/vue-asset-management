<!-- 个人信息 -->
<template>
    <div>
        <v-nav></v-nav>

        <el-col :span="20">
            <div class="info">
                <div class="info-top">
                    <div class="header-left">
                    <img src="
https://teenyda-blog.oss-cn-shenzhen.aliyuncs.com/blog-image/u%3D558219988%2C3903772744%26fm%3D26%26gp%3D0.jpg" />
                    <div class="online"><span>ONLINE</span></div>
                    </div>
                    <div class="header-right">
                        <el-tag type="success">姓名:{{information.userAlias}}</el-tag>
                        <el-tag>电话:{{information.userPhone}}</el-tag>
                        <el-tag type="info">工号:{{information.userCode}}</el-tag>
                    </div>

                    <div class="header-right">
                        <el-tag type="warning">性别:{{information.userSex}}</el-tag>
                        <el-tag type="danger">部门:{{information.departmentName}}</el-tag>
                        <el-tag>职位:{{information.userJob}}</el-tag>
                    </div>
                </div>
                
                <div class="update">
                    <el-button type="primary" icon="el-icon-edit" circle @click="update()"></el-button>
                </div>
                
            </div>

            <el-dialog title="修改个人信息" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input v-model="form.userAlias"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="form.userPhone"></el-input>
                </el-form-item>
                <el-form-item label="工号" :label-width="formLabelWidth">
                    <el-input v-model="form.userCode"></el-input>
                </el-form-item>
                <el-form-item label="性别" :label-width="formLabelWidth">
                    <el-input v-model="form.userSex"></el-input>
                </el-form-item>
                <el-form-item label="部门" :label-width="formLabelWidth">
                    <el-select v-model="department" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.departmentId"
                        :label="item.departmentName"
                        :value="item.departmentName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职位" :label-width="formLabelWidth">
                    <el-input v-model="form.userJob"></el-input>
                </el-form-item>
                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirm()">确 定</el-button>
            </div>
            </el-dialog>


        </el-col>
    </div>  
</template>

<script>
import ajax from '../model/ajax.js'
import api from '../model/api.js'
import Main from './Main.vue'
import storage from '../model/storage.js'

export default{
    data(){
       return {
           dialogFormVisible: false,
           formLabelWidth: '120px',
           form: {},
           information: {},
           options: [],
           department: '',
           flag: '',
           userId: ''
       }
    },
    methods: {
        update(){
            this.form = Object.assign({},this.information)
            const url =api.getDepartmentUrl(this.userId)
            this.department = this.information.departmentName
            this.flag = this.department
            ajax.request('GET',url)
                .then(res => {
                    console.log(res);
                    this.options = res.data.data
                })
            this.dialogFormVisible = true
        },
        confirm(){

            if (this.flag != this.department){
                this.form.departmentName = this.department
            }
            this.form.userId = this.userId
            console.log(this.form);
            const url = api.getUserInformatinUrl()
            const jsonObj = JSON.stringify(this.form)
            ajax.request('PUT',url,jsonObj,this.$header)
                .then(res => {
                    console.log(res);
                    this.getinformatin()
                    this.dialogFormVisible = false
                })
        },
        getinformatin(){
            let url = api.getUserInformatinUrl() + this.userId
            ajax.request('GET',url)
                .then(res => {
                    console.log(res);
                    this.information = res.data.data
                })
            
            
        },
        
    },
    mounted () {
        let user = storage.get('user')
        this.userId = user.userId
        this.getinformatin()
    },
    components: {
        'v-nav': Main
    },
}
</script>
<style>
.info{
    margin-left: 10px;
    margin-top: 10px;
    width: 95%;
    border: 1px solid #eee;
    height: 270px;
    /* margin: 50px 20px 2px; */
    background-color: #fff;
    
    border-radius: 10px;
    box-shadow: 1px 1px 5px rgb(139, 139, 139);
}
.info-top {
    height: 130px;
    display: flex;
    justify-content: flex-start;
}
.header-left {
    margin-top: 10px;
    margin-left: 10px;
    text-align: center;
}
.online span {
  font-size: 0.7em;
  background-color: #4ba612;
  color: #fff;
  border-radius: 3px;
  padding: 0 10px;
}

.header-left img {
    width: 80px;
    height: 80px;
    border-radius: 10px;
}

.header-right {
    margin-top: 10px;
    display: flex;
    margin-left: 10px;
    justify-content: space-between;
    flex-direction: column;
    
}

.update {
    margin: 50px;
    /* align-self: flex-end; */
}

</style>
