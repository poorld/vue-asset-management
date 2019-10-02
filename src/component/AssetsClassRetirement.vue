<!-- 资产类别报废 -->
<template>
    <div>
        <v-nav></v-nav>

        <el-col :span="20">

    <div class="add-btn">
        <el-button type="success" @click="categoriesOfScrapped()" plain>新增</el-button>
    </div>

    <v-accommon
    :tableData="tableData"
    :operation="operation"
    v-on:modification="modification">
    </v-accommon>


    <!-- 添加资产类别报废表单 -->
    <el-dialog title="资产类别报废添加" :visible.sync="assetsClassFormVisible">

    <el-form :model="assetsClassForm">
        <el-form-item label="类别编号" :label-width="formLabelWidth">

            <el-select v-model="value" placeholder="请选择">
                <el-option
                v-for="item in pclist"
                :key="item.propertyClassId"
                :label="item.propertyClassName"
                :value="item.propertyClassId">
                <span style="float: left">{{ item.propertyClassName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.propertyClassCode }}</span>
                </el-option>
            </el-select>
        </el-form-item>

    </el-form>

    <div slot="footer" class="dialog-footer">
        <el-button @click="assetsClassFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="acFormConfirm()">确 定</el-button>
    </div>
    </el-dialog>


    <!-- 修改资产报废表单 -->
    <el-dialog title="修改报废资产" :visible.sync="acFormVisible">

    <el-form :model="acForm">
        <el-form-item label="资产类别编号" :label-width="formLabelWidth">
            <el-input v-model="acForm.propertyClassCode"></el-input>
        </el-form-item>

        <el-form-item label="资产类别名称" :label-width="formLabelWidth">
            <el-input v-model="acForm.propertyClassName"></el-input>
        </el-form-item>

        <!-- <el-form-item label="选择状态" :label-width="formLabelWidth">
            <el-radio-group v-model="acForm.propertyClassState">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="2">报废</el-radio>
            </el-radio-group>
        </el-form-item> -->
    </el-form>

    <div slot="footer" class="dialog-footer">
        <el-button @click="pcFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateConfirm()">确 定</el-button>
    </div>
    </el-dialog>

    </el-col>
    </div>
</template>

<script>
import api from '../model/api.js'
import ajax from "../model/ajax.js"
import AssetsClassCommon from './AssetsClassCommon.vue'
import Main from './Main.vue'
import storage from '../model/storage.js'

export default {
    data(){
        return {
            tableData: [],
            assetsClassFormVisible: false,
            acFormVisible: false,
            assetsClassForm: {},
            acForm: {},
            formLabelWidth: '120px',
            pclist: [],
            value: '',
            userId: '',
            operation: '删除'
        }
    },
    methods: {
        categoriesOfScrapped(){
            this.value = null
            this.getpropertyClassList()
            this.assetsClassFormVisible = true
        },
        //获取正常的资产类别 -> 报废
        getpropertyClassList(){
            let url = api.getNormalPropertyClassUrl(this.userId)
            let method = 'GET'
            console.log(url);

            ajax.request(method,url)
                .then(res => {
                    console.log(res);

                    this.pclist = res.data.data
                })
                .catch(err => {
                    console.log(err);
                })
        },
        acFormConfirm(){
            console.log(this.value);
            const h = this.$createElement;
            if (!this.value){
                this.$notify({
                    title: 'tip',
                    message: h('i', { style: 'color: teal'}, '请选择类别编号!')
                });
                return
            }

            let obj = {}
            obj.propertyClassId = this.value
            obj.propertyClassState = 2
            obj.userId = this.userId
            let url = api.getPropertyClassUrl('')
            let method = 'PUT'
            ajax.request(method,url,JSON.stringify(obj),this.$header)
                .then(res => {
                    console.log(res);
                    this.getRetirementPropertyClass()
                    this.assetsClassFormVisible = false
                })
                .catch(err => {
                    console.log(err);

                })
        },
        dialogClose(data){
            console.log('子组件窗口关闭');
            // 更新数据
            this.getRetirementPropertyClass()
        },
        //获取报废资产
        getRetirementPropertyClass(){
            let url = api.getScrappedPropertyClassUrl(this.userId)
            let method = 'GET'
            ajax.request(method,url)
                .then(res => {
                    console.log(res)
                    this.tableData = res.data.data
                })
        },
        //修改资产
        editpc(pc){
            this.acForm = Object.assign({},pc)
            this.acFormVisible = true
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
        //修改确认
        updateConfirm(){
            let url = api.getPropertyClassUrl('')
            let method = 'PUT'
            ajax.request(method,url,JSON.stringify(this.acForm),this.$header)
                .then(res => {
                    console.log(res);
                    this.getRetirementPropertyClass()
                     this.acFormVisible = false
                })

        },
        modification(pc){
            this.delpc(pc)
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

    },
    mounted(){
        let user = storage.get('user')
        this.userId = user.userId
        this.getRetirementPropertyClass()
    },

    components: {
        'v-accommon': AssetsClassCommon,
        'v-nav': Main
    }
}
</script>
