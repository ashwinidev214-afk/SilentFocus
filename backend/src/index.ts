import app from './app';

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '127.0.0.1';

app.listen(PORT as number, HOST, () => {
  console.log(`Backend server listening on http://${HOST}:${PORT}`);
});
