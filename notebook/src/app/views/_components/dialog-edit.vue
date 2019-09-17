<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="600px">
        <el-form :model="editRow" label-width="100px">
            <el-form-item v-for="(field, index) in fields" :key="index" :label="field.label">
                <el-input v-model="editRow[field.key]"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {
    PlaneFields, LineFields, PointFields, BitFields,
    RowDefaultPlane, RowDefaultLine, RowDefaultPoint, RowDefaultBit
} from './_config';
export default {
    name: 'edit-plane',
    props: [ 'visible', 'action', 'data', 'dataKey' ],
    data() {
        return {
            planeFields: PlaneFields,
            editRow: {},
            rowDefault: {},
            fields: []
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
            // this.editRow.point = parseInt(this.$route.query.pid);
        },
        // 获取新增默认值
        getRowDefalut () {
            switch (this.dataKey) {
            case 'plane':
                this.rowDefault = RowDefaultPlane;
                this.fields = PlaneFields;
                break;
            case 'line':
                this.rowDefault = RowDefaultLine;
                this.fields = LineFields;
                break;
            case 'point':
                this.rowDefault = RowDefaultPoint;
                this.fields = PointFields;
                break;
            case 'bit':
                this.rowDefault = RowDefaultBit;
                this.fields = BitFields;
                break;
            }
        },
        close () {
            this.$emit('close');
        },
        confirm () {
            console.log(22222222, this.editRow);
            this.$emit('confirm', this.editRow);
            this.close();
        }
    }
};
</script>