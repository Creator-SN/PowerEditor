<template>
    <node-view-wrapper
        class="power-editor-drawing-block-container"
        :style="{ 'justify-content': node.attrs.alignCenter ? 'center' : 'flex-start' }"
    >
        <div class="power-editor-d-b-container">
            <div class="power-editor-d-b-block l1">
                <fv-button
                    :theme="node.attrs.theme"
                    :borderRadius="50"
                    :disabled="size <= 1"
                    class="power-editor-d-b-btn __size"
                    @click="size = size > 1 ? size - 1 : size"
                ><i class="ms-Icon ms-Icon--Remove"></i></fv-button>
                <fv-slider
                    v-model="size"
                    :theme="node.attrs.theme"
                    :mininum="1"
                    :maxinum="10"
                    :showLabel="true"
                    style="width: 150px; margin-left: 5px;"
                >
                    <template slot-scope="prop">
                        <span style="height: 100%; margin-left: 5px; font-size: 12px; display: flex; align-items: center;">{{prop.value}}</span>
                    </template>
                </fv-slider>
                <fv-button
                    :theme="node.attrs.theme"
                    :borderRadius="50"
                    :disabled="size >= 10"
                    class="power-editor-d-b-btn __size"
                    @click="size = size < 10 ? size + 1 : size"
                ><i class="ms-Icon ms-Icon--Add"></i></fv-button>
            </div>
            <div class="power-editor-d-b-block">
                <fv-button
                    class="power-editor-d-b-btn __color"
                    v-for="(item, index) in colorList"
                    :key="'color:' + index"
                    :theme="node.attrs.theme"
                    :borderRadius="50"
                    :background="item.color"
                    :isBoxShadow="color !== item.color"
                    @click="color = item.color"
                >{{''}}</fv-button>
            </div>
            <div class="power-editor-d-b-block">
                <fv-button
                    class="power-editor-d-b-btn __clear"
                    :borderRadius="50"
                    :theme="node.attrs.theme"
                    @click="clear"
                ><i class="ms-Icon ms-Icon--EraseTool"></i></fv-button>
            </div>
        </div>
        <media-container
            :width.sync="node.attrs.width"
            :caption.sync="node.attrs.caption"
            :alignCenter.sync="node.attrs.alignCenter"
            :theme="node.attrs.theme"
        >
            <svg
                viewBox="0 0 500 250"
                ref="canvas"
            >
                <template v-for="item in node.attrs.lines">
                    <path
                        v-if="item.id !== id"
                        :key="item.id"
                        :d="item.path"
                        :id="`id-${item.id}`"
                        :stroke="item.color"
                        :stroke-width="item.size"
                    />
                </template>
            </svg>
        </media-container>

    </node-view-wrapper>
</template>

<script>
import { NodeViewWrapper } from "@tiptap/vue-2";
import * as d3 from "d3";
import simplify from "simplify-js";

import mediaContainer from "./mediaContainer.vue";

export default {
    name: "drawingBlock",

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
            color: "#000000",
            size: 3,
            svg: null,
            path: null,
            points: [],
            drawing: false,
            id: this.$SUtility.Guid(),
            colorList: [
                { name: "purple", color: "#958DF1" },
                { name: "red", color: "#F98181" },
                { name: "orange", color: "#FBBC88" },
                { name: "yellow", color: "#FAF594" },
                { name: "blue", color: "#70CFF8" },
                { name: "teal", color: "#94FADB" },
                { name: "green", color: "#B9F18D" },
            ],
        };
    },

    methods: {
        onStartDrawing(event) {
            this.drawing = true;
            this.points = [];
            this.path = this.svg
                .append("path")
                .data([this.points])
                .attr("id", `id-${this.id}`)
                .attr("stroke", this.color)
                .attr("stroke-width", this.size);

            const moveEvent =
                event.type === "mousedown" ? "mousemove" : "touchmove";

            this.svg.on(moveEvent, this.onMove);
        },

        onMove(event) {
            event.preventDefault();
            this.points.push(d3.pointers(event)[0]);
            this.tick();
        },

        onEndDrawing() {
            this.svg.on("mousemove", null);
            this.svg.on("touchmove", null);

            if (!this.drawing) {
                return;
            }

            this.drawing = false;
            this.svg.select(`#id-${this.id}`).remove();
            this.id = this.$SUtility.Guid();
        },

        simplifyPoints(points) {
            return simplify(
                points.map((point) => ({ x: point[0], y: point[1] }))
            ).map((point) => [point.x, point.y]);
        },

        tick() {
            requestAnimationFrame(() => {
                this.path.attr("d", (points) => {
                    const path = d3.line().curve(d3.curveBasis)(points);
                    // const simplifiedPath = d3.line().curve(d3.curveBasis)(this.simplifyPoints(points))
                    const lines = this.node.attrs.lines.filter(
                        (item) => item.id !== this.id
                    );

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
            .on("mousedown", this.onStartDrawing)
            .on("mouseup", this.onEndDrawing)
            .on("mouseleave", this.onEndDrawing)
            .on("touchstart", this.onStartDrawing)
            .on("touchend", this.onEndDrawing)
            .on("touchleave", this.onEndDrawing);
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
        left: 0px;
        top: 100%;
        width: 100%;
        height: auto;
        padding: 5px;
        background: rgba(245, 245, 245, 0.8);
        border-radius: 6px;
        box-sizing: border-box;
        display: none;
        align-items: center;
        flex-wrap: wrap;
        box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.1);
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
                width: 250px;
                justify-content: space-around;
            }

            .power-editor-d-b-btn {
                width: 30px;
                height: 30px;

                &.__color {
                    margin-left: 5px;
                }
            }
        }
    }

    svg {
        background: #f1f3f5;
        cursor: crosshair;
    }

    path {
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
    }
}
</style>