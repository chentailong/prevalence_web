<template>
  <div class="app-container">
    <div class="tableBar">
      <div class="tableLab">
        <el-button
          type="warning"
          size="medium"
          @click="handleUpdate('add')">
          + 新增地址
        </el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      stripe
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}">
      <el-table-column
        prop="consignee"
        label="收件人"
        width="120px">
      </el-table-column>
      <el-table-column
        label="性别"
        width="120px">
        <template slot-scope="scope">
          {{ String(scope.row.sex) === '0' ? '女' : '男' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="detail"
        label="详细地址">
      </el-table-column>
      <el-table-column
        label="标签">
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.label }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        width="100px"
        label="默认">
        <template slot-scope="scope">
          {{ String(scope.row.isDefault) === '0' ? '否' : '是' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            size="medium"
            type="text"
            style="margin-right: 5px"
            @click="handleUpdate('update',scope.row)">修改
          </el-button>
          <el-button
            size="medium"
            v-if="scope.row.isDefault === 0"
            type="text"
            style="margin-right: 5px"
            @click="handleUpdateDefault(scope.row)">设为默认
          </el-button>
          <el-button
            size="medium"
            class="delBut non"
            type="text"
            style="margin-right: 5px;color:red;"
            @click="deleteHandle(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :modal-append-to-body="false"
      :title="addressData.title"
      :visible.sync="addressData.dialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form
        class="demo-form-inline"
        label-width="100px">
        <el-form-item label="收件人：">
          <el-input
            v-model="addressData.consignee"
            placeholder="请输入收件人姓名"
            maxlength="14"
          />
        </el-form-item>
        <el-form-item label="性别：">
          <el-radio-group v-model="addressData.sex">
            <el-radio v-model="addressData.sex" label="1">男</el-radio>
            <el-radio v-model="addressData.sex" label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model="addressData.phone" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="详细地址：">
          <el-input v-model="addressData.detail" placeholder="请输入详细地址"/>
        </el-form-item>
        <el-form-item label="标签：">
          <el-button type="primary" plain v-for="(item,index) in labelList" :key="index" @click="label(item)">{{ item }}</el-button>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer">
        <el-button
          size="medium"
          @click="addressData.dialogVisible = false"
        >取 消</el-button>
        <el-button
          type="primary"
          size="medium"
          @click="submitForm()"
        >确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {addressListApi, deleteAddressApi, setDefaultAddressApi, addAddressApi, updateAddressApi} from '@/api/address'

export default {
  data() {
    return {
      tableData: [],
      checkList: [],
      counts: 0,
      goodsState: '',
      action: '',
      addressData: {
        dialogVisible: false,
        detail: '',
        phone: '',
        consignee: '',
        label: '',
        sex: ''
      },
      labelList: [
        '无', '公司', '家庭', '学校'
      ],
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 关闭弹窗
    handleClose() {
      this.addressData.dialogVisible = false
    },
    //新增 || 修改
    handleUpdate(st, row) {
      let data = this.addressData
      if (st === 'add') {
        data.title = '新增地址'
        data.consignee = ""
        data.phone = ""
        data.label = ""
        data.detail = ""
        data.sex = ""
        data.id = ""
        this.action = 'add'
      } else {
        data.title = '修改地址'
        data.consignee = row.consignee
        data.phone = row.phone
        data.label = row.label
        data.detail = row.detail
        data.sex = row.sex
        data.id = row.id
        this.action = 'edit'
      }
      this.addressData.dialogVisible = true
    },
    //默认发送请求，获取地址信息
    init: function () {
      addressListApi().then(res => {
        if (res.code === 200) {
          this.tableData = res.data || []
        } else {
          this.$notify({
            type: 'warning',
            message: res.msg
          })
        }
      })
    },
    //修改默认
    handleUpdateDefault(row) {
      setDefaultAddressApi(row).then(res => {
        if (res.code === 200) {
          this.$notify.success("设置成功")
          this.init()
        } else {
          this.$notify.error("设置失败")
        }
      })
    },
    // 删除
    deleteHandle(id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(() => {
        deleteAddressApi(id).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功！')
            this.init()
          } else {
            this.$notify.error(res.msg || '操作失败')
          }
        })
      })
    },
    //数据提交
    submitForm() {
      const addressData = this.addressData
      if (this.action === 'add') {
        addAddressApi(addressData).then(res => {
          if (res.code === 200) {
            this.$notify.success("新增地址成功")
            this.addressData.dialogVisible = false
            this.init()
          } else {
            this.$notify.error(res.msg)
          }
        })
      } else {
        updateAddressApi(addressData).then(res => {
          if (res.code === 200) {
            this.$notify.success("修改成功")
            this.addressData.dialogVisible = false
            this.init()
          } else {
            this.$notify.error(res.msg)
          }
        })
      }

    },
    //获取标签
    label(name) {
      this.addressData.label = name
    }
  }
}
</script>

<style scoped>
.tableBar {
  margin-bottom: 30px;
}
</style>
