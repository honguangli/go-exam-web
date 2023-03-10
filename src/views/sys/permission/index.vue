<script setup lang="ts">
import { ref } from "vue";
import { useHook } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
//import Search from "@iconify-icons/ep/search";
//import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";

import {
  PermissionMetaShowLine,
  PermissionMetaShowParent,
  PermissionMetaKeepAlive,
  PermissionMetaIframeLoading,
  PermissionMetaHiddenTag,
  PermissionType,
  PermissionStatus,
  formatPermissionTypeText,
  formatPermissionStatusText
} from "@/api/exam/models/permission";

defineOptions({
  name: "Knowledge"
});

//const formRef = ref();
const tableRef = ref();
const {
  //searchForm,
  loading,
  columns,
  dataList,
  dataTree,
  editDialogTitle,
  editDialogVisible,
  editFormRef,
  editForm,
  editFormRule,
  onSearch,
  //resetForm,
  showEditDialog,
  submitEditForm,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = useHook();
</script>

<template>
  <div class="main">
    <!-- <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="bg-bg_color w-[99/100] pl-8 pt-4"
    >
      <el-form-item label="权限名称：" prop="meta_title">
        <el-input
          v-model="searchForm.meta_title"
          placeholder="请输入权限名称："
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
    </el-form> -->

    <PureTableBar
      title="权限列表"
      @refresh="onSearch"
      :tableRef="tableRef?.getTableRef()"
    >
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="showEditDialog('create')"
        >
          新增权限
        </el-button>
      </template>
      <template v-slot="{ size, checkList }">
        <pure-table
          border
          ref="tableRef"
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="columns"
          :checkList="checkList"
          row-key="id"
          default-expand-all
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
          <el-form-item prop="meta_title" label="权限名称">
            <el-input
              v-model="editForm.meta_title"
              maxlength="50"
              show-word-limit
              placeholder="请输入权限名称"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item prop="type" label="类型">
            <el-radio-group v-model.number="editForm.type">
              <el-space wrap>
                <el-radio :label="PermissionType.Menu" border>{{
                  formatPermissionTypeText(PermissionType.Menu)
                }}</el-radio>
                <el-radio :label="PermissionType.Page" border>{{
                  formatPermissionTypeText(PermissionType.Page)
                }}</el-radio>
                <el-radio :label="PermissionType.Component" border>{{
                  formatPermissionTypeText(PermissionType.Component)
                }}</el-radio>
                <el-radio :label="PermissionType.Op" border>{{
                  formatPermissionTypeText(PermissionType.Op)
                }}</el-radio>
                <el-radio :label="PermissionType.Button" border>{{
                  formatPermissionTypeText(PermissionType.Button)
                }}</el-radio>
                <el-radio :label="PermissionType.Data" border>{{
                  formatPermissionTypeText(PermissionType.Data)
                }}</el-radio>
              </el-space>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="pid" label="上一级权限">
            <el-tree-select
              v-model.number="editForm.pid"
              :data="dataTree"
              :render-after-expand="false"
              check-strictly
              style="width: 80%"
              value-key="id"
              :props="{ label: 'meta_title' }"
            />
          </el-form-item>
          <el-form-item prop="code" label="权限代码">
            <el-input
              v-model="editForm.code"
              maxlength="50"
              show-word-limit
              placeholder="请输入权限代码"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item prop="status" label="状态">
            <el-radio-group v-model.number="editForm.status">
              <el-space wrap>
                <el-radio :label="PermissionStatus.Enable" border>{{
                  formatPermissionStatusText(PermissionStatus.Enable)
                }}</el-radio>
                <el-radio :label="PermissionStatus.Disable" border>{{
                  formatPermissionStatusText(PermissionStatus.Disable)
                }}</el-radio>
              </el-space>
            </el-radio-group>
          </el-form-item>
          <template
            v-if="
              [PermissionType.Menu, PermissionType.Page].includes(editForm.type)
            "
          >
            <el-form-item prop="path" label="路由地址">
              <el-input
                v-model="editForm.path"
                type="textarea"
                minlength="1"
                maxlength="1024"
                show-word-limit
                placeholder="请输入路由地址"
                :autosize="{ minRows: 3, maxRows: 6 }"
                style="width: 80%"
              />
            </el-form-item>
            <el-form-item prop="name" label="路由名称">
              <el-input
                v-model="editForm.name"
                maxlength="50"
                show-word-limit
                placeholder="请输入路由名称"
                style="width: 80%"
              />
            </el-form-item>
            <el-form-item prop="component" label="路由组件">
              <el-input
                v-model="editForm.component"
                maxlength="255"
                show-word-limit
                placeholder="请输入路由组件"
                style="width: 80%"
              />
            </el-form-item>
            <el-form-item prop="redirect" label="重定向">
              <el-input
                v-model="editForm.redirect"
                type="textarea"
                minlength="1"
                maxlength="1024"
                show-word-limit
                placeholder="请输入重定向地址"
                :autosize="{ minRows: 3, maxRows: 6 }"
                style="width: 80%"
              />
            </el-form-item>
            <el-form-item prop="meta_icon" label="图标">
              <el-input
                v-model="editForm.meta_icon"
                maxlength="50"
                show-word-limit
                placeholder="请输入图标"
                style="width: 80%"
              />
            </el-form-item>
            <el-form-item prop="meta_extra_icon" label="右侧图标">
              <el-input
                v-model="editForm.meta_extra_icon"
                maxlength="50"
                show-word-limit
                placeholder="请输入右侧图标"
                style="width: 80%"
              />
            </el-form-item>
            <el-form-item prop="meta_show_link" label="是否显示">
              <el-radio-group v-model.number="editForm.meta_show_link">
                <el-space wrap>
                  <el-radio :label="PermissionMetaShowLine.Enable" border
                    >显示</el-radio
                  >
                  <el-radio :label="PermissionMetaShowLine.Disable" border
                    >隐藏</el-radio
                  >
                </el-space>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="meta_show_parent" label="是否显示父菜单">
              <el-radio-group v-model.number="editForm.meta_show_parent">
                <el-space wrap>
                  <el-radio :label="PermissionMetaShowParent.Enable" border
                    >显示</el-radio
                  >
                  <el-radio :label="PermissionMetaShowParent.Disable" border
                    >隐藏</el-radio
                  >
                </el-space>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="meta_keep_alive" label="是否缓存">
              <el-radio-group v-model.number="editForm.meta_keep_alive">
                <el-space wrap>
                  <el-radio :label="PermissionMetaKeepAlive.Enable" border
                    >显示</el-radio
                  >
                  <el-radio :label="PermissionMetaKeepAlive.Disable" border
                    >隐藏</el-radio
                  >
                </el-space>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="meta_frame_src" label="内嵌网页">
              <el-input
                v-model="editForm.meta_frame_src"
                type="textarea"
                minlength="1"
                maxlength="1024"
                show-word-limit
                placeholder="请输入内嵌网页地址"
                :autosize="{ minRows: 3, maxRows: 6 }"
                style="width: 80%"
              />
            </el-form-item>
            <el-form-item
              prop="meta_frame_loading"
              label="内嵌网页首次加载动画"
            >
              <el-radio-group v-model.number="editForm.meta_frame_loading">
                <el-space wrap>
                  <el-radio :label="PermissionMetaIframeLoading.Enable" border
                    >开启</el-radio
                  >
                  <el-radio :label="PermissionMetaIframeLoading.Disable" border
                    >关闭</el-radio
                  >
                </el-space>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="meta_hidden_tag" label="是否添加到标签页">
              <el-radio-group v-model.number="editForm.meta_hidden_tag">
                <el-space wrap>
                  <el-radio :label="PermissionMetaHiddenTag.Enable" border
                    >不添加</el-radio
                  >
                  <el-radio :label="PermissionMetaHiddenTag.Disable" border
                    >添加</el-radio
                  >
                </el-space>
              </el-radio-group>
            </el-form-item>
          </template>
          <el-form-item prop="meta_rank" label="序号">
            <el-input-number
              v-model="editForm.meta_rank"
              :min="1"
              :max="999999"
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
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
