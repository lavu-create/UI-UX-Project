// backend/middleware/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
    console.error("💥 ERROR:", err.message);

    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    });
};

module.exports = { errorHandler };