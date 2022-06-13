import express from 'express';
import helmet from "helmet";

const app = express();
app.use(helmet());

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
