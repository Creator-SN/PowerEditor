<template>
    <node-view-wrapper
        v-if="node"
        as="span"
        class="power-editor-mention-container"
        :class="{ dark: thisTheme === 'dark', selected: selected }"
        :style="{'--selected-bg': focusForeground, '--selected-bg-hover': hoverForeground, '--selected-bg-active': activeForeground}"
    >
        <transition name="power-editor-mention-popper-fade">
            <div
                v-show="showPopper && filterItems.length > 0"
                class="power-editor-mention-popper-container"
                :style="{ left: `${left}px`, top: `${top}px` }"
            >
                <div
                    v-show="loading"
                    class="power-editor-mention-popper-list-loading-block"
                >
                    <fv-progressRing
                        loading="true"
                        r="10"
                        borderWidth="2"
                        :foreground="thisForeground"
                        background="white"
                    ></fv-progressRing>
                </div>
                <fv-list-view
                    :value="filterItems"
                    :theme="thisTheme"
                    class="power-editor-mention-popper-list-view"
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
                            :style="{ color: x.valueTrigger(x.item.type) == 'header' ? thisForeground : '' }"
                            style="flex: 1;"
                        >{{x.valueTrigger(x.item.name)}}</p>
                    </template>
                </fv-list-view>
            </div>
        </transition>
        <span
            class="power-editor-mention-display-block"
            @click="editor.storage.defaultStorage.mentionItemTools.mentionClickCallback(node.attrs.currentItem, node.attrs.value)"
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
                v-show="!node.attrs.freeze"
                v-model="node.attrs.value"
                class="power-editor-mention-input"
                :placeholder="node.attrs.placeholder"
                :class="[{freeze: node.attrs.freeze}]"
                :readonly="node.attrs.freeze"
                ref="target"
                :title="node.attrs.value"
                :style="{color: node.attrs.currentItem.color}"
                @keydown.backspace="delRecover"
                @keydown.tab="skipNode"
            />
            <p
                :title="node.attrs.value"
                class="power-editor-mention-placeholder"
                :class="[{show: node.attrs.freeze}]"
                :style="{color: node.attrs.currentItem.color}"
            >{{node.attrs.value ? node.attrs.value : node.attrs.placeholder}}</p>
        </span>
    </node-view-wrapper>
</template>

<script>
import { NodeViewWrapper } from '@tiptap/vue-2';
import onecolor from 'onecolor';

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
            showPopper: false,
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
                if (!_self) this.close();
            },
            filterItems: [],
            loading: false,
            thisTheme: this.editor.storage.defaultStorage.theme,
            thisForeground: this.editor.storage.defaultStorage.mentionItemTools.headerForeground(),
        };
    },
    watch: {
        showPopper(val) {
            if (val) {
                this.showPos();
            }
        },
        'node.attrs.value'() {
            this.delRecover();
            this.getFilterItems();
        },
        'editor.storage.defaultStorage.theme'(val) {
            this.thisTheme = val;
        },
        'editor.storage.defaultStorage.mentionItemTools.headerForeground'() {
            this.thisForeground = this.editor.storage.defaultStorage.mentionItemTools.headerForeground();
        },
    },
    computed: {
        focusForeground() {
            try {
                let color = onecolor(this.thisForeground);
                color = color.alpha(0.2);
                return color.cssa();
            } catch (e) {
                return '';
            }
        },
        hoverForeground() {
            try {
                let color = onecolor(this.thisForeground);
                color = color.alpha(0.3);
                return color.cssa();
            } catch (e) {
                return '';
            }
        },
        activeForeground() {
            try {
                let color = onecolor(this.thisForeground);
                color = color.alpha(0.4);
                return color.cssa();
            } catch (e) {
                return '';
            }
        }
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
        this.getFilterItems();
    },

    methods: {
        outSideClickInit() {
            window.addEventListener('click', this.outsideEvent);
        },
        windowEventInit() {
            window.addEventListener('scroll', this.showPos);
            this.editor.storage.defaultStorage.editorContainer.addEventListener('scroll', this.showPos);
        },
        showPos() {
            let el = this.$refs.target;
            if (!el || !el.getBoundingClientRect) return;
            const { left, top } = el.getBoundingClientRect();
            if (window.innerWidth - left < 260) this.left = window.innerWidth - 260;
            else this.left = left - 20;
            if (window.innerHeight - top < 300) this.top = window.innerHeight - 300;
            else this.top = top + 30;
        },
        show() {
            if (!this.editor.isEditable) return;
            this.showPopper = true;
            setTimeout(() => {
                this.$refs.target.focus();
            }, 300);
        },
        async getFilterItems() {
            this.loading = true;
            let result = [];
            // provide value as a parameter to filter the mentionList.
            let mentionList = await this.editor.storage.defaultStorage.mentionItemTools.mentionList(this.node.attrs.value);
            for (let el of mentionList) {
                if (await this.editor.storage.defaultStorage.mentionItemTools.filterFunc(el, this.node.attrs.value)) {
                    result.push(el);
                }
            }
            this.filterItems = result;
            this.loading = false;
        },
        chooseItem(event) {
            this.updateAttributes({
                value: event.item.name,
                currentItem: event.item,
                freeze: true,
            });
            this.editor.storage.defaultStorage.mentionItemTools.chooseItemCallback(event.item, this.node.attrs.value);
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
            this.showPopper = false;
            this.$refs.list.focus = false;
            this.editor.commands.focus();
        },
    },
    beforeDestroy() {
        window.removeEventListener('click', this.outsideEvent);
        window.removeEventListener('scroll', this.showPos);
        this.editor.storage.defaultStorage.editorContainer.removeEventListener('scroll', this.showPos);
    },
};
</script>

