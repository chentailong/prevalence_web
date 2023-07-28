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
        <el-form-item label="住户姓名:"
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
        <el-form-item label="出发地点:"
                      prop="site"
                      class="right">
          <el-cascader
            size="large"
            clearable
            :options="options"
            v-model="selectedOptions"
            @change="handleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址:"
                      prop="plot"
                      class="right">
          <el-input v-model="address"
                    placeholder="详细地址"
                    maxlength="20"
                    clearable/>
        </el-form-item>
      </div>

      <div>
        <el-form-item label="住户小区:"
                      prop="plot"
                      class="right">
          <el-input v-model="ruleForm.plot"
                    placeholder="请输入小区名称"
                    maxlength="20"
                    clearable/>
        </el-form-item>
        <el-form-item label="住户单元:"
                      prop="unit"
                      class="right">
          <el-input v-model="ruleForm.unit"
                    placeholder="请输入住户单元"
                    maxlength="20"/>
        </el-form-item>
      </div>

      <div>
        <el-form-item label="住户房号:"
                      prop="room"
                      class="right">
          <el-input v-model="ruleForm.room"
                    placeholder="请输入住户房号"
                    maxlength="20"
                    clearable/>
        </el-form-item>
        <el-form-item label="身体状况:"
                      prop="health"
                      class="right">
          <el-input v-model="ruleForm.health"
                    placeholder="身体状况"
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
                    width="900px"
                    clearable/>
        </el-form-item>
        <el-form-item label="出发时间:"
                      prop="time"
                      class="right">
          <el-date-picker
            v-model="ruleForm.time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
      </div>

      <div class="subBox">
        <el-form-item>
          <el-button @click="goBack()">
            取消
          </el-button>
          <el-button
            type="warning"
            @click="submitForm()"
          >
            提交
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import {checkName, checkPhone} from "@/utils/validate";
import {regionData, CodeToText} from 'element-china-area-data'
import {save, update} from "@/api/goHome";

export default {
  name: "index",
  data() {
    return {
      title: '住户返乡登记',
      ruleForm: {},
      data: '',
      actionType: '',
      createTime: '',
      options: regionData,
      selectedOptions: [],
      address: '',
    }
  },
  created() {
    this.data = this.$route.params.data
    if (this.data !== undefined) {
      this.ruleForm = this.data
      this.actionType = 'edit'
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
    //返回
    goBack() {
      this.$router.push('/access/goHone')
    },
    //提交数据
    submitForm() {
      this.ruleForm.site += this.address
      if (this.actionType === 'add') {
        if (this.ruleForm === {}) {
          this.$notify.error("请先填写信息")
        } else {
          save(this.ruleForm).then(res => {
            if (res.code === 200) {
              this.$message.success("返乡人员信息登记成功!")
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
            this.$message.success("返乡人员信息修改成功!")
            this.goBack()
          } else {
            this.$message.error(res.msg || "操作失败")
          }
        }).catch(error => {
          this.$message.error('请求出错了:' + error)
        })
      }
    },
    //选择地区
    handleChange(value) {
      let site = []
      site = CodeToText[value[0]] + '' + CodeToText[value[1]] + '' + CodeToText[value[2]]
      this.ruleForm.site = site
    },
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
}

.demo-ruleForm {
  text-align: center;
}

.el-form-item {
  display: -webkit-inline-box;
}

.el-cascader {
  width: 230px;
}

.right {
  margin-right: 5%;
}
</style>
