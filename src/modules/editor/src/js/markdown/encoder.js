import MarkdownIt from "markdown-it";
import markdownItKatex from 'markdown-it-katex';
import markdownItSubscript from "markdown-it-sub";
import markdownItSuperscript from "markdown-it-sup";
import markdownItMark from "markdown-it-mark";

import { generateJSON } from "@tiptap/core";

export class Encoder {
    constructor(htmlParseNodes = []) {
        this.md = new MarkdownIt({
            html: true,
            linkify: true,
            typographer: true
        })
            .use(markdownItKatex)
            .use(markdownItSubscript)
            .use(markdownItSuperscript)
            .use(markdownItMark)

        this.htmlParseNodes = htmlParseNodes;
    }

    encoder(text) {
        const tokens = this.md.parse(text, {})

        const doc = {
            type: "doc",
            content: []
        }

        let pointer = doc;
        let stack = [];

        const typeSet = {};

        const textBlocksSet = new Set([
            "paragraph",
            "heading"
        ])
        const flags = {
            "link": false,
            "strike": false,
            "strong": false,
            "sub": false,
            "sup": false,
            "em": false,
            "mark": false
        }
        const cache = {
            "link": {
                "href": null
            }
        }

        const formatText = (text) => {
            if (text === null || text === undefined || text.length == 0) {
                return " ";
            }
            return text;
        }

        for (const token of tokens) {
            switch (token.type) {
                case "hr": {
                    pointer.content.push({
                        type: "horizontalRule"
                    })
                    break;
                }
                case "inline": {
                    // 可能存在着children
                    if (Array.isArray(token.children)) {
                        for (const t of token.children) {
                            switch (t.type) {
                                case "text": {
                                    const obj = {
                                        type: "text",
                                        text: formatText(t.content)
                                    }
                                    let marks = false;
                                    for (let key in flags) {
                                        if (flags[key]) {
                                            marks = true;
                                            break;
                                        }
                                    }
                                    if (marks) {
                                        obj.marks = []
                                    }
                                    if (flags.link === true) {
                                        const match = /\[([^\]]+)\]\(([^\)]+)\)/.exec(token.content)
                                        if (match !== null)
                                            obj.text = match[1];
                                        obj.marks.push({
                                            attrs: {
                                                target: "_blank",
                                                href: cache.link.href,
                                                class: null
                                            },
                                            type: "link"
                                        })
                                    }
                                    if (flags.strike === true) {
                                        obj.marks.push({
                                            type: "strike"
                                        })
                                    }
                                    if (flags.strong === true) {
                                        obj.marks.push({
                                            type: "bold"
                                        })
                                    }
                                    if (flags.sub === true) {
                                        obj.marks.push({
                                            type: "subscript"
                                        })
                                    }
                                    if (flags.sup === true) {
                                        obj.marks.push({
                                            type: "superscript"
                                        })
                                    }
                                    if (flags.em === true) {
                                        obj.marks.push({
                                            type: "italic"
                                        })
                                    }
                                    if (flags.mark === true) {
                                        obj.marks.push({
                                            type: "highlight",
                                            attrs: {
                                                color: "#FAF594"
                                            }
                                        })
                                    }
                                    if (obj.text.length == 0) {
                                        break;
                                    }
                                    if (!textBlocksSet.has(pointer.type)) {
                                        pointer.content.push({
                                            type: "paragraph",
                                            content: [obj]
                                        })
                                    } else {
                                        pointer.content.push(obj)
                                    }
                                    break;
                                }
                                case "hardbreak": {
                                    const obj = {
                                        "type": "hardBreak",
                                    }
                                    pointer.content.push(obj)
                                    break;
                                }
                                case "strong_open": {
                                    flags.strong = true;
                                    break;
                                }
                                case "strong_close": {
                                    flags.strong = false;
                                    break;
                                }
                                case "s_open": {
                                    flags.strike = true;
                                    break;
                                }
                                case "s_close": {
                                    flags.strike = false;
                                    break;
                                }
                                case "sub_open": {
                                    flags.sub = true;
                                    break;
                                }
                                case "sub_close": {
                                    flags.sub = false;
                                    break;
                                }
                                case "sup_open": {
                                    flags.sup = true;
                                    break;
                                }
                                case "sup_close": {
                                    flags.sup = false;
                                    break;
                                }
                                case "em_open": {
                                    flags.em = true;
                                    break;
                                }
                                case "em_close": {
                                    flags.em = false;
                                    break;
                                }
                                case "mark_open": {
                                    flags.mark = true;
                                    break;
                                }
                                case "mark_close": {
                                    flags.mark = false;
                                    break;
                                }
                                case "code_inline": {
                                    const obj = {
                                        marks: [{
                                            type: "code"
                                        }],
                                        type: "text",
                                        text: formatText(t.content)
                                    }
                                    if (obj.text.length == 0) {
                                        break;
                                    }
                                    if (!textBlocksSet.has(pointer.type)) {
                                        pointer.content.push({
                                            type: "paragraph",
                                            content: [obj]
                                        })
                                    } else {
                                        pointer.content.push(obj)
                                    }
                                    break;
                                }
                                case "link_open": {
                                    flags.link = true;
                                    cache.link.href = t.attrGet("href");
                                    break;
                                }
                                case "link_close": {
                                    flags.link = false;
                                    cache.link.href = null;
                                    break;
                                }
                                case "hardbreak":
                                case "softbreak": {
                                    const obj = {
                                        "type": "hardBreak",
                                    }
                                    pointer.content.push(obj)
                                    break;
                                }
                                case "image": {
                                    let src = t.attrGet("src")
                                    const obj = {
                                        type: "imageblock",
                                        attrs: {
                                            src: src ? src : '',
                                            width: 50,
                                            caption: ""
                                        }
                                    }
                                    if (Array.isArray(t.children)) {
                                        const texts = []
                                        for (const child of t.children) {
                                            if (child.type === "text") {
                                                texts.push(child.content)
                                            }
                                        }
                                        obj.attrs.caption = texts.join(" ")
                                    }
                                    pointer.content.push(obj)
                                    break;
                                }
                                case "html_inline": {
                                    const obj = {
                                        marks: [
                                            {
                                                type: "code"
                                            }
                                        ],
                                        type: "text",
                                        text: formatText(t.content)
                                    }
                                    if (obj.text.length == 0) {
                                        break;
                                    }
                                    if (!textBlocksSet.has(pointer.type)) {
                                        pointer.content.push({
                                            type: "paragraph",
                                            content: [obj]
                                        })
                                    } else {
                                        pointer.content.push(obj)
                                    }
                                    break;
                                }
                                case "math_inline": {
                                    const obj = {
                                        type: "inlineEquation",
                                        attrs: {
                                            value: t.content,
                                            placeholder: "Y=WX^T+b",
                                            emptyPlaceholder: "New Equation",
                                            showPopper: false,
                                            tag: "span"
                                        }
                                    }

                                    if (!textBlocksSet.has(pointer.type)) {
                                        pointer.content.push({
                                            type: "paragraph",
                                            content: [obj]
                                        })
                                    } else {
                                        pointer.content.push(obj)
                                    }
                                    break;
                                }
                                default: {
                                    // console.log(t,t.type)
                                    if (typeSet["!" + t.type] === undefined) {
                                        typeSet["!" + t.type] = []
                                    }
                                    typeSet["!" + t.type].push(t)
                                }
                            }
                        }
                    }
                    break;
                }
                case "heading_open": {
                    const level = parseInt(token.tag.substring(1))
                    const obj = {
                        type: "heading",
                        attrs: {
                            level: level,
                            textAlign: "left"
                        },
                        content: []
                    }
                    pointer.content.push(obj);
                    stack.push(pointer)
                    pointer = obj;
                    break;
                }
                case "heading_close": {
                    pointer = stack.pop()
                    break;
                }
                case "paragraph_open": {
                    const obj = {
                        type: "paragraph",
                        content: []
                    }
                    pointer.content.push(obj);
                    stack.push(pointer)
                    pointer = obj;
                    break;
                }
                case "paragraph_close": {
                    if (pointer.content.length === 0) {
                        stack[stack.length - 1].content.pop();
                    }
                    pointer = stack.pop()
                    break;
                }
                case "table_open": {
                    const obj = {
                        type: "table",
                        content: []
                    }
                    pointer.content.push(obj);
                    stack.push(pointer)
                    pointer = obj;
                    break;
                }
                case "table_close": {
                    pointer = stack.pop()
                    break;
                }
                case "tr_open": {
                    const obj = {
                        type: "tableRow",
                        content: [
                        ]
                    }
                    pointer.content.push(obj);
                    stack.push(pointer)
                    pointer = obj;
                    break;
                }
                case "tr_close": {
                    pointer = stack.pop()
                    break;
                }
                case "th_open": {
                    const obj = {
                        type: "tableHeader",
                        content: [
                        ]
                    }
                    pointer.content.push(obj);
                    stack.push(pointer)
                    pointer = obj;
                    break;
                }
                case "th_close": {
                    if (Array.isArray(pointer.content) && pointer.content.length === 0) {
                        pointer.content.push({
                            type: "paragraph",
                            content: []
                        })
                    }
                    pointer = stack.pop()
                    break;
                }
                case "td_open": {
                    const obj = {
                        type: "tableCell",
                        content: [
                        ]
                    }
                    pointer.content.push(obj);
                    stack.push(pointer)
                    pointer = obj;
                    break;
                }
                case "td_close": {
                    if (Array.isArray(pointer.content) && pointer.content.length === 0) {
                        pointer.content.push({
                            type: "paragraph",
                            content: []
                        })
                    }
                    pointer = stack.pop()
                    break;
                }
                case "thead_open":
                case "tbody_open":
                case "tfoot_open":
                case "thead_close":
                case "tbody_close":
                case "tfoot_close":
                    break;
                case "fence": {
                    const obj = {
                        type: "codeBlock",
                        attrs: {
                            language: token.info
                        },
                        content: [{
                            type: "text",
                            text: formatText(token.content)
                        }]
                    }
                    pointer.content.push(obj)
                    break;
                }
                case "code_block": {
                    const obj = {
                        type: "codeBlock",
                        attrs: {
                            language: token.info
                        },
                        content: [{
                            type: "text",
                            text: formatText(token.content)
                        }]
                    }
                    pointer.content.push(obj)
                    break;
                }
                case "blockquote_open": {
                    const obj = {
                        type: "blockquote",
                        content: []
                    }
                    pointer.content.push(obj)
                    stack.push(pointer)
                    pointer = obj;
                    break;
                }
                case "blockquote_close": {
                    pointer = stack.pop()
                    break;
                }
                case "bullet_list_open": {
                    const obj = {
                        type: "bulletList",
                        content: []
                    }
                    pointer.content.push(obj)
                    stack.push(pointer)
                    pointer = obj;
                    break;
                }
                case "bullet_list_close": {
                    pointer = stack.pop()
                    break;
                }
                case "list_item_open": {
                    const obj = {
                        type: "listItem",
                        content: []
                    }
                    pointer.content.push(obj)
                    stack.push(pointer)
                    pointer = obj;
                    break;
                }
                case "list_item_close": {
                    pointer = stack.pop()
                    break;
                }
                case "ordered_list_open": {
                    const obj = {
                        type: "orderedList",
                        content: []
                    }
                    pointer.content.push(obj)
                    stack.push(pointer)
                    pointer = obj;
                    break;
                }
                case "ordered_list_close": {
                    pointer = stack.pop()
                    break;
                }
                case "html_block": {
                    let htmlDoc = generateJSON(token.content, this.htmlParseNodes);
                    pointer.content.push(htmlDoc.content[0]);
                    break;
                }
                case "math_block": {
                    const obj = {
                        type: "equationBlock",
                        attrs: {
                            value: token.content,
                            placeholder: "Y=WX^T+b",
                            emptyPlaceholder: "New Equation",
                            showPopper: false,
                            tag: "div"
                        }
                    }
                    pointer.content.push(obj)
                    break;
                }
                default: {
                    if (typeSet[token.type] === undefined) {
                        typeSet[token.type] = []
                    }
                    typeSet[token.type].push(token)
                }
            }
        }
        return doc;
    }
}