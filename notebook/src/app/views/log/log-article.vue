<template>
    <div class="nb-log-article nb-list">
        <dl>
            <dt class="nb-btns">
                <p style="height: 40px;">{{rowData.title}}</p>
                <div class="btns">
                    <el-button size="mini" @click="rowMod">编辑</el-button>
                    <el-button size="mini" @click="rowDel">删除</el-button>
                    <el-button size="mini" @click="rowDel"><router-link :to="{ name: 'Index' }">首页</router-link></el-button>
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
            dataKey="log"
            :data="rowData"
            @close="rowEditVisible = false"
            @confirm="rowEditConfirm"
        ></dialog-edit>

    </div>
</template>

<script>
import DialogEdit from '../_components/dialog-edit';
export default {
    name: 'nb-log-article',
    components: {
        DialogEdit
    },
    data () {
        return {
            rowData: {},
            rowEditVisible: false, // row 编辑弹窗
            rowChildEditVisible: false // row 添加子条目的弹窗
        }
    },
    mounted () {
        this.getData();
    },
    methods: {
        getData () {
            this.$api.LogArticle.row(this.$route.query.id).then(res => {
                this.rowData = res;
            });
        },
        rowDel () {
            if (this.rowData.articles.length > 0) {
                this.$message.warning('请删除下属所有子条目后再执行删除');
                return;
            }
            let note = this.rowDelNote || '确定要删除此条目吗？';
            this.$confirm(note).then(() => {
                let params = { ids: [this.rowData.id].join(',') };
                this.$api.LogArticle.del(params).then(() => {
                    this.$message.success('删除成功，默认返回上一页');
                    setTimeout(() => {
                        this.$router.go(-1);
                    }, 1000);
                });
            }).catch(() => {});
        },
        rowMod () {
            this.rowEditVisible = true;
        },
        // 编辑完成后回调
        rowEditConfirm (params) {
            this.$api.LogArticle.edit(params).then(() => {
                this.$message.success('修改成功');
                this.getData();
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