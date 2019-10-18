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
                <template v-for="(bit, index2) in listData">
                    <section class="hover-show-btns" :key="index2">
                        <div v-if="bit.title" v-text="bit.title"></div>
                        <div v-if="!bit.title" v-html="bit.content"></div>
                        <div class="btns">
                            <el-button size="mini" @click="listMod(index2)">编辑</el-button>
                            <el-button size="mini" @click="listDel(index2)">删除</el-button>
                            <el-button size="mini" @click="unbind(index2)">解绑</el-button>
                            <el-button size="mini" @click="sortFirst(index2)">前置</el-button>
                            <el-button size="mini" @click="sortLast(index2)">后置</el-button>
                            <!--catalog-tree-->
                            <catalog-tree
                                class="fr"
                                v-if="catalogTreeVisible"
                                selectType="single"
                                dimension="bit"
                                @confirm="catalogTreeConfirm">
                                <el-button class="show" size="mini" slot="reference" @click="catalogTreeClick(index2)">转移</el-button>
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
import DialogEdit from '../_components/dialog-edit';
export default {
    name: 'nb-list-point',
    components: {
        DialogEdit
    },
    data () {
        return {
            rowData: {},

            listData: [],
            currentIndex: null,
            listEditAction: 'add',

            rowEditVisible: false, // row 编辑弹窗
            rowChildEditVisible: false, // row 添加子条目弹窗
            listEditVisible: false, // list 编辑
            listChildEditVisible: false, // list 添加子条目的弹窗
            catalogTreeVisible: false // 分类树弹窗
        }
    },
    mounted () {
        this.getData();
    },
    methods: {
        getData () {
            this.$api.Point.row(this.$route.query.pid).then(res => {
                this.rowData = res;
                this.rowData.line = res.line.id;
                this.getSubList();
            });
        },
        getSubList () {
            let params = {
                point: this.rowData.id
            };
            this.$api.Bit.list(params).then(res => {
                this.listData = res;
                this.listData.map((x, i) => {
                    this.listData[i]['point'] = this.rowData.id;
                    this.listData[i]['visible'] = false;
                });
            });
        },
        rowDel () {
            if (this.rowSubKey && this.rowData[this.rowSubKey].length > 0) {
                this.$message.warning('请删除下属所有子条目后再执行删除');
                return;
            }
            let note = '删除此条目将会一并删除其下属的所有颗粒，确定要删除吗？' || '确定要删除此条目吗？';
            this.$confirm(note).then(() => {
                let params = { ids: [this.rowData.id].join(',') };
                this.$api.Point.del(params).then(() => {
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
            this.$api.Point.edit(params).then(() => {
                this.$message.success('修改成功');
                this.$set(this.rowData, 'title', params.title);
            });
        },
        // 增加子条目
        rowAddChild () {
            this.rowChildEditVisible = true;
        },
        // 增加子条目后回调
        rowChildEditConfirm (params) {
            params.point = this.$route.query.pid;
            this.$api.Bit.edit(params).then(() => {
                this.$message.success('新增子条目成功');
                this.getData();
            });
        },
        listDel (index) {
            if (this.listSubKey && this.listData[index][this.listSubKey].length > 0) {
                this.$message.warning('请删除下属所有子条目后再执行删除');
                return;
            }
            let note = this.listDelNote || '确定要删除此条目吗？';
            this.$confirm(note).then(() => {
                let params = { ids: [this.listData[index].id].join(',') };
                this.$api.Bit.del(params).then(() => {
                    this.$message.success('删除成功');
                    this.listData.splice(index, 1);
                });
            }).catch(() => {});
        },
        listAdd () {
            this.currentIndex = 0; // 为了默认显示上级id
            this.listEditAction = 'add';
            this.listEditVisible = true;
        },
        listMod (index) {
            this.currentIndex = index;
            this.listEditAction = 'mod';
            this.listEditVisible = true;
        },
        // 编辑完成后回调
        listEditConfirm (params) {
            this.$api.Bit.edit(params).then(() => {
                if (this.listEditAction === 'add') {
                    this.$message.success('新增成功');
                    this.getSubList();
                }
                if (this.listEditAction === 'mod') {
                    this.$message.success('修改成功');
                    this.getSubList();
                }
            });
        },
        // 增加子条目
        listAddChild (index) {
            this.currentIndex = index;
            this.listChildEditVisible = true;
        },
        // 添加子条目后回调
        listChildEditConfirm (params) {
            params[this.listChildTopKey] = this.listData[this.currentIndex].id; 
            this.listChildApi.edit(params).then(() => {
                this.$message.success('新增子条目成功');
                this.getSubList();
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
        // 前置
        sortFirst (index) {
            let params = this.listData[index];
            params.sortPos = 'first';
            this.$api.Bit.sort(params).then(res => {
                this.$message.success('前置成功');
                this.getData();
            });
        },
        // 后置
        sortLast (index) {
            let params = this.listData[index];
            params.sortPos = 'last';
            this.$api.Bit.sort(params).then(res => {
                this.$message.success('后置成功');
                this.getData();
            });
        },
        // 点击分类下拉
        async catalogTreeClick (index) {
            if (this.$store.state.planes.length <= 0) {
                let planes = await this.getPlane();
                this.$store.commit('planes', planes);
            }
            this.catalogTreeVisible = true;
            this.currentIndex = index;
        },
        // 下拉分类前先加载所有plane
        getPlane () {
            return new Promise(resolve => {
                let params = {
                    solid: this.$route.query.solid
                };
                this.$api.Plane.list(params).then(res => {
                    let list = res;
                    list.map(x => {
                        x.top = true;
                        if (this.dimension === 'line') {
                            x.leaf = true;
                        }
                    });
                    resolve(list);
                });
            });
        },
        // 点选分类回调
        catalogTreeConfirm (catId) {
            let params = {};
            params = Object.assign(this.rowData.bits[this.currentIndex], { point: catId});
            this.$api.Bit.edit(params).then(res => {
                this.$message.success('转移成功');
                this.catalogTreeVisible = false;
                this.getData();
            });
        }
    }
}
</script>

<style lang="scss">

</style>
