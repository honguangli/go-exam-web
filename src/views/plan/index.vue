<script setup lang="ts">
import { ref } from "vue";
import { useHook } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Delete from "@iconify-icons/ep/delete";
import More from "@iconify-icons/ep/more-filled";
import EditPen from "@iconify-icons/ep/edit-pen";
import Role from "@iconify-icons/ri/admin-line";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  pagination,
  classListTableRef,
  classListDataList,
  classListLoading,
  classListPagination,
  classListColumns,
  pushClassTableRef,
  pushClassDataList,
  pushClassLoading,
  pushClassPagination,
  pushClassColumns,
  editDialogVisible,
  editDialogTitle,
  classListDialogTitle,
  classListDialogVisible,
  pushClassDialogTitle,
  pushClassDialogVisible,
  editFormRef,
  editForm,
  editRule,
  onSearch,
  onSearchPlanClassList,
  onSearchClassList,
  resetForm,
  showEditDialog,
  showPlanClassListDialog,
  showPushClassDialog,
  submitEditForm,
  submitDeleteClass,
  submitPushClass,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  handleClassListSizeChange,
  handleClassListCurrentChange,
  handlePushClassSizeChange,
  handlePushClassCurrentChange
} = useHook();
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="名称：" prop="name">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入名称"
          clearable
          class="!w-[200px]"
        />
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

    <PureTableBar title="考试计划列表" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="showEditDialog('create')"
        >
          新增考试计划
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
                    :icon="useRenderIcon(Role)"
                    @click="showPlanClassListDialog(row)"
                  >
                    班级管理
                  </el-dropdown-item>
                  <el-dropdown-item :icon="useRenderIcon(EditPen)">
                    发布
                  </el-dropdown-item>
                  <el-dropdown-item :icon="useRenderIcon(EditPen)">
                    阅卷
                  </el-dropdown-item>
                  <el-dropdown-item :icon="useRenderIcon(EditPen)">
                    公布成绩
                  </el-dropdown-item>
                  <el-dropdown-item :icon="useRenderIcon(EditPen)">
                    成绩管理
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
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRule"
        label-position="top"
      >
        <el-form-item prop="name" label="名称">
          <el-input
            v-model="editForm.name"
            maxlength="50"
            show-word-limit
            placeholder="请输入考试计划名称"
            style="width: 80%"
          />
        </el-form-item>
        <el-form-item prop="paper_id" label="试卷">
          <el-select
            v-model.number="editForm.paper_id"
            placeholder="请选择试卷"
            style="width: 50%"
          >
            <el-option label="C语言程序设计" :value="0" />
            <el-option label="Zone two" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item prop="start_time" label="开始时间">
          <el-date-picker
            v-model="editForm.start_time"
            type="datetime"
            value-format="timestamp"
            placeholder="请选择开始考试时间"
            style="width: 50%"
          />
        </el-form-item>
        <el-form-item prop="end_time" label="结束时间">
          <el-date-picker
            v-model="editForm.end_time"
            type="datetime"
            value-format="timestamp"
            placeholder="请选择结束考试时间"
            style="width: 50%"
          />
        </el-form-item>
        <el-form-item prop="duration" label="考试时长（分钟）">
          <el-input-number v-model="editForm.duration" :min="1" :max="1000" />
        </el-form-item>
        <el-form-item prop="memo" label="备注说明">
          <el-input
            v-model="editForm.memo"
            type="textarea"
            minlength="1"
            maxlength="255"
            show-word-limit
            placeholder="请输入考试计划备注说明"
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

    <el-dialog
      v-model="classListDialogVisible"
      :title="classListDialogTitle"
      width="80vw"
      draggable
      center
      align-center
      destroy-on-close
    >
      <el-scrollbar max-height="80vh">
        <PureTableBar
          title="班级列表"
          @refresh="onSearchPlanClassList"
          :tableRef="classListTableRef?.getTableRef()"
          :check-list="['勾选列']"
        >
          <template #buttons>
            <el-button
              type="primary"
              :icon="useRenderIcon(AddFill)"
              @click="showPushClassDialog"
            >
              添加班级
            </el-button>
            <el-button
              type="danger"
              :icon="useRenderIcon(AddFill)"
              @click="submitDeleteClass"
            >
              删除班级
            </el-button>
          </template>
          <template v-slot="{ size, checkList }">
            <pure-table
              border
              ref="classListTableRef"
              align-whole="center"
              showOverflowTooltip
              table-layout="auto"
              :loading="classListLoading"
              :size="size"
              :data="classListDataList"
              :columns="classListColumns"
              :checkList="checkList"
              row-key="id"
              :pagination="classListPagination"
              :paginationSmall="size === 'small' ? true : false"
              :header-cell-style="{
                background: 'var(--el-table-row-hover-bg-color)',
                color: 'var(--el-text-color-primary)'
              }"
              @page-size-change="handleClassListSizeChange"
              @page-current-change="handleClassListCurrentChange"
            />
          </template>
        </PureTableBar>
      </el-scrollbar>
    </el-dialog>

    <el-dialog
      v-model="pushClassDialogVisible"
      :title="pushClassDialogTitle"
      width="80vw"
      draggable
      center
      align-center
      destroy-on-close
    >
      <el-scrollbar max-height="80vh">
        <PureTableBar
          title="班级列表"
          @refresh="onSearchClassList"
          :tableRef="pushClassTableRef?.getTableRef()"
          :check-list="['勾选列']"
        >
          <template #buttons>
            <el-button
              type="primary"
              :icon="useRenderIcon(AddFill)"
              @click="submitPushClass"
            >
              添加班级
            </el-button>
          </template>
          <template v-slot="{ size, checkList }">
            <pure-table
              border
              ref="pushClassTableRef"
              align-whole="center"
              showOverflowTooltip
              table-layout="auto"
              :loading="pushClassLoading"
              :size="size"
              :data="pushClassDataList"
              :columns="pushClassColumns"
              :checkList="checkList"
              row-key="id"
              :pagination="pushClassPagination"
              :paginationSmall="size === 'small' ? true : false"
              :header-cell-style="{
                background: 'var(--el-table-row-hover-bg-color)',
                color: 'var(--el-text-color-primary)'
              }"
              @page-size-change="handlePushClassSizeChange"
              @page-current-change="handlePushClassCurrentChange"
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
