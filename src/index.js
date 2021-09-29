import Editor from '@/modules/editor/index.js';
import VueFluent from 'vfluentdesign';
import 'vfluentdesign/lib/index.css';

import katex from 'katex';
import 'katex/dist/katex.min.css';

let components = [Editor];

const install = (Vue) => {
    if (install.installed) return;
    Vue.use(VueFluent);
    Vue.prototype.$katex = katex;
    components.map((component) => Vue.use(component));
};

export default {
    install,
    Editor,
};

export { Editor };
