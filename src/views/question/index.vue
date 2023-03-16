<script setup lang="ts">
import { ref } from "vue";
import { useHook } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";

import Editor from "@/components/Editor/index.vue";

import { QuestionType } from "@/api/exam/models/question";

const formRef = ref();
const {
  searchForm,
  loading,
  columns,
  dataList,
  pagination,
  editDialogVisible,
  editDialogTitle,
  editFormRef,
  editForm,
  editFormRule,
  onSearch,
  resetForm,
  showEditDialog,
  submitEditForm,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  transformOptionTag,
  addOption,
  deleteOption
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
      <el-form-item label="题干：" prop="name">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入题干"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="题型：" prop="type">
        <el-select
          v-model="searchForm.type"
          placeholder="请选择题型"
          clearable
          class="!w-[180px]"
        >
          <el-option label="单选题" value="1" />
          <el-option label="多选题" value="2" />
          <el-option label="判断题" value="3" />
          <el-option label="填空题" value="4" />
          <el-option label="多项填空题" value="5" />
          <el-option label="简答题" value="6" />
          <el-option label="多项简答题" value="7" />
          <el-option label="文件题" value="8" />
          <el-option label="多项文件题" value="9" />
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

    <PureTableBar title="试题列表" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="showEditDialog('create')"
        >
          新增试题
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
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <el-dialog
      v-model="editDialogVisible"
      :title="editDialogTitle"
      width="80%"
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
          <el-form-item prop="subject_id" label="科目">
            <el-select
              v-model="editForm.subject_id"
              placeholder="请选择科目"
              style="width: 50%"
            >
              <el-option label="C语言程序设计" :value="0" />
              <el-option label="Zone two" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item prop="knowledge_ids" label="知识点">
            <el-select
              v-model="editForm.knowledge_ids"
              multiple
              placeholder="请选择知识点"
              style="width: 50%"
            >
              <el-option label="网络协议与标准" :value="0" />
              <el-option label="TCP/IP" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item prop="type" label="题型">
            <el-radio-group v-model.number="editForm.type" size="large">
              <el-space wrap>
                <el-radio :label="QuestionType.ChoiceSingle" border
                  >单选题</el-radio
                >
                <el-radio :label="QuestionType.ChoiceMulti" border
                  >多选题</el-radio
                >
                <el-radio :label="QuestionType.Judge" border>判断题</el-radio>
                <el-radio :label="QuestionType.BlankSingle" border
                  >填空题</el-radio
                >
                <el-radio :label="QuestionType.BlankMulti" border
                  >多项填空题</el-radio
                >
                <el-radio :label="QuestionType.AnswerSingle" border
                  >简答题</el-radio
                >
                <el-radio :label="QuestionType.AnswerMulti" border
                  >多项简答题</el-radio
                >
                <!-- <el-radio :label="QuestionType.FileSingle" border>文件题</el-radio>
                <el-radio :label="QuestionType.FileMulti" border>多项文件题</el-radio> -->
              </el-space>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            prop="difficulty"
            label="难度系数（1~100，数值越大难度越大）"
          >
            <!-- <el-radio-group v-model.number="editForm.difficulty" size="large">
              <el-space wrap>
                <el-radio :label="QuestionDifficulty.Simple" border
                  >简单</el-radio
                >
                <el-radio :label="QuestionDifficulty.MiddleSimple" border
                  >较简单</el-radio
                >
                <el-radio :label="QuestionDifficulty.Normal" border
                  >普通</el-radio
                >
                <el-radio :label="QuestionDifficulty.MiddleHard" border
                  >较难</el-radio
                >
                <el-radio :label="QuestionDifficulty.Hard" border
                  >困难</el-radio
                >
              </el-space>
            </el-radio-group> -->

            <el-input-number
              v-model="editForm.difficulty"
              :step="5"
              :min="1"
              :max="100"
            />
          </el-form-item>
          <!-- <el-form-item prop="score" label="分值">
            <el-input-number v-model="editForm.score" :min="1" :max="100" />
          </el-form-item> -->
          <!-- <el-form-item prop="name" label="题干">
            <el-input
              v-model="editForm.name"
              type="textarea"
              maxlength="1000"
              minlength="1"
              show-word-limit
              placeholder="请输入"
              :autosize="{ minRows: 3, maxRows: 6 }"
              style="width: 80%"
            />
          </el-form-item> -->
          <el-form-item prop="content" label="题干">
            <Editor v-model="editForm.content" />
          </el-form-item>
          <el-divider />
          <template v-if="editForm.type === QuestionType.ChoiceSingle">
            <div><el-tag>选项列表</el-tag></div>
            <el-radio-group
              v-model.number="editForm.difficulty"
              size="large"
              style="width: 100%"
            >
              <div
                v-for="(item, index) in editForm.options"
                :key="index"
                style="width: 100%"
              >
                <el-divider />
                <el-form-item
                  prop="name"
                  :label="transformOptionTag(index + 1)"
                >
                  <el-input
                    v-model="item.content"
                    type="textarea"
                    maxlength="1000"
                    minlength="1"
                    show-word-limit
                    placeholder="请输入选项内容"
                    :autosize="{ minRows: 3, maxRows: 6 }"
                    style="width: 80%"
                  />
                </el-form-item>
                <el-space wrap>
                  <el-radio :label="index" border>正确答案</el-radio>
                  <el-button
                    type="primary"
                    :icon="useRenderIcon(AddFill)"
                    :disabled="editForm.options.length >= 7"
                    circle
                    @click="addOption(index)"
                  />
                  <el-button
                    type="danger"
                    :icon="useRenderIcon(Delete)"
                    :disabled="editForm.options.length <= 2"
                    circle
                    @click="deleteOption(index)"
                  />
                </el-space>
              </div>
            </el-radio-group>
          </template>
          <template v-else-if="editForm.type === QuestionType.ChoiceMulti" />
          <template v-else-if="editForm.type === QuestionType.Judge" />
          <template v-else-if="editForm.type === QuestionType.BlankSingle" />
          <template v-else-if="editForm.type === QuestionType.BlankMulti" />
          <template v-else-if="editForm.type === QuestionType.AnswerSingle" />
          <template v-else-if="editForm.type === QuestionType.AnswerMulti" />
          <template v-else-if="editForm.type === QuestionType.FileSingle" />
          <template v-else-if="editForm.type === QuestionType.FileMulti" />
          <!-- <el-form-item prop="analysis" label="解析">
            <Editor v-model="editForm.analysis" />
          </el-form-item> -->
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
