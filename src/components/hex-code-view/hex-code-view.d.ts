import type { SFCParseResult } from "@vue/compiler-sfc";

export interface StateType {
    /** sfc字符串代码 */
    sfcCode: string;
    /** SFC解析结果 */
    sfcDescriptor: SFCParseResult | null;
    /** 语法是否错误 */
    hasError: boolean;
    /** 错误信息 */
    errorMessage: string | null;
}