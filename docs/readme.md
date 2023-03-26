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
footer: MIT Licensed | Copyright © 2022 Creator SN
---

<script>
export default {
    data () {
        return {
            readonly: false,
            theme: "light"
        }
    }
}
</script>

<div style="display: flex;">
<fv-button :theme="theme" borderRadius="35" style="width: 35px; height: 35px; margin: 15px 0px;" @click="theme = theme == 'light' ? 'dark' : 'light'"><i class="ms-Icon" :class="[`ms-Icon--${theme === 'light' ? 'Sunny' : 'ClearNight'}`]"></i></fv-button>
<fv-button :theme="theme" borderRadius="35" style="width: 35px; height: 35px; margin: 15px;" @click="readonly = readonly == true ? false : true"><i class="ms-Icon" :class="[`ms-Icon--${readonly === true ? 'PageEdit' : 'ReadingMode'}`]"></i></fv-button>
</div>

<power-editor :theme="theme" :editable="!readonly" style="width:100%" />

### Propoties

---

|       属性(attr)        |    类型(type)    | 必填(required) |                默认值(default)                 |             说明(statement)              |
| :---------------------: | :--------------: | :------------: | :--------------------------------------------: | :--------------------------------------: |
|          value          |     [string]     |       No       | <p>I’m running PowerEditor with Vue.js. 🎉</p> |       文本内容, 支持纯文本及 HTML        |
|        editable         |      [bool]      |       No       |                      true                      |              编辑器是否只读              |
|       placeholder       |     [string]     |       No       |               Write something …                |            编辑器 Placeholder            |
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
|          theme          | ['light','dark'] |       No       |                     light                      |               明暗主题风格               |

### Events

---

|   事件名(Name)   | 参数类型(args) |        说明(statement)         |
| :--------------: | :------------: | :----------------------------: |
| container-scroll |     object     |   Editor 容器滚动时触发事件    |
|    save-json     |     string     | 触发保存事件并以 json 形式保存 |
|    save-html     |     string     | 触发保存事件并以 html 形式保存 |

### Hooks

1. 保存内容函数

```vue
this.$refs.editor.save()
```

此举会触发`save-json`和`save-html`事件

### Slot

---

1. Custom-buttons 或 Custom-buttons-[index] (`index`从`0`开始代表每个分隔栏左侧的位置, `index`最大为`3`, 缺省时为保存按钮左侧)

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

### MentionItem

组件所包含的属性如下

### Propoties

---

|       属性(attr)        |    类型(type)    | 必填(required) |                                    默认值(default)                                    | 说明(statement) |
| :---------------------: | :--------------: | :------------: | :-----------------------------------------------------------------------------------: | :-------------: |
|          value          |     [string]     |       No       |                                          N/A                                          |                 |
|       placeholder       |     [string]     |       No       |                                   Write something …                                   |                 |
|       mentionList       |     [array]      |       No       |                                                                                       |                 |
|       filterFunc        |    [function]    |       No       |                                                                                       |                 |
|   chooseItemCallback    |    [function]    |       No       |                                                                                       |                 |
|  mentionClickCallback   |    [function]    |       No       |                                                                                       |                 |
|    headerForeground     | [string(color)]  |       No       |                                 rgba(0, 120, 212, 1)                                  |                 |
|       showPopper        |      [bool]      |       No       |                                         false                                         |                 |
|          theme          | ['light','dark'] |       No       |                                         light                                         |                 |
|       extensions        |     [array]      |       No       |                                          []                                           |                 |
|       starterKit        |     [object]     |       No       |                                          []                                           |                 |
|        language         |     [string]     |       No       |                                          cn                                           |                 |
|     contentMaxWidth     |     [string]     |       No       |                                         900px                                         |                 |
|    editorBackground     |     [string]     |       No       |                                                                                       |                 |
| editorOutSideBackground |     [string]     |       No       |                                                                                       |                 |
|   mobileDisplayWidth    |     [number]     |       No       |                                          768                                          |                 |
|       showToolBar       |    [boolean]     |       No       |                                         true                                          |                 |
|    toolbarBackground    |     [string]     |       No       |                                                                                       |                 |
|   toolbarBorderRadius   |     [number]     |       No       |                                           8                                           |                 |
|   editablePaddingTop    |    [boolean]     |       No       |                                         false                                         |                 |
|   readonlyPaddingTop    |     [number]     |       No       |                                           5                                           |                 |
|     mentionItemAttr     |     [object]     |       No       | ()=>{mentionList,filterFunc,chooseItemCallback,mentionClickCallback,headerForeground} |                 |

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
    headerForeground: 'rgba(0, 120, 212, 1)',
}
```
