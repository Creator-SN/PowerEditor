<template>
    <node-view-wrapper
        v-if="node"
        :as="node.attrs.tag"
        class="power-editor-equation-container"
        :class="{ dark: thisTheme === 'dark', div: node.attrs.tag == 'div', selected: selected }"
        :style="{ '--selected-bg': focusForeground }"
    >
        <transition name="power-editor-equation-popper-fade">
            <div v-show="showPopper" class="power-editor-equation-popper-container" :style="{ left: `${left}px`, top: `${top}%` }" @keyup.enter="!lock ? close() : ''">
                <textarea
                    v-model="thisValue"
                    class="power-editor-equation-popper-input"
                    :placeholder="node.attrs.placeholder"
                    ref="input"
                    :style="{ height: `${inputHight}px` }"
                    @keydown.enter="$event.preventDefault()"
                    @keydown="closeWithLeftRight($event)"
                ></textarea>
                <fv-button class="power-editor-equation-popper-btn" :theme="'dark'" :disabled="lock" icon="AcceptMedium" :background="thisForeground" :is-box-shadow="true" @click="close">{{
                    getTitle('Done')
                }}</fv-button>
            </div>
        </transition>
        <div
            v-if="node.attrs.tag == 'div'"
            draggable="true"
            data-drag-handle
            class="power-editor-equation-drag-btn"
            @mousedown="active = true"
            @mouseup="active = false"
            @touchstart="active = true"
            @touchend="active = false"
        >
            <i class="ms-Icon ms-Icon--GripperDotsVertical"></i>
        </div>
        <span
            class="power-editor-equation-target"
            :placeholder="node.attrs.emptyPlaceholder"
            :class="{ empty: thisValue === '' }"
            v-html="thisValue === '' ? node.attrs.emptyPlaceholder : equationString"
            ref="target"
            :style="{ color: `${lock ? 'red' : ''}`, '--selected-bg': focusForeground }"
            @click="show"
        ></span>
    </node-view-wrapper>
</template>

<script>
import onecolor from 'onecolor';
import { NodeViewWrapper } from '@tiptap/vue-2';
import { TextSelection } from 'prosemirror-state';

export default {
    components: {
        NodeViewWrapper,
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
            left: 0,
            top: 100,
            thisValue: this.node.attrs.value,
            showPopper: false,
            equationString: '',
            errorMsg: '',
            active: false,
            outsideEvent: (event) => {
                if (!this.showPopper) return 0;
                let x = event.target;
                let _self = false;
                while (x && x.tagName && x.tagName.toLowerCase() != 'body') {
                    if (x == this.$el) {
                        _self = true;
                        break;
                    }
                    x = x.parentNode;
                }
                if (!_self) this.close(false);
            },
            thisTheme: this.editor.storage.defaultStorage.theme,
            thisForeground: this.editor.storage.defaultStorage.foreground,
            getTitle: this.editor.storage.defaultStorage.getTitle,
            inputHight: '',
            lock: false,
        };
    },
    watch: {
        showPopper(val) {
            if (val) {
                this.showPos();
                this.$nextTick(() => {
                    this.inputHight = this.$refs.input.scrollHeight;
                });
            }
        },
        thisValue(val) {
            if (val === '') {
                this.equationString = '';
                this.lock = false;
            } else this.render();
            this.$nextTick(() => {
                this.inputHight = this.$refs.input.scrollHeight;
            });
        },
        'editor.storage.defaultStorage.theme'(val) {
            this.thisTheme = val;
        },
        'editor.storage.defaultStorage.foreground'(val) {
            this.thisForeground = val;
        },
        selected(val) {
            if (val) this.show();
        },
    },
    computed: {
        focusForeground() {
            try {
                let color = onecolor(this.thisForeground);
                color = color.alpha(0.3);
                return color.cssa();
            } catch (e) {
                return '';
            }
        },
    },

    mounted() {
        this.outSideClickInit();
        this.render();
        this.$nextTick(() => {
            if (this.node.attrs.value === '') this.show();
        });
    },
    methods: {
        outSideClickInit() {
            window.addEventListener('click', this.outsideEvent);
        },
        render() {
            try {
                // replace /tag{xxx} with ''
                this.equationString = this.$katex.renderToString(this.thisValue.replace(/\\tag\{.*?\}/g, ''), {
                    throwOnError: true,
                });
                this.lock = false;
            } catch (e) {
                if (e instanceof this.$katex.ParseError) {
                    // KaTeX can't parse the expression
                    this.errorMsg = ("Error in LaTeX '" + this.thisValue + "': " + e.message).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                } else {
                    throw e; // other error
                }
                this.lock = true;
            }
        },
        showPos() {
            let el = this.$refs.target;
            let bottom = el.getBoundingClientRect().bottom;
            let left = el.getBoundingClientRect().left;
            if (bottom < 50) this.top = -100;
            else this.top = 100;
            if (left + 300 > document.body.clientWidth) this.left = document.body - 300 - left;
            else this.left = 0;
        },
        show() {
            if (!this.editor.isEditable) return;
            this.showPopper = true;
            setTimeout(() => {
                this.$refs.input.focus();
            }, 300);
        },
        close(confirm = true) {
            this.showPopper = false;
            if (confirm) this.updateAttributes({ value: this.thisValue });
            else this.thisValue = this.node.attrs.value;
            this.editor.commands.focus();
            const { tr } = this.editor.view.state;
            let selection = null;
            if (this.$refs.input.selectionEnd === 0) selection = TextSelection.near(tr.doc.resolve(this.getPos()));
            else selection = TextSelection.near(tr.doc.resolve(this.getPos() + this.node.nodeSize));
            tr.setSelection(selection);
            this.editor.view.dispatch(tr);
        },
        closeWithLeftRight(event) {
            let startPos = this.$refs.input.selectionStart;
            let endPos = this.$refs.input.selectionEnd;
            if (startPos !== endPos) {
                return;
            }
            if (event.key === 'ArrowLeft') {
                if (startPos === 0) {
                    this.close(false);
                }
            }
            if (event.key === 'ArrowRight') {
                if (startPos === this.$refs.input.value.length) {
                    this.close(false);
                }
            }
        },
    },
    beforeDestroy() {
        window.removeEventListener('click', this.outsideEvent);
    },
};
</script>

