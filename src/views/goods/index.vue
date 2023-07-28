<template>
  <div class="app-container">
    <div class="tableBar">
      <el-input
        v-model="input"
        placeholder="请输入需要搜索的物资名称"
        style="width: 250px"
        clearable
        @keyup.enter.native="handleQuery">
        <i slot="prefix"
           class="el-input__icon el-icon-search"
           style="cursor: pointer"
           @click="handleQuery"></i>
      </el-input>
      <div class="tableLab">
        <span class="span-btn delBut non" @click="deleteHandle('批量', null)">批量删除</span>
        <span class="span-btn blueBug non" @click="statusHandle('1')">批量启售</span>
        <span style="border:none;" class="span-btn delBut non" @click="statusHandle('0')">批量停售</span>
        <el-button
          type="warning"
          size="medium"
          @click="handleUpdate('add')">
          + 新增物资
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
        prop="name"
        label="物资名称">
      </el-table-column>
      <el-table-column
        prop="image"
        label="物资图片"
        align="center">
        <template slot-scope="{ row }">
          <el-image style="width: auto; height: 40px; border:none;cursor: pointer;"
                    :src="getImage(row.image)"
                    :preview-src-list="[`/common/download?name=${row.image}` ]">
            <div slot="error" class="image-slot">
              <img src="../../assets/noImg.png" style="width: auto; height: 40px; border:none;">
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="categoryName"
        label="物资分类">
      </el-table-column>
      <el-table-column
        prop="price"
        label="物资价格">
      </el-table-column>
      <el-table-column
        prop="description"
        label="物资描述">
      </el-table-column>
      <el-table-column
        label="售卖状态">
        <template slot-scope="scope">
          {{ String(scope.row.status) === '0' ? '停售' : '起售' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="最后操作时间">
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="290px">
        <template slot-scope="scope">
          <el-button
            size="medium"
            type="text"
            style="margin-right: 5px"
            @click="handleUpdate('edit',scope.row)">修改
          </el-button>
          <el-button
            size="medium"
            type="text"
            style="margin-left: 0"
            @click="statusHandle(scope.row)">
            {{ String(scope.row.status) === '1' ? '停售' : '起售' }}
          </el-button>
          <el-button
            size="medium"
            class="delBut non"
            type="text"
            style="margin-right: 5px"
            @click="deleteHandle('单删',scope.row.id)">删除
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
import {page, statusUpdate, del} from '@/api/goods'

export default {
  data() {
    return {
      tableData: [],
      checkList: [],
      counts: 0,
      page: 1,
      input: '',
      pageSize: 10,
      goodsState: '',
    }
  },
  created() {
    this.init()
  },
  methods: {
    //修改信息
    handleUpdate(st, row) {
      if (st === 'add') {
        this.$router.push({
          name: 'GoodsList',
        })
      } else {
        this.$router.push({
          name: 'GoodsList',
          params: {
            id: row.id,
            data: row
          }
        })
      }
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



    // 删除
    deleteHandle(type, id) {
      if (type === '批量' && id === null) {
        if (this.checkList.length === 0) {
          return this.$message.error('请选择删除对象')
        }
      }
      this.$confirm('确认删除该物资, 是否继续?', '确定删除', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
      }).then(() => {
        del(type === '批量' ? this.checkList.join(',') : id).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功！')
            this.handleQuery()
          } else {
            this.$message.error(res.msg || '操作失败')
          }
        }).catch(err => {
          this.$message.error('请求出错了：' + err)
        })
      })
    },
    //状态更改
    statusHandle(row) {
      let params = {}
      if (typeof row === 'string') {
        if (this.checkList.length === 0) {
          this.$message.error('批量操作，请先勾选操作物资！')
          return false
        }
        params.id = this.checkList.join(',')
        params.status = row
      } else {
        params.id = row.id
        params.status = row.status ? '0' : '1'
      }
      this.goodsState = params
      this.$confirm('确认更改该物资状态?', '提示', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(() => {
        statusUpdate(this.goodsState).then(res => {
          if (res.code === 200) {
            this.$message.success('物资状态已经更改成功！')
            this.handleQuery()
          } else {
            this.$message.error(res.msg || '操作失败')
          }
        }).catch(err => {
          this.$message.error('请求出错了：' + err)
        })
      })
    },
    //获取商品信息
    getGoods() {

    }
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

.tableLab .span-btn {
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  padding: 0 20px;
  color: #818693;
  border-right: solid 1px #d8dde3;
}

.blueBug {
  color: #419eff !important;
  position: relative;
}

.tableLab .el-button {
  margin-left: 10px;
}


</style>
