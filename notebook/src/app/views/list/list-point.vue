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
                <template v-for="(point, index2) in rowData.points">
                    <li class="hover-show-btns" :key="index2">
                        <router-link target="_blank" :to="{ name: 'ListBit', query: { pid:point.id, solid: $route.query.solid } }">
                            {{point.title}}
                        </router-link>
                        <div class="btns">
                            <el-button size="mini" @click="listDel(index2)">删除</el-button>
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
            rowApi: this.$api.Line,
            rowSubKey: 'points',

            // 添加子条目
            rowChildApi: this.$api.Point,
            rowChildTopKey: 'line',

            listApi: this.$api.Point,
            listDelNote: '删除此条目将会一并删除其下属的所有颗粒，确定要删除吗？',
        }
    },
    mounted () {
        this.getData();
    },
    methods: {
        getData () {
            this.rowApi.row(this.$route.query.pid).then(res => {
                this.rowData = res;
                this.rowData.plane = res.plane.id;
                this.listData = res[this.rowSubKey];
            });
        }
    }
}
</script>

<style lang="scss">

</style>
