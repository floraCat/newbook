<template>
    <el-dialog
        class="nb-edit-dialog nb-dialog"
        :title="title"
        :visible.sync="dialogVisible">
        <el-form :model="editRow" label-width="100px">
            <template v-for="(field, index) in fieldConfig">
                <form-ctrl
                    v-if="!(field.key === 'class' && editRow.topic !== 4)"
                    :key="index"
                    :fieldConfig="field"
                    :data="editRow"
                    :action="action"
                ></form-ctrl>
            </template>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { FieldConfig } from './_config';
import FormCtrl from '../../_components/form-ctrl';
export default {
    name: 'edit-plane',
    props: [ 'visible', 'action', 'data' ],
    components: {
        FormCtrl
    },
    data () {
        return {
            editRow: {},
            fieldConfig: FieldConfig
        };
    },
    computed: {
        dialogVisible: {
            get () { return this.visible; },
            set () { this.close(); }
        },
        title () {
            let rs = '新增';
            if (this.action === 'mod') { rs = '修改'; }
            return rs;
        }
    },
    mounted () {
        this.init();
    },
    methods: {
        init () {
            if (this.action === 'mod') {
                this.editRow = _.cloneDeep(this.data);
            } else {
                let rowDefault = this._getDefalutVals(FieldConfig);
                this.editRow = _.cloneDeep(rowDefault);
            }
            this.editRow['topic'] = parseInt(this.$route.query.topic);
        },
        _getDefalutVals (configs) {
            let obj = {};
            configs.map(x => {
                obj[x.key] = x.defVal;
            });
            return obj;
        },
        close () {
            this.$emit('close');
        },
        confirm () {
            this.$emit('confirm', this.editRow);
            this.close();
        }
    }
};
</script>

<style lang="scss">
@import '../../_common';
.btn-field-setting {
    position: absolute;
    top: 7px;
    right: 45px;
}
</style>
