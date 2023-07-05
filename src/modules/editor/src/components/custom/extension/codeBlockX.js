import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { mergeAttributes } from '@tiptap/core';

export default CodeBlockLowlight.extend({
    renderHTML({ node, HTMLAttributes }) {
        return [
            'pre',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
            [
                'code',
                {
                    class: node.attrs.language
                        ? this.options.languageClassPrefix + node.attrs.language
                        : null,
                    'data-language': node.attrs.language || '',
                },
                0,
            ],
        ]
    }
});