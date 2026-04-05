function success(data = null, message = "success") {
    return {
        code: 200,
        message,
        data,
    };
}

function fail(message = "fail", code = 500) {
    return {
        code,
        message,
        data: null,
    };
}

module.exports = {
    success,
    fail,
};