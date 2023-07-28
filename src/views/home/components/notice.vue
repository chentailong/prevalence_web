<template>
  <el-col>
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <span>社区公告</span>
      </div>
      <div v-for="(value,index) in notice" :key="index" class="notice" @click="details(value)">
        <span class="title"> {{ value.title }}</span>
        <span class="time">{{ value.updateTime }}</span>
        <p class="content">{{ value.content }}</p>
      </div>
    </el-card>
  </el-col>
</template>

<script>
import {noticeList} from '@/api/home'

export default {
  data() {
    return {
      notice: {}
    }
  },
  created() {
    this.getNoticeList()
  },
  methods: {
    getNoticeList() {
      noticeList().then(res => {
        this.notice = res.data
        console.log(res)
      })
    },
    details(res) {
      this.$router.push({
        name: "Details",
        params: res
      })
    },
  }
}
</script>

<style scoped>
.notice {
  border: #bd962f 1px solid;
  margin-bottom: 20px;
  border-radius: 10px;
  padding: 10px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.title {
  font-size: 22px;
}

.time {
  font-size: 16px;
  color: #494444;
  float: right;
  margin: 4px;
}

.content {
  /*text-indent: 2em;*/
  font-family: 宋体, serif;
  letter-spacing: 2px;
}


</style>
