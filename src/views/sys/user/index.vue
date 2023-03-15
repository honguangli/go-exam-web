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
  roleTableRef,
  roleDataList,
  roleLoading,
  roleColumns,
  editDialogTitle,
  editDialogVisible,
  editTypeDialogTitle,
  editTypeDialogVisible,
  editPasswordDialogTitle,
  editPasswordDialogVisible,
  authDialogTitle,
  authDialogVisible,
  editFormRef,
  editForm,
  editFormType,
  editFormRule,
  editTypeFormRef,
  editTypeForm,
  editTypeFormRule,
  editPasswordFormRef,
  editPasswordForm,
  editPasswordFormRule,
  onSearch,
  onSearchRole,
  resetForm,
  showEditDialog,
  showEditTypeDialog,
  showEditPasswordDialog,
  showAuthDialog,
  submitEditForm,
  submitTypeEditForm,
  submitPasswordEditForm,
  submitAuth,
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
      <el-form-item label="账号类型：" prop="type">
        <el-select
          v-model="searchForm.type"
          placeholder="请选择账号类型"
          clearable
          class="!w-[180px]"
        >
          <el-option label="管理员" value="1" />
          <el-option label="教师" value="2" />
          <el-option label="学生" value="3" />
        </el-select>
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
            <el-dropdown trigger="click">
              <el-button
                class="ml-3 mt-[2px]"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon(More)"
              />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    :icon="useRenderIcon(EditPen)"
                    @click="showEditTypeDialog(row)"
                  >
                    变更类型
                  </el-dropdown-item>
                  <el-dropdown-item
                    :icon="useRenderIcon(EditPen)"
                    @click="showEditPasswordDialog(row)"
                  >
                    修改密码
                  </el-dropdown-item>
                  <el-dropdown-item
                    :icon="useRenderIcon(Role)"
                    @click="showAuthDialog(row)"
                  >
                    授权
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
      v-model="editTypeDialogVisible"
      :title="editTypeDialogTitle"
      width="50%"
      draggable
      center
      align-center
      destroy-on-close
    >
      <el-scrollbar max-height="60vh">
        <el-form
          ref="editTypeFormRef"
          :model="editTypeForm"
          :rules="editTypeFormRule"
          label-position="top"
        >
          <el-form-item prop="name" label="用户名">
            <el-input
              v-model="editTypeForm.name"
              maxlength="50"
              show-word-limit
              placeholder="用户名"
              style="width: 80%"
              disabled
            />
          </el-form-item>
          <el-form-item prop="type" label="账号类型">
            <el-radio-group v-model.number="editTypeForm.type">
              <el-space wrap>
                <el-radio :label="1" border>管理员</el-radio>
                <el-radio :label="2" border>教师</el-radio>
                <el-radio :label="3" border>学生</el-radio>
              </el-space>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editTypeDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitTypeEditForm">提交</el-button>
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

    <el-dialog
      v-model="authDialogVisible"
      :title="authDialogTitle"
      width="80vw"
      draggable
      center
      align-center
      destroy-on-close
    >
      <el-scrollbar max-height="80vh">
        <PureTableBar
          title="角色列表"
          @refresh="onSearchRole"
          :check-list="['勾选列']"
        >
          <template v-slot="{ size, checkList }">
            <pure-table
              border
              ref="roleTableRef"
              align-whole="center"
              showOverflowTooltip
              table-layout="auto"
              :loading="roleLoading"
              :size="size"
              :data="roleDataList"
              :columns="roleColumns"
              :checkList="checkList"
              :header-cell-style="{
                background: 'var(--el-table-row-hover-bg-color)',
                color: 'var(--el-text-color-primary)'
              }"
            />
          </template>
        </PureTableBar>
      </el-scrollbar>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="authDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAuth">提交</el-button>
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
