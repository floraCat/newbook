export const Point = {
    row: function (id) {
        return Axios.get(`${$prePath}/points/${id}`).then((response) => {
            return response.data;
        });
    },
    list: function (params) {
        return Axios.get(`${$prePath}/points`, { params }).then((response) => {
            return response.data;
        });
    },
    edit: function (params) {
        return Axios.post(`${$prePath}/points`, params).then((response) => {
            return response.data;
        });
    },
    del: function (params) {
        let url = `${$prePath}/points/${params.ids}`;
        return Axios.delete(url).then((response) => {
            return response.data;
        });
    },
    sort: function (params) {
        return Axios.post(`${$prePath}/points/sort`, params).then((response) => {
            return response.data;
        });
    }
};

