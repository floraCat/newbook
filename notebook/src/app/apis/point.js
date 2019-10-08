export const Point = {
    row: function (id) {
        return Axios.get(`/nb/points/${id}`).then((response) => {
            return response.data;
        });
    },
    edit: function (params) {
        return Axios.post('/nb/points', params).then((response) => {
            return response.data;
        });
    },
    del: function (params) {
        let url = `/nb/points/${params.ids}`;
        return Axios.delete(url).then((response) => {
            return response.data;
        });
    }
};
