<template>
    <fv-callout
        v-if="editor"
        :lockScroll="true"
        :position="'bottomCenter'"
        :beak="12"
        :space="0"
        :theme="theme"
        :popperClass="'power-editor-emoji-callout'"
    >
        <slot></slot>
        <header>
            <div class="power-editor-emoji-banner">
                <p style="font-size: 13.8px">Emoji</p>
                <fv-button @click="insertRandom">Random</fv-button>
            </div>
        </header>
        <main>
            <div class="power-editor-emoji-list" v-for="(group, index) in emoji_list" :key="`type:${index}`">
                <p class="title">{{group.name}}</p>
                <div class="power-editor-emoji-group">
                    <i v-for="(item, i) in group.emojis" :key="i" class="emoji-item" v-html="item" @click="insertEmoji(item)"></i>
                </div>
            </div>
        </main>
    </fv-callout>
</template>

<script>
import emoji_list from "../../js/emojiList.js";

export default {
    props: {
        editor: {
            default: null,
        },
        theme: {
            default: 'light',
        },
    },
    data() {
        return {
            emoji_list: emoji_list
        };
    },
    watch: {},
    methods: {
        getTitle(name) {
            return name;
        },
        insertEmoji (emoji) {
            this.$emit('insert-emoji', emoji);
        },
        insertRandom () {
            let i = (Math.random() * (this.emoji_list.length - 1)).toFixed(0);
            let j = (Math.random() * (this.emoji_list[i].emojis.length - 1)).toFixed(0);
            this.$emit('insert-emoji', this.emoji_list[i].emojis[j]);
        }
    },
};
</script>

<style lang="scss">
.power-editor-emoji-callout {

    .power-editor-emoji-banner
    {
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
        padding: 5px 0px;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: auto;

        .power-editor-emoji-list
        {
            position: relative;
            width: 100%;
            height: auto;

            .title
            {
                font-size: 12px;
            }

            .power-editor-emoji-group
            {
                position: relative;
                width: 100%;
                height: auto;
                display: flex;
                flex-wrap: wrap;

                .emoji-item
                {
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

                    &:hover
                    {
                        background: rgba(200, 200, 200, 0.6);
                    }
                }
            }
        }
    }
}
</style>
