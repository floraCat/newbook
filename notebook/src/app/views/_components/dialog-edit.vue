<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="800px">
        <el-form :model="editRow" label-width="100px">
            <form-ctrl-edit v-for="(field, index) in fieldConfig"
                :key="index"
                :fieldConfig="field"
                :data="editRow"
                :action="action"
                :dataKey="dataKey"
            ></form-ctrl-edit>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
        <el-button size="small" class="btn-field-config" @click="fieldConfigVisible = true">字段配置</el-button>
        <field-config
            v-if="fieldConfigVisible"
            :config="editRow.config"
            @close="fieldConfigVisible = false"
            @confirm="fieldConfigConfirm">
        </field-config>
    </el-dialog>
</template>

<script>
import {
    PlaneFieldConfig, LineFieldConfig, PointFieldConfig, BitFieldConfig,
    RowDefaultPlane, RowDefaultLine, RowDefaultPoint, RowDefaultBit
} from './_config';
import FormCtrlEdit from './form-ctrl-edit';
import FieldConfig from './field-config.vue';
export default {
    name: 'edit-plane',
    props: [ 'visible', 'action', 'data', 'dataKey' ],
    components: {
        FormCtrlEdit,
        FieldConfig
    },
    data () {
        return {
            editRow: {},
            rowDefault: {},
            fieldConfig: [],
            fieldConfigVisible: false
        };
    },
    computed: {
        dialogVisible: {
            get () { return this.visible; },
            set () { this.close(); }
        },
        title () {
            return this.action === 'mod' ? '修改' : '新增';
        }
    },
    mounted () {
        this.init();
    },
    methods: {
        init () {
            this.getRowDefalut();
            if (this.action === 'mod') {
                this.editRow = _.cloneDeep(this.data);
            } else {
                this.editRow = _.cloneDeep(this.rowDefault);
            }
        },
        // 获取新增默认值
        getRowDefalut () {
            switch (this.dataKey) {
            case 'plane':
                this.rowDefault = RowDefaultPlane;
                this.fieldConfig = PlaneFieldConfig;
                break;
            case 'line':
                this.rowDefault = RowDefaultLine;
                this.fieldConfig = LineFieldConfig;
                break;
            case 'point':
                this.rowDefault = RowDefaultPoint;
                this.fieldConfig = PointFieldConfig;
                break;
            case 'bit':
                this.rowDefault = RowDefaultBit;
                this.fieldConfig = BitFieldConfig;
                break;
            }
        },
        // 字段配置完后回调
        fieldConfigConfirm (returnData) {
            this.editRow.config = JSON.stringify(returnData);
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
.btn-field-config {
    position: absolute;
    top: 18px;
    right: 45px;
}
</style>
