<template>
    <node-view-wrapper class="power-editor-drawing-block-container" :class="[{ dark: thisTheme === 'dark' }]" :style="{ 'justify-content': node.attrs.alignCenter ? 'center' : 'flex-start' }">
        <div v-show="editor.isEditable" class="power-editor-d-b-container">
            <div class="power-editor-d-b-block l1">
                <fv-button
                    :theme="thisTheme"
                    :font-size="12"
                    :borderRadius="50"
                    :disabled="size <= 1"
                    :background="thisTheme === 'dark' ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)'"
                    class="power-editor-d-b-btn __size"
                    border-color="transparent"
                    @click="size = size > 1 ? size - 1 : size"
                    ><i class="ms-Icon ms-Icon--Remove"></i
                ></fv-button>
                <fv-slider
                    v-model="size"
                    :theme="thisTheme"
                    :mininum="1"
                    :maxinum="10"
                    icon="RadioBullet"
                    :showLabel="true"
                    :color="thisForeground"
                    background="rgba(245, 245, 245, 0.3)"
                    style="width: 150px; height: 100%; margin-left: 5px; margin-right: 5px"
                >
                    <template slot-scope="prop">
                        <span style="height: 100%; margin-left: 5px; font-size: 12px; display: flex; align-items: center">{{ prop.value }}</span>
                    </template>
                </fv-slider>
                <fv-button
                    :theme="thisTheme"
                    :font-size="12"
                    :borderRadius="50"
                    :disabled="size >= 10"
                    :background="thisTheme === 'dark' ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)'"
                    class="power-editor-d-b-btn __size"
                    border-color="transparent"
                    @click="size = size < 10 ? size / 1 + 1 : size"
                    ><i class="ms-Icon ms-Icon--Add"></i
                ></fv-button>
            </div>
            <div class="power-editor-d-b-block overlay">
                <fv-button
                    class="power-editor-d-b-btn __color"
                    v-for="(item, index) in colorList"
                    :key="'color:' + index"
                    theme="dark"
                    :font-size="12"
                    :borderRadius="50"
                    :background="item.color"
                    :isBoxShadow="color !== item.color"
                    @click="color = item.color"
                    >{{ '' }}</fv-button
                >
            </div>
            <div class="power-editor-d-b-block">
                <fv-button
                    class="power-editor-d-b-btn __clear"
                    :font-size="10"
                    :borderRadius="50"
                    :background="eraseBackground"
                    :theme="activeErase ? 'dark' : thisTheme"
                    border-color="transparent"
                    style="margin-right: 5px"
                    @click="activeErase ^= true"
                    ><i class="ms-Icon ms-Icon--EraseTool"></i
                ></fv-button>
                <fv-button
                    class="power-editor-d-b-btn __clear"
                    :font-size="10"
                    :borderRadius="50"
                    :background="thisTheme === 'dark' ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)'"
                    :theme="thisTheme"
                    border-color="transparent"
                    @click="clear"
                    ><i class="ms-Icon ms-Icon--Refresh"></i
                ></fv-button>
            </div>
        </div>
        <media-container
            :width.sync="node.attrs.width"
            :caption="node.attrs.caption"
            :alignCenter.sync="node.attrs.alignCenter"
            :editor="editor"
            :theme="thisTheme"
            :foreground="thisForeground"
            :node="node"
            :getPos="getPos"
            @update:caption="updateAttributes({ caption: $event })"
        >
            <svg class="canvas-svg" viewBox="0 0 500 250" ref="canvas" :class="[{ readonly: !editor.isEditable }]">
                <template v-for="item in node.attrs.lines">
                    <path
                        v-if="item.id !== id"
                        :key="item.id"
                        :d="item.path"
                        :id="`id-${item.id}`"
                        :stroke="item.color"
                        :stroke-width="item.size"
                        @mousemove="moveDelMe(item)"
                        @click="delMe(item)"
                    />
                </template>
            </svg>
        </media-container>
    </node-view-wrapper>
</template>

<script>
import { NodeViewWrapper } from '@tiptap/vue-2';
import * as d3 from 'd3';
import simplify from 'simplify-js';

import mediaContainer from './mediaContainer.vue';

