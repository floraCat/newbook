export const Line = {
    list: function () {
        return Axios.get('/nb/lines').then((response) => {
            return response.data;
        });
    },
    row: function (id) {
        return Axios.get(`/nb/lines/${id}`).then((response) => {
            return response.data;
        });
    },
    edit: function (params) {
        return Axios.post('/nb/lines', params).then((response) => {
            return response.data;
        });
    },
    del: function (params) {
        return Axios.delete('/nb/lines', { params }).then((response) => {
            return response.data;
        });
    }
};

