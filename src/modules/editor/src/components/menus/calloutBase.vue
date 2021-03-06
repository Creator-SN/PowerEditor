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
            :popperClass="popperClass"
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
                :appendBody="true"
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
                        @click="thisShow = false"
                    >Cancel</p>
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
        * {
            color: whitesmoke;
        }
    }
}

.power-editor-callout-base-mobile-container {
    background: rgba(247, 246, 243, 0.9);
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    display: flex;
    flex-direction: column;
    z-index: 9;

    &.dark {
        background: rgba(36, 36, 36, 0.9);

        .p-e-c-b-m-banner {
            background: rgba(47, 52, 55, 0.95);
            color: whitesmoke;

            .p-e-c-b-m-close {
                color: rgba(46, 170, 220, 1);
            }
        }

        .p-e-c-b-m-content-block {
            background: rgba(56, 56, 56, 0.9);
        }

        * {
            color: whitesmoke;
        }
    }

    .p-e-c-b-m-banner {
        position: relative;
        width: 100%;
        height: 45px;
        background: rgba(255, 255, 255, 0.95);
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
        background: rgba(252, 252, 252, 0.9);
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        overflow: hidden;
    }
}
</style>
