import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-2';
import mentionItem from '../source/mentionItem.vue';

const inputRegex = /@$/;

export default Node.create({
    name: 'mentionItem',

    group: 'inline',

    inline: true,

    draggable: true,

    addAttributes() {
        return {
            value: {
                default: '',
            },
            currentItem: {
                default: {}
            },
            placeholder: {
                default: 'mention',
            },
            freeze: {
                default: false
            },
            showPopper: {
                default: false,
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: 'mention-item',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['mention-item', mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return VueNodeViewRenderer(mentionItem);
    },

    addInputRules() {
        return [
            nodeInputRule({
                find: inputRegex, type: this.type, getAttributes: () => {
                    return {
                        theme: this.editor.storage.defaultStorage.theme,
                    };
                }
            }),
        ];
    }
});
