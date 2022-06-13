import express from 'express';
import helmet from "helmet";
import nocache from "nocache";
import cors from "cors";

const app = express();
app.use(helmet());
app.use(nocache());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello world');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
  ######################################
   🎉 Server listening on PORT ${PORT} 🎉
  ######################################
  `);
});
