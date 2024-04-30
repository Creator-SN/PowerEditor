<template>
    <node-view-wrapper
        v-if="node"
        class="power-editor-image-container"
        :class="[{dark: thisTheme === 'dark'}]"
        :style="{ 'justify-content': node.attrs.alignCenter ? 'center' : 'flex-start' }"
    >
        <media-container
            :width.sync="node.attrs.width"
            :caption="node.attrs.caption"
            :alignCenter.sync="node.attrs.alignCenter"
            :editor="editor"
            :theme="thisTheme"
            :foreground="thisForeground"
            :node="node"
            :getPos="getPos"
            @update:caption="updateAttributes({caption: $event})"
            @container-dblclick="preview('editable')"
            @container-click="preview('readonly')"
        >
            <fv-image
                :src="node.attrs.src ? node.attrs.src : (statusInfo.tmpSrc ? statusInfo.tmpSrc : '')"
                ref="image"
                :onlazy="thisLazyLoad"
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
        <transition name="show-preview">
            <div
                v-show="previewImg.show"
                class="power-editor-image-preview-block"
                @click="previewImg.show = false"
            >
                <fv-img
                    :src="node.attrs.src"
                    class="power-editor-preview-img"
                    :style="{scale: previewImg.scalePercent + '%', cursor: previewImg.scalePercent < 150 ? 'zoom-in' : 'zoom-out'}"
                    @click.native="previewImg.scalePercent < 100 ? setScale($event, 100) : (previewImg.scalePercent < 150 ? setScale($event, 150) : setScale($event, 100))"
                ></fv-img>
                <div
                    class="power-editor-preview-tool-bar"
                    @click="$event.stopPropagation()"
                >
                    <fv-button
                        class="power-editor-preview-img-btn"
                        theme="dark"
                        :disabled="previewImg.scalePercent <= 50"
                        background="rgba(36, 36, 36, 0.3)"
                        @click="scale($event, -50)"
                    >
                        <i class="ms-Icon ms-Icon--CalculatorSubtract"></i>
                    </fv-button>
                    <fv-text-box
                        :value="previewImg.scalePercent"
                        theme="dark"
                        underline
                        border-color="rgba(120, 120, 120, 0.1)"
                        :focus-border-color="thisForeground"
                        :border-width="2"
                        :is-box-shadow="true"
                        suffix="%"
                        style="width: 80px; height: 35px;"
                        @debounce-input="setScale($event, $event)"
                    ></fv-text-box>
                    <fv-button
                        class="power-editor-preview-img-btn"
                        theme="dark"
                        :disabled="previewImg.scalePercent >= 200"
                        background="rgba(36, 36, 36, 0.3)"
                        border-color="transparent"
                        @click="scale($event, 50)"
                    >
                        <i class="ms-Icon ms-Icon--CalculatorAddition"></i>
                    </fv-button>
                    <fv-button
                        class="power-editor-preview-img-btn"
                        theme="dark"
                        background="rgba(36, 36, 36, 0.3)"
                        @click="previewImg.show = false"
                    >
                        <i class="ms-Icon ms-Icon--BackToWindow"></i>
                    </fv-button>
                </div>
            </div>
        </transition>
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
            previewImg: {
                scalePercent: '100',
                show: false,
            },
            thisTheme: this.editor.storage.defaultStorage.theme,
            thisLazyLoad: this.editor.storage.defaultStorage.imgLazyLoad,
            thisForeground: this.editor.storage.defaultStorage.foreground,
            thisImgPreview: this.editor.storage.defaultStorage.imgPreview,
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
        'editor.storage.defaultStorage.imgLazyLoad'(val) {
            this.thisLazyLoad = val;
        },
        'editor.storage.defaultStorage.imgPreview'(val) {
            this.thisImgPreview = val;
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
        preview(mode = 'readonly') {
            if (this.editor.isEditable && mode !== 'editable') {
                return;
            }
            if (!this.editor.isEditable && mode !== 'readonly') {
                return;
            }
            if (!this.node.attrs.src) {
                return;
            }
            if (this.thisImgPreview) {
                this.previewImg.show = true;
            }
        },
        scale(event, rate) {
            if (event.stopPropagation) event.stopPropagation();
            let scalePercent = parseInt(this.previewImg.scalePercent);
            scalePercent += rate;
            if (scalePercent < 50) {
                scalePercent = 50;
            } else if (scalePercent > 200) {
                scalePercent = 200;
            }
            this.previewImg.scalePercent = scalePercent.toString();
        },
        setScale(event, rate) {
            if (event.stopPropagation) event.stopPropagation();
            if (rate < 50) {
                rate = 50;
            } else if (rate > 200) {
                rate = 200;
            }
            this.previewImg.scalePercent = rate.toString();
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
    cursor: pointer;

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

    .power-editor-image-preview-block {
        position: fixed;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        isolation: isolate;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;

        .power-editor-preview-img {
            position: relative;
            width: 50%;
            height: auto;
            transition: all 0.3s;
        }

        .power-editor-preview-tool-bar {
            position: absolute;
            bottom: 15px;
            width: auto;
            height: 38px;
            padding: 0px 1px;
            background: rgba(36, 36, 36, 0.8);
            border-radius: 3px;
            display: flex;
            align-items: center;
            box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(50px);
            -webkit-backdrop-filter: blur(50px);

            .power-editor-preview-img-btn {
                width: 35px;
                height: 35px;
            }
        }
    }

    .show-preview-enter-active,
    .show-preview-leave-active {
        transition: opacity 0.3s;
    }

    .show-preview-enter,
    .show-preview-leave-to {
        opacity: 0;
    }

    .show-preview-leave,
    .show-preview-enter-to {
        opacity: 1;
    }
}
</style>
