<template>
  <div class="hex-monaco-editor m-e w-full h-full overflow-hidden">
    <div class="m-e-main">
      <!-- <div class="m-e-main_toolbar w-full flex" :style="
        false
          ? 'background-color: #fff; box-shadow: 0px 2px 5px #ddd;'
          : 'background-color: #1e1e1e; box-shadow: 0px 2px 5px #111;'
      ">
        <div class="m-e-main_toolbar_left flex-1" :style="false ? 'color: #000' : 'color: #fff'">
          <span>{{ title }}</span>
        </div>
        <div class="m-e-main_toolbar_right" :style="false ? 'color: #000' : 'color: #fff'">
        </div>
      </div> -->
      <div ref="el" class="m-e-main_container"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { isNil } from 'lodash-es';
import { ref, onMounted, onUnmounted, watchEffect, nextTick, computed } from 'vue';
import { CodeMirror } from './codeMirror';
import { MODE } from './typing';

const props = withDefaults(defineProps<{
  mode?: string | MODE;
  value: string;
  readonly?: boolean;
  theme?: string;
}>(), {
  mode: MODE.VUE,
  value: '',
  readonly: false,
  theme: 'idea',
})

const title = ref('在线编辑器');

const emit = defineEmits(['update:value', 'change']);

const el = ref();
let editor: CodeMirror.Editor | null;

const content = computed({
  set(value: string) {
    const oldValue = editor?.getValue();
    if (value !== oldValue) {
      editor?.setValue(value ? value : '');
    }
    emit('update:value', editor?.getValue())
    emit('change', editor?.getValue())
  },
  get() {
    return !isNil(props.value) ? props.value : '';
  },
});

watchEffect(() => {
  editor?.setOption('mode', props.mode);
});

function refresh() {
  editor?.refresh();
}

async function init() {
  const addonOptions = {
    autoCloseBrackets: true,
    autoCloseTags: true,
    foldGutter: true,
    // 是否开启语法校验
    lint: true,
    // 使用的语法校验工具
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    // 光标背景行高亮
    styleActiveLine: true,
    // 自动刷新
    autoRefresh: true,
    // 自动缩进是否开启
    smartIndent: true,
    // 括号匹配
    matchBrackets: true,
    // 自动换行                
    lineWrapping: true,
    // scrollbars: 'simple'
  };

  editor = CodeMirror(el.value!, {
    value: '',
    mode: props.mode,
    readOnly: props.readonly,
    tabSize: 2,
    theme: props.theme,
    lineNumbers: true,
    ...addonOptions,
  });
  editor?.setValue(content.value);
  editor?.on('change', () => {
    content.value = editor?.getValue() ?? '';
  });
}

/**
 * 设置编辑器的内容
 */
 function setEditorContent(val: any) {
  editor?.setValue(val);

}

/**
 * 获取编辑器的内容
 */
function getEditorContent() {
  return editor?.getValue();
}

defineExpose({content, refresh, setEditorContent, getEditorContent});

onMounted(async () => {
  nextTick(() => {
    init();
  })
});

onUnmounted(() => {
  editor = null;
});
</script>
<style lang="less" scoped>
.m-e {
  
  width: 100%;
  height: 100%;

  .m-e-main {
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    display: flex;
    flex-direction: column;

    .m-e-main_toolbar {
      position: relative;
      z-index: 99;
      height: 40px;
      box-shadow: 0px 2px 5px #000;

      .m-e-main_toolbar_left {
        span {
          padding-left: 10px;
          font-size: 15px;
          line-height: 40px;
          user-select: none;
        }
      }

      .m-e-main_toolbar_right {
        display: flex;
        align-items: center;
        margin-right: 10px;

        .icon {
          display: inline-block;
          margin-left: 4px;
          padding: 4px;
          font-size: 16px;
          border-radius: 2px;
          text-align: center;
          transition: ease all 0.3s;
          cursor: pointer;

          &:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
        }
      }
    }

    .m-e-main_container {
      height: 100%;
      min-height: 400px;
    }
  }
}
</style>