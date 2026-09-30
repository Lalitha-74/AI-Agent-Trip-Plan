export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'healthy',
    service: 'VoyageAI Server',
    n8nConnected: true,
    time: new Date().toISOString(),
  });
}
