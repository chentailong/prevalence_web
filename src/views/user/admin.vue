<template>
  <div class="app-container">
    <div class="tableBar">
      <el-input
        v-model="input"
        placeholder="请输入管理员姓名"
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
          @click="handleEdit('add')">
          + 新增管理
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
        label="姓名">
      </el-table-column>
      <el-table-column
        label="性别"
        width="80px">
        <template slot-scope="scope">
          {{ String(scope.row.sex) === '1' ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="community"
        label="社区">
      </el-table-column>
      <el-table-column
        prop="floor"
        label="单元"
        width="120px">
      </el-table-column>
      <el-table-column
        prop="room"
        label="房间号"
        width="120px">
      </el-table-column>
      <el-table-column
        prop="number"
        label="入住人数">
      </el-table-column>
      <el-table-column
        label="入住时间"
        width="120px">
        <template slot-scope="scope">
          {{ scope.row.createTime.split(' ')[0] }}
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注">
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          {{ String(scope.row.status) === '0' ? '已禁用' : '正常' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="170px">
        <template slot-scope="scope">
          <el-button
            size="medium"
            type="text"
            style="margin-right: 5px"
            @click="handleEdit('edit', scope.row)">编辑
          </el-button>
          <el-button
            size="medium"
            class="delBut non"
            type="text"
            style="margin-left: 0"
            @click="handleDelete(scope.$index, scope.row)">
            {{ String(scope.row.status) === '1' ? '禁用' : '启用' }}
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
import {pageAdmin, updateStatus} from '@/api/user'
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
  }, created() {
    this.init()
  },
  methods: {
    //编辑
    handleEdit(st, row) {
      if (st === 'add') {
        this.$router.push({
          name: 'List',
        })
      } else {
        this.$router.push({
          name: 'List',
          params: {
            id: row.id,
            data: row
          }
        })
      }
    },
    //删除
    handleDelete(index, row) {
      this.id = row.id
      this.status = row.status
      this.$confirm('确认调整该账号的状态?', '提示', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'error'
      }).then(() => {
        updateStatus({'id': this.id, 'status': !this.status ? 1 : 0}).then(res => {
          if (String(res.code) === '200') {
            this.$message.success('账号状态更改成功！')
            this.handleQuery()
          }
        }).catch(err => {
          this.$message.error('请求出错了：' + err)
        })
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
      pageAdmin(params).then(res => {
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

<style lang="scss" scoped>

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
  width: 0;
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
