const jsonServer = require('json-server');
const fs         = require('fs');

const server      = jsonServer.create();
const router      = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares); // ← contient le body parser
server.use(jsonServer.bodyParser); // ← ajoute explicitement le parser JSON

server.use(jsonServer.rewriter({
  '/api/v1/*': '/$1',
}));

server.use((req, res, next) => {
  if (req.method === 'POST' && req.path === '/users') {
    const { nom, prenom, email, motDePasse } = req.body;

    if (!nom || !prenom || !email || !motDePasse) {
      return res.status(422).json({ message: 'Champs requis manquants' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(422).json({ message: 'Email invalide' });
    }

    if (motDePasse.length < 8) {
      return res.status(422).json({ message: 'Minimum 8 caractères' });
    }

    const db = JSON.parse(fs.readFileSync('./db.json', 'utf-8'));
    if (db.users.find(u => u.email === email)) {
      return res.status(409).json({ message: 'Email déjà utilisé' });
    }

    req.body.createdAt = new Date().toISOString();
    delete req.body.motDePasse;
  }
  next();
});

server.use(router);

server.listen(3001, () => {
  console.log('Mock API running on http://localhost:3001');
});