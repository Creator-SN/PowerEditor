<template>
    <div
        class="power-editor-container"
        :class="[{ dark: theme === 'dark' }]"
    >
        <transition name="power-editor-tool-bar-fade-in">
            <tool-bar
                v-if="editor && editable"
                v-show="showToolBar"
                :editor="editor"
                :theme="theme"
                :language="language"
                :mobileMode="mobileMode"
                @save-click="save"
            >
                <template v-slot:custom-buttons>
                    <slot
                        name="custom-buttons"
                        :editor="editor"
                    ></slot>
                </template>
            </tool-bar>
        </transition>
        <div
            v-if="editor && editable"
            v-show="showToolBar"
            class="power-editor-tool-bar-acrylic-background"
        ></div>
        <div
            :class="[{'read-only': !editable || !showToolBar}]"
            class="tip-tap-editor-container"
            ref="container"
            :style="{ background: editorOutSideBackground }"
        >
            <editor-content
                class="tip-tap-editor"
                :editor="editor"
                :theme="theme"
                ref="editor"
                :style="{ 'max-width': contentMaxWidth }"
            />
        </div>
        <div class="power-editor-bubble-tool-bar">
            <bubble-tool-bar
                v-if="editor && editable"
                :editor="editor"
                :theme="theme"
                :language="language"
                :tippy-options="{ duration: 100 }"
                ref="bubbleToolBar"
                :mobileMode="mobileMode"
            ></bubble-tool-bar>
        </div>
    </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { Color } from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import BubbleMenu from '@tiptap/extension-bubble-menu';

import lowlight from 'lowlight';

import ImageBlock from './components/custom/extension/imageBlock.js';
import EmbedBlock from './components/custom/extension/embedBlock.js';
import PowerTaskList from './components/custom/extension/taskList.js';
import PowerTaskItem from './components/custom/extension/taskItem.js';
import InlineEquation from './components/custom/extension/inlineEquation.js';
import EquationBlock from './components/custom/extension/equationBlock.js';
import MentionItem from './components/custom/extension/mentionItem.js';
import DrawingBlock from './components/custom/extension/drawingBlock.js';

import toolBar from './components/toolBar.vue';
import bubbleToolBar from './components/bubbleToolBar.vue';

