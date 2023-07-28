<template>
  <div class="app-container">
    <div class="cart-head">
      <span class="hints">订单号：{{ orderDetail.orderNumber }}</span>
      <span class="hints">下单时间：{{ orderDetail.orderTime }}</span>
    </div>

    <div class="order-content">
      <el-descriptions title="订单详情" :column="4">
        <el-descriptions-item label="收件人姓名">{{ orderDetail.consignee }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ orderDetail.phone }}</el-descriptions-item>
        <el-descriptions-item label="收货地址">{{ orderDetail.address }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag size="small" type="info" v-if="orderDetail.status === 0">已退款</el-tag>
          <el-tag size="small" type="info" v-if="orderDetail.status === 1">代付款</el-tag>
          <el-tag size="small" type="success" v-if="orderDetail.status === 2">待配送</el-tag>
          <el-tag size="small" type="warning" v-if="orderDetail.status === 3">已配送</el-tag>
          <el-tag size="small" v-if="orderDetail.status === 4">已完成</el-tag>
          <el-tag size="small" type="danger" v-if="orderDetail.status === 5">已取消</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="支付方式"> {{ (orderDetail.payMethod) === '1' ? '微信' : '支付宝' }}</el-descriptions-item>
        <el-descriptions-item label="实付金额"> ￥ {{ (orderDetail.amount).toFixed(2) }}
        </el-descriptions-item>
        <el-descriptions-item label="买家留言"> {{ (orderDetail.remark) }}</el-descriptions-item>
      </el-descriptions>
      <el-steps :space="200" :active="orderDetail.status" align-center finish-status="success" style="margin: 30px 0">
        <span style="line-height: 40px">交易进度：</span>
        <el-step title="买家付款"></el-step>
        <el-step title="等待商家配送"></el-step>
        <el-step title="商家发货"></el-step>
        <el-step title="交易完成"></el-step>
      </el-steps>
      <el-table
        stripe
        ref="multipleTable"
        :data="orderList"
        :header-cell-style="{'text-align':'center','background-color':'#f6f6f6'}"
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
            <span style="color:red;">{{ (row.price).toFixed(2) }} 元</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="number"
          label="数量">
        </el-table-column>
        <el-table-column
          label="小计">
          <template slot-scope="{ row }">
            <span style="color:red;">{{ (row.price * row.number).toFixed(2) }} 元</span>
          </template>
        </el-table-column>
        <el-table-column
          label="退款">
          <template slot-scope="{row}">
            <span v-if="orderDetail.refund === 0">已申请退款</span>
            <el-button v-if="orderDetail.refund === 1 && orderDetail.status !== 4"
                       type="text">申请退款
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 10px;text-align: end">
        <p>商品总价: <span
          style="color:#9e9e9e; font-size: 14px">￥{{ shoppingTotal.toFixed(2) }}</span></p>
        <p>运费: <span style="color:#9e9e9e; font-size: 14px">￥{{ discounts }} </span></p>
        <p>优惠: <span style="color:#9e9e9e; font-size: 14px">￥{{ freight }} </span></p>
        <p>合计: <span style="color:red; font-size: 18px">￥{{ (orderDetail.amount).toFixed(2) }} </span></p>
      </div>
    </div>

  </div>
</template>

<script>

import {list} from '@/api/order'

export default {
  data() {
    return {
      orderDetail: {},
      orderList: [],
      discounts: 0,
      freight: 0,
      shoppingTotal: 0,
    }
  },
  created() {
    this.orderDetail = this.$route.params.data
    if (this.orderDetail === null || this.orderDetail === undefined) {
      this.$router.push({name: "Orders"})
    }
    this.getInit()
  },
  methods: {
    getImage(image) {
      return `/common/download?name=${image}`
    },
    getInit() {
      const params = {
        orderId: this.orderDetail.orderNumber
      }
      list(params).then(res => {
        if (res.code === 200) {
          this.orderList = res.data
          this.calculate()
        } else {
          this.$notify.error(res.msg)
        }
      })
    },
    //计算价格
    calculate() {
      let data = this.orderList
      if (data.length !== 0) {
        for (var i = 0; i < data.length; i++) {
          this.shoppingTotal += data[i].number * data[i].price
        }
      } else {
        this.shoppingTotal = 0
      }
    },
  }
}
</script>

<style scoped>
.hints {
  font-size: 14px;
  margin-right: 40px;
}

.order-content {
  border: 1px solid #ebebeb;
  border-radius: 3px;
  margin: 24px 0;
  padding: 20px;
}
</style>
