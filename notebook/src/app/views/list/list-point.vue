<template>
  <div class="nb-list-point nb-list">
      <div class="list">
        <dl>
            <dt class="hover-show-btns">
                {{rowData.title}}
                <div class="btns">
                    <el-button size="mini" @click="rowMod">编辑</el-button>
                    <el-button size="mini" @click="rowDel">删除</el-button>
                    <el-button size="mini" @click="rowAddChild" class="show">新增子条目/point</el-button>
                    <el-button size="mini" class="show"><router-link :to="{ name: 'Index' }">首页</router-link></el-button>
                </div>
            </dt>
            <dd>
                <template v-for="(point, index2) in listData">
                    <li class="hover-show-btns" :key="index2">
                        <router-link target="_blank" :to="{ name: 'ListBit', query: { pid:point.id, solid: $route.query.solid } }">
                            {{point.title}}
                        </router-link>
                        <div class="btns">
                            <el-button size="mini" @click="listDel(index2)">删除</el-button>
                            <el-button class="show" size="mini" @click="sortFirst(index2)">前置</el-button>
                            <el-button class="show" size="mini" @click="sortLast(index2)">后置</el-button>
                        </div>
                    </li>
                </template>
            </dd>
        </dl>
      </div>

        <!--row 编辑弹窗-->
        <dialog-edit
            v-if="rowEditVisible"
            :visible="rowEditVisible"
            action="mod"
            dataKey="line"
            :data="rowData"
            @close="rowEditVisible = false"
            @confirm="rowEditConfirm"
        ></dialog-edit>

        <!--row 增加子条目弹窗-->
        <dialog-edit
            v-if="rowChildEditVisible"
            :visible="rowChildEditVisible"
            action="add"
            dataKey="point"
            :data="rowData"
            @close="rowChildEditVisible = false"
            @confirm="rowChildEditConfirm"
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
            rowChildEditVisible: false, // row 添加子条目的弹窗
            listEditVisible: false, // list 编辑弹窗
            listChildEditVisible: false // list 添加子条目的弹窗
        }
    },
    mounted () {
        this.getData();
    },
    methods: {
        getData () {
            this.$api.Line.row(this.$route.query.pid).then(res => {
                this.rowData = res;
                this.rowData.plane = res.plane.id;
                this.getSubList();
            });
        },
        getSubList () {
            this.$api.Point.list(this.rowData.id).then(res => {
                this.listData = res;
                this.listData.map((x, i) => {
                    this.listData[i]['line'] = this.rowData.id;
                });
            });
        },
        rowDel () {
            if (this.rowData.points.length > 0) {
                this.$message.warning('请删除下属所有子条目后再执行删除');
                return;
            }
            let note = this.rowDelNote || '确定要删除此条目吗？';
            this.$confirm(note).then(() => {
                let params = { ids: [this.rowData.id].join(',') };
                this.$api.Line.del(params).then(() => {
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
            this.$api.Line.edit(params).then(() => {
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
            params.line = this.$route.query.pid;
            this.$api.Point.edit(params).then(() => {
                this.$message.success('新增子条目成功');
                this.getData();
            });
        },
        listDel (index) {
            if (this.listSubKey && this.listData[index][this.listSubKey].length > 0) {
                this.$message.warning('请删除下属所有子条目后再执行删除');
                return;
            }
            let note = '删除此条目将会一并删除其下属的所有颗粒，确定要删除吗？' || '确定要删除此条目吗？';
            this.$confirm(note).then(() => {
                let params = { ids: [this.listData[index].id].join(',') };
                this.$api.Point.del(params).then(() => {
                    this.$message.success('删除成功');
                    this.listData.splice(index, 1);
                });
            }).catch(() => {});
        },
        // 前置
        sortFirst (index) {
            let params = this.listData[index];
            params.sortPos = 'first';
            this.$api.Point.sort(params).then(res => {
                this.$message.success('前置成功');
                this.getData();
            });
        },
        // 后置
        sortLast (index) {
            let params = this.listData[index];
            params.sortPos = 'last';
            this.$api.Point.sort(params).then(res => {
                this.$message.success('后置成功');
                this.getData();
            });
        }
    }
}
</script>

<style lang="scss">

</style>