export default {
    name: 'PowerEditor',
    components: {
        EditorContent,
        toolBar,
        bubbleToolBar,
    },
    props: {
        value: {
            default: `<p>I’m running PowerEditor with Vue.js. 🎉</p>`,
        },
        editable: {
            default: true,
        },
        placeholder: {
            default: 'Write something …',
        },
        contentMaxWidth: {
            default: '900px',
            type: String,
        },
        editorOutSideBackground: {
            default: '',
        },
        mobileDisplayWidth: {
            default: 768,
        },
        showToolBar: {
            default: true,
        },
        mentionItemAttr: {
            default: () => {
                return {
                    mentionList: () => [
                        // { key: 0, name: 'Mention Color', type: 'header' },
                        // { key: 1, name: 'Blue', color: 'rgba(0, 120, 212, 1)', icon: 'WindowsLogo', iconColor: 'rgba(0, 153, 204, 1)' },
                        // { key: 2, name: 'Purple', color: '#958DF1', icon: 'DelveAnalyticsLogo', iconColor: '#958DF1' },
                        // { key: 3, name: 'Mention Text', type: 'header' },
                        // { key: 9, name: '', type: 'divider' },
                        // { key: 5, name: 'Text1' },
                        // { key: 6, name: 'Text2' },
                    ],
                    filterFunc: () => {
                        return true;
                    },
                    chooseItemCallback: () => {
                        console.log('chooseItemCallback');
                    },
                    mentionClickCallback: () => {
                        console.log('mentionClickCallback');
                    },
                    headerForeground: 'rgba(0, 120, 212, 1)',
                };
            },
        },
        extensions: {
            default: () => [],
        },
        language: {
            default: 'cn',
        },
        theme: {
            default: 'light',
        },
    },
    data() {
        return {
            editor: null,
            mobileMode: false,
            timer: {
                widthTimer: {},
            },
        };
    },
    watch: {
        value(val) {
            this.editor.commands.setContent(val);
            this.themeSync();
        },
        editable() {
            this.editor.setEditable(this.editable);
        },
        theme() {
            this.themeSync();
        },
    },
    mounted() {
        this.init();
        this.themeSync();
        this.widthTimerInit();
    },
    methods: {
        init() {
            let el = this;
            this.editor = new Editor({
                editable: this.editable,
                content: this.value,
                extensions: [
                    StarterKit.configure({
                        dropcursor: {
                            color: 'rgba(45, 170, 219, 0.3)',
                            width: 6,
                        },
                    }),
                    Underline,
                    TextAlign.configure({
                        types: ['heading', 'paragraph'],
                    }),
                    TextStyle,
                    Highlight.configure({ multicolor: true }),
                    Color,
                    Link,
                    Placeholder.configure({
                        emptyEditorClass: 'is-editor-empty',
                        placeholder: () => this.placeholder,
                    }),
                    CodeBlockLowlight.configure({
                        lowlight,
                    }),
                    ImageBlock,
                    EmbedBlock,
                    PowerTaskList,
                    PowerTaskItem,
                    InlineEquation,
                    EquationBlock,
                    MentionItem.configure({
                        ...this.mentionItemAttr,
                    }),
                    DrawingBlock,
                    Table.configure({
                        HTMLAttributes: {},
                        resizable: true,
                    }),
                    TableRow,
                    TableHeader,
                    TableCell,
                    BubbleMenu.configure({
                        element: document.querySelector('.power-editor-bubble-tool-bar'),
                        shouldShow: ({ editor, view, state, oldState, from, to }) => {
                            // only show the bubble menu for images and links
                            if (state.selection.from === state.selection.to) return false;
                            return !(editor.isActive('imageblock') || editor.isActive('equationBlock') || editor.isActive('embedblock') || editor.isActive('drawingBlock'));
                        },
                    }),
                    ...this.extensions,
                ],
                editorProps: {
                    //ProseMirror Editor Props//
                    // handlePaste(view, e, slice) {
                    //     let placeholder = {
                    //         view,
                    //         e,
                    //         slice,
                    //     };
                    //     let event = placeholder.e;
                    //     event.stopPropagation();
                    //     event.preventDefault();
                    //     el.customPaste(event);
                    //     return true;
                    // },
                },
            });
            // For the extensions can use this function to get the current theme.//
            this.editor.$PowerEditorTheme = () => {
                return this.theme;
            };
            // For the extensions can use this function to sync theme.//
            this.editor.$PowerEditorThemeSync = this.themeSync;
            this.editor.$ContentContainer = this.$refs.container;
            this.editor.$MentionItemTools = {
                ...this.mentionItemAttr
            };
        },
        insert(html) {
            this.editor.commands.insertContent(html);
        },
        insertImg(base64_list) {
            base64_list.forEach((el) => {
                this.insert(`<img src="${el}" theme="${this.theme}"></img>\n`);
            });
        },
        themeSync() {
            let children = this.$refs.editor.$children;
            for (let component of children) {
                if (component.$props.node.attrs.theme)
                    component.$props.updateAttributes({
                        theme: this.theme,
                    });
            }
        },
        widthTimerInit() {
            this.timer.widthTimer = setInterval(() => {
                if (this.$el.clientWidth < this.mobileDisplayWidth) this.mobileMode = true;
                else this.mobileMode = false;
            }, 300);
        },
        async customPaste(event) {
            //rewrite paste event//
            let img_promises = [];
            let exists_html = false;
            let exists_text = false;

            let data = event.clipboardData || window.clipboardData;
            let items = data.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('html') > -1) exists_html = items[i];
                if (items[i].type.indexOf('plain') > -1) exists_text = items[i];
                if (items[i].kind === 'file' && items[i].type.indexOf('image') > -1) {
                    let pasteFile = items[i].getAsFile();
                    let reader = new FileReader();
                    reader.readAsDataURL(pasteFile);
                    let base64 = new Promise((resolve) => {
                        reader.onload = (event) => {
                            resolve(event.target.result);
                        };
                    });
                    img_promises.push(base64);
                }
            }

            if (exists_html !== false) {
                let txt = await new Promise((resolve) => {
                    exists_html.getAsString((str) => {
                        resolve(str);
                    });
                });
                let parser = new DOMParser();
                let htmlDoc = parser.parseFromString(txt, 'text/html');
                console.log(htmlDoc);
                let insertDoc = parser.parseFromString('', 'text/html');
                let pure = [];
                htmlDoc.body.children.forEach((el) => {
                    let r = this.dfsDiv(el);
                    pure = pure.concat(r);
                });
                insertDoc.body.append(...pure);
                // let all_nodes = insertDoc.querySelectorAll('*');
                // for (let i = 0; i < all_nodes.length; i++) {
                //     let node = all_nodes[i];
                //     let style = node.getAttribute('style');
                //     if (!style) node.setAttribute('style', ``);
                //     else {
                //         let color = style.match(/color: *[()\d,\w]+;/);
                //         let background = style.match(/background-color: *[()\d,\w]+;/);
                //         if (color) color = color[0];
                //         else color = 'inherit';
                //         if (background) background = background[0];
                //         else background = 'inherit';
                //         node.setAttribute('style', `color: ${color}; background: ${background};`);
                //     }
                // }
                let img_nodes = insertDoc.querySelectorAll('img');
                for (let i = 0; i < img_nodes.length; i++) {
                    let x = img_nodes[i];
                    let node = img_nodes[i];
                    while (x && x.parentNode != insertDoc.body) {
                        x = x.parentNode;
                    }
                    x.parentNode.insertBefore(node, x);
                }
                console.log(insertDoc.body.innerHTML);
                this.insert(insertDoc.body.innerHTML);
            } else if (exists_text !== false) {
                exists_text.getAsString((str) => {
                    const transaction = this.editor.state.tr.insertText(str);
                    this.editor.view.dispatch(transaction);
                    // str = str.replace(/&/g, '&amp;');
                    // str = str.replace(/</g, '&lt;');
                    // str = str.replace(/>/g, '&gt;');
                    // str = str.replace(/"/g, '&quto;');
                    // str = str.replace(/'/g, '&#39;');
                    // str = str.replace(/`/g, '&#96;');
                    // str = str.replace(/\//g, '&#x2F;');
                    // this.insert(str);
                });
            } else
                Promise.all(img_promises).then((data) => {
                    this.insertImg(data);
                });
        },
        dfsDiv(node) {
            if (node.tagName.toUpperCase() !== 'DIV') return [node];
            let children = node.children;
            let result = [];
            children.forEach((el) => {
                result = result.concat(this.dfsDiv(el));
            });
            return result;
        },
        focus() {
            this.editor.commands.focus();
        },
        save() {
            this.$emit('save-json', this.editor.getJSON());
            this.$emit('save-html', this.editor.getHTML());
        },
    },
    beforeDestroy() {
        this.editor.destroy();
        for (let key in this.timer) {
            clearInterval(this.timer[key]);
        }
    },
    beforeUnmount() {
        this.editor.destroy();
    },
};
</script>

