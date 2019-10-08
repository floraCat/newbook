export const Line = {
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
        let url = `/nb/lines/${params.ids}`;
        return Axios.delete(url).then((response) => {
            return response.data;
        });
    }
};

