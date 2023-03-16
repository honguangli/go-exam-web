<script setup lang="ts">
import { useHook } from "./hook";
import { QuestionType } from "@/api/exam/models/question";

const { questionList, questionBlock, submitEditForm } = useHook();
</script>

<template>
  <div class="main">
    <el-space :fill="true" wrap style="width: 100%">
      <el-card class="box-card">
        <el-descriptions
          class="margin-top"
          title="基本信息"
          :column="2"
          size="large"
          border
        >
          <el-descriptions-item :span="2">
            <template #label>
              <div class="cell-item">考试名称</div>
            </template>
            计算机组网技术
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">考生账号</div>
            </template>
            2023030902
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">考试姓名</div>
            </template>
            张三
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
      <el-card class="box-card">
        <el-row :gutter="20" style="margin-bottom: 10px">
          <el-col :span="6">答题卡</el-col>
          <el-col :span="6" :offset="12">
            <el-tag class="ml-2" type="success">已作答</el-tag>
            <el-tag class="ml-2" type="info">未作答</el-tag>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <template v-for="(item, index) in questionList" :key="index">
              <el-tag
                v-if="item.answer === '' && item.answer_multi.length === 0"
                class="ml-2"
                type="info"
                >{{ index + 1 }}</el-tag
              >
              <el-tag v-else class="ml-2" type="success">{{
                index + 1
              }}</el-tag>
            </template>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <el-form ref="editFormRef" label-position="top">
          <template v-for="(item, index) in questionBlock" :key="index">
            <template v-if="item.type === QuestionType.ChoiceSingle">
              <p style="margin-bottom: 10px">
                {{ item.title }}（共{{ item.list.length }}题，每题{{
                  item.score
                }}分，共{{ item.list.length * item.score }}分）
              </p>
              <el-form-item
                v-for="(question, questionIndex) in item.list"
                :key="questionIndex"
                prop="name"
                :label="question.sort + '. ' + question.content"
              >
                <el-radio-group v-model="question.answer">
                  <el-space direction="vertical" alignment="start">
                    <el-radio
                      v-for="(option, optionIndex) in question.options"
                      :key="optionIndex"
                      :label="option.tag"
                      >{{ option.content }}</el-radio
                    >
                  </el-space>
                </el-radio-group>
              </el-form-item>
            </template>
            <template v-else-if="item.type === QuestionType.ChoiceMulti">
              <p style="margin-bottom: 10px">
                {{ item.title }}（共{{ item.list.length }}题，每题{{
                  item.score
                }}分，共{{ item.list.length * item.score }}分）
              </p>
              <el-form-item
                v-for="(question, questionIndex) in item.list"
                :key="questionIndex"
                prop="name"
                :label="question.sort + '. ' + question.content"
              >
                <el-checkbox-group v-model="question.answer_multi">
                  <el-space direction="vertical" alignment="start">
                    <el-checkbox
                      v-for="(option, optionIndex) in question.options"
                      :key="optionIndex"
                      :label="option.tag"
                      >{{ option.content }}</el-checkbox
                    >
                  </el-space>
                </el-checkbox-group>
              </el-form-item>
            </template>
            <template v-if="item.type === QuestionType.Judge">
              <p style="margin-bottom: 10px">
                {{ item.title }}（共{{ item.list.length }}题，每题{{
                  item.score
                }}分，共{{ item.list.length * item.score }}分）
              </p>
              <el-form-item
                v-for="(question, questionIndex) in item.list"
                :key="questionIndex"
                prop="name"
                :label="question.sort + '. ' + question.content"
              >
                <el-radio-group v-model="question.answer">
                  <el-space direction="vertical" alignment="start">
                    <el-radio
                      v-for="(option, optionIndex) in question.options"
                      :key="optionIndex"
                      :label="option.tag"
                      >{{ option.content }}</el-radio
                    >
                  </el-space>
                </el-radio-group>
              </el-form-item>
            </template>
            <template v-if="item.type === QuestionType.AnswerSingle">
              <p style="margin-bottom: 10px">
                {{ item.title }}（共{{ item.list.length }}题，每题{{
                  item.score
                }}分，共{{ item.list.length * item.score }}分）
              </p>
              <el-form-item
                v-for="(question, questionIndex) in item.list"
                :key="questionIndex"
                prop="name"
                :label="question.sort + '. ' + question.content"
              >
                <el-input
                  v-model="question.answer"
                  type="textarea"
                  minlength="1"
                  maxlength="5000"
                  show-word-limit
                  placeholder=""
                  :autosize="{ minRows: 6, maxRows: 12 }"
                />
              </el-form-item>
            </template>
          </template>
        </el-form>
        <div style="margin-bottom: 30px; text-align: center">
          <el-button type="primary" size="large" @click="submitEditForm"
            >提交</el-button
          >
        </div>
      </el-card>
    </el-space>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
