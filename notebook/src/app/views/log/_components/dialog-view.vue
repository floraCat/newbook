<template>
    <el-dialog
        class="nb-view-dialog nb-dialog"
        title="查看详情"
        :visible.sync="dialogVisible">
        <router-link class="link" target="_blank" :to="{ name: 'LogArticle', query: { id: viewRow.id, topic: $route.query.topic } }">打开详情页</router-link>
        <ul>
            <li v-for="(field) in LogArticleFieldConfig" :key="field.key">
                <label>{{field.label}} :</label>
                <div class="content" v-html="viewRow[field.key]"></div>
            </li>
        </ul>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">关 闭</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { LogArticleFieldConfig } from '../../_components/_config';
export default {
    name: 'edit-plane',
    props: [ 'visible', 'data' ],
    data () {
        return {
            LogArticleFieldConfig,
            viewRow: {}
        };
    },
    computed: {
        dialogVisible: {
            get () { return this.visible; },
            set () { this.close(); }
        }
    },
    mounted () {
        this.init();
    },
    methods: {
        init () {
            this.viewRow = _.cloneDeep(this.data);
            this.viewRow['topic'] = parseInt(this.$route.query.topic);
        },
        close () {
            this.$emit('close');
        }
    }
};
</script>

<style lang="scss">
@import '../../_common';
.nb-view-dialog {
    .link {
        position: absolute;
        top: 12px;
        right: 60px;
    }
    li {
        position: relative;
        padding-left: 115px;
        height: 40px;
        line-height: 40px;
        margin-bottom: 10px;
        label {
            position: absolute;
            top: 0;
            left: 0;
            width: 100px;
            text-align: right;
        }
        .content {
            background: #f5f5f5;
            padding: 0 15px;
        }
    }
}
</style>
