<template>
    <div class="nb-log-list">
        <ul class="menu">
            <el-button :type="topic.id === topicId ? 'primary' : ''" size="small" v-for="(topic, index) in topicList"
                :key="index"
                @click="switchTopic(topic.id)">
                {{topic.title}}
            </el-button>
            <router-link class="fr" :to="{ name: 'Index' }"><el-button size="mini">首页</el-button></router-link>
            <el-button class="fr" size="mini" @click="addHandle">新增子条目</el-button>
        </ul>

        <div class="top">
            <el-pagination
                small
                @current-change="changepage"
                :current-page="pageNum"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                :total="total">
            </el-pagination>
        </div>

        <ul class="list">
            <li v-for="(item, index) in articleList" :key="item.id">
                <div class="hd">
                    <h4 @click="viewDetail(item.id)">{{item.title}}</h4>
                    <a class="btn" href="javascript:;" @click="editHandle(index)">编辑</a>
                    <a class="btn" href="javascript:;" @click="delHandle(index)">删除</a>
                    <span>创建 : {{item.createdAt | timeFormat}}</span>
                    <span>更新 : {{item.updatedAt | timeFormat}}</span>
                    <span v-show="item.class !== null">类别 : {{item.class | classToTxt}}</span>
                </div>
                <div class="content">
                    <div v-html="item.content"></div>
                </div>
            </li>
        </ul>

        <!--编辑-->
        <dialog-edit
            v-if="visibleEdit"
            :visible="visibleEdit"
            :action="actionEdit"
            :data="articleList[currentIndex]"
            @close="visibleEdit = false"
            @confirm="editConfirm">
        </dialog-edit>
    </div>
</template>

<script>
import moment from 'moment';
import DialogEdit from './_components/dialog-edit';
export default {
    name: 'nb-log-list',
    components: {
        DialogEdit
    },
    data () {
        return {
            topicList: [],
            topicOnIndex: 0,

            pageNum: 1,
            pageSize: 30,
            total: 0,
            keyword: '',

            articleList: [],
            currentIndex: null,

            visibleEdit: false,
            actionEdit: null
        }
    },
    computed: {
        topicId () {
            return parseInt(this.$route.query.topic);
        }
    },
    watch: {
        '$route' () {
            this.pageNum = 1;
            this.init();
        }
    },
    mounted () {
        this.init();
    },
    methods: {
        async init () {
            await this.getTopicList();
            this.getArticleList();
        },
        getTopicList () {
            return new Promise(resolve => {
                this.$api.LogTopic.list().then(res => {
                    this.topicList = res;
                    resolve();
                });
            });
        },
        getArticleList () {
            let params = {
                topic: this.topicId,
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                keyword: this.keyword
            };
            this.$api.LogArticle.list(params).then(res => {
                this.articleList = res.list;
                this.total = res.total;
            });
        },
        switchTopic (id) {
            this.$router.push({ name: 'LogList', query: { topic: id } });
        },
        viewDetail (id) {
            const {href} = this.$router.resolve({
                name: 'LogArticle',
                query: { id: id }
            });
            window.open(href, '_blank');
        },
        delHandle (index) {
            this.$confirm('确定要删除此条目吗？').then(() => {
                this.$api.LogArticle.del({ ids: this.articleList[index].id}).then(res => {
                    this.$message.success('删除成功');
                    this.articleList.splice(index, 1);
                });
            }).catch(() => {});
        },
        addHandle () {
            this.actionEdit = 'add';
            this.currentIndex = 0;
            this.visibleEdit = true;
        },
        editHandle (index) {
            this.actionEdit = 'mod';
            this.currentIndex = index;
            this.visibleEdit = true;
        },
        editConfirm (returnData) {
            this.$api.LogArticle.edit(returnData).then(res => {
                if (this.actionEdit === 'add') {
                    this.$message.success('新增成功');
                    this.pageNum = 1;
                } else {
                    this.$message.success('修改成功');
                }
                this.getArticleList();
            });
        },
        changepage (pageNum) {
            this.pageNum = pageNum;
            this.getArticleList();
        }
    },
    filters: {
        classToTxt (val) {
            switch (val) {
            case 0:
                return '随笔';
            case 1:
                return '读书笔记';
            case 2:
                return '写作素材';
            case 3:
                return '写作练习';
            }
        },
        timeFormat (val) {
            return moment(val).format("YY-MM-DD HH:mm");
        }
    }
}
</script>

<style lang="scss">
.nb-log-list {
    .menu {
        padding: 20px;
        border-bottom: #ddd 1px solid;
    }
    .top {
        padding: 10px;
        overflow: hidden;
        .el-pagination {
            float: right;
        }
    }
    .list {
        > li {
            box-shadow: 0 0 4px #ddd;
            border-bottom: #ddd 1px solid;
            > .hd {
                height: 30px;
                line-height: 30px;
                overflow: hidden;
                padding: 0 15px;
                background: $--primary-bg;
                h4 {
                    float: left;
                    color: $--primary-color;
                    cursor: pointer;
                    margin-right: 15px;
                }
                > .btn {
                    display: none;
                    margin-right: 8px;
                }
                > span {
                    float: right;
                    margin-left: 15px;
                    color: #888;
                }
                &:hover {
                    > .btn {
                        display: inline-block;
                    }
                }
            }
            margin-bottom: 20px;
            .content {
                padding: 10px;
                background: #eee;
                max-height: 100px;
                overflow: hidden;
            }
        }
    }
}
</style>
