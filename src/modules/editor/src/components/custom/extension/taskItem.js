import { Node, mergeAttributes, wrappingInputRule } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-2';
import { nodeInputWithContentRule } from '../inputRules/nodeInputWithContentRules';
import { nodePasteRule } from '../pasteRules/nodePasteRules';
import taskItem from '../source/taskItem.vue';

const inputRegex = /^\s*(\[([ |x])\])\s$/;
const pasteRegex = /^(\s*)(\[([ |x])\])\s+(.*)/g;

export default Node.create({
    name: 'powerTaskItem',

    group: 'block',

    content: 'paragraph block*',

    draggable: true,

    addAttributes() {
        return {
            value: {
                default: '',
            },
            checked: {
                default: false,
            },
            placeholder: {
                default: 'To-Do',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'li[data-type="powerTaskItem"]',
                priority: 51,
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['li', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'powerTaskItem' }), 0];
    },

    addKeyboardShortcuts() {
        const shortcuts = {
            Enter: () => this.editor.commands.splitListItem('powerTaskItem'),
            'Shift-Tab': () => this.editor.commands.liftListItem('powerTaskItem'),
        };

        if (!this.options.nested) {
            return shortcuts;
        }

        return {
            ...shortcuts,
            Tab: () => this.editor.commands.sinkListItem('powerTaskItem'),
        };
    },

    addNodeView() {
        return VueNodeViewRenderer(taskItem);
    },

    addInputRules() {
        return [
            // nodeInputWithContentRule({
            //     find: inputRegex,
            //     type: this.type,
            //     getAttributes: (match) => {
            //         return {
            //             checked: match[match.length - 1] === 'x',
            //             theme: this.editor.storage.defaultStorage.theme,
            //         };
            //     },
            //     content: {
            //         type: 'paragraph',
            //     },
            //     overlapIgnore: ['powerTaskItem'],
            // }),
            wrappingInputRule({
                find: inputRegex,
                type: this.type,
                getAttributes: (match) => {
                    return {
                        checked: match[match.length - 1] === 'x',
                        theme: this.editor.storage.defaultStorage.theme,
                    };
                }
            }),
        ];
    },

    addPasteRules() {
        return [
            nodePasteRule({
                find: pasteRegex,
                type: this.type,
                getAttributes: (match) => {
                    return {
                        powerContent: [{ // 自定义插入节点内容
                            type: 'paragraph',
                            content: [{
                                type: 'text',
                                text: match[4],
                            }],
                        }],
                        checked: match[3] === 'x',
                        theme: this.editor.storage.defaultStorage.theme,
                    };
                },
            }),
        ];
    },
});
