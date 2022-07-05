import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-2';
import mentionItem from '../source/mentionItem.vue';

const inputRegex = /@$/;

export default Node.create({
    name: 'mentionItem',

    group: 'inline',

    inline: true,

    draggable: true,

    addOptions() {
        return {
            mentionList: () => [
                { key: 0, name: "Mention Color", type: "header" },
                { key: 1, name: "Blue", color: "rgba(0, 120, 212, 1)", icon: "WindowsLogo", iconColor: "rgba(0, 153, 204, 1)" },
                { key: 2, name: "Purple", color: "#958DF1", icon: "DelveAnalyticsLogo", iconColor: "#958DF1" },
                { key: 3, name: "Mention Text", type: "header" },
                { key: 9, name: "", type: "divider" },
                { key: 5, name: "Text1" },
                { key: 6, name: "Text2" }
            ],
            filterFunc: () => {
                return true;
            },
            chooseItemCallback: () => {
                console.log('chooseItemCallback');
            },
            mentionClickCallback: () => {
                console.log('mentionClickCallback');
            },
            headerForeground: 'rgba(0, 120, 212, 1)',
        }
    },

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
            mentionList: {
                default: this.options.mentionList,
            },
            freeze: {
                default: false
            },
            filterFunc: {
                default: this.options.filterFunc
            },
            chooseItemCallback: {
                default: this.options.chooseItemCallback
            },
            mentionClickCallback: {
                default: this.options.mentionClickCallback
            },
            headerForeground: {
                default: this.options.headerForeground
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
                        theme: this.editor.$PowerEditorTheme(),
                    };
                }
            }),
        ];
    }
});
