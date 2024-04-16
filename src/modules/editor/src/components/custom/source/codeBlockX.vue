<template>
    <node-view-wrapper class="power-editor-code-block">
        <div
            contenteditable="false"
            class="power-editor-code-block-banner"
        >
            <div class="power-editor-code-block-banner-left-block">
                <p class="power-editor-code-block-language">{{node.attrs.language}}</p>
            </div>
            <div class="power-editor-code-block-banner-right-block">
                <fv-combobox
                    v-show="editor.storage.defaultStorage.codeBlockLanguagesBox"
                    v-model="selectedLanguage"
                    placeholder="Select language"
                    theme="dark"
                    :options="languages"
                    style="width: 120px; height: 30px;"
                ></fv-combobox>
                <fv-button
                    theme="dark"
                    background="rgba(36, 36, 36, 1)"
                    :is-box-shadow="true"
                    style="width: 30px; height: 30px; margin-left: 5px;"
                    :title="status.copy ? 'Copied' : 'Copy'"
                    @click="copyCode"
                >
                    <i
                        class="ms-Icon"
                        :class="[`ms-Icon--${status.copy ? 'Accept' : 'Copy'}`]"
                    ></i>
                </fv-button>
            </div>
        </div>
        <pre
            class="power-editor-code-block-pre"
            :class="[{lineNumber: editor.storage.defaultStorage.codeBlockLineNumbers}]"
        ><code><node-view-content /></code></pre>
        <div
            v-if="editor.storage.defaultStorage.codeBlockLineNumbers"
            contenteditable="false"
            class="power-editor-code-block-line-number-block"
        >
            <div
                v-for="(_, index) in node.textContent.split('\n')"
                :key="index"
                class="power-editor-code-block-line-number-item"
                :title="index + 1"
            >
                {{index + 1}}
            </div>
        </div>
    </node-view-wrapper>
</template>
  
  <script>
import { NodeViewContent, NodeViewWrapper } from '@tiptap/vue-2';

export default {
    components: {
        NodeViewWrapper,
        NodeViewContent,
    },

    props: {
        // the editor instance
        editor: {
            type: Object,
        },

        // the current node
        node: {
            type: Object,
        },

        // an array of decorations
        decorations: {
            type: Array,
        },

        // `true` when there is a `NodeSelection` at the current node view
        selected: {
            type: Boolean,
        },

        // access to the node extension, for example to get options
        extension: {
            type: Object,
        },

        // get the document position of the current node
        getPos: {
            type: Function,
        },

        // update attributes of the current node
        updateAttributes: {
            type: Function,
        },

        // delete the current node
        deleteNode: {
            type: Function,
        },
    },

    data() {
        return {
            selectedLanguage: {},
            status: {
                copy: false,
            },
            timer: {
                copy: null,
            },
        };
    },

    watch: {
        selectedLanguage() {
            this.updateAttributes({
                language: this.selectedLanguage.key,
            });
        },
    },

    computed: {
        languages() {
            let languages = this.extension.options.lowlight.listLanguages();
            let result = [];

            for (let i = 0; i < languages.length; i++) {
                result.push({
                    key: languages[i],
                    text: languages[i][0].toUpperCase() + languages[i].slice(1).toLowerCase(),
                });
            }

            result.unshift({
                key: '',
                text: 'Default',
            });

            return result;
        },
    },

    mounted() {
        let lan = this.languages.find((it) => it.key === this.node.attrs.language);
        if (lan) this.selectedLanguage = lan;
        else this.selectedLanguage = this.languages[0];
    },
    methods: {
        copyCode() {
            if (this.status.copy) {
                return;
            }
            this.status.copy = true;
            let code = this.node.textContent;
            let textArea = document.createElement('textarea');
            textArea.value = code;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.timer.copy = setTimeout(() => {
                this.status.copy = false;
            }, 3000);
        },
    },
};
</script>
  
  <style lang="scss">
.power-editor-code-block {
    position: relative;

    padding-top: 40px;
    background-color: rgba(25, 25, 25, 1);
    border-radius: 8px;

    .power-editor-code-block-banner {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .power-editor-code-block-banner-left-block {
            height: 40px;
            flex: 1;
            display: flex;
            align-items: center;
            user-select: none;

            .power-editor-code-block-language {
                margin-left: 10px;
                font-size: 12px;
                color: rgba(245, 245, 245, 0.6);
                cursor: default;
            }
        }

        .power-editor-code-block-banner-right-block {
            height: 40px;
            padding-right: 10px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
    }

    .power-editor-code-block-line-number-block {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 40px;
        height: 100%;
        padding-top: 52px;
        padding-right: 5px;
        color: rgba(110, 118, 123, 1);
        box-sizing: border-box;
        line-height: 1.4;
        cursor: default;

        .power-editor-code-block-line-number-item {
            width: 100%;
            height: calc(0.8rem * 1.4);
            font-size: 12px;
            box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: right;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            user-select: none;
        }
    }

    .power-editor-code-block-pre {
        margin: 0px;
        padding: 0.75rem 1rem;

        &.lineNumber {
            padding-left: 40px;
        }
    }
}
</style>