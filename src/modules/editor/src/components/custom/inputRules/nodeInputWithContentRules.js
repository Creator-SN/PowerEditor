import { callOrReturn, findParentNode, getAttributes, InputRule } from '@tiptap/core';
import { TextSelection } from 'prosemirror-state';

export function nodeInputWithContentRule({ find, type, getAttributes, content, overlapIgnore = [] }) {
    return new InputRule({
        find,
        handler: ({ state, range, match }) => {
            const attributes = callOrReturn(getAttributes, undefined, match) || {};
            let { tr } = state;
            const start = range.from;
            let end = range.to;

            if (overlapIgnore.length > 0) {
                if (
                    matchIgnore({
                        state,
                        overlapIgnore,
                    })
                ) {
                    return;
                }
            }

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
                let itemNode = undefined;
                if (content != null) {
                    // insert node from input rule
                    const textNode = state.schema.nodeFromJSON(content);
                    itemNode = type.create(attributes, textNode);
                } else {
                    itemNode = type.create(attributes);
                }
                tr = tr.replaceWith(matchStart, end, itemNode);
                const selection = TextSelection.near(tr.doc.resolve(matchStart + itemNode.nodeSize - 1));
                tr.setSelection(selection);
            } else if (match[0]) {
                let itemNode = undefined;
                if (content != null) {
                    // insert node from input rule
                    const textNode = state.schema.nodeFromJSON(content);
                    itemNode = type.create(attributes, textNode);
                } else {
                    itemNode = type.create(attributes);
                }
                tr = tr.replaceWith(start, end, itemNode);
                const selection = TextSelection.near(tr.doc.resolve(start + itemNode.nodeSize - 1));
                tr.setSelection(selection);
            }
        },
    });
}

function matchIgnore({ state, overlapIgnore }) {
    let selection = state.selection;
    let path = selection.$anchor.path;
    let ignore = false;
    for (let p of path) {
        if (!p.type) continue;
        let name = p.type.name;
        if (overlapIgnore.includes(name)) {
            ignore = true;
            break;
        }
    }
    return ignore;
}
