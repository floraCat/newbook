<template>
    <div class="nb-filter-list">
        <router-link :to="{ name: 'FilterSetting' }">筛选设置</router-link>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <ul>
            <li v-for="(item, index) in dataList" :key="index">
                <h4>{{item.title}}</h4>
                <p>{{item.content}}</p>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'nb-filter-list',
    data () {
        return {
            pageSize: 10,
            pageNum: 1,
            total: 0,

            dataList: []
        };
    },
    mounted () {
        this.init();
    },
    methods: {
        init () {
            this.getList();
        },
        getList () {
            let params = this.$route.query;
            params.pageSize = this.pageSize;
            params.pageNum = this.pageNum;
            this.$api.Bit.filter(this.$route.query).then(res => {
                this.dataList = res;
            });
        },
        handleSizeChange () {},
        handleCurrentChange () {}
    }
}
</script>

<style lang="scss">

</style>