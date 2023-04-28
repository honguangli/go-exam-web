<script setup lang="ts">
import { h, ref } from "vue";
import { useHook } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ElDivider } from "element-plus";

import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import ArrowUp from "@iconify-icons/ep/arrow-up";
import ArrowDown from "@iconify-icons/ep/arrow-down";
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
  subjectList,
  knowledgeList,
  editDialogVisible,
  editDialogTitle,
  editFormRef,
  editForm,
  editRule,
  aiDialogVisible,
  aiDialogTitle,
  aiFormRef,
  aiForm,
  aiRule,
  onSearch,
  resetForm,
  showEditDialog,
  showAiEditDialog,
  submitEditForm,
  submitAiEditForm,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  questionBlock,
  getQuestionSort,
  transformOptionTag,
  getChoiceSingleRight,
  getChoiceMultiRight,
  getJudgeRight,
  sortUpQuestion,
  sortDownQuestion,
  deleteQuestion
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

    <PureTableBar title="试卷列表" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="showEditDialog('create')"
        >
          手工组卷
        </el-button>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="showAiEditDialog"
        >
          智能组卷
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
              :icon="useRenderIcon(EditPen)"
            >
              发布
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <!-- <el-dialog
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
            placeholder="请输入试卷名称"
            style="width: 80%"
          />
        </el-form-item>
        <el-form-item prop="score" label="总分">
          <el-input-number v-model="editForm.score" :min="1" :max="1000" />
        </el-form-item>
        <el-form-item prop="pass_score" label="及格分">
          <el-input-number
            v-model="editForm.pass_score"
            :min="1"
            :max="aiForm.score"
          />
        </el-form-item>
        <el-form-item prop="meme" label="备注">
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
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEditForm">提交</el-button>
        </span>
      </template>
    </el-dialog>-->

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
          :rules="editRule"
          label-position="top"
        >
          <el-form-item prop="name" label="名称">
            <el-input
              v-model="editForm.name"
              maxlength="50"
              show-word-limit
              placeholder="请输入试卷名称"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item prop="score" label="总分（完成题型设置后系统自动计算）">
            <el-input
              v-model="editForm.score"
              maxlength="50"
              show-word-limit
              placeholder="试卷总分"
              style="width: 80%"
              disabled
            />
          </el-form-item>
          <el-form-item
            prop="pass_score"
            label="及格分（请完成题型设置后调整）"
          >
            <el-input-number
              v-model="editForm.pass_score"
              :min="1"
              :max="aiForm.score"
            />
          </el-form-item>
          <el-form-item
            prop="difficulty"
            label="难度（0.01~1，数值越大难度越大）"
          >
            <el-input-number
              v-model="editForm.difficulty"
              :precision="2"
              :step="0.05"
              :min="0.01"
              :max="1"
            />
          </el-form-item>
          <el-form-item prop="meme" label="备注">
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
          <el-divider />
          <p class="text-center">题型设置</p>
          <el-divider />
          <div>
            <p class="mb-2"><el-tag size="large">单选题设置</el-tag></p>
            <el-space
              :size="20"
              :spacer="h(ElDivider, { direction: 'vertical' })"
            >
              <el-form-item prop="choice_single_num" label="试题数量">
                <el-input-number
                  v-model="editForm.choice_single_num"
                  :min="0"
                  :max="100"
                />
              </el-form-item>
              <el-form-item prop="choice_single_score" label="每题分值">
                <el-input-number
                  v-model="editForm.choice_single_score"
                  :min="1"
                  :max="1000"
                  :disabled="editForm.choice_single_num <= 0"
                />
              </el-form-item>
            </el-space>
            <template
              v-for="(question, questionIndex) in questionBlock[0].list"
              :key="questionIndex"
            >
              <el-form-item
                prop="name"
                :label="
                  getQuestionSort(0, questionIndex) + '. ' + question.content
                "
              >
                <el-empty
                  v-if="question.id === 0"
                  description="待选择试题"
                  style="padding: 0"
                />
                <el-radio-group
                  v-else
                  :model-value="getChoiceSingleRight(question.options)"
                  readonly
                  class="clear-both"
                >
                  <el-space direction="vertical" alignment="start">
                    <el-radio
                      v-for="(option, optionIndex) in question.options"
                      :key="optionIndex"
                      :label="optionIndex + 1"
                      >{{
                        transformOptionTag(optionIndex + 1) +
                        ". " +
                        option.content
                      }}</el-radio
                    >
                  </el-space>
                </el-radio-group>
              </el-form-item>
              <el-button-group>
                <el-button
                  type="primary"
                  :icon="useRenderIcon(ArrowUp)"
                  :disabled="questionIndex === 0"
                  @click="sortUpQuestion(questionBlock[0].list, questionIndex)"
                  >上移</el-button
                >
                <el-button
                  type="primary"
                  :icon="useRenderIcon(ArrowDown)"
                  :disabled="questionIndex === questionBlock[0].list.length - 1"
                  @click="
                    sortDownQuestion(questionBlock[0].list, questionIndex)
                  "
                  >下移</el-button
                >
                <el-button type="primary" :icon="useRenderIcon(EditPen)"
                  >替换</el-button
                >
                <el-popconfirm
                  title="是否确认删除?"
                  @confirm="
                    deleteQuestion(questionBlock[0].list, questionIndex)
                  "
                >
                  <template #reference>
                    <el-button type="danger" :icon="useRenderIcon(Delete)"
                      >删除</el-button
                    >
                  </template>
                </el-popconfirm>
              </el-button-group>
              <el-divider />
            </template>
          </div>
          <el-divider />
          <div>
            <p class="mb-2"><el-tag size="large">多选题设置</el-tag></p>
            <el-space
              :size="20"
              :spacer="h(ElDivider, { direction: 'vertical' })"
            >
              <el-form-item prop="choice_multi_num" label="试题数量">
                <el-input-number
                  v-model="editForm.choice_multi_num"
                  :min="0"
                  :max="100"
                />
              </el-form-item>
              <el-form-item prop="choice_multi_score" label="每题分值">
                <el-input-number
                  v-model="editForm.choice_multi_score"
                  :min="1"
                  :max="1000"
                  :disabled="editForm.choice_multi_num <= 0"
                />
              </el-form-item>
            </el-space>
            <template
              v-for="(question, questionIndex) in questionBlock[1].list"
              :key="questionIndex"
            >
              <el-form-item
                prop="name"
                :label="
                  getQuestionSort(1, questionIndex) + '. ' + question.content
                "
              >
                <el-empty
                  v-if="question.id === 0"
                  description="待选择试题"
                  style="padding: 0"
                />
                <el-checkbox-group
                  v-else
                  :model-value="getChoiceMultiRight(question.options)"
                  readonly
                >
                  <el-space direction="vertical" alignment="start">
                    <el-checkbox
                      v-for="(option, optionIndex) in question.options"
                      :key="optionIndex"
                      :label="optionIndex + 1"
                      >{{
                        transformOptionTag(optionIndex + 1) +
                        ". " +
                        option.content
                      }}</el-checkbox
                    >
                  </el-space>
                </el-checkbox-group>
              </el-form-item>
              <el-button-group>
                <el-button
                  type="primary"
                  :icon="useRenderIcon(ArrowUp)"
                  :disabled="questionIndex === 0"
                  @click="sortUpQuestion(questionBlock[1].list, questionIndex)"
                  >上移</el-button
                >
                <el-button
                  type="primary"
                  :icon="useRenderIcon(ArrowDown)"
                  :disabled="questionIndex === questionBlock[1].list.length - 1"
                  @click="
                    sortDownQuestion(questionBlock[1].list, questionIndex)
                  "
                  >下移</el-button
                >
                <el-button type="primary" :icon="useRenderIcon(EditPen)"
                  >替换</el-button
                >
                <el-popconfirm
                  title="是否确认删除?"
                  @confirm="
                    deleteQuestion(questionBlock[1].list, questionIndex)
                  "
                >
                  <template #reference>
                    <el-button type="danger" :icon="useRenderIcon(Delete)"
                      >删除</el-button
                    >
                  </template>
                </el-popconfirm>
              </el-button-group>
              <el-divider />
            </template>
          </div>
          <el-divider />
          <div>
            <p class="mb-2"><el-tag size="large">判断题设置</el-tag></p>
            <el-space
              :size="20"
              :spacer="h(ElDivider, { direction: 'vertical' })"
            >
              <el-form-item prop="judge_num" label="试题数量">
                <el-input-number
                  v-model="editForm.judge_num"
                  :min="0"
                  :max="100"
                />
              </el-form-item>
              <el-form-item prop="judeg_score" label="每题分值">
                <el-input-number
                  v-model="editForm.judge_score"
                  :min="1"
                  :max="1000"
                  :disabled="editForm.judge_num <= 0"
                />
              </el-form-item>
            </el-space>
            <template
              v-for="(question, questionIndex) in questionBlock[2].list"
              :key="questionIndex"
            >
              <el-form-item
                prop="name"
                :label="
                  getQuestionSort(2, questionIndex) + '. ' + question.content
                "
              >
                <el-empty
                  v-if="question.id === 0"
                  description="待选择试题"
                  style="padding: 0"
                />
                <el-radio-group
                  v-else
                  :model-value="getJudgeRight(question.options)"
                  readonly
                >
                  <el-space direction="vertical" alignment="start">
                    <el-radio
                      v-for="(option, optionIndex) in question.options"
                      :key="optionIndex"
                      :label="optionIndex + 1"
                      >{{
                        transformOptionTag(optionIndex + 1) +
                        ". " +
                        option.content
                      }}</el-radio
                    >
                  </el-space>
                </el-radio-group>
              </el-form-item>
              <el-button-group>
                <el-button
                  type="primary"
                  :icon="useRenderIcon(ArrowUp)"
                  :disabled="questionIndex === 0"
                  @click="sortUpQuestion(questionBlock[2].list, questionIndex)"
                  >上移</el-button
                >
                <el-button
                  type="primary"
                  :icon="useRenderIcon(ArrowDown)"
                  :disabled="questionIndex === questionBlock[2].list.length - 1"
                  @click="
                    sortDownQuestion(questionBlock[2].list, questionIndex)
                  "
                  >下移</el-button
                >
                <el-button type="primary" :icon="useRenderIcon(EditPen)"
                  >替换</el-button
                >
                <el-popconfirm
                  title="是否确认删除?"
                  @confirm="
                    deleteQuestion(questionBlock[2].list, questionIndex)
                  "
                >
                  <template #reference>
                    <el-button type="danger" :icon="useRenderIcon(Delete)"
                      >删除</el-button
                    >
                  </template>
                </el-popconfirm>
              </el-button-group>
              <el-divider />
            </template>
          </div>
          <el-divider />
          <div>
            <p class="mb-2"><el-tag size="large">填空题设置</el-tag></p>
            <el-space
              :size="20"
              :spacer="h(ElDivider, { direction: 'vertical' })"
            >
              <el-form-item prop="blank_single_num" label="试题数量">
                <el-input-number
                  v-model="editForm.blank_single_num"
                  :min="0"
                  :max="100"
                />
              </el-form-item>
              <el-form-item prop="blank_single_score" label="每题分值">
                <el-input-number
                  v-model="editForm.blank_single_score"
                  :min="1"
                  :max="1000"
                  :disabled="editForm.blank_single_num <= 0"
                />
              </el-form-item>
            </el-space>
            <template
              v-for="(question, questionIndex) in questionBlock[3].list"
              :key="questionIndex"
            >
              <el-form-item
                prop="name"
                :label="
                  getQuestionSort(3, questionIndex) + '. ' + question.content
                "
              />
              <el-button-group>
                <el-button
                  type="primary"
                  :icon="useRenderIcon(ArrowUp)"
                  :disabled="questionIndex === 0"
                  @click="sortUpQuestion(questionBlock[3].list, questionIndex)"
                  >上移</el-button
                >
                <el-button
                  type="primary"
                  :icon="useRenderIcon(ArrowDown)"
                  :disabled="questionIndex === questionBlock[3].list.length - 1"
                  @click="
                    sortDownQuestion(questionBlock[3].list, questionIndex)
                  "
                  >下移</el-button
                >
                <el-button type="primary" :icon="useRenderIcon(EditPen)"
                  >替换</el-button
                >
                <el-popconfirm
                  title="是否确认删除?"
                  @confirm="
                    deleteQuestion(questionBlock[3].list, questionIndex)
                  "
                >
                  <template #reference>
                    <el-button type="danger" :icon="useRenderIcon(Delete)"
                      >删除</el-button
                    >
                  </template>
                </el-popconfirm>
              </el-button-group>
              <el-divider />
            </template>
          </div>
          <el-divider />
          <div>
            <p class="mb-2"><el-tag size="large">简答题设置</el-tag></p>
            <el-space
              :size="20"
              :spacer="h(ElDivider, { direction: 'vertical' })"
            >
              <el-form-item prop="answer_single_num" label="试题数量">
                <el-input-number
                  v-model="editForm.answer_single_num"
                  :min="0"
                  :max="100"
                />
              </el-form-item>
              <el-form-item prop="answer_single_score" label="每题分值">
                <el-input-number
                  v-model="editForm.answer_single_score"
                  :min="1"
                  :max="1000"
                  :disabled="editForm.answer_single_num <= 0"
                />
              </el-form-item>
            </el-space>
            <template
              v-for="(question, questionIndex) in questionBlock[5].list"
              :key="questionIndex"
            >
              <el-form-item
                prop="name"
                :label="
                  getQuestionSort(5, questionIndex) + '. ' + question.content
                "
              >
                <el-empty
                  v-if="question.id === 0"
                  description="待选择试题"
                  style="padding: 0"
                />
                <el-input
                  v-else
                  type="textarea"
                  minlength="1"
                  maxlength="5000"
                  show-word-limit
                  placeholder=""
                  disabled
                  :autosize="{ minRows: 6, maxRows: 12 }"
                />
              </el-form-item>
              <el-button-group>
                <el-button
                  type="primary"
                  :icon="useRenderIcon(ArrowUp)"
                  @click="sortUpQuestion(questionBlock[5].list, questionIndex)"
                  >上移</el-button
                >
                <el-button
                  type="primary"
                  :icon="useRenderIcon(ArrowDown)"
                  :disabled="questionIndex === questionBlock[5].list.length - 1"
                  @click="
                    sortDownQuestion(questionBlock[5].list, questionIndex)
                  "
                  >下移</el-button
                >
                <el-button type="primary" :icon="useRenderIcon(EditPen)"
                  >替换</el-button
                >
                <el-popconfirm
                  title="是否确认删除?"
                  @confirm="
                    deleteQuestion(questionBlock[5].list, questionIndex)
                  "
                >
                  <template #reference>
                    <el-button type="danger" :icon="useRenderIcon(Delete)"
                      >删除</el-button
                    >
                  </template>
                </el-popconfirm>
              </el-button-group>
              <el-divider />
            </template>
          </div>
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
      v-model="aiDialogVisible"
      :title="aiDialogTitle"
      width="80%"
      draggable
      center
      align-center
      destroy-on-close
    >
      <el-scrollbar max-height="60vh">
        <el-form ref="aiFormRef" :model="aiForm" label-position="top">
          <el-form-item prop="name" label="名称">
            <el-input
              v-model="aiForm.name"
              maxlength="50"
              show-word-limit
              placeholder="请输入试卷名称"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item
            prop="subject_id"
            :rules="aiRule.subject_id"
            label="科目"
          >
            <el-select
              v-model="aiForm.subject_id"
              placeholder="请选择科目"
              style="width: 50%"
            >
              <el-option label="请选择" :value="0" />
              <el-option
                v-for="(item, index) in subjectList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="knowledge_ids"
            :rules="aiRule.knowledge_ids"
            label="知识点"
          >
            <el-select
              v-model="aiForm.knowledge_ids"
              multiple
              placeholder="请选择知识点"
              style="width: 50%"
            >
              <el-option
                v-for="(item, index) in knowledgeList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="score" label="总分（完成题型设置后系统自动计算）">
            <el-input
              v-model="aiForm.score"
              maxlength="50"
              show-word-limit
              placeholder="试卷总分"
              style="width: 80%"
              disabled
            />
          </el-form-item>
          <el-form-item
            prop="pass_score"
            label="及格分（请完成题型设置后调整）"
          >
            <el-input-number
              v-model="aiForm.pass_score"
              :min="1"
              :max="aiForm.score"
            />
          </el-form-item>
          <el-form-item
            prop="difficulty"
            label="难度（0.01~1，数值越大难度越大）"
          >
            <el-input-number
              v-model="aiForm.difficulty"
              :precision="2"
              :step="0.05"
              :min="0.01"
              :max="1"
            />
          </el-form-item>
          <el-form-item prop="meme" label="备注">
            <el-input
              v-model="aiForm.memo"
              type="textarea"
              minlength="1"
              maxlength="255"
              show-word-limit
              placeholder="请输入备注"
              :autosize="{ minRows: 3, maxRows: 6 }"
              style="width: 80%"
            />
          </el-form-item>
          <el-divider />
          <p class="text-center">题型设置</p>
          <el-divider />
          <div>
            <p class="mb-2"><el-tag size="large">单选题设置</el-tag></p>
            <el-space
              :size="20"
              :spacer="h(ElDivider, { direction: 'vertical' })"
            >
              <el-form-item prop="choice_single_num" label="试题数量">
                <el-input-number
                  v-model="aiForm.choice_single_num"
                  :min="0"
                  :max="100"
                />
              </el-form-item>
              <el-form-item prop="choice_single_score" label="每题分值">
                <el-input-number
                  v-model="aiForm.choice_single_score"
                  :min="1"
                  :max="1000"
                  :disabled="aiForm.choice_single_num <= 0"
                />
              </el-form-item>
            </el-space>
          </div>
          <el-divider />
          <div>
            <p class="mb-2"><el-tag size="large">多选题设置</el-tag></p>
            <el-space
              :size="20"
              :spacer="h(ElDivider, { direction: 'vertical' })"
            >
              <el-form-item prop="choice_multi_num" label="试题数量">
                <el-input-number
                  v-model="aiForm.choice_multi_num"
                  :min="0"
                  :max="100"
                />
              </el-form-item>
              <el-form-item prop="choice_multi_score" label="每题分值">
                <el-input-number
                  v-model="aiForm.choice_multi_score"
                  :min="1"
                  :max="1000"
                  :disabled="aiForm.choice_multi_num <= 0"
                />
              </el-form-item>
            </el-space>
          </div>
          <el-divider />
          <div>
            <p class="mb-2"><el-tag size="large">判断题设置</el-tag></p>
            <el-space
              :size="20"
              :spacer="h(ElDivider, { direction: 'vertical' })"
            >
              <el-form-item prop="judge_num" label="试题数量">
                <el-input-number
                  v-model="aiForm.judge_num"
                  :min="0"
                  :max="100"
                />
              </el-form-item>
              <el-form-item prop="judeg_score" label="每题分值">
                <el-input-number
                  v-model="aiForm.judge_score"
                  :min="1"
                  :max="1000"
                  :disabled="aiForm.judge_num <= 0"
                />
              </el-form-item>
            </el-space>
          </div>
          <el-divider />
          <div>
            <p class="mb-2"><el-tag size="large">填空题设置</el-tag></p>
            <el-space
              :size="20"
              :spacer="h(ElDivider, { direction: 'vertical' })"
            >
              <el-form-item prop="blank_single_num" label="试题数量">
                <el-input-number
                  v-model="aiForm.blank_single_num"
                  :min="0"
                  :max="100"
                />
              </el-form-item>
              <el-form-item prop="blank_single_score" label="每题分值">
                <el-input-number
                  v-model="aiForm.blank_single_score"
                  :min="1"
                  :max="1000"
                  :disabled="aiForm.blank_single_num <= 0"
                />
              </el-form-item>
            </el-space>
          </div>
          <el-divider />
          <div>
            <p class="mb-2"><el-tag size="large">简答题设置</el-tag></p>
            <el-space
              :size="20"
              :spacer="h(ElDivider, { direction: 'vertical' })"
            >
              <el-form-item prop="answer_single_num" label="试题数量">
                <el-input-number
                  v-model="aiForm.answer_single_num"
                  :min="0"
                  :max="100"
                />
              </el-form-item>
              <el-form-item prop="answer_single_score" label="每题分值">
                <el-input-number
                  v-model="aiForm.answer_single_score"
                  :min="1"
                  :max="1000"
                  :disabled="aiForm.answer_single_num <= 0"
                />
              </el-form-item>
            </el-space>
          </div>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="aiDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAiEditForm">提交</el-button>
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
