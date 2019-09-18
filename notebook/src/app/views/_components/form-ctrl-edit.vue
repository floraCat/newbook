<template>
    <el-form-item class="form-ctrl-list" :label="`${fieldConfig.label}：`">
        <!--input-->
        <template v-if="type === 'text'">
            <el-input v-model="data[fieldConfig.key]"
                      :disabled="disabledActive(fieldConfig)"
                      :placeholder="fieldConfig.formCtrl.placeholder || ''"></el-input>
        </template>
        <!--checkbox-->
        <template v-if="type === 'checkbox'">
            <el-checkbox-group v-model="data[fieldConfig.key]">
                <el-checkbox v-for="(opt,index) in fieldConfig.formCtrl.opts" :key="index" :label="opt.value">{{opt.label}}</el-checkbox>
            </el-checkbox-group>
        </template>
        <!--radio-->
        <template v-if="type === 'radio'">
            <el-radio-group v-model="data[fieldConfig.key]">
                <el-radio v-for="(opt,index) in fieldConfig.formCtrl.opts" :key="index" :label="opt.value">{{opt.label}}</el-radio>
            </el-radio-group>
        </template>
        <!--switch-->
        <template v-if="type === 'switch'">
            <el-switch
                v-model="data[fieldConfig.key]"
                active-color="#13ce66"
                inactive-color="#ff4949">
            </el-switch>
        </template>
        <!--select-->
        <template v-if="type === 'select'">
            <el-select v-model="data[fieldConfig.key]" :placeholder="fieldConfig.formCtrl.placeholder || ''">
                <el-option
                    v-for="opt in fieldConfig.formCtrl.opts"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value">
                </el-option>
            </el-select>
        </template>
        <!--textarea-->
        <template v-if="type === 'textarea'">
            <textarea v-text="data[fieldConfig.key]"></textarea>
        </template>
        <!--catalog-tree-->
        <template v-if="type === 'catalog-tree'">
            <catalog-tree
                selectType="single"
                :dimension="dataKey"
                @confirm="getCatalog">
                <el-input slot="reference" v-model="data.id" placeholder="点击选择分类" />
            </catalog-tree>
        </template>
        <!--editor-->
        <template v-if="type === 'editor'">
            <!--富文本编辑器-->
            <div id="editor">
                <froala id="edit" :tag="'textarea'" :config="config" v-model="data.extend"></froala>
            </div>
        </template>
    </el-form-item>
</template>

<script>
import VueFroala from 'vue-froala-wysiwyg'; // 富文本编辑器
export default {
    name: 'form-ctrl-list',
    props: [ 'fieldConfig', 'data', 'action', 'dataKey' ],
    data () {
        return {
            // catsConfig: {
            //     selectType: 'single', // or multi
            //     lastLevel: 'plane'
            // }
            // 富文本编辑器
            config: {
                toolbarButtons: ['undo', 'redo', 'clearFormatting', '|', 'bold', 'italic', 'underline','strikeThrough','|', 'fontFamily', 'fontSize', 'color', '|','paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', '|', 'print', 'spellChecker', 'help', '|', 'fullscreen'],//['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'],//显示可操作项
                events: {
                'froalaEditor.initialized': function () {
                    console.log('initialized')
                }
                },
            }
        };
    },
    computed: {
        type () {
            return (this.fieldConfig.formCtrl && this.fieldConfig.formCtrl.type) || '';
        }
    },
    mounted () {
    },
    methods: {
        disabledActive (config) {
            return (this.action === 'add' && config.special && config.special.disabledCtrlAdd) ||
                (this.action === 'mod' && config.special && config.special.disabledCtrlMod);
        },
        // 拿到分类
        getCatalog (val) {
            this.data.id = JSON.parse(val).planes[0];
        }
    }
};
</script>

<style lang="scss">
#editor .fr-wrapper {
    max-height: 300px;
    min-height: 200px;
    overflow-y: scroll;
}
</style>
