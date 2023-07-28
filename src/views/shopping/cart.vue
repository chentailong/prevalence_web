<template>
  <div>
    <div class="app-container">
      <div class="cart-head">
        <i class="el-icon-shopping-cart-2 icon-cart"></i>
        <span class="my-cart">我的购物车</span>
        <span class="hint">温馨提示：产品是否购买成功以最终下单为准哦，请尽快结算</span>
        <el-button type="warning"
                   v-if="select !== 0"
                   style="float: right;margin-left: 20px;"
                   @click="deleteHandle('批量', null)">批量删除
        </el-button>
        <el-button type="text"
                   style="color:red; float: right"
                   @click="deleteHandle('清空', null)">清空购物车
        </el-button>
        <el-divider/>
      </div>
      <el-table
        stripe
        ref="multipleTable"
        :data="tableData"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          align="center">
          <template slot-scope="{ row }">
            <el-image style="width: 50px; height: 50px; border:none;cursor: pointer;"
                      :src="getImage(row.image)">
              <div slot="error" class="image-slot">
                <img src="../../assets/noImg.png" style="width: auto; height: 40px; border:none;" alt="加载失败">
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop='price'
          label="单价">
        </el-table-column>
        <el-table-column
          label="数量">
          <template slot-scope="{ row }">
            <el-input-number v-model="row.number" @change="handleChange(row)" :min="1" :max="100"/>
          </template>

        </el-table-column>
        <el-table-column
          label="小计">
          <template slot-scope="{ row }">
            <span style="color:red;">{{ (row.subtotal.toFixed(2)) }} 元</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="medium"
              class="delBut non"
              type="danger"
              style="margin-right: 5px;color:white;"
              @click="deleteHandle('单删',scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="balance">
      <el-button type="text" style="color: gray;margin-left: 20px" @click="shopping()">继续购物</el-button>
      <span style="color: #c8bbbb; margin-left: 30px;"> | </span>
      <span style="margin-left: 30px;color: gray;">共
        <span style="color: red">{{ tableData.length }}</span> 件商品, 已选择
        <span style="color:red;">{{ select }}</span> 件</span>

      <div style="display: inline-block;float: right">
        <span style="color:gray;margin-right: 20px;line-height: 40px">合计：<span
          style="color:red;font-size: 20px">{{ (total).toFixed(2) }} 元</span></span>
        <el-button type="danger" class="submit" :disabled="state" @click="goAccounts()">去结算</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {list, updateCart, clean, del} from "@/api/shopping"

export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      hasSelectList: [],
      checkList: [],
      select: 0,
      state: true,
      subtotal: 0,
      total: 0,
    }
  },
  created() {

  },
  methods: {
    getShoppCart() {
      list().then(res => {
        if (res.code === 200) {
          this.tableData = res.data
          this.toggleSelection(this.tableData)
        } else {
          this.$message.error("查询失败")
        }
      }).catch(error => {
        this.$message.error("操作失败" + error)
      })
    },
    //计算价格
    calculate() {
      let data = this.multipleSelection
      this.select = data.length
      this.state = data.length === 0;
      if (data.length !== 0) {
        for (var i = 0; i < data.length; i++) {
          this.subtotal += data[i].subtotal
        }
        this.total = this.subtotal
        this.subtotal = 0
      } else {
        this.total = 0
      }
    },
    goAccounts() {
      let params = this.multipleSelection
      this.$router.push({
        name: "Particulars",
        params: {data: params}
      })
    },
    //删除记录
    deleteHandle(st, id) {
      if (st === '清空') {
        clean().then(res => {
          if (res.code === 200) {
            this.getShoppCart()
          } else {
            this.$message.error("操作失败")
          }
        }).catch(error => {
          this.$message.error(error)
        })
      } else {
        del(st === '批量' ? this.checkList.join(',') : id).then(res => {
          if (res.code === 200) {
            this.getShoppCart()
          } else {
            this.$message.error("操作失败")
          }
        }).catch(error => {
          this.$message.error(error)
        })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      let checkArr = []
      val.forEach((n) => {
        checkArr.push(n.id)
      })
      this.checkList = checkArr
      this.calculate()
    },
    getImage(image) {
      return `/common/download?name=${image}`
    },
    //加减数量时显示更改的值
    handleChange(row) {
      updateCart(row).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
        } else {
          this.$message.error("新增商品失败")
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    //返回购物
    shopping() {
      this.$router.push({
        name: "Shopping"
      })
    },
    //默认选中所有选项
    toggleSelection() {
      this.$nextTick(()=>{
        this.tableData.forEach(row=>{
          this.tableData.forEach(selected =>{
            if(selected.id === row.id){
              this.$refs.multipleTable.toggleRowSelection(row,true);
            }
          })
        })
      })
    },
  },
  mounted() {
    this.getShoppCart()

  },
}
</script>

<style scoped>
.icon-cart {
  font-size: 30px;
  color: red;
}

.my-cart {
  font-size: 30px;
  margin-left: 10px;
  font-family: 宋体, serif;
}

.hint {
  font-size: 10px;
  margin-left: 10px;
  color: gray;
  font-family: 新宋体, serif;
}

.el-image img {
  width: 50px !important;
  height: 50px !important;
}

.el-input-number {
  width: 130px;
}

.balance {
  float: bottom;
  padding: 20px;
  position: relative;
  z-index: 1;
  background: #fff;
  margin: 30px;
  border-radius: 4px;
}

.submit {
  float: right;
}

</style>
