import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-2';
import equationBlock from '../source/equationBase.vue';
import { nodePasteRule } from '../pasteRules/nodePasteRules';

const inputRegex = /^\${2}\s$/;
const pasteRegex = /^\${2}(.+)\${2}/g;

export default Node.create({
    name: 'equationBlock',

    group: 'block',

    atom: true,

    draggable: true,

    addAttributes() {
        return {
            value: {
                default: '',
            },
            tag: {
                default: 'div',
            },
            placeholder: {
                default: 'Y=WX^T+b',
            },
            emptyPlaceholder: {
                default: 'New Equation',
            },
            showPopper: {
                default: false,
            },
            theme: {
                default: 'light',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'equation-block',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['equation-block', mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return VueNodeViewRenderer(equationBlock);
    },

    addInputRules() {
        return [
            nodeInputRule({
                find: inputRegex, type: this.type, getAttributes: () => {
                    return {
                        theme: this.editor.$PowerEditorTheme(),
                    };
                }
            }),
        ];
    },

    addPasteRules() {
        return [
            nodePasteRule(
                pasteRegex,
                this.type,
                match => {
                    // return some attrs, if any.
                    return {
                        value: match[1],
                        theme: this.editor.$PowerEditorTheme(),
                    };
                },
            ),
        ];
    }
});
