<template>
    <node-view-wrapper
        v-if="node"
        class="power-editor-image-container"
        :class="[{dark: thisTheme === 'dark'}]"
        :style="{ 'justify-content': node.attrs.alignCenter ? 'center' : 'flex-start' }"
    >
        <media-container
            :width.sync="node.attrs.width"
            :caption.sync="node.attrs.caption"
            :alignCenter.sync="node.attrs.alignCenter"
            :editor="editor"
            :theme="thisTheme"
            :foreground="thisForeground"
            :node="node"
            :getPos="getPos"
        >
            <fv-image
                :src="node.attrs.src"
                ref="image"
                style="width: 100%; height: auto"
                :style="{height: !node.attrs.src && statusInfo.show ? statusInfo.tmpHeight + 'px' : ''}"
            ></fv-image>
            <div
                v-show="statusInfo.show"
                class="power-editor-image-status-container"
            >
                <fv-progress-ring
                    v-model="statusInfo.progress"
                    :loading="statusInfo.loading"
                    r="20"
                    borderWidth="3"
                    :color="thisTheme === 'dark' ? 'white' : 'black'"
                    :background="thisTheme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)'"
                ></fv-progress-ring>
                <p
                    v-show="statusInfo.info"
                    class="power-editor-image-status-title"
                >{{statusInfo.info}}</p>
            </div>
            <div
                class="power-editor-image-selection-mask"
                :class="[{selected: selected}]"
            ></div>
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
            statusInfo: {
                show: false,
                progress: 0,
                loading: false,
                info: '',
                tmpSrc: '',
                tmpHeight: 0,
                lock: true,
            },
            thisTheme: this.editor.storage.defaultStorage.theme,
            thisForeground: this.editor.storage.defaultStorage.foreground,
            imgInterceptor: this.editor.storage.defaultStorage.imgInterceptor,
        };
    },
    watch: {
        // selected(val) {
        //     console.log(val);
        // },
        'node.attrs.src'() {
            this.imgInterceptorFunc();
        },
        'editor.storage.defaultStorage.theme'(val) {
            this.thisTheme = val;
        },
        'editor.storage.defaultStorage.foreground'(val) {
            this.thisForeground = val;
        },
        'editor.storage.defaultStorage.imgInterceptor'(val) {
            this.imgInterceptor = val;
            this.imgInterceptorFunc();
        },
    },
    mounted() {
        this.imgInterceptorFunc();
    },
    methods: {
        showStatus(status) {
            this.statusInfo.show = status;
        },
        updateStatus(loading, progress, info = '') {
            this.statusInfo.loading = loading;
            this.statusInfo.progress = progress;
            this.statusInfo.info = info;
        },
        interceptImage(replaceSrc = '') {
            this.statusInfo.tmpSrc = this.node.attrs.src;
            this.statusInfo.tmpHeight = this.$refs.image.$el.clientHeight;
            this.updateAttributes({
                src: replaceSrc,
            });
            return this.statusInfo.tmpSrc;
        },
        updateImage(src) {
            this.updateAttributes({
                src: src,
            });
        },
        updateLock(lock) {
            this.statusInfo.lock = lock;
        },
        imgInterceptorFunc() {
            let funcAttrs = {
                node: this.node,
                extension: this.extension,
                getPos: this.getPos,
                updateAttributes: this.updateAttributes,
                deleteNode: this.deleteNode,
                showStatus: this.showStatus,
                updateStatus: this.updateStatus,
                interceptImage: this.interceptImage,
                updateImage: this.updateImage,
                updateLock: this.updateLock,
            };
            if (this.imgInterceptor) {
                this.imgInterceptor(funcAttrs);
            }
        },
    },
};
</script>

<style lang="scss">
.power-editor-image-container {
    position: relative;
    width: 100%;
    min-height: 50px;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;

    &.dark {
        .power-editor-image-status-container {
            background: rgba(0, 0, 0, 0.3);
        }
    }

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

    .power-editor-image-status-container {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: rgba(255, 255, 255, 0.3);
        transition: all 0.3s;

        .power-editor-image-status-title {
            font-size: 12px;
        }
    }
}
</style>
