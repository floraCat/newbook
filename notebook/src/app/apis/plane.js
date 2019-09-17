export const Plane = {
    list: function () {
        return Axios.get('/nb/planes').then((response) => {
            return response.data;
        });
    },
    row: function (id) {
        return Axios.get(`/nb/planes/${id}`).then((response) => {
            return response.data;
        });
    },
    edit: function (params) {
        return Axios.post('/nb/planes', params).then((response) => {
            return response.data;
        });
    },
    del: function (params) {
        return Axios.delete('/nb/planes', { params }).then((response) => {
            return response.data;
        });
    },
    // mod: function (params) {
    //     return Axios.put('/nb/planes', params).then((response) => {
    //         return response.data;
    //     });
    // },
};

