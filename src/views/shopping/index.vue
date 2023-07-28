<template>
  <div class="app-container">
    <div class="tableBar">
      <el-input
        v-model="input"
        placeholder="请输入您需要搜索的物资名称"
        style="width: 250px;margin-left: 20px;"
        clearable
        @keyup.enter.native="handleQuery">
        <i slot="prefix"
           class="el-input__icon el-icon-search"
           style="cursor: pointer"
           @click="handleQuery"></i>
      </el-input>
    </div>
    <el-row>
      <el-col :span="8" v-for="(value, index) in shoppingList" :key="index" class="shopping">
        <el-card class="shopping" shadow="hover">
          <el-image :src="getImage(value.image)"
                    class="image">
          </el-image>
          <div style="padding: 14px 3px;line-height: 40px">
            <span style="font-size: 15px">{{ value.name }}</span>
            <span class="price">￥{{ value.price }}</span>
            <el-button type="danger" style="float: right;font-size: 1px" @click="addShoppingCart(value)">+加入购物车</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {list} from '@/api/goods'
import {addCart} from '@/api/shopping'

export default {
  data() {
    return {
      shoppingList: {},
      input: '',

    }
  },
  created() {
    this.getShoppingList()
  },
  methods: {
    //获取商品信息
    getShoppingList() {
      list().then(res => {
        if (res.code === 200) {
          this.shoppingList = res.data
        } else {
          this.$message.error("操作失败")
        }
      }).catch(error => {
        this.$message.error("操作失败" + error)
      })
    },
    //加入购物车
    addShoppingCart(res) {
      let data = {
        name: res.name,
        image: res.image,
        matterId: res.id,
        number: 1,
        price: res.price
      }
      addCart(data).then(res => {
        if (res.code === 200) {
          this.$message.success("添加购物车成功")
        } else {
          this.$message.error("添加购物车失败")
        }
      }).catch(error => {
        this.$message.error("操作失败" + error)
      })
    },

    //获取图片
    getImage(image) {
      return `/common/download?name=${image}`
    },
    //默认搜索第一页
    handleQuery() {
      this.page = 1;
      this.init();
    },
  }
}
</script>

<style scoped>

.shopping {
  width: 300px;
  height: 350px;
  margin: 10px;
}

.price {
  color: red;
  font-size: 15px;
}

.image {
  width: 251px;
  display: block;
  margin: 0 auto;
  height: 251px;
}

</style>
