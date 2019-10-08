<template>
    <div class="nb-list-line nb-list">
        <div class="header">
            <h1 v-if="$route.query.solid === 1">技术</h1>
            <h1 v-if="$route.query.solid === 2">生活</h1>
            <div class="btns">
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
                    <router-link class="link" :key="index2" :to="{ name: 'ListPoint', query: { pid:line.id, solid: $route.query.solid } }">
                        <el-tag>{{line.title}}</el-tag>
                    </router-link>
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
import { crudList } from '@common/mixins/crud-list';
import DialogEdit from '../_components/dialog-edit';
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
            listChildTopKey: 'plane',
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
            this.listApi.list({ solid: this.solid}).then(res => {
                this.listData = res;
            });
        }
    }
}
</script>

<style lang="scss">
@import '../_common';
</style>
