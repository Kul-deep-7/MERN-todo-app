class ApiError extends Error { //ApiError is your custom error. Error is JavaScript’s built-in error class
    //You are not reinventing error handling. You are building on top of JS Error instead of throwing random strings.
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack = ""
        //constructor is a special method for creating and initializing an object created within a class.
        //runs automatically when we "throw new ApiError()"
        //A constructor runs when you create a new object. EG:new ApiError(404, "User not found")

    ){
        super(message) //super() invokes(calls) the parent class constructor.
        //this refers to ONE object that contains properties from BOTH parent AND child, but there's a hierarchy:1. Parent Properties Come FIRST (via super()). 2. Then You Add YOUR Properties

        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {ApiError}