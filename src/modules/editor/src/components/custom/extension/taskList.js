import { Node, mergeAttributes } from '@tiptap/core';

export default Node.create({
    name: 'powerTaskList',

    group: 'block list',

    content: 'powerTaskItem+',

    parseHTML() {
        return [
            {
                tag: 'ul[data-type="powerTaskList"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        // https://prosemirror.net/docs/ref/#model.DOMOutputSpec //
        return ['ul', mergeAttributes(HTMLAttributes, { 'data-type': 'powerTaskList' }), 0];
    },

    addCommands() {
        return {
            togglePowerTaskList:
                () =>
                    ({ commands }) => {
                        return commands.toggleList('powerTaskList', 'powerTaskItem');
                    },
            setPowerTaskList: () => ({ editor, commands }) => {
                let status = editor.isActive('powerTaskList');
                if (!status)
                    return commands.toggleList('powerTaskList', 'powerTaskItem');
            }
        };
    },

    addKeyboardShortcuts() {
        return {
            'Mod-Shift-9': () => this.editor.commands.togglePowerTaskList(),
        };
    },
});
