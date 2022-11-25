<script setup lang="ts">
import { HexCodeView, HexMonacoEditor, HexCodemirror } from './components/index';
import { sfcTemplateCode, sfcSetupTemplateCode } from './components/hex-code-view/helper'
import { ref } from 'vue';
const code = ref(sfcTemplateCode);
const CodeView = ref();
const editor = ref();
const handleChangeClick = () => {
  CodeView.value.build(code.value);
}

const templateType = ref(0);

const handleTypeChange = () => {
  code.value = templateType.value ? sfcSetupTemplateCode : sfcTemplateCode;
  editor.value.setEditorContent(code.value)
}
</script>
 
<template>
  <div class="layout">
    <header>
      <div>
        <div class="title">Hex Code View</div>
        <div class="desc">一个轻量级代码交互组件可以编辑、运行和预览代码效果，在网页上实时显示</div>
      </div>
      <div>
        <a-radio-group v-model:value="templateType" @change="handleTypeChange">
          <a-radio-button :value="0">选项式API模板</a-radio-button>
          <a-radio-button :value="1">组合式API模板</a-radio-button>
        </a-radio-group>
        <a-button size="large" type="primary" @click="handleChangeClick" class="ml-4">运行</a-button>
      </div>
    </header>
    <div class="main-container">
      <div class="code-editor flex-1">
        <HexCodemirror ref="editor" v-model:value="code" language="vue" />
      </div>
      <div class="preview-container box flex-1">
        <HexCodeView  ref="CodeView" :value="code"></HexCodeView>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>

.layout {
  width: 100%;
  height: 100%;
  padding: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.layout header {
  width: 100%;
  height: 60px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title {
    font-size: 24px;
    font-weight: bold;
  }

  .desc {
    color: rgba(60, 60, 60, .7);
  }
}
.main-container {
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.flex-1 {
  flex: 1;
}

.box {
  border: 1px solid grey;;
}

.code-editor {
  width: 100%;
  height: 100%;
  flex: 1;
}

.preview-container {
  width: 100%;
  height: 100%;
  margin-left: 12px;
}
</style>
