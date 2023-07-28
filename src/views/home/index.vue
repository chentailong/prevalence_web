<template>
  <div class="home-container">

    <div class="welcome">尊敬的 {{ userInfo.name }},您好！欢迎使用本社区疫情防控管理系统</div>

    <panel-group v-if="userInfo.level=== 1 || userInfo.level === 0"
                 @handleSetLineChartData="handleSetLineChartData"/>

    <el-row :gutter="24">
    <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}"
            style="padding-right: 12px;margin-bottom:30px;">
      <transaction-table v-if="userInfo.level=== 1 ||  userInfo.level === 0"/>
      <user-order v-if="userInfo.level=== 2"/>

    </el-col>

      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}"
              style="margin-bottom:30px" v-if="userInfo.level=== 1 || userInfo.level === 2|| userInfo.level === 0 ">
        <announcement/>
      </el-col>
    </el-row>

    <a @click="$router.push('/checkIn/visitorCheckIn')"
       v-if="userInfo.level === 3"
       style="color:#87ac6f;"
    >登记请前往访客出入登记页面</a>

  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import TransactionTable from './components/order'
import Announcement from "@/views/home/components/notice";
import UserOrder from './components/userOrder'

export default {
  name: 'Home',
  computed: {},
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  },
  data() {
    return {
      userInfo: {},
    }
  },
  components: {
    Announcement,
    PanelGroup,
    TransactionTable,
    UserOrder
  },
  methods: {
    handleSetLineChartData(type) {

    }
  }

}
</script>

<style lang="scss" scoped>

.welcome {
  font-size: 20px;
  margin-top: 20px;
  margin-left: 20px;
  margin-bottom: 50px;
}

.home-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
