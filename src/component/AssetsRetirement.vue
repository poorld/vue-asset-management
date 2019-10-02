<!-- 资产报废 -->
<template>
    <div>
        <v-nav></v-nav>

        <el-col :span="20">
        <div class="add-btn">
          <el-input
              class="search"
              placeholder="请输入内容"
              prefix-icon="el-icon-search"
              style="width: 20%">
            </el-input>
            <el-button size="mini" type="primary" circle @click="addScrapped()" plain style="margin-left: 20px;" icon="el-icon-circle-plus"></el-button>
            <!-- <el-button type="success" circle @click="addScrapped()" plain>新增</el-button> -->
        </div>

        <div class="container">

            <v-common
                :tableData="tableData"
                :operation="operation"
                :dateformat="dateformat"
                scrap="true"
                v-on:modification="modification"
                v-on:delAsset="delAsset">
            </v-common>

        <el-dialog :title="title" :visible.sync="formVisible">
        <el-form :model="form">

            <el-form-item label="选择报废资产" :label-width="formLabelWidth">
            <el-select v-model="scrappedValue" placeholder="请选择" :disabled="disabled">
            <el-option
                v-for="item in asset"
                :key="item.propertyId"
                :label="item.propertyName"
                :value="item.propertyId">
            </el-option>
            </el-select>
            </el-form-item>

            <el-form-item label="报废方式" :label-width="formLabelWidth">
                <el-radio-group v-model="form.scrapWay">
                    <el-radio :label="1">损坏</el-radio>
                    <el-radio :label="2">丢失</el-radio>
                    <el-radio :label="3">转卖</el-radio>
                    <el-radio :label="4">赠送</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="报废原因" :label-width="formLabelWidth">
                <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="form.propertyDescr">
                </el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="formVisible = false">取 消</el-button>
            <el-button type="primary" @click="formConfirm()">确 定</el-button>
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
import stroage from '../model/storage.js'

export default {
    data(){
        return {
            tableData: [],
            operation: '修改',
            dateformat: '报废时间',
            scrappedValue: null,
            form: {},
            formVisible: false,
            asset: [],
            formLabelWidth: '120px',
            title: '',
            disabled: false,
            updateFlag: false,
            userId: ''
        }
    },
    methods: {
        getBasicData(){
            let url = api.getScrappedPropertyUrl(this.userId)
            ajax.request('GET',url)
                .then(res => {
                    console.log(res);

                    this.tableData = res.data.data
                })
        },
        addScrapped(){
            this.title = '新增报废资产'
            this.form = {}
            this.disabled = false
            this.scrappedValue = null
            this.updateFlag = false
            // 获取未使用的资产
            const unusedAssetUrl = api.getunusedAssetUrl(this.userId)
            // 获取已归还的资产
            const returnedAssetUrl = api.getReturnedPropertyUrl(this.userId)
            const method = 'GET'

            const unusedAsset = ajax.request(method,unusedAssetUrl)
            const returnedAsset = ajax.request(method,returnedAssetUrl)

            Promise.all([unusedAsset,returnedAsset])
                .then( ([unusedAssetRes,returnedAssetRes]) => {
                    const arr1 = unusedAssetRes.data.data
                    const arr2 = returnedAssetRes.data.data
                    let arr = []
                    arr = arr.concat(arr1,arr2)
                    console.log(arr);

                    this.asset = arr
                    this.formVisible = true
                })
        },
        formConfirm(){
            if (!this.scrappedValue)
                return
            if (!this.form.scrapWay)
                return
            let obj = {}
            obj.propertyId = this.scrappedValue
            if (this.updateFlag){
                obj.propertyId = this.form.propertyId
            }
            obj.userId = this.userId
            obj.propertyState = 4 // 报废状态
            obj.scrapWay = this.form.scrapWay // 报废方式
            obj.propertyDescr = this.form.propertyDescr
            console.log(obj);
            let url = api.getAssetUrl('')
            let method = 'PUT' //更新
            ajax.request(method,url,JSON.stringify(obj),this.$header)
                .then(res => {
                    console.log(res);
                    this.getBasicData()
                    this.formVisible = false
                })
        },
        //监听子组件
        modification(data){
            console.log(data);
            this.title = '修改报废资产'
            // this.scrappedValue = data.propertyName
            this.form = Object.assign({},data)
            this.scrappedValue = this.form.propertyName
            this.disabled = true
            this.updateFlag = true
            this.formVisible = true
        },
        delAsset(data){
            console.log(data);
            let url = api.getAssetUrl('') + data.propertyId
            let method = 'DELETE'
            this.$confirm('此操作将永久删除资产, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                return ajax.request(method,url)
            }).then(res => {
                console.log(res);
                this.getBasicData();
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    },
    mounted(){
        let user = stroage.get('user')
        this.userId = user.userId
        this.getBasicData()
    },
    components: {
        'v-common': Common,
        'v-nav': Main
    }
}
</script>
