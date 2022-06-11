<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">{{
            catlevel[0]
          }}</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >{{ catlevel[1] }}</el-tag
          >
          <el-tag type="warning" size="mini" v-else>{{ catlevel[2] }}</el-tag>
        </template>
        <!-- 删除-操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCate(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 4, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addcatedialogVisible"
      width="50%"
      @close="addcatedialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addcateForm"
        :rules="addcateFormRules"
        ref="addcateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addcateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- 级联框 -->
          <!-- options用来指定数据源 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            expandTrigger="hover"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addcatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类的对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editcatedialogVisible"
      width="50%"
      @close="editcatedialogClose"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="editcateForm"
        :rules="addcateFormRules"
        ref="aditcateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：">
          <el-input v-model="editcateForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="等级分类：">
          <el-input v-model="catlevel[editcateForm.cat_level]"> </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editcatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editcatedialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //商品分类的数据列表，默认为空
      catelist: [],
      //总数据条数
      total: 0,
      // 为table指定列
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      // 控制添加分类对话框的显示与隐藏
      addcatedialogVisible: false,
      // 添加分类的数据表单对象
      addcateForm: {
        // 将要添加的分类名称
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      // 添加的分类验证规则对象
      addcateFormRules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
        ],
      },

      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 选中的父级分类的id数组
      selectedKeys: [],
      // 编辑分类对话框的显式隐藏
      editcatedialogVisible: false,
      // 获取到对应id分类的信息
      editcateForm: {},
      // 等级
      catlevel: ["一级", "二级", "三级"],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取商品分类的数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }
      //把请求到的数据列表，赋值给catelist
      this.catelist = res.data.result;
      this.total = res.data.total;
    },
    // 监听pagesize改变的事件
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getCateList();
    },
    // 监听pagenum的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    showAddCateDialog() {
      // 点击按钮，展示对话框前获取到父级分类数据列表
      this.addParentCateList();
      this.addcatedialogVisible = true;
    },
    // 获取父级的分类的数据列表
    async addParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类失败！");
      }
      this.parentCateList = res.data;
    },
    //选择项发生变化，触发这个函数
    parentCateChange() {
      console.log(this.selectedKeys);
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addcateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        // 为当前分类的等级赋值
        this.addcateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        this.addcateForm.cat_pid = 0;
        this.addcateForm.cat_level = 0;
      }
    },
    // 点击按钮，添加新的分类
    addCate() {
      console.log(this.addcateForm);
      this.$refs.addcateFormRef.validate(async (valia) => {
        if (!valia) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addcateForm
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败！");
        }
        this.$message.success("添加分类成功");
        this.getCateList();
        this.addcatedialogVisible = false;
      });
    },
    //监听对话框的表单事件，重置表单数据
    addcatedialogClosed() {
      this.$refs.addcateFormRef.resetFields();
      this.selectedKeys = [];
      this.addcateForm.cat_pid = 0;
      this.addcateForm.cat_level = 0;
    },
    // 点击编辑按钮，根绝id编辑分类
    async editCate(id) {
      console.log(id);
      const { data: res } = await this.$http.get("categories/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("编辑分类失败");
      }
      this.editcateForm = res.data;

      this.editcatedialogVisible = true;
    },
    //监听修改分类对话框的关闭事件---数据重置
    editcatedialogClose() {
      this.$refs.aditcateFormRef.resetFields();
    },
    // 点击确定按钮,提交新数据并刷新列表
    editcatedialog() {
      this.$refs.aditcateFormRef.validate(async (valia) => {
        if (!valia) return;
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put(
          "categories/" + this.editcateForm.cat_id,
          {
            id: this.editcateForm.cat_id,
            cat_name: this.editcateForm.cat_name,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("更新分类信息失败");
        }

        // 关闭对话框
        this.editcatedialogVisible = false;
        // 刷新数据列表
        this.getCateList();
        // 提示修改成功
        this.$message.success("修改用户成功");
      });
    },
    // 根据id删除指定分类
    async deleteCate(id) {
      console.log(id);
      const confirmResult = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      //发送请求根据id完成删除操作
      const { data: res } = await this.$http.delete("categories/" + id);
      //判断如果删除失败，就做提示
      if (res.meta.status !== 200) return this.$message.error("删除分类失败");
      //修改成功的提示
      this.$message.success("删除用分类成功");
      //重新请求最新的数据
      this.getCateList();
    },
  },
};
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
</style>