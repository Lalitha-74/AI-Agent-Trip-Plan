const DEFAULT_N8N_FORM_URL = 'https://lalitha-22.app.n8n.cloud/form/d5cd234c-64d2-42e0-abe6-b11dd1d15aa8';

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    } = req.body || {};

    if (!name || !email || !travellingFrom || !destination || !startDate || !numberOfDays || !travelers || !budget) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required fields.',
      });
    }

    const postUrl = customWebhookUrl?.trim() || DEFAULT_N8N_FORM_URL;

    // Construct FormData matching n8n form fields exactly:
    const formData = new FormData();
    formData.append('field-0', String(name).trim());
    formData.append('field-1', String(email).trim());
    formData.append('field-2', String(travellingFrom).trim());
    formData.append('field-3', String(destination).trim());
    formData.append('field-4', String(startDate).trim());
    formData.append('field-5', String(numberOfDays).trim());
    formData.append('field-6', String(travelers).trim());
    formData.append('field-7', String(budget).trim());

    // Also append readable keys
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
    return res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred while contacting n8n.',
    });
  }
}
