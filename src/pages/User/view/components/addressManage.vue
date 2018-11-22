<template>
  <div id="addressManage">
    <el-form label-width="100px" :model="formData">
      <el-container>
        <el-row>
          <el-col :span="24">
            <el-form-item label="所在区域 *" class="located">
              <el-select placeholder="请选择" v-model="options[0].label">
                <el-option v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
              </el-select>
              <area-cascader type="text"
                            :data="pcaa"
                            :aria-level="1"
                            :level="1"
                             placeholder="请选择地区"
                             v-model="formData.province"></area-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="详细地址 *">
              <el-input placeholder="详细地址" size="mini" v-model="formData.detailed_address" :clearable="true"></el-input>
              <!-- <el-input type="textarea" placeholder="详细地址" v-model="formData.detailed_address"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="邮政编码">
              <el-input type="number" size="mini" maxlength="6" placeholder="邮政编码" v-model="formData.zip_code" :clearable="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="收货人姓名 *">
              <el-input v-model="formData.name" size="mini" maxlength="12" placeholder="收货人姓名" :clearable="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="手机号码">
              <el-select placeholder="请选择" size="mini" v-model="options[0].value">
                <el-option v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
              </el-select>
              <el-input type="number" size="mini" v-model="formData.contact_mobile" placeholder="手机号码" :clearable="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="电话号码" class="contact_phone">
              <el-select placeholder="请选择" size="mini" v-model="options[0].value">
                <el-option v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"></el-option>
              </el-select>
              <el-input v-model="formData.contact_phone.region" size="mini" placeholder="区号"></el-input>
              <span class="delimiter">　－　</span>
              <el-input v-model="formData.contact_phone.tel" size="mini" placeholder="电话号码"></el-input>
              <span class="delimiter">　－　</span>
              <el-input v-model="formData.contact_phone.extension" size="mini" placeholder="分机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-checkbox v-model="formData.default">设置为默认收货地址</el-checkbox>
            <el-button size="mini" type="primary" @click="addAddress">新增地址</el-button>
          </el-col>
        </el-row>
      </el-container>
    </el-form>

    <el-table :data="tableData.list" style="width: 100%;margin-top: 2rem;" max-height="250">
      <el-table-column prop="default" label="默认地址" width="150">
        <template slot-scope="{row,$index}">
          <el-radio v-model="defaultAddress" :label="row.slug" @change="changeDefault($index)">默认地址</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="收货人姓名" width="120">
        <template slot-scope="{row,$index}">
            <el-input v-if="row.isEdit" v-model="row.name"></el-input>
            <span v-else>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="province" label="地区" width="120">
        <template slot-scope="{row,$index}">
            <el-input v-if="row.isEdit" v-model="row.province"></el-input>
            <span v-else>{{ row.province }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="detailed_address" label="详细地址" width="120">
        <template slot-scope="{row,$index}">
            <el-input v-if="row.isEdit" v-model="row.detailed_address"></el-input>
            <span v-else>{{ row.detailed_address }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="zip_code" label="邮编" width="120">
        <template slot-scope="{row,$index}">
            <el-input v-if="row.isEdit" v-model="row.zip_code"></el-input>
            <span v-else>{{ row.zip_code }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="contact_mobile" label="手机号" width="120">
        <template slot-scope="{row,$index}">
            <el-input v-if="row.isEdit" v-model="row.contact_mobile"></el-input>
            <span v-else>{{ row.contact_mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="{ row, $index }">
          <el-button type="text" v-if="row.isEdit" size="small" @click="saveRow(row,$index)">保存</el-button>
          <el-button type="text" v-else size="small" @click="editRow($index)">修改</el-button>
          <el-button type="text" size="small" @click="deleteRow(row.slug,$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { AreaCascader } from "vue-area-linkage";
import { pca, pcaa } from "area-data";
import "vue-area-linkage/dist/index.css";
export default {
  name: "addressManage",
  data() {
    return {
      options: [{ value: "中国大陆 +86", label: "中国大陆" }],
      pca: pca,
      pcaa: pcaa,
      formData: {
        province: [],
        detailed_address: "",
        zip_code: "",
        name: "",
        contact_mobile: "",
        contact_phone: {
          region: "",
          tel: "",
          extension: ""
        },
        default: false
      },
      defaultAddress: [],
      tableData: {}
    };
  },
  methods: {
    addAddress() {
      let that = this,
        loading = this.$loading({ lock: true }),
        params = {
          name: that.formData.name,
          province: that.formData.province[0],
          city: that.formData.province[1],
          area: that.formData.province[2],
          detailed_address: that.formData.detailed_address,
          contact_mobile: that.formData.contact_mobile,
          contact_phone: Object.values(that.formData.contact_phone).join("-"),
          zip_code: that.formData.zip_code,
          default: that.formData.default
        };
      that
        .$post("members/address/create", params)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.getAddressList();
        })
        .catch(error => loading.close());
    },
    changeDefault(index) {
      const that = this,
        loading = this.$loading({ lock: true });
      that
        .$post("members/default-address/" + that.tableData.list[index].slug, {
          default: 1
        })
        .then(response => {
          loading.close();
          if (response.status != 200) return false;

          that.defaultAddress = that.tableData.list[index].slug;
        })
        .catch(error => loading.close());
    },
    editRow(index) {
      const that = this;
      that.tableData.list[index].isEdit = true;
    },
    saveRow(row, index) {
      const that = this,
        loading = this.$loading({ lock: true });
      that
        .$post("members/address/edit/" + row.slug, row)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;

          that.$message({ message: response.message, type: "success" });
          that.tableData.list[index].isEdit = false;
        })
        .catch(error => loading.close());
    },
    deleteRow(slug, index) {
      const loading = this.$loading({ lock: true });
      let that = this;
      that
        .$post("members/address/delete/" + slug)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;

          that.tableData.list.splice(index, 1);
        })
        .catch(error => loading.close());
    },
    getAddressList() {
      const loading = this.$loading({ lock: true }),
        that = this;
      that
        .$get("members/address")
        .then(response => {
          loading.close();
          if (response.status != 200) return false;

          response.data.list.forEach(e => {
            e.isEdit = false;
            if (e.default) that.defaultAddress = e.slug;
          });
          that.tableData = response.data;
        })
        .catch(error => loading.close());
    }
  },
  created() {
    this.getAddressList();
  }
};
</script> 
<style lang="less">
#addressManage {
  padding: 2rem;
  color: #666666;
  width: 100%;
  box-sizing: border-box;
  .el-container {
    .el-row {
      .el-col {
        .el-form-item {
          margin-bottom: 1rem;
          .el-form-item__content {
            display: flex;
            > div {
              margin-right: 1rem;
            }
            .area-cascader-wrap {
              height: 100%;
              .area-select {
                height: 40px;
                box-sizing: border-box;
                .area-selected-trigger {
                  padding: 0 1.2rem;
                }
              }
            }
          }
          @media screen and (max-width: 720px) {
            .el-form-item__content {
              flex-wrap: wrap;
              > div {
                margin-bottom: 1rem;
              }
              span {
                display: none;
              }
            }
          }
        }
        .contact_phone {
          .el-form-item__content {
            .el-input {
              width: 150px;
            }
            .delimiter {
              line-height: 3;
            }
          }
        }
        &:last-child {
          text-align: center;
          label {
            display: block;
            margin-bottom: 1rem;
          }
        }
      }
    }
  }
}
</style>
