export const Plane = {
    row: function (id) {
        return Axios.get(`${$prePath}/planes/${id}`).then((response) => {
            return response.data;
        });
    },
    list: function (params) {
        return Axios.get(`${$prePath}/planes`, { params }).then((response) => {
            return response.data;
        });
    },
    edit: function (params) {
        return Axios.post(`${$prePath}/planes`, params).then((response) => {
            return response.data;
        });
    },
    del: function (params) {
        let url = `${$prePath}/planes/${params.ids}`;
        return Axios.delete(url).then((response) => {
            return response.data;
        });
    }
};

