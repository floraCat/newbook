<docs>
# 推荐列表
</docs>

<template>
    <div class="nb-recom-page nb-list">
        <router-link style="position: absolute; top: 10px; right: 10px;" :to="{ name: 'Index' }">返回首页</router-link>
        <ol class="ol-log">
            <h3>日志</h3>
            <ul>
                <el-tag v-for="(item, index) in logList" :key="index" @click="viewLog(item.id)">{{item.title}}</el-tag>
            </ul>
        </ol>
        <ol class="ol-line">
            <h3>线</h3>
            <ul>
                <el-tag v-for="(item, index) in lineList" :key="index" @click="viewLine(item.id)">{{item.title}}</el-tag>
            </ul>
        </ol>
        <ol class="ol-point">
            <h3>点</h3>
            <ul>
                <el-tag v-for="(item, index) in pointList" :key="index" @click="viewPoint(item.id)">{{item.title}}</el-tag>
            </ul>
        </ol>
        <ol class="ol-bit">
            <h3>颗粒</h3>
            <ul>
                <li v-for="(item, index) in bitList" :key="index">
                    <div v-html="item.content"></div>
                    <el-button size="mini" @click="viewBit(item.content)">查看详情</el-button>
                </li>
            </ul>
        </ol>
        <el-dialog
            title="查看详情"
            :visible.sync="dialogVisible"
            width="600px">
            <div class="body" v-html="dialogBody"></div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'nb-recom-page',
    data () {
        return {
            bitList: [],
            pointList: [],
            lineList: [],
            logList: [],
            
            dialogVisible: false,
            dialogBody: null
        };
    },
    mounted () {
        this.getRecomBits();
        this.getRecomPoints();
        this.getRecomLines();
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
        getRecomLines () {
            let params = { recom: true };
            this.$api.Line.list(params).then(res => {
                this.lineList = res;
            });
        },
        getRecomLogs () {
            let params = { recom: true };
            this.$api.LogArticle.list(params).then(res => {
                this.logList = res.list;
            });
        },
        viewBit (content) {
            this.dialogBody = content;
            this.dialogVisible = true;
        },
        viewPoint (id) {
            const {href} = this.$router.resolve({
                name: 'ListBit',
                query: {pid: id, solid: 1}
            });
            window.open(href, '_self');
        },
        viewLine (id) {
            const {href} = this.$router.resolve({
                name: 'ListPoint',
                query: {pid: id, solid: 1}
            });
            window.open(href, '_self');
        },
        viewLog (id) {
            const {href} = this.$router.resolve({
                name: 'LogArticle',
                query: {id: id}
            });
            window.open(href, '_self');
        },
    }

}
</script>

<style lang="scss" scoped>
.nb-recom-page {
    position: relative;
    padding: 20px 0;
    ol {
        margin-bottom: 20px;
        border-bottom: #ddd 1px solid;
        h3 {
            height:34px;
            line-height: 34px;
            border-bottom: #ddd 1px dashed;
            margin-bottom: 10px;
        }
        .el-tag {
            margin: 0 10px 10px 0;
        }
    }
    .ol-bit {
        li {
            position: relative;
            height: 80px;
            overflow-y: auto;
            background: #f8f8f8;
            margin-bottom: 10px;
            padding: 5px 10px;
        }
        .el-button {
            position: absolute;
            top: 10px;
            right: 10px;
        }
    }
    ::v-deep .el-dialog {
        .body {
            background: #eee;
            padding: 15px;
        }
    }
}

</style>