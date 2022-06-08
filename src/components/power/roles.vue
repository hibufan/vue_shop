<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col
          ><el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          ></el-col
        >
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 栅格系统组件 -->
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限-->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeUserById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色的对话框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <!-- 内容主体区 -->
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="ruleFormRef"
          label-width="100px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色信息" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input> </el-form-item
        ></el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改角色的对话框 -->
      <el-dialog
        title="修改角色"
        :visible.sync="aditDialogVisible"
        width="50%"
        @close="aditDialogClose"
      >
        <!-- 内容主体 -->
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="100px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色信息" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input> </el-form-item
        ></el-form>
        <!-- 底部信息 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="aditDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="aditRolesInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
    <!-- 分配权限-->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClose"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      //控制添加角色的显示与隐藏
      addDialogVisible: false,
      //添加角色的表单数据
      addForm: {
        roleName: "",
        roleDesc: "",
      },
      //添加表单的验证规则对象
      addFormRules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "角色名的长度到2-10个字符之间",
            // 触发时机
            trigger: "blur",
          },
        ],
        roleDesc: [
          {
            message: "请输入角色描述",
            trigger: "blur",
          },
        ],
      },
      //控制编辑角色的显式与隐藏
      aditDialogVisible: false,
      //   定义私有数据对象-专门保存请求到的角色信息
      editForm: {},
      //修改表单的验证规则对象
      editFormRules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "角色名的长度到2-10个字符之间",
            // 触发时机
            trigger: "blur",
          },
        ],
        roleDesc: [
          {
            trigger: "blur",
          },
        ],
      },
      //控制分配权限的显式与隐藏
      setRightDialogVisible: false,
      //所有权限的列表
      rightslist: [],
      //树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      //默认选中的节点id值
      defKeys: [],
      //保存正在操作的角色id
      roleId: "",
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    // 获取所有的角色列表数据
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户失败");
      }
      this.rolelist = res.data;
    },
    // 监听添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.ruleFormRef.resetFields();
    },
    //点击按钮，添加新角色
    addRoles() {
      // 添加用户之前需要预校验
      this.$refs.ruleFormRef.validate(async (valid) => {
        if (!valid) return;
        // 预校验通过，可以发起真正的添加角色的请求
        const { data: res } = await this.$http.post("roles", this.addForm);
        if (res.meta.status !== 201) {
          return this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        this.addDialogVisible = false;
        this.getRoleList();
      });
    },
    // 展示编辑角色的对话框
    async showEditDialog(id) {
      //   根据id获取到对应角色信息---渲染到列表
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询角色信息失败");
      }
      this.editForm = res.data;
      this.aditDialogVisible = true;
    },
    //  监听编辑对话框的关闭事件
    aditDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改角色信息并提交
    aditRolesInfo() {
      // 预验证
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "roles/" + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改角色失败");
        }
        this.$message.success("修改角色成功");
        this.aditDialogVisible = false;
        this.getRoleList();
      });
    },
    // 根据id删除角色信息
    async removeUserById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
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
      const { data: res } = await this.$http.delete("roles/" + id);
      //判断如果删除失败，就做提示
      if (res.meta.status !== 200) return this.$message.error("删除用户失败");
      //修改成功的提示
      this.$message.success("删除用户成功");
      //重新请求最新的数据
      this.getRoleList();
    },
    // 根据id删除对应的权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );

      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败！");
      }
      // this.getRoleList()----页面会重新渲染
      role.children = res.data;
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      //将role.id保存起来以供保存权限时使用
      this.roleId = role.id;
      // 获取到所有权限列表数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限失败！");
      }
      this.rightslist = res.data;
      //递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys);
      this.setRightDialogVisible = true;
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defkeys数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClose() {
      this.defKeys = [];
    },
    // 点击为角色分配权限
    async allotRights() {
      // 拿到用户选择的权限
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      //   拼接成字符串
      const idStr = keys.join(",");
    //   发起请求
   const{data:res}= await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
       if(res.meta.status!==200){
        return this.$message.error('分配权限失败')
    }
    this.$message.success('分配权限成功')
    this.getRoleList()
    this.setRightDialogVisible=false
    },
  
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>