class ApiError extends Error {
    constructor(statusCode,message,stack="") {
        super();
        this.statusCode = statusCode;
       
        this.stack = stack;
        this.message = message;
   
     
        this.success = false;
        
    }
}  

export default ApiError;
