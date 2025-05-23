---
title: UI
home: true
heroImage: https://raw.githubusercontent.com/Creator-SN/PowerEditor/master/src/modules/editor/src/assets/logo.svg
actionLink: /
features:
    - title: Most WYSIWYG Editor
      details: 基于Microsoft Fluent Design System设计
    - title: 基于 Tiptap
      details: 所见即所得
footer: MIT Licensed | Copyright © 2023 Creator SN
---

<script>
export default {
    data () {
        return {
            value: `<p>I’m running PowerEditor with Vue.js. 🎉</p>`,
            readonly: false,
            mdContent: "",
            theme: "light"
        }
    },
    mounted () {
        
    },
    methods: {
        openMarkdown () {
            let files = this.$refs.input.files;
            if (files.length > 0) {
                let file = files[0];
                let reader = new FileReader();
                reader.onload = (e) => {
                    this.mdContent = e.target.result;
                    this.parseMD(this.mdContent)
                }
                reader.readAsText(file);
            }
        },
        parseMD (str) {
            let obj = this.$refs.editor.computeMarkdown(str);
            this.value = obj;
        },
        saveJson (content) {
            console.log(content);
        },
        saveHTML (content) {
            console.log(content);
        },
        outputMarkdown () {
            let content = this.$refs.editor.saveMarkdown();
            console.log(content);
        }
    }
}
</script>

<div style="display: flex;">
<input v-show="false" type="file" accept=".md" ref="input" @change="openMarkdown"/>
<fv-button :theme="theme" borderRadius="35" style="width: 35px; height: 35px; margin: 15px 0px;" @click="theme = theme == 'light' ? 'dark' : 'light'"><i class="ms-Icon" :class="[`ms-Icon--${theme === 'light' ? 'Sunny' : 'ClearNight'}`]"></i></fv-button>
<fv-button :theme="theme" borderRadius="35" style="width: 35px; height: 35px; margin: 15px 0px 0px 15px;" @click="$refs.input.click()"><i class="ms-Icon" :class="[`ms-Icon--OpenFile`]"></i></fv-button>
<fv-button :theme="theme" borderRadius="35" style="width: 35px; height: 35px; margin: 15px 0px 0px 15px;" @click="readonly = readonly == true ? false : true"><i class="ms-Icon" :class="[`ms-Icon--${readonly === true ? 'Edit' : 'ReadingMode'}`]"></i></fv-button>
<fv-button :theme="theme" borderRadius="35" style="width: 35px; height: 35px; margin: 15px 0px 0px 15px;" @click="outputMarkdown"><i class="ms-Icon" :class="[`ms-Icon--SaveAs`]"></i></fv-button>
</div>

<power-editor :value="value" :theme="theme" :editable="!readonly" ref="editor" style="width:100%" @save-json="saveJson" @save-html="saveHTML" />

### Propoties

---

