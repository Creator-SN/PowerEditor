<template>
    <node-view-wrapper
        v-if="node"
        as="span"
        class="power-editor-mention-container"
        :class="{ dark: node.attrs.theme === 'dark', selected: selected }"
    >
        <transition name="power-editor-mention-popper-fade">
            <div
                v-show="node.attrs.showPopper && filterItems.length > 0"
                class="power-editor-mention-popper-container"
                :style="{ left: `${left}px`, top: `${top}px` }"
            >
                <fv-list-view
                    :value="filterItems"
                    class="power-editor-mention-popper-list-view"
                    :headerForeground="node.attrs.headerForeground"
                    ref="list"
                    @chooseItem="chooseItem"
                >
                    <template v-slot:listItem="x">
                        <img
                            v-if="x.item.image"
                            :src="x.valueTrigger(x.item.image)"
                            alt=""
                            style="width: auto; height: 30px; margin-right: 15px;"
                        >
                        <i
                            v-if="x.item.icon"
                            class="ms-Icon"
                            :class="[`ms-Icon--${x.valueTrigger(x.item.icon)}`]"
                            :style="{color: x.valueTrigger(x.item.iconColor)}"
                            style="margin-right: 15px;"
                        ></i>
                        <p
                            :style="{ color: x.valueTrigger(x.item.type) == 'header' ? node.attrs.headerForeground : '' }"
                            style="flex: 1;"
                        >{{x.valueTrigger(x.item.name)}}</p>
                    </template>
                </fv-list-view>
            </div>
        </transition>
        <span
            class="power-editor-mention-display-block"
            @click="node.attrs.mentionClickCallback(node.attrs.currentItem, node.attrs.value)"
        >
            <p
                v-if="!node.attrs.currentItem.image && !node.attrs.currentItem.icon"
                class="power-editor-mention-icon"
            >@</p>
            <img
                v-if="node.attrs.currentItem.image"
                :src="valueTrigger(node.attrs.currentItem.image)"
                alt=""
                class="power-editor-mention-icon"
            >
            <i
                v-if="node.attrs.currentItem.icon"
                class="ms-Icon power-editor-mention-icon"
                :class="[`ms-Icon--${valueTrigger(node.attrs.currentItem.icon)}`]"
                :style="{color: valueTrigger(node.attrs.currentItem.iconColor)}"
            ></i>
            <input
                v-model="node.attrs.value"
                class="power-editor-mention-input"
                :placeholder="node.attrs.placeholder"
                :class="[{freeze: node.attrs.freeze}]"
                :readonly="node.attrs.freeze"
                ref="target"
                :style="{color: node.attrs.currentItem.color}"
                @keydown.backspace="delRecover"
                @keydown.tab="skipNode"
            />
            <p class="power-editor-mention-placeholder">{{node.attrs.value ? node.attrs.value : node.attrs.placeholder}}</p>
        </span>
    </node-view-wrapper>
</template>

<script>
import { NodeViewWrapper } from '@tiptap/vue-2';

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
            outsideEvent: (event) => {
                if (!this.node.attrs.showPopper) return 0;
                let x = event.target;
                let _self = false;
                while (x && x.tagName && x.tagName.toLowerCase() != 'body') {
                    if (x == this.$el) {
                        _self = true;
                        break;
                    }
                    x = x.parentNode;
                }
                if (!_self) this.close();
            },
        };
    },
    watch: {
        'node.attrs.showPopper'(val) {
            if (val) {
                this.showPos();
            }
        },
        'node.attrs.value'() {
            this.delRecover();
        },
    },
    computed: {
        filterItems() {
            let result = [];
            this.node.attrs.mentionList(this.node.attrs.value).forEach((el) => {
                if (this.node.attrs.filterFunc(el, this.node.attrs.value)) {
                    result.push(el);
                }
            });
            return result;
        },
    },
    mounted() {
        this.outSideClickInit();
        this.windowEventInit();
        setTimeout(() => {
            if (!this.node.attrs.freeze) {
                this.show();
                this.$refs.target.focus();
                this.$refs.list.focus = true;
            }
        }, 300);
    },

    methods: {
        outSideClickInit() {
            window.addEventListener('click', this.outsideEvent);
        },
        windowEventInit() {
            window.addEventListener('scroll', this.showPos);
            this.editor.$ContentContainer.addEventListener('scroll', this.showPos);
        },
        showPos() {
            let el = this.$refs.target;
            if (!el.getBoundingClientRect) return;
            const { left, top } = el.getBoundingClientRect();
            if (document.body.clientWidth - left < 260) this.left = document.body.clientWidth - 260;
            else this.left = left - 20;
            if (document.body.clientHeight - top < 300) this.top = document.body.clientHeight - 300;
            else this.top = top + 30;
        },
        show() {
            if (!this.editor.isEditable) return;
            this.updateAttributes({
                showPopper: true,
            });
            setTimeout(() => {
                this.$refs.target.focus();
            }, 300);
        },
        chooseItem(event) {
            this.updateAttributes({
                value: event.item.name,
                currentItem: event.item,
                freeze: true,
            });
            this.node.attrs.chooseItemCallback(event.item, this.node.attrs.value);
            this.close();
        },
        valueTrigger(val) {
            if (typeof val === 'function') return val();
            return val;
        },
        delRecover() {
            if (this.node.attrs.value === '') {
                this.deleteNode();
                this.editor.commands.focus();
                this.editor.commands.insertContent('@');
            }
        },
        skipNode(event) {
            event.preventDefault();
            this.editor.commands.focus();
        },
        close() {
            this.updateAttributes({
                showPopper: false,
            });
            this.$refs.list.focus = false;
            this.editor.commands.focus();
        },
    },
    beforeDestroy() {
        window.removeEventListener('click', this.outsideEvent);
        window.removeEventListener('scroll', this.showPos);
        this.editor.$ContentContainer.removeEventListener('scroll', this.showPos);
    },
};
</script>

