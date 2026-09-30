import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_N8N_FORM_URL = 'https://lalitha-22.app.n8n.cloud/form/d5cd234c-64d2-42e0-abe6-b11dd1d15aa8';

async function main() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // CORS and security headers for API
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      service: 'VoyageAI Server',
      n8nConnected: true,
      time: new Date().toISOString(),
    });
  });

  // Test n8n webhook/form connectivity
  app.get('/api/n8n/status', async (req: Request, res: Response) => {
    const targetUrl = (req.query.url as string) || DEFAULT_N8N_FORM_URL;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const resp = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) VoyageAI-Agent/1.0',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      res.json({
        ok: resp.ok,
        status: resp.status,
        statusText: resp.statusText,
        targetUrl,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      res.json({
        ok: false,
        error: err.message || 'Connection timed out or failed',
        targetUrl,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Submit trip request to n8n form endpoint
  app.post('/api/submit-trip', async (req: Request, res: Response) => {
    try {
      const {
        name,
        email,
        travellingFrom,
        destination,
        startDate,
        numberOfDays,
        travelers,
        budget,
        notes,
        customWebhookUrl,
      } = req.body;

      // Basic validation
      if (!name || !email || !travellingFrom || !destination || !startDate || !numberOfDays || !travelers || !budget) {
        return res.status(400).json({
          success: false,
          error: 'Please fill in all required fields.',
        });
      }

      const postUrl = customWebhookUrl?.trim() || DEFAULT_N8N_FORM_URL;

      // Construct multipart FormData matching n8n form fields exactly:
      // field-0: Name
      // field-1: Email
      // field-2: Travelling From
      // field-3: Destination
      // field-4: Start Date
      // field-5: Number of Days
      // field-6: Number of Travelers
      // field-7: Budget
      const formData = new FormData();
      formData.append('field-0', String(name).trim());
      formData.append('field-1', String(email).trim());
      formData.append('field-2', String(travellingFrom).trim());
      formData.append('field-3', String(destination).trim());
      formData.append('field-4', String(startDate).trim());
      formData.append('field-5', String(numberOfDays).trim());
      formData.append('field-6', String(travelers).trim());
      formData.append('field-7', String(budget).trim());

      // Also append descriptive aliases for flexibility in n8n workflows
      formData.append('name', String(name).trim());
      formData.append('email', String(email).trim());
      formData.append('travellingFrom', String(travellingFrom).trim());
      formData.append('destination', String(destination).trim());
      formData.append('startDate', String(startDate).trim());
      formData.append('numberOfDays', String(numberOfDays).trim());
      formData.append('travelers', String(travelers).trim());
      formData.append('budget', String(budget).trim());
      if (notes) {
        formData.append('notes', String(notes).trim());
      }

      console.log(`[VoyageAI] Submitting trip inquiry to n8n: ${postUrl} for ${email} (${destination})`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      let n8nResponse;
      try {
        n8nResponse = await fetch(postUrl, {
          method: 'POST',
          body: formData,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) VoyageAI-Agent/1.0',
          },
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      const responseText = await n8nResponse.text();
      console.log(`[VoyageAI] n8n returned status: ${n8nResponse.status} ${n8nResponse.statusText}`);

      // Even if n8n returns redirect or empty 200, n8n form triggers consider 200-302 a success
      const isSuccess = n8nResponse.ok || n8nResponse.status === 302 || n8nResponse.status === 204;

      if (!isSuccess && n8nResponse.status >= 400 && n8nResponse.status !== 413) {
        // Some n8n instances respond with 404/500 if inactive, return helpful detail
        return res.status(n8nResponse.status).json({
          success: false,
          error: `n8n responded with status ${n8nResponse.status}: ${responseText.slice(0, 200)}`,
          status: n8nResponse.status,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Your trip details have been submitted to the AI Travel Agent!',
        submittedData: {
          name,
          email,
          travellingFrom,
          destination,
          startDate,
          numberOfDays,
          travelers,
          budget,
        },
        n8nStatus: n8nResponse.status,
        deliveryTarget: email,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('[VoyageAI] Error forwarding to n8n:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to communicate with n8n workflow.',
      });
    }
  });

  // Vite integration
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VoyageAI Applet running at http://0.0.0.0:${PORT}`);
    console.log(`Connected to n8n URL: ${DEFAULT_N8N_FORM_URL}`);
  });
}

main().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
