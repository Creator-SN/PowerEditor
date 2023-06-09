
const DecNodeFuncs = {

    heading(node, flags) {
        const { level } = node.attrs;
        let prefix = '';
        for (let i = 0; i < level; i++) {
            prefix += `#`;
        }
        return `\n${prefix} `;
    },
    paragraph(node, flags) {
        if (flags.bulletList || flags.orderedList || flags.blockquote || flags.powerTaskItem || flags.tableHeader || flags.tableCell) {
            return '';
        }
        return '\n';
    },
    blockquote(node, flags) {
        const { blockquote: level } = flags;
        let prefix = '';
        for (let i = 0; i < level; i++) {
            prefix += `>`;
        }
        return `\n${prefix} `;
    },
    horizontalRule(node, flags) {
        return `\n---\n`;
    },
    hardBreak(node, flags) {
        return `\n`;
    },
    powerTaskItem(node, flags) {
        return `\n- [${node.attrs.checked ? 'x' : ' '}] `;
    },
    powerTaskList(node, flags) {
        return '';
    },
    listItem(node, flags) {
        const { bulletList, orderedList } = flags;
        let prefix = '';
        if (bulletList) {
            const charList = ['+', '-', '*'];
            let space = '';
            for (let i = 1; i < bulletList; i++) {
                space += '  ';
            }
            prefix = `${space}${charList[(bulletList - 1) % charList.length]} `;
        }
        else if (orderedList) {
            let startIdx = node.parent.attrs.start + node.childIdx;
            let space = '';
            for (let i = 1; i < orderedList; i++) {
                space += '  ';
            }
            prefix = `${space}${startIdx}. `;
        }
        return `\n${prefix}`;
    },
    bulletList(node, flags) {
        return '';
    },
    orderedList(node, flags) {
        return '';
    },
    codeBlock(node, flags) {
        return {
            prefix: `\n\n\`\`\`${node.attrs.language ? node.attrs.language : ''}\n`,
            suffix: `\n\`\`\`\n`
        };
    },
    inlineEquation(node, flags) {
        return `$${node.attrs.value}$`;
    },
    equationBlock(node, flags) {
        return `\n$$${node.attrs.value}$$\n`;
    },
    drawingBlock (node, flags) {
        let lines = node.attrs.lines;
        let pathList = [];
        for (let line of lines) {
            pathList.push(`<path d="${line.path}" stroke="${line.color}" stroke-width="${line.width}" fill="none"></path>`);
        }
        return `\n<div width="100%" style="overflow-x: auto;">\n<svg width="${node.attrs.width}%" viewBox="0 0 500 250">${pathList.join('\n')}</svg>\n\</div>\n`;
    },
    imageblock(node, flags) {
        return `\n![${node.attrs.caption}](${node.attrs.src})\n`;
    },
    tableHeader(node, flags) {
        let space = '';
        if (flags.table)
            space += '  ';
        if (flags.tableRow)
            space += '  ';
        return {
            prefix: `${node.childIdx === 0 ? '' : '\n'}${space}<th colspan="${node.attrs.colspan}" colspan="${node.attrs.rowspan}" colwidth="${node.attrs.colwidth}">`,
            suffix: `${space}</th>`
        };
    },
    tableCell(node, flags) {
        let space = '';
        if (flags.table)
            space += '  ';
        if (flags.tableRow)
            space += '  ';
        return {
            prefix: `${node.childIdx === 0 ? '' : '\n'}${space}<td colspan="${node.attrs.colspan}" colspan="${node.attrs.rowspan}" colwidth="${node.attrs.colwidth}">`,
            suffix: `${space}</td>`
        };
    },
    tableRow(node, flags) {
        let space = '';
        if (flags.table)
            space += '  ';
        return {
            prefix: `${node.childIdx === 0 ? '' : '\n'}${space}<tr>\n`,
            suffix: `\n${space}</tr>`
        };
    },
    table(node, flags) {
        return {
            prefix: `\n<table>\n`,
            suffix: `\n</table>\n`
        };
    },
    mentionItem (node, flags) {
        return `\`@${node.attrs.value}\``;
    },
    embedblock (node, flags) {
        return `\n<video src="${node.attrs.src}" width="800px" height="600px" controls="controls"></video>\n`;
    },

    text(node, flags) {
        let result = node.text;
        let marks = node.marks;
        if (!Array.isArray(marks)) {
            marks = [];
        }
        for (let mark of marks) {
            if (!this[mark.type]) {
                console.warn(`Unknown mark type: ${mark.type}`);
            }
            else
                result = this[mark.type](result, mark);
        }
        return result;
    },
    bold(text) {
        return `**${text}**`;
    },
    italic(text) {
        return `*${text}*`;
    },
    strike(text) {
        return `~~${text}~~`;
    },
    subscript(text) {
        return `~${text}~`;
    },
    superscript(text) {
        return `^${text}^`;
    },
    link(text, mark) {
        return `[${text}](${mark.attrs.href})`;
    },
    highlight(text) {
        return `==${text}==`;
    },
    code(text) {
        return `\`${text}\``;
    }
}



export class Decoder {
    constructor() {
        this.flags = {
            inline: false,
            inlineWrapper: false,
            heading: false,
            bulletList: false,
            orderedList: false,
            blockquote: false,
            powerTaskItem: false,
            powerTaskList: false,
            tableHeader: false,
            tableCell: false,
            tableRow: false,
            table: false
        }
    }

    decode(doc) {
        doc = JSON.parse(JSON.stringify(doc));

        let result = '';

        if (!Array.isArray(doc.content))
            doc.content = [];
        for (let node of doc.content) {
            result += this.renderNode(node);
        }

        return result;
    }

    renderNode(node) {
        if (!node.parent) {
            node.flags = Object.assign({}, this.flags);
        }
        else {
            node.flags = Object.assign({}, node.parent.flags);
        }
        let type = node.type;
        if (type === 'text') return DecNodeFuncs.text(node);
        if (node.flags.hasOwnProperty(type)) {
            if (node.flags[type] !== false) {
                node.flags[type] += 1;
            }
            else {
                node.flags[type] = 1;
            }
        }
        if (type === 'paragraph') {
            node.flags.inlineWrapper = true;
            node.flags.inline = true;
        }

        let result = '';
        let children = node.content;
        if (!Array.isArray(children)) {
            children = [];
        }
        for (let child of children) {
            child.parent = node;
            child.childIdx = children.indexOf(child);
            result += this.renderNode(child);
        }

        if (!DecNodeFuncs.hasOwnProperty(type)) {
            console.warn(`Unknown node type: ${type}`);
            return result;
        }

        let thisResult = DecNodeFuncs[type](node, node.flags);
        if (typeof thisResult === 'string')
            return thisResult + result;
        else
            return thisResult.prefix + result + thisResult.suffix;
    }
}