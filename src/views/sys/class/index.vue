<script setup lang="ts">
import { ref } from "vue";
import { useQuestion } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Delete from "@iconify-icons/ep/delete";
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
  userListTableRef,
  userListDataList,
  userListLoading,
  userListPagination,
  userListColumns,
  pushUserTableRef,
  pushUserDataList,
  pushUserLoading,
  pushUserPagination,
  pushUserColumns,
  editDialogTitle,
  editDialogVisible,
  userListDialogTitle,
  userListDialogVisible,
  pushUserDialogTitle,
  pushUserDialogVisible,
  editFormRef,
  editForm,
  editFormRule,
  onSearch,
  onSearchClassUser,
  onSearchStudentList,
  resetForm,
  showEditDialog,
  showUserListDialog,
  showPushUserDialog,
  submitEditForm,
  submitDeleteUser,
  submitPushUser,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  handleUserListSizeChange,
  handleUserListCurrentChange,
  handlePushUserSizeChange,
  handlePushUserCurrentChange
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
      <el-form-item label="班级名称：" prop="name">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入班级名称"
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

    <PureTableBar title="班级列表" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="showEditDialog('create')"
        >
          新增班级
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
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(Role)"
              @click="showUserListDialog(row)"
            >
              用户管理
            </el-button>
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
          <el-form-item prop="name" label="班级名称">
            <el-input
              v-model="editForm.name"
              maxlength="50"
              show-word-limit
              placeholder="请输入班级名称"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item prop="status" label="状态">
            <el-radio-group v-model.number="editForm.status">
              <el-space wrap>
                <el-radio :label="1" border>正常</el-radio>
                <el-radio :label="0" border>禁用</el-radio>
              </el-space>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="desc" label="备注">
            <el-input
              v-model="editForm.desc"
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
      v-model="userListDialogVisible"
      :title="userListDialogTitle"
      width="80vw"
      draggable
      center
      align-center
      destroy-on-close
    >
      <el-scrollbar max-height="80vh">
        <PureTableBar
          title="考生列表"
          @refresh="onSearchClassUser"
          :tableRef="userListTableRef?.getTableRef()"
          :check-list="['勾选列']"
        >
          <template #buttons>
            <el-button
              type="primary"
              :icon="useRenderIcon(AddFill)"
              @click="showPushUserDialog"
            >
              添加考生
            </el-button>
            <el-button
              type="danger"
              :icon="useRenderIcon(AddFill)"
              @click="submitDeleteUser"
            >
              删除考生
            </el-button>
          </template>
          <template v-slot="{ size, checkList }">
            <pure-table
              border
              ref="userListTableRef"
              align-whole="center"
              showOverflowTooltip
              table-layout="auto"
              :loading="userListLoading"
              :size="size"
              :data="userListDataList"
              :columns="userListColumns"
              :checkList="checkList"
              row-key="id"
              :pagination="userListPagination"
              :paginationSmall="size === 'small' ? true : false"
              :header-cell-style="{
                background: 'var(--el-table-row-hover-bg-color)',
                color: 'var(--el-text-color-primary)'
              }"
              @page-size-change="handleUserListSizeChange"
              @page-current-change="handleUserListCurrentChange"
            />
          </template>
        </PureTableBar>
      </el-scrollbar>
    </el-dialog>

    <el-dialog
      v-model="pushUserDialogVisible"
      :title="pushUserDialogTitle"
      width="80vw"
      draggable
      center
      align-center
      destroy-on-close
    >
      <el-scrollbar max-height="80vh">
        <PureTableBar
          title="考生列表"
          @refresh="onSearchStudentList"
          :tableRef="pushUserTableRef?.getTableRef()"
          :check-list="['勾选列']"
        >
          <template #buttons>
            <el-button
              type="primary"
              :icon="useRenderIcon(AddFill)"
              @click="submitPushUser"
            >
              添加考生
            </el-button>
          </template>
          <template v-slot="{ size, checkList }">
            <pure-table
              border
              ref="pushUserTableRef"
              align-whole="center"
              showOverflowTooltip
              table-layout="auto"
              :loading="pushUserLoading"
              :size="size"
              :data="pushUserDataList"
              :columns="pushUserColumns"
              :checkList="checkList"
              row-key="id"
              :pagination="pushUserPagination"
              :paginationSmall="size === 'small' ? true : false"
              :header-cell-style="{
                background: 'var(--el-table-row-hover-bg-color)',
                color: 'var(--el-text-color-primary)'
              }"
              @page-size-change="handlePushUserSizeChange"
              @page-current-change="handlePushUserCurrentChange"
            />
          </template>
        </PureTableBar>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
