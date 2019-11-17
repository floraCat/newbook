<template>
    <el-dialog
        class="nb-edit-dialog nb-dialog"
        :title="title"
        :visible.sync="dialogVisible">
        <el-form :model="editRow" label-width="100px">
            <template v-for="(field, index) in fieldConfig">
                <form-ctrl
                    :key="index"
                    v-if="!(field.key === 'class' && editRow.topic !== 4) /*日志的随笔才有类别class下拉框*/"
                    :fieldConfig="field"
                    :data="editRow"
                    :action="action"
                    :dataKey="dataKey"
                ></form-ctrl>
            </template>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>

        <!--point 可配置字段-->
        <el-button size="small"
            class="btn-field-setting"
            v-if="dataKey === 'point'"
            @click="fieldConfigVisible = true">
            下属颗粒字段配置
        </el-button>

        <!--下属颗粒字段配置 侧弹窗-->
        <field-setting
            v-if="fieldConfigVisible"
            :action="action"
            :setting="editRow.subFieldSetting"
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
    name: 'dialog-edit',
    props: {
        visible: { type: Boolean, default: false },
        action: { type: String, default: '' },
        data:  { type: Object, default () { return {}; } },
        dataKey: { type: String, default: '' }
    },
    components: {
        FormCtrl,
        FieldSetting
    },
    inject: [ 'FieldSettingMode1' ],
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
            // 新增时默认显示当前上级id
            let pid = this.getPid(this.dataKey);
            if (this.action === 'add') {
                if (pid === 'solid') {
                    this.editRow[pid] = _.cloneDeep(this.data)[pid];
                } else {
                    this.editRow[pid] = _.cloneDeep(this.data);
                }
            }
            // 日志显示当前分类
            if (this.dataKey === 'log') {
                this.editRow['topic'] = parseInt(this.$route.query.topic);
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
                this.fieldConfig = _.cloneDeep(PlaneFieldConfig);
                break;
            case 'line':
                this.rowDefault = this.getDefalutVals(LineFieldConfig);
                this.fieldConfig = _.cloneDeep(LineFieldConfig);
                break;
            case 'point':
                this.rowDefault = this.getDefalutVals(PointFieldConfig);
                this.fieldConfig = _.cloneDeep(PointFieldConfig);
                break;
            case 'bit':
                this.rowDefault = this.getDefalutVals(BitFieldConfig);
                this.fieldConfig = _.cloneDeep(BitFieldConfig);
                // 过滤掉不可配置的字段(bit的字段配置看point.subFieldSetting)
                let point = this.data.point ? this.data.point : this.data;
                let setting = point.subFieldSetting || this.FieldSettingMode1;
                let list = _.cloneDeep(this.fieldConfig);
                list = list.filter(x => x.key !== 'point'); // 保留point字段的可配置性
                list.map(x => {
                    let item = setting.find(y => y.key === x.key);
                    if (!item || (item && !item.isAble)) {
                        let index = this.fieldConfig.findIndex(z => z.key === x.key);
                        this.fieldConfig.splice(index, 1);
                    }
                });
                break;
            case 'log':
                this.rowDefault = this.getDefalutVals(LogArticleFieldConfig);
                this.fieldConfig = _.cloneDeep(LogArticleFieldConfig);
                let index = this.fieldConfig.findIndex(x => x.key === 'topic');
                if (index >= 0) {
                    let arr = [];
                    let topics = this.$store.state.logTopics;
                    if (topics.length > 0) {
                        topics.map(x => {
                            let obj = {};
                            obj.value = x.id;
                            obj.label = x.title;
                            arr.push(obj);
                        });
                    }
                    this.fieldConfig[index].formCtrl.opts = arr;
                }
                break;
            }
        },
        // 字段配置完后回调
        fieldConfigConfirm (returnData) {
            this.editRow.subFieldSetting = returnData;
        },
        close () {
            this.$emit('close');
        },
        confirm () {
            // point.subFieldSetting 特殊处理
            if (this.dataKey === 'point') {
                let setting = this.editRow.subFieldSetting;
                if (setting && setting[0] && setting[0].key) {
                    this.editRow.subFieldSetting = JSON.stringify(setting);
                }
            }
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
