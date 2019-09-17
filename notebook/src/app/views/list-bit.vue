<template>
  <div class="nb-list-point">
      <dl>
        <dt>
            {{rowData.title}}
            <el-button size="mini" @click="rowMod">编辑</el-button>
            <el-button size="mini" @click="rowDel">删除</el-button>
            <el-button size="mini" @click="rowAddChild">新增子条目/bit</el-button>
            <router-link :to="{ name: 'ToBit', query: { pid: rowData.id} }"> | 颗粒拆分</router-link>
        </dt>
        <dd>
          <template v-for="(bit, index2) in rowData.bits">
              <section :key="index2">
                <div v-html="bit.content"></div>
                <el-button size="mini" @click="listMod(index2)">编辑</el-button>
                <el-button size="mini" @click="listDel(index2)">删除</el-button>
              </section>
          </template>
          <hr />
          <hr />
        </dd>
      </dl>

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
import DialogEdit from './_components/dialog-edit';
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

            listApi: this.$api.Bit
        }
    },
    mounted () {
        this.getData();
    },
    methods: {
        getData () {
            this.rowApi.row(this.$route.query.pid).then(res => {
                this.rowData = res;
                this.listData = res.bits;
            });
        }
    }
}
</script>

<style lang="scss">

</style>