<style lang="scss">
.power-editor-mention-container {
    position: relative;
    width: auto;
    height: auto;
    padding: 0px 3px 0px 3px;
    background: rgba(250, 250, 250, 1);
    font-size: 16px;
    border-radius: 5px;
    transition: background-color 0.3s;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    cursor: pointer;

    --selected-bg: rgba(45, 170, 219, 0.2);
    --selected-bg-hover: rgba(45, 170, 219, 0.3);
    --selected-bg-active: rgba(45, 170, 219, 0.4);

    &.selected {
        background: var(--selected-bg, rgba(45, 170, 219, 0.2));
    }

    &:hover {
        background: var(--selected-bg-hover);
        box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.05);
    }

    &:active
    {
        background: var(--selected-bg-active);
    }

    &.dark {
        background: rgba(36, 36, 36, 1);

        &.selected {
            background: var(--selected-bg, rgba(45, 170, 219, 0.2));
        }

        &:hover {
            background: rgba(75, 75, 75, 0.6);
        }

        .power-editor-mention-popper-container {
            background: rgba(56, 56, 56, 1);
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
        background: rgba(255, 255, 255, 1);
        border: rgba(50, 49, 48, 0.1) solid thin;
        border-radius: 6px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        flex-direction: column;
        box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.1), 8px 6px 20px rgba(0, 0, 0, 0.1);
        z-index: 1;

        .power-editor-mention-popper-list-loading-block {
            position: absolute;
            width: 100%;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .power-editor-mention-popper-list-view {
            position: relative;
            width: 100%;
            height: 100%;
            flex: 1;
            border-radius: 6px;
        }
    }

    .power-editor-mention-display-block {
        position: relative;
        width: auto;
        max-width: 320px;
        height: 100%;
        font-size: 16px;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        overflow: hidden;

        .power-editor-mention-icon {
            width: 20px;
            height: 100%;
            margin: 0px 2px 0px 3px;
            font-size: 13px;
            text-align: center;
            object-fit: contain;
            display: flex;
            align-items: center;
        }

        .power-editor-mention-input {
            position: absolute;
            left: 23px;
            width: calc(100% - 23px);
            height: 100%;
            padding: 0px;
            padding-right: 0px;
            background: transparent;
            font-size: 0.8rem;
            font-weight: bold;
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
            font-size: 0.81rem;
            font-weight: bold;
            border: none;
            white-space: nowrap;
            text-overflow: ellipsis;
            opacity: 0;
            user-select: none;
            overflow: hidden;
            z-index: -1;

            &.show {
                opacity: 1;
                z-index: 1;
            }
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
