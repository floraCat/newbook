<template>
    <div class="nb-log-list nb-list">
        <ul class="menu">
            <el-button :type="topic.id === topicId ? 'primary' : ''" size="small" v-for="(topic, index) in topicList"
                :key="index"
                @click="switchTopic(topic.id)">
                {{topic.title}}
            </el-button>
            <router-link class="fr" :to="{ name: 'Index' }"><el-button size="mini">首页</el-button></router-link>
            <el-button class="fr" size="mini" @click="addHandle">新增子条目</el-button>
        </ul>

        <div class="page">
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
                    <h4 @click="viewDetail(index)">{{item.title}}</h4>
                    <span>创建 : {{item.createdAt | timeFormat}}</span>
                    <span>更新 : {{item.updatedAt | timeFormat}}</span>
                    <span v-if="item.class !== null">类别 : {{item.class | classToTxt}}</span>
                    <a class="btn" href="javascript:;" @click="delHandle(index)">删除</a>
                    <a class="btn" href="javascript:;" @click="editHandle(index)">编辑</a>
                    <div class="recom fr">
                        <div class="status fl" :class="{ active: item.recom }"></div>
                        <a href="javascript:;" class="fl"
                            @click="recomHandle(index)">
                            {{ item.recom ? '取消推荐' : '推荐'}}
                        </a>
                    </div>
                </div>
                <div class="content">
                    <div v-html="item.content"></div>
                </div>
            </li>
        </ul>

        <div class="page">
            <el-pagination
                small
                @current-change="changepage"
                :current-page="pageNum"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                :total="total">
            </el-pagination>
        </div>

        <!--编辑-->
        <dialog-edit
            v-if="visibleEdit"
            :visible="visibleEdit"
            :action="actionEdit"
            dataKey="log"
            :data="articleList[currentIndex]"
            @close="visibleEdit = false"
            @confirm="editConfirm">
        </dialog-edit>

        <!--查看详情-->
        <dialog-view
            v-if="visibleView"
            :visible="visibleView"
            :data="articleList[currentIndex]"
            @close="visibleView = false">
        </dialog-view>
        
    </div>
</template>

<script>
import moment from 'moment';
import { LogClassOpts } from '@configs/options';
import DialogEdit from '../_components/dialog-edit';
import DialogView from './_components/dialog-view';

export default {
    name: 'nb-log-list',
    components: {
        DialogEdit,
        DialogView
    },
    data () {
        return {
            topicList: [],
            topicOnIndex: 0,

            pageNum: 1,
            pageSize: 20,
            total: 0,
            keyword: '',

            articleList: [],
            currentIndex: null,

            visibleEdit: false,
            visibleView: false,
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
                    this.$store.commit('logTopics', res);
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
        viewDetail (index) {
            this.currentIndex = index;
            this.visibleView = true;
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
            document.body.scrollTop = 0
            document.documentElement.scrollTop = 0
        },
        // 推荐
        recomHandle (index) {
            this.currentIndex = index;
            let item = this.articleList[index];
            let params = {
                id: item.id,
                recom: !item.recom
            };
            this.$api.LogArticle.edit(params).then(() => {
                let note = !item.recom ? '推荐成功' : '取消推荐成功';
                this.$message.success(note);
                this.$set(item, 'recom', !item.recom);
            });
        },
    },
    filters: {
        classToTxt (val) {
            let item = LogClassOpts.find(x => x.value === val);
            return item && item.label;
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
    .page {
        padding: 10px;
        overflow: hidden;
        .el-pagination {
            float: right;
        }
    }
    .recom {
        margin: 4px 0;
        line-height: 22px;
        background: #f8f8f8;
        padding: 0 5px;
        > a {
            color: #666;
            font-size: 12px;
            font-weight: normal;
        }
    }
    .status {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #ccc;
        margin: 6px 5px 0 0;
        &.active {
            background: $--primary-color;
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
                    float: right;
                    margin-left: 8px;
                }
                > span {
                    float: right;
                    margin-left: 15px;
                    color: #888;
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
