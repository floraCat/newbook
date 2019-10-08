<template>
    <el-dialog
        class="nb-edit-dialog"
        :title="title"
        :visible.sync="dialogVisible">
        <el-form :model="editRow" label-width="100px">
            <form-ctrl v-for="(field, index) in fieldConfig"
                :key="index"
                :fieldConfig="field"
                :data="editRow"
                :action="action"
                :dataKey="dataKey"
            ></form-ctrl>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
        <el-button size="small"
            class="btn-field-setting"
            v-if="dataKey === 'point' || dataKey === 'bit'"
            @click="fieldConfigVisible = true">
            字段配置
        </el-button>
        <field-setting
            v-if="fieldConfigVisible"
            :config="editRow.config"
            @close="fieldConfigVisible = false"
            @confirm="fieldConfigConfirm">
        </field-setting>
    </el-dialog>
</template>

<script>
import {
    PlaneFieldConfig, LineFieldConfig, PointFieldConfig, BitFieldConfig,
    LogArticleFieldConfig
} from './_config';
import FormCtrl from './form-ctrl';
import FieldSetting from './field-setting.vue';
export default {
    name: 'edit-plane',
    props: [ 'visible', 'action', 'data', 'dataKey' ],
    components: {
        FormCtrl,
        FieldSetting
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
            if (this.data) {
                // 无论新增还是编辑默认显示当前上级id
                let pid = this.getPid(this.dataKey);
                if (isNaN(this.data[pid])) {
                    if (pid === 'solid') {
                        this.editRow[pid] = _.cloneDeep(this.data)[pid];
                    } else {
                        this.editRow[pid] = _.cloneDeep(this.data).id;
                    }
                }
            }
        },
        getPid (key) {
            let rs = null;
            switch (key) {
                case 'plane':
                    rs = 'solid';
                    break;
                case 'line':
                    rs = 'plane';
                    break;
                case 'point':
                    rs = 'line';
                    break;
                case 'bit':
                    rs = 'point';
                    break;
            };
            return rs;
        },
        getDefalutVals (configs) {
            let obj = {};
            configs.map(x => {
                obj[x.key] = x.defVal;
            });
            return obj;
        },
        // 获取新增默认值
        getRowDefalut () {
            switch (this.dataKey) {
            case 'plane':
                this.rowDefault = this.getDefalutVals(PlaneFieldConfig);
                this.fieldConfig = PlaneFieldConfig;
                break;
            case 'line':
                this.rowDefault = this.getDefalutVals(LineFieldConfig);;
                this.fieldConfig = LineFieldConfig;
                break;
            case 'point':
                this.rowDefault = this.getDefalutVals(PointFieldConfig);;
                this.fieldConfig = PointFieldConfig;
                break;
            case 'bit':
                this.rowDefault = this.getDefalutVals(BitFieldConfig);;
                this.fieldConfig = BitFieldConfig;
                break;
            case 'log-article':
                this.rowDefault = this.getDefalutVals(LogArticleFieldConfig);;
                this.fieldConfig = LogArticleFieldConfig;
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
.nb-edit-dialog {
    .el-dialog {
        position: absolute;
        top: 8px;
        left: 8px;
        right: 8px;
        bottom: 8px;
        margin: 0!important;
        width: auto;
    }
    .el-dialog__header {
        padding: 10px;
        text-align: center;
        border-bottom: #ddd 1px solid;
    }
    .el-dialog__headerbtn {
        top: 10px;
        right: 15px;
    }
    .el-dialog__body {
        height: calc(100% - 120px);
        padding: 30px 40px 20px 10px;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    .el-dialog__footer {
        position: absolute;
        bottom: 0;
        left: 0;
        width:100%;
        text-align: right;
        padding: 10px;
        border-top: #ddd 1px solid;
    }
}
.btn-field-setting {
    position: absolute;
    top: 7px;
    right: 45px;
}
</style>