<style lang="scss">
.power-editor-mention-container {
    position: relative;
    width: auto;
    height: 30px;
    padding: 3px 3px 1px 3px;
    background: rgba(250, 250, 250, 1);
    font-size: 16px;
    border-radius: 5px;
    transition: background-color 0.3s;
    box-sizing: border-box;
    display: inline-flex;
    align-items: flex-end;
    cursor: pointer;

    &.selected {
        background: rgba(45, 170, 219, 0.3);
    }

    &:hover {
        background: rgba(200, 200, 200, 0.6);
    }

    &.dark {
        background: rgba(36, 36, 36, 1);

        &:hover {
            background: rgba(75, 75, 75, 0.6);
        }

        .power-editor-mention-popper-container {
            background: black;
        }

        .power-editor-mention-display-block {
            .power-editor-mention-icon {
                color: whitesmoke;
            }

            .power-editor-mention-input {
                background: transparent;
                color: whitesmoke;
            }
        }
    }

    .power-editor-mention-popper-container {
        position: fixed;
        left: 0px;
        top: 100%;
        width: 260px;
        height: 300px;
        background: whitesmoke;
        border: rgba(50, 49, 48, 0.1) solid thin;
        border-radius: 6px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        box-shadow: 8px 10px 20px rgba(0, 0, 0, 0.2);
        z-index: 1;

        .power-editor-mention-popper-list-view {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 6px;
        }
    }

    .power-editor-mention-display-block {
        position: relative;
        width: auto;
        max-width: 100%;
        height: 100%;
        font-size: 16px;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        overflow-x: auto;
        overflow-y: hidden;

        .power-editor-mention-icon {
            width: 20px;
            height: 100%;
            margin: 0px 2px 0px 1px;
            text-align: center;
            object-fit: contain;
        }

        .power-editor-mention-input {
            position: absolute;
            left: 23px;
            width: calc(100% - 23px);
            height: 100%;
            padding-right: 0px;
            background: transparent;
            font-size: 16px;
            border: none;
            box-sizing: border-box;
            outline: none;
            user-select: all;

            &.freeze {
                cursor: pointer;
            }
        }

        .power-editor-mention-placeholder {
            position: relative;
            min-width: 20px;
            width: auto;
            height: 100%;
            margin: 0px;
            background: transparent;
            font-size: 18px;
            border: none;
            opacity: 0;
            user-select: none;
            z-index: -1;
        }
    }

    .power-editor-mention-popper-fade-enter-active {
        transition: opacity 0.1s ease-out, transform 0.1s ease-out;
        transform-origin: 50% 0%;
    }

    .power-editor-mention-popper-fade-enter {
        transform: scale(0);
        opacity: 0;
    }

    .power-editor-mention-popper-fade-enter-to {
        transform: scale(1);
        opacity: 1;
    }

    .power-editor-mention-popper-fade-leave-active {
        transition: transform 0.01s ease-out;
        transform-origin: 50% 0%;
    }

    .power-editor-mention-popper-fade-leave {
        transform: scale(1);
    }

    .power-editor-mention-popper-fade-leave-to {
        transform: scale(0);
    }
}
</style>
