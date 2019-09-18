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
    </el-form-item>
</template>

<script>
export default {
    name: 'form-ctrl-list',
    props: [ 'fieldConfig', 'data', 'action', 'dataKey' ],
    data () {
        return {
            // catsConfig: {
            //     selectType: 'single', // or multi
            //     lastLevel: 'plane'
            // }
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
            console.log(6666, val);
            this.data.id = JSON.parse(val).planes[0];
        }
    }
};
</script>
