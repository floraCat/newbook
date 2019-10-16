<template>
    <div class="nb-list-line nb-list">
        <div class="header">
            <h1 v-if="$route.query.solid === '1'">技术</h1>
            <h1 v-if="$route.query.solid === '2'">生活</h1>
            <div class="btns">
                <el-button size="mini" @click="showSortBtn = !showSortBtn">显隐排序操作按键</el-button>
                <el-button size="mini" @click="listAdd">新增plane</el-button>
                <el-button size="mini"><router-link :to="{ name: 'Index' }">首页</router-link></el-button>
            </div>
        </div>
        <div class="list">
            <dl v-for="(plane, index) in listData" :key="index">
                <dt class="hover-show-btns">
                    {{plane.title}}
                    <div class="btns">
                        <el-button size="mini" @click="listMod(index)">编辑</el-button>
                        <el-button size="mini" @click="listDel(index)">删除</el-button>
                        <el-button size="mini" @click="listAddChild(index)">添加子条目/line</el-button>
                    </div>
                </dt>
                <dd>
                <template v-for="(line, index2) in plane.lines">
                    <p class="item" :class="{ showBtn: showSortBtn }" :key="index2" @click="viewPointList(line.id)">
                        <el-tag>
                            {{line.title}}
                        </el-tag>
                        <a class="sort-first" href="javascript:;" @click="sortFirst(index, index2)">前置</a>
                        <a class="sort-last" href="javascript:;" @click="sortLast(index, index2)">后置</a>
                    </p>
                </template>
                </dd>
            </dl>
        </div>

        <!--list 编辑弹窗-->
        <dialog-edit
            v-if="listEditVisible"
            :visible="listEditVisible"
            :action="listEditAction"
            dataKey="plane"
            :data="listData[currentIndex]"
            @close="listEditVisible = false"
            @confirm="listEditConfirm"
        ></dialog-edit>

        <!--list 增加子条目弹窗-->
        <dialog-edit
            v-if="listChildEditVisible"
            :visible="listChildEditVisible"
            action="add"
            dataKey="line"
            :data="listData[currentIndex]"
            @close="listChildEditVisible = false"
            @confirm="listChildEditConfirm"
        ></dialog-edit>
    </div>
</template>

<script>
import DialogEdit from '../_components/dialog-edit';
export default {
    name: 'nb-list-line',
    components: {
        DialogEdit
    },
    data () {
        return {
            listData: [],
            currentIndex: null,
            listEditAction: 'add',

            showSortBtn: false,

            listEditVisible: false, // list 编辑弹窗
            listChildEditVisible: false // list 添加子条目的弹窗
        }
    },
    computed: {
        solid () {
            return this.$route.query.solid;
        }
    },
    mounted () {
        this.getList();
    },
    methods: {
        getList () {
            this.$api.Plane.list({ solid: this.solid}).then(async res => {
                this.listData = res;
                for (let i = 0; i < this.listData.length; i ++) {
                    await this.getSubList(i);
                }
            });
        },
        getSubList (index) {
            let topId = this.listData[index].id;
            this.$api.Line.list(topId).then(res => {
                res.map((x, i) => {
                    res[i].plane = topId;
                });
                let item = _.cloneDeep(this.listData[index]);
                item.lines = res;
                this.$set(this.listData, index, item);
            });
        },
        listDel (index) {
            if (this.listData[index].lines.length > 0) {
                this.$message.warning('请删除下属所有子条目后再执行删除');
                return;
            }
            let note = this.listDelNote || '确定要删除此条目吗？';
            this.$confirm(note).then(() => {
                let params = { ids: [this.listData[index].id].join(',') };
                this.$api.Plane.del(params).then(() => {
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
        viewPointList (pid) {
            const { href } = this.$router.resolve({
                name: 'ListPoint',
                query: { pid:pid, solid: this.$route.query.solid }
            });
            window.open(href, '_blank');
        },
        // 编辑完成后回调
        listEditConfirm (params) {
            this.$api.Plane.edit(params).then(() => {
                if (this.listEditAction === 'add') {
                    this.$message.success('新增成功');
                    this.getList();
                }
                if (this.listEditAction === 'mod') {
                    this.$message.success('修改成功');
                    this.getList();
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
            params.plane = this.listData[this.currentIndex].id; 
            this.$api.Line.edit(params).then(() => {
                this.$message.success('新增子条目成功');
                this.getList();
            });
        },
        // 前置
        sortFirst (index, index2) {
            let params = this.listData[index].lines[index2];
            params.sortPos = 'first';
            this.$api.Line.sort(params).then(res => {
                this.$message.success('前置成功');
                this.getSubList(index);
            });
        },
        // 后置
        sortLast (index, index2) {
            let params = this.listData[index].lines[index2];
            params.sortPos = 'last';
            this.$api.Line.sort(params).then(res => {
                this.$message.success('后置成功');
                this.getSubList(index);
            });
        },
    }
}
</script>

<style lang="scss">
@import '../_common';
.nb-list-line {
    .item {
        float: left;
        margin: 0 10px 10px 0;
        position: relative;
        cursor: pointer;
        > a {
            display: none;
            position: absolute;
            right: -10px;
            height: 20px;
            line-height: 18px;
            padding: 0 3px;
            background: $--primary-color;
            color: #fff;
            border-radius: 4px;
            transform: scale(.8);
        }
        .sort-first {
        top: -10px;
        }
        .sort-last {
            bottom: -10px;
        }
        &.showBtn {
            color: #999;
            .sort-first {
                display: block;
            }
            .sort-last {
                display: block;
            }
        }
    }
}
</style>
