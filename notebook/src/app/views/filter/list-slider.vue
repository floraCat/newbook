<template>
    <div class="filter-list-slider nb-list" ref="mySwiper">

        <el-pagination
            @current-change="changepage"
            :current-page="pageNum"
            :page-sizes="[20, 40, 60]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>

        <el-button style="position: absolute; top: 10px; right: 10px; z-index: 999;" size="mini"><router-link :to="{ name: 'Index' }">首页</router-link></el-button>

        <div class="list">
            <dl>
                <dd v-for="(item, index) in dataList" :key="index">
                    <section class="nb-btns">
                        <div class="btns">
                            <el-button size="mini" @click="swiperPop(index)">展示</el-button>
                            <el-button size="mini" @click="editHandle(index)">编辑</el-button>
                            <el-button size="mini" @click="delHandle(index)">删除</el-button>
                            <catalog-tree
                                class="fr"
                                :visible="catalogTreeVisible"
                                selectType="single"
                                :dimension="dimension"
                                @confirm="catalogTreeConfirm">
                                <el-button size="mini" v-if="dimension !== 'log'" slot="reference" @click="catalogTreeClick(index)">转移</el-button>
                            </catalog-tree>
                        </div>
                        <template v-if="$route.query.dimension === 'bit'">
                            <h4 v-if="item.isShowObj.title">{{item.title}}</h4>
                            <div class="info2" style="background: #eee;">
                                <span>createdAt : {{item.createdAt}}</span> | 
                                <span>updatedAt : {{item.updatedAt}}</span>
                            </div>
                            <div v-html="item.content"></div>
                        </template>
                        <!--point 时展示 bit列表-->
                        <template v-else-if="$route.query.dimension === 'point'">
                            <h4 v-if="item.isShowObj.title">{{item.title}}</h4>
                            <div class="bits">
                                <template v-for="(bit, index) in item.bits">
                                    <span :key="bit.id" v-if="index <= 5">
                                        <template v-if="bit.title"> {{bit.title}} </template>
                                        <div v-if="!bit.title" class="content" v-html="bit.content"></div>
                                    </span>
                                </template>
                                <p v-if="item.bits.length > 5">......</p>
                            </div>
                        </template>
                        <!--其他 展示 content-->
                        <template v-else>
                            <h4 v-if="item.isShowObj.title">{{item.title}}</h4>
                            <div v-html="item.content"></div>
                        </template>
                    </section>
                </dd>
            </dl>
        </div>

        <div class="mask" v-show="visibleSwiper"></div>
        <div class="nb-swiper-wrap" v-show="visibleSwiper">
            <div class="nb-swiper">
                <a href="javascript:;" class="close el-icon-circle-close" @click="visibleSwiper = false"></a>
                <div class="swiper-container">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="(item, index) in dataList" :key="index">
                            <div class="head">
                                <h4 v-if="item.isShowObj.title">{{item.title}}</h4>
                                <catalog-tree
                                    class="fr"
                                    :visible="catalogTreeVisible"
                                    selectType="single"
                                    :dimension="dimension"
                                    @confirm="catalogTreeConfirm">
                                    <el-button size="mini" v-if="dimension !== 'log'" slot="reference" @click="catalogTreeClick(index)">转移</el-button>
                                </catalog-tree>
                                <a href="javascript:;" size="mini" class="recom fr"
                                    @click="recomHandle(index)">
                                    {{ item.recom ? '取消推荐' : '推荐'}}
                                </a>
                                <div class="status fr" :class="{ active: item.recom }"></div>
                                <a class="del fr" href="javascript:;" @click="delHandle(index)">删除</a>
                                <a class="edit fr" href="javascript:;" @click="editHandle(index)">编辑</a>
                            </div>
                            <p class="time">
                                <span> 创建：{{item.createdAt.slice(0, -5)}} </span>
                                <span> 更新：{{item.updatedAt.slice(0, -5)}} </span>
                            </p>
                            <div class="info">
                                <span v-if="item.isShowObj.cats"><label>分类：</label>{{item.cats}}</span>
                                <span v-if="item.isShowObj.attr"><label>属性：</label>{{item.attr | attrDict(attrOpts)}}</span>
                                <span><label>排序：</label>{{item.sort}}</span>
                            </div>
                            <!--测试 返回字段值 是否正确 -->
                            <div class="info2">
                                <span>subtitle : {{item.subtitle}}</span> | 
                                <span>sort : {{item.sort}}</span> | 
                                <span>attr : {{item.attr}}</span> | 
                                <span>grade : {{item.grade}}</span> | 
                                <span>class : {{item.class}}</span> | 
                                <span>keyword : {{item.keyword}}</span> | 
                                <span>pic : {{item.pic}}</span> | 
                                <span>audio : {{item.audio}}</span> | 
                                <span>video : {{item.video}}</span> | 
                                <span>createdAt : {{item.createdAt}}</span> | 
                                <span>updatedAt : {{item.updatedAt}}</span> | 
                                <span>point : {{item.point && item.point.id}}</span>
                            </div>
                            <div class="desc" v-if="item.isShowObj.description">
                                {{item.description}}
                            </div>
                            <div class="content">
                                <!--point 时展示 bit列表-->
                                <template v-if="dimension === 'point'">
                                    <ul>
                                        <li v-for="bit in item.bits" :key="bit.id">
                                            {{bit.title}}
                                            <div v-html="item.content"></div>
                                        </li>
                                    </ul>
                                </template>
                                <!--其他 展示 content-->
                                <template v-else>
                                    <div v-html="item.content"></div>
                                </template>
                            </div>
                        </div>
                    </div>		    
                    <div class="swiper-button-prev"></div>
                    <div class="swiper-button-next"></div>
                </div>
            </div>
        </div>

        <!--row 编辑弹窗-->
        <dialog-edit
            v-if="rowEditVisible"
            :visible="rowEditVisible"
            action="mod"
            :dataKey="dimension"
            :data="dataList[currentIndex]"
            @close="rowEditVisible = false"
            @confirm="rowEditConfirm"
        ></dialog-edit>

    </div>
