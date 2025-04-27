<template>
    <callout-base :show.sync="show" :mobileMode="mobileMode" :title="getTitle('Table')" :foreground="foreground" :theme="theme" :language="language" :popperClass="['power-editor-table-callout']">
        <template v-slot:trigger="x">
            <slot :show="x.show"></slot>
        </template>
        <template v-slot:content>
            <div class="power-editor-table-insert-block">
                <fv-text-box
                    v-model="row"
                    :placeholder="getTitle('Row')"
                    :theme="theme"
                    class="power-editor-table-text-box"
                    underline
                    :border-width="2"
                    :is-box-shadow="true"
                    :border-color="'rgba(200, 200, 200, 0.1)'"
                    :background="theme === 'dark' ? '#1a1a1a' : '#fff'"
                    :focus-border-color="foreground"
                    @keydown.enter="
                        execMoreX('insertTable', {
                            rows: parseInt(row),
                            cols: parseInt(column),
                            withHeaderRow: true,
                        })
                    "
                ></fv-text-box>
                <fv-text-box
                    v-model="column"
                    :placeholder="getTitle('Column')"
                    :theme="theme"
                    class="power-editor-table-text-box"
                    underline
                    :border-width="2"
                    :is-box-shadow="true"
                    :border-color="'rgba(200, 200, 200, 0.1)'"
                    :background="theme === 'dark' ? '#1a1a1a' : '#fff'"
                    :focus-border-color="foreground"
                    @keydown.enter="
                        execMoreX('insertTable', {
                            rows: parseInt(row),
                            cols: parseInt(column),
                            withHeaderRow: true,
                        })
                    "
                ></fv-text-box>
                <fv-button
                    theme="dark"
                    :disabled="!row || !column || isNaN(row) || isNaN(column)"
                    :is-box-shadow="true"
                    :background="foreground"
                    :border-radius="6"
                    style="width: 40px; height: 40px"
                    @click="
                        execMoreX('insertTable', {
                            rows: parseInt(row),
                            cols: parseInt(column),
                            withHeaderRow: true,
                        })
                    "
                >
                    <i class="ms-Icon ms-Icon--AddBold"></i>
                </fv-button>
            </div>
            <div class="power-editor-table-control-block">
                <fv-button
                    theme="dark"
                    class="power-editor-table-control-item"
                    background="rgba(212, 78, 82, 1)"
                    :is-box-shadow="true"
                    :title="getTitle('Delete Column')"
                    @click="exec('deleteColumn')"
                >
                    <i class="ms-Icon ms-Icon--DockLeft"></i>
                </fv-button>
                <fv-button theme="dark" class="power-editor-table-control-item" background="rgba(212, 78, 82, 1)" :is-box-shadow="true" :title="getTitle('Delete Row')" @click="execX('deleteRow')">
                    <i class="ms-Icon ms-Icon--DockBottom"></i>
                </fv-button>
                <hr />
                <fv-button theme="dark" class="power-editor-table-control-item" :background="foreground" :is-box-shadow="true" :title="getTitle('Add Row Before')" @click="execX('addRowBefore')">
                    <i class="ms-Icon ms-Icon--UpArrowShiftKey"></i>
                </fv-button>
                <fv-button theme="dark" class="power-editor-table-control-item" :background="foreground" :is-box-shadow="true" :title="getTitle('Add Row After')" @click="execX('addRowAfter')">
                    <i class="ms-Icon ms-Icon--UpArrowShiftKey" style="transform: rotate(180deg)"></i>
                </fv-button>
                <fv-button theme="dark" class="power-editor-table-control-item" :background="foreground" :is-box-shadow="true" :title="getTitle('Add Column Before')" @click="execX('addColumnBefore')">
                    <i class="ms-Icon ms-Icon--UpArrowShiftKey" style="transform: rotate(-90deg)"></i>
                </fv-button>
                <fv-button theme="dark" class="power-editor-table-control-item" :background="foreground" :is-box-shadow="true" :title="getTitle('Add Column After')" @click="execX('addColumnAfter')">
                    <i class="ms-Icon ms-Icon--UpArrowShiftKey" style="transform: rotate(90deg)"></i>
                </fv-button>
                <hr />
                <fv-button :theme="theme" class="power-editor-table-control-item" :is-box-shadow="true" :title="getTitle('Merge Cells')" @click="execX('mergeCells')">
                    <i class="ms-Icon ms-Icon--PPSOneLandscape"></i>
                </fv-button>
                <fv-button :theme="theme" class="power-editor-table-control-item" :is-box-shadow="true" :title="getTitle('Split Cell')" @click="execX('splitCell')">
                    <i class="ms-Icon ms-Icon--PPSTwoPortrait"></i>
                </fv-button>
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
        foreground: {
            default: '',
        },
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
        language: {
            default: 'en',
        },
        theme: {
            default: 'light',
        },
    },
    data() {
        return {
            row: '3',
            column: '3',
            show: false,
        };
    },
    watch: {},
    methods: {
        getTitle(name) {
            return i18n(name, this.language);
        },
        execX(a) {
            this.exec(a);
            if (this.mobileMode) {
                this.show = false;
            }
        },
        execMoreX(a, b) {
            this.execMore(a, b);
            if (this.mobileMode) {
                this.show = false;
            }
        },
    },
};
</script>

<style lang="scss">
.power-editor-table-callout {
    div.main {
        width: 320px;
        height: auto;
        padding: 5px 0px;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: overlay;

        .power-editor-table-insert-block {
            position: relative;
            width: 100%;
            height: 65px;
            flex-shrink: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .power-editor-table-text-box {
                width: 80px;
                height: 40px;
                flex: 1;
                margin: 0px 5px;
                text-align: center;
            }
        }

        .power-editor-table-control-block {
            position: relative;
            width: 100%;
            margin-top: 15px;
            flex-shrink: 0;
            display: flex;
            align-items: center;

            .power-editor-table-control-item {
                width: 35px;
                height: 35px;
                margin: 1px;
                flex-shrink: 0;
            }
        }

        hr {
            width: 1.5px;
            margin: 5px;
            height: 30px;
            flex-shrink: 0;
            background: rgba(230, 230, 230, 1);
            border: none;
            border-radius: 2px;
        }
    }
}
</style>
