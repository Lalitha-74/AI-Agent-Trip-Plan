const DEFAULT_N8N_FORM_URL = 'https://lalitha-22.app.n8n.cloud/form/d5cd234c-64d2-42e0-abe6-b11dd1d15aa8';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const targetUrl = (req.query?.url as string) || DEFAULT_N8N_FORM_URL;
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

    res.status(200).json({
      ok: resp.ok,
      status: resp.status,
      statusText: resp.statusText,
      targetUrl,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(200).json({
      ok: false,
      error: err.message || 'Connection timed out or failed',
      targetUrl,
      timestamp: new Date().toISOString(),
    });
  }
}
