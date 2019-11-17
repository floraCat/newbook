<docs>
# 表单控件
- 判断 type 渲染对应类型的表单控件
</docs>

<template>
    <el-form-item class="nb-form-ctrl" :label="`${fieldConfig.label}：`">
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
            <textarea v-model="data[fieldConfig.key]"></textarea>
        </template>
        <!--catalog-tree-->
        <template v-if="type === 'catalog-tree'">
            <catalog-tree
                :visible="visibleCatalogTree"
                selectType="single"
                :dimension="dataKey"
                @confirm="getCatalog">
                <el-input slot="reference" v-model="catalogTreeLabel" placeholder="点击选择分类" />
            </catalog-tree>
        </template>
        <!--editor-->
        <template v-if="type === 'editor'">
            <!--富文本编辑器-->
            <div id="editor">
                <froala id="edit" :tag="'textarea'" :config="config" v-model="data[fieldConfig.key]"></froala>
            </div>
        </template>
    </el-form-item>
</template>

<script>
import VueFroala from 'vue-froala-wysiwyg'; // 富文本编辑器
import { GetPlane } from '@views/_methods';
export default {
    name: 'nb-form-ctrl',
    props: [ 'fieldConfig', 'data', 'action', 'dataKey' ],
    data () {
        return {
            // 富文本编辑器
            config: {
                toolbarButtons: ['undo', 'redo', 'clearFormatting', '|', 'bold', 'italic', 'underline','strikeThrough','|', 'fontFamily', 'fontSize', 'color', '|','paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', '|', 'print', 'spellChecker', 'help', '|', 'fullscreen'],//['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'],//显示可操作项
                events: {
                    'froalaEditor.initialized': function () {
                        console.log('initialized')
                    }
                }
            },

            visibleCatalogTree: false
        };
    },
    computed: {
        type () {
            return (this.fieldConfig.formCtrl && this.fieldConfig.formCtrl.type) || '';
        },
        pid () {
            let rs = 'point';
            if (this.dataKey === 'point') { rs = 'line'; }
            if (this.dataKey === 'line') { rs = 'plane'; }
            return rs;
        },
        // 分类下拉 显示成 ‘id | text’
        catalogTreeLabel () {
            let rs = null;
            if (this.type === 'catalog-tree') {
                rs = this.data[this.pid] && `${this.data[this.pid].id} | ${this.data[this.pid].title}`;
            }
            return rs;
        }
    },
    mounted () {
        this.init();
    },
    methods: {
        async init () {
            // 分类下拉渲染前先获取所有planes
            if (this.type === 'catalog-tree') {
                if (this.$store.state.planes.length <= 0) {
                    let planes = await GetPlane(this);
                    this.$store.commit('planes', planes);
                }
                this.visibleCatalogTree = true;
            }
        },
        disabledActive (config) {
            return (this.action === 'add' && config.special && config.special.disabledCtrlAdd) ||
                (this.action === 'mod' && config.special && config.special.disabledCtrlMod);
        },
        // 分类下拉 回调
        getCatalog (val) {
            this.$set(this.data, this.pid, val);
        }
    }
};
</script>

<style lang="scss">
.nb-form-ctrl {
     textarea {
        padding: 10px;
    }
}
#editor .fr-wrapper {
    max-height: 600px;
    min-height: 400px;
    overflow-y: scroll;
}
</style>
