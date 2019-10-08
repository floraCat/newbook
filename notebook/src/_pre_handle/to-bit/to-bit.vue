<template>
    <div class="nb-to-bit">

        {{pointInfo.title}}
        
        <!--富文本编辑器-->
        <div id="editor" v-if="visibelEditor">
            <froala id="edit" :tag="'textarea'" :config="config" v-model="pointInfo.extend"></froala>
        </div>

        <!--弹窗-->
        <dialog-edit
            v-if="visibleEdit"
            :visible="visibleEdit"
            :pid="$route.query.pid"
            :data="dataSelected"
            @close="visibleEdit = false"
        ></dialog-edit>

    </div>
</template>

<script>
import VueFroala from 'vue-froala-wysiwyg'; // 富文本编辑器
import DialogEdit from './dialog-edit';
export default {
    name: 'nb-to-bit',
    components: {
        DialogEdit
    },
    data () {
        return {
            pointInfo: {},
            
            // 富文本编辑器
            visibelEditor: false,
            config: {
                toolbarButtons: ['undo', 'redo', 'clearFormatting', '|', 'bold', 'italic', 'underline','strikeThrough','|', 'fontFamily', 'fontSize', 'color', '|','paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', '|', 'print', 'spellChecker', 'help', '|', 'fullscreen'],//['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'],//显示可操作项
                events: {
                'froalaEditor.initialized': function () {
                    console.log('initialized')
                }
                },
            },
            // 鼠标选中的文本
            dataSelected: '',
            // 编辑弹窗
            visibleEdit: false
        }
    },
    mounted () {
        this.init();  
    },
    methods: {
        async init() {
            await this.getData();
            this.visibelEditor = true;
            setTimeout(() => {
                document.getElementsByClassName('fr-element')[0].onmouseup = () => {
                var txt = this.getSelectedContents();
                this.dataSelected = txt;
                this.visibleEdit = true;
                };
            }, 500);
        },
        getData () {
            return new Promise(resolve => {
                this.$api.Point.row(this.$route.query.pid).then(res => {
                this.pointInfo = res;
                resolve();
                });
            });
        },
        // 获取鼠标选中文本
        getSelectedContents () {
            if (window.getSelection) { //chrome,firefox,opera
                var range=window.getSelection().getRangeAt(0);
                var container = document.createElement('div');
                container.appendChild(range.cloneContents());
                return container.innerHTML;
                //return window.getSelection(); //只复制文本
            }
            else if (document.getSelection) { //其他
                var range=window.getSelection().getRangeAt(0);
                var container = document.createElement('div');
                container.appendChild(range.cloneContents());
                return container.innerHTML;
                //return document.getSelection(); //只复制文本
            }
            else if (document.selection) { //IE特有的
                return document.selection.createRange().htmlText;
                //return document.selection.createRange().text; //只复制文本
            }
        }
    }
}
</script>

<style lang="scss">

</style>
