<template>
    <callout-base :show.sync="show" :mobileMode="mobileMode" :title="getTitle('Insert Image')" :theme="theme" :popperClass="['power-editor-image-callout']">
        <template v-slot:trigger="x">
            <slot :show="x.show"></slot>
        </template>
        <template v-slot:content="x">
            <div class="power-editor-i-c-block" :class="[{ dark: theme === 'dark' }]">
                <p class="power-editor-i-c-title">{{getTitle('Method')}} 1</p>
                <i class="ms-Icon ms-Icon--Photo2Add power-editor-i-c-icon-1" @click="$refs[`img_local_${x.index}`].click()"></i>
                <p class="power-editor-i-c-t2">{{getTitle('Choose Local Image as Base64 (multiple).')}}</p>
                <input type="file" accept="image/gif,image/png,image/jpeg,image/x-png,image/svg+xml" multiple="true" style="display: none" :ref="`img_local_${x.index}`" @change="insertLocal(x.index)" />
            </div>
            <div class="power-editor-i-c-block" :class="[{ dark: theme === 'dark' }]">
                <p class="power-editor-i-c-title">{{getTitle('Method')}} 2</p>
                <fv-text-box v-model="url" :placeholder="getTitle('Insert Image Url.')" :theme="theme" style="width: 90%; border: thin; outline: none" ref="img_link" />
            </div>
            <div class="power-editor-i-c-control-block">
                <fv-button theme="dark" :disabled="url === ''" background="rgba(65, 74, 90, 1)" @click="insert">{{getTitle('Insert')}}</fv-button>
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
            url: '',
            show: false,
            contentName: ['content-1', 'content-2'],
        };
    },
    watch: {
        show(val) {
            if (!val) {
                this.url = '';
                if (!this.mobileMode) this.$refs.img_local_1.value = '';
                else this.$refs.img_local_2.value = '';
            }
        },
    },
    methods: {
        insert() {
            if (this.url === '') return 0;
            this.$emit('insert-image', [this.url]);
            this.show = false;
        },
        async insertLocal(index) {
            let files = this.$refs[`img_local_${index}`].files;
            if (files.length < 1) return 0;
            let base64_list = [];
            for (let file of files) {
                let reader = new FileReader();
                reader.readAsDataURL(file);
                let base64 = await new Promise((resolve) => {
                    reader.onload = (event) => {
                        resolve(event.target.result);
                    };
                });
                base64_list.push(base64);
            }
            this.$emit('insert-image', base64_list);
            this.show = false;
        },
        getTitle(name) {
            return i18n(name, this.language);
        }
    },
};
</script>

<style lang="scss">
.power-editor-image-callout {
    div.main {
        width: 300px;
        height: auto;
        padding: 5px 0px;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: auto;

        .power-editor-i-c-block {
            position: relative;
            width: 100%;
            height: 120px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            &.dark {
                .power-editor-i-c-title {
                    color: whitesmoke;
                }

                .power-editor-i-c-t2 {
                    color: whitesmoke;
                }
            }

            .power-editor-i-c-title {
                position: relative;
                width: 100%;
                font-size: 13px;
                color: rgba(36, 36, 36, 0.8);
                text-align: left;
                text-indent: 15px;
            }

            .power-editor-i-c-icon-1 {
                position: relative;
                width: 30px;
                height: 30px;
                margin-top: 15px;
                background: transparent;
                border: thin;
                font-size: 36px;
                color: rgba(222, 109, 149, 1);
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                outline: none;
                cursor: pointer;
            }

            .power-editor-i-c-t2 {
                margin-top: 15px;
                font-size: 12px;
                color: rgba(95, 95, 95, 0.8);
            }
        }

        .power-editor-i-c-control-block {
            width: 300px;
            margin-top: 15px;
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
    }
}
</style>
