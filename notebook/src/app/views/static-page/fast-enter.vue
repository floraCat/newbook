<template>
    <div class="nb-fast-enter">
        <ol>
            <h3>前端</h3>
            <ul>
                <a target="_blank" :href="getPath_frontend(2)">canvas画布</a>
            </ul>
        </ol>
    </div>
</template>

<script>
export default {
    name: 'nb-fast-enter',
    data () {
        return {
            prePath: '/#/filter-list?solid=3&dimension=bit&showType=slider&keyword=&keywordFields=content&attrs=&sortField=updatedAt&sortType=DESC&playType=hand&playRate=&updatedAt&createdAt'
        };
    },
    methods: {
        getPath_frontend (id) {
            return `${this.prePath}&cats={"isNull":false,"planes":[],"lines":[],"points":[${id}]}`;
        }
    }

}
</script>