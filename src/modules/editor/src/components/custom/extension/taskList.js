import { Node, mergeAttributes, wrappingInputRule } from '@tiptap/core';
import { nodePasteRule } from '../pasteRules/nodePasteRules';

const inputRegex = /^-(\[([ |x])\])\s$/;
const pasteRegex = /^-(\s*)(\[([ |x])\])\s+(.*)/g;

export default Node.create({
    name: 'powerTaskList',

    group: 'block list',

    content: 'powerTaskItem+',

    parseHTML() {
        return [
            {
                tag: 'ul[data-type="powerTaskList"]',
                priority: 51,
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        // https://prosemirror.net/docs/ref/#model.DOMOutputSpec //
        return ['ul', mergeAttributes(HTMLAttributes, { 'data-type': this.name }), 0];
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

    addInputRules() {
        return [
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
                        // 自定义插入节点内容
                        powerContent: [{
                            type: 'powerTaskItem',
                            content: [
                                {
                                    type: 'paragraph',
                                    content: [{
                                        type: 'text',
                                        text: match[4],
                                    }],
                                }
                            ],
                            attrs: {
                                checked: match[3] === 'x',
                                theme: this.editor.storage.defaultStorage.theme,
                            },
                        }]
                    };
                },
            }),
        ];
    },
});
