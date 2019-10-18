<template>
    <div class="nb-filter-setting">
        <section class="nb-search-radio pl" v-if="searchOpts.solid && searchOpts.solid !== 100">
            <label class="label">筛选维度：</label>
            <el-radio v-model="searchOpts.dimension" label="point">点</el-radio>
            <el-radio v-model="searchOpts.dimension" label="bit">颗粒</el-radio>
        </section>
        <section class="nb-search-radio pl">
            <label class="label">展示方式：</label>
            <el-radio v-model="searchOpts.showType" label="list">列表</el-radio>
            <el-radio v-model="searchOpts.showType" label="slider">轮播</el-radio>
            <el-radio v-model="searchOpts.showType" label="grid">看板</el-radio>
        </section>
        <!--关键字-->
        <section class="nb-search-input2 pl">
            <label class="label">关键字：</label>
            <el-input size="mini" placeholder="多个逗号隔开" v-model="searchOpts.keyword">
            </el-input>
            <el-select size="mini" v-model="searchOpts.keywordFields" multiple collapse-tags placeholder="搜索范围(多选)">
                <el-option
                        v-for="item in dropdownOpts.Fields"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </section>
        <!--solid-->
        <section class="nb-search-radio pl">
            <label class="label">主题：</label>
            <el-radio v-model="searchOpts.solid" @change="switchTopic(0)" :label="Number(0)">全部</el-radio>
            <el-radio v-model="searchOpts.solid" @change="switchTopic(100)" :label="Number(100)">日志</el-radio>
        </section>
        <section class="nb-search-radio pl">
            <label class="label"></label>
            <el-radio v-model="searchOpts.solid" @change="switchTopic(1)" :label="Number(1)">技术</el-radio>
            <el-radio v-model="searchOpts.solid" @change="switchTopic(2)" :label="Number(2)">生活</el-radio>
            <el-radio v-model="searchOpts.solid" @change="switchTopic(3)" :label="Number(3)">卡片</el-radio>
        </section>
        <!--分类-->
        <section class="nb-search-dropdown pl pr" v-if="searchOpts.solid && searchOpts.solid !== 100">
            <label class="label">分类：</label>
            <catalog-tree
                :dimension="searchOpts.dimension"
                selectType="multi"
                @confirm="getsearchCats">
                <el-input size="mini" slot="reference" v-model="catsShowTxt" placeholder="选择选中主题的分类"></el-input>
            </catalog-tree>
            <el-checkbox class="exclude" v-model="exclude">排除</el-checkbox>
        </section>
        <!--属性-->
        <section class="nb-search-dropdown pl pr">
            <label class="label">属性：</label>
            <el-select size="mini" v-model="searchOpts.attrs" multiple collapse-tags placeholder="选择属性(多选)">
                <el-option
                        v-for="item in attrOpts"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-checkbox class="exclude" v-model="exclude">排除</el-checkbox>
        </section>
        <!--排序-->
        <section class="nb-search-select pl">
            <label class="label">排序：</label>
            <el-select size="mini" v-model="searchOpts.sortField" placeholder="字段">
                <el-option
                        v-for="item in dropdownOpts.SortFields"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-select size="mini" v-model="searchOpts.sortType" placeholder="字段">
                <el-option
                        v-for="item in dropdownOpts.SortTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </section>
        <!--播放频率-->
        <section class="nb-search-radio pl" v-show="searchOpts.showType === 'slider'">
            <label class="label">播放频率：</label>
            <el-radio-group class="radio-play" v-model="searchOpts.playType" size="mini">
                <el-radio label="hand" border>手动</el-radio>
                <el-radio class="auto" label="auto" border>自动</el-radio>
            </el-radio-group>
            <el-autocomplete size="mini"
                    class="inline-input"
                    v-model="searchOpts.playRate"
                    :fetch-suggestions="playRateList"
                    placeholder="请输入毫秒数"
            ></el-autocomplete>
        </section>
        <!--更新时间-->
        <section class="nb-search-picker pl">
            <label class="label">更新时间：</label>
            <el-date-picker
                size="mini"
                v-model="searchOpts.updatedAt"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
        </section>
        <!--创建时间-->
        <section class="nb-search-picker pl">
            <label class="label">创建时间：</label>
            <el-date-picker
                size="mini"
                v-model="searchOpts.createdAt"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
        </section>
        <el-button size="small" @click="confirm">确定</el-button>
    </div>
</template>

