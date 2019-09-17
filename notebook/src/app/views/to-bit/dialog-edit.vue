<template>
  <el-dialog
    class="dialog-editor"
    title="提示"
    :visible.sync="dialogVisible"
    width="800px">
    <section>
        <label>上级ID：</label>
        <el-input v-model="topId" />
    </section>
    <div id="editor">
      <froala id="edit" :tag="'textarea'" :config="config" v-model="model"></froala>
    </div>
    <el-button @click="confirm">保存为颗粒</el-button>
  </el-dialog>
</template>
 
<script>
import VueFroala from 'vue-froala-wysiwyg';
export default {
  name: 'dialog-editor',
  props: [ 'visible', 'pid', 'data' ],
  data () {
    return {
        topId: null,

        config: {
            toolbarButtons: ['undo', 'redo', 'clearFormatting', '|', 'bold', 'italic', 'underline','strikeThrough','|', 'fontFamily', 'fontSize', 'color', '|','paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', '|', 'print', 'spellChecker', 'help', '|', 'fullscreen'],//['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'],//显示可操作项
            events: {
                'froalaEditor.initialized': function () {
                    console.log('initialized')
                }
            },
        },
      model: 'Edit Your Content Here!'
    }
  },
  computed: {
    dialogVisible: {
      get () { return this.visible; },
      set () { this.close(); }
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
      this.model = _.cloneDeep(this.data);
      this.topId = this.pid;
    },
    close () {
      this.$emit('close');
    },
    confirm () {
        let params = {
            content: this.model,
            point: parseInt(this.topId)
        }
        this.$api.Bit.edit(params).then(res => {
            this.$message.success('保存成功');
        });
    }
  }
}
</script>