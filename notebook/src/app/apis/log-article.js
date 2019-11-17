export const LogArticle = {
    row: function (id) {
        return Axios.get(`${$prePath}/log/article/${id}`).then((response) => {
            return response.data;
        });
    },
    list: function (params) {
        return Axios.get(`${$prePath}/log/article`, { params }).then((response) => {
            return response.data;
        });
    },
    edit: function (params) {
        return Axios.post(`${$prePath}/log/article`, params).then((response) => {
            return response.data;
        });
    },
    del: function (params) {
        let url = `${$prePath}/log/article/${params.ids}`;
        return Axios.delete(url).then((response) => {
            return response.data;
        });
    }
};

