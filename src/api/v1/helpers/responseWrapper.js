class Pagination {
    constructor(page = 1, limit = 10, total) {
      this.page = page;
      this.limit = limit;
      this.total = total;
    }
}

class ResponseWrapper {
    constructor(message, data, error, pagination) {
        this.message = message;
        this.data = data;
        this.error = error;
        this.pagination = pagination;
    }
}

module.exports = {
    Pagination,
    ResponseWrapper
}