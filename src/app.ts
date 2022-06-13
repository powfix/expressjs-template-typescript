import express from 'express';
import helmet from "helmet";
import nocache from "nocache";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from 'morgan';

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

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.use(require('./routes'));

const PORT = process.env.PORT || 3000;
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
