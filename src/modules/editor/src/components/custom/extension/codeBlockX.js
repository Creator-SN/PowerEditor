import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from "@tiptap/vue-2";

import codeBlockX from "../source/codeBlockX.vue";

export default CodeBlockLowlight.extend({
    addNodeView() {
        return VueNodeViewRenderer(codeBlockX)
    }
});