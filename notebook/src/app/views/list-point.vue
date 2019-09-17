<template>
  <div class="nb-list-point">
      <dl>
        <dt>
            {{rowData.title}}
            <el-button size="mini" @click="rowMod">编辑</el-button>
            <el-button size="mini" @click="rowDel">删除</el-button>
            <el-button size="mini" @click="rowAddChild">新增子条目/point</el-button>
        </dt>
        <dd>
          <template v-for="(point, index2) in rowData.points">
              <p :key="index2">
                <router-link :to="{ name: 'ListBit', query: { pid:point.id } }">
                    {{point.title}}
                </router-link>
                <el-button size="mini" @click="listDel(index2)">删除</el-button>
              </p>
          </template>
        </dd>
      </dl>

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
            @close="rowChildEditVisible = false"
            @confirm="rowChildEditConfirm"
        ></dialog-edit>

  </div>
</template>

<script>
import { crudRow } from '@common/mixins/crud-row';
import { crudList } from '@common/mixins/crud-list';
import DialogEdit from './_components/dialog-edit';
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
                this.listData = res[this.rowSubKey];
            });
        }
    }
}
</script>

<style lang="scss">

</style>
