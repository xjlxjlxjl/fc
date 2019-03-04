<template>
  <div id="main">
    <join-project :join-project="joinProject" :quantity="parseInt(1)"></join-project>
    <login-modal></login-modal>
    <!-- <supplier-modal title="选择供应商" :demand="nonstandard" @onSubmit="createNon"></supplier-modal> -->
    <el-container>
      <el-aside class="homeMainAside" width="200px">
        <el-menu :default-active="productIndex.toString()">
          <el-menu-item
            v-for="(item,index) in product"
            :key="index"
            :index="index.toString()"
            @click="showCategory(item.children)"
          >
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="homeMainContent">
        <el-container>
          <el-aside class="homeAsideList" width="120px">
            <el-menu :default-active="selectedCateIndex.toString()">
              <el-menu-item
                v-for="(item,index) in selectedCate"
                :key="index"
                :index="index.toString()"
                @click="showGoodsList(item.children)"
              >
                <span slot="title">{{ item.name }}</span>
              </el-menu-item>
            </el-menu>
          </el-aside>
          <!-- 商品列表 -->
          <el-main class="homeMainList" v-if="showDetailState == 0">
            <div v-for="(item,index) in selectedGood" :key="index" @click="showDetail(item)">
              <img :src="item.icon || ''">
              <span>{{ item.name }}</span>
              <p v-show="!item.enable">{{ item.message }}</p>
            </div>
          </el-main>
          <!-- 智能选形 -->
          <el-main class="homeGoodDetail" v-else-if="showDetailState == 1">
            <div class="main">
              <ul>
                <li>
                  <div>运动方式</div>
                  <div>
                    <el-radio v-model="params.exercise_mode" label="dot_to_dot">点到点</el-radio>
                    <el-radio v-model="params.exercise_mode" label="scanning">扫描检测</el-radio>
                  </div>
                </li>
                <li>
                  <div>动子数</div>
                  <div>
                    <el-radio v-model="params.number_of_mover" label="1">1</el-radio>
                    <span>个</span>
                  </div>
                </li>
                <li>
                  <div>负载重量</div>
                  <div>
                    <el-radio v-model="params.load_weight" label="1">1</el-radio>
                    <el-radio v-model="params.load_weight" label="3">3</el-radio>
                    <el-radio v-model="params.load_weight" label="5">5</el-radio>
                    <el-radio v-model="params.load_weight" label="10">10</el-radio>
                    <el-input class="labelInput" v-model="params.load_weight" placeholder="其他"></el-input>
                    <span>kg</span>
                  </div>
                </li>
                <li>
                  <div>有效行程</div>
                  <div>
                    <el-input v-model="params.distance" placeholder="输入"></el-input>
                    <span>mm</span>
                  </div>
                </li>
                <li>
                  <div>
                    <el-radio v-model="params.readswit" label="0">已知速度加速度</el-radio>
                    <el-radio v-model="params.readswit" label="1">三角曲线</el-radio>
                    <el-radio v-model="params.readswit" label="2">已知 V-T 曲线</el-radio>
                  </div>
                  <div class="chartOption">
                    <canvas id="speedChart" width="200" height="200" class="pull-left"></canvas>
                    <div class="pull-left" v-if="params.readswit == 0">
                      <p>
                        <span>移动距离:</span>
                        <el-input v-model="params.distance" placeholder="1000"></el-input>
                        <span>mm</span>
                      </p>
                      <p>
                        <span>速度:</span>
                        <el-radio v-model="params.speed" label="0.5">0.5</el-radio>
                        <el-radio v-model="params.speed" label="1">1</el-radio>
                        <el-input class="labelInput" v-model="params.speed" placeholder="5">0.5</el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>加速度:</span>
                        <el-radio v-model="params.acceleration" label="0.5">0.5</el-radio>
                        <el-radio v-model="params.acceleration" label="1">1</el-radio>
                        <el-input class="labelInput" v-model="params.acceleration" placeholder="5"></el-input>
                        <span>m/s²</span>
                      </p>
                      <p>
                        <span>停留时间:</span>
                        <el-radio v-model="params.stay_time" label="0.5">0.5</el-radio>
                        <el-input class="labelInput" v-model="params.stay_time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                    </div>
                    <div class="pull-left" v-else-if="params.readswit == 1">
                      <p>
                        <span>移动距离:</span>
                        <el-input v-model="params.distance" placeholder="1000"></el-input>
                        <span>mm</span>
                      </p>
                      <p>
                        <span>用时:</span>
                        <el-radio v-model="params.time" label="1">1</el-radio>
                        <el-radio v-model="params.time" label="2">2</el-radio>
                        <el-input v-model="params.time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                      <p>
                        <span>停留时间:</span>
                        <el-radio v-model="params.stay_time" label="0.5">0.5</el-radio>
                        <el-input v-model="params.stay_time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                    </div>
                    <div class="pull-left" v-else>
                      <p>
                        <span>移动距离:</span>
                        <el-input v-model="params.distance" placeholder="1000"></el-input>
                        <span>mm</span>
                      </p>
                      <p>
                        <span>加速时间 t1:</span>
                        <el-radio v-model="params.accelerationTime" label="0.5">0.5</el-radio>
                        <el-input v-model="params.accelerationTime" placeholder="其他"></el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>匀速时间 t2:</span>
                        <el-radio v-model="params.uniformTime" label="0.5">0.5</el-radio>
                        <el-input v-model="params.uniformTime" placeholder="其他"></el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>减速时间 t3:</span>
                        <el-radio v-model="params.slowTime" label="0.5">0.5</el-radio>
                        <el-input v-model="params.slowTime" placeholder="其他"></el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>停留时间:</span>
                        <el-radio v-model="params.stay_time" label="0.5">0.5</el-radio>
                        <el-input v-model="params.stay_time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                    </div>
                  </div>
                </li>
                <li>
                  <div>
                    <el-radio v-model="params.feedback_type" label>重现精度</el-radio>
                    <el-radio v-model="params.feedback_type" label="grating_ruler">光栅尺</el-radio>
                    <el-radio v-model="params.feedback_type" label="magnetic_scale">磁栅尺</el-radio>
                  </div>
                  <div>
                    <p v-if="params.feedback_type == 'grating_ruler'">
                      <el-radio v-model="params.precision" label="1">1</el-radio>
                      <el-radio v-model="params.precision" label="0.5">0.5</el-radio>
                      <el-radio v-model="params.precision" label="0.1">0.1</el-radio>
                      <el-input class="labelInput" v-model="params.precision"></el-input>
                      <span>μm</span>
                    </p>
                    <p v-else-if="params.feedback_type == 'magnetic_scale'">
                      <el-radio v-model="params.precision" label="1">1</el-radio>
                      <el-radio v-model="params.precision" label="0.5">0.5</el-radio>
                      <el-radio v-model="params.precision" label="0.1">0.1</el-radio>
                      <el-input class="labelInput" v-model="params.precision"></el-input>
                      <span>μm</span>
                    </p>
                    <p v-else>
                      <span>重现精度:</span>
                      <el-radio v-model="params.reproduce_the_accuracy" label="3">3</el-radio>
                      <el-radio v-model="params.reproduce_the_accuracy" label="1">1</el-radio>
                      <el-input v-model="params.reproduce_the_accuracy" placeholder="其他"></el-input>
                      <span>μm</span>
                    </p>
                  </div>
                </li>
                <li>
                  <div>防尘方式</div>
                  <div>
                    <el-radio v-model="params.seal" label="KA">半封闭</el-radio>
                    <el-radio v-model="params.seal" label="KS">全封闭</el-radio>
                  </div>
                </li>
                <li>
                  <div>安装方式</div>
                  <div>
                    <el-radio v-model="params.moduleinstalled" label="horizontal">水平</el-radio>
                    <el-radio v-model="params.moduleinstalled" label="upside_down">倒挂</el-radio>
                    <el-radio v-model="params.moduleinstalled" label="wall_hang">侧挂</el-radio>
                    <el-radio v-model="params.moduleinstalled" label="vertical">垂直</el-radio>
                  </div>
                </li>
              </ul>
              <div class="typeSelection">
                <div
                  :class="typeSelection.Int == 0 ? 'active' : '' "
                  @click="typeSelection.Int = 0"
                >直线电机模组</div>
                <div
                  :class="typeSelection.Int == 1 ? 'active' : '' "
                  @click="typeSelection.Int = 1"
                >皮带模组</div>
                <div
                  :class="typeSelection.Int == 2 ? 'active' : '' "
                  @click="typeSelection.Int = 2"
                >螺杆模组</div>
              </div>
              <ul v-if="typeSelection.Int == 0">
                <li>
                  <div>防尘装置</div>
                  <div>
                    <el-radio v-model="params.dustproof_device" label>无</el-radio>
                    <el-radio v-model="params.dustproof_device" label="metal_cover">金属盖板</el-radio>
                    <el-radio v-model="params.dustproof_device" label="organ_cover">风琴罩</el-radio>
                  </div>
                </li>
                <li>
                  <div>线缆长度</div>
                  <div>
                    <el-radio v-model="params.cable_length" label="0">无</el-radio>
                    <el-radio v-model="params.cable_length" label="2">2m</el-radio>
                    <el-radio v-model="params.cable_length" label="4">4m</el-radio>
                  </div>
                </li>
                <li>
                  <div>驱动类型</div>
                  <div>
                    <el-radio v-model="params.driver_type" label="CDHD">高创</el-radio>
                    <el-radio v-model="params.driver_type" label="Hiwin">Hiwin</el-radio>
                    <el-radio v-model="params.driver_type" label>客户自配</el-radio>
                  </div>
                </li>
              </ul>
              <ul v-else-if="typeSelection.Int == 1">
                <li>
                  <div>电机安装方式</div>
                  <div>
                    <el-radio v-model="params.mountingmotor" label="FW">直接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="FL">左接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="FR">右接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="FD">背接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="FI">内藏</el-radio>
                  </div>
                </li>
                <li>
                  <div>光电开关</div>
                  <div>
                    <el-radio v-model="params.oswitch" label="0">客户自配</el-radio>
                    <el-radio v-model="params.oswitch" label="W">商家提供（PNP）</el-radio>
                  </div>
                </li>
                <li v-show="params.oswitch == 'W'">
                  <div>开关线</div>
                  <div>
                    <el-radio v-model="params.switchline" label="0">无</el-radio>
                    <el-radio v-model="params.switchline" label="2">2m</el-radio>
                    <el-radio v-model="params.switchline" label="5">5m</el-radio>
                  </div>
                </li>
                <li v-show="params.mountingmotor == 'FW'">
                  <div>联轴器</div>
                  <div>
                    <el-radio v-model="params.couplings" label="0">无</el-radio>
                    <el-radio v-model="params.couplings" label="1">配联轴器</el-radio>
                  </div>
                </li>
                <li>
                  <div>电机</div>
                  <div>
                    <el-radio v-model="params.module_motor" label="n">客户自配</el-radio>
                    <el-radio v-model="params.module_motor" label="y">商家提供</el-radio>
                  </div>
                </li>
                <li>
                  <div>电机品牌</div>
                  <div>
                    <el-select v-model="params.motor_brand">
                      <el-option
                        v-for="(item,index) in typeSelection.motor_brand"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </li>
                <li>
                  <div>电机线</div>
                  <div>
                    <el-radio v-model="params.cable_length" label="0">无</el-radio>
                    <el-radio v-model="params.cable_length" label="3">3m</el-radio>
                    <el-radio v-model="params.cable_length" label="5">5m</el-radio>
                  </div>
                </li>
              </ul>
              <ul v-else-if="typeSelection.Int == 2">
                <li>
                  <div>电机安装方式</div>
                  <div>
                    <el-radio v-model="params.mountingmotor" label="FW">直接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="FL">左接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="FR">右接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="FD">背接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="FI">内藏</el-radio>
                  </div>
                </li>
                <li>
                  <div>光电开关</div>
                  <div>
                    <el-radio v-model="params.oswitch" label="0">客户自配</el-radio>
                    <el-radio v-model="params.oswitch" label="W">商家提供（PNP）</el-radio>
                  </div>
                </li>
                <li v-show="params.oswitch == 'W'">
                  <div>开关线</div>
                  <div>
                    <el-radio v-model="params.switchline" label="0">无</el-radio>
                    <el-radio v-model="params.switchline" label="2">2m</el-radio>
                    <el-radio v-model="params.switchline" label="5">5m</el-radio>
                  </div>
                </li>
                <li v-show="params.mountingmotor == 'FW'">
                  <div>联轴器</div>
                  <div>
                    <el-radio v-model="params.couplings" label="0">无</el-radio>
                    <el-radio v-model="params.couplings" label="1">配联轴器</el-radio>
                  </div>
                </li>
                <li>
                  <div>电机</div>
                  <div>
                    <el-radio v-model="params.module_motor" label="n">客户自配</el-radio>
                    <el-radio v-model="params.module_motor" label="y">商家提供</el-radio>
                  </div>
                </li>
                <li>
                  <div>电机品牌</div>
                  <div>
                    <el-select v-model="params.motor_brand">
                      <el-option
                        v-for="(item,index) in typeSelection.motor_brand"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </li>
                <li>
                  <div>电机线</div>
                  <div>
                    <el-radio v-model="params.cable_length" label="0">无</el-radio>
                    <el-radio v-model="params.cable_length" label="3">3m</el-radio>
                    <el-radio v-model="params.cable_length" label="5">5m</el-radio>
                  </div>
                </li>
                <li>
                  <div>刹车</div>
                  <div>
                    <el-radio v-model="params.motor_brake" label="A">带刹车</el-radio>
                    <el-radio v-model="params.motor_brake" label="B">不带刹车</el-radio>
                  </div>
                </li>
              </ul>
              <div class="operation">
                <span></span>
                <el-button type="primary" size="mini" @click="screen">筛选</el-button>
              </div>
              <el-table border :data="tableData.list">
                <el-table-column label="产品" width="400">
                  <template slot-scope="{ row }">
                    <div class="productInfo">
                      <div>
                        <img :src="row.image" :alt="row.name">
                      </div>
                      <div>
                        <p>
                          名称：
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.name }}</a>
                        </p>
                        <p>
                          型号:
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.model }}</a>
                        </p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sales_price" label="价格"></el-table-column>
                <el-table-column prop="delivery_period" label="交期">
                  <template slot-scope="{ row }">
                    <span>{{ row.delivery_period }} 工作日</span>
                  </template>
                </el-table-column>
                <el-table-column label="图纸">
                  <template slot-scope="{ row }">
                    <div class="drawing">
                      <div v-if="row.drawing_2d">
                        <i class="font_family icon-d2twig"></i>
                        <a target="_blank" :href="row.drawing_2d">下载</a>
                      </div>
                      <div v-if="row.drawing_3d">
                        <i class="font_family icon-d3twig"></i>
                        <a target="_blank" :href="row.drawing_3d">下载</a>
                      </div>
                      <div v-if="row.drawing_2d == '' && row.drawing_3d == ''">无</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="{ row }">
                    <dir class="opera">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="joinProject.id = row.id;joinProject.history = row.selling_price_slug;getProject()"
                      >加入项目</el-button>
                      <el-button type="success" size="mini" @click="sendMailto(row.str_id)">发送图纸</el-button>
                    </dir>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-main>
          <!-- 直线电机 -->
          <el-main class="homeGoodDetail" v-else-if="showDetailState == 2">
            <div class="main">
              <ul>
                <li>
                  <div>运动方式</div>
                  <div>
                    <el-radio v-model="params.exercise_mode" label="dot_to_dot">点到点</el-radio>
                    <el-radio v-model="params.exercise_mode" label="scanning">扫描检测</el-radio>
                  </div>
                </li>
                <li>
                  <div>动子数</div>
                  <div>
                    <el-radio v-model="params.number_of_mover" label="1">1</el-radio>
                    <span>个</span>
                  </div>
                </li>
                <li>
                  <div>负载重量</div>
                  <div>
                    <el-radio v-model="params.load_weight" label="1">1</el-radio>
                    <el-radio v-model="params.load_weight" label="3">3</el-radio>
                    <el-radio v-model="params.load_weight" label="5">5</el-radio>
                    <el-radio v-model="params.load_weight" label="10">10</el-radio>
                    <el-input class="labelInput" v-model="params.load_weight" placeholder="其他"></el-input>
                    <span>kg</span>
                  </div>
                </li>
                <li>
                  <div>有效行程</div>
                  <div>
                    <el-radio v-model="params.distance" label="50">50</el-radio>
                    <el-radio v-model="params.distance" label="1000">1000</el-radio>
                    <el-radio v-model="params.distance" label="1500">1500</el-radio>
                    <el-radio v-model="params.distance" label="2500">2500</el-radio>
                    <el-radio v-model="params.distance" label="3800">3800</el-radio>
                    <el-input v-model="params.distance" placeholder="输入"></el-input>
                    <span>mm</span>
                  </div>
                </li>
                <li>
                  <div>
                    <el-radio v-model="params.readswit" label="0">已知速度加速度</el-radio>
                    <el-radio v-model="params.readswit" label="1">三角曲线</el-radio>
                    <el-radio v-model="params.readswit" label="2">已知 V-T 曲线</el-radio>
                  </div>
                  <div class="chartOption">
                    <canvas id="speedChart" width="200" height="200" class="pull-left"></canvas>
                    <div class="pull-left" v-if="params.readswit == 0">
                      <p>
                        <span>移动距离:</span>
                        <el-input v-model="params.distance" placeholder="1000"></el-input>
                        <span>mm</span>
                      </p>
                      <p>
                        <span>速度:</span>
                        <el-radio v-model="params.speed" label="0.5">0.5</el-radio>
                        <el-radio v-model="params.speed" label="1">1</el-radio>
                        <el-radio v-model="params.speed" label="2">2</el-radio>
                        <el-input class="labelInput" v-model="params.speed" placeholder="5">0.5</el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>加速度:</span>
                        <el-radio v-model="params.acceleration" label="5">5</el-radio>
                        <el-radio v-model="params.acceleration" label="10">10</el-radio>
                        <el-radio v-model="params.acceleration" label="20">20</el-radio>
                        <el-input class="labelInput" v-model="params.acceleration" placeholder="5"></el-input>
                        <span>m/s²</span>
                      </p>
                      <p>
                        <span>停留时间:</span>
                        <el-radio v-model="params.stay_time" label="0.5">0.5</el-radio>
                        <el-input class="labelInput" v-model="params.stay_time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                    </div>
                    <div class="pull-left" v-else-if="params.readswit == 1">
                      <p>
                        <span>移动距离:</span>
                        <el-input v-model="params.distance" placeholder="1000"></el-input>
                        <span>mm</span>
                      </p>
                      <p>
                        <span>用时:</span>
                        <el-radio v-model="params.time" label="1">1</el-radio>
                        <el-input v-model="params.time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                      <p>
                        <span>停留时间:</span>
                        <el-radio v-model="params.stay_time" label="0.5">0.5</el-radio>
                        <el-input v-model="params.stay_time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                    </div>
                    <div class="pull-left" v-else>
                      <p>
                        <span>移动距离:</span>
                        <el-input v-model="params.distance" placeholder="1000"></el-input>
                        <span>mm</span>
                      </p>
                      <p>
                        <span>加速时间 t1:</span>
                        <el-radio v-model="params.accelerationTime" label="0.5">0.5</el-radio>
                        <el-input v-model="params.accelerationTime" placeholder="其他"></el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>匀速时间 t2:</span>
                        <el-radio v-model="params.uniformTime" label="0.5">0.5</el-radio>
                        <el-input v-model="params.uniformTime" placeholder="其他"></el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>减速时间 t3:</span>
                        <el-radio v-model="params.slowTime" label="0.5">0.5</el-radio>
                        <el-input v-model="params.slowTime" placeholder="其他"></el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>停留时间:</span>
                        <el-radio v-model="params.stay_time" label="0.5">0.5</el-radio>
                        <el-input v-model="params.stay_time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                    </div>
                  </div>
                </li>
                <li>
                  <div>
                    <el-radio v-model="params.feedback_type" label>重现精度</el-radio>
                    <el-radio v-model="params.feedback_type" label="grating_ruler">光栅尺</el-radio>
                    <el-radio v-model="params.feedback_type" label="magnetic_scale">磁栅尺</el-radio>
                  </div>
                  <div>
                    <p v-if="params.feedback_type == 'grating_ruler'">
                      <el-radio v-model="params.precision" label="1">1</el-radio>
                      <el-radio v-model="params.precision" label="0.5">0.5</el-radio>
                      <el-radio v-model="params.precision" label="0.1">0.1</el-radio>
                      <el-input class="labelInput" v-model="params.precision"></el-input>
                      <span>μm</span>
                    </p>
                    <p v-else-if="params.feedback_type == 'magnetic_scale'">
                      <el-radio v-model="params.precision" label="1">1</el-radio>
                      <el-radio v-model="params.precision" label="0.5">0.5</el-radio>
                      <el-radio v-model="params.precision" label="0.1">0.1</el-radio>
                      <el-input class="labelInput" v-model="params.precision"></el-input>
                      <span>μm</span>
                    </p>
                    <p v-else>
                      <span>重现精度:</span>
                      <el-radio v-model="params.reproduce_the_accuracy" label="3">3</el-radio>
                      <el-radio v-model="params.reproduce_the_accuracy" label="1">1</el-radio>
                      <el-input v-model="params.reproduce_the_accuracy" placeholder="其他"></el-input>
                      <span>μm</span>
                    </p>
                  </div>
                </li>
                <li>
                  <div>线缆长度</div>
                  <div>
                    <el-radio v-model="params.cable_length" label="0">无</el-radio>
                    <el-radio v-model="params.cable_length" label="2">2m</el-radio>
                    <el-radio v-model="params.cable_length" label="4">4m</el-radio>
                    <span>(不超过7m)</span>
                  </div>
                </li>
                <li>
                  <div>防尘装置</div>
                  <div>
                    <el-radio v-model="params.dustproof_device" label>无</el-radio>
                    <el-radio v-model="params.dustproof_device" label="metal_cover">金属盖板</el-radio>
                  </div>
                </li>
                <li>
                  <div>驱动类型</div>
                  <div>
                    <el-radio v-model="params.driver_type" label="CDHD">高创</el-radio>
                    <el-radio v-model="params.driver_type" label="Hiwin">Hiwin</el-radio>
                    <el-radio v-model="params.driver_type" label>客户自配</el-radio>
                  </div>
                </li>
                <li>
                  <div>安装方式</div>
                  <div>
                    <el-radio v-model="params.moduleinstalled" label="horizontal">水平</el-radio>
                    <el-radio v-model="params.moduleinstalled" label="upside_down">倒挂</el-radio>
                    <el-radio v-model="params.moduleinstalled" label="wall_hang">侧挂</el-radio>
                    <el-radio v-model="params.moduleinstalled" label="vertical">垂直</el-radio>
                  </div>
                </li>
              </ul>
              <div class="operation">
                <span></span>
                <el-button type="primary" size="mini" @click="screen">筛选</el-button>
              </div>
              <el-table border :data="tableData.list">
                <el-table-column label="产品" width="400">
                  <template slot-scope="{ row }">
                    <div class="productInfo">
                      <div>
                        <img :src="row.image" :alt="row.name">
                      </div>
                      <div>
                        <p>
                          名称：
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.name }}</a>
                        </p>
                        <p>
                          型号:
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.model }}</a>
                        </p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sales_price" label="价格"></el-table-column>
                <el-table-column prop="delivery_period" label="交期">
                  <template slot-scope="{ row }">
                    <span>{{ row.delivery_period }} 工作日</span>
                  </template>
                </el-table-column>
                <el-table-column label="图纸">
                  <template slot-scope="{ row }">
                    <div class="drawing">
                      <div v-if="row.drawing_2d">
                        <i class="font_family icon-d2twig"></i>
                        <a target="_blank" :href="row.drawing_2d">下载</a>
                      </div>
                      <div v-if="row.drawing_3d">
                        <i class="font_family icon-d3twig"></i>
                        <a target="_blank" :href="row.drawing_3d">下载</a>
                      </div>
                      <div v-if="row.drawing_2d == '' && row.drawing_3d == ''">无</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="{ row }">
                    <div class="opera">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="joinProject.id = row.id;joinProject.history = row.selling_price_slug;getProject()"
                      >加入项目</el-button>
                      <el-button type="success" size="mini" @click="sendMailto(row.str_id)">发送图纸</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-main>
          <!-- 丝杆模组 -->
          <el-main class="homeGoodDetail" v-else-if="showDetailState == 3">
            <div class="main">
              <ul>
                <li>
                  <div>负载重量</div>
                  <div>
                    <el-radio v-model="params.load_weight" label="1">1</el-radio>
                    <el-radio v-model="params.load_weight" label="3">3</el-radio>
                    <el-radio v-model="params.load_weight" label="5">5</el-radio>
                    <el-radio v-model="params.load_weight" label="10">10</el-radio>
                    <el-input class="labelInput" v-model="params.load_weight" placeholder="其他"></el-input>
                    <span>kg</span>
                  </div>
                </li>
                <li>
                  <div>有效行程</div>
                  <div>
                    <el-radio v-model="params.distance" label="50">50</el-radio>
                    <el-radio v-model="params.distance" label="150">150</el-radio>
                    <el-radio v-model="params.distance" label="1000">1000</el-radio>
                    <el-radio v-model="params.distance" label="1250">1250</el-radio>
                    <el-input v-model="params.distance" placeholder="输入"></el-input>
                    <span>mm</span>
                  </div>
                </li>
                <li>
                  <div>最大速度</div>
                  <div>
                    <el-radio v-model="params.speed" label="250">250</el-radio>
                    <el-radio v-model="params.speed" label="500">500</el-radio>
                    <el-radio v-model="params.speed" label="1000">1000 mm/s</el-radio>
                    <!-- <el-input v-model="params.speed" placeholder="输入"></el-input> -->
                    <span>（行程超过700mm每增加100mm，最大速度递减15%）</span>
                    <p class="speedTips" v-show="screwRealSpeed">理论上最高速度可达到{{ screwRealSpeed }} mm/s</p>
                  </div>
                </li>
                <li v-show="params.mountingmotor == 'FW'">
                  <div>联轴器</div>
                  <div>
                    <el-radio v-model="params.couplings" label="0">客户自配</el-radio>
                    <el-radio v-model="params.couplings" label="1">配联轴器</el-radio>
                    <span>（电机直接可选配联轴器，其他方式均无）</span>
                  </div>
                </li>
                <li>
                  <div>电机</div>
                  <div>
                    <el-radio v-model="params.module_motor" label="n">客户自配</el-radio>
                    <el-radio v-model="params.module_motor" label="y">商家提供</el-radio>
                  </div>
                </li>
                <li>
                  <div>电机品牌</div>
                  <div>
                    <el-select v-model="params.motor_brand">
                      <el-option
                        v-for="(item,index) in typeSelection.motor_brand"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </li>
                <li>
                  <div>功率</div>
                  <div>
                    <el-radio v-model="params.motor_power" label="05">50</el-radio>
                    <el-radio v-model="params.motor_power" label="10">100</el-radio>
                    <el-radio v-model="params.motor_power" label="20">200</el-radio>
                    <el-radio v-model="params.motor_power" label="40">400</el-radio>
                    <el-radio v-model="params.motor_power" label="75">750</el-radio>
                    <el-radio v-model="params.motor_power" label="1K">1000</el-radio>
                    <span>(W)</span>
                  </div>
                </li>
                <li>
                  <div>电机线</div>
                  <div>
                    <el-radio v-model="params.cable_length" label="0">无</el-radio>
                    <el-radio v-model="params.cable_length" label="3">3m</el-radio>
                    <el-radio v-model="params.cable_length" label="5">5m</el-radio>
                  </div>
                </li>
                <li>
                  <div>刹车</div>
                  <div>
                    <el-radio v-model="params.motor_brake" label="A">带刹车</el-radio>
                    <el-radio v-model="params.motor_brake" label="B">不带刹车</el-radio>
                  </div>
                </li>
                <li>
                  <div>电机安装方式</div>
                  <div>
                    <el-radio v-model="params.mountingmotor" label="FW">直接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="FL">左接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="FR">右接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="FD">背接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="FI">内藏</el-radio>
                  </div>
                </li>
                <li>
                  <div>光电开关</div>
                  <div>
                    <el-radio v-model="params.oswitch" label="0">客户自配</el-radio>
                    <el-radio v-model="params.oswitch" label="W">商家提供（PNP）</el-radio>
                  </div>
                </li>
                <li v-show="params.oswitch == 'W'">
                  <div>开关线</div>
                  <div>
                    <el-radio v-model="params.switchline" label="0">无</el-radio>
                    <el-radio v-model="params.switchline" label="2">2m</el-radio>
                    <el-radio v-model="params.switchline" label="5">5m</el-radio>
                  </div>
                </li>
                <li>
                  <div>防尘方式</div>
                  <div>
                    <el-radio v-model="params.seal" label="KA">半封闭</el-radio>
                    <el-radio v-model="params.seal" label="KS">全封闭</el-radio>
                  </div>
                </li>
                <li>
                  <div>安装方式</div>
                  <div>
                    <el-radio v-model="params.moduleinstalled" label="horizontal">水平</el-radio>
                    <el-radio v-model="params.moduleinstalled" label="upside_down">倒挂</el-radio>
                    <el-radio v-model="params.moduleinstalled" label="wall_hang">侧挂</el-radio>
                    <el-radio v-model="params.moduleinstalled" label="vertical">垂直</el-radio>
                  </div>
                </li>
              </ul>
              <div class="operation">
                <span></span>
                <el-button type="primary" size="mini" @click="screen">筛选</el-button>
              </div>
              <el-table border :data="tableData.list">
                <el-table-column label="产品" width="400">
                  <template slot-scope="{ row }">
                    <div class="productInfo">
                      <div>
                        <img :src="row.image" :alt="row.name">
                      </div>
                      <div>
                        <p>
                          名称：
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.name }}</a>
                        </p>
                        <p>
                          型号:
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.model }}</a>
                        </p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sales_price" label="价格"></el-table-column>
                <el-table-column prop="delivery_period" label="交期">
                  <template slot-scope="{ row }">
                    <span>{{ row.delivery_period }} 工作日</span>
                  </template>
                </el-table-column>
                <el-table-column label="图纸">
                  <template slot-scope="{ row }">
                    <div class="drawing">
                      <div v-if="row.drawing_2d">
                        <i class="font_family icon-d2twig"></i>
                        <a target="_blank" :href="row.drawing_2d">下载</a>
                      </div>
                      <div v-if="row.drawing_3d">
                        <i class="font_family icon-d3twig"></i>
                        <a target="_blank" :href="row.drawing_3d">下载</a>
                      </div>
                      <div v-if="row.drawing_2d == '' && row.drawing_3d == ''">无</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="{ row }">
                    <div class="opera">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="joinProject.id = row.id;joinProject.history = row.selling_price_slug;getProject()"
                      >加入项目</el-button>
                      <el-button type="success" size="mini" @click="sendMailto(row.str_id)">发送图纸</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-main>
          <!-- 升降平台 -->
          <el-main class="homeGoodDetail" v-else-if="showDetailState == 4">
            <div class="main">
              <ul></ul>
              <div class="operation">
                <span></span>
                <el-button type="primary" size="mini" @click="screen">筛选</el-button>
              </div>
              <el-table border :data="tableData.list">
                <el-table-column label="产品" width="400">
                  <template slot-scope="{ row }">
                    <div class="productInfo">
                      <div>
                        <img :src="row.image" :alt="row.name">
                      </div>
                      <div>
                        <p>
                          名称：
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.name }}</a>
                        </p>
                        <p>
                          型号:
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.model }}</a>
                        </p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sales_price" label="价格"></el-table-column>
                <el-table-column prop="delivery_period" label="交期">
                  <template slot-scope="{ row }">
                    <span>{{ row.delivery_period }} 工作日</span>
                  </template>
                </el-table-column>
                <el-table-column label="图纸">
                  <template slot-scope="{ row }">
                    <div class="drawing">
                      <div v-if="row.drawing_2d">
                        <i class="font_family icon-d2twig"></i>
                        <a target="_blank" :href="row.drawing_2d">下载</a>
                      </div>
                      <div v-if="row.drawing_3d">
                        <i class="font_family icon-d3twig"></i>
                        <a target="_blank" :href="row.drawing_3d">下载</a>
                      </div>
                      <div v-if="row.drawing_2d == '' && row.drawing_3d == ''">无</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="{ row }">
                    <div class="opera">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="joinProject.id = row.id;joinProject.history = row.selling_price_slug;getProject()"
                      >加入项目</el-button>
                      <el-button type="success" size="mini" @click="sendMailto(row.str_id)">发送图纸</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-main>
          <!-- 动定子 -->
          <el-main class="homeGoodDetail" v-else-if="showDetailState == 5">
            <div class="main">
              <ul>
                <li>
                  <div>运动方式</div>
                  <div>
                    <el-radio v-model="params.exercise_mode" label="dot_to_dot">点到点</el-radio>
                    <el-radio v-model="params.exercise_mode" label="scanning">扫描检测</el-radio>
                  </div>
                </li>
                <li>
                  <div>动子数</div>
                  <div>
                    <el-radio v-model="params.number_of_mover" label="1">1</el-radio>
                    <span>个</span>
                  </div>
                </li>
                <li>
                  <div>负载重量</div>
                  <div>
                    <el-radio v-model="params.load_weight" label="1">1</el-radio>
                    <el-radio v-model="params.load_weight" label="3">3</el-radio>
                    <el-radio v-model="params.load_weight" label="5">5</el-radio>
                    <el-radio v-model="params.load_weight" label="10">10</el-radio>
                    <el-input class="labelInput" v-model="params.load_weight" placeholder="其他"></el-input>
                    <span>kg</span>
                  </div>
                </li>
                <li>
                  <div>
                    <el-radio v-model="params.readswit" label="0">已知速度加速度</el-radio>
                    <el-radio v-model="params.readswit" label="1">三角曲线</el-radio>
                    <el-radio v-model="params.readswit" label="2">已知 V-T 曲线</el-radio>
                  </div>
                  <div class="chartOption">
                    <canvas id="speedChart" width="200" height="200" class="pull-left"></canvas>
                    <div class="pull-left" v-if="params.readswit == 0">
                      <p>
                        <span>移动距离:</span>
                        <el-input v-model="params.distance" placeholder="1000"></el-input>
                        <span>mm</span>
                      </p>
                      <p>
                        <span>速度:</span>
                        <el-radio v-model="params.speed" label="0.5">0.5</el-radio>
                        <el-radio v-model="params.speed" label="1">1</el-radio>
                        <el-radio v-model="params.speed" label="2">2</el-radio>
                        <el-input class="labelInput" v-model="params.speed" placeholder="5">0.5</el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>加速度:</span>
                        <el-radio v-model="params.acceleration" label="5">5</el-radio>
                        <el-radio v-model="params.acceleration" label="10">10</el-radio>
                        <el-radio v-model="params.acceleration" label="20">20</el-radio>
                        <el-input class="labelInput" v-model="params.acceleration" placeholder="5"></el-input>
                        <span>m/s²</span>
                      </p>
                      <p>
                        <span>停留时间:</span>
                        <el-radio v-model="params.stay_time" label="0.5">0.5</el-radio>
                        <el-input class="labelInput" v-model="params.stay_time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                    </div>
                    <div class="pull-left" v-else-if="params.readswit == 1">
                      <p>
                        <span>移动距离:</span>
                        <el-input v-model="params.distance" placeholder="1000"></el-input>
                        <span>mm</span>
                      </p>
                      <p>
                        <span>用时:</span>
                        <el-radio v-model="params.time" label="1">1</el-radio>
                        <el-input v-model="params.time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                      <p>
                        <span>停留时间:</span>
                        <el-radio v-model="params.stay_time" label="0.5">0.5</el-radio>
                        <el-input v-model="params.stay_time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                    </div>
                    <div class="pull-left" v-else>
                      <p>
                        <span>移动距离:</span>
                        <el-input v-model="params.distance" placeholder="1000"></el-input>
                        <span>mm</span>
                      </p>
                      <p>
                        <span>加速时间 t1:</span>
                        <el-radio v-model="params.accelerationTime" label="0.5">0.5</el-radio>
                        <el-input v-model="params.accelerationTime" placeholder="其他"></el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>匀速时间 t2:</span>
                        <el-radio v-model="params.uniformTime" label="0.5">0.5</el-radio>
                        <el-input v-model="params.uniformTime" placeholder="其他"></el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>减速时间 t3:</span>
                        <el-radio v-model="params.slowTime" label="0.5">0.5</el-radio>
                        <el-input v-model="params.slowTime" placeholder="其他"></el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>停留时间:</span>
                        <el-radio v-model="params.stay_time" label="0.5">0.5</el-radio>
                        <el-input v-model="params.stay_time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="operation">
                <span></span>
                <el-button type="primary" size="mini" @click="screen">筛选</el-button>
              </div>
              <el-table border :data="tableData.list">
                <el-table-column label="产品" width="400">
                  <template slot-scope="{ row }">
                    <div class="productInfo">
                      <div>
                        <img :src="row.image" :alt="row.name">
                      </div>
                      <div>
                        <p>
                          名称：
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.name }}</a>
                        </p>
                        <p>
                          型号:
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.model }}</a>
                        </p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sales_price" label="价格"></el-table-column>
                <el-table-column prop="delivery_period" label="交期">
                  <template slot-scope="{ row }">
                    <span>{{ row.delivery_period }} 工作日</span>
                  </template>
                </el-table-column>
                <el-table-column label="图纸">
                  <template slot-scope="{ row }">
                    <div class="drawing">
                      <div v-if="row.drawing_2d">
                        <i class="font_family icon-d2twig"></i>
                        <a target="_blank" :href="row.drawing_2d">下载</a>
                      </div>
                      <div v-if="row.drawing_3d">
                        <i class="font_family icon-d3twig"></i>
                        <a target="_blank" :href="row.drawing_3d">下载</a>
                      </div>
                      <div v-if="row.drawing_2d == '' && row.drawing_3d == ''">无</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="{ row }">
                    <div class="opera">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="joinProject.id = row.id;joinProject.history = row.selling_price_slug;getProject()"
                      >加入项目</el-button>
                      <el-button type="success" size="mini" @click="sendMailto(row.str_id)">发送图纸</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-main>
          <!-- FPC 跳水台 -->
          <el-main class="homeGoodDetail" v-else-if="showDetailState == 6">
            <div class="main">
              <ul></ul>
              <div class="operation">
                <span></span>
                <el-button type="primary" size="mini" @click="screen">筛选</el-button>
              </div>
              <el-table border :data="tableData.list">
                <el-table-column label="产品" width="400">
                  <template slot-scope="{ row }">
                    <div class="productInfo">
                      <div>
                        <img :src="row.image" :alt="row.name">
                      </div>
                      <div>
                        <p>
                          名称：
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.name }}</a>
                        </p>
                        <p>
                          型号:
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.model }}</a>
                        </p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sales_price" label="价格"></el-table-column>
                <el-table-column prop="delivery_period" label="交期">
                  <template slot-scope="{ row }">
                    <span>{{ row.delivery_period }} 工作日</span>
                  </template>
                </el-table-column>
                <el-table-column label="图纸">
                  <template slot-scope="{ row }">
                    <div class="drawing">
                      <div v-if="row.drawing_2d">
                        <i class="font_family icon-d2twig"></i>
                        <a target="_blank" :href="row.drawing_2d">下载</a>
                      </div>
                      <div v-if="row.drawing_3d">
                        <i class="font_family icon-d3twig"></i>
                        <a target="_blank" :href="row.drawing_3d">下载</a>
                      </div>
                      <div v-if="row.drawing_2d == '' && row.drawing_3d == ''">无</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="{ row }">
                    <div class="opera">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="joinProject.id = row.id;joinProject.history = row.selling_price_slug;getProject()"
                      >加入项目</el-button>
                      <el-button type="success" size="mini" @click="sendMailto(row.str_id)">发送图纸</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-main>
          <!-- FPC 飞行光路 -->
          <el-main class="homeGoodDetail" v-else-if="showDetailState == 7">
            <div class="main">
              <ul></ul>
              <div class="operation">
                <span></span>
                <el-button type="primary" size="mini" @click="screen">筛选</el-button>
              </div>
              <el-table border :data="tableData.list">
                <el-table-column label="产品" width="400">
                  <template slot-scope="{ row }">
                    <div class="productInfo">
                      <div>
                        <img :src="row.image" :alt="row.name">
                      </div>
                      <div>
                        <p>
                          名称：
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.name }}</a>
                        </p>
                        <p>
                          型号:
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.model }}</a>
                        </p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sales_price" label="价格"></el-table-column>
                <el-table-column prop="delivery_period" label="交期">
                  <template slot-scope="{ row }">
                    <span>{{ row.delivery_period }} 工作日</span>
                  </template>
                </el-table-column>
                <el-table-column label="图纸">
                  <template slot-scope="{ row }">
                    <div class="drawing">
                      <div v-if="row.drawing_2d">
                        <i class="font_family icon-d2twig"></i>
                        <a target="_blank" :href="row.drawing_2d">下载</a>
                      </div>
                      <div v-if="row.drawing_3d">
                        <i class="font_family icon-d3twig"></i>
                        <a target="_blank" :href="row.drawing_3d">下载</a>
                      </div>
                      <div v-if="row.drawing_2d == '' && row.drawing_3d == ''">无</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="{ row }">
                    <div class="opera">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="joinProject.id = row.id;joinProject.history = row.selling_price_slug;getProject()"
                      >加入项目</el-button>
                      <el-button type="success" size="mini" @click="sendMailto(row.str_id)">发送图纸</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-main>
          <!-- FPC 桥架 -->
          <el-main class="homeGoodDetail" v-else-if="showDetailState == 8">
            <div class="main">
              <ul></ul>
              <div class="operation">
                <span></span>
                <el-button type="primary" size="mini" @click="screen">筛选</el-button>
              </div>
              <el-table border :data="tableData.list">
                <el-table-column label="产品" width="400">
                  <template slot-scope="{ row }">
                    <div class="productInfo">
                      <div>
                        <img :src="row.image" :alt="row.name">
                      </div>
                      <div>
                        <p>
                          名称：
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.name }}</a>
                        </p>
                        <p>
                          型号:
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.model }}</a>
                        </p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sales_price" label="价格"></el-table-column>
                <el-table-column prop="delivery_period" label="交期">
                  <template slot-scope="{ row }">
                    <span>{{ row.delivery_period }} 工作日</span>
                  </template>
                </el-table-column>
                <el-table-column label="图纸">
                  <template slot-scope="{ row }">
                    <div class="drawing">
                      <div v-if="row.drawing_2d">
                        <i class="font_family icon-d2twig"></i>
                        <a target="_blank" :href="row.drawing_2d">下载</a>
                      </div>
                      <div v-if="row.drawing_3d">
                        <i class="font_family icon-d3twig"></i>
                        <a target="_blank" :href="row.drawing_3d">下载</a>
                      </div>
                      <div v-if="row.drawing_2d == '' && row.drawing_3d == ''">无</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="{ row }">
                    <div class="opera">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="joinProject.id = row.id;joinProject.history = row.selling_price_slug;getProject()"
                      >加入项目</el-button>
                      <el-button type="success" size="mini" @click="sendMailto(row.str_id)">发送图纸</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-main>
          <!-- 丝杆 XY 标准 -->
          <el-main class="homeGoodDetail" v-else-if="showDetailState == 9">
            <div class="main">
              <ul>
                <li>
                  <div>负载重量</div>
                  <div>
                    <el-radio v-model="params.load_weight" label="3">3</el-radio>
                    <el-radio v-model="params.load_weight" label="5">5</el-radio>
                    <el-radio v-model="params.load_weight" label="10">10</el-radio>
                    <el-input class="labelInput" v-model="params.load_weight" placeholder="其他"></el-input>
                    <span>kg</span>
                  </div>
                </li>
                <li>
                  <div>X轴 有效行程</div>
                  <div>
                    <el-input v-model="params.x_distance" placeholder="输入"></el-input>
                    <span>mm</span>
                  </div>
                </li>
                <li>
                  <div>Y轴 有效行程</div>
                  <div>
                    <el-input v-model="params.y_distance" placeholder="输入"></el-input>
                    <span>mm</span>
                  </div>
                </li>
                <li>
                  <div>X轴 最大速度</div>
                  <div>
                    <el-input v-model="params.x_maximum_speed" placeholder="输入"></el-input>
                    <span>
                      mm/s
                      <small>（行程超过700mm，最大速度递减15%）</small>
                    </span>
                    <p
                      class="speedTips"
                      v-show="screwRealXSpeed"
                    >理论上最高速度可达到{{ screwRealXSpeed }} mm/s</p>
                  </div>
                </li>
                <li>
                  <div>Y轴 最大速度</div>
                  <div>
                    <el-input v-model="params.y_maximum_speed" placeholder="输入"></el-input>
                    <span>
                      mm/s
                      <small>（行程超过700mm，最大速度递减15%）</small>
                    </span>
                    <p
                      class="speedTips"
                      v-show="screwRealYSpeed"
                    >理论上最高速度可达到{{ screwRealYSpeed }} mm/s</p>
                  </div>
                </li>
                <li v-show="params.mountingmotor == 'FW'">
                  <div>联轴器</div>
                  <div>
                    <el-radio v-model="params.couplings" label="0">客户自配</el-radio>
                    <el-radio v-model="params.couplings" label="1">配联轴器</el-radio>
                    <span>（电机直接可选配联轴器，其他方式均无）</span>
                  </div>
                </li>
                <li>
                  <div>模组是否配电机</div>
                  <div>
                    <el-radio v-model="params.module_configuration_motor" label="0">不配</el-radio>
                    <el-radio v-model="params.module_configuration_motor" label="1">配</el-radio>
                  </div>
                </li>
                <li>
                  <div>自选电机品牌</div>
                  <div>
                    <el-select v-model="params.motor_brand">
                      <el-option
                        v-for="(item,index) in typeSelection.motor_brand"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </li>
                <li>
                  <div>电机线</div>
                  <div>
                    <el-radio v-model="params.cable_length" label="0">无</el-radio>
                    <el-radio v-model="params.cable_length" label="3">3m</el-radio>
                    <el-radio v-model="params.cable_length" label="5">5m</el-radio>
                  </div>
                </li>
                <li>
                  <div>电机安装方式</div>
                  <div>
                    <el-radio v-model="params.mountingmotor" label="FW">直接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="FL">左接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="FR">右接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="FD">背接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="FI">内藏</el-radio>
                  </div>
                </li>
                <li>
                  <div>光电开关</div>
                  <div>
                    <el-radio v-model="params.oswitch" label="0">客户自配</el-radio>
                    <el-radio v-model="params.oswitch" label="1">商家提供（PNP）</el-radio>
                  </div>
                </li>
                <li v-show="params.oswitch == '1'">
                  <div>开关线</div>
                  <div>
                    <el-radio v-model="params.switchline" label="0">无</el-radio>
                    <el-radio v-model="params.switchline" label="2">2m</el-radio>
                    <el-radio v-model="params.switchline" label="5">5m</el-radio>
                  </div>
                </li>
                <li>
                  <div>横组安装方式</div>
                  <div>
                    <el-radio v-model="params.moduleinstalled" label="horizontal">水平</el-radio>
                  </div>
                </li>
              </ul>
              <img src="../../../assets/img/screw_xy_platform.png" class="diagram" style>
              <div class="operation">
                <span></span>
                <el-button type="primary" size="mini" @click="screen">筛选</el-button>
              </div>
              <el-table border :data="tableData.list">
                <el-table-column label="产品" width="400">
                  <template slot-scope="{ row }">
                    <div class="productInfo">
                      <div>
                        <img :src="row.image" :alt="row.name">
                      </div>
                      <div>
                        <p>
                          名称：
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.name }}</a>
                        </p>
                        <p>
                          型号:
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.model }}</a>
                        </p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sales_price" label="价格"></el-table-column>
                <el-table-column prop="delivery_period" label="交期">
                  <template slot-scope="{ row }">
                    <span>{{ row.delivery_period }} 工作日</span>
                  </template>
                </el-table-column>
                <el-table-column label="图纸">
                  <template slot-scope="{ row }">
                    <div class="drawing">
                      <div v-if="row.drawing_2d">
                        <i class="font_family icon-d2twig"></i>
                        <a target="_blank" :href="row.drawing_2d">下载</a>
                      </div>
                      <div v-if="row.drawing_3d">
                        <i class="font_family icon-d3twig"></i>
                        <a target="_blank" :href="row.drawing_3d">下载</a>
                      </div>
                      <div v-if="row.drawing_2d == '' && row.drawing_3d == ''">无</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="{ row }">
                    <div class="opera">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="joinProject.id = row.id;joinProject.history = row.selling_price_slug;getProject()"
                      >加入项目</el-button>
                      <el-button type="success" size="mini" @click="sendMailto(row.str_id)">发送图纸</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-main>
          <!-- 丝杆 XY 悬臂 -->
          <el-main class="homeGoodDetail" v-else-if="showDetailState == 11">
            <div class="main">
              <ul>
                <li>
                  <div>负载重量</div>
                  <div>
                    <el-radio v-model="params.load_weight" label="3">3</el-radio>
                    <el-radio v-model="params.load_weight" label="5">5</el-radio>
                    <el-radio v-model="params.load_weight" label="10">10</el-radio>
                    <el-input class="labelInput" v-model="params.load_weight" placeholder="其他"></el-input>
                    <span>kg</span>
                  </div>
                </li>
                <li>
                  <div>X轴 有效行程</div>
                  <div>
                    <el-input v-model="params.x_distance" placeholder="输入"></el-input>
                    <span>mm</span>
                  </div>
                </li>
                <li>
                  <div>Y轴 有效行程</div>
                  <div>
                    <el-input v-model="params.y_distance" placeholder="输入"></el-input>
                    <span>mm</span>
                  </div>
                </li>
                <li>
                  <div>X轴 速度</div>
                  <div>
                    <el-input v-model="params.x_maximum_speed" placeholder="输入"></el-input>
                    <span>
                      mm/s
                      <small>（行程超过700mm，最大速度递减15%）</small>
                    </span>
                    <p
                      class="speedTips"
                      v-show="screwRealXSpeed"
                    >理论上最高速度可达到{{ screwRealXSpeed }} mm/s</p>
                  </div>
                </li>
                <li>
                  <div>Y轴 速度</div>
                  <div>
                    <el-input v-model="params.y_maximum_speed" placeholder="输入"></el-input>
                    <span>
                      mm/s
                      <small>（行程超过700mm，最大速度递减15%）</small>
                    </span>
                    <p
                      class="speedTips"
                      v-show="screwRealYSpeed"
                    >理论上最高速度可达到{{ screwRealYSpeed }} mm/s</p>
                  </div>
                </li>
                <li v-show="params.mountingmotor == 'FW'">
                  <div>联轴器</div>
                  <div>
                    <el-radio v-model="params.couplings" label="0">客户自配</el-radio>
                    <el-radio v-model="params.couplings" label="1">配联轴器</el-radio>
                    <span>（电机直接可选配联轴器，其他方式均无）</span>
                  </div>
                </li>
                <li>
                  <div>模组是否配电机</div>
                  <div>
                    <el-radio v-model="params.module_configuration_motor" label="0">不配</el-radio>
                    <el-radio v-model="params.module_configuration_motor" label="1">配</el-radio>
                  </div>
                </li>
                <li>
                  <div>自选电机品牌</div>
                  <div>
                    <el-select v-model="params.motor_brand">
                      <el-option
                        v-for="(item,index) in typeSelection.motor_brand"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </li>
                <li>
                  <div>电机线</div>
                  <div>
                    <el-radio v-model="params.cable_length" label="0">无</el-radio>
                    <el-radio v-model="params.cable_length" label="3">3m</el-radio>
                    <el-radio v-model="params.cable_length" label="5">5m</el-radio>
                  </div>
                </li>
                <li>
                  <div>电机安装方式</div>
                  <div>
                    <el-radio v-model="params.mountingmotor" label="FW">直接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="FL">左接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="FR">右接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="FD">背接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="FI">内藏</el-radio>
                  </div>
                </li>
                <li>
                  <div>光电开关</div>
                  <div>
                    <el-radio v-model="params.oswitch" label="0">客户自配</el-radio>
                    <el-radio v-model="params.oswitch" label="W">商家提供（PNP）</el-radio>
                  </div>
                </li>
                <li v-show="params.oswitch == 'W'">
                  <div>开关线</div>
                  <div>
                    <el-radio v-model="params.switchline" label="0">无</el-radio>
                    <el-radio v-model="params.switchline" label="2">2m</el-radio>
                    <el-radio v-model="params.switchline" label="5">5m</el-radio>
                  </div>
                </li>
                <li>
                  <div>横组安装方式</div>
                  <div>
                    <el-radio v-model="params.module_install_method" label="horizon">水平</el-radio>
                  </div>
                </li>
              </ul>
              <div class="operation">
                <span></span>
                <el-button type="primary" size="mini" @click="screen">筛选</el-button>
              </div>
              <el-table border :data="tableData.list">
                <el-table-column label="产品" width="400">
                  <template slot-scope="{ row }">
                    <div class="productInfo">
                      <div>
                        <img :src="row.image" :alt="row.name">
                      </div>
                      <div>
                        <p>
                          名称：
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.name }}</a>
                        </p>
                        <p>
                          型号:
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.model }}</a>
                        </p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sales_price" label="价格"></el-table-column>
                <el-table-column prop="delivery_period" label="交期">
                  <template slot-scope="{ row }">
                    <span>{{ row.delivery_period }} 工作日</span>
                  </template>
                </el-table-column>
                <el-table-column label="图纸">
                  <template slot-scope="{ row }">
                    <div class="drawing">
                      <div v-if="row.drawing_2d">
                        <i class="font_family icon-d2twig"></i>
                        <a target="_blank" :href="row.drawing_2d">下载</a>
                      </div>
                      <div v-if="row.drawing_3d">
                        <i class="font_family icon-d3twig"></i>
                        <a target="_blank" :href="row.drawing_3d">下载</a>
                      </div>
                      <div v-if="row.drawing_2d == '' && row.drawing_3d == ''">无</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="{ row }">
                    <div class="opera">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="joinProject.id = row.id;joinProject.history = row.selling_price_slug;getProject()"
                      >加入项目</el-button>
                      <el-button type="success" size="mini" @click="sendMailto(row.str_id)">发送图纸</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-main>
          <!-- 丝杆 XYZ搭轴 -->
          <el-main class="homeGoodDetail" v-else-if="showDetailState == 12">
            <div class="main">
              <ul>
                <li>
                  <div>负载重量</div>
                  <div>
                    <el-radio v-model="params.load_weight" label="3">3</el-radio>
                    <el-radio v-model="params.load_weight" label="5">5</el-radio>
                    <el-radio v-model="params.load_weight" label="10">10</el-radio>
                    <el-input class="labelInput" v-model="params.load_weight" placeholder="其他"></el-input>
                    <span>kg</span>
                  </div>
                </li>
                <li>
                  <div>X轴 有效行程</div>
                  <div>
                    <el-input v-model="params.x_distance" placeholder="输入"></el-input>
                    <span>mm</span>
                  </div>
                </li>
                <li>
                  <div>Y轴 有效行程</div>
                  <div>
                    <el-input v-model="params.y_distance" placeholder="输入"></el-input>
                    <span>mm</span>
                  </div>
                </li>
                <li>
                  <div>Z轴 有效行程</div>
                  <div>
                    <el-input v-model="params.z_distance" placeholder="输入"></el-input>
                    <span>mm</span>
                  </div>
                </li>
                <li>
                  <div>X轴 速度</div>
                  <div>
                    <el-input v-model="params.x_maximum_speed" placeholder="输入"></el-input>
                    <span>
                      mm/s
                      <small>（行程超过700mm，最大速度递减15%）</small>
                    </span>
                    <p
                      class="speedTips"
                      v-show="screwRealXSpeed"
                    >理论上最高速度可达到{{ screwRealXSpeed }} mm/s</p>
                  </div>
                </li>
                <li>
                  <div>Y轴 速度</div>
                  <div>
                    <el-input v-model="params.y_maximum_speed" placeholder="输入"></el-input>
                    <span>
                      mm/s
                      <small>（行程超过700mm，最大速度递减15%）</small>
                    </span>
                    <p
                      class="speedTips"
                      v-show="screwRealYSpeed"
                    >理论上最高速度可达到{{ screwRealYSpeed }} mm/s</p>
                  </div>
                </li>
                <li>
                  <div>Z轴 速度</div>
                  <div>
                    <el-input v-model="params.z_maximum_speed" placeholder="输入"></el-input>
                    <span>mm/s</span>
                  </div>
                </li>
                <li v-show="params.mountingmotor == 'FW'">
                  <div>联轴器</div>
                  <div>
                    <el-radio v-model="params.couplings" label="0">客户自配</el-radio>
                    <el-radio v-model="params.couplings" label="1">配联轴器</el-radio>
                    <span>（电机直接可选配联轴器，其他方式均无）</span>
                  </div>
                </li>
                <li>
                  <div>模组是否配电机</div>
                  <div>
                    <el-radio v-model="params.module_motor" label="n">不配</el-radio>
                    <el-radio v-model="params.module_motor" label="y">配</el-radio>
                  </div>
                </li>
                <li>
                  <div>自选电机品牌</div>
                  <div>
                    <el-select v-model="params.motor_brand">
                      <el-option
                        v-for="(item,index) in typeSelection.motor_brand"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </li>
                <li>
                  <div>电机线</div>
                  <div>
                    <el-radio v-model="params.cable_length" label="0">无</el-radio>
                    <el-radio v-model="params.cable_length" label="3">3m</el-radio>
                    <el-radio v-model="params.cable_length" label="5">5m</el-radio>
                  </div>
                </li>
                <li>
                  <div>电机安装方式</div>
                  <div>
                    <el-radio v-model="params.mountingmotor" label="FW">直接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="FL">左接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="FR">右接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="FD">背接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="FI">内藏</el-radio>
                  </div>
                </li>
                <li>
                  <div>光电开关</div>
                  <div>
                    <el-radio v-model="params.oswitch" label="0">客户自配</el-radio>
                    <el-radio v-model="params.oswitch" label="1">商家提供（PNP）</el-radio>
                  </div>
                </li>
                <li v-show="params.oswitch == '1'">
                  <div>开关线</div>
                  <div>
                    <el-radio v-model="params.switchline" label="0">无</el-radio>
                    <el-radio v-model="params.switchline" label="2">2m</el-radio>
                    <el-radio v-model="params.switchline" label="5">5m</el-radio>
                  </div>
                </li>
                <li>
                  <div>横组安装方式</div>
                  <div>
                    <el-radio v-model="params.moduleinstalled" label="horizontal">水平</el-radio>
                  </div>
                </li>
              </ul>
              <div class="operation">
                <span></span>
                <el-button type="primary" size="mini" @click="screen">筛选</el-button>
              </div>
              <el-table border :data="tableData.list">
                <el-table-column label="产品" width="400">
                  <template slot-scope="{ row }">
                    <div class="productInfo">
                      <div>
                        <img :src="row.image" :alt="row.name">
                      </div>
                      <div>
                        <p>
                          名称：
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.name }}</a>
                        </p>
                        <p>
                          型号:
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.model }}</a>
                        </p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sales_price" label="价格"></el-table-column>
                <el-table-column prop="delivery_period" label="交期">
                  <template slot-scope="{ row }">
                    <span>{{ row.delivery_period }} 工作日</span>
                  </template>
                </el-table-column>
                <el-table-column label="图纸">
                  <template slot-scope="{ row }">
                    <div class="drawing">
                      <div v-if="row.drawing_2d">
                        <i class="font_family icon-d2twig"></i>
                        <a target="_blank" :href="row.drawing_2d">下载</a>
                      </div>
                      <div v-if="row.drawing_3d">
                        <i class="font_family icon-d3twig"></i>
                        <a target="_blank" :href="row.drawing_3d">下载</a>
                      </div>
                      <div v-if="row.drawing_2d == '' && row.drawing_3d == ''">无</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="{ row }">
                    <div class="opera">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="joinProject.id = row.id;joinProject.history = row.selling_price_slug;getProject()"
                      >加入项目</el-button>
                      <el-button type="success" size="mini" @click="sendMailto(row.str_id)">发送图纸</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-main>
          <!-- 电机 XY标准机 -->
          <el-main class="homeGoodDetail" v-else-if="showDetailState == 10">
            <div class="main">
              <ul>
                <li>
                  <div>已知速度加速度</div>
                  <div class="chartOption">
                    <canvas id="speedChart" width="200" height="200" class="pull-left"></canvas>
                    <div class="pull-left">
                      <p>
                        <span>行程:</span>
                        <el-input v-model="params.distance" placeholder="1000"></el-input>
                        <span>mm</span>
                      </p>
                      <p>
                        <span>速度:</span>
                        <el-radio v-model="params.speed" label="0.5">0.5</el-radio>
                        <el-radio v-model="params.speed" label="1">1</el-radio>
                        <el-radio v-model="params.speed" label="2">2</el-radio>
                        <el-input class="labelInput" v-model="params.speed" placeholder="5">0.5</el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>加速度:</span>
                        <el-radio v-model="params.acceleration" label="5">5</el-radio>
                        <el-radio v-model="params.acceleration" label="10">10</el-radio>
                        <el-radio v-model="params.acceleration" label="20">20</el-radio>
                        <el-input class="labelInput" v-model="params.acceleration" placeholder="5"></el-input>
                        <span>m/s²</span>
                      </p>
                      <p>
                        <span>停留时间:</span>
                        <el-radio v-model="params.stay_time" label="0.5">0.5</el-radio>
                        <el-input class="labelInput" v-model="params.stay_time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                    </div>
                  </div>
                </li>
                <li>
                  <div>安装方式</div>
                  <div>
                    <el-radio v-model="params.moduleinstalled" label="horizontal">水平</el-radio>
                    <el-radio v-model="params.moduleinstalled" label="upside_down">倒挂</el-radio>
                    <el-radio v-model="params.moduleinstalled" label="wall_hang">侧挂</el-radio>
                    <el-radio v-model="params.moduleinstalled" label="vertical">垂直</el-radio>
                  </div>
                </li>
                <li>
                  <div>
                    <el-radio v-model="params.feedback_type" label>重现精度</el-radio>
                    <el-radio v-model="params.feedback_type" label="grating_ruler">光栅尺</el-radio>
                    <el-radio v-model="params.feedback_type" label="magnetic_scale">磁栅尺</el-radio>
                  </div>
                  <div>
                    <p v-if="params.feedback_type == 'grating_ruler'">
                      <el-radio v-model="params.precision" label="1">1</el-radio>
                      <el-radio v-model="params.precision" label="0.5">0.5</el-radio>
                      <el-radio v-model="params.precision" label="0.1">0.1</el-radio>
                      <el-input class="labelInput" v-model="params.precision"></el-input>
                      <span>μm</span>
                    </p>
                    <p v-else-if="params.feedback_type == 'magnetic_scale'">
                      <el-radio v-model="params.positioning_accuracy" label="1">1</el-radio>
                      <el-radio v-model="params.positioning_accuracy" label="0.5">0.5</el-radio>
                      <el-radio v-model="params.positioning_accuracy" label="0.1">0.1</el-radio>
                      <el-input class="labelInput" v-model="params.positioning_accuracy"></el-input>
                      <span>μm</span>
                    </p>
                    <p v-else>
                      <span>重现精度:</span>
                      <el-radio v-model="params.reproduce_the_accuracy" label="3">3</el-radio>
                      <el-radio v-model="params.reproduce_the_accuracy" label="1">1</el-radio>
                      <el-input v-model="params.reproduce_the_accuracy" placeholder="其他"></el-input>
                      <span>μm</span>
                    </p>
                  </div>
                </li>
                <li>
                  <div>拖链方向</div>
                  <div>
                    <el-radio v-model="params.towline_direction" label="horizontal">水平</el-radio>
                    <el-radio v-model="params.towline_direction" label="vertical">垂直</el-radio>
                  </div>
                </li>
                <li>
                  <div>线缆长</div>
                  <div>
                    <el-radio v-model="params.cable_length" label="0">无</el-radio>
                    <el-radio v-model="params.cable_length" label="3">3m</el-radio>
                    <el-radio v-model="params.cable_length" label="5">5m</el-radio>
                  </div>
                </li>
                <li>
                  <div>防尘装置</div>
                  <div>
                    <el-radio v-model="params.dustproof_device" label>无</el-radio>
                    <el-radio v-model="params.dustproof_device" label="metal_cover">金属盖板</el-radio>
                    <el-radio v-model="params.dustproof_device" label="organ_cover">风琴罩</el-radio>
                  </div>
                </li>
                <li>
                  <div>动子数</div>
                  <div>
                    <el-radio v-model="params.number_of_mover" label="1">1</el-radio>
                    <span>个</span>
                  </div>
                </li>
                <li>
                  <div>运动方式</div>
                  <div>
                    <el-radio v-model="params.exercise_mode" label="dot_to_dot">点到点</el-radio>
                    <el-radio v-model="params.exercise_mode" label="scanning">扫描检测</el-radio>
                  </div>
                </li>
                <li v-show="typeSelection.XYB == 0">
                  <div>负载重量</div>
                  <div>
                    <el-radio v-model="params.load_weight" label="3">3</el-radio>
                    <el-radio v-model="params.load_weight" label="5">5</el-radio>
                    <el-radio v-model="params.load_weight" label="10">10</el-radio>
                    <el-input class="labelInput" v-model="params.load_weight" placeholder="其他"></el-input>
                    <span>kg</span>
                  </div>
                </li>
                <li>
                  <div>驱动类型</div>
                  <div>
                    <el-radio v-model="params.driver_type" label="CDHD">高创</el-radio>
                    <el-radio v-model="params.driver_type" label="Hiwin">Hiwin</el-radio>
                    <el-radio v-model="params.driver_type" label>客户自配</el-radio>
                  </div>
                </li>
              </ul>
              <div class="typeSelection">
                <div :class="typeSelection.XYB == 0 ? 'active' : '' ">Y轴</div>
                <div :class="typeSelection.XYB == 1 ? 'active' : '' ">X轴</div>
              </div>
              <ul>
                <li></li>
              </ul>
              <div class="operation">
                <span></span>
                <el-button
                  type="primary"
                  size="mini"
                  @click="screen();typeSelection.selling_price_slug = ''"
                  v-if="typeSelection.XYB == 0"
                >下一步</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click="typeSelection.XYB = 0;typeSelection.selling_price_slug = ''"
                  v-if="typeSelection.XYB == 1"
                >上一步</el-button>
              </div>
              <el-table border :data="tableData.list">
                <el-table-column label="产品" width="400">
                  <template slot-scope="{ row }">
                    <div class="productInfo">
                      <div>
                        <img :src="row.image" :alt="row.name">
                      </div>
                      <div>
                        <p>
                          名称：
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.name }}</a>
                        </p>
                        <p>
                          型号:
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.model }}</a>
                        </p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sales_price" label="价格"></el-table-column>
                <el-table-column prop="delivery_period" label="交期">
                  <template slot-scope="{ row }">
                    <span>{{ row.delivery_period }} 工作日</span>
                  </template>
                </el-table-column>
                <el-table-column label="图纸">
                  <template slot-scope="{ row }">
                    <div class="drawing">
                      <div v-if="row.drawing_2d">
                        <i class="font_family icon-d2twig"></i>
                        <a target="_blank" :href="row.drawing_2d">下载</a>
                      </div>
                      <div v-if="row.drawing_3d">
                        <i class="font_family icon-d3twig"></i>
                        <a target="_blank" :href="row.drawing_3d">下载</a>
                      </div>
                      <div v-if="row.drawing_2d == '' && row.drawing_3d == ''">无</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="{ row }">
                    <div class="opera" v-if="!typeSelection.selling_price_slug">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="typeSelection.selling_price_slug = row.selling_price_slug;screen()"
                      >筛选</el-button>
                    </div>
                    <div class="opera" v-else>
                      <el-button
                        type="primary"
                        size="mini"
                        @click="joinProject.id = row.id;joinProject.history = row.selling_price_slug;getProject()"
                      >加入项目</el-button>
                      <el-button type="success" size="mini" @click="sendMailto(row.str_id)">发送图纸</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-main>
          <!-- 非标准品 -->
          <el-main class="homeGoodDetail" v-else-if="showDetailState == 13">
            <div class="main">
              <el-form label-position="top" :model="nonstandard">
                <el-form-item label="非标产品需求描述">
                  <el-input type="textarea" placeholder="请填写" v-model="nonstandard.requirements"></el-input>
                </el-form-item>
                <el-form-item label="上传附件">
                  <el-upload
                    class="upload-demo"
                    action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
                    :file-list="nonstandard.fileUrl"
                    :before-upload="upload"
                    :on-remove="handleRemove"
                    list-type="picture"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">单文件上传100M以内</div>
                  </el-upload>
                </el-form-item>
              </el-form>
              <div align="right">
                <!-- <el-button
                  size="mini"
                  type="primary"
                  @click="$store.commit('changeModal', 'supplierModal')"
                >确定</el-button>-->
                <el-button size="mini" type="primary" @click="createNon">确定</el-button>
              </div>
            </div>
          </el-main>
          <!-- 3015整机 -->
          <el-main class="homeGoodDetail" v-else-if="showDetailState == 14">
            <div class="main">
              <ul></ul>
              <div class="operation">
                <span></span>
                <el-button type="primary" size="mini" @click="screen">筛选</el-button>
              </div>
              <el-table border :data="tableData.list">
                <el-table-column label="产品" width="400">
                  <template slot-scope="{ row }">
                    <div class="productInfo">
                      <div>
                        <img :src="row.image" :alt="row.name">
                      </div>
                      <div>
                        <p>
                          名称：
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.name }}</a>
                        </p>
                        <p>
                          型号:
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.model }}</a>
                        </p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sales_price" label="价格"></el-table-column>
                <el-table-column prop="delivery_period" label="交期">
                  <template slot-scope="{ row }">
                    <span>{{ row.delivery_period }} 工作日</span>
                  </template>
                </el-table-column>
                <el-table-column label="图纸">
                  <template slot-scope="{ row }">
                    <div class="drawing">
                      <div v-if="row.drawing_2d">
                        <i class="font_family icon-d2twig"></i>
                        <a target="_blank" :href="row.drawing_2d">下载</a>
                      </div>
                      <div v-if="row.drawing_3d">
                        <i class="font_family icon-d3twig"></i>
                        <a target="_blank" :href="row.drawing_3d">下载</a>
                      </div>
                      <div v-if="row.drawing_2d == '' && row.drawing_3d == ''">无</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="{ row }">
                    <div class="opera">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="joinProject.id = row.id;joinProject.history = row.selling_price_slug;getProject()"
                      >加入项目</el-button>
                      <el-button type="success" size="mini" @click="sendMailto(row.str_id)">发送图纸</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-main>
          <!-- 3015整机横轴 -->
          <el-main class="homeGoodDetail" v-else-if="showDetailState == 15">
            <div class="main">
              <ul></ul>
              <div class="operation">
                <span></span>
                <el-button type="primary" size="mini" @click="screen">筛选</el-button>
              </div>
              <el-table border :data="tableData.list">
                <el-table-column label="产品" width="400">
                  <template slot-scope="{ row }">
                    <div class="productInfo">
                      <div>
                        <img :src="row.image" :alt="row.name">
                      </div>
                      <div>
                        <p>
                          名称：
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.name }}</a>
                        </p>
                        <p>
                          型号:
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.model }}</a>
                        </p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sales_price" label="价格"></el-table-column>
                <el-table-column prop="delivery_period" label="交期">
                  <template slot-scope="{ row }">
                    <span>{{ row.delivery_period }} 工作日</span>
                  </template>
                </el-table-column>
                <el-table-column label="图纸">
                  <template slot-scope="{ row }">
                    <div class="drawing">
                      <div v-if="row.drawing_2d">
                        <i class="font_family icon-d2twig"></i>
                        <a target="_blank" :href="row.drawing_2d">下载</a>
                      </div>
                      <div v-if="row.drawing_3d">
                        <i class="font_family icon-d3twig"></i>
                        <a target="_blank" :href="row.drawing_3d">下载</a>
                      </div>
                      <div v-if="row.drawing_2d == '' && row.drawing_3d == ''">无</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="{ row }">
                    <div class="opera">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="joinProject.id = row.id;joinProject.history = row.selling_price_slug;getProject()"
                      >加入项目</el-button>
                      <el-button type="success" size="mini" @click="sendMailto(row.str_id)">发送图纸</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-main>
          <!-- 3015整机下轴 -->
          <el-main class="homeGoodDetail" v-else-if="showDetailState == 16">
            <div class="main">
              <ul></ul>
              <div class="operation">
                <span></span>
                <el-button type="primary" size="mini" @click="screen">筛选</el-button>
              </div>
              <el-table border :data="tableData.list">
                <el-table-column label="产品" width="400">
                  <template slot-scope="{ row }">
                    <div class="productInfo">
                      <div>
                        <img :src="row.image" :alt="row.name">
                      </div>
                      <div>
                        <p>
                          名称：
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.name }}</a>
                        </p>
                        <p>
                          型号:
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.model }}</a>
                        </p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sales_price" label="价格"></el-table-column>
                <el-table-column prop="delivery_period" label="交期">
                  <template slot-scope="{ row }">
                    <span>{{ row.delivery_period }} 工作日</span>
                  </template>
                </el-table-column>
                <el-table-column label="图纸">
                  <template slot-scope="{ row }">
                    <div class="drawing">
                      <div v-if="row.drawing_2d">
                        <i class="font_family icon-d2twig"></i>
                        <a target="_blank" :href="row.drawing_2d">下载</a>
                      </div>
                      <div v-if="row.drawing_3d">
                        <i class="font_family icon-d3twig"></i>
                        <a target="_blank" :href="row.drawing_3d">下载</a>
                      </div>
                      <div v-if="row.drawing_2d == '' && row.drawing_3d == ''">无</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="{ row }">
                    <div class="opera">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="joinProject.id = row.id;joinProject.history = row.selling_price_slug;getProject()"
                      >加入项目</el-button>
                      <el-button type="success" size="mini" @click="sendMailto(row.str_id)">发送图纸</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-main>
          <!-- 3015整机动定子 -->
          <el-main class="homeGoodDetail" v-else-if="showDetailState == 17">
            <div class="main">
              <ul></ul>
              <div class="operation">
                <span></span>
                <el-button type="primary" size="mini" @click="screen">筛选</el-button>
              </div>
              <el-table border :data="tableData.list">
                <el-table-column label="产品" width="400">
                  <template slot-scope="{ row }">
                    <div class="productInfo">
                      <div>
                        <img :src="row.image" :alt="row.name">
                      </div>
                      <div>
                        <p>
                          名称：
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.name }}</a>
                        </p>
                        <p>
                          型号:
                          <a
                            target="_blank"
                            :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"
                          >{{ row.model }}</a>
                        </p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sales_price" label="价格"></el-table-column>
                <el-table-column prop="delivery_period" label="交期">
                  <template slot-scope="{ row }">
                    <span>{{ row.delivery_period }} 工作日</span>
                  </template>
                </el-table-column>
                <el-table-column label="图纸">
                  <template slot-scope="{ row }">
                    <div class="drawing">
                      <div v-if="row.drawing_2d">
                        <i class="font_family icon-d2twig"></i>
                        <a target="_blank" :href="row.drawing_2d">下载</a>
                      </div>
                      <div v-if="row.drawing_3d">
                        <i class="font_family icon-d3twig"></i>
                        <a target="_blank" :href="row.drawing_3d">下载</a>
                      </div>
                      <div v-if="row.drawing_2d == '' && row.drawing_3d == ''">无</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="{ row }">
                    <div class="opera">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="joinProject.id = row.id;joinProject.history = row.selling_price_slug;getProject()"
                      >加入项目</el-button>
                      <el-button type="success" size="mini" @click="sendMailto(row.str_id)">发送图纸</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-main>
        </el-container>
        <index-chart></index-chart>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import indexChart from "@/pages/Index/common/indexChart";
