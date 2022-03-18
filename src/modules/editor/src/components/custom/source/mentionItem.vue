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
                :style="{ left: `${left}px`, top: `${top}%` }"
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
                        <p :style="{ color: x.valueTrigger(x.item.type) == 'header' ? node.attrs.headerForeground : '' }" style="flex: 1;">{{x.valueTrigger(x.item.name)}}</p>
                    </template>
                </fv-list-view>
            </div>
        </transition>
        <span
            class="power-editor-mention-display-block"
            @click="node.attrs.mentionClickCallback(currentItem, node.attrs.value)"
        >
            <p v-if="!currentItem.image && !currentItem.icon">@</p>
            <img
                v-if="currentItem.image"
                :src="valueTrigger(currentItem.image)"
                alt=""
                style="width: auto; height: 30px; margin: 0px 8px;"
            >
            <i
                v-if="currentItem.icon"
                class="ms-Icon"
                :class="[`ms-Icon--${valueTrigger(currentItem.icon)}`]"
                :style="{color: valueTrigger(currentItem.iconColor)}"
                style="height: 100%; margin: 0px 8px;"
            ></i>
            <input
                v-model="node.attrs.value"
                class="power-editor-mention-input"
                :placeholder="node.attrs.placeholder"
                :readonly="freeze"
                ref="target"
                :style="{width: `${node.attrs.value ? node.attrs.value.length * 8 : node.attrs.placeholder.length * 8}px`, color: currentItem.color}"
                @keydown.backspace="delRecover"
                @keydown.tab="skipNode"
            />
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
            currentItem: {},
            freeze: false,
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
            this.show();
            this.$refs.target.focus();
            this.$refs.list.focus = true;
        }, 300);
    },

    methods: {
        outSideClickInit() {
            window.addEventListener('click', this.outsideEvent);
        },
        windowEventInit() {},
        showPos() {
            let el = this.$refs.target;
            if (!el.getBoundingClientRect) return;
            let bottom = el.getBoundingClientRect().bottom;
            let left = el.getBoundingClientRect().left;
            if (bottom < 50) this.top = -100;
            else this.top = 100;
            if (left + 300 > document.body.clientWidth) this.left = document.body - 300 - left;
            else this.left = 0;
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
            });
            this.currentItem = event.item;
            this.node.attrs.chooseItemCallback(event.item, this.node.attrs.value);
            this.freeze = true;
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
        skipNode (event) {
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
    beforeDestroy () {
        window.removeEventListener('click', this.outsideEvent);
    }
};
</script>

<style lang="scss">
.power-editor-mention-container {
    position: relative;
    width: auto;
    height: 28px;
    padding: 1px 3px;
    font-size: 16px;
    border-radius: 3px;
    transition: background-color 0.3s;
    display: inline-flex;
    align-items: flex-end;

    &.selected {
        background: rgba(45, 170, 219, 0.3);
    }

    &:hover {
        background: rgba(200, 200, 200, 0.6);
    }

    &.dark {
        .power-editor-mention-popper-container {
            background: black;
        }

        .power-editor-mention-display-block {
            .power-editor-mention-input {
                background: transparent;
                color: whitesmoke;
            }
        }
    }

    .power-editor-mention-popper-container {
        position: absolute;
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
        height: 28px;
        height: 100%;
        font-size: 16px;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;

        .power-editor-mention-input {
            min-width: 20px;
            width: auto;
            max-width: 200px;
            height: 100%;
            background: transparent;
            font-size: 16px;
            border: none;
            outline: none;
            user-select: all;
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
