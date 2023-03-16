<script setup lang="ts">
import { useHook } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import EditPen from "@iconify-icons/ep/edit-pen";

const {
  loading,
  columns,
  dataList,
  pagination,
  editDialogVisible,
  editDialogTitle,
  editFormRef,
  editForm,
  editRule,
  onSearch,
  submitEditForm,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  startExam
} = useHook();
</script>

<template>
  <div class="main">
    <PureTableBar title="待考科目列表" @refresh="onSearch">
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
              @click="startExam(row)"
            >
              开始考试
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
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRule"
        label-position="top"
      >
        <el-form-item prop="name" label="名称">
          <el-input
            v-model="editForm.name"
            minlength="1"
            maxlength="50"
            show-word-limit
            placeholder="请输入科目名称"
            style="width: 80%"
          />
        </el-form-item>
        <el-form-item prop="desc" label="说明">
          <el-input
            v-model="editForm.desc"
            type="textarea"
            minlength="1"
            maxlength="255"
            show-word-limit
            placeholder="请输入科目说明"
            :autosize="{ minRows: 3, maxRows: 6 }"
            style="width: 80%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEditForm">提交</el-button>
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
