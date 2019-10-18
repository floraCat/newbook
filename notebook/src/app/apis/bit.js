export const Bit = {
    row: function (id) {
        return Axios.get(`/nb/bits/${id}`).then((response) => {
            return response.data;
        });
    },
    list: function (params) {
        return Axios.get('/nb/bits', { params }).then((response) => {
            return response.data;
        });
    },
    edit: function (params) {
        return Axios.post('/nb/bits', params).then((response) => {
            return response.data;
        });
    },
    del: function (params) {
        let url = `/nb/bits/${params.ids}`;
        return Axios.delete(url).then((response) => {
            return response.data;
        });
    },
    sort: function (params) {
        return Axios.post('/nb/bits/sort', params).then((response) => {
            return response.data;
        });
    }
};