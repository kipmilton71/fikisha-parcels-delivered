import { DeliveryTasksAPI, FikishaDeliveryTask } from './deliveryTasks';

// API Routes for Fikisha Delivery Website
export class APIRoutes {
  // Handle delivery task creation from ecommerce website
  static async handleDeliveryTaskCreation(req: Request): Promise<Response> {
    try {
      const taskData: FikishaDeliveryTask = await req.json();
      
      // Validate required fields
      if (!taskData.tracking_code || !taskData.receiver_name || !taskData.receiver_phone) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Missing required fields'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const result = await DeliveryTasksAPI.createDeliveryTask(taskData);
      
      return new Response(JSON.stringify(result), {
        status: result.success ? 201 : 400,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Get available delivery tasks
  static async handleGetAvailableTasks(req: Request): Promise<Response> {
    try {
      const result = await DeliveryTasksAPI.getAvailableTasks();
      
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 400,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Accept a delivery task
  static async handleAcceptTask(req: Request): Promise<Response> {
    try {
      const { taskId, driverId } = await req.json();
      
      if (!taskId || !driverId) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Missing taskId or driverId'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const result = await DeliveryTasksAPI.acceptTask(taskId, driverId);
      
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 400,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Update task status
  static async handleUpdateTaskStatus(req: Request): Promise<Response> {
    try {
      const { taskId, status, additionalData } = await req.json();
      
      if (!taskId || !status) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Missing taskId or status'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const result = await DeliveryTasksAPI.updateTaskStatus(taskId, status, additionalData);
      
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 400,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Complete delivery with tracking code
  static async handleCompleteDeliveryWithTrackingCode(req: Request): Promise<Response> {
    try {
      const { taskId, trackingCode } = await req.json();
      
      if (!taskId || !trackingCode) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Missing taskId or trackingCode'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const result = await DeliveryTasksAPI.completeDeliveryWithTrackingCode(taskId, trackingCode);
      
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 400,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Get task by ID
  static async handleGetTaskById(req: Request, taskId: string): Promise<Response> {
    try {
      const result = await DeliveryTasksAPI.getTaskById(taskId);
      
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 404,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Get driver's tasks
  static async handleGetDriverTasks(req: Request, driverId: string): Promise<Response> {
    try {
      const result = await DeliveryTasksAPI.getDriverTasks(driverId);
      
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 400,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Main API handler
  static async handleRequest(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders
      });
    }

    try {
      let response: Response;

      switch (true) {
        case path === '/api/delivery-tasks' && method === 'POST':
          response = await this.handleDeliveryTaskCreation(req);
          break;
        case path === '/api/delivery-tasks' && method === 'GET':
          response = await this.handleGetAvailableTasks(req);
          break;
        case path.startsWith('/api/delivery-tasks/') && method === 'GET':
          const taskId = path.split('/')[3];
          response = await this.handleGetTaskById(req, taskId);
          break;
        case path === '/api/accept-task' && method === 'POST':
          response = await this.handleAcceptTask(req);
          break;
        case path === '/api/update-task-status' && method === 'POST':
          response = await this.handleUpdateTaskStatus(req);
          break;
        case path === '/api/complete-delivery' && method === 'POST':
          response = await this.handleCompleteDeliveryWithTrackingCode(req);
          break;
        case path.startsWith('/api/driver-tasks/') && method === 'GET':
          const driverId = path.split('/')[3];
          response = await this.handleGetDriverTasks(req, driverId);
          break;
        default:
          response = new Response(JSON.stringify({
            success: false,
            error: 'Endpoint not found'
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
      }

      // Add CORS headers to response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
}

