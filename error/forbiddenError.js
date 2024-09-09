class UnauthorizedError extends Error{
    constructor(message)
    {
        super(message);
        this.name = "Unauthorized";
        this.statusCode = 401;
    }
}
class ForbiddenError extends Error{
    constructor(message)
    {
        super(message);
        this.name = "Forbidden";
        this.statusCode = 403;
    }
}

export {UnauthorizedError, ForbiddenError};