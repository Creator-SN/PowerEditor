<template>
    <callout-base :show.sync="show" :mobileMode="mobileMode" :title="'Text Color'" :theme="theme" :popperClass="['power-editor-color-callout']">
        <template v-slot:trigger="x">
            <slot :show="x.show"></slot>
        </template>
        <template v-slot:content>
            <p style="font-size: 12px; font-weight: bold">Foreground</p>
            <fv-button class="power-editor-cmd-btn" :theme="theme" :isBoxShadow="true" :title="getTitle(`removeColor`)" @click="exec('unsetColor')">{{ '' }}</fv-button>
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
                >{{ '' }}</fv-button
            >
            <p style="font-size: 12px; font-weight: bold">Background</p>
            <fv-button class="power-editor-cmd-btn" :theme="theme" :isBoxShadow="true" :title="getTitle(`removeHighlight`)" @click="exec('unsetHighlight')">{{ '' }}</fv-button>
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
                >{{ '' }}</fv-button
            >
        </template>
    </callout-base>
</template>

<script>
import calloutBase from './calloutBase.vue';

export default {
    components: {
        calloutBase,
    },
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
        mobileMode: {
            default: false,
        },
        theme: {
            default: 'light',
        },
    },
    data() {
        return {
            show: false,
            colorList: [
                { name: 'purple', color: '#958DF1' },
                { name: 'red', color: '#F98181' },
                { name: 'orange', color: '#FBBC88' },
                { name: 'yellow', color: '#FAF594' },
                { name: 'blue', color: '#70CFF8' },
                { name: 'teal', color: '#94FADB' },
                { name: 'green', color: '#B9F18D' },
            ],
            highlightList: [
                { name: 'red', color: 'red' },
                { name: 'red', color: '#ffa8a8' },
                { name: 'yellow', color: '#FAF594' },
                { name: 'orange', color: '#ffc078' },
                { name: 'green', color: '#8ce99a' },
                { name: 'blue', color: '#74c0fc' },
                { name: 'purple', color: '#b197fc' },
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
        width: 100px;
        height: 360px;
        padding: 5px 15px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: auto;

        .power-editor-cmd-btn {
            width: 50px;
            height: 35px;
            margin-top: 5px;
            flex-shrink: 0;
        }
    }
}
</style>
