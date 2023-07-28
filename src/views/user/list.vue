<template>
  <div class="app-container">
    <div class="resident_title">{{ title }}</div>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      :inline="false"
      class="demo-ruleForm">

      <div>
        <el-form-item label="住户账号:"
                      prop="username"
                      class="right">
          <el-input v-model="ruleForm.username"
                    placeholder="请输入账号"
                    maxlength="20"
                    clearable/>
        </el-form-item>

        <el-form-item label="住户姓名:"
                      prop="name"
                      class="right">
          <el-input v-model="ruleForm.name"
                    placeholder="请输入住户姓名"
                    maxlength="20"/>
        </el-form-item>
      </div>


      <div>
        <el-form-item label="住户电话:"
                      prop="phone"
                      class="right">
          <el-input v-model="ruleForm.phone"
                    placeholder="请输入手机号"
                    maxlength="20"/>
        </el-form-item>

        <el-form-item label="身份证号:"
                      prop="idNumber"
                      class="right">
          <el-input v-model="ruleForm.idNumber"
                    placeholder="请输入身份证号"
                    maxlength="18"/>
        </el-form-item>
      </div>

      <div>
        <el-form-item label="住户等级:"
                      prop="level"
                      class="right"
                      v-if="userInfo.level === 1 || userInfo.level === 0">
          <el-input v-model="ruleForm.level"
                    placeholder="请输入住户等级"
                    maxlength="1"/>
        </el-form-item>
        <el-form-item label="住户等级:"
                      prop="level"
                      class="right"
                      v-if="userInfo.level === 2">
          <el-input v-model="ruleForm.level"
                    disabled
                    maxlength="1"/>
        </el-form-item>
        <el-form-item label="住户邮箱:"
                      prop="email"
                      class="right">
          <el-input v-model="ruleForm.email"
                    placeholder="请输入住户邮箱"/>
        </el-form-item>
      </div>

      <div>
        <el-form-item label="住户小区:"
                      class="right"
                      prop="community">
          <el-input v-model="ruleForm.community"
                    placeholder="请输入住户小区"
                    maxlength="20"/>
        </el-form-item>

        <el-form-item label="家庭人数:"
                      prop="number"
                      class="right">
          <el-input v-model="ruleForm.number"
                    placeholder="请输入家庭人数"
                    maxlength="2"/>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="住户房号:"
                      class="right"
                      prop="room">
          <el-input v-model="ruleForm.room"
                    placeholder="请输入住户房号"
                    maxlength="20"/>
        </el-form-item>

        <el-form-item label="住户楼号:"
                      prop="floor"
                      class="right">
          <el-input v-model="ruleForm.floor"
                    placeholder="请输入住户楼号"
                    maxlength="20"/>
        </el-form-item>
      </div>

      <div>
        <el-form-item label="备注信息:"
                      class="right"
                      prop="remark">
          <el-input v-model="ruleForm.remark"
                    placeholder="请输入备注信息"/>
        </el-form-item>

        <el-form-item label="住户性别:"
                      prop="sex"
                      class="right">
          <div style="width: 230px; display: inline-flex; margin-right: 5%;">
            <el-radio v-model="ruleForm.sex" label="0">男</el-radio>
            <el-radio v-model="ruleForm.sex" label="1">女</el-radio>
          </div>
        </el-form-item>
      </div>

      <div class="subBox address">
        <el-form-item>
          <el-button @click="goBack()" v-if="userInfo.level !== 2">
            取消
          </el-button>
          <el-button
            type="warning"
            @click="submitForm('ruleForm', false)"
          >
            保存
          </el-button>
          <el-button
            v-if="actionType === 'add'"
            type="warning"
            class="continue"
            @click="submitForm('ruleForm', true)"
          >
            保存并继续添加
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import {checkUserName, checkName, checkPhone, validID} from '@/utils/validate'
import {editUser, addUser, userInfo} from '@/api/user'

export default {
  name: "list",
  data() {
    return {
      title: '',
      id: '',
      data: '',
      actionType: '',
      ruleForm: {},
      userInfo: {},
      roles: '',
    }
  },
  computed: {
    rules() {
      return {
        'username': [{'validator': checkUserName, trigger: 'blur'}],
        'name': [{'validator': checkName, 'trigger': 'blur'}],
        'phone': [{'validator': checkPhone, 'trigger': 'blur'}],
        'idNumber': [{'validator': validID, 'trigger': 'blur'}]
      }
    }
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.id = this.$route.params.id
    this.data = this.$route.params.data
    if (this.data !== undefined) {
      this.ruleForm = this.data
      this.actionType = 'edit'
      this.title = '编辑用户信息'
    } else {
      this.actionType = 'add'
      this.title = '新增用户信息'
    }
    if (this.userInfo.level === 2) {
      this.roles = 'user'
      this.actionType = 'edit'
      this.title = '编辑本人信息'
      this.getUserInfo()
      this.ruleForm = this.userInfo
    }
  },
  mounted() {
  },
  methods: {
    //返回
    goBack() {
      if (this.roles === 'user') {
        this.$router.push('list')
      } else {
        this.$router.push('user')
      }
    },
    getUserInfo() {
      userInfo(this.userInfo.id).then(res => {
        if (res.code === 200) {
          this.ruleForm = res.data
        } else {
          this.$notify.error(res.msg)
        }
      })
    },
    //添加或编辑
    submitForm(formName, st) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.actionType === 'add') {
            const params = {
              ...this.ruleForm,
              sex: this.ruleForm.sex === '女' ? '1' : '0'
            }
            if ( this.ruleForm.community === undefined || this.ruleForm.number === undefined ||
              this.ruleForm.room === undefined || this.ruleForm.floor === undefined) {
              this.$notify.error("请输入完成信息！")
              return
            }
            addUser(params).then(res => {
              if (res.code === 200) {
                this.$message.success('用户信息添加成功!')
                if (!st) {
                  this.goBack()
                } else {
                  this.ruleForm = {}
                }
              } else {
                this.$message.error(res.msg || '操作失败')
              }
            }).catch(err => {
              this.$message.error('请求出错了：' + err)
            })
          } else {
            const params = {
              ...this.ruleForm,
              sex: this.ruleForm.sex === '女' ? '1' : '0'
            }
            editUser(params).then(res => {
              if (res.code === 200) {
                this.$message.success('用户信息修改成功！')
                this.goBack()
              } else {
                this.$message.error(res.msg || '操作失败')
              }
            }).catch(err => {
              this.$message.error('请求出错了：' + err)
            })
          }
        } else {
          this.$notify.error("请输入完成信息！")
          return false
        }
      })
    },
  }
}
</script>

<style scoped>

.resident_title {
  font-size: 24px;
  margin: 20px;
  font-family: 楷体;
  text-align: center;
}

.app-container .el-input {
  width: 230px !important;

}

.demo-ruleForm {
  text-align: center;
}

.el-form-item {
  display: -webkit-inline-box;
}

.right {
  margin-right: 5%;
}

</style>
