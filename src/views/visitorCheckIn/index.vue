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
        <el-form-item label="访客姓名:"
                      prop="name"
                      class="right">
          <el-input v-model="ruleForm.name"
                    placeholder="请输入姓名"
                    maxlength="20"
                    clearable/>
        </el-form-item>
        <el-form-item label="联系方式:"
                      prop="phone"
                      class="right">
          <el-input v-model="ruleForm.phone"
                    placeholder="请输入电话"
                    maxlength="20"/>
        </el-form-item>
      </div>

      <div>
        <el-form-item label="受访小区:"
                      prop="plot"
                      class="right">
          <el-input v-model="ruleForm.plot"
                    placeholder="请输入小区名称"
                    maxlength="20"
                    clearable/>
        </el-form-item>
        <el-form-item label="受访对象:"
                      prop="who"
                      class="right">
          <el-input v-model="ruleForm.who"
                    placeholder="请输入受访对象"
                    maxlength="20"/>
        </el-form-item>
      </div>

      <div>
        <el-form-item label="访问目的:"
                      prop="goal"
                      class="right">
          <el-input v-model="ruleForm.goal"
                    placeholder="请输入访问目的"
                    maxlength="20"
                    clearable/>
        </el-form-item>
        <el-form-item label="访问单元:"
                      prop="unit"
                      class="right">
          <el-input v-model="ruleForm.unit"
                    placeholder="请输入单元号"
                    maxlength="20"/>
        </el-form-item>
      </div>

      <div>
        <el-form-item label="备注信息:"
                      prop="remark"
                      class="right">
          <el-input v-model="ruleForm.remark"
                    placeholder="备注"
                    maxlength="20"
                    clearable/>
        </el-form-item>
        <el-form-item label="进出类型:"
                      prop="type"
                      class="right">
          <div style="width: 230px; display: inline-flex; margin-right: 5%;">
            <el-radio v-model="ruleForm.type" label="0">进</el-radio>
            <el-radio v-model="ruleForm.type" label="1">出</el-radio>
          </div>
        </el-form-item>
      </div>

      <div class="subBox">
        <el-form-item>
          <el-button @click="goBack()">
            取消
          </el-button>
          <el-button
            type="warning"
            @click="submitForm('ruleForm')">
            提交
          </el-button>
        </el-form-item>
      </div>

    </el-form>
  </div>
</template>

<script>
import {checkName, checkPhone} from "@/utils/validate";
import {save, update} from '@/api/visitor'

export default {
  name: "index",
  data() {
    return {
      title: '访客出入登记',
      data: '',
      actionType: '',
      ruleForm: {}
    }
  },
  created() {
    this.data = this.$route.params.data
    if (this.data !== undefined) {
      this.ruleForm = this.data
      this.actionType = 'edit'
      if (this.ruleForm.type === 0) {
        this.ruleForm.type = '0'
      } else {
        this.ruleForm.type = '1'
      }
    } else {
      this.actionType = 'add'
    }
  },
  computed: {
    rules() {
      return {
        'name': [{'validator': checkName, 'trigger': 'blur'}],
        'phone': [{'validator': checkPhone, 'trigger': 'blur'}],
      }
    }
  },
  methods: {
    goBack() {
      this.$router.push('/access/visitor')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.actionType === 'add') {
            if (this.ruleForm === null || this.ruleForm === {}) {
              this.$notify.error("请先填写信息")
            } else {
              save(this.ruleForm).then(res => {
                console.log(res)
                if (res.code === 200) {
                  this.$message.success("访客登记成功!")
                  this.goBack()
                } else {
                  this.$message.error(res.msg || "操作失败")
                }
              }).catch(error => {
                this.$message.error('请求出错了:' + error)
              })
            }
          } else {
            update(this.ruleForm).then(res => {
              if (res.code === 200) {
                this.$message.success('访客信息修改成功！')
                this.goBack()
              } else {
                this.$message.error(res.msg || '操作失败')
              }
            }).catch(err => {
              this.$message.error('请求出错了：' + err)
            })
          }
        }
      })
    }
  },
}
</script>

<style scoped>

.resident_title {
  font-size: 24px;
  margin: 20px;
  font-family: 楷体, serif;
  text-align: center;
}

.app-container .el-input {
  width: 230px !important;
  margin-right: 5%;
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
