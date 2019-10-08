<template>
    <div class="nb-log-article nb-list">
        <dl>
            <dt class="hover-show-btns">
                <p style="height: 40px;">{{rowData.title}}</p>
                <div class="btns">
                    <el-button size="mini" @click="rowMod">编辑</el-button>
                    <el-button size="mini" @click="rowDel">删除</el-button>
                </div>
            </dt>
            <div class="content">
                <div v-html="rowData.content"></div>
            </div>
        </dl>

        <!--row 编辑弹窗-->
        <dialog-edit
            v-if="rowEditVisible"
            :visible="rowEditVisible"
            action="mod"
            dataKey="log-article"
            :data="rowData"
            @close="rowEditVisible = false"
            @confirm="rowEditConfirm"
        ></dialog-edit>

    </div>
</template>

<script>
import { crudRow } from '@common/mixins/crud-row';
import DialogEdit from '../_components/dialog-edit';
export default {
    name: 'nb-log-article',
    components: {
        DialogEdit
    },
    mixins: [ crudRow ],
    data () {
        return {
            rowApi: this.$api.LogArticle,
            rowSubKey: 'articles'
        }
    },
    mounted () {
        this.getData();
    },
    methods: {
        getData () {
            this.rowApi.row(this.$route.query.id).then(res => {
                this.rowData = res;
                // this.rowData.topic = res.topic.id;
            });
        }
    }
}
</script>

<style lang="scss">
@import '../_common';
.nb-log-article {
    .content {
        padding: 15px;
        background: #eee;
    }
}
</style>