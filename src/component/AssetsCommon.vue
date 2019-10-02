<template>
        <div>
        <el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">

          <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="资产名称">
                <span>{{ props.row.propertyName }}</span>
              </el-form-item>
              <el-form-item label="资产编码">
                <span>{{ props.row.propertyCode }}</span>
              </el-form-item>
              <el-form-item label="存放地点">
                <span>{{ props.row.locale.localeName }}</span>
              </el-form-item>
              <el-form-item label="供应商">
                <span>{{ props.row.supplier.supplierApellation }}</span>
              </el-form-item>
              <el-form-item label="使用部门">
                <span>{{ props.row.department.departmentName }}</span>
              </el-form-item>
              <el-form-item label="资产类别">
                <span>{{ props.row.propertyClass.propertyClassName }}</span>
              </el-form-item>
              <el-form-item label="品牌">
                <span>{{ props.row.brand.brandName }}</span>
              </el-form-item>
              <el-form-item label="当前状态">
                <span>
                  <el-tag>
                   {{  props.row.propertyState == 1 ?'未使用' : ''}}
                   {{  props.row.propertyState == 2 ?'已借用' : ''}}
                   {{  props.row.propertyState == 3 ?'已归还' : ''}}
                   {{  props.row.propertyState == 4 ?'已报废' : ''}}
                </el-tag>
                </span>
              </el-form-item>

              <el-form-item label="借用说明" v-if="props.row.propertyState == 2">
                <span>{{ props.row.propertyDescr }}</span>
              </el-form-item>

              <el-form-item label="报废方式" v-if="props.row.propertyState == 4">
                <span>
                  {{  props.row.scrapWay == 1 ? '损坏': '' }}
                  {{  props.row.scrapWay == 2 ? '丢失': '' }}
                  {{  props.row.scrapWay == 3 ? '转卖': '' }}
                  {{  props.row.scrapWay == 4 ? '赠送': '' }}
                  </span>
              </el-form-item>

              <el-form-item label="报废原因" v-if="props.row.propertyState == 4">
                <span>{{ props.row.propertyDescr }}</span>
              </el-form-item>


            </el-form>
          </template>
        </el-table-column>

        <el-table-column prop="propertyCode" label="资产编码" width="140">
        </el-table-column>

        <el-table-column prop="propertyName" label="资产名称" width="140">
        </el-table-column>

        <!-- <el-table-column prop="propertyName" label="资产名称">
          <template slot-scope="scope">
          <el-popover trigger="hover" placement="bottom" width="250">
            <div class="detail">
              <h4><i class="el-icon-tickets"></i>资产详情</h4>
              <p><el-tag type="success">资产编码: {{ scope.row.propertyCode }}</el-tag></p>
              <p><el-tag type="warning">资产名称: {{ scope.row.propertyName }}</el-tag></p>
              <p><el-tag type="success">存放地点: {{ scope.row.locale.localeName }}</el-tag></p>
              <p><el-tag type="success">供应商: {{ scope.row.supplier.supplierApellation }}</el-tag></p>
              <p><el-tag type="success">使用部门: {{ scope.row.department.departmentName }}</el-tag></p>
              <p>
                <el-tag>
                  当前状态: 
                  {{ scope.row.propertyState == 1 ?
                   '未使用' : scope.row.propertyState == 2 ? 
                   '已借用' : scope.row.propertyState == 3 ? 
                   '已归还' : scope.row.propertyState == 4 ? 
                   '已报废' : ''
                   }}
                </el-tag>
              </p>
              <p><el-tag type="success">入账时间: {{ scope.row.propertyDate }}</el-tag></p>
            </div>
            
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.propertyName }}</el-tag>
            </div>
          </el-popover>
          </template>
        </el-table-column> -->

        

        <el-table-column prop="propertyClass.propertyClassName" label="资产类别">
        </el-table-column>

        <el-table-column prop="supplier.supplierApellation" label="供应商" width="150">
        </el-table-column>

        <el-table-column prop="brand.brandName" label="品牌">
        </el-table-column>

       <!--  <el-table-column prop="propertyDate" :label="dateformat" width="100">
        </el-table-column> -->

        <el-table-column :formatter="formatDate" :label="dateformat" width="100">
        </el-table-column>

        <el-table-column prop="locale.localeName" label="存放地点" width="150">
        </el-table-column>


        <!-- <el-table-column prop="department.departmentName" label="使用部门">
        </el-table-column> -->

        <!-- formatter 数据转换 -->
        <!-- filters 分组 -->
        <!-- <el-table-column prop="propertyState" 
        label="当前状态" 
        :formatter="formatState"
        :filters="[{ text: '未使用', value: '1' }, { text: '使用中', value: '2' }]"
        :filter-method="filterState"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
          :type="scope.row.propertyState == 1 ? 'primary' : 'success'"
          disable-transitions>{{scope.row.propertyState == 1 ? '未使用' : '使用中'}}
          </el-tag>
        </template>
        </el-table-column> -->

        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <!-- <el-button type="text" size="small" @click="borrow(scope.row)">{{scope.row.propertyState == 1 ? '借用': '归还'}}</el-button>  -->
            <el-button type="text" size="small" @click="modification(scope.row)">{{operation}}</el-button>
            <el-button type="text" size="small" @click="delAsset(scope.row)"  v-if="scope.row.propertyState == 4 && scrap">删除</el-button> 
          </template>

        </el-table-column>

      </el-table>

      <!-- 页码 -->
      <div class="block" v-if="totalPage">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalPage"
          :page-size="1"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>

    </div>

      
</template>

<script>
export default {
    data(){
        return{
          
        }
    },
    methods: {
        tableRowClassName({row,rowIndex}) {
        //未使用
        if (row.propertyState === 1) {
          return "c1-row";
          //借用
        } else if (row.propertyState == 2) {
          return "c2-row";
        } else if (row.propertyState == 3){
          return "c3-row"
        } else if(row.propertyState == 4){
          return "c4-row"
        }
        return "";
      },
      handleCurrentChange(val){
        console.log(val);
        this.$emit('paging',{
          "currentPage": val
        })
      },
      modification(obj){
        this.$emit('modification',obj)
      },
      formatDate(row,column){
        let date = null
        if (this.dateformat == '入库日期'){
          date = row.createDate
        }else {
          date = row.propertyDate
        }
        return date
      },
      delAsset(obj){
        this.$emit('delAsset',obj)
      }
      
    },
    mounted(){
        // 获取父组件(AssetStorage)的数据
        // console.log(this.tableData)
        console.log('totalPage');
        
        console.log(this.totalPage);
        
    },
    props: ['tableData','operation','dateformat','scrap','totalPage']
}
</script>

<style>
.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .el-table .c1-row {
    background: #fff;
  }
  .el-table .c2-row {
    background: #85C1E9;
  }
  .el-table .c3-row {
    background: #F0B27A;
  }
  .el-table .c4-row {
    background: #F1948A;
  }

</style>


