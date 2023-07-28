<template>
  <div>
    <div class="app-container">
      <div style="margin-bottom: 30px;">
        <i class="el-icon-position icon-cart"></i>
        <span class="my-cart">地址选择</span>
        <el-divider/>
        <div @click="changeAddress()">
          <el-tooltip class="item" effect="dark" content="点击更换地址" placement="top">
            <el-descriptions style="margin:20px">
              <el-descriptions-item label="收件人">{{ address.consignee }}
                {{ address.sex === '1' ? '先生' : '女士' }}
              </el-descriptions-item>
              <el-descriptions-item label="手机号">{{ address.phone }}</el-descriptions-item>
              <el-descriptions-item label="联系地址">{{ address.detail }}</el-descriptions-item>
            </el-descriptions>
          </el-tooltip>
        </div>
      </div>
      <div class="cart-head">
        <i class="el-icon-shopping-cart-2 icon-cart"></i>
        <span class="my-cart">购物清单</span>
        <span class="hint">温馨提示：您有 <span style="color:red;font-size: 20px">
          {{ data.length }}
        </span> 件商品需要结算</span>
        <el-divider/>
      </div>
      <el-table
        stripe
        ref="multipleTable"
        :data="data"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          align="center">
          <template slot-scope="{ row }">
            <el-image style="width: 50px; height: 50px; border:none;cursor: pointer;"
                      :src="getImage(row.image)">
              <div slot="error" class="image-slot">
                <img src="../../assets/noImg.png" style="width: auto; height: 40px; border:none;" alt="加载失败">
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品名称">
        </el-table-column>
        <el-table-column
          label="单价">
          <template slot-scope="{ row }">
            <span style="color:red;">{{ (row.price.toFixed(2)) }} 元</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="number"
          label="数量">
        </el-table-column>
        <el-table-column
          label="小计">
          <template slot-scope="{ row }">
            <span style="color:red;">{{ (row.subtotal.toFixed(2)) }} 元</span>
          </template>
        </el-table-column>
      </el-table>

      <el-input
        type="textarea"
        :rows="2"
        style="margin-top: 20px;"
        placeholder="如果有需要,这里可以填写备注"
        v-model="remark">
      </el-input>

      <div style="margin-top: 10px;">
        <p>商品总价: <span style="color:red; font-size: 18px">{{ shoppingTotal.toFixed(2) }}</span> 元</p>
        <p>运费: <span style="color:red; font-size: 18px">{{ freight.toFixed(2) }} </span>元</p>
        <p>合计: <span style="color:red; font-size: 18px">{{ total.toFixed(2) }} </span>元</p>
      </div>
      <el-divider/>
      <div>
        <el-button type="danger"
                   :loading="loading"
                   style="position: absolute;right: 20px"
                   @click="gotoPay()">确认去付款
        </el-button>
        <el-button @click="returns()">返回继续添加商品</el-button>
      </div>
    </div>

    <el-dialog title="收货地址" :visible.sync="dialogAddressVisible">
      <div>
        <el-table
          ref="singleTable"
          :data="addressList"
          highlight-current-row
          @current-change="handleCurrentChange"
          style="width: 100%">
          <el-table-column
            property="consignee"
            label="收件人">
          </el-table-column>
          <el-table-column
            property="phone"
            label="手机号">
          </el-table-column>
          <el-table-column
            property="detail"
            label="地址">
          </el-table-column>
        </el-table>
      </div>
      <el-button type="warning"
                 plain
                 v-if="addressList.length !== 0"
                 @click="selectAddress()"
                 style="margin-top: 20px;">确认
      </el-button>
      <el-button type="warning"
                 plain
                 v-else=""
                 @click="goAddress()"
                 style="margin-top: 20px;">去添加地址
      </el-button>
    </el-dialog>
    <el-dialog :title="paySucc ? '支付成功':'扫码支付'" :visible.sync="dialogVisible" width="14%" center>
      <!-- 生成二维码图片 -->
      <vueQr :text="text"
             :size="200"
             v-if="!paySucc"></vueQr>
      <!-- 使用websocket监控是否扫描，扫描成功显示成功并退出界面 -->
      <span class="iconfont icon-success"
            style="position: relative;font-size: 100px;color:#42B983;margin-left: 50px;top:-10px;" v-else></span>
    </el-dialog>

    <div id="pay"></div>
  </div>
