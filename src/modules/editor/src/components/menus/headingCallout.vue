<template>
    <callout-base
        :show.sync="show"
        :mobileMode="mobileMode"
        :title="getTitle('Headers')"
        :theme="theme"
        :popperClass="['power-editor-header-callout']"
    >
        <template v-slot:trigger="x">
            <slot :show="x.show"></slot>
        </template>
        <template v-slot:content>
            <div
                v-for="i in 6"
                class="power-editor-heading-item"
                :class="[{dark : theme == 'dark', choosen: editor.isActive('heading', { level: i })}]"
                :key="'color:' + i"
                @click="execMore('toggleHeading', { level: i })"
            >
                <fv-button
                    class="power-editor-cmd-btn"
                    :theme="theme"
                    :isBoxShadow="true"
                    :background="getBackground(editor.isActive('heading', { level: i }))"
                    :foreground="getForeground(editor.isActive('heading', { level: i }))"
                    :title="getTitle('Heading') + i"
                >H{{ i }}</fv-button>
                <p class="pehi-comment">{{getTitle('Heading')}} {{i}}</p>
            </div>
        </template>
    </callout-base>
</template>

<script>
import calloutBase from './calloutBase.vue';
import i18n from '@/i18n/i18n.js';

export default {
    components: {
        calloutBase,
    },
    props: {
        mobileMode: {
            default: false,
        },
        getBackground: {
            default: () => {},
        },
        getForeground: {
            default: () => {},
        },
        execMore: {
            default: () => {},
        },
        editor: {
            default: null,
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
            show: false,
        };
    },
    watch: {},
    methods: {
        getTitle(name) {
            return i18n(name, this.language);
        },
    },
};
</script>

<style lang="scss">
.power-editor-header-callout {
    div.main {
        height: auto;
        padding: 5px 0px;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: auto;
        overflow-x: hidden;

        .power-editor-cmd-btn {
            width: 35px;
            height: 35px;
            flex-shrink: 0;
        }

        .power-editor-heading-item {
            position: relative;
            width: 100%;
            height: 50px;
            margin: 3px;
            padding: 5px;
            border-radius: 6px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            user-select: none;
            cursor: default;

            &:hover {
                background: rgba(200, 200, 200, 0.1);
            }

            &:active {
                background: rgba(200, 200, 200, 0.3);
            }

            &.dark {
                &:hover {
                    background: rgba(200, 200, 200, 0.3);
                }

                &:active {
                    background: rgba(200, 200, 200, 0.2);
                }

                .pehi-example {
                    background: rgba(75, 75, 75, 1);
                    border: rgba(75, 75, 75, 0.1) solid thin;
                }
            }

            &.choosen {
                background: rgba(200, 200, 200, 0.3);
            }

            .pehi-example {
                position: relative;
                width: 25px;
                height: 25px;
                flex-shrink: 1;
                background: white;
                border: whitesmoke solid thin;
                color: rgba(36, 36, 36, 1);
                border-radius: 35px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .pehi-comment {
                flex: 1;
                margin-left: 15px;
            }
        }
    }
}
</style>
