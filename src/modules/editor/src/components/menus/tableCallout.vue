<template>
    <callout-base
        :show.sync="show"
        :mobileMode="mobileMode"
        :title="getTitle('Table')"
        :theme="theme"
        :popperClass="['power-editor-table-callout']"
    >
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
                ></fv-text-box>
                <fv-text-box
                    v-model="column"
                    :placeholder="getTitle('Column')"
                    :theme="theme"
                    class="power-editor-table-text-box"
                ></fv-text-box>
                <fv-button
                    theme="dark"
                    :disabled="!row || !column || isNaN(row) || isNaN(column)"
                    :is-box-shadow="true"
                    background="rgba(56, 171, 127, 1)"
                    @click="execMore('insertTable', {
                        rows: parseInt(row),
                        cols: parseInt(column),
                        withHeaderRow: true
                    })"
                >
                    <i class="ms-Icon ms-Icon--AddBold"></i>
                </fv-button>
            </div>
            <div class="power-editor-table-control-block">
                <fv-button
                    theme="dark"
                    class="power-editor-table-control-item"
                    background="rgba(165, 47, 52, 1)"
                    :is-box-shadow="true"
                    :title="getTitle('Delete Column')"
                    @click="exec('deleteColumn')"
                >
                    <i class="ms-Icon ms-Icon--DockLeft"></i>
                </fv-button>
                <fv-button
                    theme="dark"
                    class="power-editor-table-control-item"
                    background="rgba(165, 47, 52, 1)"
                    :is-box-shadow="true"
                    :title="getTitle('Delete Row')"
                    @click="exec('deleteRow')"
                >
                    <i class="ms-Icon ms-Icon--DockBottom"></i>
                </fv-button>
                <hr>
                <fv-button
                    theme="dark"
                    class="power-editor-table-control-item"
                    background="rgba(0, 120, 212, 1)"
                    :is-box-shadow="true"
                    :title="getTitle('Add Row Before')"
                    @click="exec('addRowBefore')"
                >
                    <i class="ms-Icon ms-Icon--UpArrowShiftKey"></i>
                </fv-button>
                <fv-button
                    theme="dark"
                    class="power-editor-table-control-item"
                    background="rgba(0, 120, 212, 1)"
                    :is-box-shadow="true"
                    :title="getTitle('Add Row After')"
                    @click="exec('addRowAfter')"
                >
                    <i
                        class="ms-Icon ms-Icon--UpArrowShiftKey"
                        style="transform: rotate(180deg);"
                    ></i>
                </fv-button>
                <fv-button
                    theme="dark"
                    class="power-editor-table-control-item"
                    background="rgba(0, 120, 212, 1)"
                    :is-box-shadow="true"
                    :title="getTitle('Add Column Before')"
                    @click="exec('addColumnBefore')"
                >
                    <i
                        class="ms-Icon ms-Icon--UpArrowShiftKey"
                        style="transform: rotate(-90deg);"
                    ></i>
                </fv-button>
                <fv-button
                    theme="dark"
                    class="power-editor-table-control-item"
                    background="rgba(0, 120, 212, 1)"
                    :is-box-shadow="true"
                    :title="getTitle('Add Column After')"
                    @click="exec('addColumnAfter')"
                >
                    <i
                        class="ms-Icon ms-Icon--UpArrowShiftKey"
                        style="transform: rotate(90deg);"
                    ></i>
                </fv-button>
                <hr>
                <fv-button
                    :theme="theme"
                    class="power-editor-table-control-item"
                    :is-box-shadow="true"
                    :title="getTitle('Merge Cells')"
                    @click="exec('mergeCells')"
                >
                    <i class="ms-Icon ms-Icon--PPSOneLandscape"></i>
                </fv-button>
                <fv-button
                    :theme="theme"
                    class="power-editor-table-control-item"
                    :is-box-shadow="true"
                    :title="getTitle('Split Cell')"
                    @click="exec('splitCell')"
                >
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
        overflow: auto;

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
                height: 30px;
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
