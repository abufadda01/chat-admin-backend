
const errorMiddleware = (err , req , res , next) => {

    let defaultErrorObj = {
        statusCode : err.status || 500 ,
        msg : err.message || "Smth went wrong"
    }

    res.status(defaultErrorObj.statusCode).json({
        success : false ,
        msg : defaultErrorObj.msg ,
    })

}


module.exports = errorMiddleware