export default {
    name: 'drawingBlock',

    components: {
        NodeViewWrapper,
        mediaContainer,
    },

    props: {
        // the editor instance
        editor: {
            type: Object,
        },

        // the current node
        node: {
            type: Object,
        },

        // an array of decorations
        decorations: {
            type: Array,
        },

        // `true` when there is a `NodeSelection` at the current node view
        selected: {
            type: Boolean,
        },

        // access to the node extension, for example to get options
        extension: {
            type: Object,
        },

        // get the document position of the current node
        getPos: {
            type: Function,
        },

        // update attributes of the current node
        updateAttributes: {
            type: Function,
        },

        // delete the current node
        deleteNode: {
            type: Function,
        },
    },

    data() {
        return {
            color: '#000000',
            size: 3,
            svg: null,
            path: null,
            points: [],
            drawing: false,
            id: this.$SUtility.Guid(),
            colorList: [
                { name: 'gray', color: '#787774' },
                { name: 'purple', color: '#958DF1' },
                { name: 'pink', color: '#f58eda' },
                { name: 'red', color: '#F98181' },
                { name: 'orange', color: '#FBBC88' },
                { name: 'yellow', color: '#FAF594' },
                { name: 'blue', color: '#4086cb' },
                { name: 'teal', color: '#94FADB' },
                { name: 'green', color: '#B9F18D' },
                { name: 'rose', color: '#ee7686' },
                { name: 'fresh_blue', color: '#70CFF8' },
                { name: 'ice_blue', color: '#9fc2ca' },
                { name: 'dark_blue', color: '#0c4a83' },
                { name: 'fresh_green', color: '#55ddb6' },
            ],
            activeErase: false,
            mouseDown: false,
            thisTheme: this.editor.storage.defaultStorage.theme,
            thisForeground: this.editor.storage.defaultStorage.foreground,
        };
    },

    watch: {
        'editor.storage.defaultStorage.theme'(val) {
            this.thisTheme = val;
        },
        'editor.storage.defaultStorage.foreground'(val) {
            this.thisForeground = val;
        },
    },

    computed: {
        eraseBackground() {
            return this.activeErase ? this.thisForeground : this.thisTheme === 'dark' ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)';
        },
    },

    methods: {
        onStartDrawing(event) {
            this.mouseDown = true;
            if (!this.editor.isEditable) return;
            if (this.activeErase) return;
            this.drawing = true;
            this.points = [];
            this.path = this.svg.append('path').data([this.points]).attr('id', `id-${this.id}`).attr('stroke', this.color).attr('stroke-width', this.size);

            const moveEvent = event.type === 'mousedown' ? 'mousemove' : 'touchmove';

            this.svg.on(moveEvent, this.onMove);
        },

        onMove(event) {
            if (!this.editor.isEditable) return;
            if (this.activeErase) return;
            event.preventDefault();
            this.points.push(d3.pointers(event)[0]);
            this.tick();
        },

        onEndDrawing() {
            this.mouseDown = false;
            if (!this.editor.isEditable) return;
            if (this.activeErase) return;
            this.svg.on('mousemove', null);
            this.svg.on('touchmove', null);

            if (!this.drawing) {
                return;
            }

            this.drawing = false;
            this.svg.select(`#id-${this.id}`).remove();
            this.id = this.$SUtility.Guid();
        },

        delMe(item) {
            if (!this.activeErase) return;
            this.updateAttributes({
                lines: this.node.attrs.lines.filter((line) => line.id !== item.id),
            });
        },

        moveDelMe (item) {
            if (!this.mouseDown) return;
            if (!this.activeErase) return;
            this.updateAttributes({
                lines: this.node.attrs.lines.filter((line) => line.id !== item.id),
            });
        },

        simplifyPoints(points) {
            return simplify(points.map((point) => ({ x: point[0], y: point[1] }))).map((point) => [point.x, point.y]);
        },

        tick() {
            requestAnimationFrame(() => {
                this.path.attr('d', (points) => {
                    const path = d3.line().curve(d3.curveBasis)(points);
                    // const simplifiedPath = d3.line().curve(d3.curveBasis)(this.simplifyPoints(points))
                    const lines = this.node.attrs.lines.filter((item) => item.id !== this.id);

                    this.updateAttributes({
                        lines: [
                            ...lines,
                            {
                                id: this.id,
                                color: this.color,
                                size: this.size,
                                path,
                                // path: simplifiedPath,
                            },
                        ],
                    });

                    return path;
                });
            });
        },

        clear() {
            this.updateAttributes({
                lines: [],
            });
        },
    },

    mounted() {
        this.svg = d3.select(this.$refs.canvas);

        this.svg
            .on('mousedown', this.onStartDrawing)
            .on('mouseup', this.onEndDrawing)
            .on('mouseleave', this.onEndDrawing)
            .on('touchstart', this.onStartDrawing)
            .on('touchend', this.onEndDrawing)
            .on('touchleave', this.onEndDrawing);
    },
};
</script>

<style lang="scss">
.power-editor-drawing-block-container {
    position: relative;
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        .power-editor-d-b-container {
            display: flex;
        }
    }

    .power-editor-d-b-container {
        position: absolute;
        top: 100%;
        width: 100%;
        max-width: 800px;
        height: 35px;
        padding: 5px;
        background: rgba(250, 250, 250, 0.8);
        border: rgba(120, 120, 120, 0.1) solid thin;
        border-radius: 8px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(50px);
        -webkit-backdrop-filter: blur(50px);

        .power-editor-d-b-block {
            position: relative;
            margin-right: 5px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            flex-wrap: wrap;

            &.l1 {
                width: 200px;
                height: 100%;
                justify-content: space-around;
            }

            &.overlay {
                width: 50%;
                max-width: 360px;
                height: 100%;
                flex-wrap: nowrap;
                overflow-x: overlay;
            }

            .power-editor-d-b-btn {
                width: 20px;
                height: 20px;
                flex-shrink: 0;

                &.__color {
                    margin-left: 5px;
                }
            }
        }
    }

    .canvas-svg {
        background: #f1f3f5;
        cursor: crosshair;

        &.readonly {
            cursor: default;
        }
    }

    path {
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    &.dark {
        .power-editor-d-b-container {
            background: rgba(20, 20, 20, 1);
            border: rgba(200, 200, 200, 0.1) solid thin;
        }

        .canvas-svg {
            background: rgba(50, 49, 48, 1);
        }
    }
}

@media screen and (max-width: 768px) {
    .power-editor-drawing-block-container {
        .power-editor-d-b-container {
            height: 70px;
            align-items: flex-start;

            .power-editor-d-b-block {
                height: 30px;

                &.l1 {
                    width: 100%;
                    height: 30px;
                    justify-content: space-around;
                }

                &.overlay {
                    width: calc(100% - 30px);
                    height: 30px;
                }
            }
        }
    }
}
</style>
