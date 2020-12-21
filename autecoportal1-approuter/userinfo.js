
const appPedidos = require('@sap/approuter');
let ap = appPedidos()
const jwtDecode = require('jwt-decode');

ap.beforeRequestHandler.use((req, res, next)) => {
  console.log("The following request was made...");
  console.log("Method: ", req.method)
  console.log("URL: "  ,req.url)
   next()
})

ap.beforeRequestHandler.use('/getUserInformation', (req, res, next)) => {
    res.statusCode = 200;
    Response.END(
        jSON.stringify({
            decodedJWTToken  
        }))
})
ap.start();