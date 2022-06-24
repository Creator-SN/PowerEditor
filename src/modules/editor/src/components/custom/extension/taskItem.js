import { Node, mergeAttributes,nodeInputRule } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-2';
import taskItem from '../source/taskItem.vue';

const inputRegex = /^\s*(\[([ |x])\])\s$/;

export default Node.create({
    name: 'powerTaskItem',

    group: 'block',

    content: 'paragraph',

    draggable: true,

    atom: true,

    addAttributes() {
        return {
            value: {
                default: ""
            },
            checked: {
                default: false,
            },
            placeholder: {
                default: 'To-Do',
            },
            theme: {
                default: 'light',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'li[data-type="powerTaskItem"]',
                priority: 51,
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['li', mergeAttributes(
            this.options.HTMLAttributes,
            HTMLAttributes,
            { 'data-type': 'powerTaskItem' },
        ), 0]
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
            nodeInputRule({
                find: inputRegex, type: this.type, getAttributes: () => {
                    return {
                        checked: match[match.length - 1] === 'x',
                        theme: this.editor.$PowerEditorTheme(),
                    };
                }
            }),
        ];
    },
});
