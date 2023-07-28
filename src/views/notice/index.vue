<template>
  <div class="app-container">
    <div class="tableBar">
      <el-input
        v-model="input"
        placeholder="请输入需要搜索的公告标题"
        style="width: 250px"
        clearable
        @keyup.enter.native="handleQuery">
        <i slot="prefix"
           class="el-input__icon el-icon-search"
           style="cursor: pointer"
           @click="handleQuery"></i>
      </el-input>
      <div class="tableLab">
        <el-button
          type="warning"
          size="medium"
          @click="handleUpdate('add')">
          + 新增公告
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
        prop="title"
        label="公告标题">
      </el-table-column>
      <el-table-column
        prop="image"
        label="公告图片"
        align="center">
        <template slot-scope="{ row }">
          <el-image style="width: auto; height: 40px; border:none;cursor: pointer;"
                    :src="getImage(row.image)"
                    :preview-src-list="[ `/common/download?name=${row.image}` ]">
            <div slot="error" class="image-slot">
              <img src="../../assets/noImg.png" style="width: auto; height: 40px; border:none;">
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="creator"
        label="公告发布者">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="公告发布时间">
      </el-table-column>
      <el-table-column
        prop="content"
        width="400px"
        :show-overflow-tooltip="true"
        label="公告内容">
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="290px">
        <template slot-scope="scope">
          <el-button
            size="medium"
            type="text"
            style="margin-right: 5px"
            @click="handleUpdate('edit',scope.row)">查看
          </el-button>
          <el-button
            size="medium"
            class="delBut non"
            type="text"
            style="margin-right: 5px"
            @click="deleteHandle(scope.row.id)">删除
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
import {del, page} from "@/api/notice";

export default {
  name: "index",
  data() {
    return {
      size: '',
      page: 1,
      input: '',
      counts: 0,
      pageSize: 10,
      tableData: [],
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        title: this.input ? this.input : undefined
      }
      await page(params).then(res => {
        if (String(res.code) === '200') {
          this.counts = res.data.total
          this.tableData = res.data.records || []
        }
      }).catch(err => {
        this.$message.error('请求出错了：' + err)
      })
    },
    handleSelectionChange(val) {
      let checkArr = []
      val.forEach((n) => {
        checkArr.push(n.id)
      })
      this.checkList = checkArr
    },
    getImage(image) {
      return `/common/download?name=${image}`
    },
    handleUpdate(st, data) {
      if (st === 'add') {
        this.$router.push({
          name: 'NoticeList'
        })
      } else {
        this.$router.push({
          name: 'NoticeList',
          params: {
            id: data.id,
            data: data
          }
        })
      }
    },
    deleteHandle(id) {
      this.$confirm('删除该公告后不可修复,请确认是否删除?', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'confirmButtonClass': 'confirmButton',
        'type': 'error'
      }).then(() => {
        del(id).then(res => {
          if (res.code === 200) {
            this.$message.success('删除公告成功')
            this.init()
          }
        }).catch(error => {
          this.$message.error('请求出错了：' + error)
        })
      })
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
  }
}
</script>

<style>
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
