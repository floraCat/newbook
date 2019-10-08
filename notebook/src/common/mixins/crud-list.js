export const crudList = {
    data () {
        return {
            listData: [],
            currentIndex: null,
            listEditAction: 'add',
            listEditVisible: false,
            // 添加子条目的弹窗
            listChildEditVisible: false
        }
    },
    methods: {
        listDel (index) {
            if (this.listSubKey && this.listData[index][this.listSubKey].length > 0) {
                this.$message.warning('请删除下属所有子条目后再执行删除');
                return;
            }
            let note = this.listDelNote || '确定要删除此条目吗？';
            this.$confirm(note).then(() => {
                let params = { ids: [this.listData[index].id].join(',') };
                this.listApi.del(params).then(() => {
                    this.$message.success('删除成功');
                    this.listData.splice(index, 1);
                });
            }).catch(() => {});
        },
        listAdd () {
            this.currentIndex = 0; // 为了默认显示上级id
            this.listEditAction = 'add';
            this.listEditVisible = true;
        },
        listMod (index) {
            this.currentIndex = index;
            this.listEditAction = 'mod';
            this.listEditVisible = true;
        },
        // 编辑完成后回调
        listEditConfirm (params) {
            this.listApi.edit(params).then(() => {
                if (this.listEditAction === 'add') {
                    this.$message.success('新增成功');
                    this.getList();
                }
                if (this.listEditAction === 'mod') {
                    this.$message.success('修改成功');
                    if (this.currentIndex !== null) {
                        this.$set(this.listData, this.currentIndex, params);
                    } else {
                        this.$set(this.listData, 'title', params.title);
                    }
                }
            });
        },
        // 增加子条目
        listAddChild (index) {
            this.currentIndex = index;
            this.listChildEditVisible = true;
        },
        // 添加子条目后回调
        listChildEditConfirm (params) {
            params[this.listChildTopKey] = this.listData[this.currentIndex].id; 
            this.listChildApi.edit(params).then(() => {
                this.$message.success('新增子条目成功');
                this.getList();
            });
        }
    }
};