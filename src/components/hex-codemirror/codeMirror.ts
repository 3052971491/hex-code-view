import CodeMirror from 'codemirror';
// import 'codemirror/lib/codemirror.css'
// css
import "codemirror/addon/hint/show-hint.css";
import './codemirror.css';
import 'codemirror/theme/idea.css';
import 'codemirror/theme/material-palenight.css';
// modes
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/vue/vue';

// 自动刷新依赖
import 'codemirror/addon/display/autorefresh'
// 行高亮依赖
import 'codemirror/addon/selection/active-line'

// 语法校验基础依赖
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/lint/yaml-lint.js'
import 'codemirror/addon/lint/javascript-lint.js'
import 'codemirror/addon/lint/json-lint.js'

// 折叠功能
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/comment-fold.js'
import 'codemirror/addon/fold/xml-fold.js'
import 'codemirror/addon/fold/markdown-fold.js'
import 'codemirror/addon/fold/indent-fold.js'


// 查找
import 'codemirror/addon/scroll/annotatescrollbar.js'
import 'codemirror/addon/search/matchesonscrollbar.js'
import 'codemirror/addon/search/match-highlighter.js'
import 'codemirror/addon/search/jump-to-line.js'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/search.js'

// 滚动条
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/scroll/simplescrollbars.js' 
export { CodeMirror };
