<template>
  <div class="app-container">
    <div class="tableBar">
      <el-input
        v-model="input"
        placeholder="请输入访客姓名"
        style="width: 250px"
        clearable
        @keyup.enter.native="handleQuery">
        <i
          slot="prefix"
          class="el-input__icon el-icon-search"
          style="cursor: pointer"
          @click="handleQuery"></i>
      </el-input>
      <div class="tableLab">
        <el-button
          type="warning"
          size="medium"
          @click="handleUpdate('add')">
          + 新增访客信息
        </el-button>
      </div>
    </div>

    <el-table
      stripe
      ref="multipleTable"
      :data="tableData"
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="id"
        type="index"
        width="80px">
      </el-table-column>
      <el-table-column
        prop="name"
        label="访客姓名">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="plot"
        label="社区">
      </el-table-column>
      <el-table-column
        prop="who"
        label="访问对象">
      </el-table-column>
      <el-table-column
        prop="goal"
        label="目的">
      </el-table-column>
      <el-table-column
        prop="unit"
        label="单元">
      </el-table-column>
      <el-table-column
        label="进出类型">
        <template slot-scope="scope">
          {{ String(scope.row.type) === '0' ? '进' : '出' }}
        </template>
      </el-table-column>
      <el-table-column
        label="访问时间">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注">
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-button
            size="medium"
            type="text"
            style="margin-right: 5px"
            @click="handleUpdate('edit', scope.row)">编辑
          </el-button>
          <el-button
            size="medium"
            class="delBut non"
            type="text"
            style="margin-right: 5px"
            @click="handleDel(scope.row.id)">删除
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
import {page, del} from "@/api/visitor";

export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      counts: 0,
      page: 1,
      input: '',
      pageSize: 10,
    }
  },
  created() {
    this.init()
  },
  methods: {
    /**
     * 新增||编辑
     */
    handleUpdate(st, row) {
      if (st === 'add') {
        this.$router.push({
          name: 'VisitorCheckIn'
        })
      } else {
        this.$router.push({
          name: 'VisitorCheckIn',
          params: {
            id: row.id,
            data: row
          }
        })
      }
    },
    //删除
    handleDel(id) {
      this.$confirm('确认删除该访问记录?删除后不可恢复,请仔细确认', '删除', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'error'
      }).then(() => {
        console.log(id)
        del(id).then(res => {
          console.log(res)
          if (res.code === 200) {
            this.$message.success("删除访问记录成功")
            this.handleQuery()
          } else {
            this.$message.error("操作失败")
          }
        }).catch(error => {
          this.$message.error(error)
        })
      }).catch(() => {
        console.log("取消操作")
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
    //默认搜索第一页
    handleQuery() {
      this.page = 1;
      this.init();
    },
    //默认发送请求，获取用户数据
    init() {
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        name: this.input ? this.input : undefined
      }
      page(params).then(res => {
        if (String(res.code) === '200') {
          this.tableData = res.data.records || []
          this.counts = res.data.total
        }
      }).catch(err => {
        this.$message.error('请求出错了：' + err)
      })
    },
  }
}
</script>

<style scoped>
.tableBar {
  margin-bottom: 30px;
}

.delBut {
  color: #f56c6c !important;
  position: relative;
}

.delBut::after {
  content: "";
  position: absolute;
  right: -6px;
  height: 14px;
  width: 0px;
  border-right: solid 1px #ebeef5 !important;
}

.non::after {
  display: none;
}

.tableLab {
  display: inline-block;
  float: right;
}

.tableLab .el-button {
  margin-left: 10px;
}


</style>
