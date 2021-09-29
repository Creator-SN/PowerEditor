<template>
    <fv-callout
        v-if="editor"
        :lockScroll="true"
        :position="'bottomCenter'"
        :beak="12"
        :space="0"
        :theme="theme"
        :popperClass="'power-editor-color-callout'"
    >
        <slot></slot>
        <header>
            <p style="font-size: 13.8px;">Text Color</p>
        </header>
        <main>
            <p style="font-size: 12px;">Color</p>
            <fv-button
                class="power-editor-cmd-btn"
                :theme="theme"
                :isBoxShadow="true"
                :title="getTitle(`removeColor`)"
                @click="exec('unsetColor')"
            >{{''}}</fv-button>
            <fv-button
                v-for="(item, index) in colorList"
                :key="'color:' + index"
                class="power-editor-cmd-btn"
                :theme="theme"
                :isBoxShadow="!editor.isActive('textStyle', { color: item.color })"
                :background="item.color"
                :foreground="`whitesmoke`"
                :title="getTitle(item.name)"
                @click="execMore('setColor', item.color)"
            >{{''}}</fv-button>
            <p style="font-size: 12px;">Background</p>
            <fv-button
                class="power-editor-cmd-btn"
                :theme="theme"
                :isBoxShadow="true"
                :title="getTitle(`removeHighlight`)"
                @click="exec('unsetHighlight')"
            >{{''}}</fv-button>
            <fv-button
                v-for="(item, index) in highlightList"
                :key="'highlight:' + index"
                class="power-editor-cmd-btn"
                :theme="theme"
                :isBoxShadow="!editor.isActive('highlight', { color: item.color })"
                :background="item.color"
                :foreground="`whitesmoke`"
                :title="getTitle(item.name)"
                @click="execMore('toggleHighlight', { color: item.color })"
            >{{''}}</fv-button>
        </main>
    </fv-callout>
</template>

<script>
export default {
    props: {
        getBackground: {
            default: () => {},
        },
        getForeground: {
            default: () => {},
        },
        exec: {
            default: () => {},
        },
        execMore: {
            default: () => {},
        },
        editor: {
            default: null,
        },
        theme: {
            default: "light",
        },
    },
    data() {
        return {
            colorList: [
                { name: "purple", color: "#958DF1" },
                { name: "red", color: "#F98181" },
                { name: "orange", color: "#FBBC88" },
                { name: "yellow", color: "#FAF594" },
                { name: "blue", color: "#70CFF8" },
                { name: "teal", color: "#94FADB" },
                { name: "green", color: "#B9F18D" },
            ],
            highlightList: [
                { name: "red", color: "red" },
                { name: "red", color: "#ffa8a8" },
                { name: "yellow", color: "#FAF594" },
                { name: "orange", color: "#ffc078" },
                { name: "green", color: "#8ce99a" },
                { name: "blue", color: "#74c0fc" },
                { name: "purple", color: "#b197fc" },
            ],
        };
    },
    watch: {},
    methods: {
        getTitle(name) {
            return name;
        },
    },
};
</script>

<style lang="scss">
.power-editor-color-callout {
    div.main {
        height: 360px;
        padding: 5px 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: auto;

        .power-editor-cmd-btn {
            width: 80px;
            height: 35px;
            margin-top: 5px;
            flex-shrink: 0;
        }
    }
}
</style>