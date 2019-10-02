<!-- 资产入库 -->

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
        <el-button size="mini" type="primary" circle @click="addAsset()" plain style="margin-left: 20px;" icon="el-icon-circle-plus"></el-button>


      </div>


    <div class="container">

      <!-- 公共组件，表格 -->
      <v-common :tableData="tableData"
            :operation="operation"
            v-on:modification="modification"
            :dateformat="dateformat"
            v-on:paging="paging"
            :totalPage="totalPage">

      </v-common>


      <!-- 修改 或添加 dialog -->
    <el-dialog title="编辑" :visible.sync="assetFormVisible">
      <!-- ref 表单重置 -->
      <el-form :model="assetForm" ref="assetForm">

        <el-form-item label="资产名称" :label-width="formLabelWidth">
          <el-input v-model="assetForm.propertyName" auto-complete="off">
          </el-input>
        </el-form-item>

        <el-form-item label="存放地点" :label-width="formLabelWidth">
          <el-select v-model="localeValue" placeholder="请选择">
            <el-option
                v-for="item in localelist"
                :key="item.localeId"
                :label="item.localeName"
                :value="item.localeId"
                :disabled="item.localeState == 1 ? false : true">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="供应商" :label-width="formLabelWidth">
          <el-select v-model="supplierValue" placeholder="请选择">
            <el-option
            v-for="item in supplierlist"
            :key="item.supplierId"
            :label="item.supplierApellation"
            :value="item.supplierId"
            :disabled="item.supplierState == 1 ? false : true">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="资产类别" :label-width="formLabelWidth">
          <el-select v-model="propertyClassValue" placeholder="请选择">
            <el-option
            v-for="item in propertyClassList"
            :key="item.propertyClassId"
            :label="item.propertyClassName"
            :value="item.propertyClassId"
            :disabled="item.propertyClassState == 1 ? false : true">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="品牌" :label-width="formLabelWidth">
          <el-select v-model="brandValue" placeholder="请选择">
            <el-option
            v-for="item in brandList"
            :key="item.brandId"
            :label="item.brandName"
            :value="item.brandId"
            :disabled="item.brandState == 1 ? false : true">
            </el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="入账时间" :label-width="formLabelWidth">
          <el-date-picker v-model="assetForm.createDate" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateCancel()">取 消</el-button>
        <el-button type="primary" @click="assetFormConfirm()">确 定</el-button>
      </div>
    </el-dialog>




    <!-- 资产详情 -->
    <!-- <el-dialog
      title="资产详情"
      :visible.sync="assetDetailVisible"
      width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assetDetailVisible = false">关 闭</el-button>
      </span>
    </el-dialog> -->



    </div>
    </el-col>
    </div>


</template>

<script>
import ajax from "../model/ajax.js";
import moment from "moment";
import format from "../model/util.js";
import api from "../model/api.js";
import Common from "./AssetsCommon.vue";
import Main from "./Main.vue"
import storage from '../model/storage.js'

