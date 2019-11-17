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

        <el-button style="position: absolute; top: 10px; right: 10px;" size="mini"><router-link :to="{ name: 'Index' }">首页</router-link></el-button>

        <div class="list">
            <dl>
                <dd v-for="(item, index) in dataList" :key="index">
                    <section class="nb-btns">
                        <div class="btns">
                            <el-button size="mini" @click="editHandle(index)">编辑</el-button>
                            <el-button size="mini" @click="delHandle(index)">删除</el-button>
                            <!--catalog-tree-->
                            <catalog-tree
                                class="fr"
                                :visible="catalogTreeVisible"
                                selectType="single"
                                :dimension="dimension"
                                @confirm="catalogTreeConfirm">
                                <el-button size="mini" slot="reference" @click="catalogTreeClick(index)">转移</el-button>
                            </catalog-tree>
                        </div>
                        <!--point 时展示 bit列表-->
                        <template v-if="$route.query.dimension === 'point'">
                            <h4 v-if="item.isShowObj.title">{{item.title}}</h4>
                            <div class="bits">
                                <span v-for="bit in item.bits" :key="bit.id">
                                    <template v-if="bit.title">{{bit.title}}</template>
                                    <div v-html="bit.content"></div>
                                </span>
                            </div>
                        </template>
                        <!--其他 展示 content-->
                        <template v-else>
                            <h4 v-if="item.isShowObj.title">{{item.title}}</h4>
                            <div class="info2" style="background: #eee;">
                                <span>createdAt : {{item.createdAt}}</span> | 
                                <span>updatedAt : {{item.updatedAt}}</span> | 
                                <span>point : {{item.point && item.point.title}}</span>
                            </div>
                            <div v-html="item.content"></div>
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
            :dataKey="params.dimension || 'log'"
            :data="dataList[currentIndex]"
            @close="rowEditVisible = false"
            @confirm="rowEditConfirm"
        ></dialog-edit>

    </div>
</template>

<script>
import DialogEdit from '../_components/dialog-edit';
import { GetPlane, MapGetShowObj } from '../_methods';
export default {
    name: 'filter-list-page',
    props: [ 'params' ],
    components: {
        DialogEdit
    },
    inject: [ 'FieldSettingMode1' ],
    data () {
        return {
            pageSize: 20,
            pageNum: 1,
            total: 0,

            dataList: [],
            currentIndex: null,

            rowEditVisible: false,
            catalogTreeVisible: false
        };
    },
    computed: {
        dimension () {
            return this.params.dimension;
        },
        $API () {
            let rs = this.$api.LogArticle;
            if (this.dimension === 'bit') {
                rs = this.$api.Bit;
            }
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
                this.dataList.map((x, i) => {
                    if (x.point && x.point.subFieldSetting) {
                        this.dataList[i].point.subFieldSetting = JSON.parse(x.point.subFieldSetting);
                    }
                });
                this.dataList = MapGetShowObj(this.dataList, this.FieldSettingMode1);
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
        delHandle (index) {
            this.$confirm('确定要删除此条目吗？').then(() => {
                let params = { ids: [this.dataList[index].id].join(',') };
                this.$API.del(params).then(() => {
                    this.$message.success('删除成功');
                    this.dataList.splice(index, 1);
                });
            }).catch(() => {});
        },
        editHandle (index) {
            this.currentIndex = index;
            this.rowEditVisible = true;
        },
        // 点击分类下拉
        async catalogTreeClick (index) {
            if (this.$store.state.planes.length <= 0) {
                // 下拉分类前先加载所有plane(如放在下拉分类组件内加载列表会多次请求)
                let planes = await GetPlane(this);
                this.$store.commit('planes', planes);
            }
            this.catalogTreeVisible = true;
            this.currentIndex = index;
        },
        // 点选分类回调
        catalogTreeConfirm (catId) {
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
        },
        // 编辑确认回调
        rowEditConfirm (returnData) {
            this.$API.edit(returnData).then(() => {
                this.$message.success('修改成功');
                let data = Object.assign(this.dataList[this.currentIndex], returnData);
                this.$set(this.dataList, this.currentIndex, data);
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