import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-2';
import equationBlock from '../source/equationBase.vue';

const inputRegex = /^\${2}\s$/;

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
            }
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
        return [nodeInputRule(inputRegex, this.type, () => {
            return {
                theme: this.editor.$PowerEditorTheme()
            }
        })];
    },
});
