
import { PasteRule, callOrReturn } from '@tiptap/core'

/**
 * Build an paste rule that adds a node when the
 * matched text is pasted into it.
 */
export function nodePasteRule({
    find,
    type,
    getAttributes
}) {
    return new PasteRule({
        find,
        handler({ match, chain, range }) {
            const attributes = callOrReturn(getAttributes, undefined, match)

            if (attributes === false || attributes === null) {
                return null
            }

            if (match.input) {
                const { from, to } = range;
                // const content = match[2]; // 提取公式内容

                chain()
                    .deleteRange(range)
                    .insertContentAt(from, [
                        {
                            type: type.name,
                            attrs: attributes,
                        },
                    ])
            }
        },
    })
}