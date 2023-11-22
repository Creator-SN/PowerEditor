import { Extension } from '@tiptap/core'

export default Extension.create({
    name: 'formatPainter',

    addOptions() {
        return {

        }
    },

    addStorage() {
        return {
            formatPainterStatus: 'off', // off, once, on
            formatPainterList: {
                marks: [],
                attributes: []
            },
        }
    },

    addCommands() {
        let marksAndNodes = {
            'bold': {
                func: 'setBold',
                cancelFunc: 'unsetBold'
            },
            'italic': {
                func: 'setItalic',
                cancelFunc: 'unsetItalic'
            },
            'underline': {
                func: 'setUnderline',
                cancelFunc: 'unsetUnderline'
            },
            'strike': {
                func: 'setStrike',
                cancelFunc: 'unsetStrike'
            },
            'blockquote': {
                func: 'setBlockquote',
                cancelFunc: 'unsetBlockquote'
            },
            'superscript': {
                func: 'setSuperscript',
                cancelFunc: 'unsetSuperscript'
            },
            'subscript': {
                func: 'setSubscript',
                cancelFunc: 'unsetSubscript'
            },
            'powerTaskList': {
                func: 'setPowerTaskList'
            },
            'bulletList': {
                func: 'setBulletList',
            },
            'orderedList': {
                func: 'setOrderedList',
            },
            textAlignLeft: {
                alias: 'textAlign',
                func: 'setTextAlign',
                value: 'left'
            },
            textAlignCenter: {
                alias: 'textAlign',
                func: 'setTextAlign',
                value: 'center'
            },
            textAlignRight: {
                alias: 'textAlign',
                func: 'setTextAlign',
                value: 'right'
            },
            textAlignJustify: {
                alias: 'textAlign',
                func: 'setTextAlign',
                value: 'justify'
            },
            'code': {
                func: 'setCode',
                cancelFunc: 'unsetCode'
            },
            'codeBlock': {
                func: 'setCodeBlock',
            },
        };
        let attributes = {
            'heading': {
                func: 'setHeading',
                cancelFunc: 'unsetHeading'
            },
            'textStyle': {
                func: 'setColor',
                deconstructKey: 'color',
                cancelFunc: 'unsetColor'
            },
            'highlight': {
                func: 'setHighlight',
                cancelFunc: 'unsetHighlight'
            },
        };
        return {
            detectFormat: () => ({ editor }) => {
                let marks = [];
                let attributesList = [];
                for (let key in attributes) {
                    let res = editor.getAttributes(key);
                    if (Object.keys(res).length > 0) {
                        let attr = attributes[key];
                        attributesList.push({
                            name: key,
                            value: attr.deconstructKey ? res[attr.deconstructKey] : res,
                            func: attr.func
                        });
                    }
                    else {
                        if (attributes[key].cancelFunc) {
                            let attr = attributes[key];
                            attributesList.push({
                                name: key,
                                func: attr.cancelFunc
                            });
                        }
                    }
                }
                for (let key in marksAndNodes) {
                    let mark = marksAndNodes[key].alias || key;
                    let res = false;
                    if (marksAndNodes[key].value) {
                        let t = {};
                        t[mark] = marksAndNodes[key].value;
                        res = editor.isActive(t);
                    }
                    else {
                        res = editor.isActive(key);
                    }
                    if (res) {
                        let result = {
                            name: mark,
                            func: marksAndNodes[key].func
                        }
                        if (marksAndNodes[key].value) {
                            result.value = marksAndNodes[key].value;
                        }
                        marks.push(result);
                    }
                    else {
                        if (marksAndNodes[key].cancelFunc) {
                            let result = {
                                name: mark,
                                func: marksAndNodes[key].cancelFunc
                            }
                            marks.push(result);
                        }
                    }
                }
                editor.storage.formatPainter.formatPainterList = {
                    marks,
                    attributes: attributesList
                };
                // console.log(marks, attributesList);
                return {
                    marks,
                    attributes: attributesList
                };
            },
            pasteFormat: () => ({ editor, commands }) => {
                const { marks, attributes } = editor.storage.formatPainter.formatPainterList;
                // 无法直接使用editor.commands, 因为似乎commands执行完后才会更新editor的状态, 但是参照官方`bold`样例直接使用commands却可以
                for (let mark of marks) {
                    if (mark.value) {
                        commands[mark.func](mark.value);
                    }
                    else {
                        commands[mark.func]();
                    }
                }
                for (let attribute of attributes) {
                    if (attribute.value) {
                        commands[attribute.func](attribute.value);
                    }
                    else {
                        commands[attribute.func]();
                    }
                }
                return true;
            },
            setFormatPainter: () => ({ editor }) => {
                editor.storage.formatPainter.formatPainterStatus = 'once';
            },
            stickyFormatPainter: () => ({ editor }) => {
                editor.storage.formatPainter.formatPainterStatus = 'on';
            },
            unsetFormatPainter: () => ({ editor }) => {
                editor.storage.formatPainter.formatPainterStatus = 'off';
            },
            unsetHeading: () => ({ editor, commands }) => {
                let level = editor.getAttributes('heading').level;
                if (level) return commands.toggleHeading({ level: level });
            },
            setBulletList: () => ({ editor, commands }) => {
                let status = editor.isActive('bulletList');
                if (!status)
                    return commands.toggleBulletList();
            },
            setOrderedList: () => ({ editor, commands }) => {
                let status = editor.isActive('orderedList');
                if (!status)
                    return commands.toggleOrderedList();
            }
        }
    },

    addKeyboardShortcuts() {
        return {
            'Alt-c': () => this.editor.commands.detectFormat(),
            'Alt-v': () => this.editor.commands.pasteFormat(),
        };
    },
});