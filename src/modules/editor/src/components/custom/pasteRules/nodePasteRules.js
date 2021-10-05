import { Plugin } from 'prosemirror-state';
import { Slice, Fragment } from 'prosemirror-model';
export function nodePasteRule(regexp, type, getAttrs) {
    const handler = (fragment) => {
        const nodes = [];

        fragment.forEach((child) => {
            if (child.isText) {
                const { text } = child;
                let pos = 0;
                let match;

                // console.log("text", text)
                // console.log("regexp", regexp)
                // console.log("res", regexp.exec(text))

                // eslint-disable-next-line
                while ((match = regexp.exec(text)) !== null) {

                    // console.log(match[0])
                    if (match[0]) {
                        const start = match.index;
                        const end = start + match[0].length;
                        const attrs = getAttrs instanceof Function ? getAttrs(match[0], match[1].length) : getAttrs;

                        // adding text before markdown to nodes
                        if (start > 0) {
                            nodes.push(child.cut(pos, start));
                        }

                        // console.log(type)

                        // create the node
                        nodes.push(type.create(attrs));

                        pos = end;
                    }
                }

                // adding rest of text to nodes
                if (pos < text.length) {
                    nodes.push(child.cut(pos));
                }
            } else {
                nodes.push(child.copy(handler(child.content)));
            }
        });
        // console.log(nodes)
        return Fragment.fromArray(nodes);
    };

    return new Plugin({
        props: {
            transformPasted: (slice) => new Slice(handler(slice.content), slice.openStart, slice.openEnd),
        },
    });
}
