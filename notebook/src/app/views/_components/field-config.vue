<template>
    <div class="field-config">
        <el-form label-width="100px">
            <el-form-item v-for="(field, index) in fieldConfig" :label="field.key" :key="index">
                <el-checkbox v-model="field.isAble">是否可用</el-checkbox>
                <el-checkbox v-model="field.isShow">是否隐藏</el-checkbox>
            </el-form-item>
        </el-form>
        <el-button @click="confirm">确定</el-button>
    </div>
</template>

<script>
import { FieldConfigDefault } from './_config';
export default {
    name: 'field-config',
    props: [ 'config' ],
    data () {
        return {
            fieldConfig: []
        };
    },
    computed: {
        keys () {
            return this.fieldConfig.map(x => x.key);
        }
    },
    mounted () {
        this.init();
    },
    methods: {
        init () {
            if (!this.config) {
                this.fieldConfig = _.cloneDeep(FieldConfigDefault);
            } else {
                this.fieldConfig = _.cloneDeep(JSON.parse(this.config));
            }
        },
        confirm () {
            this.$emit('close');
            this.$emit('confirm', this.fieldConfig);
        }
    }
};
</script>

<style lang="scss">
.field-config {
    z-index: 99;
    position: absolute;
    top: 0;
    right: 0;
    padding: 15px;
    width: 60%;
    height: 100%;
    overflow-y: scroll;
    background: #f2f2f2;
}
</style>
