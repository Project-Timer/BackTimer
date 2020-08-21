let ApplicationError = class ApplicationError extends Error {
    constructor(message, status) {
        super();

        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;

        this.message = message || 'Error Server';
        this.status = status || 500;
    }
};

let UserNotFoundError = class UserNotFoundError extends ApplicationError {
    constructor(message) {
        super(message || 'User token found.');
    }
}
module.exports = UserNotFoundError;
module.exports = ApplicationError;