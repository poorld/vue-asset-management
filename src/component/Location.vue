<template>
    <div>

        <v-nav></v-nav>

        <el-col :span="20">

    <div class="add-btn">
        <el-button type="primary" @click="addLocation()" plain>新增</el-button>
      </div>

    <div class="container">

        <el-table
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column
            prop="localeName"
            label="名称">
        </el-table-column>

        <el-table-column
            prop="localeType"
            label="类型"
            :formatter="formatType">
        </el-table-column>

        <!-- :formatter="formatState" -->
        <el-table-column
            prop="localeState"
            label="状态"
            :formatter="formatState">
        </el-table-column>

        <el-table-column
            prop="localeExplain"
            label="说明">
        </el-table-column>

        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="disable(scope.row)" type="text" size="small">{{scope.row.localeState == 1 ? '禁用': '启用'}}</el-button>
            <el-button @click="editLocation(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="deleteLocation(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
        </el-table>


        <el-dialog title="存放地点" :visible.sync="dialogVisible">

            <el-form ref="form" :model="form">
                
                <el-form-item label="名称" prop="localeName" :label-width="formLabelWidth">
                    <el-input v-model="form.localeName"></el-input>
                </el-form-item>

                <el-form-item label="类型" prop="localeType" :label-width="formLabelWidth">
                    <el-radio-group v-model="form.localeType">
                    <el-radio :label="1">固定资产</el-radio>
                    <el-radio :label="2">耗材物品</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="状态" prop="localeState" :label-width="formLabelWidth">
                    <el-radio-group v-model="form.localeState">
                    <el-radio :label="1">正常</el-radio>
                    <el-radio :label="2">报废</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="说明" prop="localeExplain" :label-width="formLabelWidth">
                    <el-input v-model="form.localeExplain"></el-input>
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
import ajax from "../model/ajax.js";
import format from "../model/util.js";
import api from "../model/api.js";
import Main from "./Main.vue";
import storage from '../model/storage.js'

export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      form: {},
      formLabelWidth: "120px",
      localeState: null,
      updateFlag: true,
      userId: ''
    };
  },
  mounted() {
    /* ajax.request("GET", "http://localhost:9528/localelist").then(res => {
      console.log(res);
      this.tableData = res.data;
    }) */
    let user = storage.get('user')
    this.userId = user.userId
    this.getBaseData();
  },
  methods: {
    getBaseData() {
      let url = api.getLocaleUrl(this.userId) 
      ajax.request("GET", url).then(res => {
        console.log(res);

        this.tableData = res.data.data;
      });
    },
    addLocation() {
      this.form = {};
      this.dialogVisible = true;
      this.updateFlag = false;
    },
    formatState(row, column) {
      return format.formatLocaleState(row);
    },
    formatType(row, column) {
      return format.formatLocaleType(row);
    },
    // 修改存放地点
    editLocation(location) {
      // console.log(location)
      let obj = Object.assign({}, location);
      this.form = obj;
      this.dialogVisible = true;
      this.updateFlag = true;
    },
    dialogConfirm() {
      // const jsonData = JSON.stringify(this.form);
      // console.log(jsonData);
      const h = this.$createElement;
      if (!this.form.localeName){
        this.$notify({
          title: 'tip',
          message: h('i', { style: 'color: teal'}, '存放地点名称不能为空!')
        });
        return
      }

      if (!this.form.localeType){
        this.$notify({
          title: 'tip',
          message: h('i', { style: 'color: teal'}, '存放地点类型不能为空!')
        });
        return
      }

      this.form.userId = this.userId
      const jsonData = JSON.stringify(this.form);
      
      // ajax
      let method = "POST"; // 添加
      let url = api.getLocaleUrl('');
      let message = "恭喜你，添加成功!";
      if (this.updateFlag) {
        method = "PUT"; // 更新
        message = "恭喜你，修改成功!";
      }
      ajax
        .request(method, url, jsonData, this.$header)
        .then(res => {
          console.log(res);
          let code = res.data.errorCode;
          if (code == 0) {
            this.getBaseData();
            this.dialogVisible = false;
            this.$message({
              message: message,
              type: "success"
            });
          } else {
            this.$message.error("操作失败，很可能是人品问题哦!");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 删除
    deleteLocation(locale) {
      let url = api.getLocaleUrl(locale.localeId)
      let method = "DELETE";
      ajax
        .request(method, url)
        .then(res => {
          console.log(res);
          let code = res.data.errorCode;
          if (code == 0) {
            this.getBaseData();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 禁用或启用
    disable(locale) {
      let obj = {};
      obj.localeId = locale.localeId;
      obj.localeState = locale.localeState == 1 ? 2 : 1;
      let url = api.getLocaleUrl('');
      let method = "PUT";
      ajax.request(method, url, JSON.stringify(obj), this.$header).then(res => {
        console.log(res);
        let code = res.data.errorCode;
        if (code == 0) {
          this.getBaseData();
        }
      });
    },
    
  },
  components: {
      "v-nav": Main
    }
};
</script>