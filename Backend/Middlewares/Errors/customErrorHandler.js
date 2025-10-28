const CustomError = require("../../Helpers/error/CustomError");

const customErrorHandler = (err, req, res, next) => {
    
    // Handle MongoDB Duplicate Key Error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        const message = `Duplicate ${field} value: "${value}". Please use another ${field}.`;
        err = new CustomError(message, 400);
    }

    // Handle Syntax Error
    if (err.name === "SyntaxError") {
        err = new CustomError("Unexpected Syntax", 400);
    }

    // Handle Mongoose Validation Error
    if (err.name === "ValidationError") {
        err = new CustomError(err.message, 400);
    }

    // Handle Invalid ObjectId (CastError)
    if (err.name === "CastError") {
        err = new CustomError("Please provide a valid ID", 400);
    }

    // Handle JWT Expired Error
    if (err.name === "TokenExpiredError") {
        err = new CustomError("JWT expired. Please log in again.", 401);
    }

    // Handle Invalid JWT
    if (err.name === "JsonWebTokenError") {
        err = new CustomError("Invalid token. Please log in again.", 401);
    }

    // Log Error Details for Debugging
    console.log("Custom Error Handler =>", err.name, err.message, err.statusCode);

    // Send Standardized Error Response
    return res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || "Internal Server Error",
    });
};

module.exports = customErrorHandler;
