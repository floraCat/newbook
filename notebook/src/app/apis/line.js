export const Line = {
    row: function (id) {
        return Axios.get(`${$prePath}/lines/${id}`).then((response) => {
            return response.data;
        });
    },
    list: function (params) {
        return Axios.get(`${$prePath}/lines`, { params }).then((response) => {
            return response.data;
        });
    },
    edit: function (params) {
        return Axios.post(`${$prePath}/lines`, params).then((response) => {
            return response.data;
        });
    },
    del: function (params) {
        let url = `${$prePath}/lines/${params.ids}`;
        return Axios.delete(url).then((response) => {
            return response.data;
        });
    },
    sort: function (params) {
        return Axios.post(`${$prePath}/lines/sort`, params).then((response) => {
            return response.data;
        });
    }
};

