<template>
  <div id="main">
    <transition name="el-fade-in-linear">
      <div v-show="modalShow">
        <div class="Curtain"></div>
        <div class="modalBox">
          <div class="modalBoxMain">
            <div class="modalBoxMainHeader">
              <div class="modalBoxMainHeaderTitle">
                加入项目
              </div>
              <div class="modalBoxMainHeaderBtn" @click="modalShow = false;">
                <i class="el-message-box__close el-icon-close"></i>
              </div>
            </div>
            <div class="modalBoxMainContent">
              <div id="joinProject" v-show="joinProject.status == 0">
                <p>
                  <span>选择您要加入的项目</span>
                  <el-button type="text" @click="joinProject.status = 1">+新建项目</el-button>
                </p>
                <div>
                  <el-select v-model="joinProject.projectSlug">
                    <el-option v-for="(item,key) in joinProject.projectList" 
                              :key="key" :label="item.name" :value="item.slug"></el-option>
                  </el-select>
                </div>
                <div>
                  <el-button type="primary" size="mini" @click="joinProjectCart">确认</el-button>
                </div>
              </div>
              <div id="joinProject" v-show="joinProject.status == 1">
                <el-button class="goBack" type="text" @click="joinProject.status = 0">返回</el-button>
                <el-input v-model="joinProject.newProjectName" placeholder="输入项目名称"></el-input>
                <div>
                  <el-select v-model="joinProject.memberId" size="mini" multiple>
                    <el-option-group v-for="(item,key) in joinProject.member" 
                                    :key="key" :label="item.branch_name" :value="item.branch_id">
                      <el-option v-for="(val,el) in item.member" 
                                :key="el" :label="val.display_name" :value="val.id"></el-option>
                    </el-option-group>
                  </el-select>
                </div>
                <el-input v-model="joinProject.description" placeholder="项目介绍"></el-input>
                <div>
                  <el-button type="primary" size="mini" @click="addProject">确定</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <el-container>
      <el-aside class="homeMainAside" width="200px">
        <el-menu default-active="0">
          <el-menu-item v-for="(item,index) in product" :key="index" :index="index.toString()" @click="showCategory(item.children)">
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="homeMainContent">
        <el-container>
          <el-aside class="homeAsideList" width="120px">
            <el-menu default-active="0">
              <el-menu-item v-for="(item,index) in selectedCate" :key="index" :index="index.toString()" @click="showGoodsList(item.children)">
                <span slot="title">{{ item.name }}</span>
              </el-menu-item>
            </el-menu>
          </el-aside>
          <el-main class="homeMainList" v-if="showDetailState == 0">
            <div v-for="(item,index) in selectedGood" :key="index" @click="showDetail(item)">
              <img :src="item.icon || 'https://factoryun.com/app/default/assets/applications//monster/default-theme/resources/hnimg/miss.jpg'">
              <span>{{ item.name }}</span>
              <p>{{ item.message }}</p>
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
                    <el-radio v-model="params.exercise_mode" label="scanning">扫描线</el-radio>
                  </div>
                </li>
                <li>
                  <div>动子数</div>
                  <div>
                    <el-radio v-model="params.number_of_mover" label="1">1</el-radio>
                    <el-radio v-model="params.number_of_mover" label="2">2</el-radio>
                    <el-input class="labelInput" v-model="params.number_of_mover" placeholder="其他"></el-input>
                    <span>个</span>
                  </div>
                </li>
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
                        <span>移动距离: </span>
                        <el-input v-model="params.distance" placeholder="1000"></el-input>
                        <span>mm</span>
                      </p>
                      <p>
                        <span>速度: </span>
                        <el-radio v-model="params.speed" label="0.5">0.5</el-radio>
                        <el-radio v-model="params.speed" label="1">1</el-radio>
                        <el-input class="labelInput" v-model="params.speed" placeholder="5">0.5</el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>加速度: </span>
                        <el-radio v-model="params.acceleration" label="0.5">0.5</el-radio>
                        <el-radio v-model="params.acceleration" label="1">1</el-radio>
                        <el-input class="labelInput" v-model="params.acceleration" placeholder="5"></el-input>
                        <span>m/s²</span>
                      </p>
                      <p>
                        <span>停留时间: </span>
                        <el-radio v-model="params.stay_time" label="0.5">0.5</el-radio>
                        <el-input class="labelInput" v-model="params.stay_time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                    </div>
                    <div class="pull-left" v-else-if="params.readswit == 1">
                      <p>
                        <span>移动距离: </span>
                        <el-input v-model="params.distance" placeholder="1000"></el-input>
                        <span>mm</span>
                      </p>
                      <p>
                        <span>用时: </span>
                        <el-radio v-model="params.time" label="1">1</el-radio>
                        <el-radio v-model="params.time" label="2">2</el-radio>
                        <el-input v-model="params.time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                      <p>
                        <span>停留时间: </span>
                        <el-radio v-model="params.stay_time" label="0.5">0.5</el-radio>
                        <el-input v-model="params.stay_time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                    </div>
                    <div class="pull-left" v-else>
                      <p>
                        <span>移动距离: </span>
                        <el-input v-model="params.distance" placeholder="1000"></el-input>
                        <span>mm</span>
                      </p>
                      <p>
                        <span>加速时间 t1: </span>
                        <el-radio v-model="params.accelerationTime" label="0.5">0.5</el-radio>
                        <el-input v-model="params.accelerationTime" placeholder="其他"></el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>匀速时间 t2: </span>
                        <el-radio v-model="params.uniformTime" label="0.5">0.5</el-radio>
                        <el-input v-model="params.uniformTime" placeholder="其他"></el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>减速时间 t3: </span>
                        <el-radio v-model="params.slowTime" label="0.5">0.5</el-radio>
                        <el-input v-model="params.slowTime" placeholder="其他"></el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>停留时间: </span>
                        <el-radio v-model="params.stay_time" label="0.5">0.5</el-radio>
                        <el-input v-model="params.stay_time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                    </div>
                  </div>
                </li>
                <li>
                  <div>
                    <el-radio v-model="params.feedback_type" label="grating_ruler">光栅尺</el-radio>
                    <el-radio v-model="params.feedback_type" label="magnetic_scale">磁栅尺</el-radio>
                  </div>
                  <div>
                    <p v-if="params.feedback_type == 'grating_ruler'">
                      <el-radio v-model="params.precision" label="1">1</el-radio>
                      <el-radio v-model="params.precision" label="0.5">0.5</el-radio>
                      <el-radio v-model="params.precision" label="0.1">0.1</el-radio>
                      <el-input class="labelInput" v-model="params.precision"></el-input>
                      <span>um</span>
                    </p>
                    <p v-else-if="params.feedback_type == 'magnetic_scale'">
                      <el-radio v-model="params.precision" label="1">1</el-radio>
                      <el-radio v-model="params.precision" label="0.5">0.5</el-radio>
                      <el-radio v-model="params.precision" label="0.1">0.1</el-radio>
                      <el-input class="labelInput" v-model="params.precision"></el-input>
                      <span>um</span>
                    </p>
                    <p>
                      <span>重现精度: </span>
                      <el-radio v-model="params.reproduce_the_accuracy" label="3">3</el-radio>
                      <el-input v-model="params.reproduce_the_accuracy" placeholder="其他"></el-input>
                      <span>um</span>
                    </p>
                    <p>
                      <span>定位精度: </span>
                      <el-radio v-model="params.positioning_accuracy" label="5">5</el-radio>
                      <el-radio v-model="params.positioning_accuracy" label="3">3</el-radio>
                      <el-input v-model="params.positioning_accuracy" placeholder="其他"></el-input>
                      <span>um</span>
                    </p>
                    <p class="tips">注意：定位精度 ≥ 重现精度</p>
                  </div>
                </li>
                <li>
                  <div>密封方式</div>
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
                <div :class="typeSelection.Int == 0 ? 'active' : '' " @click="typeSelection.Int = 0">直线电机模组</div>
                <div :class="typeSelection.Int == 1 ? 'active' : '' " @click="typeSelection.Int = 1">皮带模组</div>
                <div :class="typeSelection.Int == 2 ? 'active' : '' " @click="typeSelection.Int = 2">螺杆模组</div>
              </div>
              <ul v-if="typeSelection.Int == 0">
                <li>
                  <div>防尘装置</div>
                  <div>
                    <el-radio v-model="params.dustproof_device" label="">无</el-radio>
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
                    <el-radio v-model="params.driver_type" label="">客户自配</el-radio>
                  </div>
                </li>
              </ul>
              <ul v-else-if="typeSelection.Int == 1">
                <li>
                  <div>电机安装方式</div>
                  <div>
                    <el-radio v-model="params.mountingmotor" label="fl">左接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="fr">右接</el-radio>
                  </div>
                </li>
                <li>
                  <div>光电开关</div>
                  <div>
                    <el-radio v-model="params.oswitch" label="0">无</el-radio>
                    <el-radio v-model="params.oswitch" label="X">内置（NPN）</el-radio>
                    <el-radio v-model="params.oswitch" label="W">外置（PNP）</el-radio>
                  </div>
                </li>
                <li>
                  <div>开关线</div>
                  <div>
                    <el-radio v-model="params.switchline" label="0">无</el-radio>
                    <el-radio v-model="params.switchline" label="2">2m</el-radio>
                    <el-radio v-model="params.switchline" label="5">5m</el-radio>
                  </div>
                </li>
                <li>
                  <div>联轴器</div>
                  <div>
                    <el-radio v-model="params.couplings" label="0">无</el-radio>
                    <el-radio v-model="params.couplings" label="l">配联轴器</el-radio>
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
                      <el-option v-for="(item,index) in typeSelection.motor_brand" 
                                :key="index" 
                                :label="item.name"
                                :value="item.value"></el-option>
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
                    <el-radio v-model="params.mountingmotor" label="fl">左接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="fr">右接</el-radio>
                  </div>
                </li>
                <li>
                  <div>光电开关</div>
                  <div>
                    <el-radio v-model="params.oswitch" label="0">无</el-radio>
                    <el-radio v-model="params.oswitch" label="X">内置（NPN）</el-radio>
                    <el-radio v-model="params.oswitch" label="W">外置（PNP）</el-radio>
                  </div>
                </li>
                <li>
                  <div>开关线</div>
                  <div>
                    <el-radio v-model="params.switchline" label="0">无</el-radio>
                    <el-radio v-model="params.switchline" label="2">2m</el-radio>
                    <el-radio v-model="params.switchline" label="5">5m</el-radio>
                  </div>
                </li>
                <li>
                  <div>联轴器</div>
                  <div>
                    <el-radio v-model="params.couplings" label="0">无</el-radio>
                    <el-radio v-model="params.couplings" label="l">配联轴器</el-radio>
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
                      <el-option v-for="(item,index) in typeSelection.motor_brand" 
                                :key="index" 
                                :label="item.name"
                                :value="item.value"></el-option>
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
              <div class="operation">
                <span></span>
                <el-button type="primary" size="mini" @click="screen">筛选</el-button>
              </div>
              <el-table border :data="tableData.list">
                <el-table-column label="产品" width="400">
                  <template slot-scope="{ row,$index }">
                    <div class="productInfo">
                      <div>
                        <img :src="row.image" :alt="row.name">
                      </div>
                      <div>
                        <p>名称：<a target="_blank" :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`">{{ row.name }}</a></p>
                        <p>型号: <a target="_blank" :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"> {{ row.model }}</a></p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sales_price" label="价格"></el-table-column>
                <el-table-column prop="delivery_period" label="交期"></el-table-column>
                <el-table-column label="图纸">
                  <template slot-scope="{ row,$index }">
                    <div class="drawing">
                      <div>
                        <i class="font_family icon-d2twig"></i>
                        <a target="_blank" :href='row.drawing_2d'>下载</a>
                      </div>
                      <div>
                        <i class="font_family icon-d3twig"></i>
                        <a target="_blank" :href='row.drawing_3d'>下载</a>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="{ row,$index }">
                    <el-button type="primary" size="mini" 
                              @click="joinProject.id = row.id;joinProject.history = row.selling_price_slug;getProject()">加入项目</el-button>
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
                    <el-radio v-model="params.exercise_mode" label="scanning">扫描线</el-radio>
                  </div>
                </li>
                <li>
                  <div>动子数</div>
                  <div>
                    <el-radio v-model="params.number_of_mover" label="1">1</el-radio>
                    <el-radio v-model="params.number_of_mover" label="2">2</el-radio>
                    <el-input class="labelInput" v-model="params.number_of_mover" placeholder="其他"></el-input>
                    <span>个</span>
                  </div>
                </li>
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
                        <span>移动距离: </span>
                        <el-input v-model="params.distance" placeholder="1000"></el-input>
                        <span>mm</span>
                      </p>
                      <p>
                        <span>速度: </span>
                        <el-radio v-model="params.speed" label="0.5">0.5</el-radio>
                        <el-radio v-model="params.speed" label="1">1</el-radio>
                        <el-input class="labelInput" v-model="params.speed" placeholder="5">0.5</el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>加速度: </span>
                        <el-radio v-model="params.acceleration" label="0.5">0.5</el-radio>
                        <el-radio v-model="params.acceleration" label="1">1</el-radio>
                        <el-input class="labelInput" v-model="params.acceleration" placeholder="5"></el-input>
                        <span>m/s²</span>
                      </p>
                      <p>
                        <span>停留时间: </span>
                        <el-radio v-model="params.stay_time" label="0.5">0.5</el-radio>
                        <el-input class="labelInput" v-model="params.stay_time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                    </div>
                    <div class="pull-left" v-else-if="params.readswit == 1">
                      <p>
                        <span>移动距离: </span>
                        <el-input v-model="params.distance" placeholder="1000"></el-input>
                        <span>mm</span>
                      </p>
                      <p>
                        <span>用时: </span>
                        <el-radio v-model="params.time" label="1">1</el-radio>
                        <el-radio v-model="params.time" label="2">2</el-radio>
                        <el-input v-model="params.time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                      <p>
                        <span>停留时间: </span>
                        <el-radio v-model="params.stay_time" label="0.5">0.5</el-radio>
                        <el-input v-model="params.stay_time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                    </div>
                    <div class="pull-left" v-else>
                      <p>
                        <span>移动距离: </span>
                        <el-input v-model="params.distance" placeholder="1000"></el-input>
                        <span>mm</span>
                      </p>
                      <p>
                        <span>加速时间 t1: </span>
                        <el-radio v-model="params.accelerationTime" label="0.5">0.5</el-radio>
                        <el-input v-model="params.accelerationTime" placeholder="其他"></el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>匀速时间 t2: </span>
                        <el-radio v-model="params.uniformTime" label="0.5">0.5</el-radio>
                        <el-input v-model="params.uniformTime" placeholder="其他"></el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>减速时间 t3: </span>
                        <el-radio v-model="params.slowTime" label="0.5">0.5</el-radio>
                        <el-input v-model="params.slowTime" placeholder="其他"></el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>停留时间: </span>
                        <el-radio v-model="params.stay_time" label="0.5">0.5</el-radio>
                        <el-input v-model="params.stay_time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                    </div>
                  </div>
                </li>
                <li>
                  <div>
                    <el-radio v-model="params.feedback_type" label="grating_ruler">光栅尺</el-radio>
                    <el-radio v-model="params.feedback_type" label="magnetic_scale">磁栅尺</el-radio>
                  </div>
                  <div>
                    <p v-if="params.feedback_type == 'grating_ruler'">
                      <el-radio v-model="params.precision" label="1">1</el-radio>
                      <el-radio v-model="params.precision" label="0.5">0.5</el-radio>
                      <el-radio v-model="params.precision" label="0.1">0.1</el-radio>
                      <el-input class="labelInput" v-model="params.precision"></el-input>
                      <span>um</span>
                    </p>
                    <p v-else-if="params.feedback_type == 'magnetic_scale'">
                      <el-radio v-model="params.precision" label="1">1</el-radio>
                      <el-radio v-model="params.precision" label="0.5">0.5</el-radio>
                      <el-radio v-model="params.precision" label="0.1">0.1</el-radio>
                      <el-input class="labelInput" v-model="params.precision"></el-input>
                      <span>um</span>
                    </p>
                    <p>
                      <span>重现精度: </span>
                      <el-radio v-model="params.reproduce_the_accuracy" label="3">3</el-radio>
                      <el-input v-model="params.reproduce_the_accuracy" placeholder="其他"></el-input>
                      <span>um</span>
                    </p>
                    <p>
                      <span>定位精度: </span>
                      <el-radio v-model="params.positioning_accuracy" label="5">5</el-radio>
                      <el-radio v-model="params.positioning_accuracy" label="3">3</el-radio>
                      <el-input v-model="params.positioning_accuracy" placeholder="其他"></el-input>
                      <span>um</span>
                    </p>
                    <p class="tips">注意：定位精度 ≥ 重现精度</p>
                  </div>
                </li>
                <li>
                  <div>密封方式</div>
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
                <li>
                  <div>防尘装置</div>
                  <div>
                    <el-radio v-model="params.dustproof_device" label="">无</el-radio>
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
                    <el-radio v-model="params.driver_type" label="">客户自配</el-radio>
                  </div>
                </li>
              </ul>
              <div class="operation">
                <span></span>
                <el-button type="primary" size="mini" @click="screen">筛选</el-button>
              </div>
              <el-table border :data="tableData.list">
                <el-table-column label="产品" width="400">
                  <template slot-scope="{ row,$index }">
                    <div class="productInfo">
                      <div>
                        <img :src="row.image" :alt="row.name">
                      </div>
                      <div>
                        <p>名称：<a target="_blank" :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`">{{ row.name }}</a></p>
                        <p>型号: <a target="_blank" :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"> {{ row.model }}</a></p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sales_price" label="价格"></el-table-column>
                <el-table-column prop="delivery_period" label="交期"></el-table-column>
                <el-table-column label="图纸">
                  <template slot-scope="{ row,$index }">
                    <div class="drawing">
                      <div>
                        <i class="font_family icon-d2twig"></i>
                        <a target="_blank" :href='row.drawing_2d'>下载</a>
                      </div>
                      <div>
                        <i class="font_family icon-d3twig"></i>
                        <a target="_blank" :href='row.drawing_3d'>下载</a>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="{ row,$index }">
                    <el-button type="primary" size="mini" 
                              @click="joinProject.id = row.id;joinProject.history = row.selling_price_slug;getProject()">加入项目</el-button>
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
                  <div>运动方式</div>
                  <div>
                    <el-radio v-model="params.exercise_mode" label="dot_to_dot">点到点</el-radio>
                    <el-radio v-model="params.exercise_mode" label="scanning">扫描线</el-radio>
                  </div>
                </li>
                <li>
                  <div>动子数</div>
                  <div>
                    <el-radio v-model="params.number_of_mover" label="1">1</el-radio>
                    <el-radio v-model="params.number_of_mover" label="2">2</el-radio>
                    <el-input class="labelInput" v-model="params.number_of_mover" placeholder="其他"></el-input>
                    <span>个</span>
                  </div>
                </li>
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
                        <span>移动距离: </span>
                        <el-input v-model="params.distance" placeholder="1000"></el-input>
                        <span>mm</span>
                      </p>
                      <p>
                        <span>速度: </span>
                        <el-radio v-model="params.speed" label="0.5">0.5</el-radio>
                        <el-radio v-model="params.speed" label="1">1</el-radio>
                        <el-input class="labelInput" v-model="params.speed" placeholder="5">0.5</el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>加速度: </span>
                        <el-radio v-model="params.acceleration" label="0.5">0.5</el-radio>
                        <el-radio v-model="params.acceleration" label="1">1</el-radio>
                        <el-input class="labelInput" v-model="params.acceleration" placeholder="5"></el-input>
                        <span>m/s²</span>
                      </p>
                      <p>
                        <span>停留时间: </span>
                        <el-radio v-model="params.stay_time" label="0.5">0.5</el-radio>
                        <el-input class="labelInput" v-model="params.stay_time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                    </div>
                    <div class="pull-left" v-else-if="params.readswit == 1">
                      <p>
                        <span>移动距离: </span>
                        <el-input v-model="params.distance" placeholder="1000"></el-input>
                        <span>mm</span>
                      </p>
                      <p>
                        <span>用时: </span>
                        <el-radio v-model="params.time" label="1">1</el-radio>
                        <el-radio v-model="params.time" label="2">2</el-radio>
                        <el-input v-model="params.time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                      <p>
                        <span>停留时间: </span>
                        <el-radio v-model="params.stay_time" label="0.5">0.5</el-radio>
                        <el-input v-model="params.stay_time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                    </div>
                    <div class="pull-left" v-else>
                      <p>
                        <span>移动距离: </span>
                        <el-input v-model="params.distance" placeholder="1000"></el-input>
                        <span>mm</span>
                      </p>
                      <p>
                        <span>加速时间 t1: </span>
                        <el-radio v-model="params.accelerationTime" label="0.5">0.5</el-radio>
                        <el-input v-model="params.accelerationTime" placeholder="其他"></el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>匀速时间 t2: </span>
                        <el-radio v-model="params.uniformTime" label="0.5">0.5</el-radio>
                        <el-input v-model="params.uniformTime" placeholder="其他"></el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>减速时间 t3: </span>
                        <el-radio v-model="params.slowTime" label="0.5">0.5</el-radio>
                        <el-input v-model="params.slowTime" placeholder="其他"></el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>停留时间: </span>
                        <el-radio v-model="params.stay_time" label="0.5">0.5</el-radio>
                        <el-input v-model="params.stay_time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                    </div>
                  </div>
                </li>
                <li>
                  <div>
                    <el-radio v-model="params.feedback_type" label="grating_ruler">光栅尺</el-radio>
                    <el-radio v-model="params.feedback_type" label="magnetic_scale">磁栅尺</el-radio>
                  </div>
                  <div>
                    <p v-if="params.feedback_type == 'grating_ruler'">
                      <el-radio v-model="params.precision" label="1">1</el-radio>
                      <el-radio v-model="params.precision" label="0.5">0.5</el-radio>
                      <el-radio v-model="params.precision" label="0.1">0.1</el-radio>
                      <el-input class="labelInput" v-model="params.precision"></el-input>
                      <span>um</span>
                    </p>
                    <p v-else-if="params.feedback_type == 'magnetic_scale'">
                      <el-radio v-model="params.precision" label="1">1</el-radio>
                      <el-radio v-model="params.precision" label="0.5">0.5</el-radio>
                      <el-radio v-model="params.precision" label="0.1">0.1</el-radio>
                      <el-input class="labelInput" v-model="params.precision"></el-input>
                      <span>um</span>
                    </p>
                    <p>
                      <span>重现精度: </span>
                      <el-radio v-model="params.reproduce_the_accuracy" label="3">3</el-radio>
                      <el-input v-model="params.reproduce_the_accuracy" placeholder="其他"></el-input>
                      <span>um</span>
                    </p>
                    <p>
                      <span>定位精度: </span>
                      <el-radio v-model="params.positioning_accuracy" label="5">5</el-radio>
                      <el-radio v-model="params.positioning_accuracy" label="3">3</el-radio>
                      <el-input v-model="params.positioning_accuracy" placeholder="其他"></el-input>
                      <span>um</span>
                    </p>
                    <p class="tips">注意：定位精度 ≥ 重现精度</p>
                  </div>
                </li>
                <li>
                  <div>密封方式</div>
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
                <li>
                  <div>电机安装方式</div>
                  <div>
                    <el-radio v-model="params.mountingmotor" label="fl">左接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="fr">右接</el-radio>
                  </div>
                </li>
                <li>
                  <div>光电开关</div>
                  <div>
                    <el-radio v-model="params.oswitch" label="0">无</el-radio>
                    <el-radio v-model="params.oswitch" label="X">内置（NPN）</el-radio>
                    <el-radio v-model="params.oswitch" label="W">外置（PNP）</el-radio>
                  </div>
                </li>
                <li>
                  <div>开关线</div>
                  <div>
                    <el-radio v-model="params.switchline" label="0">无</el-radio>
                    <el-radio v-model="params.switchline" label="2">2m</el-radio>
                    <el-radio v-model="params.switchline" label="5">5m</el-radio>
                  </div>
                </li>
                <li>
                  <div>联轴器</div>
                  <div>
                    <el-radio v-model="params.couplings" label="0">无</el-radio>
                    <el-radio v-model="params.couplings" label="l">配联轴器</el-radio>
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
                      <el-option v-for="(item,index) in typeSelection.motor_brand" 
                                :key="index" 
                                :label="item.name"
                                :value="item.value"></el-option>
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
              <div class="operation">
                <span></span>
                <el-button type="primary" size="mini" @click="screen">筛选</el-button>
              </div>
              <el-table border :data="tableData.list">
                <el-table-column label="产品" width="400">
                  <template slot-scope="{ row,$index }">
                    <div class="productInfo">
                      <div>
                        <img :src="row.image" :alt="row.name">
                      </div>
                      <div>
                        <p>名称：<a target="_blank" :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`">{{ row.name }}</a></p>
                        <p>型号: <a target="_blank" :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"> {{ row.model }}</a></p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sales_price" label="价格"></el-table-column>
                <el-table-column prop="delivery_period" label="交期"></el-table-column>
                <el-table-column label="图纸">
                  <template slot-scope="{ row,$index }">
                    <div class="drawing">
                      <div>
                        <i class="font_family icon-d2twig"></i>
                        <a target="_blank" :href='row.drawing_2d'>下载</a>
                      </div>
                      <div>
                        <i class="font_family icon-d3twig"></i>
                        <a target="_blank" :href='row.drawing_3d'>下载</a>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="{ row,$index }">
                    <el-button type="primary" size="mini" 
                              @click="joinProject.id = row.id;joinProject.history = row.selling_price_slug;getProject()">加入项目</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-main>
          <!-- 升降平台 -->
          <el-main class="homeGoodDetail" v-else-if="showDetailState == 4">
            <div class="main">
              <ul>
              </ul>
              <div class="operation">
                <span></span>
                <el-button type="primary" size="mini" @click="screen">筛选</el-button>
              </div>
              <el-table border :data="tableData.list">
                <el-table-column label="产品" width="400">
                  <template slot-scope="{ row,$index }">
                    <div class="productInfo">
                      <div>
                        <img :src="row.image" :alt="row.name">
                      </div>
                      <div>
                        <p>名称：<a target="_blank" :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`">{{ row.name }}</a></p>
                        <p>型号: <a target="_blank" :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"> {{ row.model }}</a></p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sales_price" label="价格"></el-table-column>
                <el-table-column prop="delivery_period" label="交期"></el-table-column>
                <el-table-column label="图纸">
                  <template slot-scope="{ row,$index }">
                    <div class="drawing">
                      <div>
                        <i class="font_family icon-d2twig"></i>
                        <a target="_blank" :href='row.drawing_2d'>下载</a>
                      </div>
                      <div>
                        <i class="font_family icon-d3twig"></i>
                        <a target="_blank" :href='row.drawing_3d'>下载</a>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="{ row,$index }">
                    <el-button type="primary" size="mini" 
                              @click="joinProject.id = row.id;joinProject.history = row.selling_price_slug;getProject()">加入项目</el-button>
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
                    <el-radio v-model="params.exercise_mode" label="scanning">扫描线</el-radio>
                  </div>
                </li>
                <li>
                  <div>动子数</div>
                  <div>
                    <el-radio v-model="params.number_of_mover" label="1">1</el-radio>
                    <el-radio v-model="params.number_of_mover" label="2">2</el-radio>
                    <el-input class="labelInput" v-model="params.number_of_mover" placeholder="其他"></el-input>
                    <span>个</span>
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
                        <span>移动距离: </span>
                        <el-input v-model="params.distance" placeholder="1000"></el-input>
                        <span>mm</span>
                      </p>
                      <p>
                        <span>速度: </span>
                        <el-radio v-model="params.speed" label="0.5">0.5</el-radio>
                        <el-radio v-model="params.speed" label="1">1</el-radio>
                        <el-input class="labelInput" v-model="params.speed" placeholder="5">0.5</el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>加速度: </span>
                        <el-radio v-model="params.acceleration" label="0.5">0.5</el-radio>
                        <el-radio v-model="params.acceleration" label="1">1</el-radio>
                        <el-input class="labelInput" v-model="params.acceleration" placeholder="5"></el-input>
                        <span>m/s²</span>
                      </p>
                      <p>
                        <span>停留时间: </span>
                        <el-radio v-model="params.stay_time" label="0.5">0.5</el-radio>
                        <el-input class="labelInput" v-model="params.stay_time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                    </div>
                    <div class="pull-left" v-else-if="params.readswit == 1">
                      <p>
                        <span>移动距离: </span>
                        <el-input v-model="params.distance" placeholder="1000"></el-input>
                        <span>mm</span>
                      </p>
                      <p>
                        <span>用时: </span>
                        <el-radio v-model="params.time" label="1">1</el-radio>
                        <el-radio v-model="params.time" label="2">2</el-radio>
                        <el-input v-model="params.time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                      <p>
                        <span>停留时间: </span>
                        <el-radio v-model="params.stay_time" label="0.5">0.5</el-radio>
                        <el-input v-model="params.stay_time" placeholder="其他"></el-input>
                        <span>s</span>
                      </p>
                    </div>
                    <div class="pull-left" v-else>
                      <p>
                        <span>移动距离: </span>
                        <el-input v-model="params.distance" placeholder="1000"></el-input>
                        <span>mm</span>
                      </p>
                      <p>
                        <span>加速时间 t1: </span>
                        <el-radio v-model="params.accelerationTime" label="0.5">0.5</el-radio>
                        <el-input v-model="params.accelerationTime" placeholder="其他"></el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>匀速时间 t2: </span>
                        <el-radio v-model="params.uniformTime" label="0.5">0.5</el-radio>
                        <el-input v-model="params.uniformTime" placeholder="其他"></el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>减速时间 t3: </span>
                        <el-radio v-model="params.slowTime" label="0.5">0.5</el-radio>
                        <el-input v-model="params.slowTime" placeholder="其他"></el-input>
                        <span>m/s</span>
                      </p>
                      <p>
                        <span>停留时间: </span>
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
                  <template slot-scope="{ row,$index }">
                    <div class="productInfo">
                      <div>
                        <img :src="row.image" :alt="row.name">
                      </div>
                      <div>
                        <p>名称：<a target="_blank" :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`">{{ row.name }}</a></p>
                        <p>型号: <a target="_blank" :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"> {{ row.model }}</a></p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sales_price" label="价格"></el-table-column>
                <el-table-column prop="delivery_period" label="交期"></el-table-column>
                <el-table-column label="图纸">
                  <template slot-scope="{ row,$index }">
                    <div class="drawing">
                      <div>
                        <i class="font_family icon-d2twig"></i>
                        <a target="_blank" :href='row.drawing_2d'>下载</a>
                      </div>
                      <div>
                        <i class="font_family icon-d3twig"></i>
                        <a target="_blank" :href='row.drawing_3d'>下载</a>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="{ row,$index }">
                    <el-button type="primary" size="mini" 
                              @click="joinProject.id = row.id;joinProject.history = row.selling_price_slug;getProject()">加入项目</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-main>
          <!-- FPC 跳水台 -->
          <el-main class="homeGoodDetail" v-else-if="showDetailState == 6">
            <div class="main">
              <ul>
              </ul>
              <div class="operation">
                <span></span>
                <el-button type="primary" size="mini" @click="screen">筛选</el-button>
              </div>
              <el-table border :data="tableData.list">
                <el-table-column label="产品" width="400">
                  <template slot-scope="{ row,$index }">
                    <div class="productInfo">
                      <div>
                        <img :src="row.image" :alt="row.name">
                      </div>
                      <div>
                        <p>名称：<a target="_blank" :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`">{{ row.name }}</a></p>
                        <p>型号: <a target="_blank" :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"> {{ row.model }}</a></p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sales_price" label="价格"></el-table-column>
                <el-table-column prop="delivery_period" label="交期"></el-table-column>
                <el-table-column label="图纸">
                  <template slot-scope="{ row,$index }">
                    <div class="drawing">
                      <div>
                        <i class="font_family icon-d2twig"></i>
                        <a target="_blank" :href='row.drawing_2d'>下载</a>
                      </div>
                      <div>
                        <i class="font_family icon-d3twig"></i>
                        <a target="_blank" :href='row.drawing_3d'>下载</a>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="{ row,$index }">
                    <el-button type="primary" size="mini" 
                              @click="joinProject.id = row.id;joinProject.history = row.selling_price_slug;getProject()">加入项目</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-main>
          <!-- FPC 飞行光路 -->
          <el-main class="homeGoodDetail" v-else-if="showDetailState == 7">
            <div class="main">
              <ul>
              </ul>
              <div class="operation">
                <span></span>
                <el-button type="primary" size="mini" @click="screen">筛选</el-button>
              </div>
              <el-table border :data="tableData.list">
                <el-table-column label="产品" width="400">
                  <template slot-scope="{ row,$index }">
                    <div class="productInfo">
                      <div>
                        <img :src="row.image" :alt="row.name">
                      </div>
                      <div>
                        <p>名称：<a target="_blank" :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`">{{ row.name }}</a></p>
                        <p>型号: <a target="_blank" :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"> {{ row.model }}</a></p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sales_price" label="价格"></el-table-column>
                <el-table-column prop="delivery_period" label="交期"></el-table-column>
                <el-table-column label="图纸">
                  <template slot-scope="{ row,$index }">
                    <div class="drawing">
                      <div>
                        <i class="font_family icon-d2twig"></i>
                        <a target="_blank" :href='row.drawing_2d'>下载</a>
                      </div>
                      <div>
                        <i class="font_family icon-d3twig"></i>
                        <a target="_blank" :href='row.drawing_3d'>下载</a>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="{ row,$index }">
                    <el-button type="primary" size="mini" 
                              @click="joinProject.id = row.id;joinProject.history = row.selling_price_slug;getProject()">加入项目</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-main>
          <!-- FPC 桥架 -->
          <el-main class="homeGoodDetail" v-else-if="showDetailState == 8">
            <div class="main">
              <ul>
              </ul>
              <div class="operation">
                <span></span>
                <el-button type="primary" size="mini" @click="screen">筛选</el-button>
              </div>
              <el-table border :data="tableData.list">
                <el-table-column label="产品" width="400">
                  <template slot-scope="{ row,$index }">
                    <div class="productInfo">
                      <div>
                        <img :src="row.image" :alt="row.name">
                      </div>
                      <div>
                        <p>名称：<a target="_blank" :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`">{{ row.name }}</a></p>
                        <p>型号: <a target="_blank" :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"> {{ row.model }}</a></p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sales_price" label="价格"></el-table-column>
                <el-table-column prop="delivery_period" label="交期"></el-table-column>
                <el-table-column label="图纸">
                  <template slot-scope="{ row,$index }">
                    <div class="drawing">
                      <div>
                        <i class="font_family icon-d2twig"></i>
                        <a target="_blank" :href='row.drawing_2d'>下载</a>
                      </div>
                      <div>
                        <i class="font_family icon-d3twig"></i>
                        <a target="_blank" :href='row.drawing_3d'>下载</a>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="{ row,$index }">
                    <el-button type="primary" size="mini" 
                              @click="joinProject.id = row.id;joinProject.history = row.selling_price_slug;getProject()">加入项目</el-button>
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
                    <el-input v-model="params.distance" placeholder="输入"></el-input>
                    <span>mm</span>
                  </div>
                </li>
                <li>
                  <div>Y轴 有效行程</div>
                  <div>
                    <el-input v-model="params.distance" placeholder="输入"></el-input>
                    <span>mm</span>
                  </div>
                </li>
                <li>
                  <div>X轴 速度</div>
                  <div>
                    <el-input v-model="params.speed" placeholder="输入"></el-input>
                    <span>mm/s <small>（行程超过700mm，最大速度递减15%）</small></span>
                  </div>
                </li>
                <li>
                  <div>Y轴 速度</div>
                  <div>
                    <el-input v-model="params.speed" placeholder="输入"></el-input>
                    <span>mm/s <small>（行程超过700mm，最大速度递减15%）</small></span>
                  </div>
                </li>
                <li>
                  <div>联轴器</div>
                  <div>
                    <el-radio v-model="params.couplings" label="0">不配</el-radio>
                    <el-radio v-model="params.couplings" label="l">配</el-radio>
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
                      <el-option v-for="(item,index) in typeSelection.motor_brand" 
                                :key="index" 
                                :label="item.name"
                                :value="item.value"></el-option>
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
                    <el-radio v-model="params.mountingmotor" label="fl">左接</el-radio>
                    <el-radio v-model="params.mountingmotor" label="fr">右接</el-radio>
                  </div>
                </li>
                <li>
                  <div>光电开关</div>
                  <div>
                    <el-radio v-model="params.oswitch" label="0">无</el-radio>
                    <el-radio v-model="params.oswitch" label="X">内置（NPN）</el-radio>
                    <el-radio v-model="params.oswitch" label="W">外置（PNP）</el-radio>
                  </div>
                </li>
                <li>
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
                    <el-radio v-model="params.switchline" label="0">水平</el-radio>
                  </div>
                </li>
              </ul>
              <img src="../../../assets/img/screw_xy_platform.png" class="diagram" style="">
              <div class="operation">
                <span></span>
                <el-button type="primary" size="mini" @click="screen">筛选</el-button>
              </div>
              <el-table border :data="tableData.list">
                <el-table-column label="产品" width="400">
                  <template slot-scope="{ row,$index }">
                    <div class="productInfo">
                      <div>
                        <img :src="row.image" :alt="row.name">
                      </div>
                      <div>
                        <p>名称：<a target="_blank" :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`">{{ row.name }}</a></p>
                        <p>型号: <a target="_blank" :href="`./index.html#/product/${ row.slug }/${ row.id }/${ row.selling_price_slug }`"> {{ row.model }}</a></p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sales_price" label="价格"></el-table-column>
                <el-table-column prop="delivery_period" label="交期"></el-table-column>
                <el-table-column label="图纸">
                  <template slot-scope="{ row,$index }">
                    <div class="drawing">
                      <div>
                        <i class="font_family icon-d2twig"></i>
                        <a target="_blank" :href='row.drawing_2d'>下载</a>
                      </div>
                      <div>
                        <i class="font_family icon-d3twig"></i>
                        <a target="_blank" :href='row.drawing_3d'>下载</a>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                  <template slot-scope="{ row,$index }">
                    <el-button type="primary" size="mini" 
                              @click="joinProject.id = row.id;joinProject.history = row.selling_price_slug;getProject()">加入项目</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-main>
          <!-- LK XY标准机 -->
          <el-main class="homeGoodDetail" v-else-if="showDetailState == 10">
          </el-main>
        </el-container>
        <index-chart></index-chart>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  import indexChart from '@/pages/Index/common/indexChart';
  import echarts from 'echarts';
  import '@/assets/css/modal.css';

  export default {
    name: 'indexMain',
    data() {
      return {
        product: {},
        selectedCate: {},
        selectedGood: {},
        selectedDetail: {},
        showDetailState: 0,
        typeSelection: {
          Int: 0,
          FPC: 0,
          motor_brand: [
            { name: '松下', value: 'p' },
            { name: '安川', value: 'Y' },
            { name: '三菱/汇川', value: 'M' },
            { name: '台达', value: 'T' },
            { name: 'Hiwin', value: 'H' },
            { name: '富士', value: 'F' },
          ]
        },
        params: {
          accelerationTime: '0.5',                     // 加速时间
          distance: '1000',                            // 移动距离
          speed: '0.5',                                // 速度
          acceleration: '5',                           // 加速度
          time: '1',                                   // 时间
          accdistance: '1',                            // 加速距离
          slowdistance: '1',                           // 减速距离 
          slowTime: '0.5',                             // 减速时间
          uniformTime: '1',                            // 匀速时间
          uniformdistance: '1',                        // 匀速距离
          stay_time: '0.5',                            // 停留时间

          readswit: '0',                               // 行程计算
          exercise_mode: "dot_to_dot",                 // 运动方式
          number_of_mover: '1',                        // 动子数量
          load_weight: '3',                            // 负载重量

          feedback_type: "grating_ruler",              // 反馈类弄 光栅尺
          positioning_accuracy: '5',                   // 定位精准
          precision: '1',                              // 精度
          towline_direction: "horizontal",             // 拖链方向  水平方向
          cable_length: '0',                           // 线缆长	
          reproduce_the_accuracy: '3',                 // 重现精度
          dustproof_device: "metal_cover",             // 防尘装置
          power_voltage: '220',                        // 驱动电压
          moduleinstalled: 'horizontal',               // 安装方式 
          mountingmotor: 'fl',                         // 电机安装方式
          oswitch: '0',	                               // 光电开关
          switchline: '2',                             // 开关线	
          couplings: '0',                              // 联轴器	不配联轴器:0 配置联轴器:L	
          module_motor: "n",                           // 是否带马达(模组带电机)	 模组不带马达:N 模组带马达:Y
          motor_brand: "p",                            // 电机品牌	松下:P 安川:Y 三菱/汇川:M 台达:T Hiwin:H 富士:F
          motor_power: "05",                           // 马达功率     50W:05 100W:10 200W:20 400W:40 750W:75 1000W:1K
          cable_lenght: '3',                           // 电机线 
          motor_brake: "A",                            // 马达刹车     带刹车:A 不带刹车:B  
          seal: "KA",                                  // 密封方式	 半封闭KA,，KS全封闭
          driver_type: ''                              // 驱动类型
        },
        speedChart: null,
        modalShow: false,
        joinProject: {
          id: 0,
          projectList: [],
          projectSlug: '',
          status: 0,
          newProjectName: '',
          member: [],
          memberId: [],
          description: ''
        },
        tableData: {}
      }
    },
    components: {
      'index-chart': indexChart
    },
    methods: {
      showCategory(item) {
        this.selectedCate = item;
        this.goodsListActive = '0';
        this.showGoodsList(item[0].children);
        // this.changeGoodsListActive();
      },
      showGoodsList(item) {
        this.showDetailState = 0;
        this.selectedDetail = {};
        this.selectedGood = item;
      },
      showDetail(item) {
        let that = this;
        if(item.enable == 1){
          switch(item.code){
            case 'linear_module':
              this.showDetailState = 1;
              break;
            case 'liner_motor':
              this.showDetailState = 2;
              break;
            case 'screw_module':
              this.showDetailState = 3;
              break;
            case 'precision_lifting_platform':
              this.showDetailState = 4;
              break;
            case 'moving_stator':
              this.showDetailState = 5;
              break;
            case 'fpc_diving_platform':
              this.showDetailState = 6;
              break;
            case 'fpc_flying_light_path':
              this.showDetailState = 7;
              break;
            case 'fpc_bridge':
              this.showDetailState = 8;
              break;
            case 'screw_xy_platform':
              this.showDetailState = 9;
              break;
            case 'LK XY':
              this.showDetailState = 10;
              break;
            default:
              break;
          }
          that.initChart();
        }
      },
      // 修改Echart显示
      changeSpeedChart() {
        let that = this, _self = that.params;
        let option = {
          xAxis: {
            type: 'value',
            axisLine: {onZero: false}
          },
          yAxis: {
            type: 'value',
            name : '速度 m/s(秒)',
            left:'10%',
            axisLabel : {
              formatter:'{value}'    //控制输出格式
            }
          },
          grid: {
            left: '6%',
            right: '6%',
            top: '15%',
            bottom: '5%',
            containLabel: true
          },
          series: [{
              data: [
                [0, 0],
                [_self.accelerationTime, _self.speed],
                [parseFloat(_self.accelerationTime) + parseFloat(_self.uniformTime), _self.speed],
                [parseFloat(_self.accelerationTime) + parseFloat(_self.uniformTime) + parseFloat(_self.slowTime), 0],
                [parseFloat(_self.accelerationTime) + parseFloat(_self.uniformTime) + parseFloat(_self.slowTime)+parseFloat(_self.stay_time), 0]
              ],
              type: 'line'
          }]
        };
        if (option && typeof option === "object") {
          that.speedChart.setOption(option, true);
        }
      },
      // 筛选
      screen() {
        let that = this, loading = this.$loading({ lock: true }),url = null;
        switch(that.showDetailState){
          case 1:
            switch(that.typeSelection.Int){
              case 0:
                url = 'products/selected/liner_motor';
                break;
              case 1:
                url = 'products/selected/belt_module';
                break;
              case 2:
                url = 'products/selected/screw_module';
                break;
            }
            break;
          case 2:
            url = 'products/selected/liner_motor';
            break;
          case 3:
            url = 'products/selected/screw_module';
            break;
          case 4:
            url = 'products/selected/precision_lifting_platform';
            break;
          case 5:
            url = 'products/selected/moving_stator';
            break;
          case 6:
            url = '';
            break;
          case 7:
            url = '';
            break;
          case 8:
            url = '';
            break;
          case 9:
            url = '';
            break;
          case 10:
            url = '';
            break;
          default:
            break;
        }
        that.$post(url ,that.params).then( response => {
          loading.close()
          if(response.status != 200)
            return false;
          that.tableData = response.data;
        }).catch( error => loading.close())
      },
      getBranch(){
        let that = this;
        that.$get('members/company/branch').then( response => {
          if(response.status != 200)
            return false;
          that.joinProject.member = response.data.list;
        }).catch( error => {});
      },
      getProject() {
        if(!localStorage.getItem('user')){
          this.$notify({ title: '警告', message: '请登陆后再作操作', type: 'warning' });
          return false;
        }

        const loading = this.$loading({ lock: true }),that = this;
        that.$get('carts').then( response => {
          loading.close();
          if(response.status != 200)
            return false;
          that.modalShow = true;
          that.joinProject.projectList = response.data.list;
          if(JSON.parse(localStorage.getItem('user')).slug)
            that.getBranch();
        }).catch( error => loading.close());
      },
      addProject() {
        let that = this,loading = this.$loading({ lock: true });;
        that.$post('carts/create',{
          name: that.joinProject.newProjectName,
          members_ids: that.joinProject.member.join(','),
          description: that.joinProject.description
        }).then( response => {
          loading.close()
          if(response.status != 200)
            return false;
          that.joinProject.status = 0;
          that.modalShow = false;
          that.getProject();
        }).catch( error => loading.close())
      },
      joinProjectCart() {
        let that = this,loading = this.$loading({ lock: true });
        that.$post('carts/items/create/' + that.joinProject.projectSlug,{
          product: that.joinProject.id,
          quantity: 1,
          selling_price_slug: that.joinProject.history
        }).then( response => {
          loading.close();
          if(response.status != 200)
            return false;
          that.modalShow = false;
          that.$message({ message: '添加成功', type: 'success' });
        }).catch( error => loading.close());
      },
      // 初始化Echart
      initChart() {
        let that = this;
        setTimeout(() => {
          that.speedChart = echarts.init(document.getElementById("speedChart"));
          that.changeSpeedChart();
        },500)
      },
      changeGoodsListActive() {
        setTimeout(() => {
          let $active = document.getElementsByClassName("homeAsideList")[0].children[0].children;
          for(let i = 0;i < $active.length;i++){
            if(!i){
              if(!$active[i].classList.contains('is-active')){
                $active[i].classList.add('is-active');
              }
            }else{
              $active[i].classList.remove('is-active');
            }
          }
        },100)
      }
    },
    watch: {
      params: {
        handler(val, oldVal){
          this.changeSpeedChart();
        },
        deep: true
      }
    },
    created() {
      const loading = this.$loading({ lock: true }), that = this;
      that.$get('store/category').then( response => {
        loading.close();
        if(response.status != 200){
          return false
        }
        that.product = response.data.list;
        that.showCategory(that.product[0].children)
      }).catch(error => loading.close());
    }
  }
