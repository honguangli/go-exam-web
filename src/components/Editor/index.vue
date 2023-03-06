<template>
  <div class="warp">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      mode="default"
    />
    <Editor
      style="height: 500px; overflow-y: hidden"
      v-model="value"
      :defaultConfig="editorConfig"
      mode="default"
      @onCreated="editor => (editorRef = editor)"
      @onChange="onChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef } from "vue";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { IDomEditor } from "@wangeditor/editor";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  }
});

const editorRef = shallowRef();
const toolbarConfig: any = { excludeKeys: "fullScreen" };
const editorConfig = { placeholder: "请输入内容..." };

function onChange(editor: IDomEditor) {
  console.log("onChange", editor.getHtml(), editor.getText());
}

onMounted(() => {
  console.log("onMounted");
});

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  console.log("onBeforeUnmount");
  if (editorRef.value == null) {
    return;
  }
  console.log("onBeforeUnmount destroy");
  editorRef.value.destroy();
});
</script>

<style lang="scss" scoped>
.warp {
  border: var(--el-border);
}
</style>
