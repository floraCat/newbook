<template>
    <div class="nb-list-line">
        <el-button size="mini" @click="listAdd">新增plane</el-button>
        <dl v-for="(plane, index) in listData" :key="index">
            <dt>
            {{plane.title}}
            <el-button size="mini" @click="listMod(index)">编辑</el-button>
            <el-button size="mini" @click="listDel(index)">删除</el-button>
            <el-button size="mini" @click="listAddChild(index)">添加子条目/line</el-button>
            </dt>
            <dd>
            <template v-for="(line, index2) in plane.lines">
                <router-link :key="index2" :to="{ name: 'ListPoint', query: { pid:line.id } }">
                    <el-tag>{{line.title}}</el-tag>
                </router-link>
            </template>
            </dd>
        </dl>

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
            @close="listChildEditVisible = false"
            @confirm="listChildEditConfirm"
        ></dialog-edit>
    </div>
</template>

<script>
import { crudList } from '@common/mixins/crud-list';
import DialogEdit from './_components/dialog-edit';
export default {
    name: 'nb-list-line',
    components: {
        DialogEdit
    },
    mixins: [ crudList ],
    data () {
        return {
            listApi: this.$api.Plane,
            listSubKey: 'lines',

            // 添加子条目
            listChildApi: this.$api.Line,
            listChildTopKey: 'plane'
        }
    },
    mounted () {
        this.getList();
    },
    methods: {
        getList () {
            this.listApi.list().then(res => {
                this.listData = res;
            });
        },
        // 返回父级
        returnParent () {
            this.$router.push({ name: 'listPoint' });
        }
    }
}
</script>

<style lang="scss">

</style>
