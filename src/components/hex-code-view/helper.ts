import {
  reactive,
  isReactive,
  shallowReactive,
  toRef,
  toRefs,
  shallowRef,
  triggerRef,
  customRef,
  ref,
  unref,
  isRef,
  isProxy,
  readonly,
  shallowReadonly,
  toRaw,
  markRaw,
  computed,
  watch,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onErrorCaptured,
  nextTick,
  provide,
  inject
} from "vue";

export const SetupApi = {
  // 基础类型响应式
  "ref": ref,
  "unref": unref,
  "isRef": isRef,
  "toRef": toRef,
  "toRefs": toRefs,
  "shallowRef": shallowRef,
  "triggerRef": triggerRef ,
  "customRef": customRef,

  // 复杂类型响应式
  "reactive": reactive,
  "shallowReactive": shallowReactive,
  "isReactive": isReactive,

  "readonly": readonly,
  "shallowReadonly": shallowReadonly,
  "toRaw": toRaw,
  "markRaw": markRaw,
  "isProxy": isProxy,
  "computed": computed,
  "watch": watch,
  
  // 依赖注入
  "provide": provide,
  "inject ": inject ,

  // 生命周期
  "onBeforeMount": onBeforeMount,
  "onMounted": onMounted,
  "onBeforeUpdate": onBeforeUpdate,
  "onUpdated": onUpdated,
  "onBeforeUnmount": onBeforeUnmount,
  "onUnmounted": onUnmounted,
  "onErrorCaptured": onErrorCaptured,

  // 其他
  "nextTick": nextTick,
}

/** 选项Api模板 */
export const sfcTemplateCode: string = `<template>
  <div class="hex-code-view">
    <h1>{{ formatName }}</h1>
    <a-button @click="useChangeFlag">
      {{ flag ? '查看' : '隐藏' }}
      我的爱好
    </a-button>
  
    <template v-if="list.length > 0">
      <div v-for="(item, index) in list" :key="index">{{ item }}</div>
    </template>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        flag: true,
        name: '蔡徐坤',
        list: [],
      }
    },
    computed: {
      formatName() {
        return "我是" + this.name;
      }
    },
    mounted() {
      console.log('onMounted!!')
    },
    methods: {
      useChangeFlag() {
        this.flag = !this.flag;
        this.list = this.flag ? [] : ['唱', '跳', 'rap', '篮球']
      }
    }
  };
</script>

<style lang="less">
.hex-code-view {
  
  h1 {
    color: pink;
    font-size: 20px;
  }
}
</style>`;

/** 组合是API模板 */
export const sfcSetupTemplateCode: string = `<template>
  <div class="hex-code-view">
    <h1>{{ formatName }}</h1>
    <a-button @click="useChangeFlag">
      {{ flag ? '查看' : '隐藏' }}
      我的爱好
    </a-button>

    <template v-if="data.list.length > 0">
      <div v-for="(item, index) in data.list" :key="index">{{ item }}</div>
    </template>
  </div>
</template>

<script>
  export default {
    props: {},
    emits: [],
    setup(props, context) {
      onMounted(()=> {
        console.log('onMounted!!')
      })

      const flag = ref(true);
      const name = "蔡徐坤";

      const data = reactive({
        list: []
      })
      const useChangeFlag = () => {
        flag.value = !flag.value;
        data.list = flag.value ? [] : ['唱', '跳', 'rap', '篮球']
      }
      const formatName = computed(() => {
        return "我是" + name;
      })
      return {
        data,
        flag,
        useChangeFlag,
        formatName
      }
    },
  };
</script>

<style lang="less">
.hex-code-view {
  
  h1 {
    color: pink;
    font-size: 20px;
  }
}
</style>`;

export function BuiltSetupFunction(code: string) {
  let componentScript = {}
  let scriptCode = `try {
  /////////////////////////////////// 内置模块 vue api 开始 ///////////////////////////////////
  const {
    reactive,
    isReactive,
    shallowReactive,
    toRef,
    toRefs,
    shallowRef,
    triggerRef,
    customRef,
    ref,
    unref,
    isRef,
    isProxy,
    readonly,
    shallowReadonly,
    toRaw,
    markRaw,
    computed,
    watch,
    onBeforeMount,
    onMounted,
    onBeforeUpdate,
    onUpdated,
    onBeforeUnmount,
    onUnmounted,
    onErrorCaptured,
    nextTick,
    provide,
    inject 
  } = vue;
  /////////////////////////////////// 内置模块 vue api 结束 ///////////////////////////////////

  /////////////////////////////////// 自定义模块 开始 /////////////////////////////////////////
  ${code}
  /////////////////////////////////// 自定义模块 结束 /////////////////////////////////////////

  return componentScript
} catch (error) {
  console.error(error)
}`;

  componentScript = new Function("componentScript", "vue", scriptCode).call(
    null,
    componentScript,
    SetupApi
  );
  return componentScript
}