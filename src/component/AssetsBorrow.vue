<!-- 资产借用 -->
<template>
    <div>

        <v-nav></v-nav>

        <el-col :span="20">
        <div class="add-btn">
            <el-button type="success" circle @click="borrow()" plain>新增</el-button>
        </div>

        <div class="container">

        <v-common :tableData="tableData"
                :operation="operation"
                :dateformat="dateformat"
                v-on:modification="modification"></v-common>


        <!-- 新增借用表单 -->
        <el-dialog title="资产借用" :visible.sync="borroFormVisible">
        <el-form :model="form">

            <el-form-item label="选择资产" :label-width="formLabelWidth">
            <el-select v-model="assetsValue" placeholder="请选择">
            <el-option
                v-for="item in unusedAsset"
                :key="item.propertyId"
                :label="item.propertyName"
                :value="item.propertyId">
            </el-option>
            </el-select>
            </el-form-item>

            <el-form-item label="借用部门" :label-width="formLabelWidth">
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
                v-model="textarea">
                </el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="borroFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="borrowConfirm()">确 定</el-button>
        </div>
        </el-dialog>

        </div>

    </el-col>
    </div>
</template>

<script>
import api from "../model/api.js";
import ajax from "../model/ajax.js";
import Common from "./AssetsCommon.vue";
import Main from "./Main.vue";
import storage from "../model/storage.js";

export default {
  data() {
    return {
      tableData: [],
      operation: "归还",
      borroFormVisible: false,
      form: {},
      formLabelWidth: "120px",
      unusedAsset: [],
      assetsValue: "",
      department: [],
      departmentValue: null,
      textarea: null,
      dateformat: "借用日期",
      userId: ""
    };
  },
  methods: {
    //新增资产按钮
    borrow() {
      // 获取未使用的资产
      const unusedAssetUrl = api.getunusedAssetUrl(this.userId);
      // 获取已归还的资产
      const returnedAssetUrl = api.getReturnedPropertyUrl(this.userId);

      let method = "GET";
      // 获取部门
      const departmentUrl = api.getDepartmentUrl(this.userId);

      let unusedAsset = ajax.request(method, unusedAssetUrl);
      let returnedAsset = ajax.request(method, returnedAssetUrl);
      let department = ajax.request(method, departmentUrl);

      this.assetsValue = null;
      this.departmentValue = null;

      Promise.all([unusedAsset, returnedAsset, department]).then(
        ([unusedAssetRes, returnedAssetRes, departmentRes]) => {
          //未使用资产
          let arr1 = unusedAssetRes.data.data;
          //已归还资产
          let arr2 = returnedAssetRes.data.data;
          //资产合并
          let arr = [];
          arr = arr.concat(arr1, arr2);
          this.unusedAsset = arr;
          this.department = departmentRes.data.data;
          this.borroFormVisible = true;
        }
      );
    },
    //资产归还
    modification(data) {
      /* let obj = Object.assign({},data)
            // console.log(obj);
            this.form = obj
            this.borroFormVisible = true */
        let obj = Object.assign({}, data);
        // 状态变为以归还
        obj.propertyState = 3;
        const url = api.getAssetUrl('');
        const method = "PUT";
        let JsonObj = JSON.stringify(obj);
        console.log(JsonObj);

        this.$confirm("你想归还资产["+obj.propertyName+"]吗?", "提示", {
            confirmButtonText: "很想",
            cancelButtonText: "不，我不想",
            type: "warning"
        })
        .then(() => {
            return ajax.request(method, url, JsonObj, this.$header)
        }).then(res => {
            console.log(res);
            this.getBasicData();
            this.$message({
            type: "success",
            message: "归还成功!"
          });
        })
        .catch((err) => {
            console.log(err);

          this.$message({
            type: "info",
            message: "不，你不想"
          });
        });


      /* ajax.request(method, url, JsonObj, this.$header).then(res => {
        console.log(res);
        this.getBasicData();
      }); */
    },
    //资产借用确定
    borrowConfirm() {
      let date = new Date();
      let dateStr = date.toLocaleDateString().replace(/\//g, "-");
      let obj = {};
      obj.propertyId = this.assetsValue;

      const h = this.$createElement;
      if (!obj.propertyId) {
        this.$notify({
          title: "tip",
          message: h("i", { style: "color: teal" }, "请选择借用资产!")
        });
        return;
      }

      obj.department = {};
      obj.department.departmentId = this.departmentValue;
      if (!obj.department.departmentId) {
        this.$notify({
          title: "tip",
          message: h("i", { style: "color: teal" }, "请选择使用部门!")
        });
        return;
      }

      // 说明
      obj.propertyDescr = this.textarea;
      // 借用日期
      obj.propertyDate = dateStr;
      // 改为借用
      obj.propertyState = 2;
      obj.userId = this.userId;
      console.log(obj);
      //更新
      const url = api.getAssetUrl("");
      const method = "PUT";
      let JsonObj = JSON.stringify(obj);
      ajax.request(method, url, JsonObj, this.$header).then(res => {
        console.log(res);
        this.getBasicData();
        this.borroFormVisible = false;
      });
    },
    getBasicData() {
      let url = api.getborrowedAssetUrl(this.userId);
      ajax.request("GET", url).then(res => {
        this.tableData = res.data.data;
      });
    }
  },
  mounted() {
    let user = storage.get("user");
    this.userId = user.userId;
    this.getBasicData();
  },
  components: {
    "v-common": Common,
    "v-nav": Main
  }
};
</script>
