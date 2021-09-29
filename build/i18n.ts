import 'colors';
import path from 'path';
import fs from 'fs';

//see reference https://www.i18next.com/

/**
 * 语言
 */
type Lang = Record<string, string>;

/**
 * i18n 国际化语言
 */
type i18nResource = {
    /**
     * 键值
     */
    keys: Array<string>;
    /**
     * 语言包
     */
    langs: Record<string, Lang>;
};

/**
 * 运行的根目录
 */
const root: string = process.cwd();
/**
 * 资源文件
 */
let resourcePath: string = path.join(root, './src/i18n/resource');
/**
 * 资源文件列表
 */
let resourceFiles: string[] = fs.readdirSync(resourcePath);
/**
 * 翻译键值的文件名
 */
let keysFilename: string = 'keys.json';
/**
 * build的文件名
 */
let indexFilename: string = 'index.json';

/**
 * 加载i18n资源
 * @returns i18n 资源
 */
function loadResource(): i18nResource {
    console.log(`load resource...`.green);
    let resource: i18nResource = {
        keys: require(path.join(resourcePath, '/keys.json')),
        langs: {},
    };
    for (let file of resourceFiles) {
        // 获取除keys.json外的所有json文件
        if (file !== keysFilename && file != indexFilename && file.endsWith('.json')) {
            let langName: string = file.replace('.json', '');
            let langDictionary: Record<string, string> = require(path.join(resourcePath, file));
            // 对未定义的键进行修补，并提示用户及时补充
            for (let key of resource.keys) {
                if (langDictionary[key] == undefined || langDictionary[key] == 'undefined') {
                    langDictionary[key] = 'undefined';
                    // 提示需要添加该key
                    console.log(`error: [${path.join(resourcePath, file)}] ${langName} key: { ${key} : undefined }`.red);
                }
            }
            resource.langs[langName] = langDictionary;
        }
    }
    return resource;
}

/**
 * 将i18n资源以json的形式保存在各个翻译文件中
 * @param resource i18n资源描述
 */
function saveResource(resource: i18nResource) {
    console.log(`save resource ...`.green);
    for (let langName in resource.langs) {
        let lang: Lang = resource.langs[langName];
        fs.writeFileSync(path.join(resourcePath, `./${langName}.json`), JSON.stringify(lang, null, 4), {
            encoding: 'utf-8',
            flag: 'w',
        });
    }
}

/**
 * 编译i18n资源完整
 * @param resource i18n资源描述
 */
function buildResources(resource: i18nResource) {
    console.log('build ...'.green);
    let resources: Record<string, any> = {};
    for (let langName in resource.langs) {
        resources[langName] = {
            translation: resource.langs[langName],
        };
    }
    fs.writeFileSync(path.join(resourcePath, indexFilename), JSON.stringify(resources, null, 4), {
        encoding: 'utf-8',
        flag: 'w',
    });
}

let resource = loadResource();
saveResource(resource);
buildResources(resource);
