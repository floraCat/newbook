<template>
    <div class="nb-fast-enter">
        <ol>
            <h3>颗粒</h3>
            <ul>
                <a v-for="(item, index) in bitList" :key="index">{{item.content}}</a>
            </ul>
        </ol>
    </div>
</template>

<script>
export default {
    name: 'nb-fast-enter',
    data () {
        return {
            bitList: [],
            pointList: [],
            logList: []
        };
    },
    mounted () {
        this.getRecomBits();
        this.getRecomPoints();
        this.getRecomLogs();
    },
    methods: {
        getRecomBits () {
            let params = { recom: true };
            this.$api.Bit.list(params).then(res => {
                this.bitList = res;
            });
        },
        getRecomPoints () {
            let params = { recom: true };
            this.$api.Point.list(params).then(res => {
                this.pointList = res;
            });
        },
        getRecomLogs () {
            let params = { recom: true };
            this.$api.LogArticle.list(params).then(res => {
                this.logList = res;
            });
        }
    }

}
</script>