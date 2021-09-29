<template>
    <fv-callout
        v-if="editor"
        :lockScroll="true"
        :position="'bottomCenter'"
        :beak="12"
        :space="0"
        :theme="theme"
        :popperClass="'power-editor-header-callout'"
    >
        <slot></slot>
        <header>
            <p style="font-size: 13.8px;">Headers</p>
        </header>
        <main>
            <fv-button
                v-for="i in 6"
                :key="i"
                class="power-editor-cmd-btn"
                :theme="theme"
                :isBoxShadow="true"
                :background="getBackground(editor.isActive('heading', { level: i }))"
                :foreground="getForeground(editor.isActive('heading', { level: i }))"
                :title="getTitle('Horizontal Rule')"
                @click="execMore('toggleHeading', { level: i })"
            >H{{i}}</fv-button>
        </main>
    </fv-callout>
</template>

<script>
export default {
    props: {
        getBackground: {
            default: () => {}
        },
        getForeground: {
            default: () => {}
        },
        execMore: {
            default: () => {}
        },
        editor: {
            default: null
        },
        theme: {
            default: "light",
        },
    },
    data() {
        return {
            
        };
    },
    watch: {
        
    },
    methods: {
        getTitle(name) {
            return name;
        }
    },
};
</script>

<style lang="scss">
.power-editor-header-callout
{
    div.main
    {
        height: auto;
        padding: 5px 0px;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: auto;

        .power-editor-cmd-btn {
            width: 45px;
            height: 45px;
            margin-top: 5px;
            flex-shrink: 0;
        }
    }
}
</style>