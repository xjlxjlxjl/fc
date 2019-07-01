<template>
<div>
  <div class="modal fade" id="addOrderModal" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <el-form :model="form" size="mini" ref="form" :rules="rules">
            <p class="lead widthFull">基本信息</p>
            <div class="widthFull item">
              <el-form-item label="客户编码" prop="customer_code">
                <el-input v-model="form.customer_code">
                  <button slot="suffix" class="btn btn-default btn-xs" @click="customerModal = !customerModal">
                    <i class="el-icon-arrow-down"></i>
                  </button>
                </el-input>
              </el-form-item>
              <el-form-item label="客户名称" prop="customer_name">
                <el-input v-model="form.customer_name"></el-input>
              </el-form-item>
              <el-form-item label="联系人" prop="contact">
                <el-select v-model="form.contact_s" @change="userChange($event, 'contact')">
                  <el-option 
                    v-for="(item, index) in form.contact_arr" 
                    :key="index"
                    :label="item.name" 
                    :value="index"
                  ></el-option>
                </el-select>
                <button class="btn btn-xs btn-add" @click="addConsigneeModal = !addConsigneeModal;addConsigneeState = 1">新增</button>
              </el-form-item>
              <el-form-item label="手机号" prop="contact_mobile">
                <el-input v-model="form.contact_mobile"></el-input>
              </el-form-item>
              <el-form-item label="业务员" prop="clerk_id">
                <el-select v-model="form.clerk_id">
                  <el-option 
                    v-for="(item, index) in form.salesman_arr" 
                    :key="index"
                    :label="item.display_name" 
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="收货人" prop="consignee">
                <el-select v-model="form.consignee_s" @change="userChange($event, 'consignee')">
                  <el-option 
                    v-for="(item, index) in form.contact_arr" 
                    :key="index"
                    :label="item.name" 
                    :value="index"
                  ></el-option>
                </el-select>
                <button class="btn btn-xs btn-add" @click="addConsigneeModal = !addConsigneeModal;addConsigneeState = 2">新增</button>
              </el-form-item>
              <el-form-item label="收货人手机" prop="mobile">
                <el-input v-model="form.mobile"></el-input>
              </el-form-item>
              <el-form-item label="客户要求交期" prop="delivery_period">
                <el-date-picker v-model="form.delivery_period" value-format="yyyy-MM-dd HH:mm:ss" type="date"></el-date-picker>
              </el-form-item>
              <el-form-item label="发票类型">
                <el-select v-model="form.invoice_type_id">
                  <el-option
                    v-for="item in invoiceType"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="付款条件">
                <el-select v-model="form.terms_of_payment">
                  <el-option 
                    v-for="(item, index) in form.terms_of_payment_arr"
                    :key="index"
                    :label="item.text" 
                    :value="JSON.stringify(item)"
                  ></el-option>
                </el-select>
                <button class="btn btn-xs btn-add" @click="payMentModal = !payMentModal">新增</button>
              </el-form-item>
              <el-form-item label="付款方式">
                <el-select v-model="form.payment_type_id">
                  <el-option v-for="item in paymenType"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="text" v-model="form.remark" placeholder="备注"></el-input>
              </el-form-item>
            </div>
            <p class="lead widthFull">产品信息</p>
            <div class="widthFull item">
              <el-form-item class="widthFull" style="overflow-x: auto;">
                <el-table :data="form.items" border style="width: 100%">
                  <el-table-column prop="index" label="序号" width="50">
                    <template slot-scope="{ row, $index }">
                      <span>{{ $index + 1 }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="material_code" label="料品编码" width="200">
                    <template slot-scope="{ row, $index }">
                      <el-input v-model="row.material_code">
                        <button slot="suffix" class="btn btn-default btn-xs" @click="materialModal = !materialModal;index = $index;getMater(false)">
                          <i class="el-icon-arrow-down"></i>
                        </button>
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="料品名称" width="200">
                    <template slot-scope="{ row, $index }">
                      <el-input v-model="row.name">
                        <button slot="suffix" class="btn btn-default btn-xs" @click="materialModal = !materialModal;index = $index;getMater(false)">
                          <i class="el-icon-arrow-down"></i>
                        </button>
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="specifications" label="料品规格" width="200">
                    <template slot-scope="{ row, $index }">
                      <el-input v-model="row.specifications">
                        <button slot="suffix" class="btn btn-default btn-xs" @click="materialModal = !materialModal;index = $index;getMater(false)">
                          <i class="el-icon-arrow-down"></i>
                        </button>
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="unit" label="单位">
                    <template slot-scope="{ row }">
                      <el-input v-model="row.unit"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="image" label="图片">
                    <template slot-scope="{ row }">
                      <img v-for="item in row.image" :key="item" :src="item" style="max-width: 50px; max-height: 50px;">
                    </template>
                  </el-table-column>
                  <el-table-column prop="quantity" label="数量">
                    <template slot-scope="{ row }">
                      <el-input v-model="row.quantity"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="price" label="单价">
                    <template slot-scope="{ row }">
                      <el-input v-model="row.price"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="shipping_schedule_s" label="出货计划" width="90">
                    <template slot-scope="{ $index }">
                      <button class="btn btn-sm" @click="shipmentModal = !shipmentModal;index = $index">编辑计划</button>
                    </template>
                  </el-table-column>
                  <el-table-column prop="remark" label="备注" width="150">
                    <template slot-scope="{ row }">
                      <el-input v-model="row.remark"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="50">
                    <template slot-scope="{ $index }">
                      <el-button type="text" @click="form.items.splice($index, 1)">
                        <i class="el-icon-delete" style="font-size: 2.1rem"></i>
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-button v-if="!row.id" type="info" size="mini" style="width: 100%;" @click="form.items.push({ material_id: '', material_code: '', name: '', specifications: '', quantity: '', price: '', shipping_schedule_s: [], remark: '' })">
                <i class="el-icon-plus"></i>
              </el-button>
            </div>
            <p class="lead widthFull">发货信息</p>
            <div class="widthFull item">
              <el-form-item label="包装方式" prop="packing_method">
                <el-input v-model="form.packing_method"></el-input>
              </el-form-item>
              <el-form-item label="送货方式" prop="delivery_method">
                <el-input v-model="form.delivery_method"></el-input>
              </el-form-item>
              <el-form-item label="邮政编码" prop="postcode">
                <el-input v-model="form.postcode"></el-input>
              </el-form-item>
              <el-form-item label="地址" prop="address">
                <el-input v-model="form.address"></el-input>
              </el-form-item>
            </div>
            <p class="lead widthFull">合同信息</p>
            <div class="widthFull item">
              <el-form-item label="合同条款" prop="terms_of_contract">
                <el-button type="info" @click="contractModal = !contractModal">编辑条款</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="modal-footer">
          <el-button size="mini" type="primary" @click="onSubmit">保存</el-button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade customer" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <table id="table"></table>
        <div class="modal-footer">
          <el-button type="info" size="mini" @click="setCustomers">确定</el-button>
          <el-button type="info" size="mini" data-dismiss="modal">取消</el-button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade addConsignee" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <el-form size="mini" ref="form" label-width="60px">
            <el-form-item label="联系人">
              <el-input v-model="acgModal.name"></el-input>
            </el-form-item>
            <el-form-item label="职务">
              <el-input v-model="acgModal.position"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="acgModal.mobile"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="acgModal.email"></el-input>
            </el-form-item>
            <el-form-item class="widthFull text-center">
              <el-button type="info" data-dismiss="modal">取消</el-button>
              <el-button type="info" @click="addConsignee">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade material" role="dialog">
    <div class="modal-dialog modal-lg" role="document" style="width: 100%;max-width: 1280px;">
      <div class="modal-content">
        <el-table
          :data="mater.data"
          border
          style="width: 100%"
          height="500"
          highlight-current-row
          @current-change="materChange"
        >
          <!-- <el-table-column type="selection"></el-table-column> -->
          <el-table-column prop="material_number" label="物料编码"></el-table-column>
          <el-table-column prop="name" label="物料名称"></el-table-column>
          <el-table-column prop="material_specification" label="料品规格"></el-table-column>
          <el-table-column prop="material_category.name" label="料品类别"></el-table-column>
          <el-table-column prop="item_unit" label="主单位"></el-table-column>
          <el-table-column prop="image" label="图片">
            <template slot-scope="{ row }">
              <p v-for="(e, k) in row.image" :key="k"><a style="white-space: nowrap;" target="_blank" :href="e">{{e.split('/').pop()}}</a></p>
            </template>
          </el-table-column>
          <el-table-column prop="drawing_pdf" label="工程图号">
            <template slot-scope="{ row }">
              <a
                v-for="item in row.drawing_pdf"
                :key="item"
                :href="item"
                :download="item.split('/').pop()"
                target="_blank"
              >{{ item.split('/').pop() }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="barcode" label="条码"></el-table-column>
          <el-table-column prop="date" label="颜色"></el-table-column>
          <el-table-column prop="date" label="有效期"></el-table-column>
          <el-table-column prop="max_inventory" label="最大库存"></el-table-column>
          <el-table-column prop="min_inventory" label="最小库存"></el-table-column>
          <el-table-column prop="manufacturer" label="生产厂家"></el-table-column>
          <el-table-column prop="respository.name" label="仓库"></el-table-column>
          <el-table-column prop="attributes" label="BOM单位"></el-table-column>
          <el-table-column prop="date" label="料品类别" width="400px">
            <template slot-scope="{ row }">
              <div class="materialsType">
                <div>
                  <input type="checkbox" v-if="row.attributes.includes('1')" checked="checked" disabled>
                  <input type="checkbox" v-else disabled> 采购件
                </div>
                <div>
                  <input type="checkbox" v-if="row.attributes.includes('2')" checked="checked" disabled>
                  <input type="checkbox" v-else disabled> 自制件
                </div>
                <div>
                  <input type="checkbox" v-if="row.attributes.includes('3')" checked="checked" disabled>
                  <input type="checkbox" v-else disabled> 委外件
                </div>
                <div>
                  <input type="checkbox" v-if="row.attributes.includes('4')" checked="checked" disabled>
                  <input type="checkbox" v-else disabled> 销售件
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="attributes" label="料品属性"></el-table-column>
          <el-table-column prop="date" label="损耗率"></el-table-column>
          <el-table-column prop="weight" label="净重"></el-table-column>
          <el-table-column prop="total_weight" label="毛重"></el-table-column>
          <el-table-column prop="dimension" label="材积"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column prop="density" label="密度"></el-table-column>
          <el-table-column prop="standard_model" label="模具号"></el-table-column>
          <el-table-column prop="material_level" label="料品等级"></el-table-column>
          <el-table-column prop="date" label="材质"></el-table-column>
          <el-table-column prop="standard_cost_price" label="进价"></el-table-column>
          <el-table-column prop="standard_uniform_price" label="售价"></el-table-column>
          <el-table-column prop="standard_single_price" label="标准价"></el-table-column>
          <el-table-column prop="date" label="英文名称"></el-table-column>
          <el-table-column prop="minimum_purchase_quantity" label="最小采购量"></el-table-column>
          <el-table-column prop="date" label="最小批量"></el-table-column>
          <el-table-column prop="date" label="采购提前期"></el-table-column>
          <el-table-column prop="date" label="出货免检"></el-table-column>
          <el-table-column prop="date" label="主供应商"></el-table-column>
          <el-table-column prop="date" label="供应商简称"></el-table-column>
          <el-table-column prop="created_at" label="生效"></el-table-column>
          <el-table-column prop="pinyin_code" label="拼音码"></el-table-column>
          <el-table-column prop="length" label="料品长"></el-table-column>
          <el-table-column prop="width" label="料品宽"></el-table-column>
          <el-table-column prop="height" label="料品高"></el-table-column>
          <el-table-column prop="state" label="状态"></el-table-column>
          <el-table-column prop="member" label="管理者"></el-table-column>
          <el-table-column prop="update_at" label="修改日期"></el-table-column>
          <el-table-column prop="update_by" label="修改用户"></el-table-column>
        </el-table>
        <div class="condition">
          <div>
            <span>查找关键字</span>
            <el-input size="mini" v-model="mater.search" @blur="getMater(true)"></el-input>
          </div>
          <div>
            <span>申请日期</span>
            <el-date-picker
              size="mini"
              v-model="mater.date"
              @change="getMater(true)"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            ></el-date-picker>
          </div>
          <div>
            <button class="btn btn-primary btn-sm" @click="addMater">确定</button>
            <button class="btn btn-default btn-sm" data-dismiss="modal" aria-label="Close">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade payMentModal" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <div class="terms">
            <div>
              <b>定金</b>
              <p>合同签订后，付
                <input type="text" v-model="payMenTerms.deposit.pay_rate"> %订单总额
              </p>
            </div>
            <div>
              <div>
                <b>出货前</b>
                <p>出货前，付
                  <input type="text" v-model="payMenTerms.shipment_before.pay_rate"> %订单总额
                </p>
              </div>
              <div>
                <b>出货后</b>
                <p v-for="(item, index) in payMenTerms.shipment_after" :key="index">出货后
                  <input type="text" v-model="item.day"> 天，付
                  <input type="text" v-model="item.pay_rate"> %订单总额
                  <i class="el-icon-delete" @click="payMenTerms.shipment_after.splice(index, 1)"></i>
                </p>
                <el-button size="mini" type="info" @click="payMenTerms.shipment_after.push({ day: '', pay_rate: '' })">
                  <i class="el-icon-plus"></i> 添加
                </el-button>
              </div>
            </div>
            <div>
              <div>
                <b>验收后</b>
                <p v-for="(item, index) in payMenTerms.accept_after" :key="index">验收后
                  <input type="text" v-model="item.day"> 天，付
                  <input type="text" v-model="item.pay_rate"> %订单总额
                  <i class="el-icon-delete" @click="payMenTerms.accept_after.splice(index, 1)"></i>
                </p>
                <el-button size="mini" type="info" @click="payMenTerms.accept_after.push({ day: '', pay_rate: '' })">
                  <i class="el-icon-plus"></i> 添加
                </el-button>
              </div>
              <div>
                <b>验收后</b>
                <p>验收后
                  <input type="text" v-model="payMenTerms.accept_after_balance.day"> 天，付清订单余款
                  <input type="text" v-model="payMenTerms.accept_after_balance.pay_rate"> %
                </p>
              </div>
            </div>
            <div>
              <div>
                <b>开票后</b>
                <p v-for="(item, index) in payMenTerms.billing_after" :key="index">开票后
                  <input type="text" v-model="item.day"> 天，付
                  <input type="text" v-model="item.pay_rate"> %订单总额
                  <i class="el-icon-delete" @click="payMenTerms.billing_after.splice(index, 1)"></i>
                </p>
                <el-button size="mini" type="info" @click="payMenTerms.billing_after.push({ day: '', pay_rate: '' })">
                  <i class="el-icon-plus"></i> 添加
                </el-button>
              </div>
              <div>
                <b>开票后</b>
                <p>开票后
                  <input type="text" v-model="payMenTerms.billing_after_balance.day"> 天，付清订单余款
                  <input type="text" v-model="payMenTerms.billing_after_balance.pay_rate"> %
                </p>
              </div>
            </div>
          </div>
          <div align="center" style="margin-top: 1rem;">
            <el-button size="small" type="info" data-dismiss="modal">取消</el-button>
            <el-button size="small" type="primary" @click="addPayment">保存</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade shipment" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <el-table :data="form.items[index].shipping_schedule_s" size="mini" border stripe>
          <el-table-column prop="date" label="出货日期" width="250">
            <template slot-scope="{ row }">
              <el-date-picker
                v-model="row.date"
                type="date"
                size="mini"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column prop="number" label="出货数量" width="250">
            <template slot-scope="{ row }">
              <el-input-number v-model="row.number" size="mini" :precision="2"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column width="97">
            <template slot-scope="{ $index }">
              <el-button type="text" @click="form.items[index].shipping_schedule_s.splice($index, 1)">
                <i class="el-icon-delete" style="font-size: 2.1rem;"></i>
              </el-button>
            </template>
          </el-table-column>          
        </el-table>
        <el-button type="info" size="mini" style="width: 100%;" @click="form.items[index].shipping_schedule_s.push({ date: '', number: '' })">
          <i class="el-icon-plus"></i>
        </el-button>
      </div>
    </div>
  </div>
  <div class="modal fade addContract" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <div id="addToolbar"></div>
          <div id="addEditor"></div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade contactModal" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <el-table :data="contact" border style="width: 100%">
          <el-table-column prop="name" label="联系人"></el-table-column>
          <el-table-column prop="position" label="职务"></el-table-column>
          <el-table-column prop="mobile" label="手机号"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import CKEditor from "@ckeditor/ckeditor5-build-classic";
import "@ckeditor/ckeditor5-build-classic/build/translations/zh-cn";

export default {
  name: "addOrderModal",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      form: {
        customer_id: 0,
        customer_slug: "",
        customer_code: "",
        customer_name: "",
        contact_arr: [],
        contact_s: "",
        contact: "",
        contact_mobile: "",
        clerk_id: "",
        salesman_arr: [],
        consignee: "",
        consignee_s: "",
        mobile: "",
        address: "",
        invoice_type_id: "",
        terms_of_payment_arr: [],
        terms_of_payment: "",
        payment_type_id: "",
        currency: "",
        delivery_period: "",
        delivery_method: "",
        packing_method: "",
        postcode: "",
        terms_of_contract: "",
        remark: "",
        items: [
          {
            material_id: "",
            material_code: "",
            name: "",
            specifications: "",
            quantity: "",
            price: "",
            shipping_schedule_s: [],
            shipping_schedule: "",
            remark: ""
          }
        ]
      },
      rules: {
        consignee: [
          { required: true, message: "请输入收货人", trigger: "blur" }
        ],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        delivery_period: [
          { required: true, message: "请输入交期", trigger: "blur" }
        ],
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }]
      },
      payMenTerms: {
        deposit: {
          pay_rate: ''
        },
        shipment_before: {
          pay_rate: ''
        },
        shipment_after: [
          {
            day: '',
            pay_rate: ''
          }
        ],
        accept_after: [
          {
            day: '',
            pay_rate: ''
          }
        ],
        accept_after_balance: {
          day: '',
          pay_rate: ''
        },
        billing_after: [
          {
            day: '',
            pay_rate: ''
          }
        ],
        billing_after_balance: {
          day: '',
          pay_rate: ''
        }
      },
      options: [],
      customerModal: false,
      mater: {
        data: [],
        pagination: {
          current_page: 0,
          per_page: 10
        },
        search: "",
        date: ["", ""],
        selection: []
      },
      materialModal: false,
      acgModal: {
        name: "",
        position: "",
        mobile: "",
        email: ""
      },
      addConsigneeState: 0,
      addConsigneeModal: false,
      payMentModal: false,
      index: 0,
      shipmentModal: false,
      contact: [],
      contractModal: false
    };
  },
  props: {
    row: Object
  },
  methods: {
    ...mapMutations(["setStateData"]),
    getInvoice() {
      if (this.invoiceType.length) return false;
      let that = this;
      that
        .$get(`finance/invoice_types`)
        .then(response => {
          if (response.status != 200) return false;
          that.setStateData({ name: "invoiceType", arr: response.data.list });
        })
        .catch(err => {});
    },
    getPayment() {
      if (this.paymenType.length) return false;
      let that = this;
      that
        .$get(`finance/payment_types`)
        .then(response => {
          if (response.status != 200) return false;
          that.setStateData({ name: "paymenType", arr: response.data.list });
        })
        .catch(err => {});
    },
    onSubmit() {
      let that = this, url = "";
      that.form.items.forEach(e => e.shipping_schedule = JSON.stringify(e.shipping_schedule_s));
      that.form.terms_of_contract = this.editor.getData();
      if (that.row.id) url = `orders/company/edit/${that.row.id}`;
      else url = `orders/company/create`;

      that
        .$post(url, that.form)
        .then(response => {
          if (response.status != 200) return false;
          that.$emit("refresh");
          that.close();
          that.clearForm();
        })
        .catch(err => {});
    },
    clearForm() {
      this.form = {
        customer_id: 0,
        customer_code: "",
        customer_name: "",
        contact_arr: [],
        contact_s: "",
        contact: "",
        contact_mobile: "",
        clerk_id: "",
        salesman_arr: [],
        consignee: "",
        consignee_s: "",
        mobile: "",
        address: "",
        invoice_type_id: "",
        terms_of_payment_arr: [],
        terms_of_payment: "",
        currency: "",
        delivery_period: "",
        delivery_method: "",
        packing_method: "",
        postcode: "",
        terms_of_contract: "",
        remark: "",
        items: [
          {
            material_id: "",
            material_code: "",
            name: "",
            specifications: "",
            quantity: "",
            price: "",
            shipping_schedule_s: [],
            shipping_schedule: "",
            remark: ""
          }
        ]
      };
    },
    close() {
      $('#order #addOrderModal').modal('toggle')
    },
    setCustomers() {
      let customer = this.getData($("#order .customer #table")).pop();
      this.form.contact_s = "";
      this.form.contact = "";
      this.form.contact_mobile = "";

      this.form.consignee = "";
      this.form.consignee_s = "";
      this.form.mobile = "";

      this.form.terms_of_payment = "";
      this.form.address = "";

      this.form.clerk_id = customer.salesman_information.id;
      this.form.salesman_arr = [customer.salesman_information];

      this.form.customer_id = customer.id;
      this.form.customer_slug = customer.slug;
      this.form.customer_code = customer.code;
      this.form.customer_name = customer.name;
      this.form.contact_arr = customer.contact
      this.form.terms_of_payment_arr = customer.payment_terms_vl;
      this.form.address = customer.delivery_address;

      this.editor.setData(customer.contract_terms);

      this.customerModal = false;
    },
    addConsignee() {
      if (this.form.customer_id)
        this.$post(`customers/create_contact`, {
          customer_id: this.form.customer_id,
          contact: JSON.stringify([this.acgModal])
        })
        .then(response => {
          if (response.status != 200) return false;
          
          this.form.contact_arr.push({
            name: this.acgModal.name,
            position: this.acgModal.position,
            mobile: this.acgModal.mobile,
            email: this.acgModal.email
          });

          switch (this.addConsigneeState) {
            case 1:
              this.form.contact_s = this.form.contact_arr.length - 1
              this.form.contact = this.acgModal.name;
              this.form.contact_mobile = this.acgModal.mobile;
              break;
            case 2:
              this.form.consignee = this.form.contact_arr.length - 1
              this.form.consignee_s = this.acgModal.name;
              this.form.mobile = this.acgModal.mobile;
              break;
          }

          this.acgModal = {
            name: "",
            position: "",
            mobile: "",
            email: ""
          };

          this.addConsigneeModal = !this.addConsigneeModal;
        })
        .catch(err => console.error(err));
      else 
        this.$message({ message: "请先选择客户", type: "error" });
    },
    userChange(val, name) {
      this.form[name] = this.form.contact_arr[val].name;
      this.form[`${name == 'consignee'? 'mobile' : 'contact_mobile' }`] = this.form.contact_arr[val].mobile;
    },
    getMater(search) {
      let that = this,
        loading = this.$loading({ lock: true });
      that
        .$get(`respositories/materials/list`, {
          per_page: that.mater.pagination.per_page,
          page: search ? 1 : ++that.mater.pagination.current_page,
          search: that.mater.search,
          start_time: that.mater.date[0],
          end_time: that.mater.date[1]
        })
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          if (search) that.mater.data = response.data.list;
          else
            for (let item of response.data.list) {
              that.mater.data.push(item);
            }
          that.mater.pagination = response.data.pagination;
        })
        .catch(err => loading.close());
    },
    materChange(val) {
      this.mater.selection = val;
    },
    addMater() {
      this.form.items[this.index].material_code = this.mater.selection.material_number;
      this.form.items[this.index].material_id = this.mater.selection.id;
      this.form.items[this.index].name = this.mater.selection.name;
      this.form.items[this.index].specifications = this.mater.selection.material_specification;
      this.form.items[this.index].unit = this.mater.selection.item_unit;
      this.form.items[this.index].image = this.mater.selection.image;
      this.form.items.push({});
      this.form.items.pop();
      this.materialModal = !this.materialModal
    },
    addPayment() {
      let text = '',
        self = this.payMenTerms,
        sum = 0;
      if (
        !self.deposit.pay_rate && 
        !self.shipment_before.pay_rate &&
        !self.shipment_after[0].day &&
        !self.shipment_after[0].pay_rate &&
        !self.accept_after[0].day &&
        !self.accept_after[0].pay_rate &&
        !self.accept_after_balance.pay_rate &&
        !self.billing_after[0].day &&
        !self.billing_after[0].pay_rate &&
        !self.billing_after_balance.pay_rate
      ) {
        this.$message({ message: '请填写付款方式后保存', type: 'error' });
        return false;
      }

      if (self.deposit.pay_rate) {
        text += `合同签订后，付 ${self.deposit.pay_rate} %订单总额;`;
        sum += parseInt(self.deposit.pay_rate);
      }

      if (self.shipment_before.pay_rate) {
        text += `出货前，付 ${self.shipment_before.pay_rate} %订单总额;`;
        sum += parseInt(self.shipment_before.pay_rate);
      }

      if (self.shipment_after.length) 
        self.shipment_after.forEach(e => {
          if (e.pay_rate) {
            text += `出货后 ${e.day || 0} 天，付 ${e.pay_rate || 0} %订单总额;`;
            sum += parseInt(e.pay_rate || 0);
          }
        })

      if (self.accept_after.length)
        self.accept_after.forEach(e => {
          if (e.pay_rate) {
            text += `验收后 ${e.day || 0} 天，付 ${e.pay_rate || 0} %订单总额;`;
            sum += parseInt(e.pay_rate || 0);
          }
        })

      if (self.accept_after_balance.pay_rate) {
        text += `验收后 ${self.accept_after_balance.day} 天，付清订单余款 ${self.accept_after_balance.pay_rate} %`;
        sum += parseInt(self.accept_after_balance.pay_rate);
      }

      if (self.billing_after.length)
        self.billing_after.forEach(e => {
          if (e.pay_rate) {
            text += `票到后 ${e.day || 0} 天，付 ${e.pay_rate || 0} %订单总额;`;
            sum += parseInt(e.pay_rate || 0);
          }
        })
      
      if (self.billing_after_balance.pay_rate) {
        text += `票到后 ${self.billing_after_balance.day} 天，付清订单余款 ${self.billing_after_balance.pay_rate}%;`;
        sum += parseInt(self.billing_after_balance.pay_rate);
      }

      if (sum != 100) {
        this.$message({ message: '百分比总和为 100', type: 'error' });
        return false;
      }

      this.form.terms_of_payment = JSON.stringify({
        text: text || "",
        value: this.payMenTerms
      })
      this.form.terms_of_payment_arr.push({
        text: text || "",
        value: this.payMenTerms
      });
      this.
        $post(`customers/edit`, {
          slug: this.form.customer_slug,
          payment_terms: JSON.stringify(this.form.terms_of_payment_arr)
        })
        .then(response => {
          if (response.status != 200) return false;
          this.payMentModal = !this.payMentModal;
          this.payMenTerms = {
            deposit: {
              pay_rate: ''
            },
            shipment_before: {
              pay_rate: ''
            },
            shipment_after: [
              {
                day: '',
                pay_rate: ''
              }
            ],
            accept_after: [
              {
                day: '',
                pay_rate: ''
              }
            ],
            accept_after_balance: {
              day: '',
              pay_rate: ''
            },
            billing_after: [
              {
                day: '',
                pay_rate: ''
              }
            ],
            billing_after_balance: {
              day: '',
              pay_rate: ''
            }
          }
        })
        .catch(e => console.error(e));
    },
    initCKEditor() {
      const that = this;
      class UploadAdapter {
        constructor(loader) {
          this.loader = loader;
        }
        upload() {
          //重置上传路径
          return new Promise((resolve, reject) => {
            let form = new FormData();
            form.append('imageFile', this.loader.file);
          });
        }
        abort() {}
      }
      //初始化编辑器
      CKEditor.create(document.querySelector("#addEditor"), {
        removePlugins: ["MediaEmbed"], //除去视频按钮
        language: "zh-cn", // 中文
        ckfinder: {
          uploaded: 1,
          url: "/"
          // 后端处理上传逻辑返回json数据,包括uploaded(选项true/false)和url两个字段
        }
      })
        .then(editor => {
          const toolbarContainer = document.querySelector("#addToolbar");
          toolbarContainer.appendChild(editor.ui.view.toolbar.element);
          // 加载了适配器
          editor.plugins.get("FileRepository").createUploadAdapter = loader => {
            return new UploadAdapter(loader);
          };
          this.editor = editor; // 将编辑器保存起来，用来随时获取编辑器中的内容等，执行一些操作
          this.editor.setData(this.form.terms_of_contract || `
            <p>合同条款：</p>
            <ul>
              <li>1、收到订单后必须在当天签回，否则将视为供方已默认收到磁采购订单；</li>
              <li>2、送货单请详细填写采购单号、产品料号、品名规格、数量（勿填价格）等；</li>
              <li>3、必须按期保质保量交换，因逾期交货或品质问题影响需方产生进度的，则当天扣除按该订单总货款的0.1%，未如期完成对账及发票开具的，将延至下月付款；</li>
              <li>4、廉政条约：如发现我司员工与供应商有利益关系，立即取消供应商资格，并扣除所有货款。</li>
            </ul>
          `);
        })
        .catch(error => console.error(error));
    },
    tableAjaxData(params) {
      let that = this;
      that
        .$get(`customers`, params.data)
        .then(response => {
          if (response.status != 200) return false;
          params.success({
            rows: response.data.list,
            total: response.data.pagination.total
          });
        })
        .catch(err => {});
    },
    tableAjaxParams(params) {
      return {
        page: params.offset / params.limit + 1,
        per_page: params.limit,
        address: params.search || undefined,
        work: "visit"
      };
    },
    init() {
      let that = this,
        columns = [
          {
            checkbox: true
          },
          {
            field: "code",
            title: "客户编码",
            sortable: true
          },
          {
            field: "created_member.display_name",
            title: "创建人",
            sortable: true
          },
          {
            field: "created_at",
            title: "创建时间",
            sortable: true
          },
          {
            field: "name",
            title: "客户公司全称",
            sortable: true
          },
          {
            field: "abbreviation",
            title: "客户公司简称",
            sortable: true
          },
          {
            field: "customer_level",
            title: "客户级别"
          },
          {
            field: "salesman",
            title: "业务员",
            sortable: true
          },
          {
            field: "business_license_number",
            title: "工商营业执照号码",
            sortable: true
          },
          {
            field: "legal_representative",
            title: "法人代表",
            sortable: true
          },
          {
            field: "registered_capital",
            title: "注册资金",
            sortable: true
          },
          {
            field: "establish_at",
            title: "成立日期",
            sortable: true
          },
          {
            field: "url",
            title: "网址",
            sortable: true
          },
          {
            field: "phone",
            title: "座机号码",
            sortable: true
          },
          {
            field: "fax",
            title: "传真",
            sortable: true
          },
          {
            field: "enabled",
            title: "状态"
          },
          {
            field: "market_status",
            title: "市场状况",
            sortable: true
          },
          {
            field: "product_used",
            title: "所用产品",
            sortable: true
          },
          {
            field: "purchase_quantity_year",
            title: "年采购量",
            sortable: true
          },
          {
            field: "business_content",
            title: "营业内容",
            sortable: true
          },
          {
            field: "area",
            title: "区域",
            sortable: true
          },
          {
            field: "tags",
            title: "标签",
            sortable: true
          },
          {
            field: "remark",
            title: "备注",
            sortable: true
          },
          {
            field: "detailed_address",
            title: "详细地址",
            sortable: true
          },
          {
            field: "contact",
            title: "联系人",
            sortable: true,
            formatter: (value, row, index) => {
              let contact = `<button class="btn btn-sm btn-primary">查看联系人</button>`;
              return contact;
            },
            events: {
              'click .btn': function(e, value, row, index) {
                that.contact = row.contact;
                $('#order .contactModal').modal('show');
              }
            }
          },
          {
            field: "bank_account",
            title: "开户银行",
            sortable: true
          },
          {
            field: "account_name",
            title: "银行账户名",
            sortable: true
          },
          {
            field: "account_number",
            title: "银行账号",
            sortable: true
          },
          {
            field: "tax_id",
            title: "税号",
            sortable: true
          },
          {
            field: "account_period_type",
            title: "账期类型",
            sortable: true
          },
          {
            field: "payment_type",
            title: "付款条件",
            sortable: true
          },
          {
            field: "invoice_type",
            title: "发票类型",
            sortable: true
          },
          {
            field: "invoice_head",
            title: "发票抬头",
            sortable: true
          },
          // {
          //   field: "payment_terms",
          //   title: "付款条件",
          //   sortable: true,
          //   formatter: (value, row, index) => {
          //     let payment_terms = `<button class="btn btn-sm btn-primary">查看条件</button>`;
          //     return payment_terms;
          //   },
          //   events: {
          //     'click .btn': function(e, value, row, index) {
          //       that.payment_terms = row.payment_terms_vl;
          //       $('#order .payment_termsModal').modal('show');
          //     }
          //   }
          // },
          {
            field: "logistics_code",
            title: "物流编码",
            sortable: true
          },
          {
            field: "delivery_methods",
            title: "送货方式",
            sortable: true
          },
          {
            field: "delivery_address",
            title: "交货地址",
            sortable: true
          }
        ],
        data = {
          ajax: this.tableAjaxData,
          queryParams: this.tableAjaxParams,
          search: true,
          strictSearch: true,
          showRefresh: false,
          sidePagination: "server",
          pagination: true,
          striped: true,
          clickToSelect: true,
          showColumns: true,
          sortName: "createTime",
          sortOrder: "desc",
          idField: "id",
          showToggle: false,
          showExport: false,
          singleSelect: true,
          exportDataType: "all",
          exportTypes: ["csv", "txt", "sql", "doc", "excel", "xlsx", "pdf"],
          classes: "table",
          pageList: [10, 25, 50, 100, "All"],
          columns: columns,
        };
      $("#order .customer #table").bootstrapTable(data);
    }
  },
  computed: mapState(["invoiceType", "paymenType"]),
  watch: {
    customerModal() {
      $('#order .customer').modal("toggle");
    },
    materialModal() {
      $('#order .material').modal("toggle");
    },
    addConsigneeModal() {
      $('#order .addConsignee').modal("toggle");
    },
    payMentModal() {
      $('#order .payMentModal').modal("toggle");
    },
    shipmentModal() {
      $('#order .shipment').modal("toggle");
    },
    contractModal() {
      $('#order .addContract').modal("toggle");
    }
  },
  mounted() {
    this.initCKEditor();
    this.init();
    const that = this;
    $('#order #addOrderModal').on('shown.bs.modal', function () {
      if (that.row.id) {
        that.form.customer_id = that.row.customer_id;
        that.form.customer_code = that.row.customer_code;
        that.form.customer_name = that.row.customer_name;
        that.form.contact_arr = that.row.customer_contract;
        that.form.contact = that.row.contract;
        that.form.contact_mobile = that.row.contract_mobile;
        that.form.clerk_id = that.row.clerk_id;
        that.form.salesman_arr = [{ id: that.row.clerk_id, display_name: that.row.clerk_name }];
        that.form.consignee = that.row.consignee;
        that.form.mobile = that.row.mobile;
        that.form.contact_arr.forEach((e, k) => {
          if (e.name == that.form.contact) that.form.contact_s = k;
          if (e.name == that.form.consignee) that.form.consignee_s = k;
        });
        that.form.address = that.row.address;
        that.form.invoice_type_id = that.row.invoice_type_id || "";
        that.form.terms_of_payment_arr = [that.row.terms_of_payment];
        that.form.terms_of_payment = JSON.stringify(that.row.terms_of_payment);
        that.form.payment_type_id = that.row.payment_type_id || "";
        that.form.delivery_period = that.row.delivery_period || that.dateParse(new Date);
        that.form.remark = that.row.remark;
        that.form.packing_method = that.row.packing_method;
        that.form.postcode = that.row.postcode;
        that.form.delivery_method = that.row.delivery_method;
        that.form.items = [];
        that.row.items.forEach(e => that.form.items.push({
          id: e.id,
          material_id: e.material_id,
          material_code: e.material_code,
          name: e.material_name,
          specifications: e.material_specification,
          unit: e.material_unit,
          quantity: e.quantity,
          price: e.purchase_price,
          shipping_schedule_s: e.shipping_schedule,
          remark: e.remark
        }));
        that.editor.setData(that.row.terms_of_contract);
      } else 
        that.form = {
          customer_id: 0,
          customer_code: "",
          customer_name: "",
          contact_arr: [],
          contact_s: "",
          contact: "",
          contact_mobile: "",
          clerk_id: "",
          salesman_arr: [],
          consignee: "",
          consignee_s: "",
          mobile: "",
          address: "",
          invoice_type_id: "",
          terms_of_payment_arr: [],
          terms_of_payment: "",
          payment_type_id: "",
          currency: "",
          delivery_period: "",
          delivery_method: "",
          packing_method: "",
          postcode: "",
          terms_of_contract: "",
          remark: "",
          items: [
            {
              material_id: "",
              material_code: "",
              name: "",
              specifications: "",
              unit: "",
              quantity: "",
              price: "",
              shipping_schedule_s: [],
              shipping_schedule: "",
              remark: ""
            }
          ]
        }
    });
  },
  created() {
    this.getInvoice();
    this.getPayment();
  }
};
</script>
<style lang="less">
#addOrderModal {
  .modal-lg{
    width: 1280px;
    max-width: 100%;
    .lead {
      padding-bottom: 10px;
      margin-bottom: 0px;
      border-bottom: 1px solid #999999;
    }
    .el-form {
      .item {
        padding: 15px;
        .el-form-item {
          display: flex;
          min-width: 25%;
          padding: 0 15px;
          .el-form-item__content {
            display: flex;
            .btn-default {
              border: none;
            }
            .btn-add {
              margin-left: 5px;
              height: 28px;
            }
          }
        }
      }
      .widthFull {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
      }
    }
  }
}
.addConsignee {
  .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 50%;
    }
    .widthFull {
      width: 100%;
    }
  }
}
.payMentModal {
  top: 20%;
  @dashed: 1px dashed #989898;
  .terms {
    border: @dashed;
    display: flex;
    > div {
      &:first-child {
        padding: 1rem;
      }
      border-right: @dashed;
      flex-grow: 1;
      p {
        white-space: nowrap;
        input {
          display: inline;
          width: 20px;
        }
      }
      > div {
        padding: 1rem;
        min-height: 101px;
        &:first-child {
          border-bottom: @dashed;
        }
      }
      &:last-child {
        border-right: none;
      }
    }
  }
}
.material {
  .el-table__body tr.current-row>td {
    background-color: #03a9f4;
  }
  .condition {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    > div {
      display: flex;
      align-items: center;
      button,
      span {
        white-space: nowrap;
        margin-right: 5px;
      }
    }
  }
}
</style>
