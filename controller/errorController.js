class errorHandling extends Error{
    constructor(message,statusCode){
        super(message)
        this.statusCode=statusCode
        this.status=`${statusCode}`.startsWith("4")?"fali":"error"
    }
}
export default errorHandling