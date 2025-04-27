<template>
    <node-view-wrapper
        v-if="node"
        as="li"
        class="power-editor-task-item-container"
    >
        <fv-check-box
            v-model="node.attrs.checked"
            :theme="thisTheme"
            :disabled="!editor.isEditable"
            :background="thisForeground"
            contenteditable="false"
            @click="updateValue"
        ></fv-check-box>
        <node-view-content
            ref="n"
            class="power-editor-task-item-content"
        ></node-view-content>
    </node-view-wrapper>
</template>

<script>
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-2';

export default {
    components: {
        NodeViewWrapper,
        NodeViewContent,
    },
    props: {
        // the editor instance
        editor: {
            type: Object,
        },

        // the current node
        node: {
            type: Object,
        },

        // an array of decorations
        decorations: {
            type: Array,
        },

        // `true` when there is a `NodeSelection` at the current node view
        selected: {
            type: Boolean,
        },

        // access to the node extension, for example to get options
        extension: {
            type: Object,
        },

        // get the document position of the current node
        getPos: {
            type: Function,
        },

        // update attributes of the current node
        updateAttributes: {
            type: Function,
        },

        // delete the current node
        deleteNode: {
            type: Function,
        },
    },
    data() {
        return {
            thisTheme: this.editor.storage.defaultStorage.theme,
            thisForeground: this.editor.storage.defaultStorage.foreground,
            timer: {},
        };
    },
    watch: {
        'editor.storage.defaultStorage.theme'(val) {
            this.thisTheme = val;
        },
        'editor.storage.defaultStorage.foreground'(val) {
            this.thisForeground = val;
        },
    },
    mounted() {},
    methods: {
        preventEnter(event) {
            console.log(event);
        },
        updateValue(event) {
            this.updateAttributes({
                checked: event,
            });
        },
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
};
</script>

<style lang="scss">
.power-editor-task-item-container {
    position: relative;
    display: flex;
    align-items: center;

    .power-editor-task-item-content {
        min-width: 10px;
        margin-left: 5px;
        white-space: nowrap;

        p
        {
            margin: 0px;
        }
    }

    .power-editor-task-item-placeholder {
        position: absolute;
        left: 32px;
        top: 0px;
        color: rgba(200, 200, 200, 1);
        user-select: none;
        cursor: text;
    }
}
</style>
