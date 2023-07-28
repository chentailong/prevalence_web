<template>
  <div class="app-container">

    <el-table
      border
      ref="multipleTable"
      :data="tableData"
      :span-method="objectSpanMethod"
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
      tooltip-effect="dark"
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
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.status === 1">等待买家付款</el-tag>
          <el-button
            type="text"
            v-if="scope.row.status === 2"
            style="margin-right: 5px;color: #34bfa3"
            @click="updateStatus(scope.row,2,'开始派送')">开始派送
          </el-button>
          <el-button
            v-else-if="scope.row.status === 3"
            type="text"
            style="color: chocolate"
            @click="updateStatus(scope.row,3,'确认送达')">确认送达
          </el-button>
          <el-button
            disabled
            type="text"
            v-else-if="scope.row.status === 4"
            @click="updateStatus(scope.row)">订单已完成
          </el-button>
          <el-button
            disabled
            type="text"
            v-else-if="scope.row.status === 5"
            @click="updateStatus(scope.row)">订单已取消
          </el-button>
          <el-button
            type="text"
            class="delBut non"
            v-if="scope.row.status === 6"
            @click="updateStatus(scope.row,8,'同意退款')">同意退款
          </el-button>
          <el-button
            type="text"
            v-if="scope.row.status === 6"
            class="delBut non"
            style="margin-left: 0"
            @click="updateStatus(scope.row,7,'拒绝退款')">拒绝退款
          </el-button>
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
import {AllPage, update} from '@/api/order'

export default {
  data() {
    return {
      spanArr: [],
      pos: 0,
      tableData: [],
      page: 1,
      input: '',
      pageSize: 10,
      counts: 0,
    };
  },

  created() {
    this.init()
  },

  methods: {
    init() {
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        input: this.input
      }
      AllPage(params).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.records
          this.counts = res.data.total
          this.getSpanArr(res.data.records)
        } else {
          this.$notify.error(res.msg)
        }
      })
    },
    //修改状态
    updateStatus(row, status, hint) {
      this.$confirm('是否' + hint + '?', '提示', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(() => {
        const params = {
          ...row,
          status: status
        }
        update(params).then(res => {
          if (res.code === 200) {
            this.init()
          } else {
            this.$notify.error(res.msg)
          }
        })
      }).catch(() => {
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
      if (columnIndex === 0 || columnIndex === 7) {
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
.delBut {
  color: #f56c6c !important;
  position: relative;
}

</style>