</template>

<script>
import { AttrOpts } from '@configs/options';
import Swiper from 'swiper';
import DialogEdit from '../_components/dialog-edit';
import { GetPlane, MapGetShowObj } from '../_methods';
export default {
    name: 'filter-list-slider',
    props: [ 'params' ],
    components: {
        DialogEdit
    },
    inject: [ 'FieldSettingMode1' ],
    data () {
        return {
            mySwiper: null,
            visibleSwiper: false,
            swiperOption: {},
            changepageType: 'next', // or 'pre' 换页类型：上一页 or 下一页

            pageSize: 20,
            pageNum: 1,
            total: 0,

            dataList: [],
            currentIndex: null,

            attrOpts: AttrOpts,

            rowEditVisible: false,
            catalogTreeVisible: false
        };
    },
    computed: {
        dimension () {
            return this.params.dimension || 'log';
        },
        $API () {
            let rs = this.$api.LogArticle;
            if (this.dimension === 'bit') {
                rs = this.$api.Bit;
            }
            if (this.dimension === 'point') {
                rs = this.$api.Point;
            }
            return rs;
        }
    },
    watch: {
        visibleSwiper (show) {
            if (show) {
                document.body.style.overflowY = 'hidden';
            } else {
                document.body.style.overflowY = 'auto';
            }
        }
    },
    mounted () {
        this.init();
    },
    methods: {
        async init () {
            await this.getList();
            this.swiperPop(0);
        },
        getList () {
            return new Promise(resolve => {
                let params = this.params;
                params.pageSize = this.pageSize;
                params.pageNum = this.pageNum;
                this.$api.Common.filter(params).then(res => {
                    this.dataList = res.list;
                    this.dataList.map((x, i) => {
                        if (x.point && x.point.subFieldSetting) {
                            this.dataList[i].point.subFieldSetting = JSON.parse(x.point.subFieldSetting);
                        }
                    });
                    this.dataList = MapGetShowObj(this.dataList, this.FieldSettingMode1);
                    this.total = res.total;
                    resolve();
                });
            });
        },
        // 点击其中一个打开弹窗
		swiperPop: function (index) {
            this.visibleSwiper = true;
            let self = this;
			setTimeout( () => {
				if (!self.mySwiper) {
                    // 自动播放
					if (self.params.playType === 'auto') {
						self.mySwiper = new Swiper ('.swiper-container', {
							autoplay: {
							    delay: parseInt(self.params.playRate),
							    stopOnLastSlide: true,
							    disableOnInteraction: false,
							},
					    	navigation: {
						      nextEl: '.swiper-button-next',
						      prevEl: '.swiper-button-prev',
						    }
						    // on: {
						    	// init: function(){
							    // 	if (self.audio.mode && self.items[0].audio) {
							    // 		self.audioHandle(0)
							    // 	}
							    // },
							    // transitionEnd: function () {
							    // 	if (self.audio.mode) {
							    // 		if (self.eventOn) {
							    // 			self.audioHandle(self.mySwiper.activeIndex);
							    // 			self.eventOn = false
							    // 		} else {
							    // 			var _preAudio = self.items[self.mySwiper.previousIndex].myAudio
								//     		if (_preAudio) {
								//     			if (_preAudio.ended) {
								// 	    			self.audioHandle(self.mySwiper.activeIndex)
								// 	    		} else {
								// 	    			if (self.params.play!='def') {
								// 	    				self.mySwiper.autoplay.stop();
								// 	    			}
								// 	    			self.setIn = setInterval(function () {
								// 	    				if (_preAudio && _preAudio.ended) {
								// 	    					clearInterval(self.setIn);
								// 	    					if (self.params.play!='def') {
								// 			    				self.mySwiper.autoplay.start();
								// 			    			}
								// 	    					self.audioHandle(self.mySwiper.activeIndex)
								// 	    				}
								// 	    			}, 1000);
								// 	    		}
								//     		} else {
								//     			self.audioHandle(self.mySwiper.activeIndex)
								//     		}
							    // 		}
							    // 	}
							    // }
						    // }
						})
					}else {
						self.mySwiper = new Swiper ('.swiper-container', {
						    // 如果需要前进后退按钮
						    navigation: {
						      nextEl: '.swiper-button-next',
						      prevEl: '.swiper-button-prev',
						    },
						    on: {
						    	touchStart: function(event){
							        self.startX = event.pageX;
							    },
							    touchMove: function(event){
							        self.endX = event.pageX-self.startX;
							    },
							    touchEnd: function(){
                                    if (self.endX > 30) { //右滑
                                        self.changepageType = 'pre';
                                        // 第一条右滑(非第一页)翻上一页
							    		if (self.mySwiper.activeIndex === 0) {
							    			if (parseInt(self.pageNum) !== 1) {
							    				self.pageNum --
							    				self.changepage()
							    			}
							    		}
							    	}
                                    if (self.endX < -30) { // 左滑
                                        self.changepageType = 'next';
                                        // 最后一条左滑(非最后一页)翻下一页
							    		if(self.mySwiper.activeIndex === (self.dataList.length-1)){
                                            let totalPage = Math.ceil(self.total/self.pageSize);
							    			if (parseInt(self.pageNum) < totalPage,null,true) {
							    				self.pageNum ++
							    				self.changepage()
							    			}
							    		}
							    	}
							    }
							    // init: function(){
							    // 	if (self.audio.mode) {
							    // 		self.audioHandle(0)
							    // 	}
							    // },
							    // transitionEnd: function () {
							    // 	if (self.audio.mode) {
							    // 		if (self.eventOn) {
							    // 			self.audioHandle(self.mySwiper.activeIndex);
							    // 			self.eventOn = false
							    // 		} else {
							    // 			var _preAudio = self.items[self.mySwiper.previousIndex].myAudio
								//     		if (_preAudio) {
								//     			if (_preAudio.ended) {
								// 	    			self.audioHandle(self.mySwiper.activeIndex)
								// 	    		} else {
								// 	    			if (self.params.play!='def') {
								// 	    				self.mySwiper.autoplay.stop();
								// 	    			}
								// 	    			self.setIn = setInterval(function () {
								// 	    				if (_preAudio && _preAudio.ended) {
								// 	    					clearInterval(self.setIn);
								// 	    					if (self.params.play!='def') {
								// 			    				self.mySwiper.autoplay.start();
								// 			    			}
								// 	    					self.audioHandle(self.mySwiper.activeIndex)
								// 	    				}
								// 	    			}, 1000);
								// 	    		}
								//     		} else {
								//     			self.audioHandle(self.mySwiper.activeIndex)
								//     		}
							    // 		}
							    // 	}
							    	
							    // }
						    }
						})
					}
                }
                this.mySwiper.slideTo(index);
				this.mySwiper.keyboard.enable();
			}, 500)
        },
        // 换页 - swiper滑动
        async changepageSwiper () {
            await this.getList();
            if (this.mySwiper) {
                this.mySwiper.update()
            }
            if (this.changepageType === 'pre') {
                this.swiperPop(this.pageSize-1);
            } else {
                this.swiperPop(0);
            }
        },
        // 换页 - 点击页码
        changepage (pageNum) {
            this.pageNum = pageNum;
            this.getList();
        },
        delHandle (index) {
            this.$confirm('确定要删除此条目吗？').then(() => {
                let params = { ids: [this.dataList[index].id].join(',') };
                this.$API.del(params).then(() => {
                    this.$message.success('删除成功');
                    this.dataList.splice(index, 1);
                });
            }).catch(() => {});
        },
        editHandle (index) {
            this.currentIndex = index;
            this.rowEditVisible = true;
        },
        // 编辑确认回调
        rowEditConfirm (returnData) {
            this.$API.edit(returnData).then(() => {
                this.$message.success('修改成功');
                let data = Object.assign(this.dataList[this.currentIndex], returnData);
                this.$set(this.dataList, this.currentIndex, data);
            });
        },
        // 点击分类下拉
        async catalogTreeClick (index) {
            if (this.$store.state.planes.length <= 0) {
                // 下拉分类前先加载所有plane(如放在下拉分类组件内加载列表会多次请求)
                let planes = await GetPlane();
                this.$store.commit('planes', planes);
            }
            this.catalogTreeVisible = true;
            this.currentIndex = index;
        },
        // 推荐
        recomHandle (index) {
            this.currentIndex = index;
            let item = this.dataList[index];
            let params = {
                id: item.id,
                recom: !item.recom
            };
            this.$API.edit(params).then(() => {
                let note = !item.recom ? '推荐成功' : '取消推荐成功';
                this.$message.success(note);
                this.$set(item, 'recom', !item.recom);
            });
        },
        // 点选分类回调
        catalogTreeConfirm (catId) {
            let params = {};
            if (this.dimension === 'bit') {
                params = Object.assign(this.dataList[this.currentIndex], { point: catId});
            }
            if (this.dimension === 'point') {
                params = Object.assign(this.dataList[this.currentIndex], { line: catId});
            }
            this.$API.edit(params).then(res => {
                this.$message.success('转移成功');
                this.getList();
            });
        }
    },
    filters: {
        attrDict (val, opts) {
            let item = opts.find(x => x.value === val);
            return item && item.label || '';
        }
    }
}
</script>

