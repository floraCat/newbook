export const Bit = {
    row: function (id) {
        return Axios.get(`${$prePath}/bits/${id}`).then((response) => {
            return response.data;
        });
    },
    list: function (params) {
        return Axios.get(`${$prePath}/bits`, { params }).then((response) => {
            return response.data;
        });
    },
    edit: function (params) {
        return Axios.post(`${$prePath}/bits`, params).then((response) => {
            return response.data;
        });
    },
    del: function (params) {
        let url = `${$prePath}/bits/${params.ids}`;
        return Axios.delete(url).then((response) => {
            return response.data;
        });
    },
    sort: function (params) {
        return Axios.post(`${$prePath}/bits/sort`, params).then((response) => {
            return response.data;
        });
    }
};