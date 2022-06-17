import './env';
import express from 'express';
import helmet from "helmet";
import nocache from "nocache";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from 'morgan';
import {sequelize} from "./models/db-01";
import {parseBoolean} from "./utils/BooleanUtils";

const app = express();

// Middlewares
app.use(helmet());
app.use(nocache());
app.use(cors());

// Logging(Console)
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Body Parser
app.use(bodyParser.raw());
app.use(bodyParser.text({limit: '4mb'}));
app.use(bodyParser.json({limit: '4mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '4mb'}));

app.use(require('./routes'));

const startServer = () => {
  const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;
  app.listen(PORT, () => {
    console.log(`
  ######################################
   🎉 Server listening on PORT ${PORT} 🎉
  ######################################
  `);

    // Send application is ready
    try {
      // @ts-ignore
      process.send('ready');
    } catch (e) {}
  });
};


/** Authenticate check */
const SKIP_AUTHENTICATE_CHECK = parseBoolean(process.env.SKIP_AUTHENTICATE_CHECK, false);
if (SKIP_AUTHENTICATE_CHECK) {
  startServer();
} else {
  console.info('☑️ Checking Database Authentication');
  sequelize.authenticate().then(() => {
    console.log('✅ Authenticated');
    if (sequelize.getDialect()) console.log('✅', sequelize.getDialect());
    if (sequelize.getDatabaseName()) console.log('✅', sequelize.getDatabaseName());
    startServer();
  }).catch((err) => {
    console.error('Failed to check authenticate', err);
  });
}
