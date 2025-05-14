const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const PROGRESS_FILE = path.join(__dirname, 'progress.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Inicializar arquivo de progresso se nu00e3o existir
if (!fs.existsSync(PROGRESS_FILE)) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify({}));
}

// Rota para obter o progresso atual
app.get('/api/progress', (req, res) => {
  try {
    const progress = JSON.parse(fs.readFileSync(PROGRESS_FILE));
    res.json(progress);
  } catch (error) {
    console.error('Erro ao ler o progresso:', error);
    res.status(500).json({ error: 'Erro ao ler o progresso' });
  }
});

// Rota para salvar o progresso
app.post('/api/progress', (req, res) => {
  try {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(req.body));
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar o progresso:', error);
    res.status(500).json({ error: 'Erro ao salvar o progresso' });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse http://localhost:${PORT} para visualizar a documentau00e7u00e3o`);
});
