import CustomError from "./customError.js"
export class NotfoundError extends CustomError {
    constructor(message)
    {
        super(message);
        this.statusCode = 404;
    }
}