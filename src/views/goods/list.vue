<template>
  <div class="app-container">
    <div class="container">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        :inline="true"
        label-width="180px"
        class="demo-ruleForm"
      >
        <div class="one">
          <el-form-item
            label="物资名称:"
            prop="name"
          >
            <el-input
              v-model="ruleForm.name"
              placeholder="请填写物资名称"
              maxlength="20"
            />
          </el-form-item>
          <el-form-item
            label="物资分类:"
            prop="categoryId"
          >
            <el-select
              v-model="ruleForm.categoryId"
              placeholder="请选择物资分类"
            >
              <el-option v-for="(item,index) in CategoryList" :key="index" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
        </div>

        <div>
          <el-form-item
            label="物资价格:"
            prop="price"
          >
            <el-input
              v-model="ruleForm.price"
              placeholder="请设置物资价格"
            />
          </el-form-item>
        </div>
        <div>
        </div>
        <div class="image">
          <el-form-item
            label="物资图片:"
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
                class="avatar" alt="物资图片">
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              ></i>
            </el-upload>
          </el-form-item>
        </div>
        <div class="address">
          <el-form-item
            label="物资描述:"
            prop="region"
          >
            <el-input
              v-model="ruleForm.description"
              type="textarea"
              :rows="3"
              placeholder="物资描述，最长200字"
              maxlength="200"
            />
          </el-form-item>
        </div>
        <div class="subBox address">
          <el-form-item>
            <el-button @click="goBack()">
              取消
            </el-button>
            <el-button
              type="warning"
              @click="submitForm('ruleForm')"
            >
              保存
            </el-button>
            <el-button
              v-if="actionType === 'add'"
              type="warning"
              class="continue"
              @click="submitForm('ruleForm','goAnd')"
            >
              保存并继续添加物资
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import {save, edit} from '@/api/goods'
import {list} from '@/api/category'

export default {
  data() {
    return {
      id: '',
      textarea: '',
      value: '',
      imageUrl: '',
      actionType: '',
      CategoryList: [],
      data: '',
      index: 0,
      ruleForm: {
        'name': '',
        'price': '',
        'image': '',
        'description': '',
        categoryId: ''
      },
    }
  },
  computed: {
    //信息判断
    rules() {
      return {
        'name': [{'required': true, 'message': '请填写物资名称', 'trigger': 'blur'}],
        'price': [{
          'required': true,
          validator: (rules, value, callback) => {
            if (!value) {
              callback(new Error('请填写物资价格'))
            } else {
              const reg = /^\d+(\.\d{0,2})?$/
              if (reg.test(value)) {
                if (value < 10000) {
                  callback()
                } else {
                  callback(new Error('物资价格小于10000'))
                }
              } else {
                callback(new Error('物资价格格式只能为数字,且最多保留两位小数'))
              }
            }
          },
          'trigger': 'blur'
        }
        ],
      }
    }
  },
  created() {
    this.getCategoryList()
    this.id = this.$route.params.id
    this.data = this.$route.params.data
    if (this.data !== undefined) {
      this.ruleForm = this.data
      this.imageUrl = `/common/download?name=${this.data.image}`
      this.actionType = 'edit'
    } else {
      this.actionType = 'add'
    }
  },
  methods: {
    submitForm(formName, st) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.imageUrl) {
            this.$message.error('请上传物资图片')
            return
          }
          if (this.actionType === 'add') {
            console.log(this.ruleForm)
            save(this.ruleForm).then(res => {
              if (res.code === 200) {
                this.$message.success('物资添加成功！')
                if (!st) {
                  this.goBack()
                } else {
                  this.imageUrl = ''
                  this.ruleForm = {}
                }
              } else {
                this.$message.error(res.msg || '操作失败')
              }
            }).catch(error => {
              this.$message.error('请求出错了：' + error)
            })
          } else {
            edit(this.ruleForm).then(res => {
              if (res.code === 200) {
                this.$message.success('物资修改成功！')
                this.goBack()
              } else {
                this.$message.error(res.msg || '操作失败')
              }
            }).catch(err => {
              this.$message.error('请求出错了：' + err)
            })
          }
        } else {
          return false
        }
      })
    },
    handleAvatarSuccess(response, file, fileList) {
      this.imageUrl = `/common/download?name=${response.data}`
      console.log(this.imageUrl)
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

    getCategoryList() {
      list({'type': 1}).then(res => {
        if (res.code === 200) {
          this.CategoryList = res.data
        } else {
          this.$message.error(res.msg || '操作失败')
        }
      })
    },
    goBack() {
      this.$router.push('/goods/goods')
    }
  }
}
</script>

<style scoped>

.image .uploadImg .avatar-uploader {
  border: dashed 2px #d8dde3 !important;
  border-radius: 4px !important;
  background: #fcfcfc;
}

.image .uploadImg avatar-uploader .el-icon-plus:before {
  content: "上传图片" !important;
  font-size: 12px;
  color: #000;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 160px;
  height: 160px;
  line-height: 160px;
  text-align: center;
}

.avatar {
  width: 160px;
  height: 160px;
  display: block;
}

.el-input {
  width: 300px;
}

.el-select {
  width: 300px;
}

.el-textarea {
  width: 800px;
}

.subBox {
  text-align: center;
}


</style>
