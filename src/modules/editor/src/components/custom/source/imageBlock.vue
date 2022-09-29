<template>
    <node-view-wrapper
        v-if="node"
        class="power-editor-image-container"
        :style="{ 'justify-content': node.attrs.alignCenter ? 'center' : 'flex-start' }"
    >
        <media-container
            :width.sync="node.attrs.width"
            :caption.sync="node.attrs.caption"
            :alignCenter.sync="node.attrs.alignCenter"
            :editor="editor"
            :theme="thisTheme"
            :node="node" :getPos="getPos"
        >
            <fv-image
                :src="node.attrs.src"
                style="width: 100%; height: auto"
            ></fv-image>
            <div class="power-editor-image-selection-mask" :class="[{selected: selected}]"></div>
        </media-container>
    </node-view-wrapper>
</template>

<script>
import { NodeViewWrapper } from '@tiptap/vue-2';
import mediaContainer from './mediaContainer.vue';

export default {
    components: {
        NodeViewWrapper,
        mediaContainer,
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
            thisTheme: this.editor.storage.defaultStorage.theme
        };
    },
    watch: {
        // selected(val) {
        //     console.log(val);
        // },
        'editor.storage.defaultStorage.theme' (val) {
            this.thisTheme = val
        }
    },
};
</script>

<style lang="scss">
.power-editor-image-container {
    position: relative;
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;

    .power-editor-image-selection-mask {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        transition: all 0.3s;

        &.selected {
            background: rgba(45, 170, 219, 0.3);
        }
    }
}
</style>
