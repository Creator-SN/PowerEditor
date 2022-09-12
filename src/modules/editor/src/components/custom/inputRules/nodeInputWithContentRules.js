import { callOrReturn, getAttributes, InputRule } from '@tiptap/core';
import { TextSelection } from 'prosemirror-state';

export function nodeInputRuleWithContentRule({ find, type, getAttributes, content }) {
    return new InputRule({
        find,
        handler: ({ state, range, match }) => {
            const attributes = callOrReturn(getAttributes, undefined, match) || {};
            let { tr } = state;
            const start = range.from;
            let end = range.to;

            if (match[1]) {
                const offset = match[0].lastIndexOf(match[1]);
                const matchStart = start + offset;

                if (matchStart > end) {
                    matchStart = end;
                } else {
                    end = matchStart + match[1].length;
                }
                // insert last typed character
                const lastChar = match[0][match[0].length - 1];

                tr.insertText(lastChar, start + match[0].length - 1);

                // insert node from input rule
                const textNode = state.schema.nodeFromJSON({
                    type: 'paragraph',
                    content: [
                        {
                            type: 'text',
                            text: content,
                        },
                    ],
                });
                const itemNode = type.create(attributes, textNode);
                tr = tr.replaceWith(matchStart, end, itemNode);
                const selection = TextSelection.near(tr.doc.resolve(matchStart + itemNode.nodeSize - 1));
                tr.setSelection(selection);
            } else if (match[0]) {
                const textNode = state.schema.nodeFromJSON({
                    type: 'paragraph',
                    content: [
                        {
                            type: 'text',
                            text: content,
                        },
                    ],
                });
                const itemNode = type.create(attributes, textNode);
                tr = tr.replaceWith(matchStart, end, itemNode);
                const selection = TextSelection.near(tr.doc.resolve(matchStart + itemNode.nodeSize - 1));
                tr.setSelection(selection);
            }
        },
    });
}
