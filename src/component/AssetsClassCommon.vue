<!-- 资产类别公共组件 -->

<template>
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
                prop="propertyClassCode"
                label="编号">
            </el-table-column>

            <el-table-column
                prop="propertyClassName"
                label="名称">
            </el-table-column>
            
            <el-table-column
                prop="propertyClassState"
                label="状态"
                :formatter="formatState">
            </el-table-column>

            <el-table-column
                prop="operation"
                label="操作"
                fixed="right"
                width="150">
                <template slot-scope="scope">
                    <!-- <el-button type="text" size="small" @click="edit(scope.row)">修改</el-button> -->
                    <el-button type="text" size="small" @click="modification(scope.row)">{{operation}}</el-button>
                </template>
                
            </el-table-column>
            </el-table>

           
    </div>
</template>

<script>
import util from '../model/util.js'
import api from '../model/api.js'
import ajax from '../model/ajax.js'
import stroage from '../model/storage.js'

export default {
    data(){
        return {
            assetsClassFormVisible: false,
            assetsClassForm: {},
            formLabelWidth: '120px',
            update: false,
            userId: ''
        }
    },
    methods: {
        formatState(row,column){
            return util.formatPropertyClassState(row)
        },
        //编辑资产类别
        edit(pc){
            this.$emit('editpc',pc)
        },
        //删除资产类别
        delPC(pc){
            this.$emit('delpc',pc)
            
        },
        modification(pc){
            this.$emit('modification',pc)
        }

    },
    mounted(){
        let user = stroage.get('user')
        this.userId = user.userId
    },
    props: ['tableData','operation']
}
</script>