|       属性(attr)        |    类型(type)    | 必填(required) |                默认值(default)                 |             说明(statement)              |
|:-----------------------:|:----------------:|:--------------:|:----------------------------------------------:|:----------------------------------------:|
|          value          |     [string]     |       No       | <p>I’m running PowerEditor with Vue.js. 🎉</p> |       文本内容, 支持纯文本及 HTML        |
|        editable         |      [bool]      |       No       |                      true                      |              编辑器是否只读              |
|       placeholder       |     [string]     |       No       |               Write something …                |            编辑器 Placeholder            |
|   disabledPlaceholder   |      [bool]      |       No       |                     false                      |          禁用编辑器 Placeholder          |
|     contentMaxWidth     |     [number]     |       No       |                     900px                      |             内容最大显示宽度             |
|    editorBackground     | [string(color)]  |       No       |                                                |             编辑器内部背景色             |
| editorOutSideBackground | [string(color)]  |       No       |                                                |             编辑器外部背景色             |
|   mobileDisplayWidth    |     [number]     |       No       |                      768                       |                移动端模式                |
|       showToolBar       |      [bool]      |       No       |                      true                      |              显示菜单工具栏              |
|      toolbarHeight      |     [number]     |       No       |                       70                       |                菜单栏高度                |
|    toolbarBackground    | [string(color)]  |       No       |                                                |                菜单栏背景                |
|   toolbarBorderRadius   |     [number]     |       No       |                       8                        |              菜单栏边框圆角              |
|   editablePaddingTop    |     [number]     |       No       |                      N/A                       | 可编辑模式下的顶部内边距, 不定义时不生效 |
|   readOnlyPaddingTop    |     [number]     |       No       |                       5                        |          只读模式下的顶部内边距          |
|  editablePaddingBottom  |     [number]     |       No       |                      315                       |         可编辑模式下的底部内边距         |
|  readOnlyPaddingBottom  |     [number]     |       No       |                       55                       |          只读模式下的底部内边距          |
|     imgInterceptor      |    [function]    |       No       |                      N/A                       | 图片上传拦截器, 用于后置处理图像内的数据 |
|     mentionItemAttr     |     [object]     |       No       |                      N/A                       |             MentionItem 属性             |
|       starterKit        |     [object]     |       No       |                     ()=>{}                     |        `StarterKit`相关自定义配置        |
|  showControlOnReadonly  |      [bool]      |       No       |                      true                      |         只读模式下是否显示控制栏         |
|  mdDecNodeFuncsPlugins  |     [object]     |       No       |                      N/A                       |        Markdown 解码器自定义配置         |
|         mdFlags         |     [object]     |       No       |                      N/A                       |      Markdown 解码器自定义层级标记       |
|       foreground        | [string(color)]  |       No       |                    #958DF1                     |               编辑器前景色               |
|        linkColor        | [string(color)]  |       No       |                    #958DF1                     |               编辑器链接色               |
|   selectionBackground   | [string(color)]  |       No       |            rgba(144, 145, 234, 0.3)            |             编辑器选中背景色             |
|   selectionForeground   | [string(color)]  |       No       |                      N/A                       |             编辑器选中前景色             |
|     tableDragColor      | [string(color)]  |       No       |            rgba(144, 145, 234, 0.6)            |               表格拖拽块色               |
|        codeColor        | [string(color)]  |       No       |                      N/A                       |                `Code`颜色                |
|       imgPreview        |      [bool]      |       No       |                      true                      |             是否显示图片预览             |
|       imgLazyLoad       |      [bool]      |       No       |                     false                      |                图片懒加载                |
|          theme          | ['light','dark'] |       No       |                     light                      |               明暗主题风格               |
|       starterKit        |     [object]     |       No       |                     ()=>{}                     |                                          |
|       extensions        |     [array]      |       No       |                       []                       |                                          |
|        showSave         |      [bool]      |       No       |                      true                      |             是否显示保存按钮             |

### Events

---

|   事件名(Name)   | 参数类型(args) |              说明(statement)              |
|:----------------:|:--------------:|:-----------------------------------------:|
|    on-mounted    |     object     | Editor 初始化完成时触发事件, 返回`editor` |
| container-scroll |     object     |         Editor 容器滚动时触发事件         |
|      change      |     object     |         Editor 内容改变时触发事件         |
|  content-change  |     object     |       Editor 外部修改内容时触发事件       |
|    save-json     |     string     |      触发保存事件并以 json 形式保存       |
|    save-html     |     string     |      触发保存事件并以 html 形式保存       |

### Hooks

1. 保存内容函数

```vue
this.$refs.editor.save()
```

此举会触发`save-json`和`save-html`事件

2. 内容转换为 Markdown

```vue
this.$refs.editor.saveMarkdown()
```

3. Markdown 转换为内容

```vue
this.$refs.editor.computeMarkdown(markdown)
```

4. 插入Markdown内容

```vue
this.$refs.editor.insertMarkdown(markdown)
```

### Slot

---

