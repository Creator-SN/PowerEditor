---
title: UI
home: true
heroImage: https://raw.githubusercontent.com/aleversn/VFluent/master/examples/assert/logo/VFluent.png
actionLink: /
features:
    - title: 基于 Fluent
      details: 基于Microsoft Fluent Design System设计理念设计
    - title: 基于 Tiptap
      details: 所见即所得
footer: MIT Licensed | Copyright © 2021 Creator SN
---

<script>
export default {
    data () {
        return {
            readonly: false,
            theme: "light"
        }
    }
}
</script>

<fv-button :theme="theme" borderRadius="35" style="width: 35px; height: 35px; margin: 15px 0px;" @click="theme = theme == 'light' ? 'dark' : 'light'"><i class="ms-Icon" :class="[`ms-Icon--${theme === 'light' ? 'Sunny' : 'ClearNight'}`]"></i></fv-button>
<fv-button :theme="theme" borderRadius="35" style="width: 35px; height: 35px; margin: 15px 0px;" @click="readonly = readonly == true ? false : true"><i class="ms-Icon" :class="[`ms-Icon--${readonly === true ? 'PageEdit' : 'ReadingMode'}`]"></i></fv-button>

<power-editor :theme="theme" :editable="!readonly" style="width:100%" />
