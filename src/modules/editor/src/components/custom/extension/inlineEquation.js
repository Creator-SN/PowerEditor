import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-2';
import inlineEquation from '../source/equationBase.vue';
import { nodePasteRule } from '../pasteRules/nodePasteRules';

const inputRegex = /\$\s$/;
const pasteRegex = /^\$(.+)\$/g;
// \$(.+?)\$
// \$\$((.|\n)*?)\$\$

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
            }
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
        return [
            nodeInputRule({
                find: inputRegex, type: this.type, getAttributes: () => {
                    return {
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
                getAttributes: match => {
                    // return some attrs, if any.
                    return {
                        value: match[1],
                        theme: this.editor.storage.defaultStorage.theme,
                    };
                },
            }),
        ];
    },

    addKeyboardShortcuts() {
        return {
            'Alt-=': () => {
                let state = this.editor.view.state;
                let selection = this.editor.view.state.selection;
                let text = state.doc.textBetween(selection.from, selection.to, ' ');
                if (text.length > 0) {
                    return this.editor.chain().focus().insertContent(`<inline-equation theme="${this.editor.storage.defaultStorage.theme}" value="${text}"></inline-equation>`).run();
                } else return;
            },
        };
    },
});
