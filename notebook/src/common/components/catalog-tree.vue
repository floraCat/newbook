<docs>
# 下拉多项勾选分类树
* 点线面级联分类树
* 父组件需添加触发控件如：<button slot="reference">点击选取分类</button>
</docs>

<template>
    <div class="catalog-tree">
        <el-popover
            ref="popover"
            placement="bottom"
            width="400"
            node-key="id"
            trigger="click">
            <div class="catalog-tree-ctrl-input">
                <el-input size="mini" v-model="catId" placeholder="可输入分类id转移" />
                <el-button size="mini" @click="confirmInput">确定</el-button>
            </div>
            <el-checkbox v-if="selectType === 'multi'" v-model="isNull">空</el-checkbox>
            <el-tree
                v-if="visible"
                class="catalog-tree-ctrl"
                ref="tree"
                :props="treeProps"
                :load="loadNode"
                lazy
                @node-click="nodeClickHandle"
                :show-checkbox="selectType === 'multi'">
            </el-tree>
            <el-button size="mini" @click="confirm" v-if="selectType === 'multi'">确定</el-button>
            <slot name="reference" slot="reference"></slot>
        </el-popover>
    </div>
</template>
<script>
export default {
    name: 'catalog-tree',
    props: [ 'dimension', 'selectType', 'visible' ], // selectType: single | multi (单选or多选)
    data() {
        return {
            catId: null,
            treeProps: {
                label: 'title',
                children: 'zones',
                isLeaf: 'leaf'
            },
            isNull: false
        };
    },
    computed: {
        planes () {
            return this.$store.state.planes;
        }
    },
    methods: {
        // 每点击一级加载其下一级所有条目
        async loadNode(node, resolve) {
            if (node.level === 0) {
                return resolve(this.planes);
            }
            if (node.level === 1) {
                let line = await this.getLine(node.data.id);
                return resolve(line);
            }
            if (node.level === 2) {
                let point = await this.getPoint(node.data.id);
                return resolve(point);
            }
        },
        getLine (pid) {
            return new Promise(resolve => {
                this.$api.Plane.row(pid).then(res => {
                    let list = res.lines;
                    list.map(x => {
                        x.plane = pid;
                        if (this.dimension === 'point') {
                            x.leaf = true;
                        }
                    });
                    resolve(list);
                });
            });
        },
        getPoint (pid) {
            return new Promise(resolve => {
                this.$api.Line.row(pid).then(res => {
                    let list = res.points;
                    list.map(x => {
                        x.line = pid;
                        x.leaf = true;
                    });
                    resolve(list);
                });
            });
        },
        // 单选时点击最后一级即返回结果
        nodeClickHandle (data) {
            if (this.selectType === 'single') {
                if (data.leaf) {
                    this.$refs.popover.doClose();
                    this.$emit('confirm', data);
                }
            }
        },
        // 获取被选的分类id（用于多选）
        getSelectedCats () {
            let checkedNodes = this.$refs.tree.getCheckedNodes();

            let planes = checkedNodes.filter(x => x.top);

            let lines = checkedNodes.filter(x => x.plane !== undefined);
            lines = lines.filter(x => planes.map(y => y.id).indexOf(x.plane) < 0);

            let points = checkedNodes.filter(x => x.line !== undefined);
            points = points.filter(x => lines.map(y => y.id).indexOf(x.line) < 0);
            
            return {
                isNull: this.isNull,
                planes: planes.map(x => x.id),
                lines: lines.map(x => x.id),
                points: points.map(x => x.id)
            };
        },
        // 点击 input 后的确定
        confirmInput () {
            if (this.catId !== null || this.catId !== '') {
                this.$refs.popover.doClose();
                this.$emit('confirm', this.catId);
            } else {
                this.$message.warning('还没有填写要转移的分类id');
            }
        },
        // 多选 确定
        confirm () {
            let selectedCats = this.getSelectedCats();
            this.$refs.popover.doClose();
            this.$emit('confirm', JSON.stringify(selectedCats));
        }
    }
}
</script>

<style lang="scss">
.catalog-tree-ctrl {
    max-height: 300px;
    padding: 10px;
    margin-bottom: 10px;
    overflow-y: scroll;
    background: #f2f2f2;
    &-input {
        overflow: hidden;
        margin-bottom: 10px;
        .el-input {
            float: left;
            width: 300px;
        }
        .el-button {
            float: right;
        }
    }
}
</style>