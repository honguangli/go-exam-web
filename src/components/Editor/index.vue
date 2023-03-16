<template>
  <div class="warp">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      mode="default"
    />
    <Editor
      style="height: 300px; overflow-y: hidden"
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
import { IDomEditor, DomEditor, IToolbarConfig } from "@wangeditor/editor";
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
const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: [
    "bold",
    "underline",
    "italic",
    {
      key: "group-more-style",
      title: "更多",
      iconSvg:
        '<svg viewBox="0 0 1024 1024"><path d="M204.8 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M505.6 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M806.4 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path></svg>',
      menuKeys: ["through", "sup", "sub", "clearStyle"]
    },
    "color",
    "|",
    "fontSize",
    "fontFamily",
    "lineHeight",
    "|",
    "undo",
    "redo"
  ]
};
const editorConfig = { placeholder: "请输入内容..." };

function onChange(editor: IDomEditor) {
  console.log("onChange", editor.getHtml(), editor.getText());

  const toolbar = DomEditor.getToolbar(editorRef.value);

  const curToolbarConfig = toolbar?.getConfig();
  console.log(
    "toolbarKeys",
    curToolbarConfig?.toolbarKeys,
    editor.getAllMenuKeys()
  ); // 当前菜单排序和分组
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
  width: 100%;
  border: var(--el-border);
}
</style>
