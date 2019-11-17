<docs>
# 字段配置
- 只针对point，配置保存到字段subFieldSetting
</docs>

<template>
    <div class="field-setting">
        <el-button class="close" type="text" @click="$emit('close')">关闭</el-button>
        <el-tag @click="showMode(1)">模式一填充</el-tag>
        <el-tag @click="showMode(2)">模式二填充</el-tag>
        <el-form label-width="100px">
            <el-form-item v-for="(field, index) in fieldSetting" :label="field.key" :key="index">
                <el-checkbox
                    :disabled="disabledSetting.indexOf(field.key) >= 0"
                    v-model="field.isAble"
                >可配置</el-checkbox>
                <el-checkbox
                    v-show="field.isAble"
                    v-model="field.isShow"
                >展示时显示</el-checkbox>
            </el-form-item>
        </el-form>
        <el-button size="small" @click="confirm">确定</el-button>
    </div>
</template>

<script>
import { FieldSettingMode1, FieldSettingMode2 } from './_config';
export default {
    name: 'field-setting',
    props: [ 'setting', 'action' ],
    data () {
        return {
            disabledSetting: [ 'sort', 'content' ],
            fieldSetting: []
        };
    },
    mounted () {
        
        this.init();
    },
    methods: {
        init () {
            if (!this.setting) {
                this.fieldSetting = _.cloneDeep(FieldSettingMode1);
            } else {
                this.fieldSetting = this.setting;
            }
        },
        showMode (mode) {
            if (mode === 1) {
                this.fieldSetting = _.cloneDeep(FieldSettingMode1);
            }
            if (mode === 2) {
                this.fieldSetting = _.cloneDeep(FieldSettingMode2);
            }
        },
        confirm () {
            this.$emit('confirm', JSON.stringify(this.fieldSetting));
            this.$emit('close');
        }
    }
};
</script>

<style lang="scss">
.field-setting {
    z-index: 99;
    position: absolute;
    top: 0;
    right: 0;
    padding: 15px;
    width: 60%;
    height: 100%;
    overflow-y: scroll;
    background: #f2f2f2;
    > .close {
        position: absolute;
        top: 10px;
        right: 10px;
    }
}
</style>
