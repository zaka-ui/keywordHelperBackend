const express = require('express')
const {setUserRoutes} = require('./app/api/v1/users')
const {setAuthRoutes} = require('./app/api/v1/auth')
const setProjectRoutes  = require('./app/api/v1/project');
const initServer = require('./app/config/init')
const process = require('node:process');
const cookieParser = require('cookie-parser');
const {auth} = require('./app/middlewares/auth')
const {admin} = require('./app/middlewares/admin')
const dotenv = require('dotenv');
const cors = require('cors');
const setResultsRoute = require('./app/api/v1/results');

const baseUrl = process.env.BASE_URL ?? "/api/v1"
const app = express()
const PORT = process.env.PORT || 3000;
const router = express.Router({strict: true}) 




const corsOptions = {
  origin: '*',
};


app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());


//---------Routes ----------
setAuthRoutes(router);
setResultsRoute(router);
setProjectRoutes(router);
router.all('*', auth, admin)
setUserRoutes(router);



//--------endRoutes----------
app.use(baseUrl, router);
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
      return res.status(400).json({
        error: 'Invalid JSON format. Please ensure your JSON is properly formatted.',
        details: err.message,
      });
    }
    next(err); 
  });


if (initServer() !== false){
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
};



