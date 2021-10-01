<template>
    <callout-base
        :show.sync="show"
        :mobileMode="mobileMode"
        :title="'Emoji'"
        :theme="theme"
        :popperClass="['power-editor-emoji-callout']"
    >
        <template v-slot:trigger="x">
            <slot :show="x.show"></slot>
        </template>

        <template v-slot:header="x">
            <div class="power-editor-emoji-banner">
                <p style="font-size: 13.8px">{{x.title}}</p>
                <fv-button
                    :theme="theme"
                    @click="insertRandom"
                >Random</fv-button>
            </div>
        </template>
        <template v-slot:content>
            <div
                class="power-editor-emoji-list"
                v-for="(group, index) in emoji_list"
                :key="`type:${index}`"
            >
                <p class="title">{{group.name}}</p>
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
    </callout-base>
</template>

<script>
import emoji_list from '../../js/emojiList.js';
import calloutBase from './calloutBase.vue';

export default {
    components: {
        calloutBase,
    },
    props: {
        editor: {
            default: null,
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
            emoji_list: emoji_list,
            show: false,
        };
    },
    watch: {},
    methods: {
        getTitle(name) {
            return name;
        },
        insertEmoji(emoji) {
            this.$emit('insert-emoji', emoji);
        },
        insertRandom() {
            let i = (Math.random() * (this.emoji_list.length - 1)).toFixed(0);
            let j = (Math.random() * (this.emoji_list[i].emojis.length - 1)).toFixed(0);
            this.$emit('insert-emoji', this.emoji_list[i].emojis[j]);
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
        overflow: auto;

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
                    width: 25px;
                    height: 25px;
                    padding: 1px;
                    border-radius: 3px;
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

.p-e-c-b-m-banner
{
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
