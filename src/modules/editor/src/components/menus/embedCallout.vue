<template>
    <callout-base :show.sync="show" :mobileMode="mobileMode" :title="getTitle('Insert Embed')" :theme="theme" :popperClass="['power-editor-embed-callout']">
        <template v-slot:trigger="x">
            <slot :show="x.show"></slot>
        </template>
        <template v-slot:content>
            <div class="power-editor-e-c-block" :class="[{ dark: theme === 'dark' }]">
                <p v-if="false" class="power-editor-e-c-title">{{getTitle('Fill the Form')}}</p>
                <fv-text-box v-model="caption" :placeholder="getTitle('Caption')" :theme="theme" icon="TextField" style="width: 90%; margin-top: 5px" />
                <fv-text-box v-model="link" icon="Link" :placeholder="getTitle('Insert Embed Url...')" :theme="theme" style="width: 90%; margin-top: 5px" />
            </div>
            <div class="power-editor-e-c-control-block">
                <fv-button theme="dark" :disabled="link === ''" background="rgba(65, 74, 90, 1)" @click="insert">{{getTitle('Insert')}}</fv-button>
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
        language: {
            default: 'en',
        },
        theme: {
            default: 'light',
        },
    },
    data() {
        return {
            link: '',
            caption: '',
            show: false,
        };
    },
    watch: {
        show(val) {
            if (!val) {
                this.link = '';
                this.caption = '';
            }
        },
    },
    methods: {
        insert() {
            if (this.link === '') return 0;
            this.$emit('insert-embed', `<embed-block src="${this.link}" caption="${this.caption}" theme="${this.theme}"></embed-block>`);
            this.show = false;
        },
        getTitle(name) {
            return i18n(name, this.language);
        }
    },
};
</script>

<style lang="scss">
.power-editor-embed-callout {
    div.main {
        width: 300px;
        height: auto;
        padding: 5px 0px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: overlay;

        .power-editor-e-c-block {
            position: relative;
            width: 100%;
            height: auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            overflow: hidden;

            &.dark {
            }

            .power-editor-e-c-title {
                position: relative;
                width: 100%;
                flex-shrink: 0;
                font-size: 13px;
                color: rgba(36, 36, 36, 0.8);
                text-align: left;
                text-indent: 15px;
            }
        }

        .power-editor-e-c-control-block {
            position: relative;
            width: 300px;
            margin-top: 15px;
            flex-shrink: 0;
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
    }
}
</style>
