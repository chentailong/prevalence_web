<template>
  <div class="app-container">
    <div class="cart-head">
      <i class="el-icon-connection icon-cart"></i>
      <span class="my-cart">订单列表</span>
      <span class="hint">温馨提示：您有 <span style="color:red;font-size: 20px">
          {{ tableData.length }}
        </span> 个订单</span>
      <el-divider/>
    </div>
    <el-table
      border
      ref="multipleTable"
      :data="tableData"
      :span-method="objectSpanMethod"
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
      tooltip-effect="dark"
      @row-click="orderDetail"
      style="width: 100%">
      <el-table-column
        label="订单ID"
        prop="orderNumber">
      </el-table-column>
      <el-table-column
        align="center"
        label="商品图片">
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
        prop="orderTime"
        label="下单时间">
      </el-table-column>
      <el-table-column
        label="订单状态">
        <template slot-scope="{row}">
          <el-tag type="info" v-if="row.status === 1">代付款</el-tag>
          <el-tag type="success" v-if="row.status === 2">待配送</el-tag>
          <el-tag type="warning" v-if="row.status === 3">已配送</el-tag>
          <el-tag v-if="row.status === 4">已完成</el-tag>
          <el-tag type="danger" v-if="row.status === 5">已取消</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pageList"
      style="text-align: center;margin-top: 20px"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="counts"
      :current-page.sync="page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
import {page} from "@/api/order";

export default {
  data() {
    return {
      page: 1,
      input: '',
      pageSize: 10,
      tableData: [],
      counts: 0,
      spanArr: [],
      pos: 0
    }
  },
  created() {
    this.init()
  },
  methods: {
    //查看详情
    orderDetail(data) {
      this.$router.push({
        name: "UserOrderDetail",
        params: {data}
      })
    },
    //获取订单
    init() {
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        name: this.input ? this.input : undefined
      }
      page(params).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.records
          this.counts = res.data.total
          this.getSpanArr(res.data.records)
        } else {
          this.$notify.error(res.msg)
        }
      })
    },
    getImage(image) {
      return `/common/download?name=${image}`
    },
    //设置最大页数显示
    handleSizeChange(val) {
      this.pageSize = val
      this.init()
    },
    //设置当前页
    handleCurrentChange(val) {
      this.page = val
      this.init()
    },
    getSpanArr(data) {
      this.spanArr = []
      this.pos = 0
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].id === data[i - 1].id) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },
    objectSpanMethod({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
  }
}
</script>

<style scoped>

</style>
