<template>
    <callout-base
        :show.sync="show"
        :mobileMode="mobileMode"
        :title="'Emoji'"
        :foreground="foreground"
        :theme="theme"
        :language="language"
        :popperClass="['power-editor-emoji-callout']"
    >
        <template v-slot:trigger="x">
            <slot :show="x.show"></slot>
        </template>

        <template v-slot:header="x">
            <div class="power-editor-emoji-banner">
                <p style="font-size: 13.8px">{{ getTitle(x.title) }}</p>
                <fv-button
                    :theme="theme"
                    :background="theme === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.3)'"
                    :isBoxShadow="true"
                    @click="insertRandom"
                >{{getTitle('Random')}}</fv-button>
            </div>
        </template>
        <template v-slot:content>
            <fv-infinite-scroll-view
                v-model="emoji_list"
                :batchSize="1"
                style="width: 100%; height: 100%;"
            >
                <template v-slot:default="x">
                    <div
                        class="power-editor-emoji-list"
                        v-for="(group, index) in x.dynamicValue"
                        :key="`type:${index}`"
                    >
                        <p class="title">{{ getTitle(group.name) }}</p>
                        <div class="power-editor-emoji-group">
                            <i
                                v-for="(item, i) in group.emojis"
                                :key="i"
                                class="emoji-item"
                                v-html="item"
                                @click="insertEmoji(item)"
                            ></i>
                        </div>
                    </div>
                </template>
            </fv-infinite-scroll-view>
        </template>
    </callout-base>
</template>

<script>
import emoji_list from '../../js/emojiList.js';
import calloutBase from './calloutBase.vue';
import i18n from '@/i18n/i18n.js';

export default {
    components: {
        calloutBase,
    },
    props: {
        editor: {
            default: null,
        },
        foreground: {
            default: '',
        },
        mobileMode: {
            default: false,
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
            emoji_list: emoji_list,
            show: false,
        };
    },
    watch: {},
    methods: {
        getTitle(name) {
            return i18n(name, this.language);
        },
        insertEmoji(emoji) {
            this.$emit('insert-emoji', emoji);
            if (this.mobileMode) {
                this.show = false;
            }
        },
        insertRandom() {
            let i = (Math.random() * (this.emoji_list.length - 1)).toFixed(0);
            let j = (Math.random() * (this.emoji_list[i].emojis.length - 1)).toFixed(0);
            this.$emit('insert-emoji', this.emoji_list[i].emojis[j]);
            if (this.mobileMode) {
                this.show = false;
            }
        },
    },
};
</script>

<style lang="scss">
.power-editor-emoji-callout {
    .power-editor-emoji-banner {
        position: relative;
        width: 100%;
        height: 35px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    div.main {
        position: relative;
        width: 300px;
        height: 500px;
        max-height: 100%;
        flex: 1;
        padding: 5px 0px;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: overlay;

        .power-editor-emoji-list {
            position: relative;
            width: 100%;
            height: auto;

            .title {
                font-size: 12px;
            }

            .power-editor-emoji-group {
                position: relative;
                width: 100%;
                height: auto;
                display: flex;
                flex-wrap: wrap;

                .emoji-item {
                    position: relative;
                    width: 35px;
                    height: 35px;
                    padding: 1px;
                    border-radius: 3px;
                    font-size: 20px;
                    font-style: normal;
                    box-sizing: border-box;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    user-select: none;
                    cursor: default;

                    &:hover {
                        background: rgba(200, 200, 200, 0.6);
                    }
                }
            }
        }
    }
}

.p-e-c-b-m-banner {
    .power-editor-emoji-banner {
        position: relative;
        width: 50%;
        height: 35px;
        padding: 0px 5px;
        box-sizing: border-box;
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
        align-items: center;
    }
}
</style>
