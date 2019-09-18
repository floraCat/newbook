<template>
    <div class="nb-filter-setting">
        <section class="nb-search-radio pl">
            <label class="label">筛选维度：</label>
            <el-radio v-model="searchOpts.dimension" label="point">点</el-radio>
            <el-radio v-model="searchOpts.dimension" label="bit">颗粒</el-radio>
        </section>
        <section class="nb-search-radio pl">
            <label class="label">展示方式：</label>
            <el-radio v-model="searchOpts.showType" label="list">列表</el-radio>
            <el-radio v-model="searchOpts.showType" label="slider">轮播</el-radio>
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
        <!--分类-->
        <section class="nb-search-dropdown pl pr">
            <label class="label">分类：</label>
            <catalog-tree
                :dimension="searchOpts.dimension"
                @confirm="getsearchCats">
                <el-input size="mini" slot="reference" v-model="catsShowTxt" placeholder="选择分类"></el-input>
            </catalog-tree>
            <el-checkbox class="exclude" v-model="exclude">排除</el-checkbox>
        </section>
        <!--属性-->
        <section class="nb-search-dropdown pl pr">
            <label class="label">属性：</label>
            <el-select size="mini" v-model="searchOpts.attrs" multiple collapse-tags placeholder="选择属性(多选)">
                <el-option
                        v-for="item in AttrOpts"
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
                <el-radio class="auto" label="2" border>自动</el-radio>
            </el-radio-group>
            <el-autocomplete size="mini"
                    class="inline-input"
                    v-model="searchOpts.playRate"
                    :fetch-suggestions="playRateList"
                    placeholder="请输入毫秒数"
            ></el-autocomplete>
        </section>
        <el-button size="small" @click="confirm">确定</el-button>
    </div>
</template>

<script>
import { AttrOpts, dropdownOpts } from '@configs/filter-setting';
import CatalogTree from './_components/catalog-tree';

    export default {
        name: 'nb-filter-setting',
        components: {
            CatalogTree
        },
        data() {
            return {
                searchOpts: {
                    dimension: 'bit',
                    showType: 'slider',
                    keyword: '',
                    keywordFields: ['content'],
                    cats: '',
                    attrs: [5],
                    sortField: 'updatedAt',
                    sortType: 'ASC',
                    playType: 'hand',
                    playRate: ''
                },
                dropdownOpts: _.cloneDeep(dropdownOpts),
                catsShowTxt: '', // 分类展示文本
                exclude: false
            }
        },
        watch: {
            'searchOpts.dimension' (val) {
                if (val === 'bit') {
                    this.searchOpts.keywordFields = ['content'];
                    this.dropdownOpts.Fields = dropdownOpts.FieldsBit;
                    this.dropdownOpts.cats = '';
                    this.catsShowTxt = '';
                }
                if (val === 'point') {
                    this.searchOpts.keywordFields = ['title'];
                    this.dropdownOpts.Fields = dropdownOpts.FieldsPoint;
                    this.dropdownOpts.cats = '';
                    this.catsShowTxt = '';
                }
            }
        },
        methods: {
            // input的输入建议
            playRateList(queryString, cb) {
                cb(this.selectOpts.PlayRates);
            },
            // 获取勾选的分类
            getsearchCats (returnData) {
                this.searchOpts.cats = returnData;
                let selectedCats = JSON.parse(returnData);
                let txt_plane = selectedCats.planes.length > 0 ? `面ids:${JSON.stringify(selectedCats.planes)}` : '';
                let txt_line = selectedCats.lines.length > 0 ? ` | 线ids:${JSON.stringify(selectedCats.lines)}` : '';
                let txt_point = selectedCats.points.length > 0 ? ` | 点ids:${JSON.stringify(selectedCats.points)}` : '';
                this.catsShowTxt = txt_plane + txt_line + txt_point;
            },
            confirm () {
                let data = _.cloneDeep(this.searchOpts);
                for (let key in data) {
                    if (Array.isArray(data[key])) {
                        data[key] = data[key].join(',');
                    }
                }
                this.$router.push({ name: 'FilterList', query: data });
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
</style>
