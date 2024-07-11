
function errorHandler(err, req, res, next) {
    // Trả về một thông báo lỗi cho client
    res.json({
        message: err.message,
        data: null,
        error: err.status || 500,
        paginate: null
    });
}
  
  module.exports = errorHandler;