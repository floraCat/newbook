export const LogTopic = {
    row: function (id) {
        return Axios.get(`/nb/log/topic/${id}`).then((response) => {
            return response.data;
        });
    },
    list: function (params) {
        return Axios.get('/nb/log/topic', { params }).then((response) => {
            return response.data;
        });
    },
    edit: function (params) {
        return Axios.post('/nb/log/topic', params).then((response) => {
            return response.data;
        });
    },
    del: function (params) {
        return Axios.delete('/nb/log/topic', { params }).then((response) => {
            return response.data;
        });
    }
};

