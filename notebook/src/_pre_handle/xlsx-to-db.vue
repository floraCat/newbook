<template>
    <ul class="xlsx-to-db">
        <p class="topic">数据转移功能界面：旧数据逐个数据表转移到新数据表中</p>
        <ol>
            <el-button @click="tansHandle('it/')">数据转移 - <span>技术</span></el-button>
            <el-button @click="tansHandle('life/')">数据转移 - <span>生活</span></el-button>
        </ol>
        <ol>
            <el-button @click="tansCardHandle('card/frontend/')">数据转移 - <span>卡片 - 前端</span></el-button>
            <el-button @click="tansCardHandle('card/english/')">数据转移 - <span>卡片 - 英语</span></el-button>
            <el-button @click="tansCardHandle('card/express/')">数据转移 - <span>卡片 - 文学</span></el-button>
            <el-button @click="tansCardHandle('card/pic/')">数据转移 - <span>卡片 - 图库</span></el-button>
            <el-button @click="tansCardHandle('card/place/')">数据转移 - <span>卡片 - 地区</span></el-button>
        </ol>
        <ol>
            <el-button @click="tansLogHandle('log/')">数据转移 - <span>日志</span></el-button>
        </ol>
    </ul>
</template>

<script>
export default {
    name: 'xlsx-to-db',
    data () {
        return {};
    },
    mounted () {},
    methods: {
        tansHandle (suf) {
            let url = `/nb/trans?suf=${suf}`;
            Axios.get(url).then((res) => {
                console.log(1111, res);
            });
        },
        tansCardHandle (suf) {
            let url = `/nb/transCard?suf=${suf}`;
            Axios.get(url).then((res) => {
                console.log(2222, res);
            });
        },
        tansLogHandle (suf) {
            let url = `/nb/transLog?suf=${suf}`;
            Axios.get(url).then((res) => {
                console.log(3333, res);
            });
        }
    }
}
</script>

<style lang="scss">
.xlsx-to-db {
    padding: 20px;
    .topic {
        font-size: 16px;
        color: $--primary-color;
        margin-bottom: 30px;
    }
    ol {
        margin-bottom: 20px;
        .el-button {
            margin-bottom: 10px;
        }
    }
}
</style>