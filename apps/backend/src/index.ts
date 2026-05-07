import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import shortenRouter from './routes/shorten.js';
import redirectRouter from './routes/redirect.js';
import statsRouter from './routes/stats.js';

const app = express();
app.use(express.json());

app.use(shortenRouter);
app.use(statsRouter);
app.use(redirectRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => console.log(`Backend running on :${PORT}`));
