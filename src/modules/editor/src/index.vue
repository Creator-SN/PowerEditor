<template>
    <div class="power-editor-container" :class="[{ dark: theme === 'dark' }]">
        <fv-button @click="themeSync">Test</fv-button>
        <tool-bar v-if="editor" :editor="editor" :theme="theme" @save-click="save"></tool-bar>
        <div class="tip-tap-editor-container" :style="{ background: editorOutSideBackground }">
            <editor-content class="tip-tap-editor" :editor="editor" :theme="theme" ref="editor" :style="{ 'max-width': contentMaxWidth }" />
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
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';

import lowlight from 'lowlight';

import ImageBlock from './components/custom/extension/imageBlock.js';
import EmbedBlock from './components/custom/extension/embedBlock.js';
import PowerTaskList from './components/custom/extension/taskList.js';
import PowerTaskItem from './components/custom/extension/taskItem.js';
import InlineEquation from './components/custom/extension/inlineEquation.js';
import EquationBlock from './components/custom/extension/equationBlock.js';
import DrawingBlock from './components/custom/extension/drawingBlock.js';

import toolBar from './components/toolBar.vue';

export default {
    name: 'PowerEditor',
    components: {
        EditorContent,
        toolBar,
    },
    props: {
        contentMaxWidth: {
            default: '900px',
            type: String,
        },
        editorOutSideBackground: {
            default: '',
        },
        theme: {
            default: 'dark',
        },
    },
    data() {
        return {
            editor: null,
        };
    },
    watch: {
        theme () {
            this.themeSync();
        }
    },
    mounted() {
        let el = this;
        this.editor = new Editor({
            content: `<p>I’m running tiptap with Vue.js. 🎉</p>`,
            extensions: [
                StarterKit,
                Underline,
                TextAlign.configure({
                    types: ['heading', 'paragraph'],
                }),
                TextStyle,
                Highlight.configure({ multicolor: true }),
                Color,
                Link,
                CodeBlockLowlight.configure({
                    lowlight,
                }),
                ImageBlock,
                EmbedBlock,
                PowerTaskList,
                PowerTaskItem,
                InlineEquation,
                EquationBlock,
                DrawingBlock,
            ],
            editorProps: {
                //ProseMirror Editor Props//
                handlePaste(view, e, slice) {
                    let placeholder = {
                        view,
                        e,
                        slice,
                    };
                    let event = placeholder.e;
                    event.stopPropagation();
                    event.preventDefault();
                    el.customPaste(event);
                    return true;
                },
            },
        });
        // For the extensions can use this function to get the current theme.//
        this.editor.$PowerEditorTheme = () => {
            return this.theme;
        };
        // For the extensions can use this function to sync theme.//
        this.editor.$PowerEditorTheme = this.themeSync;
        this.themeSync();
    },
    methods: {
        insert(html) {
            this.editor.commands.insertContent(html);
        },
        insertImg(base64_list) {
            base64_list.forEach((el) => {
                this.insert(`<image-block src="${el}" theme="${this.theme}"></image-block>\n`);
            });
        },
        themeSync () {
            let children = this.$refs.editor.$children;
            for(let component of children) {
                if(component.$props.node.attrs.theme)
                    component.$props.updateAttributes({
                        theme: this.theme
                    });
            }
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
                let img_nodes = htmlDoc.querySelectorAll('img');
                for (let i = 0; i < img_nodes.length; i++) {
                    let node = htmlDoc.createElement('image-block');
                    let src = img_nodes[i].getAttribute('src');
                    node.setAttribute('src', src);
                    let x = img_nodes[i];
                    while (x && x.parentNode != htmlDoc.body) {
                        x = x.parentNode;
                    }
                    x.parentNode.insertBefore(node, x);
                }
                this.insert(htmlDoc.body.innerHTML);
            } else if (exists_text !== false) {
                exists_text.getAsString((str) => {
                    str = str.replace(/&/g, '&amp;');
                    str = str.replace(/</g, '&lt;');
                    str = str.replace(/>/g, '&gt;');
                    str = str.replace(/"/g, '&quto;');
                    str = str.replace(/'/g, '&#39;');
                    str = str.replace(/`/g, '&#96;');
                    str = str.replace(/\//g, '&#x2F;');
                    this.insert(encodeURI(str));
                });
            } else
                Promise.all(img_promises).then((data) => {
                    this.insertImg(data);
                });
        },
        save() {
            this.$emit('save-json', this.editor.getJSON());
            this.$emit('save-html', this.editor.getHTML());
        },
    },
    beforeDestroy() {
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

    .tip-tap-editor-container {
        position: relative;
        width: 100%;
        height: 100%;
        flex: 1;
        padding: 0px 5px;
        padding-top: 60px;
        box-sizing: border-box;
        overflow: auto;

        .tip-tap-editor {
            position: relative;
            width: 100%;
            margin: 0px auto;
            margin-top: 15px;
            min-height: 95%;
            height: auto;
            padding: 15px;
            background: white;
            box-sizing: border-box;
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
                line-height: 1.1;
            }

            a {
                color: rgba(0, 153, 204, 1);
                text-decoration: none;
                cursor: pointer;
            }

            code {
                background-color: rgba(#616161, 0.1);
                color: #616161;
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
                border-left: 2px solid rgba(13, 13, 13, 1);
            }

            hr {
                border: none;
                border-top: 2px solid rgba(#0d0d0d, 0.1);
                margin: 2rem 0;
            }
        }
    }

    &.dark {
        background: rgba(47, 52, 55, 1);

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

            hr {
                border-top: 2px solid rgba(228, 227, 226, 1);
            }

            blockquote {
                border-left: 2px solid rgba(228, 227, 226, 1);
            }
        }
    }
}
</style>