1. Custom-buttons, Custom-buttons-front 或 Custom-buttons-[index] (`index`从`0`开始代表每个分隔栏左侧的位置, `index`最大为`4`, 缺省时为最右侧尾部, `custom-buttons-front`为最左侧头部)

自定义`ToolBar`菜单工具栏按钮项

-   editor: 当前`tiptap` editor 对象
-   defaultClass: 默认 CSS 样式名

```javascript
<power-editor>
    <template v-slot:custom-buttons="x">
        <fv-button :class="[x.defaultClass]">Content</fv-button>
    </template>
</power-editor>
```

2. Front Content

在正文前插入前序内容

```javascript
<power-editor>
    <template v-slot:front-content>
        <div class="front-content-block"></div>
    </template>
</power-editor>
```

## Appendix

### 1. MentionItem

组件所包含的属性如下

### Propoties

---

|      属性(attr)      |    类型(type)    | 必填(required) |   默认值(default)    | 说明(statement) |
|:--------------------:|:----------------:|:--------------:|:--------------------:|:---------------:|
|        value         |     [string]     |       No       |         N/A          |                 |
|     placeholder      |     [string]     |       No       |  Write something …   |                 |
|     mentionList      |     [array]      |       No       |                      |                 |
|      filterFunc      |    [function]    |       No       |                      |                 |
|  chooseItemCallback  |    [function]    |       No       |                      |                 |
| mentionClickCallback |    [function]    |       No       |                      |                 |
|   headerForeground   | [string(color)]  |       No       | rgba(0, 120, 212, 1) |                 |
|      showPopper      |      [bool]      |       No       |        false         |                 |
|        theme         | ['light','dark'] |       No       |        light         |                 |

其中, `mentionList`,`filterFunc`,`chooseItemCallback`,`mentionClickCallback`,`headerForeground`可在初始化`Power Editor`时对`MentionItemAttr`进行设定.

```javascript
{
    mentionList: (value) => [],
    filterFunc: (listItem, value) => {
        return true;
    },
    chooseItemCallback: (chooseItem, value) => {
        console.log('chooseItemCallback');
    },
    mentionClickCallback: (chooseItem, value) => {
        console.log('mentionClickCallback');
    },
    headerForeground: () => {
        return this.foreground;
    },
}
```

### 2. Markdown Decoder Plugins

你可以自定义`ProseMirror`节点(node)或标记(mark)渲染的方式, 以实现自定义的`Markdown`解析器。

`PowerEditor`的Markdown解码器基于深度优先递归解码, 正常情况下对于嵌套了其他`PowerEditor`节点的根节点, 你无需考虑其内部的解码方式, 因为它们将遵照默认解码函数进行解码。

你只需要考虑自定义节点的渲染行为即可, 并且可以通过编写不同的解码函数来一个个地对某一节点进行解码。

以下是一种自定义`Markdown`解码器的实现方式:

- **对于某一节点, 如(`blockquote`):**

```markdown
> 这是一级引用
>> 这是二级引用
>>> 这是三级引用
```

```javascript
blockquote(node, flags) {
    const { blockquote: level } = flags;
    let prefix = '';
    for (let i = 0; i < level; i++) {
        prefix += `>`;
    }
    return `\n${prefix} `;
}
```

函数名`blockquote`必须与节点名相同, 且必须返回一个字符串或对象, 当返回对象时, 该对象包含`prefix`和`suffix`两个属性, 分别代表标记的前缀和后缀。

在`PowerEditor`中`blockquote`节点包含了子节点`paragraph`及其下属的`text`, 然而你不需要考虑非自定义子节点的解码方式, 因为它们将遵照默认解码函数进行解码。

因此在上述样例中你会发现函数仅实现了`>`标记的渲染。然而需要注意的是, 对于不同级别的`blockquote`在`PowerEditor`中其`level`属性是未知的, 因此你需要通过`flags`参数来获取其`level`属性。

