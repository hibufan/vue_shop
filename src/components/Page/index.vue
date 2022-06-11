<template>
  <div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[3, 4, 10, 15]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>
<script>
export default {
  
  name: "pagination",
  props: {
    url: {
        default:'',
        type:String
    },
    query: {
        default:'',
        type:String
    },
  },
  data() {
    return {
      pageSize: 5,
      currentPage: 1,
      total: 0,
    };
  },
  mounted() {
    this.paginate();
  },
  methods: {
    //   请求
    async paginate() {
      const { data: res } = await this.$http.get(this.url, {
        params: {
          type: 3,
          pagenum: this.currentPage,
          pagesize: this.pageSize,
          query: this.query,
        },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }
      //把请求到的数据列表，赋值给catelist
      this.total = res.data.total;
      this.$emit("return", res.data);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.paginate();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.paginate();
    },
  },
};
</script>