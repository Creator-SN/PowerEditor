<template>
    <div
        class="power-editor-bubble-tool-bar-container"
        :class="[{ dark: thisTheme === 'dark' }]"
    >
        <fv-button
            class="power-editor-bubble-cmd-btn"
            :theme="thisTheme"
            :background="getBackground(editor.isActive('bold'))"
            :foreground="getForeground(editor.isActive('bold'))"
            :title="getTitle('Bold')"
            @click="exec('toggleBold')"
        >
            <i class="ms-Icon ms-Icon--Bold"></i>
        </fv-button>
        <fv-button
            class="power-editor-bubble-cmd-btn"
            :theme="thisTheme"
            :background="getBackground(editor.isActive('italic'))"
            :foreground="getForeground(editor.isActive('italic'))"
            :title="getTitle('Italic')"
            @click="exec('toggleItalic')"
        >
            <i class="ms-Icon ms-Icon--Italic"></i>
        </fv-button>
        <fv-button
            class="power-editor-bubble-cmd-btn"
            :theme="thisTheme"
            :background="getBackground(editor.isActive('strike'))"
            :foreground="getForeground(editor.isActive('strike'))"
            :title="getTitle('Strikethrough')"
            @click="exec('toggleStrike')"
        >
            <i class="ms-Icon ms-Icon--Strikethrough"></i>
        </fv-button>
        <fv-button
            class="power-editor-bubble-cmd-btn"
            :theme="thisTheme"
            :background="getBackground(editor.isActive('underline'))"
            :foreground="getForeground(editor.isActive('underline'))"
            :title="getTitle('Underline')"
            @click="exec('toggleUnderline')"
        >
            <i class="ms-Icon ms-Icon--Underline"></i>
        </fv-button>
        <hr />
        <fv-button
            class="power-editor-bubble-cmd-btn"
            :theme="thisTheme"
            :background="getBackground(false)"
            :foreground="getForeground(false)"
            :title="getTitle('ClearFormatting')"
            @click="exec('clearNodes')"
        >
            <i class="ms-Icon ms-Icon--ClearFormatting"></i>
        </fv-button>
        <color-callout
            :mobileMode="mobileMode"
            :theme="thisTheme"
            :editor="editor"
            :getBackground="getBackground"
            :getForeground="getForeground"
            :exec="exec"
            :execMore="execMore"
        >
            <template v-slot:default="x">
                <fv-button
                    class="power-editor-bubble-cmd-btn"
                    :theme="thisTheme"
                    :background="getBackground(false)"
                    :foreground="getForeground(false, 'rgba(239, 107, 87, 1)')"
                    :title="getTitle('Color')"
                    @click="x.show !== false ? x.show() : ''"
                >
                    <i class="ms-Icon ms-Icon--FontColor"></i>
                </fv-button>
            </template>
        </color-callout>
        <table-callout
            :mobileMode="mobileMode"
            :theme="thisTheme"
            :editor="editor"
            :exec="exec"
            :execMore="execMore"
        >
            <template v-slot:default="x">
                <fv-button
                    class="power-editor-bubble-cmd-btn"
                    :theme="thisTheme"
                    :isBoxShadow="true"
                    :background="getBackground(false)"
                    :foreground="getForeground(false, 'rgba(56, 171, 127, 1)')"
                    :title="getTitle('Table')"
                    @click="x.show !== false ? x.show() : ''"
                >
                    <i class="ms-Icon ms-Icon--TiltDown"></i>
                </fv-button>
            </template>
        </table-callout>
        <fv-button
            class="power-editor-bubble-cmd-btn"
            :theme="thisTheme"
            :background="getBackground(editor.isActive('code'))"
            :foreground="getForeground(editor.isActive('code'))"
            :title="getTitle('Code')"
            @click="exec('toggleCode')"
        >
            <i class="ms-Icon ms-Icon--CSharp"></i>
        </fv-button>
        <fv-button
            class="power-editor-bubble-cmd-btn"
            :theme="thisTheme"
            :background="getBackground(editor.isActive('codeBlock'))"
            :foreground="getForeground(editor.isActive('codeBlock'))"
            :title="getTitle('Code Block')"
            @click="exec('toggleCodeBlock')"
        >
            <i class="ms-Icon ms-Icon--Code"></i>
        </fv-button>
        <fv-button
            class="power-editor-bubble-cmd-btn"
            :theme="thisTheme"
            :background="getBackground(editor.isActive('equationBlock'))"
            :foreground="getForeground(editor.isActive('equationBlock'))"
            :title="getTitle('Equation')"
            @click="insertEquationBlock"
        >
            <i class="ms-Icon ms-Icon--Variable"></i>
        </fv-button>
    </div>
