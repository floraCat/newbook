<template>
    <div class="nb-filter-list">
        <list-slider
            :params="params"
            v-if="showType === 'slider'">
        </list-slider>
        <list-grid-layout
            :params="params"
            v-if="showType === 'grid'">
        </list-grid-layout>
    </div>
</template>

<script>
import { FilterDefaultVals } from '@configs/options';
// import ListPage from './list-page';
import ListSlider from './list-slider';
import ListGridLayout from './list-grid-layout';
export default {
    name: 'nb-filter-list',
    components: {
        // ListPage,
        ListSlider,
        ListGridLayout
    },
    data () {
        return {};
    },
    mounted () {
    },
    computed: {
        showType () {
            return this.$route.query.showType;
        },
        params () {
            let data = _.cloneDeep(FilterDefaultVals);
            for (let key in data) {
                if (Array.isArray(data[key])) {
                    data[key] = data[key].join(',');
                }
            }
            return Object.assign(data, this.$route.query);
        }
    }
}
</script>

<style lang="scss">

</style>