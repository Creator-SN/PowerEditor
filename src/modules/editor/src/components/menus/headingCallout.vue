<template>
    <callout-base :show.sync="show" :mobileMode="mobileMode" :title="'Headers'" :theme="theme" :popperClass="['power-editor-header-callout']">
        <template v-slot:trigger="x">
            <slot :show="x.show"></slot>
        </template>
        <template v-slot:content>
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
                >H{{ i }}</fv-button
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
            return name;
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

        .power-editor-cmd-btn {
            width: 45px;
            height: 45px;
            margin-top: 5px;
            flex-shrink: 0;
        }
    }
}
</style>
