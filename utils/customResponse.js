class ServerResponse {
  responseOk(code, cause, data) {
    const response = {
      success: true,
      code: code,
      message: cause ? cause : undefined,
      data: data ? data : undefined,
    };
    return response;
  }

  badResponse(code, cause, data) {
    const response = {
      success: false,
      code: code,
      message: cause,
      data: data ? data : undefined,
    };
    return response;
  }
}
const customResponses = new ServerResponse();
module.exports = customResponses;
