<template>
    <div>
        <v-nav></v-nav>

        <el-col :span="20">

    <div class="add-btn">
        <el-button type="primary" @click="addDepartment()" plain>新增</el-button>
    </div>

    <div class="container">
            <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
            type="index"
            width="50">
            </el-table-column>

            <el-table-column
                prop="departmentName"
                label="名称">
            </el-table-column>
            
            <el-table-column
                prop="departmentCode"
                label="编号">
            </el-table-column>

            <el-table-column
                prop="departmentState"
                label="状态"
                :formatter="formatState">
            </el-table-column>

            <el-table-column
                prop="operation"
                label="操作"
                fixed="right"
                width="150">
                <template slot-scope="scope">
                    <el-button  type="text" size="small" @click="disabled(scope.row)">{{scope.row.departmentState == 1 ? '禁用': '启用'}}</el-button>
                    <el-button  type="text" size="small" @click="edit(scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
                </template>
            </el-table-column>

            </el-table>


            <el-dialog title="添加部门" :visible.sync="dialogVisible">

            <el-form ref="form" :model="form">
                
                <el-form-item label="部门名称" :label-width="formLabelWidth">
                    <el-input v-model="form.departmentName"></el-input>
                </el-form-item>

                <el-form-item label="部门编号" :label-width="formLabelWidth">
                    <el-input v-model="form.departmentCode"></el-input>
                </el-form-item>

            </el-form> 
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogConfirm()">确 定</el-button>
            </span>
        </el-dialog>
        </div>
        </el-col>
    </div>

    
</template>

<script>
import ajax from '../model/ajax.js'
import format from '../model/util.js'
import api from '../model/api.js'
import Main from './Main.vue'
import storage from '../model/storage.js'

export default {
    data(){
      return {
          tableData: [],
          form: {},
          formLabelWidth: '120px',
          dialogVisible: false,
          header: {
              "Content-Type": "application/json"
          },
          updateFlag: true,// true更新 false添加
          userId: ''

      }  
    },
    mounted(){
        /* ajax.request('GET','http://localhost:9528/departmentlist')
         .then( res => {
             console.log(res.data)
             this.tableData = res.data
         }) */
         let user = storage.get('user')
         this.userId = user.userId
         this.getBaseData()
    },
    methods: {
        addDepartment(){
            this.form = {}
            this.dialogVisible = true
            this.updateFlag = false
        },
        edit(department){
            // console.log(department)
            this.form = Object.assign({},department)
            this.dialogVisible = true
            this.updateFlag = true
        },
        dialogConfirm(){
            const h = this.$createElement;
            if (!this.form.departmentName){
                this.$notify({
                    title: 'tip',
                    message: h('i', { style: 'color: teal'}, '部门名称不能为空!')
                });
                return
            }
            if (!this.form.departmentCode){
                this.$notify({
                title: 'tip',
                message: h('i', { style: 'color: teal'}, '部门编号不能为空!')
                });
                return
            }
            this.form.userId = this.userId
            let json = JSON.stringify(this.form)
            // ajax
            let url = api.getDepartmentUrl('')
            let method = 'POST' // 添加
            let message = '恭喜你，添加成功!'
            if (this.updateFlag){
                message = '恭喜你，修改成功!'
                method = 'PUT'// 修改
            }
            ajax.request(method,url,json,this.header)
                .then(res => {
                    console.log(res)
                    this.dialogVisible = false
                    let code = res.data.errorCode
                    if (code == 0){
                        this.getBaseData()
                        this.$message({
                            message: message,
                            type: 'success'
                        })
                    }else {
                        this.$message.error('操作失败，很可能是人品问题哦!')
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        formatState(row,column){
            return format.formatDepartmentState(row)
        },
        // 禁用或启用
        disabled(department){
            // console.log(department)
            let departmentState = department.departmentState == 1 ? 2 : 1
            // 让属性为空，只留departmentState字段，这样可以只更新departmentState
            let obj = {}
            obj.departmentId = department.departmentId
            obj.departmentState = departmentState
            console.log(obj)
            let url = api.getDepartmentUrl('')
            ajax.request('PUT',url,JSON.stringify(obj),this.header)
                .then(res => {
                    console.log(res)
                    this.getBaseData()
                })
                .catch(error => {
                    console.log(error)
                })
            
        },
        // 删除
        del(department){
            let url = api.getDepartmentUrl(department.departmentId)
            console.log(`url ${url}`);
            console.log(`department`);
            console.log(department);
            
            
            
            ajax.request('DELETE',url)
                .then(res => {
                    console.log(res)
                    let code = res.data.errorCode
                    if (code == 0){
                        this.getBaseData()
                    }
                })
                .catch(error => {
                    console.log(error);
                    
                })
        }, 
        
        // 初始化数据
        getBaseData(){
        let url = api.getDepartmentUrl(this.userId)
        ajax.request('GET',url)
            .then(res => {
                this.tableData = res.data.data
            })
        },

    },
    components: {
        'v-nav': Main
    },
}
</script>