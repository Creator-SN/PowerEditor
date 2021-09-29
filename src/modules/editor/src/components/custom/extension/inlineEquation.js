import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-2';
import inlineEquation from '../source/equationBase.vue';

const inputRegex = /\$\s$/;

export default Node.create({
    name: 'inlineEquation',

    group: 'inline',

    inline: true,

    draggable: true,

    addAttributes() {
        return {
            value: {
                default: '',
            },
            tag: {
                default: 'span',
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
                tag: 'inline-equation',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['inline-equation', mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return VueNodeViewRenderer(inlineEquation);
    },

    addInputRules() {
        return [nodeInputRule(inputRegex, this.type)];
    },
});
