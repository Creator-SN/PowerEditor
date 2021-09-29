<template>
    <node-view-wrapper v-if="node" as="li" class="power-editor-task-item-container">
        <fv-check-box :value="node.attrs.checked" :disabled="!editor.isEditable"></fv-check-box>
        <node-view-content ref="n" class="content"></node-view-content>
        <p v-show="show" class="placeholder">{{ node.attrs.placeholder }}</p>
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
            show: true,
            timer: {},
        };
    },
    mounted() {
        this.timerInit();
    },
    methods: {
        timerInit() {
            this.timer = setInterval(() => {
                this.show = this.$refs.n.$el.innerText.replace(/\n/g, '') === '';
            }, 50);
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

    .content {
        min-width: 10px;
        margin-left: 5px;
    }

    .placeholder {
        position: absolute;
        left: 32px;
        color: rgba(200, 200, 200, 1);
        user-select: none;
        cursor: text;
    }
}
</style>