<style lang="scss">
.power-editor-equation-container {
    position: relative;
    width: auto;
    height: auto;
    transition: background-color 0.3s;

    --selected-bg: rgba(45, 170, 219, 0.3);

    &.selected {
        .power-editor-equation-target {
            background: var(--selected-bg, rgba(45, 170, 219, 0.3));
        }
    }

    &.div {
        padding: 1px 0px;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        align-items: center;

        &.selected {
            background: var(--selected-bg, rgba(45, 170, 219, 0.3));

            .power-editor-equation-target {
                background: transparent;

                &:hover {
                    background: rgba(200, 200, 200, 0.6);
                }
            }
        }
    }

    &.dark {
        .power-editor-equation-popper-container {
            background: black;

            .power-editor-equation-popper-input {
                background: transparent;
                color: whitesmoke;

                &:hover {
                    background: rgba(75, 75, 75, 0.6);
                }
            }
        }

        .power-editor-equation-target {
            color: whitesmoke;
        }

        .power-editor-equation-drag-btn {
            color: whitesmoke;
        }
    }

    &:hover {
        .power-editor-equation-drag-btn {
            opacity: 1;
        }
    }

    .power-editor-equation-popper-container {
        position: absolute;
        left: 0px;
        top: 100%;
        width: 350px;
        height: auto;
        padding: 5px;
        background: whitesmoke;
        border: rgba(120, 120, 120, 0.1) solid thin;
        border-radius: 3px;
        box-sizing: border-box;
        display: flex;
        align-items: flex-start;
        box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        z-index: 1;

        .power-editor-equation-popper-btn {
            width: 80px;
            margin-left: 5px;
        }

        .power-editor-equation-popper-input {
            height: auto;
            margin-right: 5px;
            padding: 5px;
            flex: 1;
            background: transparent;
            font-family: 'Source Code Pro', monospace;
            border: none;
            border-radius: 3px;
            box-sizing: border-box;
            outline: none;
            resize: none;
            transition: background 0.3s;
            overflow: hidden;

            &:hover {
                background: rgba(255, 255, 255, 0.6);
            }
        }
    }

    .power-editor-equation-drag-btn {
        position: absolute;
        left: 5px;
        top: 5px;
        width: auto;
        height: auto;
        font-size: 18px;
        color: rgba(36, 36, 36, 1);
        opacity: 0;
        transition: opacity 1s;
        cursor: grab;
    }

    .power-editor-equation-target {
        max-width: 100%;
        padding: 5px 2px;
        border-radius: 3px;
        box-sizing: border-box;
        overflow-x: auto;
        overflow-y: hidden;
        user-select: all;

        &.empty {
            color: rgba(200, 200, 200, 0.8);
        }

        &:hover {
            background: rgba(200, 200, 200, 0.6);
        }
    }

    .power-editor-equation-popper-fade-enter-active {
        transition: opacity 0.05s ease-out, transform 0.05s ease-out;
    }

    .power-editor-equation-popper-fade-enter {
        transform: scale(0);
        opacity: 0;
    }

    .power-editor-equation-popper-fade-enter-to {
        transform: scale(1);
        opacity: 1;
    }

    .power-editor-equation-popper-fade-leave-active {
        transition: transform 0.05s ease-out;
    }

    .power-editor-equation-popper-fade-leave {
        transform: scale(1);
    }

    .power-editor-equation-popper-fade-leave-to {
        transform: scale(0);
    }
}
</style>
