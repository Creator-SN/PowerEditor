<template>
    <div
        class="power-editor-callout-base-container"
        :class="[{ dark: theme === 'dark' }]"
    >
        <fv-callout
            v-if="!mobileMode"
            :visible.sync="thisShow"
            :lockScroll="true"
            :position="'bottomCenter'"
            :disabled="mobileMode"
            :beak="12"
            :space="0"
            :theme="theme"
            :popperClass="[...popperClass, 'power-editor-callout-base-pc-container']"
            :popper-style="{background: theme === 'dark' ? 'rgba(56, 56, 56, 1)' : 'rgba(250, 250, 250, 1)'}"
        >
            <slot
                name="trigger"
                :show="false"
            ></slot>
            <header>
                <slot
                    name="header"
                    :title="title"
                >
                    <p style="font-size: 13.8px">{{ title }}</p>
                </slot>
            </header>
            <main>
                <slot
                    name="content"
                    index="1"
                ></slot>
            </main>
        </fv-callout>

        <div v-if="mobileMode">
            <slot
                name="trigger"
                :show="triggerShow"
            ></slot>
            <fv-drawer
                v-model="thisShow"
                :theme="theme"
                class="power-editor-callout-base-mobile-container"
                :class="[{ dark: theme === 'dark' }]"
                length="calc(100% - 50px)"
                :background="theme === 'dark' ? 'rgba(56, 56, 56, 0.9)' : 'rgba(252, 252, 252, 0.9)'"
                :appendBody="true"
                :z-index="20"
            >
                <div class="p-e-c-b-m-banner">
                    <slot
                        name="header"
                        :title="title"
                    >
                        <p style="width: 50px"></p>
                        <p class="p-e-c-b-m-title">{{ title }}</p>
                    </slot>
                    <p
                        class="p-e-c-b-m-close"
                        :style="{color: theme === 'dark' ? 'whitesmoke' : foreground}"
                        @click="thisShow = false"
                    >{{getTitle('Cancel')}}</p>
                </div>
                <div
                    class="p-e-c-b-m-content-block"
                    :class="popperClass"
                >
                    <div
                        class="main"
                        style="width: 100%; height: 100%;"
                    >
                        <slot
                            name="content"
                            index="2"
                        ></slot>
                    </div>
                </div>
            </fv-drawer>
        </div>
    </div>
</template>

<script>
import i18n from '@/i18n/i18n.js';

export default {
    props: {
        popperClass: {
            default: [],
        },
        title: {
            default: 'Title',
        },
        show: {
            default: false,
        },
        mobileMode: {
            default: false,
        },
        foreground: {
            default: '',
        },
        language: {
            default: 'en',
        },
        theme: {
            default: 'light',
        },
    },
    data() {
        return {
            thisShow: false,
        };
    },
    watch: {
        show(val) {
            this.thisShow = val;
        },
        thisShow(val) {
            this.$emit('update:show', val);
        },
    },
    methods: {
        getTitle(name) {
            return i18n(name, this.language);
        },
        triggerShow() {
            this.thisShow = true;
        },
    },
    beforeDestroy() {
        try {
            const body = document.querySelector('body');
            body.removeChild(this.$el);
        } catch (e) {}
    },
};
</script>

<style lang="scss">
.power-editor-callout-base-container {
    &.dark {
        * {
            color: whitesmoke;
        }
    }
}

@mixin narrow-scroll-bar {
    ::-webkit-scrollbar {
        width: 10px;
        height: 8px;

        &:hover {
            width: 16px;
        }
    }
    /*定义滚动条轨道
 内阴影+圆角*/
    ::-webkit-scrollbar-track {
        border-radius: 10px;
    }
    /*定义滑块
 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
        border-right: rgba(191, 190, 189, 0.2) solid 5px;
        background-color: rgba(191, 190, 189, 0);
        transition: background-color 0.3s;
        cursor: pointer;

        &:hover {
            border-radius: 10px;
            border-color: transparent;
            background-color: rgba(191, 190, 189, 0.6);
        }

        &:active {
            background-color: rgba(191, 190, 189, 0.5);
        }

        &:horizontal {
            border-right: none;
            border-bottom: rgba(191, 190, 189, 0.2) solid 5px;
        }
    }
}

.power-editor-callout-base-pc-container {
    @include narrow-scroll-bar;
}

.power-editor-callout-base-mobile-container {
    @include narrow-scroll-bar;

    border: rgba(0, 0, 0, 0.1) solid thin;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    display: flex;
    flex-direction: column;
    z-index: 20;

    &.dark {
        .p-e-c-b-m-banner {
            color: whitesmoke;

            .p-e-c-b-m-close {
                color: rgba(46, 170, 220, 1);
            }
        }

        * {
            color: whitesmoke;
        }
    }

    .p-e-c-b-m-banner {
        position: relative;
        width: 100%;
        height: 45px;
        border-bottom: rgba(200, 200, 200, 0.1) solid thin;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .p-e-c-b-m-title {
            font-size: 16px;
            user-select: none;
        }

        .p-e-c-b-m-close {
            width: 60px;
            color: rgba(0, 90, 158, 1);
            text-align: center;
            user-select: none;
            cursor: pointer;
        }
    }

    .p-e-c-b-m-content-block {
        position: relative;
        width: 100%;
        height: 100%;
        flex: 1;
        padding: 30px 15px;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        overflow: hidden;
    }
}
</style>
