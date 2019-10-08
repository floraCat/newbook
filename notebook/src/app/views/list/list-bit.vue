<template>
  <div class="nb-list-point nb-list">
      <div class="list">
        <dl>
            <dt class="hover-show-btns">
                {{rowData.title}}
                <div class="btns">
                    <el-button size="mini" @click="rowMod">编辑</el-button>
                    <el-button size="mini" @click="rowDel">删除</el-button>
                    <el-button size="mini" @click="rowAddChild" class="show">新增子条目/bit</el-button>
                    <el-button size="mini" class="show"><router-link :to="{ name: 'Index' }">首页</router-link></el-button>
                    <el-button size="mini" class="show">
                        <router-link :to="{ name: 'ToBit', query: { pid: rowData.id} }">颗粒拆分</router-link>
                    </el-button>
                </div>
            </dt>
            <dd>
                <template v-for="(bit, index2) in rowData.bits">
                    <section class="hover-show-btns" :key="index2">
                        <div v-if="bit.title" v-text="bit.title"></div>
                        <div v-if="!bit.title" v-html="bit.content"></div>
                        <div class="btns">
                            <el-button size="mini" @click="listMod(index2)">编辑</el-button>
                            <el-button size="mini" @click="listDel(index2)">删除</el-button>
                            <el-button size="mini" @click="unbind(index2)">解绑</el-button>
                            <!--catalog-tree-->
                            <catalog-tree
                                class="fr"
                                selectType="single"
                                dimension="bit"
                                @confirm="getCatalog">
                                <el-button class="show" size="mini" slot="reference" @click="bitsCurrentIndex = index2">转移</el-button>
                            </catalog-tree>
                        </div>
                    </section>
                </template>
            </dd>
            <div class="desc" style="background: #f8f8f8; margin-bottom: 8px;" v-html="rowData.description"></div>
            <div class="extend" style="background: #eee;" v-html="rowData.extend"></div>
        </dl>
      </div>

        <!--row 编辑弹窗-->
        <dialog-edit
            v-if="rowEditVisible"
            :visible="rowEditVisible"
            action="mod"
            dataKey="point"
            :data="rowData"
            @close="rowEditVisible = false"
            @confirm="rowEditConfirm"
        ></dialog-edit>

        <!--row 增加子条目弹窗-->
        <dialog-edit
            v-if="rowChildEditVisible"
            :visible="rowChildEditVisible"
            action="add"
            dataKey="bit"
            :data="rowData"
            @close="rowChildEditVisible = false"
            @confirm="rowChildEditConfirm"
        ></dialog-edit>

        <!--list 编辑弹窗-->
        <dialog-edit
            v-if="listEditVisible"
            :visible="listEditVisible"
            action="mod"
            dataKey="bit"
            :data="listData[currentIndex]"
            @close="listEditVisible = false"
            @confirm="listEditConfirm"
        ></dialog-edit>

  </div>
</template>

<script>
import { crudRow } from '@common/mixins/crud-row';
import { crudList } from '@common/mixins/crud-list';
import DialogEdit from '../_components/dialog-edit';
export default {
    name: 'nb-list-point',
    components: {
        DialogEdit
    },
    mixins: [ crudRow, crudList ],
    data () {
        return {
            rowApi: this.$api.Point,
            rowDelNote: '删除此条目将会一并删除其下属的所有颗粒，确定要删除吗？',

            // 添加子条目
            rowChildApi: this.$api.Bit,
            rowChildTopKey: 'point',

            listApi: this.$api.Bit,

            bitsCurrentIndex: null
        }
    },
    mounted () {
        this.getData();
    },
    methods: {
        getData () {
            this.rowApi.row(this.$route.query.pid).then(res => {
                this.rowData = res;
                this.rowData.line = res.line.id;
                this.listData = res.bits;
                this.listData.map((x, i) => {
                    this.listData[i]['point'] = res.id;
                });
            });
        },
        // 解绑
        unbind (index) {
            let rs = _.cloneDeep(this.listData[index]);
            rs.point = null;
            this.$api.Bit.edit(rs).then(res => {
                this.$message.success('解绑成功');
                this.listData.splice(index, 1);
            });
        },
        getCatalog (catId) {
            let params = {};
            params = Object.assign(this.rowData.bits[this.bitsCurrentIndex], { point: catId});
            this.$api.Bit.edit(params).then(res => {
                this.$message.success('转移成功');
                this.getData();
            });
        }
    }
}
</script>

<style lang="scss">

</style>
