<template>
  <div>
    <el-table :data="list" style="width: 100%;padding-top: 15px;">
      <el-table-column label="name" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.name | orderNoFilter }}
        </template>
      </el-table-column>
      <el-table-column label="Price" width="195" align="center">
        <template slot-scope="scope">
          ¥{{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="Status" width="100" align="center">
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
      :page-sizes="[5, 10, 20, 40]"
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
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: null,
      page: 1,
      input: '',
      pageSize: 5,
      counts: 0,
    }
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
      page(params).then(res => {
        if (res.code === 200) {
          this.list = res.data.records
          this.counts = res.data.total
        } else {
          this.$notify.error(res.msg)
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.init()
    },
    //设置当前页
    handleCurrentChange(val) {
      this.page = val
      this.init()
    },
  }
}
</script>
