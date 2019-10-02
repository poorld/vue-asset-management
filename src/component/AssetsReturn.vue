<!-- 资产归还(已经归还) -->
<template>

    <div>
        <v-nav></v-nav>

        <el-col :span="20">
        <div class="add-btn">
            <el-input
              class="search"
              placeholder="请输入内容"
              prefix-icon="el-icon-search"
              v-model="input21"
              style="width: 20%">
            </el-input>
            <el-button size="mini" type="primary" circle @click="addBorrow()" plain style="margin-left: 20px;" icon="el-icon-circle-plus"></el-button>

        </div>

        <div class="container">

            <v-common
            :tableData="tableData"
            :operation="operation"
            :dateformat="dateformat"
            v-on:modification="modification"></v-common>



        <!-- 新增资产归还表单 -->
        <el-dialog title="资产归还" :visible.sync="formVisible">
        <el-form :model="form">

            <el-form-item label="选择归还资产" :label-width="formLabelWidth">
            <el-select v-model="assetsValue" placeholder="请选择">
            <el-option
                v-for="item in borrowedAsset"
                :key="item.propertyId"
                :label="item.propertyName"
                :value="item.propertyId">
            </el-option>
            </el-select>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="borroFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="formConfirm()">确 定</el-button>
        </div>
        </el-dialog>


        <!-- 资产借用 -->
        <el-dialog title="资产借用" :visible.sync="borroFormVisible">
        <el-form :model="borrwForm">

           <el-form-item label="资产名称" prop="propertyName" :label-width="formLabelWidth">
                    <el-input v-model="borrwForm.propertyName" disabled='disabled'></el-input>
            </el-form-item>

            <el-form-item label="借用部门" :label-width="formLabelWidth" v-if="show">
            <el-select v-model="departmentValue" placeholder="请选择">
            <el-option
                v-for="item in department"
                :key="item.departmentId"
                :label="item.departmentName"
                :value="item.departmentId"
                :disabled="item.departmentState == 1 ? false:true">
            </el-option>
            </el-select>
            </el-form-item>

            <el-form-item label="借用说明" :label-width="formLabelWidth">
                <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="borrwForm.propertyDescr">
                </el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="borroFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="returnConfirm()">确 定</el-button>
        </div>
        </el-dialog>

        </div>

    </el-col>
    </div>
</template>

<script>
import api from '../model/api.js'
import ajax from '../model/ajax.js'
import Common from './AssetsCommon.vue'
import Main from './Main.vue'
import storage from '../model/storage.js'

export default {
    data(){
        return {
            tableData: [],
            operation: '借用',
            dateformat: '归还日期',
            borrowedAsset: [],
            form: {},
            formLabelWidth: '120px',
            department: [],
            departmentValue: '',
            assetsValue: '',
            borroFormVisible: false,
            formVisible: false,
            show: false,
            borrwForm: {},
            departmentFlag: null,
            userId: ""
        }
    },
    methods:{
        //添加按钮 归还资产
        addBorrow(){
            this.title = '资产归还'
            //获取已借用资产
            this.getborrowedAsset()
            this.assetsValue = null
            this.formVisible = true
        },
        //借用按钮
        modification(data){
            console.log(data);
            this.borrwForm = data
            this.departmentValue = data.department.departmentName

            console.log(`this.departmentValue=${this.departmentValue}`);

            this.departmentFlag = this.departmentValue
            this.getborrowedAsset()
            this.getDepartment()
            this.borroFormVisible = true
            this.show = true
        },
        //获取已借用资产
        getborrowedAsset(){
            let url = api.getborrowedAssetUrl(this.userId)
            let method = 'GET'
            ajax.request(method,url)
                .then(res => {
                    this.borrowedAsset = res.data.data
                })
        },
        //获取部门
        getDepartment(){
            let url = api.getDepartmentUrl(this.userId)
            let method = 'GET'
            ajax.request(method,url)
                .then(res => {
                    this.department = res.data.data
                })
        },
        //确认
        returnConfirm(){
            let obj = {}
            obj.propertyId = this.borrwForm.propertyId
            obj.department = this.borrwForm.department

            if (!this.departmentValue)
                return
            if (this.departmentFlag != this.departmentValue){
                obj.department = {}
                obj.department.departmentId = this.departmentValue
            }
            obj.propertyDescr = this.borrwForm.propertyDescr
            //更改为借用状态
            obj.propertyState = 2
            obj.userId = this.userId
            let url = api.getAssetUrl('')
            let method = 'PUT'

            console.log(obj);
            let jsonObj = JSON.stringify(obj)
            console.log(jsonObj);

            ajax.request(method,url,jsonObj,this.$header)
                .then(res => {
                    console.log(res);
                    this.getBasicData()
                    this.borroFormVisible = false
                })


        },
        //新增归还确认
        formConfirm(){
            if (!this.assetsValue)
                return
            let obj = {}
            obj.propertyId = this.assetsValue
            obj.propertyState = 3
            obj.userId = this.userId
            console.log(obj);
            let url = api.getAssetUrl('')
            let method = 'PUT'
            let jsonObj = JSON.stringify(obj)
            ajax.request(method,url,jsonObj,this.$header)
                .then(res => {
                    console.log(res);
                    this.getBasicData()
                    this.formVisible = false
                })

        },
        getBasicData(){
            let url = api.getReturnedPropertyUrl(this.userId)
            ajax.request('GET',url)
                .then(res => {
                    console.log(res);

                    this.tableData = res.data.data
                })
        }
    },
    mounted(){
        let user = storage.get('user')
        this.userId = user.userId
        this.getBasicData()
    },
    components: {
        'v-common': Common,
        'v-nav': Main
    }
}
</script>
