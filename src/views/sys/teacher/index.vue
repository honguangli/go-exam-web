<script setup lang="ts">
import { ref } from "vue";
import { useQuestion } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Delete from "@iconify-icons/ep/delete";
import More from "@iconify-icons/ep/more-filled";
import EditPen from "@iconify-icons/ep/edit-pen";
import Role from "@iconify-icons/ri/admin-line";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";

defineOptions({
  name: "Knowledge"
});

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  pagination,
  editDialogTitle,
  editDialogVisible,
  editPasswordDialogTitle,
  editPasswordDialogVisible,
  editFormRef,
  editForm,
  editFormType,
  editFormRule,
  editPasswordFormRef,
  editPasswordForm,
  editPasswordFormRule,
  onSearch,
  resetForm,
  showEditDialog,
  showEditPasswordDialog,
  submitEditForm,
  submitPasswordEditForm,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = useQuestion();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="用户名：" prop="name">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入名称"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select
          v-model="searchForm.status"
          placeholder="请选择状态"
          clearable
          class="!w-[180px]"
        >
          <el-option label="禁用" value="0" />
          <el-option label="正常" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar title="用户列表" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="showEditDialog('create')"
        >
          新增用户
        </el-button>
      </template>
      <template v-slot="{ size, checkList }">
        <pure-table
          border
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="columns"
          :checkList="checkList"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="showEditDialog('edit', row)"
            >
              编辑
            </el-button>
            <el-popconfirm title="是否确认删除?" @confirm="handleDelete(row)">
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon(Delete)"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
            <el-dropdown>
              <el-button
                class="ml-3 mt-[2px]"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon(More)"
              />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-button
                      class="reset-margin"
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon(EditPen)"
                      @click="showEditPasswordDialog(row)"
                    >
                      修改密码
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      class="reset-margin"
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon(Role)"
                    >
                      分配角色
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <el-dialog
      v-model="editDialogVisible"
      :title="editDialogTitle"
      width="50%"
      draggable
      center
      align-center
      destroy-on-close
    >
      <el-scrollbar max-height="60vh">
        <el-form
          ref="editFormRef"
          :model="editForm"
          :rules="editFormRule"
          label-position="top"
        >
          <el-form-item prop="name" label="用户名">
            <el-input
              v-model="editForm.name"
              maxlength="50"
              show-word-limit
              placeholder="请输入用户名"
              style="width: 80%"
            />
          </el-form-item>
          <template v-if="editFormType === 'create'">
            <el-form-item prop="password" label="密码">
              <el-input
                v-model="editForm.password"
                type="password"
                maxlength="50"
                show-word-limit
                placeholder="请输入密码"
                style="width: 80%"
                show-password
                autocomplete="new-password"
              />
            </el-form-item>
            <el-form-item prop="confirm_password" label="确认密码">
              <el-input
                v-model="editForm.confirm_password"
                type="password"
                maxlength="50"
                show-word-limit
                placeholder="请输入密码"
                style="width: 80%"
                show-password
                autocomplete="new-password"
              />
            </el-form-item>
          </template>
          <el-form-item prop="status" label="状态">
            <el-radio-group v-model.number="editForm.status">
              <el-space wrap>
                <el-radio :label="1" border>正常</el-radio>
                <el-radio :label="0" border>禁用</el-radio>
              </el-space>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="true_name" label="姓名">
            <el-input
              v-model="editForm.true_name"
              maxlength="50"
              show-word-limit
              placeholder="请输入用户真实姓名"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item prop="mobile" label="手机号">
            <el-input
              v-model="editForm.mobile"
              maxlength="50"
              show-word-limit
              placeholder="请输入手机号"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item prop="email" label="邮箱">
            <el-input
              v-model="editForm.email"
              maxlength="50"
              show-word-limit
              placeholder="请输入邮箱"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item prop="memo" label="备注">
            <el-input
              v-model="editForm.memo"
              type="textarea"
              minlength="1"
              maxlength="255"
              show-word-limit
              placeholder="请输入备注"
              :autosize="{ minRows: 3, maxRows: 6 }"
              style="width: 80%"
            />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEditForm">提交</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="editPasswordDialogVisible"
      :title="editPasswordDialogTitle"
      width="50%"
      draggable
      center
      align-center
      destroy-on-close
    >
      <el-scrollbar max-height="60vh">
        <el-form
          ref="editPasswordFormRef"
          :model="editPasswordForm"
          :rules="editPasswordFormRule"
          label-position="top"
        >
          <el-form-item prop="name" label="用户名">
            <el-input
              v-model="editPasswordForm.name"
              maxlength="50"
              show-word-limit
              placeholder="用户名"
              style="width: 80%"
              disabled
            />
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input
              v-model="editPasswordForm.password"
              type="password"
              maxlength="50"
              show-word-limit
              placeholder="请输入密码"
              style="width: 80%"
              show-password
              autocomplete="new-password"
            />
          </el-form-item>
          <el-form-item prop="confirm_password" label="确认密码">
            <el-input
              v-model="editPasswordForm.confirm_password"
              type="password"
              maxlength="50"
              show-word-limit
              placeholder="请输入密码"
              style="width: 80%"
              show-password
              autocomplete="new-password"
            />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editPasswordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPasswordEditForm"
            >提交</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