export default {
  methods: {
    // 借用 或者 归还
    borrow(asset) {
      // propertyState == 2 -> 归还
      if (asset.propertyState == 2) {
        this.$confirm(
          "你想要归还资产名称为[" + asset.propertyName + "], 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
            let url = api.getAssetUrl();
            let method = "PUT";
            let obj = {};
            let propertyState = asset.propertyState == 1 ? 2 : 1;
            obj.propertyId = asset.propertyId;
            obj.propertyState = propertyState;
            obj.department = {};

            // 归还
            return ajax.request(method, url, JSON.stringify(obj), this.header)
          }).then(res => {
            console.log(res);
            let code = res.data.errorCode;
            if (code == 0) {
              this.$message({
                type: "success",
                message: "归还成功!"
              });
              this.getBaseData();
            }
          }).catch(err => {
            console.log(err);
            this.$message({
              type: "info",
              message: "不，你不想"
            });
          });
      } else {
        //借用
        this.borrowForm = Object.assign({}, asset);
        this.departmentValue = asset.department.departmentName;
        this.departmentFlag = this.departmentValue;
        // 获取部门列表
        ajax.request("GET", api.getDepartmentUrl()).then(res => {
          console.log(res);
          this.departmentlist = res.data.data;
          this.borrowFormVisible = true;
        });
      }
    },
    borrowCancel() {
      this.borrowFormVisible = false;
    },
    // 借用确定
    borrowConfirm() {
      let borrow = Object.assign({}, this.borrowForm);
      if (this.departmentFlag != this.departmentValue) {
        console.log("已修改部");
        borrow.department = {};
        borrow.department.departmentId = this.departmentValue;
      }
      borrow.propertyState = 2;
      let jsonData = JSON.stringify(borrow);
      console.log();
      // this.borrowFormVisible = false
      let url = api.getAssetUrl();
      let method = "PUT";
      ajax.request(method, url, jsonData, this.header).then(res => {
        this.getBaseData();
        this.borrowFormVisible = false;
      });
    },
    // 修改资产
    modification(asset) {
      console.log(asset);

      this.assetForm = Object.assign({}, asset);
      /**
       * 下拉列表的默认值
       * 使用localeValue localeFlag 获取原来的名称
       * 提交表单时，对比localeFlag与localeValue是否相等，不相等则说明以改变原来的值
       * 此时改变的值为localeValue
       * 其他一样
       */
      //存放地点
      this.localeValue = asset.locale.localeName;
      this.localeFlag = this.localeValue;
      //供应商
      this.supplierValue = asset.supplier.supplierApellation;
      this.supplierFlag = this.supplierValue;
      //资产类别
      this.propertyClassValue = asset.propertyClass.propertyClassName;
      this.propertyClassFlag = this.propertyClassValue;
      //品牌
      this.brandValue = asset.brand.brandName;
      this.brandFlag = this.brandValue;

      // 获取存放地点列表
      const locale = ajax.request("GET", api.getLocaleUrl(this.userId));
      // 供应商列表
      const supplier = ajax.request("GET", api.getSupplierUrl(this.userId));
      // 资产列表
      const propertyClass = ajax.request("GET", api.getPropertyClassUrl(this.userId));
      // 品牌
      const brand = ajax.request("GET", api.getBrandUrl(this.userId));

      Promise.all([locale, supplier, propertyClass, brand]).then(
        ([localeRes, supplierRes, propertyClassRes, brandRes]) => {
          this.localelist = localeRes.data.data;
          this.supplierlist = supplierRes.data.data;
          this.propertyClassList = propertyClassRes.data.data;
          this.brandList = brandRes.data.data;
          this.assetFormVisible = true;
        }
      );
      this.updateFlag = true;
    },
    updateCancel() {
      this.assetFormVisible = false;
    },
    //通知，弹窗
    notify(msg){
      const h = this.$createElement;
      this.$notify({
          title: 'tip',
          message: h('i', { style: 'color: teal'}, msg)
      });
    },
    //添加或修改表单确认
    assetFormConfirm() {
      const time = this.assetForm.createDate;
      const asset = Object.assign({}, this.assetForm);
      asset.createDate = moment(time).format("YYYY-MM-DD");
      /* asset.locale = {}
          asset.supplier = {}
          asset.locale.localeId = this.localeValue
          asset.supplier.supplierId = this.supplierValue */

      if (!this.assetForm.propertyName) {
        this.notify('请认真填写资产名称')
        return;
      }
      if (!this.localeValue) {
        this.notify('选择存放地点啊-_- !')
        return;
      }
      if (!this.supplierValue){
        this.notify('请选择供应商-_- !')
        return;
      }
      if (!this.propertyClassValue){
        this.notify('选择资产类别-_- !')
        return;
      }
      if (!this.brandValue){
        this.notify('懂不懂啊-_- !')
         return;
      }

      // 如果存放地点已修改
      if (this.localeFlag != this.localeValue) {
        console.log("以修改存放地点");
        // 改id
        asset.locale = {};
        //this.localeValue 为id值
        asset.locale.localeId = this.localeValue;
      }

      if (this.supplierFlag != this.supplierValue) {
        console.log("已修改供应商");
        asset.supplier = {};
        // this.supplierValue为id值
        asset.supplier.supplierId = this.supplierValue;
      }

      if (this.propertyClassFlag != this.propertyClassValue) {
        asset.propertyClass = {};
        asset.propertyClass.propertyClassId = this.propertyClassValue;
      }

      if (this.brandFlag != this.brandValue) {
        asset.brand = {};
        asset.brand.brandId = this.brandValue;
      }


      let url = api.getAssetUrl('');

      let method = "PUT"; // 修改
      let message = "恭喜你，修改成功!";

      if (this.updateFlag == false) {
        //默认未使用
        asset.propertyState = 1;
        method = "POST"; // 添加
        message = "恭喜你，添加成功!";
      }
      asset.userId = this.userId
      let jsonData = JSON.stringify(asset);
      console.log(jsonData);

      // ajax
      ajax.request(method, url, jsonData, this.header).then(res => {
        console.log(res);
        let code = res.data.errorCode;
        if (code == 0) {
          this.getBaseData();
          this.$message({
            message: message,
            type: "success"
          });
        } else {
          this.$message.error("操作失败，很可能是人品问题哦!");
        }
        this.assetFormVisible = false;
      });
    },
    // 状态转换
    formatState(row, column) {
      return format.formatPropertyState(row);
    },
    // 新增资产
    addAsset() {
      this.assetForm = {};

      this.localeValue = null;
      this.supplierValue = null;
      this.propertyClassValue = null;
      this.brandValue = null;
      // 获取存放地点列表
      const locale = ajax.request("GET", api.getLocaleUrl(this.userId));
      // 供应商列表
      const supplier = ajax.request("GET", api.getSupplierUrl(this.userId));
      // 资产类别列表
      const propertyClass = ajax.request("GET", api.getPropertyClassUrl(this.userId));
      // 品牌
      const brand = ajax.request("GET", api.getBrandUrl(this.userId));

      Promise.all([locale, supplier, propertyClass, brand]).then(
        ([localeRes, supplierRes, propertyClassRes, brandRes]) => {
          /* console.log(localeRes)
            console.log(supplierRes) */
            console.log(propertyClassRes);

          this.localelist = localeRes.data.data;
          this.supplierlist = supplierRes.data.data;
          this.propertyClassList = propertyClassRes.data.data;
          this.brandList = brandRes.data.data;
          this.assetFormVisible = true;
        }
      );
      this.assetFormVisible = true;
      this.updateFlag = false;
    },
    addCancel() {
      this.assetFormVisible = false;
      this.$refs["newAssetForm"].resetFields();
    },

    // 删除资产
    delAsset(asset) {
      this.$confirm("你将删除[" + asset.propertyName + "], 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let url = api.getAssetUrl() + asset.propertyId;
          // ajax
          let method = "DELETE";
          ajax.request(method, url).then(res => {
            let code = res.data.errorCode;
            if (code == 0) {
              this.getBaseData();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            }
            this.assetFormVisible = false;
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    filterState(value, row) {
      return row.propertyState == value;
    },
    getBaseData() {
      let url = api.getAssetUrl(this.userId)  + "/" + this.currentPage + "/" + this.pageSize;
      console.log(url);
      ajax.request("GET", url).then(res => {
        //console.log(JSON.stringify(res.data.data))
        this.tableData = res.data.data.data;
        this.totalPage = res.data.data.totalPage;
        console.log(res);
      });
    },
    updateObj(data) {
      console.log(data);
      this.assetForm = Object.assign({}, data);
    },
    paging(page) {
      const pageSize = this.pageSize;
      //对象的解构赋值
      const { currentPage } = page;
      this.currentPage = currentPage;
      let url = api.getAssetUrl(this.userId);
      url += "/" + currentPage + "/" + pageSize;
      console.log(url);

      ajax.request("GET", url).then(res => {
        console.log(res);

        this.tableData = res.data.data.data;
      });
    }
  },
  data() {
    return {
      // 表格数据
      tableData: [],
      // 添加或者更新表单
      assetForm: {},
      // dialog 资产 添加 表单
      borrowForm: {},
      // 修改 dialog
      assetFormVisible: false,
      // 借用 dialog
      borrowFormVisible: false,
      // 资产详情 dialog
      assetDetailVisible: false,
      updateFlag: true,

      formLabelWidth: "120px",

      // dialog 存放地点
      localelist: [],
      localeValue: null,
      // 供应商
      supplierlist: [],
      supplierValue: null,
      // 部门
      departmentlist: [],
      departmentValue: null,
      //资产类别
      propertyClassList: [],
      propertyClassValue: null,
      brandList: [],
      brandValue: null,

      // 当前状态 1 未使用 2 使用
      radio: 1,
      // 存放地点标记
      localeFlag: null,
      // 供应商标记
      supplierFlag: null,
      // 部门标记
      departmentFlag: null,
      propertyClassFlag: null,
      brandFlag: null,
      header: {
        "Content-Type": "application/json"
      },
      operation: "修改",
      dateformat: "入库日期",
      currentPage: 1,
      pageSize: 10,
      totalPage: null,
      userId: ''
    };
  },
  mounted() {
    /* ajax.request("GET", "http://localhost:9527/propertylist").then(res => {
        console.log(res)
        this.tableData = res.data
      }) */
    let user = storage.get('user')
    this.userId = user.userId
    this.getBaseData();
  },
  components: {
    "v-common": Common,
    "v-nav": Main
  }
};
</script>
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.detail p {
  font-size: 16px;
  margin-left: 20px;
  margin-top: 5px;
}

.detail h4 {
  margin-left: 20px;
}
</style>
