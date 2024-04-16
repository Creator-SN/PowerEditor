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
            :border-color="'transparent'"
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
            :border-color="'transparent'"
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
            :border-color="'transparent'"
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
            :border-color="'transparent'"
            :title="getTitle('Underline')"
            @click="exec('toggleUnderline')"
        >
            <i class="ms-Icon ms-Icon--Underline"></i>
        </fv-button>
        <hr />
        <fv-button
            class="power-editor-bubble-cmd-btn"
            :theme="thisTheme"
            :background="getBackground(editor.storage.formatPainter.formatPainterStatus !== 'off')"
            :foreground="getForeground(editor.storage.formatPainter.formatPainterStatus !== 'off')"
            :border-color="'transparent'"
            :title="getTitle('Format Painter')"
            @click="formatPainterClick"
            @dblclick.native="formatPainterDoubleClick"
        >
            <i class="ms-Icon ms-Icon--Personalize"></i>
        </fv-button>
        <fv-button
            class="power-editor-bubble-cmd-btn"
            :theme="thisTheme"
            :background="getBackground(false)"
            :foreground="getForeground(false)"
            :border-color="'transparent'"
            :title="getTitle('ClearFormatting')"
            @click="() => {exec('clearNodes'); exec('unsetAllMarks');}"
        >
            <i class="ms-Icon ms-Icon--ClearFormatting"></i>
        </fv-button>
        <color-callout
            :mobileMode="mobileMode"
            :foreground="foreground"
            :theme="thisTheme"
            :language="language"
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
                    :border-color="'transparent'"
                    :title="getTitle('Color')"
                    @click="x.show !== false ? x.show() : ''"
                >
                    <i class="ms-Icon ms-Icon--FontColor"></i>
                </fv-button>
            </template>
        </color-callout>
        <table-callout
            :mobileMode="mobileMode"
            :foreground="foreground"
            :theme="thisTheme"
            :language="language"
            :editor="editor"
            :exec="exec"
            :execMore="execMore"
        >
            <template v-slot:default="x">
                <fv-button
                    class="power-editor-bubble-cmd-btn"
                    :theme="thisTheme"
                    :background="getBackground(false)"
                    :foreground="getForeground(false, 'rgba(56, 171, 127, 1)')"
                    :border-color="'transparent'"
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
            :border-color="'transparent'"
            :title="getTitle('Code')"
            @click="exec('toggleCode')"
        >
            <i class="ms-Icon ms-Icon--CSharp"></i>
        </fv-button>
        <fv-button
            class="power-editor-bubble-cmd-btn"
            :theme="thisTheme"
            :background="getBackground(editor.isActive('equationBlock'))"
            :foreground="getForeground(editor.isActive('equationBlock'))"
            :border-color="'transparent'"
            :title="getTitle('Equation')"
            @click="insertEquation"
        >
            <i class="ms-Icon ms-Icon--Variable"></i>
        </fv-button>
        <fv-button
            class="power-editor-bubble-cmd-btn"
            :theme="thisTheme"
            :background="getBackground(editor.isActive('codeBlock'))"
            :foreground="getForeground(editor.isActive('codeBlock'))"
            :border-color="'transparent'"
            :title="getTitle('Code Block')"
            @click="exec('toggleCodeBlock')"
        >
            <i class="ms-Icon ms-Icon--Code"></i>
        </fv-button>
    </div>
</template>

<script>
import colorCallout from './menus/colorCallout.vue';
import TableCallout from './menus/tableCallout.vue';
import i18n from '@/i18n/i18n.js';

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
        foreground: {
            default: '',
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
            thisTheme: this.theme,
            timer: {
                formatPainter: null,
            },
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
            return i18n(name, this.language);
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
            if (this.thisTheme === 'dark') return 'rgba(50, 50, 50, 1)';
            return 'rgba(239, 239, 239, 1)';
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
                this.insert(`<img src="${el}"></img>\n`);
            });
        },
        insertLink(link) {
            this.editor.chain().focus().insertContent(link).run();
        },
        insertEmbed(link) {
            this.editor.chain().focus().insertContent(link).run();
        },
        insertInlineEquation(text = '') {
            this.editor
                .chain()
                .focus()
                .insertContent({
                    type: 'inlineEquation',
                    attrs: {
                        theme: this.theme,
                        value: text,
                    },
                })
                .run();
        },
        insertEquationBlock() {
            this.editor
                .chain()
                .focus()
                .insertContent({
                    type: 'equationBlock',
                    attrs: {
                        theme: this.theme,
                    },
                })
                .run();
        },
        insertEquation() {
            let state = this.editor.view.state;
            let selection = this.editor.view.state.selection;
            let text = state.doc.textBetween(selection.from, selection.to, ' ');
            if (text.length > 0) {
                this.insertInlineEquation(text);
            } else this.insertEquationBlock();
        },
        insertDrawingBlock() {
            this.editor.chain().focus().insertContent(`<drawing-block></drawing-block>`).run();
        },
        formatPainterClick() {
            if (this.editor.storage.formatPainter.formatPainterStatus === 'off') {
                this.editor.commands.setFormatPainter();
                this.editor.commands.detectFormat();
            } else {
                clearTimeout(this.timer.formatPainter);
                this.timer.formatPainter = setTimeout(() => {
                    this.editor.commands.unsetFormatPainter();
                }, 300);
            }
        },
        formatPainterDoubleClick() {
            clearTimeout(this.timer.formatPainter);
            this.editor.commands.stickyFormatPainter();
            this.editor.commands.detectFormat();
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
    padding: 1px 3px;
    background: rgba(239, 239, 239, 1);
    border: rgba(120, 120, 120, 0.3) solid thin;
    border-radius: 6px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    z-index: 5;
    overflow: hidden;
    overflow-x: overlay;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.1), 3px 2px 8px rgba(0, 0, 0, 0.2);

    &.dark {
        background: rgba(50, 50, 50, 1);

        hr {
            background: rgba(200, 200, 200, 0.1);
        }
    }

    .power-editor-bubble-cmd-btn {
        width: 35px;
        height: 33px;
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
        background: rgba(90, 90, 90, 0.1);
        border: none;
        border-radius: 2px;
    }
}
</style>
