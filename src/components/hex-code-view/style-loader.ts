import { isNil } from "lodash-es";
import type { SFCStyleBlock } from "@vue/compiler-sfc";
import less from 'less';

/**
 * @param cssText 样式
 * @param parentId 组件标识 作为根元素，进行样式隔离
 * @returns 
 */
async function rootParentIdMixIn(cssText: string, parentId: string) {
  const rootMixin = ` 
  .${parentId} {
    ${cssText}
  }  
  `;
  // 使用 sass 进行处理 格式化
  const result = await styleLoader('less', less, rootMixin);
  return result;
}

/**
 * 
 * @param styles ast style
 * @param parentId 唯一标识
 * @returns 
 */
export async function genStyleInjectionCode(
  styles: Array<SFCStyleBlock & { css?: string }>,
  parentId: string
) {
  let styleCodes: any[] = [];
  const arr  = styles.map(async (style) => {
    if (style.lang == 'less') {
      const result = await styleLoader('less', less, style.content.trim());
      const res = await rootParentIdMixIn(result, parentId);
      style.css = res;
      styleCodes.push(style);
    } else if (style.lang != null) {
      console.log(`the ${style.lang} is unsupported !`);
    } else if (isNil(style.lang)) {
      style.css = await rootParentIdMixIn(style.content.trim(), parentId);
      styleCodes.push(style);
    }
    return style
  });
  return Promise.all(arr)
}
export function stylesDeleteHandler() {
  const ssrIdKey = "data-vcv-id";
  const head = document.head || document.getElementsByTagName("head")[0];
  let oldStyle: any = document.getElementById(ssrIdKey);
  if (!!oldStyle) {
    head.removeChild(oldStyle);
  }
}

export function stylesUpdateHandler(data: any[]) {
  if (!data) return
  const ssrIdKey = "data-vcv-id";
  data.map((item) => {
    insertCustomCssToHead(item?.css ?? '', ssrIdKey)
  })
}

export const insertCustomCssToHead = function (cssCode: string, id: string) {
  const head = document.head || document.getElementsByTagName("head")[0];
  let oldStyle: any = document.getElementById(id);
  if (!!oldStyle) {
    head.removeChild(oldStyle);
  }
  let newStyle: any = document.createElement('style');
  newStyle.type = 'text/css';
  newStyle.rel = 'stylesheet';
  newStyle.id = id;
  try {
    newStyle.appendChild(document.createTextNode(cssCode));
  } catch (ex) {
    newStyle.styleSheet.cssText = cssCode;
  }
  head.appendChild(newStyle);
};

/**
 * 
 * @param name style插件名
 * @param name style插件依赖
 * @param source 待解析 style 字符串
 * @param options style插件配置
 * @param fn style插件自定义解析回调
 * @returns 
 */
export async function styleLoader(name: string, nameSource: any, source: string, options?: any, fn?: (implementation: any) => any) {
  if (!nameSource) {
    console.log(`Failed to resolve loader: ${name} ! You may need to install it.`);
    return;
  }
  let result;
  try {
    let implementation = nameSource;
    switch (name) {
      case 'less':
        result = await implementation.render(source, options);
        result = result.css;
        break;
      case 'sass':
        result = await implementation.compileString(source, options);
          break;
      default:
        if (!!fn) {
          result = fn(implementation)
          break;
        }
        console.log("请自行实现解析方法")
        break;
    }
  } catch (error) {
    console.log(
      "%c Style解析错误:",
      "color: #FFFFFF; background: #f5222d; font-size: 13px;",
      error
    );
    return;
  }
  return result;
}
