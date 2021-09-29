import Editor from './src/index.vue'

Editor.install = function (Vue) {
    Vue.component(Editor.name, Editor)
}

export default Editor;

export { Editor }