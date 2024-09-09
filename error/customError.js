/**
 * customError is a custom error class that extends built in Error class
 * It allows for creating  custom error message and can be used to throw custom errors.
 *  @constructor
 * @param {string} message The error message to be displayed when the error is thrown.
 */

export default class CustomError extends Error {
    /**
     * @constructor
     * @param {string} message
     */
    constructor(message) {
        //call the superclass constructor with the provided message.
        super(message);
    }
}