export const crudRow = {
    data () {
        return {
            rowData: {},
            rowEditVisible: false,
            // 添加子条目的弹窗
            rowChildEditVisible: false
        }
    },
    methods: {
        rowDel () {
            if (this.rowSubKey && this.rowData[this.rowSubKey].length > 0) {
                this.$message.warning('请删除下属所有子条目后再执行删除');
                return;
            }
            let note = this.rowDelNote || '确定要删除此条目吗？';
            this.$confirm(note).then(() => {
                let params = { ids: [this.rowData.id] };
                this.rowApi.del(params).then(() => {
                    this.$message.success('删除成功');
                    this.returnParent();
                });
            }).catch(() => {});
        },
        rowMod () {
            this.rowEditVisible = true;
        },
        // 编辑完成后回调
        rowEditConfirm (params) {
            this.rowApi.edit(params).then(() => {
                this.$message.success('修改成功');
                this.$set(this.rowData, 'title', params.title);
            });
        },
        // 增加子条目
        rowAddChild () {
            this.rowChildEditVisible = true;
        },
        // 增加子条目后回调
        rowChildEditConfirm (params) {
            params[this.rowChildTopKey] = this.$route.query.pid;
            this.rowChildApi.edit(params).then(() => {
                this.$message.success('新增子条目成功');
                this.getData();
            });
        }
    }
};