<style lang="scss">
@import '../_common';
.filter-list-slider {
    .mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #333;
        opacity: .4;
    }
    .nb-swiper-wrap {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .nb-swiper {
        position: relative;
        width: 100%;
        max-width: 960px;
        height:97%;
        margin: 1% auto;
        border-radius: 6px;
        padding: 20px 20px;
        background: #f6f6f6;
        box-shadow: 0 1px 5px #aaa;
        .swiper-container {
            height: 100%;
        }
        .swiper-slide {
            overflow-y: scroll;
        }
        > .close {
            z-index: 9;
            position: absolute;
            top: 5px;
            right: 5px;
            width: 26px;
            height: 26px;
            font-size: 26px;
            color: #999;
        }
        .head {
            overflow: hidden;
            h4 {
                float: left;
                font-size: 14px;
                font-weight: bold;
            }
            .edit {
                margin: 0 10px;
            }
            .del {
                padding: 0 10px;
                margin: 0 10px;
                border-left: #ddd 1px solid;
                border-right: #ddd 1px solid;
            }
            .recom {
                margin: 0 10px;
            }
            .status {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #ccc;
                margin-top: 8px;
                &.active {
                    background: $--primary-color;
                }
            }
        }
        .time {
            text-align: right;
            color: #aaa;
            > span {
                margin-left: 10px;
            }
        }
        .info {
            background: #eee;
            padding: 0 15px;
            > span {
                margin-right: 10px;
                color: #666;
            }
        }
        .desc, .content {
            margin-top: 8px;
            padding: 10px 15px;
            background: #eee;
        }
    }
}
</style>