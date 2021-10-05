<template>
    <div class="power-editor-callout-base-container" :class="[{ dark: theme === 'dark' }]">
        <fv-callout v-if="!mobileMode" :visible.sync="thisShow" :lockScroll="true" :position="'bottomCenter'" :disabled="mobileMode" :beak="12" :space="0" :theme="theme" :popperClass="popperClass">
            <slot name="trigger" :show="false"></slot>
            <header>
                <slot name="header" :title="title">
                    <p style="font-size: 13.8px">{{ title }}</p>
                </slot>
            </header>
            <main>
                <slot name="content" index="1"></slot>
            </main>
        </fv-callout>

        <div v-if="mobileMode">
            <slot name="trigger" :show="triggerShow"></slot>
            <transition name="power-editor-callout-base-mobile-container">
                <div v-show="thisShow" class="power-editor-callout-base-mobile-container">
                    <div class="p-e-c-b-m-banner">
                        <slot name="header" :title="title">
                            <p style="width: 50px"></p>
                            <p class="p-e-c-b-m-title">{{ title }}</p>
                        </slot>
                        <p class="p-e-c-b-m-close" @click="thisShow = false">Cancel</p>
                    </div>
                    <div class="p-e-c-b-m-content-block" :class="popperClass">
                        <div class="main" style="width: 100%">
                            <slot name="content" index="2"></slot>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
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
        triggerShow() {
            this.thisShow = true;
        },
    },
};
</script>

<style lang="scss">
.power-editor-callout-base-container {
    &.dark {
        .power-editor-callout-base-mobile-container {
            background: rgba(36, 36, 36, 0.9);

            .p-e-c-b-m-banner {
                background: rgba(47, 52, 55, 0.95);
                color: whitesmoke;
            }
        }

        * {
            color: whitesmoke;
        }
    }

    .power-editor-callout-base-mobile-container {
        position: fixed;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        margin-top: 50px;
        background: rgba(247, 246, 243, 0.9);
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        display: flex;
        flex-direction: column;
        backdrop-filter: blur(50px);
        -webkit-backdrop-filter: blur(50px);
        z-index: 9;

        .p-e-c-b-m-banner {
            position: relative;
            width: 100%;
            height: 45px;
            background: rgba(255, 255, 255, 0.95);
            display: flex;
            justify-content: space-between;
            align-items: center;

            .p-e-c-b-m-title {
                font-size: 16px;
                user-select: none;
            }

            .p-e-c-b-m-close {
                width: 60px;
                color: rgba(46, 170, 220, 1);
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
            padding: 0px 15px;
            padding-top: 30px;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            overflow: hidden;
        }
    }

    .power-editor-callout-base-mobile-container-enter-active {
        transition: opacity 0.1s ease-out, transform 0.2s ease-out;
    }

    .power-editor-callout-base-mobile-container-enter {
        transform: translateY(100%);
        opacity: 0;
    }

    .power-editor-callout-base-mobile-container-enter-to {
        transform: translateY(0);
        opacity: 1;
    }

    .power-editor-callout-base-mobile-container-leave-active {
        transition: transform 0.1s ease-out;
    }

    .power-editor-callout-base-mobile-container-leave {
        transform: translateY(0);
    }

    .power-editor-callout-base-mobile-container-leave-to {
        transform: translateY(100%);
    }
}
</style>
