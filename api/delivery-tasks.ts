import { APIRoutes } from '../src/api/routes';

export default async function handler(req: any, res: any) {
  try {
    const response = await APIRoutes.handleRequest(req);
    
    // Convert Response to Express-like response
    const body = await response.text();
    const status = response.status;
    const headers = Object.fromEntries(response.headers.entries());
    
    res.status(status);
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    res.send(body);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}


