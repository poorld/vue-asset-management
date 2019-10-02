<template>
    <div>
        <v-nav></v-nav>

        <el-col :span="20">

        <div class="add-btn">
            <el-button type="primary" @click="addBrand()" plain>新增</el-button>
        </div>

        <div class="container">

            <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                    type="index"
                    width="100"
                    label="序号">
                </el-table-column>
                <el-table-column
                    prop="brandCode"
                    label="品牌编码"
                    width="250">
                </el-table-column>
                <el-table-column
                    prop="brandName"
                    label="品牌名称"
                    width="250">
                </el-table-column>
                <el-table-column
                    prop="brandState"
                    label="状态"
                    width="200"
                    :formatter="formatState">
                </el-table-column>

                <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="disabled(scope.row)">{{scope.row.brandState == 1 ? '禁用': '启用'}}</el-button>
                    <el-button type="text" size="small" @click="modification(scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="delBrand(scope.row)">删除</el-button>
                </template>

                </el-table-column>
            </el-table>


            <!-- 表单 -->
            <el-dialog title="品牌" :visible.sync="brandFormVisible">

            <el-form :model="brandForm">
                <el-form-item label="品牌编号" :label-width="formLabelWidth">
                    <el-input v-model="brandForm.brandCode"></el-input>
                </el-form-item>

                <el-form-item label="品牌名称" :label-width="formLabelWidth">
                    <el-input v-model="brandForm.brandName"></el-input>
                </el-form-item>

                <el-form-item label="选择状态" :label-width="formLabelWidth">
                    <el-radio-group v-model="brandForm.brandState">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="2">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="brandFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="brandFormConfirm()">确 定</el-button>
            </div>
            </el-dialog>

        </div>
    </el-col>
    </div>
</template>

<script>
import api from '../model/api.js'
import ajax from '../model/ajax.js'
import util from '../model/util.js'
import Main from './Main.vue'
import storage from '../model/storage.js'

export default {
    data(){
        return {
            tableData: [],
            brandFormVisible: false,
            brandForm: {},
            formLabelWidth: '120px',
            updateFlag: true,
            userId: ''
        }
    },
    mounted(){
        let user = storage.get('user')
        this.userId = user.userId
        this.getTableData()
    },
    methods: {
        getTableData(){
            let url = api.getBrandUrl(this.userId)
            let method = 'GET'
            ajax.request(method,url)
                .then(res => {
                    this.tableData = res.data.data
                })
        },
        // 添加品牌按钮
        addBrand(){
            this.brandForm = {}
            this.brandForm.brandCode = this.getBrandNumber()
            this.brandFormVisible = true
            this.updateFlag = false
        },
        formatState(row,column){
            return util.formatBrandState(row)
        },
        // 根据时间生成品牌编码
        getBrandNumber(){
            return 'b' + util.getTimestampStr()
        },
        // 表单确认
        brandFormConfirm(){
            const h = this.$createElement;
            if (!this.brandForm.brandName){
                this.$notify({
                    title: 'tip',
                    message: h('i', { style: 'color: teal'}, '品牌名称不能为空!')
                });
                return
            }
            this.brandForm.userId = this.userId
            console.log(this.brandForm)
            let url = api.getBrandUrl('')
            let method = 'POST'
            if (this.updateFlag){
                method = 'PUT'
            }
            let jsonObj = JSON.stringify(this.brandForm)
            ajax.request(method,url,jsonObj,this.$header)
                .then(res => {
                    console.log(res)
                    this.getTableData()
                })
                .catch(err => {
                    console.log(err)
                })
            this.brandFormVisible = false
        },
        //删除品牌
        delBrand(brand){
            console.log(brand)
            let url = api.getBrandUrl(brand.brandId)
            let method = 'DELETE'
            ajax.request(method,url)
                .then(res => {
                    console.log(res)
                    this.getTableData()
                })
                .catch(error => {
                    console.log(error)
                })
        },
        //修改品牌按钮
        modification(brand){
            this.brandForm = Object.assign({},brand)
            this.brandFormVisible = true
            this.updateFlag = true
        },
        //禁用或启用
        disabled(brand){
            let state = brand.brandState == 1 ? 2 : 1
            let id = brand.brandId
            let obj = {}
            obj.brandId = id
            obj.brandState = state
            let url = api.getBrandUrl('')
            let method = 'PUT'
            ajax.request(method,url,JSON.stringify(obj),this.$header)
                .then(res => {
                    console.log(res)
                    this.getTableData()
                })
                .catch(error => {
                    console.log(error)
                })
        }
    },
    components: {
        'v-nav': Main
    },

}
</script>
