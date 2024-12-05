import express from 'express';

const port = 8080;

const app = express();

app.post('/user', (req, res) => {
  const user = req.body;

  if (!user) {
    return res.status(400).json({ error: 'No user provided' });
  }

  return res.status(201).json(user);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
