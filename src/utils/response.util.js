class response {
    static success(res, status, message, data) {
      res.status(status).send({
        message,
        data,
      });
    }
  }
  
  export default response;