</template>

<script>
import colorCallout from './menus/colorCallout.vue';
import TableCallout from './menus/tableCallout.vue';

export default {
    components: {
        colorCallout,
        TableCallout,
    },
    props: {
        editor: {
            default: () => {
                return {};
            },
        },
        showSave: {
            default: true,
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
            thisTheme: this.theme,
        };
    },
    watch: {
        theme(val) {
            this.thisTheme = val;
        },
        thisTheme(val) {
            this.$emit('update:theme', val);
        },
    },
    computed: {
        highlightColor() {
            if (this.thisTheme === 'dark')
                return {
                    f: 'rgba(36, 36, 36, 1)',
                    b: 'whitesmoke',
                };
            return {
                f: 'whitesmoke',
                b: 'rgba(36, 36, 36, 1)',
            };
        },
    },
    mounted() {
        this.thisTheme = this.theme;
    },
    methods: {
        getTitle(name) {
            return name;
        },
        getForeground(
            state,
            color = {
                light: 'rgba(65, 74, 90, 1)',
                dark: 'rgba(245, 245, 245, 1)',
            }
        ) {
            if (state) return this.highlightColor.f;
            if (typeof color === 'string') return color;
            return color[this.thisTheme];
        },
        getBackground(state) {
            if (state) return this.highlightColor.b;
            if (this.thisTheme === 'dark') return 'rgba(36, 36, 36, 1)';
            return 'rgba(250, 250, 250, 1)';
        },
        exec(cmd) {
            if (cmd) this.editor.chain().focus()[cmd]().run();
        },
        execMore(name, params) {
            this.editor.chain().focus()[name](params).run();
        },
        insert(html) {
            this.editor.commands.insertContent(html);
        },
        insertEmoji(emoji) {
            this.editor.chain().focus().insertContent(emoji).run();
        },
        insertImg(base64_list) {
            base64_list.forEach((el) => {
                this.insert(`<img src="${el}" theme="${this.theme}"></img>\n`);
            });
        },
        insertLink(link) {
            this.editor.chain().focus().insertContent(link).run();
        },
        insertEmbed(link) {
            this.editor.chain().focus().insertContent(link).run();
        },
        insertInlineEquation() {
            this.editor.chain().focus().insertContent(`<inline-equation theme="${this.theme}"></inline-equation>`).run();
        },
        insertEquationBlock() {
            this.editor.chain().focus().insertContent(`<equation-block theme="${this.theme}"></equation-block>`).run();
        },
        insertDrawingBlock() {
            this.editor.chain().focus().insertContent(`<drawing-block theme="${this.theme}"></drawing-block>`).run();
        },
        save() {
            this.$emit('save-click');
        },
    },
};
</script>

<style lang="scss">
.power-editor-bubble-tool-bar-container {
    position: relative;
    width: auto;
    height: 35px;
    padding: 3px;
    background: rgba(239, 239, 239, 1);
    border: rgba(120, 120, 120, 0.1) solid thin;
    border-radius: 3px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    z-index: 5;
    overflow: hidden;
    overflow-x: hidden;
    box-shadow: 0px 2px 1px rgba(0, 0, 0, 0.2);

    &.dark {
        background: rgba(92, 92, 92, 1);
    }

    .power-editor-bubble-cmd-btn {
        width: 35px;
        height: 30px;
        margin: 0px 1px;
        flex-shrink: 0;

        i {
            font-size: 12px;
        }
    }

    hr {
        width: 1.5px;
        margin: 0px 5px;
        height: 30px;
        flex-shrink: 0;
        background: rgba(230, 230, 230, 1);
        border: none;
        border-radius: 2px;
    }
}
</style>
