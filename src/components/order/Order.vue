<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="query"
            clearable
            @clear="getorderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getorderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- table表格区 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="95px"
        ></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="140px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          prop="is_send"
          width="70px"
        ></el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="200px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template >
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showBox"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-s-flag"
              size="mini"
              @click="showProgressBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <Page url="orders" @return="getPage" ref="page" :query="query"></Page>
    </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <!-- 表单部分 -->
      <el-form
        :model="addressForm"
        :rules="addressFormrules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editdialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 展示物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="goodsdialogVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline >
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import Page from "@/components/Page";
import cityData from "./citydata.js";
export default {
  components: {
    Page,
  },
  data() {
    return {
      orderlist: [],
      query: "",
      editdialogVisible: false,
      addressForm: {},
      address1: [],
      address2: "",
      addressFormrules: {
        address1: [
          {
            required: true,
            message: "请选择省市区县",
            trigger: "blur",
          },
        ],
        address2: [
          {
            required: true,
            message: "请填写详细地址",
            trigger: "blur",
          },
        ],
      },
      cityData,
      goodsdialogVisible: false,
      progressInfo: [],
      
    };
  },
  methods: {
    getorderList() {
      this.$refs.page.paginate();
    },
    getPage(data) {
      // console.log(data);
      this.orderlist = data.goods;
        // console.log(this.orderlist);
    },
    // 展示修改地址的对话框
    showBox() {
      this.editdialogVisible = true;
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields();
    },
    async showProgressBox() {
      const { data: res } = await this.$http.get(`/kuaidi/1106975712662`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败！");
      }
      this.progressInfo = res.data;

      this.goodsdialogVisible = true;
    },
  },
};
</script>

<style lang="" scoped>

</style>