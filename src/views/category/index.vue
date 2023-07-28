<template>
  <div class="app-container">
    <div class="tableBar">
      <div class="tableLab">
        <el-button
          type="warning"
          size="medium"
          @click="handleUpdate('add')">
          + 新增分类
        </el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      stripe
      @selection-change="handleSelectionChange">
      <el-table-column
        prop="name"
        label="分类名称">
      </el-table-column>
        <el-table-column
          label="分类类型">
          <template slot-scope="scope">
            {{ String(scope.row.type) === '1' ? '普通类型' : '未知' }}
          </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="操作时间">
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序">
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="290px" align="center">
        <template slot-scope="scope">
          <el-button
            size="medium"
            type="text"
            style="margin-right: 5px"
            @click="handleUpdate('update',scope.row)">修改
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
      @current-change="handleCurrentChange">
    </el-pagination>

    <el-dialog
      :modal-append-to-body="false"
      :title="classData.title"
      :visible.sync="classData.dialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form
        class="demo-form-inline"
        label-width="100px">
        <el-form-item label="分类名称：">
          <el-input
            v-model="classData.name"
            placeholder="请输入分类名称"
            maxlength="14"
          />
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="classData.sort" type="number" placeholder="请输入排序"/>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer">
        <el-button
          size="medium"
          @click="classData.dialogVisible = false"
        >取 消</el-button>
        <el-button
          type="primary"
          size="medium"
          @click="submitForm()"
        >确 定</el-button>
        <el-button
          v-if="action !== 'edit'"
          type="warning"
          size="medium"
          class="continue"
          @click="submitForm('go')"
        > 保存并继续添加 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {page, save, update, del} from '@/api/category'

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
      action: '',
      classData: {
        'title': '添加物资分类',
        'dialogVisible': false,
        'categoryId': '',
        'name': '',
        sort: ''
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 关闭弹窗
    handleClose(st) {
      this.classData.dialogVisible = false
    },

    //新增 || 修改
    handleUpdate(st, row) {
      if (st === 'add') {
        this.classData.title = '新增分类'
        this.classData.name = ''
        this.classData.sort = ''
        this.action = 'add'
      } else {
        this.classData.title = '修改分类'
        this.action = 'edit'
        this.classData.name = row.name
        this.classData.sort = row.sort
        this.classData.id = row.id
      }
      this.classData.dialogVisible = true
    },
    //多选
    handleSelectionChange(val) {
      let checkArr = []
      val.forEach((n) => {
        checkArr.push(n.id)
      })
      this.checkList = checkArr
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
        pageSize: this.pageSize
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
    deleteHandle(id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(() => {
        del(id).then(res => {
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
    //数据提交
    submitForm(st) {
      const classData = this.classData
      const valid = (classData.name === 0 || classData.name) && (classData.sort === 0 || classData.sort)
      if (this.action === 'add') {
        if (valid) {
          const reg = /^\d+$/
          if (reg.test(classData.sort)) {
            save({'name': classData.name, 'type': this.type, sort: classData.sort}).then(res => {
              console.log(res)
              if (res.code === 200) {
                this.$message.success('分类添加成功！')
                if (!st) {
                  this.classData.dialogVisible = false
                } else {
                  this.classData.name = ''
                  this.classData.sort = ''
                }
                this.handleQuery()
              } else {
                this.$message.error(res.msg || '操作失败')
              }
            }).catch(err => {
              this.$message.error('请求出错了：' + err)
            })
          } else {
            this.$message.error('排序只能输入数字类型')
          }

        } else {
          this.$message.error('请输入分类名称或排序')
        }
      } else if (valid) {
        const reg = /^\d+$/
        if (reg.test(this.classData.sort)) {
          update({
            'id': this.classData.id,
            'name': this.classData.name,
            sort: this.classData.sort
          }).then(res => {
            if (res.code === 200) {
              this.$message.success('分类修改成功！')
              this.classData.dialogVisible = false
              this.handleQuery()
            } else {
              this.$message.error(res.msg || '操作失败')
            }
          }).catch(err => {
            this.$message.error('请求出错了：' + err)
          })
        } else {
          this.$message.error('排序只能输入数字类型')
        }
      } else {
        this.$message.error('请输入分类名称或排序')
      }
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
  float: left;
}

.tableLab .el-button {
  margin-left: 10px;
  margin-bottom: 20px;
}

</style>
