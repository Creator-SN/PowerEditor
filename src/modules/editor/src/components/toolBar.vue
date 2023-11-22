<template>
    <div
        class="power-editor-tool-bar-container"
        :class="[{ dark: thisTheme === 'dark' }]"
        :style="{height: `${toolbarHeight}px`, 'border-radius': `${toolbarBorderRadius}px`}"
    >
        <slot
            name="custom-buttons-front"
            defaultClass="power-editor-cmd-btn"
        ></slot>
        <fv-button
            v-show="showSave"
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(false)"
            :foreground="getForeground(false, {
                light: 'rgba(147, 79, 125, 1)',
                dark: 'rgba(169, 58, 132, 1)'
            })"
            :title="getTitle('Save')"
            @click="save"
        >
            <i class="ms-Icon ms-Icon--Save"></i>
        </fv-button>
        <slot
            name="custom-buttons-0"
            defaultClass="power-editor-cmd-btn"
        ></slot>
        <fv-button
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(false)"
            :foreground="getForeground(false, 'rgba(73, 150, 180, 1)')"
            :title="getTitle('Undo')"
            @click="exec('undo')"
        >
            <i class="ms-Icon ms-Icon--Undo"></i>
        </fv-button>
        <fv-button
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(false)"
            :foreground="getForeground(false, 'rgba(73, 150, 180, 1)')"
            :title="getTitle('Redo')"
            @click="exec('redo')"
        >
            <i class="ms-Icon ms-Icon--Redo"></i>
        </fv-button>
        <fv-button
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(editor.isActive('bold'))"
            :foreground="getForeground(editor.isActive('bold'))"
            :title="getTitle('Bold')"
            @click="exec('toggleBold')"
        >
            <i class="ms-Icon ms-Icon--Bold"></i>
        </fv-button>
        <fv-button
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(editor.isActive('italic'))"
            :foreground="getForeground(editor.isActive('italic'))"
            :title="getTitle('Italic')"
            @click="exec('toggleItalic')"
        >
            <i class="ms-Icon ms-Icon--Italic"></i>
        </fv-button>
        <fv-button
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(editor.isActive('strike'))"
            :foreground="getForeground(editor.isActive('strike'))"
            :title="getTitle('Strikethrough')"
            @click="exec('toggleStrike')"
        >
            <i class="ms-Icon ms-Icon--Strikethrough"></i>
        </fv-button>
        <fv-button
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(editor.isActive('underline'))"
            :foreground="getForeground(editor.isActive('underline'))"
            :title="getTitle('Underline')"
            @click="exec('toggleUnderline')"
        >
            <i class="ms-Icon ms-Icon--Underline"></i>
        </fv-button>
        <fv-button
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(editor.storage.formatPainter.formatPainterStatus !== 'off')"
            :foreground="getForeground(editor.storage.formatPainter.formatPainterStatus !== 'off')"
            :title="getTitle('Format Painter')"
            @click="formatPainterClick"
            @dblclick.native="formatPainterDoubleClick"
        >
            <i class="ms-Icon ms-Icon--Personalize"></i>
        </fv-button>
        <slot
            name="custom-buttons-1"
            defaultClass="power-editor-cmd-btn"
        ></slot>
        <hr />
        <fv-button
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(editor.isActive('blockquote'))"
            :foreground="getForeground(editor.isActive('blockquote'))"
            :title="getTitle('Block Quote')"
            @click="exec('toggleBlockquote')"
        >
            <i class="ms-Icon ms-Icon--LeftDoubleQuote"></i>
        </fv-button>
        <fv-button
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(false)"
            :foreground="getForeground(false)"
            :title="getTitle('Horizontal Rule')"
            @click="exec('setHorizontalRule')"
        >
            <i class="ms-Icon ms-Icon--ChromeMinimize"></i>
        </fv-button>
        <heading-callout
            :mobileMode="mobileMode"
            :theme="thisTheme"
            :language="language"
            :editor="editor"
            :getBackground="getBackground"
            :getForeground="getForeground"
            :execMore="execMore"
        >
            <template v-slot:default="x">
                <fv-button
                    class="power-editor-cmd-btn"
                    :theme="thisTheme"
                    :isBoxShadow="true"
                    :background="getBackground(false)"
                    :foreground="getForeground(false)"
                    :title="getTitle('Header')"
                    @click="x.show !== false ? x.show() : ''"
                >
                    <i class="ms-Icon ms-Icon--Header1"></i>
                </fv-button>
            </template>
        </heading-callout>
        <fv-button
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(editor.isActive('superscript'))"
            :foreground="getForeground(editor.isActive('superscript'))"
            :title="getTitle('Task')"
            @click="exec('toggleSuperscript')"
        >
            <i class="ms-Icon ms-Icon--Superscript"></i>
        </fv-button>
        <fv-button
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(editor.isActive('subscript'))"
            :foreground="getForeground(editor.isActive('subscript'))"
            :title="getTitle('Task')"
            @click="exec('toggleSubscript')"
        >
            <i class="ms-Icon ms-Icon--Subscript"></i>
        </fv-button>
        <fv-button
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(editor.isActive('powerTaskList'))"
            :foreground="getForeground(editor.isActive('powerTaskList'))"
            :title="getTitle('Task')"
            @click="exec('togglePowerTaskList')"
        >
            <i class="ms-Icon ms-Icon--TaskLogo"></i>
        </fv-button>
        <fv-button
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(false)"
            :foreground="getForeground(false)"
            :title="getTitle('ClearFormatting')"
            @click="() => {exec('clearNodes'); exec('unsetAllMarks');}"
        >
            <i class="ms-Icon ms-Icon--ClearFormatting"></i>
        </fv-button>
        <slot
            name="custom-buttons-2"
            defaultClass="power-editor-cmd-btn"
        ></slot>
        <hr />
        <fv-button
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(editor.isActive('bulletList'))"
            :foreground="getForeground(editor.isActive('bulletList'))"
            :title="getTitle('BulletedList')"
            @click="exec('toggleBulletList')"
        >
            <i class="ms-Icon ms-Icon--BulletedList"></i>
        </fv-button>
        <fv-button
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(editor.isActive('orderedList'))"
            :foreground="getForeground(editor.isActive('orderedList'))"
            :title="getTitle('NumberedList')"
            @click="exec('toggleOrderedList')"
        >
            <i class="ms-Icon ms-Icon--NumberedList"></i>
        </fv-button>
        <fv-button
            v-if="false"
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(false)"
            :foreground="getForeground(false)"
            :title="getTitle('DetailsList')"
            @click="exec('toggleOrderedList')"
        >
            <i class="ms-Icon ms-Icon--ShowBcc"></i>
        </fv-button>
        <slot
            name="custom-buttons-3"
            defaultClass="power-editor-cmd-btn"
        ></slot>
        <hr />
        <fv-button
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(editor.isActive({ textAlign: 'left' }))"
            :foreground="getForeground(editor.isActive({ textAlign: 'left' }))"
            :title="getTitle('AlignLeft')"
            @click="execMore('setTextAlign', 'left')"
        >
            <i class="ms-Icon ms-Icon--AlignLeft"></i>
        </fv-button>
        <fv-button
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(editor.isActive({ textAlign: 'center' }))"
            :foreground="getForeground(editor.isActive({ textAlign: 'center' }))"
            :title="getTitle('AlignCenter')"
            @click="execMore('setTextAlign', 'center')"
        >
            <i class="ms-Icon ms-Icon--AlignCenter"></i>
        </fv-button>
        <fv-button
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(editor.isActive({ textAlign: 'right' }))"
            :foreground="getForeground(editor.isActive({ textAlign: 'right' }))"
            :title="getTitle('AlignRight')"
            @click="execMore('setTextAlign', 'right')"
        >
            <i class="ms-Icon ms-Icon--AlignRight"></i>
        </fv-button>
        <fv-button
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(editor.isActive({ textAlign: 'justify' }))"
            :foreground="getForeground(editor.isActive({ textAlign: 'justify' }))"
            :title="getTitle('AlignJustify')"
            @click="execMore('setTextAlign', 'justify')"
        >
            <i class="ms-Icon ms-Icon--AlignJustify"></i>
        </fv-button>
        <hr v-if="false" />
        <fv-button
            v-if="false"
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(false)"
            :foreground="getForeground(false)"
            :title="getTitle('IncreaseIndent')"
            @click="exec('')"
        >
            <i class="ms-Icon ms-Icon--IncreaseIndentLegacy"></i>
        </fv-button>
        <fv-button
            v-if="false"
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(false)"
            :foreground="getForeground(false)"
            :title="getTitle('DecreaseIndent')"
            @click="exec('')"
        >
            <i class="ms-Icon ms-Icon--DecreaseIndentLegacy"></i>
        </fv-button>
        <slot
            name="custom-buttons-4"
            defaultClass="power-editor-cmd-btn"
        ></slot>
        <hr />
        <color-callout
            :mobileMode="mobileMode"
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
                    class="power-editor-cmd-btn"
                    :theme="thisTheme"
                    :isBoxShadow="true"
                    :background="getBackground(false)"
                    :foreground="getForeground(false, 'rgba(239, 107, 87, 1)')"
                    :title="getTitle('Color')"
                    @click="x.show !== false ? x.show() : ''"
                >
                    <i class="ms-Icon ms-Icon--FontColor"></i>
                </fv-button>
            </template>
        </color-callout>
        <fv-button
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(false)"
            :foreground="getForeground(false, 'rgba(222, 81, 140, 1)')"
            :title="getTitle('Draw')"
            @click="insertDrawingBlock"
        >
            <i class="ms-Icon ms-Icon--StrokeErase2"></i>
        </fv-button>
        <emoji-callout
            :mobileMode="mobileMode"
            :theme="thisTheme"
            :language="language"
            :editor="editor"
            @insert-emoji="insertEmoji"
        >
            <template v-slot:default="x">
                <fv-button
                    class="power-editor-cmd-btn"
                    :theme="thisTheme"
                    :isBoxShadow="true"
                    :background="getBackground(false)"
                    :foreground="getForeground(false, 'rgba(255, 180, 0, 1)')"
                    :title="getTitle('Emoji')"
                    @click="x.show !== false ? x.show() : ''"
                >
                    <i class="ms-Icon ms-Icon--Emoji2"></i>
                </fv-button>
            </template>
        </emoji-callout>
        <table-callout
            :mobileMode="mobileMode"
            :theme="thisTheme"
            :language="language"
            :editor="editor"
            :exec="exec"
            :execMore="execMore"
        >
            <template v-slot:default="x">
                <fv-button
                    class="power-editor-cmd-btn"
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
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(editor.isActive('code'))"
            :foreground="getForeground(editor.isActive('code'))"
            :title="getTitle('Code')"
            @click="exec('toggleCode')"
        >
            <i class="ms-Icon ms-Icon--CSharp"></i>
        </fv-button>
        <fv-button
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(editor.isActive('equationBlock'))"
            :foreground="getForeground(editor.isActive('equationBlock'))"
            :title="getTitle('Equation')"
            @click="insertEquation"
        >
            <i class="ms-Icon ms-Icon--Variable"></i>
        </fv-button>
        <fv-button
            class="power-editor-cmd-btn"
            :theme="thisTheme"
            :isBoxShadow="true"
            :background="getBackground(editor.isActive('codeBlock'))"
            :foreground="getForeground(editor.isActive('codeBlock'))"
            :title="getTitle('Code Block')"
            @click="exec('toggleCodeBlock')"
        >
            <i class="ms-Icon ms-Icon--Code"></i>
        </fv-button>
        <image-callout
            :mobileMode="mobileMode"
            :theme="thisTheme"
            :language="language"
            @insert-image="insertImg"
        >
            <template v-slot:default="x">
                <fv-button
                    class="power-editor-cmd-btn"
                    :theme="thisTheme"
                    :isBoxShadow="true"
                    :background="getBackground(false)"
                    :foreground="getForeground(false)"
                    :title="getTitle('Image')"
                    @click="x.show !== false ? x.show() : ''"
                >
                    <i class="ms-Icon ms-Icon--Photo2"></i>
                </fv-button>
            </template>
        </image-callout>
        <link-callout
            :mobileMode="mobileMode"
            :theme="thisTheme"
            :language="language"
            @insert-link="insertLink"
        >
            <template v-slot:default="x">
                <fv-button
                    class="power-editor-cmd-btn"
                    :theme="thisTheme"
                    :isBoxShadow="true"
                    :background="getBackground(false)"
                    :foreground="getForeground(false)"
                    :title="getTitle('Link')"
                    @click="x.show !== false ? x.show() : ''"
                >
                    <i class="ms-Icon ms-Icon--Link"></i>
                </fv-button>
            </template>
        </link-callout>
        <embed-callout
            :mobileMode="mobileMode"
            :theme="thisTheme"
            :language="language"
            @insert-embed="insertEmbed"
        >
            <template v-slot:default="x">
                <fv-button
                    class="power-editor-cmd-btn"
                    :theme="thisTheme"
                    :isBoxShadow="true"
                    :background="getBackground(false)"
                    :foreground="getForeground(false)"
                    :title="getTitle('Embed')"
                    @click="x.show !== false ? x.show() : ''"
                >
                    <i class="ms-Icon ms-Icon--FileHTML"></i>
                </fv-button>
            </template>
        </embed-callout>
        <slot
            name="custom-buttons"
            defaultClass="power-editor-cmd-btn"
        ></slot>
    </div>