<script>
import { AttrOpts, DropdownOpts, FilterDefaultVals } from '@configs/options';
import moment from 'moment';
export default {
    name: 'nb-filter-setting',
    data() {
        return {
            // 默认值
            searchOpts: {},
            dropdownOpts: DropdownOpts,
            catsShowTxt: '', // 分类展示文本
            exclude: false,

            attrOpts: AttrOpts,
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            }
        }
    },
    watch: {
        'searchOpts.dimension' (val) {
            if (val === 'bit') {
                this.searchOpts.keywordFields = ['content'];
                DropdownOpts.Fields = DropdownOpts.FieldsBit;
                DropdownOpts.cats = '';
                this.catsShowTxt = '';
            }
            if (val === 'point') {
                this.searchOpts.keywordFields = ['title'];
                DropdownOpts.Fields = DropdownOpts.FieldsPoint;
                DropdownOpts.cats = '';
                this.catsShowTxt = '';
            }
        },
        '$route' () {
            this.init();
        }
    },
    mounted () {
        this.init();
    },
    methods: {
        init () {
            this.searchOpts = _.cloneDeep(FilterDefaultVals);
            this.searchOpts.solid = parseInt(this.$route.query.solid);
            this.catsShowTxt = '';
        },
        // input的输入建议
        playRateList(queryString, cb) {
            cb(DropdownOpts.PlayRates);
        },
        // 切换主题
        switchTopic (id) {
            this.$router.push({ name: 'Filter', query: { solid: id }});
        },
        // 获取勾选的分类
        getsearchCats (returnData) {
            this.searchOpts.cats = returnData;
            let selectedCats = JSON.parse(returnData);
            let txt_null = selectedCats.isNull ? '空' : '';
            let txt_plane = selectedCats.planes.length > 0 ? `面ids:${JSON.stringify(selectedCats.planes)} | ` : '';
            let txt_line = selectedCats.lines.length > 0 ? `线ids:${JSON.stringify(selectedCats.lines)} | ` : '';
            let txt_point = selectedCats.points.length > 0 ? `点ids:${JSON.stringify(selectedCats.points)} | ` : '';
            this.catsShowTxt = txt_null + txt_plane + txt_line + txt_point;
        },
        confirm () {
            let data = _.cloneDeep(this.searchOpts);
            for (let key in data) {
                if (key === 'updatedAt' || key === 'createdAt') {
                    if (data[key]) {
                        data[key].map((x, i) => {
                            data[key][i] = moment(x).format("YYYY-MM-DD HH:mm:ss");
                        });
                    }
                }
                if (Array.isArray(data[key])) {
                    data[key] = data[key].join(',');
                }
            }
            console.log(1111, data);
            if (data.solid === 100) {
                data.dimension = '';
            }
            const {href} = this.$router.resolve({
                name: 'FilterList',
                query: data
            });
        }
    }
}
</script>

<style lang="scss">
    .nb-filter-setting {
        width: 355px;
        margin: 10px auto;
        border: #eee 1px solid;
        padding: 12px;
        border-radius: 5px;
        overflow: hidden;

        section {
            position: relative;
            height: 28px;
            margin-bottom: 10px;
            font-size: 12px;

            &.pl {
                padding-left: 68px;
            }

            &.pr {
                padding-right: 65px;
            }
        }

        .label {
            position: absolute;
            left: 5px;
            top: 0;
            width: 60px;
            text-align: right;
            line-height: 28px;
        }

        .exclude {
            position: absolute;
            top: 4px;
            right: 0;
        }
    }

    .nb-search-input2 {
        > .el-input {
            width: 131px;
            > .el-input__inner {
                padding: 0 10px;
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
                border-right: none;
            }
        }
        .el-select {
            width: 130px;
            .el-input__inner {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }

            .el-select__tags {
                max-width: none!important;
                width: 180px!important;
            }
        }
    }

    .nb-search-dropdown {
        .el-select {
            width: 100%;
        }
    }

    .nb-search-select {
        .el-select {
            width: 128px;

            &:last-child {
                margin-left: 4px;
            }
        }
    }

    .nb-search-radio {
        .radio-play.el-radio-group {
            float: left;
            .el-radio {
                margin-right: 0;
                &.auto {
                    border-top-right-radius: 0!important;
                    border-bottom-right-radius: 0!important;
                    border-right: none!important;
                }
            }
        }
        .el-autocomplete {
            width: 106px;
            .el-input__inner {
                float: left;
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }
        }
    }
    .nb-search-picker {
        .el-date-editor {
            width: 261px!important;
            .el-range-input {
                font-size: 10px;
                width: 112px;
                color: #888;
            }
            .el-range-separator {
                padding: 0;
            }
        }
    }
</style>
