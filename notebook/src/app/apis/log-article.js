export const LogArticle = {
    row: function (id) {
        return Axios.get(`/nb/log/article/${id}`).then((response) => {
            return response.data;
        });
    },
    list: function (params) {
        return Axios.get('/nb/log/article', { params }).then((response) => {
            return response.data;
        });
    },
    edit: function (params) {
        return Axios.post('/nb/log/article', params).then((response) => {
            return response.data;
        });
    },
    del: function (params) {
        let url = `/nb/log/article/${params.ids}`;
        return Axios.delete(url).then((response) => {
            return response.data;
        });
    }
};

