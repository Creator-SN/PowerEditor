import { Node, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-2';
import embedBlock from '../source/embedBlock.vue';

export default Node.create({
    name: 'embedblock',

    group: 'block',

    draggable: true,

    atom: true,

    addAttributes() {
        return {
            src: {
                default: '',
            },
            width: {
                default: 100,
            },
            caption: {
                default: '',
            },
            alignCenter: {
                default: true,
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: 'embed-block',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['embed-block', mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return VueNodeViewRenderer(embedBlock);
    },
});
