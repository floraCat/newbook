export const Plane = {
    row: function (id) {
        return Axios.get(`/nb/planes/${id}`).then((response) => {
            return response.data;
        });
    },
    list: function (params) {
        return Axios.get('/nb/planes', { params }).then((response) => {
            return response.data;
        });
    },
    edit: function (params) {
        return Axios.post('/nb/planes', params).then((response) => {
            return response.data;
        });
    },
    del: function (params) {
        let url = `/nb/planes/${params.ids}`;
        return Axios.delete(url).then((response) => {
            return response.data;
        });
    }
};