`flags`代表了当前节点的父节点是否为某一节点, 默认情况下`flags`的所有属性均为`false`, 在深度遍历中，一旦该节点为`flags`中包含的节点, 则该节点属性将被设置为`1`, 若该节点的子节点为`flags`中包含的节点, 则该子节点属性将被设置为`2`, 以此类推。

以下是`Decoder`中包含的默认`flags`, 你可以自行加入新的`flags`属性

```javascript
flags = {
    inline: false,
    inlineWrapper: false,
    heading: false,
    bulletList: false,
    orderedList: false,
    blockquote: false,
    powerTaskItem: false,
    powerTaskList: false,
    tableHeader: false,
    tableCell: false,
    tableRow: false,
    table: false
}
```

通过属性传入`PowerEditor`:

```vue
<power-editor :mdDecNodeFuncsPlugins="mdDecNodeFuncsPlugins" :mdFlags="mdFlags"></power-editor>
```

```javascript
data () {
    return {
        mdDecNodeFuncsPlugins: {
            blockquote: (node, flags) => {
                const { blockquote: level } = flags;
                let prefix = '';
                for (let i = 0; i < level; i++) {
                    prefix += `>`;
                }
                return `\n${prefix} `;
            }
        },
        mdFlags: {
            blockquote: false
        }
    }
}
```

- **对于某一标记, 如(`color`):**

```markdown
<font color="red">这是红色字体</font>
```

```javascript
textStyle(text, mark) {
    const { color } = mark.attrs;
    return {
        prefix: `<font color="${color}">`,
        suffix: `</font>`
    };
}
```

标记同样也是遵循标记名等于函数名的规则, 且必须返回一个字符串或对象, 当返回对象时, 该对象包含`prefix`和`suffix`两个属性, 分别代表标记的前缀和后缀。

传入方式同节点函数一致。

### 3. ImgInterceptor

你可以通过`imgInterceptor`函数对图片中的数据进行后置处理, 以实现自定义的图片上传功能。当创建图片时或图片中的数据发生变化时, 该函数将被触发。

该函数接收一个包含以下函数的对象:

- **showStatus**: 显示状态函数, 包含一个参数`status`, 用于控制是否显式状态
    - param: `status` - `true`表示显示状态, `false`表示隐藏状态
    - return: `undefined`
- **updateStatus**: 更新状态函数, 依次包含`loading`, `progress`, `info`三个参数, 其中`loading`表示是否显式加载状态, `progress`表示加载进度, `info`表示加载信息
    - param: `loading` - `true`表示显示加载状态, `false`表示隐藏加载状态
    - param: `progress` - 加载进度, 为`0-100`之间的数字
    - param: `info` - 加载信息, 为字符串
    - return: `undefined`
- **getImage**: 获取图片函数, 用于获取图片中的`src`
    - return: `src` - 图片`src`
- **interceptImage**: 拦截图片函数, 包含一个参数`replaceSrc`, 用于在加载过程中替换图片中的`src`, 并返回图片原始`src`
    - param: `replaceSrc` - 用于替换图片中的`src`
    - return: `src` - 图片原始`src`
- **updateImage**: 更新图片函数, 包含一个参数`src`, 用于更新图片中的`src`
    - param: `src` - 用于更新图片中的`src`
    - return: `undefined`
- **updateLock**: 更新锁函数, 包含一个参数`lock`, 用于判断拦截器是否被锁定, 需要手动调用, 默认为`true`表示未锁定
    - param: `lock` - `true`表示锁定, `false`表示解锁
    - return: `undefined`

同时, 该函数包含以下节点对象:

- **node**: 当前节点对象
- **extension**: 当前节点扩展对象
- **getPos**: 获取当前节点位置函数
- **updateAttributes**: 更新属性函数
- **deleteNode**: 删除节点函数

```javascript
let imgInterceptor = ({
    node,
    extension,
    getPos,
    updateAttributes,
    deleteNode,
    showStatus,
    updateStatus,
    interceptImage,
    updateImage,
    updateLock
}) => {
    // 你的代码
}
```