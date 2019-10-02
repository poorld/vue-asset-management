<template>

        <div>
            <v-nav></v-nav>
            <el-col :span="20">
            
        <div class="add-btn">
            <el-button type="primary" @click="addSupplier()" plain>新增</el-button>
        </div>

        <div class="container">

            <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
                prop="supplierApellation"
                label="名称">
            </el-table-column>

            <el-table-column
                prop="supplierType"
                label="类型"
                :formatter="formatType">
            </el-table-column>

            <el-table-column
                prop="supplierState"
                label="状态"
                :formatter="formatState">
            </el-table-column>

            <el-table-column
                prop="supplierName"
                label="联系人">
            </el-table-column>

            <el-table-column
                prop="supplierPhone"
                label="移动电话">
            </el-table-column>

            <el-table-column
                prop="supplierAddress"
                label="地址">
            </el-table-column>

        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="disable(scope.row)" type="text" size="small">{{scope.row.supplierState == 1 ? '禁用' : '启用'}}</el-button>
            <el-button @click="editSupplier(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="delSupplier(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>

        </el-table>

        <el-dialog title="供应商" :visible.sync="dialogVisible">

            <el-form ref="form" :model="form">
                
                <el-form-item label="名称" :label-width="formLabelWidth">
                    <el-input v-model="form.supplierApellation"></el-input>
                </el-form-item>

                <el-form-item label="类型" :label-width="formLabelWidth">
                    <el-radio-group v-model="form.supplierType">
                    <el-radio :label=1>生产商</el-radio>
                    <el-radio :label=2>代理商</el-radio>
                    <el-radio :label=3>零件</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-radio-group v-model="form.supplierState">
                    <el-radio :label=1>正常</el-radio>
                    <el-radio :label=2>报废</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="联系人" :label-width="formLabelWidth">
                    <el-input v-model="form.supplierName"></el-input>
                </el-form-item>

                <el-form-item label="移动电话" :label-width="formLabelWidth">
                    <el-input v-model="form.supplierPhone"></el-input>
                </el-form-item>

                <el-form-item label="地址" :label-width="formLabelWidth">
                    <el-input v-model="form.supplierAddress"></el-input>
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
    data() {
        return {
            tableData: [],
            dialogVisible: false,
            form: {},
            formLabelWidth: '120px',
            updateFlag: true,
            userId: ''
        }
    },
    mounted(){
        /* ajax.request('GET','http://localhost:9528/supplierlist')
         .then(res => {
             this.tableData = res.data
         }) */
         let user = storage.get('user')
         this.userId = user.userId
         this.getBaseData()
    },
    methods: {
        addSupplier(){
            this.form = {}
            this.dialogVisible = true
            this.updateFlag = false
        },
        formatType(row,column){
            return format.formatSupplierType(row)
        },
        formatState(row,column){
            return format.formatSupplierState(row)
        },
        editSupplier(supplier){
            this.form = Object.assign({},supplier)
            this.dialogVisible = true
            this.updateFlag = true
        },
        dialogConfirm(){
            // console.log(JSON.stringify(this.form))
            const h = this.$createElement;
            if (!this.form.supplierApellation){
                this.$notify({
                    title: 'tip',
                    message: h('i', { style: 'color: teal'}, '供应商名称不能为空!')
                });
                return
            }
            this.form.userId = this.userId
            let url = api.getSupplierUrl('')
            let method = 'POST' // 添加
            let message = '恭喜你，添加成功!'
            if (this.updateFlag){
                method = 'PUT'
                message = '恭喜你，修改成功!'
            }
            ajax.request(method,url,JSON.stringify(this.form),this.$header)
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
        //删除供应商
        delSupplier(supplier){
            let url = api.getSupplierUrl(supplier.supplierId)
            ajax.request('DELETE',url)
                .then(res => {
                    console.log(res)
                    this.getBaseData()
                })
        },
        // 启用或者禁用
        disable(supplier){
            let supplierState = supplier.supplierState == 1 ? 2 : 1
            let obj = {}
            obj.supplierId = supplier.supplierId
            obj.supplierState = supplierState
            console.log(JSON.stringify(obj))
            let url = api.getSupplierUrl('')
            // 更新状态
            ajax.request('PUT',url,JSON.stringify(obj),this.$header)
                .then(res => {
                    console.log(res)
                    this.getBaseData()
                })
                .catch(error => {
                    console.log(error)
                })
        },
        getBaseData(){
            let url = api.getSupplierUrl(this.userId)
            ajax.request('GET',url)
                .then(res => {
                    this.tableData = res.data.data
                })
        }
    },
    components: {
        'v-nav': Main
    },
}
</script>