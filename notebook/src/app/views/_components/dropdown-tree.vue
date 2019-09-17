<docs>
# 下拉多项勾选分类树
* 点线面级联分类树
</docs>

<template>
    <div class="dropdown-tree">
        <el-popover
            ref="popover"
            placement="bottom"
            width="400"
            node-key="id"
            trigger="click">
            <el-tree
                v-if="treeVisible"
                ref="tree"
                :props="props"
                :load="loadNode"
                lazy
                show-checkbox>
            </el-tree>
            <el-button size="mini" @click="confirm">确定</el-button>
            <slot name="reference" slot="reference"></slot>
        </el-popover>
    </div>
</template>
<script>
export default {
    name: 'dropdown-tree',
    props: [ 'dimension' ],
    data() {
        return {
            props: {
                label: 'title',
                children: 'zones',
                isLeaf: 'leaf'
            },
            treeNodes: null,
            treeVisible: true
        };
    },
    watch: {
        dimension () {
            this.treeVisible = false;
            this.$nextTick(() => {
                this.treeVisible = true;
            });
        }
    },
    methods: {
        async loadNode(node, resolve) {
            this.treeNodes = _.cloneDeep(node);
            if (node.level === 0) {
                let plane = await this.getPlane();
                return resolve(plane);
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
        getPlane () {
            return new Promise(resolve => {
                this.$api.Plane.list().then(res => {
                    let list = res;
                    list.map(x => {
                        x.top = true;
                    });
                    resolve(list);
                });
            });
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
        // 获取被选的分类id
        getSelectedCats () {
            let checkedNodes = this.$refs.tree.getCheckedNodes();
            let planes = checkedNodes.filter(x => x.top);
            let lines = checkedNodes.filter(x => x.plane !== undefined);
            let points = checkedNodes.filter(x => x.line !== undefined);
            points = points.filter(x => lines.map(y => y.id).indexOf(x.line) < 0);
            lines = lines.filter(x => planes.map(y => y.id).indexOf(x.plane) < 0);
            return {
                planes: planes.map(x => x.id),
                lines: lines.map(x => x.id),
                points: points.map(x => x.id)
            };
        },
        confirm () {
            let selectedCats = this.getSelectedCats();
            this.$refs.popover.doClose();
            this.$emit('update', JSON.stringify(selectedCats));
        }
    }
}
</script>