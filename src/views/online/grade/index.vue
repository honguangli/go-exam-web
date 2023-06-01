<script setup lang="ts">
// import { ref } from "vue";
import { useHook } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";
// import { useRenderIcon } from "@/components/ReIcon/src/hooks";

// import View from "@iconify-icons/ep/view";
// import Search from "@iconify-icons/ep/search";
// import Refresh from "@iconify-icons/ep/refresh";

//const formRef = ref();
const {
  //searchForm,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  //resetForm,
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
      <el-form-item label="考试名称：" prop="name">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入考试名称"
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
    </el-form> -->

    <PureTableBar title="成绩列表" @refresh="onSearch">
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
        />
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
