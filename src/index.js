import Editor from '@/modules/editor/index.js';
import VueFluent from 'vfluentdesign';
import pkg from "../package.json";

import katex from 'katex';
import 'katex/dist/katex.min.css';

let components = [Editor];

const install = (Vue, Vuex) => {
    for (let plugin of Vue._installedPlugins){
        if (plugin.name==pkg.name){
          return;
        }
    }
    console.log(`[CreatorSN] ${pkg.name} v${pkg.version}`)
    Vue.use(VueFluent,Vuex);
    Vue.prototype.$katex = katex;
    components.map((component) => Vue.use(component));
};

export default {
    name: pkg.name,
    version: pkg.version,
    install,
    Editor,
};

export { Editor };
