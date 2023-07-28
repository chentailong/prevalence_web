<template>
  <div class="app-container">
    <el-card>
      <el-button type="primary" plain @click="goReturn()" style="margin-left: 14px">返回首页</el-button>
      <div style="padding: 14px;">
        <h2>{{ data.title }}</h2>
        <div class="bottom clearfix">
          <time class="time">{{ data.updateTime }}</time>
          <el-button type="text" class="next">下一章</el-button>
        </div>
        <div class="content">{{ data.content }}</div>
      </div>
      <div class="demo-image__placeholder">
        <div class="block">
          <el-image :src="getImage(data.image)"
                    :preview-src-list="[`/common/download?name=${data.image}` ]">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {
        updateTime: "",
      },
      src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    }
  },
  created() {
    this.data = this.$route.params
    console.log(this.data)
  },
  methods: {
    getImage(image) {
      return `/common/download?name=${image}`
    },
    goReturn() {
      this.$router.push({name: 'Home'})
    },
  }
}
</script>

<style scoped>
.demo-image__error .block, .demo-image__placeholder .block {
  width: 49%;
}

.demo-image__error .el-image, .demo-image__placeholder .el-image {
  width: 500px;
  height: 300px;
}

.demo-image .block, .demo-image__error .block, .demo-image__placeholder .block {
  padding: 10px 0;
  text-align: center;
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
  vertical-align: top;
}

.bottom {
  line-height: 40px;
}

.content {
  letter-spacing: 2px;
}

.time {
  font-size: 15px;
}

.next {
  float: right;
  font-size: 15px;
}
</style>