import echarts from "echarts";
import joinProjectModel from "@/pages/Index/common/joinProject";
import loginModal from "@/pages/Index/common/loginModal";
// import supplierModal from "@/pages/Index/common/supplierModal";

export default {
  name: "indexMain",
  data() {
    return {
      product: {},
      selectedCate: {},
      selectedGood: {},
      selectedDetail: {},
      showDetailState: 0,
      productIndex: 0,
      selectedCateIndex: 0,
      typeSelection: {
        Int: 0,
        FPC: 0,
        XYB: 0,
        selling_price_slug: "",
        motor_brand: [
          { name: "松下", value: "P" },
          { name: "安川", value: "Y" },
          { name: "三菱/汇川", value: "M" },
          { name: "台达", value: "T" },
          { name: "Hiwin", value: "H" },
          { name: "富士", value: "F" }
        ]
      },
      params: {
        accelerationTime: "0.5", // 加速时间
        distance: "1000", // 移动距离
        speed: "0.5", // 速度
        acceleration: "5", // 加速度
        time: "1", // 时间
        accdistance: "1", // 加速距离
        slowdistance: "1", // 减速距离
        slowTime: "0.5", // 减速时间
        uniformTime: "1", // 匀速时间
        uniformdistance: "1", // 匀速距离
        stay_time: "0.5", // 停留时间

        readswit: "0", // 行程计算
        exercise_mode: "dot_to_dot", // 运动方式
        number_of_mover: "1", // 动子数量
        load_weight: "3", // 负载重量

        feedback_type: "grating_ruler", // 反馈类型 光栅尺
        positioning_accuracy: "5", // 定位精准
        precision: "1", // 精度
        towline_direction: "horizontal", // 拖链方向  水平方向
        cable_length: "0", // 线缆长
        reproduce_the_accuracy: "3", // 重现精度
        dustproof_device: "metal_cover", // 防尘装置
        power_voltage: "220", // 驱动电压
        moduleinstalled: "horizontal", // 安装方式
        mountingmotor: "FL", // 电机安装方式
        oswitch: "0", // 光电开关
        switchline: "0", // 开关线
        couplings: "0", // 联轴器	不配联轴器:0 配置联轴器:L
        module_motor: "n", // 是否带马达(模组带电机)	 模组不带马达:N 模组带马达:Y
        motor_brand: "P", // 电机品牌	松下:P 安川:Y 三菱/汇川:M 台达:T Hiwin:H 富士:F
        motor_power: "05", // 马达功率     50W:05 100W:10 200W:20 400W:40 750W:75 1000W:1K
        cable_lenght: "3", // 电机线
        motor_brake: "A", // 马达刹车     带刹车:A 不带刹车:B
        seal: "KA", // 防尘方式	 半封闭KA,，KS全封闭
        driver_type: "", // 驱动类型

        // XY轴平台选型
        x_distance: "400",
        y_distance: "300",
        z_distance: "300",
        x_maximum_speed: "1000",
        y_maximum_speed: "1000",
        z_maximum_speed: "250",
        module_install_method: "horizon",
        module_configuration_motor: "0"
      },
      // 丝杆实际最大速度
      screwRealSpeed: 0,
      screwRealXSpeed: 0,
      screwRealYSpeed: 0,
      screwRealZSpeed: 0,
      speedChart: null,
      joinProject: {
        id: 0,
        projectList: [],
        projectSlug: "",
        status: 0,
        newProjectName: "",
        member: [],
        memberId: [],
        description: ""
      },
      tableData: {},
      // 非标
      nonstandard: {
        requirements: "",
        images_ids: [],
        fileUrl: []
      }
    };
  },
  components: {
    "index-chart": indexChart,
    "join-project": joinProjectModel,
    "login-modal": loginModal
    // "supplier-modal": supplierModal
  },
  methods: {
    getCategory() {
      const loading = this.$loading({ lock: true }),
        that = this;
      that
        .$get("store/category")
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.product = response.data.list;
          that.showCategory(that.product[0].children);
        })
        .catch(error => loading.close());
    },
    showCategory(item) {
      this.selectedCate = item;
      this.showGoodsList(item[0].children);

      if (this.$route.params.modal && this.firstJoin) {
        this.showDetail({ enable: 1, code: this.$route.params.modal });
        this.product.forEach((e,k) => {
          e.children.forEach((item, index) => {
            item.children.forEach(value => {
              if(value.code == this.$route.params.modal){
                this.productIndex = k;
                this.selectedCateIndex = index;
              }
            });
          });
        });
      }
      this.firstJoin = false;
    },
    showGoodsList(item) {
      this.showDetailState = 0;
      this.selectedDetail = {};
      this.selectedGood = item;
      this.tableData = {};
    },
    showDetail(item) {
      let that = this;
      if (item.enable == 1) {
        let url = location.href.split("#")[0];
        switch (item.code) {
          case "linear_module":
            this.showDetailState = 1;
            this.params.speed = "0.5";
            that.initChart();
            break;
          case "liner_motor":
            this.showDetailState = 2;
            this.params.speed = "0.5";
            that.initChart();
            break;
          case "screw_module":
            this.showDetailState = 3;
            this.params.speed = "250";
            break;
          case "precision_lifting_platform":
            this.showDetailState = 4;
            this.screen();
            break;
          case "moving_stator":
            this.showDetailState = 5;
            this.params.speed = "0.5";
            that.initChart();
            break;
          case "fpc_diving_platform":
            this.showDetailState = 6;
            this.screen();
            break;
          case "fpc_flying_light_path":
            this.showDetailState = 7;
            this.screen();
            break;
          case "fpc_bridge":
            this.showDetailState = 8;
            this.screen();
            break;
          case "screw_xy_platform":
            // 丝杆十字标准
            this.showDetailState = 9;
            break;
          case "screw_xy_cantilever":
            // 丝杆悬臂
            this.showDetailState = 11;
            break;
          case "screw_xyz_cantilever":
            this.showDetailState = 12;
            break;
          case "xy_platform":
            this.showDetailState = 10;
            that.initChart();
            break;
          // 非标定制
          case "non_standard_customization":
            if (!this.$ifLogin()) return false;
            this.showDetailState = 13;
            break;
          // D3015整机
          case "d3015_machine":
            this.showDetailState = 14;
            this.screen();
            break;
          case "d3015_machine_horizontal":
            this.showDetailState = 15;
            this.screen();
            break;
          case "d3015_machine_left":
            this.showDetailState = 16;
            this.screen();
            break;
          case "d3015_machine_mover":
            this.showDetailState = 17;
            this.screen();
            break;
          default:
            url = null;
            break;
        }
        url += `#/${item.code}`;
        if (url) location.href = url;
      }
    },
    // 修改Echart显示
    changeSpeedChart() {
      let that = this,
        _self = that.params;
      let option = {
        xAxis: {
          type: "value",
          axisLine: { onZero: false }
        },
        yAxis: {
          type: "value",
          name: "速度 m/s(秒)",
          left: "10%",
          axisLabel: {
            formatter: "{value}" //控制输出格式
          }
        },
        grid: {
          left: "6%",
          right: "6%",
          top: "15%",
          bottom: "5%",
          containLabel: true
        },
        series: [
          {
            data: [
              [0, 0],
              [_self.accelerationTime, _self.speed],
              [
                parseFloat(_self.accelerationTime) +
                  parseFloat(_self.uniformTime),
                _self.speed
              ],
              [
                parseFloat(_self.accelerationTime) +
                  parseFloat(_self.uniformTime) +
                  parseFloat(_self.slowTime),
                0
              ],
              [
                parseFloat(_self.accelerationTime) +
                  parseFloat(_self.uniformTime) +
                  parseFloat(_self.slowTime) +
                  parseFloat(_self.stay_time),
                0
              ]
            ],
            type: "line"
          }
        ]
      };
      if (option && typeof option === "object")
        that.speedChart.setOption(option, true);
    },
    sendMailto(str_id) {
      let that = this;
      this.$prompt("请输入邮箱", "提示", {
        confirmButtonText: "确定",
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: "邮箱格式不正确"
      }).then(({ value }) => {
        that
          .$post("products/details/email/project-paper", {
            strid: str_id,
            email: value
          })
          .catch(err => console.log(err));
      });
    },
    // 筛选
    screen() {
      let that = this,
        loading = this.$loading({ lock: true }),
        url = null;
      switch (that.showDetailState) {
        case 1:
          switch (that.typeSelection.Int) {
            case 0:
              url = "products/selected/liner_motor";
              break;
            case 1:
              url = "products/selected/belt_module";
              break;
            case 2:
              url = "products/selected/screw_module";
              break;
          }
          break;
        case 2:
          url = "products/selected/liner_motor";
          break;
        case 3:
          url = "products/selected/screw_module";
          break;
        case 4:
          url = "products/selected/precision_lifting_platform";
          break;
        case 5:
          url = "products/selected/moving_stator";
          break;
        case 6:
          url = "products/selected/fpc_diving_platform";
          break;
        case 7:
          url = "products/selected/fpc_flying_light_path";
          break;
        case 8:
          url = "products/selected/fpc_bridge";
          break;
        case 9:
          // 丝杆十字标准
          url = "products/selected/screw_xy_platform";
          that.params.motor_installation_method = that.params.mountingmotor; // 电机安装方式
          if (that.params.motor_install_method != "FW")
            that.params.couplings = "0"; // 是否带电机
          that.params.screw_photoelectric_switch = that.params.oswitch; // 光电开关
          if (that.params.screw_photoelectric_switch == "0")
            that.params.switch_line_length = 0;
          else that.params.switch_line_length = that.params.switchline; // 开关线
          break;
        case 11:
          // 丝杆悬臂
          url = "products/selected/screw_xy_cantilever";
          that.params.motor_installation_method = that.params.mountingmotor; // 电机安装方式
          if (that.params.motor_install_method != "FW")
            that.params.couplings = "0"; // 是否带电机
          that.params.screw_photoelectric_switch = that.params.oswitch; // 光电开关
          if (that.params.screw_photoelectric_switch == "0")
            that.params.switch_line_length = 0;
          else that.params.switch_line_length = that.params.switchline; // 开关线
          break;
        case 10:
          url = "products/selected/xy_platform";
          switch (that.typeSelection.XYB) {
            case 0:
              that.params.type = "Y";
              that.typeSelection.XYB = 1;
              break;
            case 1:
              that.params.type = "X";
              that.params.selling_price_slug =
                that.typeSelection.selling_price_slug;
              break;
          }
          break;
        case 12:
          url = "products/selected/screw_shaft";
          that.params.motor_installation_method = that.params.mountingmotor; // 电机安装方式
          if (that.params.motor_install_method != "FW")
            that.params.couplings = "0"; // 是否带电机
          that.params.screw_photoelectric_switch = that.params.oswitch; // 光电开关
          if (that.params.screw_photoelectric_switch == "0")
            that.params.switch_line_length = 0;
          else that.params.switch_line_length = that.params.switchline; // 开关线
          break;
        case 14:
          url = "products/selected/d3015_machine";
          break;
        case 15:
          url = "products/selected/d3015_machine_horizontal";
          break;
        case 16:
          url = "products/selected/d3015_machine_left";
          break;
        case 17:
          url = "products/selected/d3015_machine_mover";
          break;
        default:
          break;
      }
      that
        .$post(url, that.params)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.tableData = response.data;
        })
        .catch(error => loading.close());
    },
    getBranch() {
      let that = this;
      if (this.$store.state.userBranch.length)
        that.joinProject.member = this.$store.state.userBranch;
      else {
        that
          .$get("members/company/branch")
          .then(response => {
            if (response.status != 200) return false;
            that.joinProject.member = response.data.list;
            that.$store.commit("getUserBranch", response.data.list);
          })
          .catch(error => console.error(error));
      }
    },
    getProject() {
      if (!this.$ifLogin()) return false;
      joinProjectModel.methods.getProject.call(this);
    },
    createNon() {
      // createNon(params) {
      // if (!params.demand) {
      //   this.$message({ message: "非标产品需求不能为空", type: "error" });
      //   return false;
      // }
      // if (!params.supplier_ids) {
      //   this.$message({ message: "供应商不能为空", type: "error" });
      //   return false;
      // }
      let that = this,
        loading = this.$loading({ lock: true }),
        params = {
          demand: that.nonstandard.requirements
        };

      if (that.nonstandard.images_ids.length)
        params.images_ids = that.nonstandard.images_ids.join(",");

      that
        .$post("orders/inquiry-price/create", params)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.$message({ message: "添加非标商品报价成功", type: "success" });
          // supplierModal.methods.close.call(this);
          that.nonstandard = {
            requirements: "",
            images_ids: [],
            fileUrl: []
          };
        })
        .catch(err => loading.close());
    },
    // 初始化Echart
    initChart() {
      let that = this;
      setTimeout(() => {
        that.speedChart = echarts.init(document.getElementById("speedChart"));
        that.changeSpeedChart();
      }, 500);
    },
    upload(file) {
      let that = this,
        form = new FormData();
      form.append("upload", file);
      form.append("slug", "non_standard_requirements");
      that
        .$upload("files/upload", form)
        .then(response => {
          if (response.status != 200) return false;
          that.nonstandard.fileUrl.push({
            name: file.name,
            url: response.data.url
          });
          that.nonstandard.images_ids.push(response.data.upload.id);
        })
        .catch(err => console.error(err));
    },
    handleRemove(file, fileList) {
      let delArr = [],
        inArr = false;
      this.nonstandard.fileUrl.forEach((e, k) => {
        inArr = false;
        fileList.forEach(item => {
          if (item.name == e.name) inArr = true;
        });
        if (!inArr) delArr.push(k);
      });
      delArr.forEach((e, k) => this.nonstandard.images_ids.splice(k, 1));
      this.nonstandard.fileUrl = fileList;
    }
  },
  watch: {
    params: {
      handler(val, oldVal) {
        this.screwRealSpeed = 0;
        switch (this.showDetailState) {
          case 1:
          case 2:
          case 10:
          case 5:
            this.changeSpeedChart();
            break;
          case 3:
            if (val.distance > 700) {
              for (
                let i = 0;
                i < Math.floor((val.distance - 700) * 0.01);
                i++
              ) {
                this.screwRealSpeed =
                  (this.screwRealSpeed || val.speed) -
                  (this.screwRealSpeed || val.speed) * 0.15;
              }
              this.screwRealSpeed = this.screwRealSpeed.toFixed(0);
            } else this.screwRealSpeed = 0;
            break;
          case 12:
          case 9:
          case 11:
            if (val.x_distance > 700) {
              for (
                let i = 0;
                i < Math.floor((val.x_distance - 700) * 0.01);
                i++
              ) {
                this.screwRealXSpeed =
                  (this.screwRealXSpeed || val.x_maximum_speed) -
                  (this.screwRealXSpeed || val.x_maximum_speed) * 0.15;
              }
              this.screwRealXSpeed = this.screwRealXSpeed.toFixed(0);
            } else this.screwRealXSpeed = 0;

            if (val.y_distance > 700) {
              for (
                let i = 0;
                i < Math.floor((val.y_distance - 700) * 0.01);
                i++
              ) {
                this.screwRealYSpeed =
                  (this.screwRealYSpeed || val.y_maximum_speed) -
                  (this.screwRealYSpeed || val.y_maximum_speed) * 0.15;
              }
              this.screwRealYSpeed = this.screwRealYSpeed.toFixed(0);
            } else this.screwRealYSpeed = 0;
            break;
          case 13:
          case 4:
          case 6:
          case 7:
          case 8:
            break;
        }
      },
      deep: true
    }
  },
  created() {
    this.firstJoin = true;
    this.getCategory();
  }
};
</script>
<style lang="less">
@border: solid 1px #e6e6e6;
@gery: #666666;
@blue: #0064db;
@red: #ff0000;
@white: #ffffff;
.borShadow () {
  // border: @border;
  // box-shadow: 0 0 15px #a7a6a6;
  background-color: @white;
  height: 100% !important;
}
#main {
  max-width: 1280px;
  margin: 0 auto;
  // 保留底部颜色
  height: 87%;
  @media screen and (min-width: 820px) {
    > .el-container {
      height: 100%;
      .homeMainAside {
        padding: 0;
        margin-top: 1.5rem;
        border-right: solid 1.5rem #f2f2f2;
        .el-menu {
          border: none;
          padding-left: 1rem;
          .el-menu-item.is-active {
            color: #ff9900;
            border-bottom: 2px solid #ff9900;
          }
        }
        .borShadow;
      }
    }
    .homeMainContent {
      position: relative;
      padding: 0;
      margin-top: 1.5rem;
      height: 100% !important;
      background: @white;
      > section {
        height: 100%;
        .homeAsideList {
          .el-menu-item {
            border-bottom: @border;
          }
          .el-menu-item.is-active {
            background-color: #ff9900;
            color: #ffffff;
          }
        }
        .homeMainList {
          display: flex;
          flex-wrap: wrap;
          background: #ffffff;
          > div {
            width: 15rem;
            height: 15rem;
            overflow: hidden;
            text-align: center;
            padding: 1rem;
            img {
              display: block;
              margin: 0 auto;
              padding: 0.5rem;
              border: 1px solid #eeeeee;
              box-sizing: border-box;
              width: 80%;
            }
            span {
              line-height: 2;
              color: @gery;
            }
          }
        }
        .homeGoodDetail {
          .main {
            width: 92%;
            box-sizing: border-box;
            position: relative;
            ul {
              width: 100%;
              list-style: none;
              color: @gery;
              li {
                display: flex;
                width: 100%;
                border-top: @border;
                border-right: @border;
                > div {
                  border-left: @border;
                  padding: 1rem;
                  &:first-child {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    width: 160px;
                    .el-radio {
                      width: 100%;
                      margin-left: 0;
                      margin-bottom: 1rem;
                    }
                  }
                  &:last-child {
                    canvas {
                      float: left;
                    }
                    .el-input {
                      width: 6rem;
                      box-sizing: content-box;
                      input {
                        border: none;
                        border-radius: 0;
                        border-bottom: @border;
                      }
                    }
                    .labelInput {
                      margin-left: 1rem;
                    }
                    .tips {
                      margin-top: 1rem;
                    }
                    .speedTips {
                      color: @red;
                    }
                  }
                }
                &:last-child {
                  border-bottom: @border;
                }
                .chartOption {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  box-sizing: border-box;
                  div:last-child {
                    margin-left: 1rem;
                  }
                }
              }
            }
            .typeSelection {
              display: flex;
              align-items: center;
              border: @border;
              border-bottom: none;
              padding-top: 3rem;
              > div {
                height: 3rem;
                line-height: 3rem;
                text-align: center;
                flex-grow: 1;
                background-color: @white;
                border-top: @border;
                border-right: @border;
                &:last-child {
                  border-right: none;
                }
                &:hover {
                  color: @white;
                  background: @blue;
                }
              }
              .active {
                color: @white;
                background: @blue;
              }
            }
            .operation {
              display: flex;
              justify-content: space-between;
              padding: 0.5rem 0;
            }
            .el-table {
              width: 100%;
              .el-table__row {
                .productInfo {
                  display: flex;
                  align-items: center;
                  > div {
                    &:first-child {
                      border: @border;
                      margin-right: 1rem;
                      img {
                        max-width: 80px;
                        max-height: 80px;
                      }
                    }
                  }
                }
                .drawing {
                  display: flex;
                  justify-content: center;
                  > div {
                    display: flex;
                    align-content: center;
                    justify-content: center;
                    flex-direction: column;
                    flex-wrap: wrap;
                    height: 80px;
                    text-align: center;
                    color: @blue;
                    margin: 0 0.2rem;
                    i {
                      display: block;
                      font-size: 4rem;
                    }
                    a {
                      padding-top: 1rem;
                      text-decoration: none;
                    }
                  }
                }
                .opera {
                  button {
                    display: block;
                    margin: 0.5rem auto;
                  }
                }
              }
            }
            .diagram {
              position: absolute;
              top: 0;
              right: 0;
              border: @border;
              background-color: @white;
              height: 195px;
              box-sizing: border-box;
            }
            .el-form {
              textarea {
                height: 15rem;
                resize: none;
              }
            }
          }
        }
      }
    }
  }

  @media screen and (max-width: 820px) {
    > .el-container {
      height: auto;
      display: block;
      
      // 暂时隐藏
      .homeMainAside,
      .homeAsideList {
        display: none !important;
      }

      .homeMainContent {
        > .el-container {
          display: block;
          border-top: 1rem solid @white;
          > .homeAsideList {
            width: 100% !important;
          }
        }
      }
      .homeMainAside {
        padding: 0;
        width: 100% !important;
        height: auto;
        .el-menu {
          border: none;
          .el-menu-item {
            border-bottom: @border;
            box-sizing: border-box;
          }
          .el-menu-item.is-active {
            color: #ff9900;
            border-bottom: 2px solid #ff9900;
          }
        }
      }
    }
    .homeMainContent {
      display: block;
      padding: 0;
      background: @white;
      > section {
        .homeAsideList {
          box-sizing: border-box;
          .el-menu-item {
            border-bottom: @border;
            box-sizing: border-box;
            &:first-child {
              border-top: @border;
            }
          }
          .el-menu-item.is-active {
            background-color: #ff9900;
            color: @white;
          }
        }
        .homeMainList {
          display: flex;
          flex-wrap: wrap;
          background: @white;
          padding: 0.5rem;
          > div {
            width: 50%;
            box-sizing: border-box;
            text-align: center;
            img {
              display: block;
              margin: auto;
              padding: 0.5rem;
              border: 1px solid #eeeeee;
              box-sizing: border-box;
              width: 90%;
            }
            span {
              line-height: 2;
              color: @gery;
            }
          }
        }
        .homeGoodDetail {
          padding: 0;
          ul {
            list-style: none;
            color: @gery;
            box-sizing: border-box;
            li {
              width: 100%;
              border-top: @border;
              border-right: @border;
              box-sizing: border-box;
              > div {
                border-left: @border;
                padding: 1rem;
                width: 99%;
                box-sizing: border-box;
                &:first-child {
                  .el-radio {
                    width: 100%;
                    margin-left: 0;
                    margin-right: 0;
                  }
                }
                &:last-child {
                  display: block;
                  .el-input {
                    width: 60px;
                    box-sizing: content-box;
                    input {
                      border: none;
                      border-radius: 0;
                      border-bottom: @border;
                    }
                  }
                  .el-radio {
                    margin-left: 5px;
                  }
                  .labelInput {
                    margin-left: 1rem;
                  }
                  .pull-left {
                    float: initial;
                    text-align: left;
                  }
                  .tips {
                    margin-top: 1rem;
                  }
                }
              }
              &:last-child {
                border-bottom: @border;
              }
            }
          }
          .operation {
            display: flex;
            justify-content: center;
            padding: 0.5rem 6rem;
          }
          .el-table {
            .el-table__row {
              .productInfo {
                display: flex;
                align-items: center;
                > div {
                  &:first-child {
                    border: @border;
                    margin-right: 1rem;
                    img {
                      max-width: 80px;
                      max-height: 80px;
                    }
                  }
                }
              }
              .drawing {
                display: flex;
                justify-content: center;
                > div {
                  display: flex;
                  align-content: center;
                  justify-content: center;
                  flex-direction: column;
                  flex-wrap: wrap;
                  height: 80px;
                  text-align: center;
                  color: @blue;
                  i {
                    display: block;
                    font-size: 4rem;
                  }
                  a {
                    padding-top: 1rem;
                    text-decoration: none;
                  }
                }
              }
              .opera {
                button {
                  display: block;
                  margin: 0.5rem auto;
                }
              }
            }
          }
          .diagram {
            width: 100%;
            border-left: @border;
            border-right: @border;
            border-bottom: @border;
          }
          .el-form {
            padding: 1rem;
            textarea {
              resize: none;
            }
          }
        }
      }
    }
  }
}
.el-message-box {
  height: auto !important;
}
</style>
