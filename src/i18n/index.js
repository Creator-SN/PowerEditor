import i18next from "i18next";
import resources from './resource/index.json'

async function loadi18n() {
    await i18next.init({
        resources: resources
    })
    return i18next
}

export { loadi18n }