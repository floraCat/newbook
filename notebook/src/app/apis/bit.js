export const Bit = {
    // 筛选
    filter: function (params) {
        return Axios.get('/nb/bits/filter', { params }).then((response) => {
            return response.data;
        });
    },
    pointList: function (params, pid) {
        let url = '/nb/points';
        if (pid !== undefined) { url = `/nb/lines/${pid}`; }
        return Axios.get(url, { params }).then((response) => {
            return response.data;
        });
    },
    lineList: function (params, pid) {
        let url = '/nb/lines';
        if (pid !== undefined) { url = `/nb/planes/${pid}`; }
        return Axios.get(url, { params }).then((response) => {
            return response.data;
        });
    },
    row: function (id) {
        return Axios.get(`/nb/bits/${id}`).then((response) => {
            return response.data;
        });
    },
    edit: function (params) {
        return Axios.post('/nb/bits', params).then((response) => {
            return response.data;
        });
    },
    del: function (params) {
        return Axios.delete('/nb/bits', { params }).then((response) => {
            return response.data;
        });
    }
    
};