</template>

<script>
import {addressListApi, getDefaultAddressApi} from '@/api/address'
import {alipay, pay} from '@/api/pay'
import vueQr from 'vue-qr'
import axios from 'axios'

export default {
  data() {
    return {
      dialogVisible: false,
      text: "",
      paySucc: false,
      data: '',
      tableData: [],
      shoppingTotal: 0,
      freight: 0,
      total: 0,
      remark: '',
      loading: false,
      addressList: [],
      address: {
        phone: '',//手机号
        consignee: '',//收件人
        detail: '',//详细地址
        sex: '1',
        id: undefined
      },
      dialogAddressVisible: false,
      currentRow: null,
      name: '',
    }
  },
  mounted() {

  },
  components: {
    vueQr
  },
  methods: {
    selectAddress() {
      if (this.currentRow !== null) {
        this.address = this.currentRow
        this.dialogAddressVisible = false
      } else {
        this.$message.error("请选择收货地址")
      }
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    //支付
    gotoPay() {
      this.loading = true
      let _this = this;
      _this.paySucc = false;
      _this.dialogVisible = true;
      const params = {
        money: this.shoppingTotal,
        title: "商品",
        remark: _this.remark,
        payMethod: 1,
        addressBookId: _this.address.id,
        message: JSON.stringify(_this.data)
      }

      pay(params).then((response) => {
        _this.text = response;
        _this.dialogVisible = true;
        if ("WebSocket" in window) {
          // 打开一个 web socket
          var ws = new WebSocket("ws://localhost:8888/webSocket");
          ws.onopen = function () {
            // Web Socket 已连接上，使用 send() 方法发送数据
            ws.send("data");
          };
          ws.onmessage = function (evt) {
            let received_msg = evt.data
            console.log(received_msg)
            if (received_msg) {
              _this.$notify.success("支付成功")
              _this.loading = false
              _this.$router.push({
                name: "Orders"
              })
            } else {
              _this.dialogVisible = false
              _this.loading = false
              _this.$notify.error("付款失败，请重试")
            }
            if (Boolean(evt.data)) {
              _this.paySucc = true
              setTimeout(() => {
                _this.dialogVisible = false
                _this.loading = false
              }, 3 * 1000);
            }
            ws.close();
          };
          ws.onclose = function () {
            console.log("连接已关闭...");
          };
        } else {
          this.$message.error("您的浏览器不支持 WebSocket!")
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    back(dataUrl, id) {
      console.log(dataUrl, id)
    },
    //获取默认地址
    defaultAddress() {
      getDefaultAddressApi().then(res => {
        if (res.code === 200) {
          this.address = res.data
        } else {
          this.$notify.error('没有设置默认地址，请前往设置!')
          this.dialogAddressVisible = true
        }
      })
    },
    //更换地址
    changeAddress() {
      this.dialogAddressVisible = true
    },
    //获取地址列表
    getAddressList() {
      addressListApi().then(res => {
        if (res.code === 200) {
          this.addressList = res.data || []
        } else {
          this.$notify.error(res.msg)
        }
      })
    },
    //下载图片
    getImage(image) {
      return `/common/download?name=${image}`
    },
    //回去购物
    returns() {
      this.$router.push({
        name: "Shopping"
      })
    },
    //计算总价
    calculateTotal() {
      let data = this.data
      if (data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
          this.shoppingTotal += data[i].subtotal
        }
      } else {
        this.shoppingTotal = 0
      }
      this.total = this.freight + this.shoppingTotal
    },
    //新增地址
    goAddress() {
      this.$router.push({
        name: "Address"
      })
    },
  },
  created() {
    this.data = this.$route.params.data

    console.log(this.data)
    this.calculateTotal()
    this.defaultAddress()
    this.getAddressList()
  },

}
</script>

<style scoped>
.icon-cart {
  font-size: 30px;
  color: red;
}

.my-cart {
  font-size: 30px;
  margin-left: 10px;
  font-family: 宋体, serif;
}

.hint {
  font-size: 10px;
  margin-left: 10px;
  color: gray;
  font-family: 新宋体, serif;
}

</style>
