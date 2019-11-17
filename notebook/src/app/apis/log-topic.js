export const LogTopic = {
    list: function (params) {
        return Axios.get(`${$prePath}/log/topic`, { params }).then((response) => {
            return response.data;
        });
    }
};

