<template>
  <div class="app-container">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="公告标题" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-col :span="11">
          <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="ruleForm.date1"
                          style="width: 100%;">
          </el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker v-model="ruleForm.date2" value-format="HH:mm:ss" style="width: 100%;"
                          placeholder="选择时间"></el-time-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="公告内容" prop="content">
        <el-input type="textarea" v-model="ruleForm.content"></el-input>
      </el-form-item>

      <el-form-item
        label="内容图片:"
        prop="region"
        class="uploadImg"
      >
        <el-upload
          class="avatar-uploader"
          action="/common/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-change="onChange"
          ref="upload">
          <img
            v-if="imageUrl"
            :src="imageUrl"
            class="avatar" alt="上传图片">
          <i
            v-else
            class="el-icon-plus avatar-uploader-icon"
          ></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button @click="goBack()">
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
        <el-button @click="resetForm('ruleForm')"
                   v-if="actionType === 'add'"
                   type="danger">重置
        </el-button>
        <el-button @click="deleteNotice(ruleForm)"
                   type="danger"
                   v-if="userInfo.username === 'admin' && actionType === 'edit'"
        >删除该公告
        </el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import {save, update, del} from "@/api/notice"

export default {
  data() {
    return {
      id: '',
      data: '',
      userInfo: {},
      ruleForm: {
        title: '',
        date1: '',
        date2: '',
        createTime: '',
        content: '',
        creator: '',
        image: ''
      },
      imageUrl: '',
      actionType: '',
      rules: {
        title: [{required: true, message: '请输入公告标题', trigger: 'blur'},
          {min: 3, message: '长度在 3 到 5 个字符', trigger: 'blur'}],
        date1: [{type: 'date', required: true, message: '请选择日期', trigger: 'change'}],
        date2: [{type: 'date', required: true, message: '请选择时间', trigger: 'change'}],
        content: [{required: true, message: '请填写公告内容', trigger: 'blur'}]
      }
    }
  },
  methods: {
    //提交数据
    submitForm(formName, st) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 新增公告
          if (_this.actionType === 'add') {
            _this.ruleForm.creator = _this.userInfo.name
            _this.ruleForm.createTime = _this.ruleForm.date1 + " " + _this.ruleForm.date2
            save(_this.ruleForm).then(res => {
              //TODO:  出现创建时间Bug   但是不是什么时候都出现
              if (res.code === 200) {
                _this.$message.success('公告新增成功！')
                if (!st) {
                  _this.goBack()
                } else {
                  _this.ruleForm = {}
                }
              } else {
                _this.$message.error(res.msg || '操作失败')
              }
            }).catch(err => {
              _this.$message.error('请求出错了：' + err)
            })
            //  编辑公告
          } else {
            update(_this.ruleForm).then(res => {
              if (res.code === 200) {
                _this.$message.success('公告修改成功！')
                _this.goBack()
              } else {
                this.$message.error(res.msg || '操作失败')
              }
            }).catch(err => {
              _this.$message.error('请求出错了：' + err)
            })
          }
        } else {
          return false;
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //删除公告信息
    deleteNotice(ruleForm) {
      this.$confirm('删除该公告后不可修复,请确认是否删除?', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'confirmButtonClass': 'confirmButton',
        'type': 'error'
      }).then(() => {
        del(ruleForm.id).then(res => {
          if (res.code === 200) {
            this.$message.success('删除公告成功')
            this.goBack()
          }
        }).catch(error => {
          this.$message.error('请求出错了：' + error)
        })
      })
    },
    //返回
    goBack() {
      this.$router.push('notice')
    },
    handleAvatarSuccess(response, file, fileList) {
      this.imageUrl = `/common/download?name=${response.data}`
      this.ruleForm.image = response.data
    },

    onChange(file) {
      if (file) {
        const suffix = file.name.split('.')[1]
        const size = file.size / 1024 / 1024 < 2
        if (['png', 'jpeg', 'jpg'].indexOf(suffix) < 0) {
          this.$message.error('上传图片只支持 png、jpeg、jpg 格式！')
          this.$refs.upload.clearFiles()
          return false
        }
        if (!size) {
          this.$message.error('上传文件大小不能超过 2MB!')
          return false
        }
        return file
      }
    },
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.id = this.$route.params.id
    this.data = this.$route.params.data
    if (this.data !== undefined) {
      this.ruleForm = this.data
      this.actionType = 'edit'
      this.ruleForm.date1 = this.data.createTime
      this.ruleForm.date2 = this.data.createTime.split(' ')[1]
      this.imageUrl = "/common/download?name=" + this.data.image
    } else {
      this.actionType = 'add'
    }
  },
}
</script>
<style>
.line {
  text-align: center;
}

.confirmButton {
  background: red !important;
  border-color: red !important;
}

.app-container .avatar {
  width: 160px;
  height: 160px;
  display: block;
}

.app-container .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  line-height: 160px;
  position: relative;
  width: 160px;
  height: 160px;
  overflow: hidden;
}
</style>
