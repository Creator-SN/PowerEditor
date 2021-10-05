import { Node, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-2';
import taskItem from '../source/taskItem.vue';
import { wrappingInputRule } from 'prosemirror-inputrules';

const inputRegex = /^\s*(\[([ |x])\])\s$/;

export default Node.create({
    name: 'powerTaskItem',

    group: 'block',

    content: 'paragraph',

    draggable: true,

    atom: true,

    addAttributes() {
        return {
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
                tag: 'power-task-item',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['power-task-item', mergeAttributes(HTMLAttributes)];
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
            wrappingInputRule(inputRegex, this.type, (match) => ({
                checked: match[match.length - 1] === 'x',
                theme: this.editor.$PowerEditorTheme(),
            })),
        ];
    },
});
