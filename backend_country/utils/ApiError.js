class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        error=[],
        stack=""
    ){
        super();
        this.message=message
        this.statusCode=statusCode
        this.error=error
        this.data=null
        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor);
        }
    }
}

export {ApiError}