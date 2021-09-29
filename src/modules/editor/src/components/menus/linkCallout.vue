<template>
    <fv-callout
        :visible.sync="show"
        :lockScroll="true"
        :position="'bottomCenter'"
        :beak="12"
        :space="0"
        :theme="theme"
        :popperClass="'power-editor-link-callout'"
    >
        <slot></slot>
        <header>
            <p style="font-size: 13.8px;">Insert Link</p>
        </header>
        <main>
            <div
                class="power-editor-l-c-block"
                :class="[{ dark: theme === 'dark' }]"
            >
                <p
                    v-if="false"
                    class="power-editor-l-c-title"
                >Fill the Form</p>
                <fv-text-box
                    v-model="caption"
                    placeholder="Caption"
                    icon="TextField"
                    style="width: 90%; margin-top: 5px;"
                />
                <fv-text-box
                    v-model="link"
                    icon="Link"
                    placeholder="Insert link Url..."
                    style="width: 90%; margin-top: 5px;"
                />
            </div>
            <div class="power-editor-l-c-control-block">
                <fv-button
                    theme="dark"
                    :disabled="link === ''"
                    background="rgba(65, 74, 90, 1)"
                    @click="insert"
                >Insert</fv-button>
            </div>
        </main>
    </fv-callout>
</template>

<script>
export default {
    props: {
        theme: {
            default: "light",
        },
    },
    data() {
        return {
            link: "",
            caption: "",
            show: false,
        };
    },
    watch: {
        show(val) {
            if (!val) {
                this.link = "";
                this.caption = "";
            } else this.getSelection();
        },
    },
    methods: {
        insert() {
            if (this.link === "") return 0;
            this.caption = this.caption == "" ? this.link : this.caption;
            this.$emit(
                "insert-link",
                `<a href="${this.link}">${this.caption}</a>`
            );
            this.show = false;
        },
        getSelection() {
            try {
                this.caption = window.getSelection().toString();
            } catch (e) {
                console.log(e);
            }
        },
    },
};
</script>

<style lang="scss">
.power-editor-link-callout {
    div.main {
        width: 300px;
        height: auto;
        padding: 5px 0px;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: auto;

        .power-editor-l-c-block {
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

            .power-editor-l-c-title {
                position: relative;
                width: 100%;
                flex-shrink: 0;
                font-size: 13px;
                color: rgba(36, 36, 36, 0.8);
                text-align: left;
                text-indent: 15px;
            }
        }

        .power-editor-l-c-control-block {
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