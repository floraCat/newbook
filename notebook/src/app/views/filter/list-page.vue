<template>
    <div class="filter-list-page nb-list">

        <el-pagination
            @size-change="changePagesize"
            @current-change="changepage"
            :current-page="pageNum"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>

        <div class="list">
            <dl>
                <dd v-for="(item, index) in dataList" :key="index">
                    <section class="hover-show-btns">
                        <div class="btns">
                            <el-button size="mini" @click="editHandle(index)">编辑</el-button>
                            <!--catalog-tree-->
                            <catalog-tree
                                class="fr"
                                selectType="single"
                                :dimension="dimension"
                                @confirm="getCatalog">
                                <el-button size="mini" class="show" slot="reference" @click="currentIndex = index">转移</el-button>
                            </catalog-tree>
                        </div>
                        <template v-if="$route.query.dimension === 'bit'">
                            <h4 v-if="item.title">{{item.title}}</h4>
                            <div class="info2" style="background: #eee;">
                                <span>createdAt : {{item.createdAt}}</span> | 
                                <span>updatedAt : {{item.updatedAt}}</span>
                            </div>
                            <p>{{item.content}}</p>
                        </template>
                        <template v-else-if="$route.query.dimension === 'point'">
                            <h4>{{item.title}}</h4>
                            <div class="bits">
                                <span v-for="bit in item.bits" :key="bit.id">
                                    <template v-if="bit.title">{{bit.title}}</template>
                                    {{bit.content}}
                                </span>
                            </div>
                        </template>
                        <template v-else>
                            <h4 v-if="item.title">{{item.title}}</h4>
                            <div v-if="!item.title" v-html="item.content"></div>
                        </template>
                    </section>
                </dd>
            </dl>
        </div>

        <!--row 编辑弹窗-->
        <dialog-edit
            v-if="rowEditVisible"
            :visible="rowEditVisible"
            action="mod"
            :dataKey="params.dimension"
            :data="dataList[currentIndex]"
            @close="rowEditVisible = false"
            @confirm="rowEditConfirm"
        ></dialog-edit>

    </div>
</template>

<script>
import DialogEdit from '../_components/dialog-edit';
export default {
    name: 'filter-list-page',
    props: [ 'params' ],
    components: {
        DialogEdit
    },
    data () {
        return {
            pageSize: 20,
            pageNum: 1,
            total: 0,

            dataList: [],
            currentIndex: null,

            rowEditVisible: false
        };
    },
    computed: {
        dimension () {
            return this.params.dimension;
        },
        $API () {
            let rs = this.$api.Bit;
            if (this.dimension === 'point') {
                rs = this.$api.Point;
            }
            return rs;
        }
    },
    mounted () {
        this.init();
    },
    methods: {
        init () {
            this.getList();
        },
        getList () {
            let params = this.params;
            params.pageSize = this.pageSize;
            params.pageNum = this.pageNum;
            this.$api.Common.filter(params).then(res => {
                this.dataList = res.list;
                this.total = res.total;
            });
        },
        changePagesize (pageSize) {
            this.pageSize = pageSize;
            this.pageNum = 1;
            this.getList();
        },
        changepage (pageNum) {
            this.pageNum = pageNum;
            this.getList();
        },
        editHandle (index) {
            this.currentIndex = index;
            this.rowEditVisible = true;
        },
        // 编辑确认回调
        rowEditConfirm (returnData) {
            this.$API.edit(returnData).then(() => {
                this.$message.success('修改成功');
                let data = Object.assign(this.dataList[this.currentIndex], returnData);
                this.$set(this.dataList, this.currentIndex, data);
            });
        },
        getCatalog (catId) {
            let params = {};
            if (this.dimension === 'bit') {
                params = Object.assign(this.dataList[this.currentIndex], { point: catId});
            }
            if (this.dimension === 'point') {
                params = Object.assign(this.dataList[this.currentIndex], { line: catId});
            }
            this.$API.edit(params).then(res => {
                this.$message.success('转移成功');
                this.getList();
            });
        }
    }
}
</script>

<style lang="scss">
.filter-list-page {
    ul li {
        padding: 0 10px;
        background: #f6f6f6;
        margin-bottom: 10px;
        .bits {
            padding-left: 30px;
        }
    }
}
</style>

<style lang="scss">
@import '../_common';
</style>