<style lang="scss">
.power-editor-container {
    position: relative;
    width: 300px;
    height: 600px;
    background: rgba(240, 240, 240, 1);
    border-radius: 8px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;

    .power-editor-tool-bar-acrylic-background {
        position: absolute;
        left: 5px;
        top: 5px;
        width: calc(100% - 10px);
        height: 70px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 8px;
        box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(50px);
        -webkit-backdrop-filter: blur(50px);
        z-index: 3;
    }

    .tip-tap-editor-container {
        position: relative;
        width: 100%;
        height: 100%;
        flex: 1;
        padding: 0px 5px;
        padding-top: 60px;
        box-sizing: border-box;
        transition: padding 0.3s;
        overflow: auto;
        overflow-x: hidden;

        &.read-only {
            padding-top: 5px;
        }

        .tip-tap-editor {
            position: relative;
            width: 100%;
            max-width: 100%;
            margin: 0px auto;
            margin-top: 15px;
            min-height: 95%;
            height: auto;
            padding: 15px;
            padding-bottom: 315px;
            background: white;
            box-sizing: border-box;
            transition: all 0.3s;
        }

        .ProseMirror {
            > * + * {
                margin-top: 0.75em;
            }

            &:focus {
                outline: none;
            }

            ul,
            ol {
                padding: 0 1rem;
            }

            h1,
            h2,
            h3,
            h4,
            h5,
            h6 {
                color: #2c3e50;
                line-height: 1.5;
            }

            a {
                color: rgba(0, 153, 204, 1);
                text-decoration: none;
                cursor: pointer;
            }

            p {
                color: #2c3e50;

                &.is-editor-empty {
                    padding: 3px;
                    border-radius: 3px;
                    box-sizing: border-box;

                    &:first-child::before {
                        content: attr(data-placeholder);
                        float: left;
                        color: #ced4da;
                        pointer-events: none;
                        height: 0;
                    }

                    &:hover {
                        background: rgba(200, 200, 200, 0.1);
                    }

                    &:active {
                        background: rgba(200, 200, 200, 0.05);
                    }
                }
            }

            code {
                padding: 4px 6px;
                background-color: rgba(#616161, 0.1);
                font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
                font-size: 1rem;
                color: rgba(235, 87, 87, 1);
                border-radius: 3px;
            }

            pre {
                background: #0d0d0d;
                color: #fff;
                font-family: 'JetBrainsMono', monospace;
                padding: 0.75rem 1rem;
                border-radius: 0.5rem;

                code {
                    color: inherit;
                    padding: 0;
                    background: none;
                    font-size: 0.8rem;
                }

                .hljs-comment,
                .hljs-quote {
                    color: #616161;
                }

                .hljs-variable,
                .hljs-template-variable,
                .hljs-attribute,
                .hljs-tag,
                .hljs-name,
                .hljs-regexp,
                .hljs-link,
                .hljs-name,
                .hljs-selector-id,
                .hljs-selector-class {
                    color: #f98181;
                }

                .hljs-number,
                .hljs-meta,
                .hljs-built_in,
                .hljs-builtin-name,
                .hljs-literal,
                .hljs-type,
                .hljs-params {
                    color: #fbbc88;
                }

                .hljs-string,
                .hljs-symbol,
                .hljs-bullet {
                    color: #b9f18d;
                }

                .hljs-title,
                .hljs-section {
                    color: #faf594;
                }

                .hljs-keyword,
                .hljs-selector-tag {
                    color: #70cff8;
                }

                .hljs-emphasis {
                    font-style: italic;
                }

                .hljs-strong {
                    font-weight: 700;
                }
            }

            img {
                max-width: 100%;
                height: auto;
            }

            blockquote {
                padding-left: 1rem;
                border-left: 2px solid rgba(251, 188, 136, 0.6);
            }

            hr {
                border: none;
                border-top: 2px solid rgba(#0d0d0d, 0.1);
                margin: 2rem 0;
            }

            .tableWrapper {
                width: 100%;
                padding: 1rem 0;
                overflow-x: auto;
                overflow-y: visible;
            }

            table {
                border-collapse: collapse;
                table-layout: fixed;
                width: 100%;
                margin: 0;
                display: table;
                overflow: hidden;
                overflow-y: visible;

                td,
                th {
                    min-width: 1em;
                    border: thin solid #ced4da;
                    padding: 3px 5px;
                    vertical-align: top;
                    box-sizing: border-box;
                    position: relative;

                    > * {
                        margin-bottom: 0;
                    }
                }

                th {
                    width: auto;
                    font-weight: bold;
                    text-align: left;
                    background-color: rgba(241, 243, 245, 1);
                }

                .selectedCell:after {
                    z-index: 2;
                    position: absolute;
                    content: '';
                    left: 0;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    background: rgba(200, 200, 255, 0.4);
                    pointer-events: none;
                }

                .column-resize-handle {
                    position: absolute;
                    right: -2px;
                    top: 0;
                    bottom: -2px;
                    width: 4px;
                    background-color: rgba(145, 191, 209, 1);
                    pointer-events: none;
                }

                p {
                    margin: 0;
                }
            }
        }

        .resize-cursor {
            cursor: ew-resize;
            cursor: col-resize;
        }
    }

    &.dark {
        background: rgba(47, 52, 55, 1);

        .power-editor-tool-bar-acrylic-background {
            background: rgba(70, 70, 70, 0.3);
        }

        .tip-tap-editor-container {
            .tip-tap-editor {
                background: rgba(47, 52, 55, 1);
            }
        }

        .ProseMirror {
            p,
            h1,
            h2,
            h3,
            h4,
            h5,
            h6 {
                color: whitesmoke;
            }

            ul,
            ol {
                li::marker {
                    color: rgba(245, 245, 245, 0.6);
                }
            }

            hr {
                border-top: 2px solid rgba(228, 227, 226, 1);
            }

            blockquote {
                border-left: 2px solid rgba(251, 188, 136, 1);
            }

            code {
                background-color: rgba(72, 72, 72, 1);
            }

            table {
                th {
                    background: rgba(235, 235, 235, 1);

                    p {
                        color: rgba(13, 13, 13, 1);
                    }
                }

                tr:nth-child(2n) {
                    background: rgba(0, 0, 0, 0.3);
                }
            }
        }
    }

    .power-editor-tool-bar-fade-in-enter-active,
    .power-editor-tool-bar-fade-in-leave-active {
        transition: all 0.3s;
    }

    .power-editor-tool-bar-fade-in-enter,
    .power-editor-tool-bar-fade-in-leave-to {
        margin-top: -15px;
        opacity: 0;
    }

    .power-editor-tool-bar-fade-in-enter-to,
    .power-editor-tool-bar-fade-in-leave {
        margin-top: 0;
        opacity: 1;
    }
}
</style>
