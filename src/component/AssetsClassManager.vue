<!-- 资产类别管理 -->
<template>
    <div>
        <v-nav></v-nav>

        <el-col :span="20">

        <div class="add-btn">
            <el-button type="primary" @click="addAssetsClass()" plain>新增</el-button>
        </div>

        <v-accommon 
        :table-data="tableData" 
        :operation="operation"
        v-on:modification="modification">
        </v-accommon>

            <!-- 添加或者修改表单 -->
            <el-dialog :title="title" :visible.sync="assetsClassFormVisible">

            <el-form :model="assetsClassForm">
                <el-form-item label="资产类别编号" :label-width="formLabelWidth">
                    <el-input v-model="assetsClassForm.propertyClassCode"></el-input>
                </el-form-item>

                <el-form-item label="资产类别名称" :label-width="formLabelWidth">
                    <el-input v-model="assetsClassForm.propertyClassName"></el-input>
                </el-form-item>

                <!-- <el-form-item label="选择状态" :label-width="formLabelWidth">
                    <el-radio-group v-model="assetsClassForm.propertyClassState">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="2">报废</el-radio>
                    </el-radio-group>
                </el-form-item> -->
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="assetsClassFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="acFormConfirm()">确 定</el-button>
            </div>
            </el-dialog>


        </el-col>
    </div>
</template>

<script>
import api from '../model/api.js'
import ajax from "../model/ajax.js"
import AssetsClassCommon from './AssetsClassCommon.vue'
import util from '../model/util.js'
import Main from './Main.vue'
import storage from '../model/storage.js'

export default {
    data(){
        return {
            tableData: [],
            assetsClassFormVisible: false,
            assetsClassForm: {},
            formLabelWidth: '120px',
            updateFlag: true,
            userId: '',
            title: '添加资产类别',
            operation: '修改'
        }
    }, 
    methods: {
        //添加资产类别
        addAssetsClass(){
            this.title = '添加资产类别'
            let number = 'ac' + util.getTimestampStr()
            this.assetsClassForm.propertyClassCode = number
            this.assetsClassForm.propertyClassName = ''
            this.updateFlag = false
            this.assetsClassFormVisible = true
        },
        //表单确认
        acFormConfirm(){
            /* console.log(this.assetsClassForm) */
            const h = this.$createElement;
            if (!this.assetsClassForm.propertyClassName){
                this.$notify({
                title: 'tip',
                message: h('i', { style: 'color: teal'}, '资产类别名称不能为空!')
                });
                return
            }


            this.assetsClassForm.userId = this.userId
            this.assetsClassForm.propertyClassState = 1
            let url = api.getPropertyClassUrl('')
            let method = 'POST'

            if (this.updateFlag){
                method = 'PUT'
            }

            let jsonObj = JSON.stringify(this.assetsClassForm)
            ajax.request(method,url,jsonObj,this.$header)
                .then(res => {
                    console.log(res);
                    this.getPropertyClass()
                    this.assetsClassFormVisible = false
                })
                .catch(err => {
                    console.log(err);
                })
        },
        getPropertyClass(){
            
            let url = api.getPropertyClassUrl(this.userId)
            let method = 'GET'
            ajax.request(method,url)
                .then(res => {
                    // console.log(res)
                    this.tableData = res.data.data
                })
        },
        dialogClose(data){

            console.log('子组件窗口关闭');
            // 更新数据
            this.getPropertyClass()
        },
        //删除资产类别
        delpc(obj){
            let url = api.getPropertyClassUrl(obj.propertyClassId)
            let method = 'DELETE'
            ajax.request(method,url)
                .then(res => {
                    console.log(res);
                    this.getPropertyClass()
                    this.assetsClassFormVisible = false
                    this.update = true
                })
                .catch(err => {
                    console.log(err);
                    this.update = false
                })
        },
        //修改资产类别
        editpc(pc){
            this.title = '修改资产类别'
            this.assetsClassFormVisible = true
            this.assetsClassForm = Object.assign({},pc)
            this.updateFlag = true
        },
        modification(pc){
            this.editpc(pc)
        }

    },
    mounted(){
        let user = storage.get('user')
        this.userId = user.userId
        this.getPropertyClass()
    },
    components: {
        'v-accommon': AssetsClassCommon,
        'v-nav': Main
    },
    
}
</script>
