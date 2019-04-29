<template>
  <div id="createdReport" class="modal fade">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body" id="reportBody">
          <el-form :model="form" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="客服人员" prop="members">
              <el-select v-model="form.members" multiple>
                <el-option v-for="item in userBranch" :key="item.id" :label="item.display_name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="责任方">
              <el-select v-model="form.responsible_unit">
                <el-option label="厂内" value="1"></el-option>
                <el-option label="客户" value="2"></el-option>
                <el-option label="无法判定" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="widthFull" label="不良原因分析">
              <el-input type="textarea" v-model="form.reason"></el-input>
            </el-form-item>
            <el-form-item class="widthFull" label="处理方案">
              <el-input type="textarea" v-model="form.solution"></el-input>
            </el-form-item>
            <el-form-item label="图片" class="fileList">
              <el-upload
                action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
                list-type="picture-card"
                :before-upload="upload"
                :before-remove="remove"
                :file-list="form.fileUrl"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <div class="modal-footer">
          <el-button size="mini" type="primary" @click="commit">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "createdReport",
  data() {
    let user = JSON.parse(localStorage.getItem("user") || "{}");
    return {
      user: user,
      form: {
        members: "",
        customer_linkman: "",
        customer_mobile: "",
        specification: "",
        quantity: 1,
        description: "",
        reason: "",
        solution: "",
        responsible_unit: "客户",
        advice: "",
        service_at: "",
        service_id: user.user.id,
        images: [],
        fileUrl: []
      },
      rules: {
        members: [
          { required: true, message: "请输入客服名称", trigger: "blur" }
        ],
        customer_linkman: [
          { required: true, message: "请输入客户联系人", trigger: "blur" }
        ],
        customer_mobile: [
          { required: true, message: "请输入联系人手机", trigger: "blur" }
        ],
        specification: [
          { required: true, message: "请输入产品型号", trigger: "blur" }
        ],
        service_at: [
          { required: true, message: "请输入服务时间", trigger: "blur" }
        ]
      },
      userBranch: [],
      data: []
    };
  },
  props: {
    active: Object
  },
  methods: {
    getBranch() {
      this
        .$get(`members/user_group`, { slug: 'customer' })
        .then(response => {
          if (response.status != 200) return false;
          response.data.list.forEach(e =>
            e.members.forEach(v => this.userBranch.push(v))
          );
        })
        .catch(err => console.error(err));
    },
    upload(file) {
      let form = new FormData(),
        that = this;
      form.append("slug", "customer_service");
      form.append("upload", file);
      that
        .$upload("files/upload", form)
        .then(response => {
          if (response.status != 200) return false;
          that.form.fileUrl.push({
            name: file.name,
            url: response.data.url
          });
          that.form.images.push(response.data.upload.id);
        })
        .catch(err => console.error(err));
    },
    remove(item) {
      this.form.fileUrl.forEach((e, k) => {
        if (e.uid == item.uid) {
          this.form.images.splice(k, 1);
          this.form.fileUrl.splice(k, 1);
        }
      });
    },
    commit() {
      let that = this,
        self = that.form;
      that.$refs["form"].validate(v => {
        if (!v) return false;
        that
          .$post(`service/report/order/record/create`, {
            responsible_unit: self.responsible_unit,
            reason: self.reason,
            solution: self.solution,
            service_order_id: this.active.id || this.active.data[this.active.index].id,
            members: self.members.join(','),
            images: self.images.join(",")
          })
          .then(response => {
            if (response.status != 200) return false;
            if (this.data[this.active.index].record_ids){
              this.data[this.active.index].record_ids = this.data[this.active.index].record_ids.split(",");
              this.data[this.active.index].record_ids.push(response.data.id);
              this.data[this.active.index].record_ids = this.data[this.active.index].record_ids.join(",");
            } else this.data[this.active.index].record_ids = response.data.id.toString();
            this.$emit("record", this.data);
            that.close();
            that.clearForm();
          })
          .catch(err => console.error(err));
      });
    },
    clearForm() {
      this.form = {
        members: [],
        customer_linkman: "",
        customer_mobile: "",
        specification: "",
        quantity: 1,
        description: "",
        reason: "",
        solution: "",
        responsible_unit: "客户",
        advice: "",
        service_at: "",
        service_id: this.user.user.id,
        images: [],
        fileUrl: []
      };
    },
    close() {
      $("#createdReport").modal("hide");
    }
  },
  mounted() {
    this.getBranch();
    $("#report #createdReport").on("shown.bs.modal", e => {
      this.data = this.active.data;
      console.log(this.active)
    })
    $("#application #createdReport").on("shown.bs.modal", e => {
      this.data = this.active.data;
      console.log(this.active)
    })
  }
};
</script>
<style lang="less">
#createdReport {
  z-index: 1055;
  #reportBody {
    .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        &:nth-child(1),
        &:nth-child(2) {
          width: 50%;
        }
      }
      .widthFull {
        width: 100%;
      }
    }
    .fileList {
      width: 100%;
      padding-bottom: 0.5rem;
      max-width: none;
      .el-upload--picture-card {
        width: 90px;
        height: 90px;
        line-height: 102px;
        .el-upload__input {
          opacity: 0;
          display: none;
        }
      }
      .el-upload-list {
        .el-upload-list__item {
          width: 90px;
          height: 90px;
        }
      }
    }
  }
}
</style>