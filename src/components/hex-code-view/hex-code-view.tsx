import type { StateType } from "./hex-code-view.d";
import { onUnmounted, SetupContext } from "vue";
import {
  defineComponent,
  reactive,
  toRefs,
  shallowRef,
  computed,
  watch,
  onMounted,
} from "vue";
import { parse } from "@vue/compiler-sfc";
import { isNil, assign } from "lodash-es";
import { BuiltSetupFunction } from "./helper";
import { genStyleInjectionCode, stylesUpdateHandler, stylesDeleteHandler } from './style-loader';

export default defineComponent({
  name: "HexCodeView",
  props: {
    value: {
      type: String,
      required: true,
      default: "",
    },
  },
  setup(props) {
    const { value } = toRefs(props);
    const state = reactive<StateType>({
      sfcCode: ``,
      sfcDescriptor: null,
      hasError: false,
      errorMessage: "",
    });

    const dynamicComponent = shallowRef({
      name: "",
      component: {
        template: "<div></div>",
      },
    });

    watch(
      () => value.value,
      (val) => {
        state.sfcCode = val;
      },
      {
        immediate: true,
        deep: true,
      }
    );
    // 监听字符串变化
    watch(
      () => state.sfcCode,
      () => {
        state.sfcDescriptor = parse(state.sfcCode.trim());
      },
      {
        immediate: true,
        deep: true,
      }
    );

    /** 生成Vue组件 */
    async function useGenerateComponent() {
      let _generateComponent: any = {};
      if (isNil(state.sfcDescriptor)) return;
      const { template, script, styles } = state.sfcDescriptor.descriptor;
      
      let { errors } = state.sfcDescriptor;
      //   错误警告
      if (errors && errors.length) {
        console.error(
          `Error compiling template:\n\n` +
            errors.map((e) => `  - ${e}`).join("\n") +
            "\n\n"
        );
      }

      /** template 字符串 */
      const templateCode = template ? template.content.trim() : ``;
      /** script 字符串 */
      let scriptCode = script ? script.content.trim() : ``;
      /** style 字符串 */
      let styleCodes = await genStyleInjectionCode(styles, "hex-code-view-container");

      // template
      _generateComponent.template = `<div class="hex-code-view-container" >${templateCode}</div>`;
      // script
      if (!isNil(scriptCode)) {
        let componentScript = {};
        scriptCode = scriptCode.replace(
          /export\s+default/,
          "componentScript ="
        );
        componentScript = BuiltSetupFunction(scriptCode);
        assign(_generateComponent, componentScript);
      }

      // style
      stylesUpdateHandler(styleCodes);

      dynamicComponent.value = {
        name: "DynamicComponent",
        component: _generateComponent,
      };
    };

    const isCodeEmpty = computed(() => {
      return !(state.sfcCode && !isNil(state.sfcCode.trim()));
    });

    /** 代码检查 */
    const useCodeLint = () => {
      // 校验代码是否为空
      state.hasError = isCodeEmpty.value;
      state.errorMessage = isCodeEmpty.value ? "代码不能为空" : null;
      // 代码为空 跳出检查
      if (isCodeEmpty) return;
      if (isNil(state.sfcDescriptor)) return;
      // 校验代码是否存在<template>
      const { template } = state.sfcDescriptor.descriptor;
      const templateCode =
        template && template.content ? template.content.trim() : ``;
      const isTemplateEmpty = isNil(templateCode);
      state.hasError = isTemplateEmpty;
      state.errorMessage = isTemplateEmpty ? "代码中必须包含<template>" : null;
      // 代码为空 跳出检查
      if (isTemplateEmpty) return;
    };

    const build = async (value: string) => {
      state.sfcCode = value;
      useCodeLint();
      !state.hasError && await useGenerateComponent();
    };

    onMounted(async () => {
      await useGenerateComponent();
    });

    onUnmounted(() => {
      stylesDeleteHandler();
    })

    return {
      ...toRefs(state),
      dynamicComponent,
      build,
    };
  },
  render(props: any, context: SetupContext) {
    const customComponent = this.dynamicComponent.component;

    return (
      <>
        <customComponent></customComponent>
      </>
    );
  },
});
