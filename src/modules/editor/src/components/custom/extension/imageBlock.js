import { Node, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-2';
import imageBlock from '../source/imageBlock.vue';

export default Node.create({
    name: 'imageblock',

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
            },
            theme: {
                default: 'light',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'img[src]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
    },

    addNodeView() {
        return VueNodeViewRenderer(imageBlock);
    },
});