</template>

<script>
import linkCallout from './menus/linkCallout.vue';
import embedCallout from './menus/embedCallout.vue';
import colorCallout from './menus/colorCallout.vue';
import emojiCallout from './menus/emojiCallout.vue';
import imageCallout from './menus/imageCallout.vue';
import headingCallout from './menus/headingCallout.vue';
import TableCallout from './menus/tableCallout.vue';
import i18n from '@/i18n/i18n.js';

export default {
    components: {
        linkCallout,
        embedCallout,
        colorCallout,
        emojiCallout,
        imageCallout,
        headingCallout,
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
        tippyOptions: {
            default: 100,
        },
        toolbarHeight: {
            default: 70,
        },
        toolbarBorderRadius: {
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
            // state: true = active, false = inactive
            if (state) return this.highlightColor.f;
            if (typeof color === 'string') return color;
            return color[this.thisTheme];
        },
        getBackground(state) {
            // state: true = active, false = inactive
            if (state) return this.highlightColor.b;
            if (this.thisTheme === 'dark') return 'rgba(36, 36, 36, 1)';
            return '';
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
@mixin narrow-scroll-bar {
    &::-webkit-scrollbar {
        width: 10px;
        height: 8px;

        &:hover {
            width: 16px;
        }
    }
    /*定义滚动条轨道
 内阴影+圆角*/
    &::-webkit-scrollbar-track {
        border-radius: 10px;
    }
    /*定义滑块
 内阴影+圆角*/
    &::-webkit-scrollbar-thumb {
        border-right: rgba(191, 190, 189, 0.2) solid 5px;
        background-color: rgba(191, 190, 189, 0);
        transition: background-color 0.3s;
        cursor: pointer;

        &:hover {
            border-radius: 10px;
            border-color: transparent;
            background-color: rgba(191, 190, 189, 0.6);
        }

        &:active {
            background-color: rgba(191, 190, 189, 0.5);
        }

        &:horizontal {
            border-right: none;
            border-bottom: rgba(191, 190, 189, 0.2) solid 5px;
        }
    }
}

.power-editor-tool-bar-container {
    @include narrow-scroll-bar;

    position: absolute;
    left: 5px;
    top: 5px;
    width: calc(100% - 10px);
    height: 70px;
    padding-right: 5px;
    padding-bottom: 6px;
    background: transparent;
    border: rgba(120, 120, 120, 0.1) solid thin;
    border-radius: 8px;
    box-sizing: border-box;
    display: flex;
    align-items: flex-end;
    z-index: 5;
    overflow-x: overlay;
    overflow-y: hidden;

    .power-editor-cmd-btn {
        width: 35px;
        height: 35px;
        margin-left: 5px;
        flex-shrink: 0;

        i {
            font-size: 12px;
        }
    }

    hr {
        width: 1.5px;
        margin-left: 5px;
        height: 30px;
        flex-shrink: 0;
        background: rgba(230, 230, 230, 1);
        border: none;
        border-radius: 2px;
    }
}
</style>
