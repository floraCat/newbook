export const Point = {
    list: function () {
        return Axios.get('/nb/points').then((response) => {
            return response.data;
        });
    },
    row: function (id) {
        return Axios.get(`/nb/points/${id}`).then((response) => {
            return response.data;
        });
    },
    edit: function (params) {
        return Axios.post('/nb/points', params).then((response) => {
            return response.data;
        });
    },
    del: function (params) {
        return Axios.delete('/nb/points', { params }).then((response) => {
            return response.data;
        });
    }
};

