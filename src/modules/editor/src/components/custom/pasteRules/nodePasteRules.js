
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
                chain()
                    .deleteRange(range)
                    .insertContent({
                        type: type.name,
                        attrs: attributes,
                    })
            }
        },
    })
}