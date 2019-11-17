<template>
    <div class="nb-index">
        <ol class="layout2">
            <router-link :to="{name: 'ListLine', query: { solid: 1 }}">技术</router-link>
            <router-link :to="{name: 'ListLine', query: { solid: 2 }}">生活</router-link>
        </ol>
        <ol class="layout2">
            <router-link :to="{name: 'ListLine', query: { solid: 3 }}">卡片</router-link>
            <router-link :to="{name: 'LogList', query: { topic: 1 }}">日志</router-link>
        </ol>
        <ol class="layout1">
            <router-link :to="{name: 'Filter', query: { solid: 1 }}">Filter</router-link>
        </ol>
        <ol class="layout1">
            <router-link :to="{
                name: 'FilterList',
                query: { 
                    showType: 'list',
                    sortField: 'updatedAt',
                    sortType: 'DESC',
                    dimension: 'bit',
                    total: 50
                }
            }">
                最近更新
            </router-link>
        </ol>
        <ol class="layout2">
            <a href="javascript:;" @click="addVisible = true">
                添加颗粒
            </a>
            <router-link :to="{
                name: 'FilterList', 
                query: { 
                    showType: 'list',
                    dimension: 'bit',
                    cats: 'NULL'
                }
            }">
                碎片处理
            </router-link>
        </ol>
        <ol class="layout2">
            <router-link :to="{name: 'RecomPage' }">
                推荐
            </router-link>
            <router-link :to="{name: 'LocalSource' }">
                本地资源
            </router-link>
        </ol>
        <div class="review">
            <h3>新建颗粒复习 :</h3>
            <ol class="layout3">
                <router-link :to="{name: 'FilterList', query: { showType: 'slider', createdAt: timeRange.today } }">
                    今天
                </router-link>
                <router-link :to="{name: 'FilterList', query: { showType: 'slider', createdAt: timeRange.yestoday } }">
                    昨天
                </router-link>
                <router-link :to="{name: 'FilterList', query: { showType: 'slider', createdAt: timeRange.beforeOneWeek } }">
                    七天前
                </router-link>
            </ol>
        </div>

        <!--row 增加子条目弹窗-->
        <dialog-edit
            v-if="addVisible"
            :visible="addVisible"
            action="add"
            dataKey="bit"
            @close="addVisible = false"
            @confirm="rowChildEditConfirm"
        ></dialog-edit>

    </div>
</template>

<script>
import moment from 'moment';
import DialogEdit from './_components/dialog-edit';
export default {
    name: 'nb-index',
    components: {
        DialogEdit
    },
    data () {
        return {
            timeRange: {
                today: `${moment().format("YYYY-MM-DD")} 00:00:00,${moment().format("YYYY-MM-DD")} 23:59:59`,
                yestoday: `${moment().subtract(1, 'day').format("YYYY-MM-DD")} 00:00:00,${moment().subtract(1, 'day').format("YYYY-MM-DD")} 23:59:59`,
                beforeOneWeek: `${moment().subtract(7, 'day').format("YYYY-MM-DD")} 00:00:00,${moment().format("YYYY-MM-DD HH:mm:ss")}`,
            },

            addVisible: false
        };
    },
    mounted () {
    },
    methods: {
        // 增加颗粒后回调
        rowChildEditConfirm (params) {
            this.$api.Bit.edit(params).then(() => {
                this.$message.success('新增颗粒成功');
            });
        }
    }
}
</script>

<style lang="scss">
.nb-index {
    width: 400px;
    margin: 10px auto;
    padding: 20px 20px 10px;
    background: #eee;
    a+a {
        margin-left: 4%;
    }
    ol {
        overflow: hidden;
        margin-bottom: 20px;
        a {
            display: block;
            height: 45px;
            line-height: 45px;
            border: #ddd 1px solid;
            text-align: center;
            background: #fff;
            border-radius: 5px;
        }
        &.layout1 {
            a {
                width:100%;
            }
        }
        &.layout2 {
            a {
                float: left;
                width:48%;
            }
        }
        &.layout3 {
            a {
                float: left;
                width:30.6%;
            }
        }
    }
    h3 {
        margin-bottom: 10px;
    }
}
</style>