</script>
<style lang="less">
@border: solid 1px #e6e6e6;
@gery: #666666;
@blue: #0064db;
@white: #FFFFFF;
.borShadow (){
  // border: @border;
  // box-shadow: 0 0 15px #a7a6a6;
  background-color: #ffffff;
  height: 100% !important;
}
#main{
  max-width: 1280px;
  margin: 0 auto;
  // 保留底部颜色
  height: 83%;
  @media screen and (min-width: 820px){
    >.el-container{
      height: 100%;
      .homeMainAside{
        padding: 0;
        margin-top: 1.5rem;
        margin-right: 1.5rem;
        .el-menu{
          border: none;
          padding-left: 1rem;
          .el-menu-item.is-active{
            color: #ff9900;
            border-bottom: 2px solid #ff9900;
          }
        }
        .borShadow
      }
    }
    .homeMainContent{
      position: relative;
      padding: 0;
      margin-top: 1.5rem;
      height: 100% !important;
      background: #ffffff;
      >section{
        height: 100%;
        .homeAsideList{
          .el-menu-item{
            border-bottom: 1px solid #e6e6e6;
          }
          .el-menu-item.is-active{
            background-color: #ff9900;
            color: #ffffff;
          }
        }
        .homeMainList{
          display: flex;
          flex-wrap: wrap;
          background: #ffffff;
          >div{
            width: 15rem;
            height: 15rem;
            overflow: hidden;
            text-align: center;
            padding: 1rem;
            img{
              display: block;
              margin: 0 auto;
              padding: .5rem;
              border: 1px solid #EEEEEE;
              box-sizing: border-box;
              width: 80%;
            }
            span{
              line-height: 2;
              color: #666666;
            }
          }
        }
        .homeGoodDetail{
          .main{
            width: 92%;
            box-sizing: border-box;
            position: relative;
            ul{
              width: 100%;
              list-style: none;
              color: @gery;
              li{
                display: flex;
                width: 100%;
                border-top: @border;
                border-right: @border;
                >div{
                  border-left: @border;
                  padding: 1rem;
                  &:first-child{
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    width: 160px;
                    .el-radio{
                      width: 100%;
                      margin-left: 0;
                    }
                  }
                  &:last-child{
                    canvas{
                      float: left;
                    }
                    .el-input{
                      width: 6rem;
                      box-sizing: content-box;
                      input{
                        border: none;
                        border-radius: 0;
                        border-bottom: @border;
                      }
                    }
                    .labelInput{
                      margin-left: 1rem;
                    }
                    .tips{
                      margin-top: 1rem;
                    }
                  }
                }
                &:last-child{
                  border-bottom: @border;
                }
                .chartOption{
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  box-sizing: border-box;
                  div:last-child{
                    margin-left: 1rem;
                  }
                }
              }
            }
            .typeSelection{
              display: flex;
              align-items: center;
              border: @border;
              border-bottom: none;
              padding-top: 3rem;
              >div{
                height: 3rem;
                line-height: 3rem;
                text-align: center;
                flex-grow: 1;
                background-color: @white;
                border-top: @border;
                border-right: @border;
                &:last-child{
                  border-right: none;
                }
                &:hover{
                  color: @white;
                  background: @blue;
                }
              }
              .active{
                color: @white;
                background: @blue;
              }
            }
            .operation{
              display: flex;
              justify-content: space-between;
              padding: .5rem 0;
            }
            .el-table{
              width: 100%;
              .el-table__row{
                .productInfo{
                  display: flex;
                  align-items: center;
                  >div{
                    &:first-child{
                      border: @border;
                      margin-right: 1rem;
                      img{
                        max-width: 80px;
                        max-height: 80px;
                      }
                    }
                  }
                }
                .drawing{
                  display: flex;
                  justify-content: center;
                  >div{
                    display: flex;
                    align-content: center;
                    justify-content: center;
                    flex-direction: column;
                    flex-wrap: wrap;
                    height: 80px;
                    text-align: center;
                    color: @blue;
                    margin: 0 .2rem;
                    i{
                      display: block;
                      font-size: 4rem;
                    }
                    a{
                      padding-top: 1rem;
                      text-decoration: none;
                    }
                  }
                }
              }
            }
            .diagram{
              position: absolute;
              top: 0;
              right: 0;
              border: @border;
              background-color: #ffffff;
              height: 195px;
              box-sizing: border-box;
            }
          }
        }
      }
    }
  }

  @media screen and (max-width: 820px){
    >.el-container{
      height: auto;
      display: block;
      .homeMainAside{
        padding: 0;
        width: 100% !important;
        height: auto;
        .el-menu{
          border: none;
          .el-menu-item{
            border-bottom: 1px solid #e6e6e6;
            box-sizing: border-box;
          }
          .el-menu-item.is-active{
            color: #ff9900;
            border-bottom: 2px solid #ff9900;
          }
        }
      }
    }
    .homeMainContent{
      display: block;
      padding: 0;
      background: #ffffff;
      >section{
        .homeAsideList{
          box-sizing: border-box;
          .el-menu-item{
            border-bottom: 1px solid #e6e6e6;
            box-sizing: border-box;
            &:first-child{
              border-top: 1px solid #e6e6e6;
            }
          }
          .el-menu-item.is-active{
            background-color: #ff9900;
            color: #ffffff;
          }
        }
        .homeMainList{
          display: flex;
          flex-wrap: wrap;
          background: #ffffff;
          padding: .5rem;
          >div{
            width: 50%;
            box-sizing: border-box;
            text-align: center;
            img{
              display: block;
              margin: auto;
              padding: .5rem;
              border: 1px solid #EEEEEE;
              box-sizing: border-box;
              width: 90%;
            }
            span{
              line-height: 2;
              color: #666666;
            }
          }
        }
        .homeGoodDetail{
          padding: 0;
          ul{
            list-style: none;
            color: @gery;
            box-sizing: border-box;
            li{
              width: 100%;
              border-top: @border;
              border-right: @border;
              box-sizing: border-box;
              >div{
                border-left: @border;
                padding: 1rem;
                width: 99%;
                box-sizing: border-box;
                &:first-child{
                  .el-radio{
                    width: 100%;
                    margin-left: 0;
                    margin-right: 0;
                  }
                }
                &:last-child{
                  display: block;
                  .el-input{
                    width: 4rem;
                    box-sizing: content-box;
                    input{
                      border: none;
                      border-radius: 0;
                      border-bottom: @border;
                    }
                  }
                  .el-radio{
                    margin-left: 5px;
                  }
                  .labelInput{
                    margin-left: 1rem;
                  }
                  .pull-left{
                    float: initial;
                    text-align: left;
                  }
                  .tips{
                    margin-top: 1rem;
                  }
                }
              }
              &:last-child{
                border-bottom: @border;
              }
            }
          }
          .operation{
            display: flex;
            justify-content: center;
            padding: .5rem 6rem;
          }
          .el-table{
            .el-table__row{
              .productInfo{
                display: flex;
                align-items: center;
                >div{
                  &:first-child{
                    border: @border;
                    margin-right: 1rem;
                    img{
                      max-width: 80px;
                      max-height: 80px;
                    }
                  }
                }
              }
              .drawing{
                display: flex;
                justify-content: center;
                >div{
                  display: flex;
                  align-content: center;
                  justify-content: center;
                  flex-direction: column;
                  flex-wrap: wrap;
                  height: 80px;
                  text-align: center;
                  color: @blue;
                  i{
                    display: block;
                    font-size: 4rem;
                  }
                  a{
                    padding-top: 1rem;
                    text-decoration: none;
                  }
                }
              }
            }
          }
          .diagram{
            width: 100%;
            border-left: @border;
            border-right: @border;
            border-bottom: @border;
          }
        }
      }
    }
  }
  .modalBoxMain{
    width: 330px;
    @media screen and (min-width: 500px){
      margin-top: 180px;
    }
    #joinProject{
      p{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      .goBack{
        float: right;
        padding-top: 0;
      }
      >div{
        text-align: center;
        margin-bottom: 1rem;
        .el-select{
          width: 100%;
        }
        &:last-child{
          margin-top: 2rem;
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
