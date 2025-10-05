const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import template processor
const TemplateProcessor = require('./src/templateProcessor');

// Routes
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'AVADA Template Processor',
    domain: req.get('host')
  });
});

app.get('/config', async (req, res) => {
  try {
    const configPath = path.join(__dirname, 'config', 'default.json');
    const config = await fs.readJson(configPath);
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load configuration' });
  }
});

app.post('/config', async (req, res) => {
  try {
    const configPath = path.join(__dirname, 'config', 'default.json');
    await fs.writeJson(configPath, req.body, { spaces: 2 });
    res.json({ success: true, message: 'Configuration saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save configuration' });
  }
});

app.post('/process', async (req, res) => {
  try {
    const { eventData, templateType = 'default' } = req.body;
    
    if (!eventData) {
      return res.status(400).json({ error: 'Event data is required' });
    }

    const processor = new TemplateProcessor();
    const result = await processor.processTemplate(eventData, templateType);
    
    res.json({
      success: true,
      result: result,
      message: 'Template processed successfully'
    });
  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process template',
      details: error.message 
    });
  }
});

app.get('/templates', async (req, res) => {
  try {
    const templatesDir = path.join(__dirname, 'templates');
    const files = await fs.readdir(templatesDir);
    const templates = files
      .filter(file => file.endsWith('.html'))
      .map(file => ({
        name: file.replace('.html', ''),
        filename: file,
        path: path.join(templatesDir, file)
      }));
    
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load templates' });
  }
});

app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'output', filename);
  
  res.download(filepath, (err) => {
    if (err) {
      res.status(404).json({ error: 'File not found' });
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AVADA Template Processor running on port ${PORT}`);
  console.log(`📱 Access the application at: http://localhost:${PORT}`);
  console.log(`🌐 For production, deploy to: https://comm-it.ro`);
});

module.exports = app;
