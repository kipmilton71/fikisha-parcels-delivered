import { supabase } from '@/integrations/supabase/real-client';

export interface FikishaDeliveryTask {
  id: string;
  tracking_code: string;
  sender_id: string;
  receiver_name: string;
  receiver_phone: string;
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  delivery_address: string;
  delivery_latitude: number;
  delivery_longitude: number;
  package_description: string;
  delivery_amount: number;
  status: 'pending' | 'accepted' | 'picked_up' | 'out_for_delivery' | 'delivered' | 'cancelled';
  confirmation_code: string;
  estimated_delivery_time?: string;
  picked_up_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
  
  // Additional fields for integration
  vendor_whatsapp?: string;
  customer_whatsapp?: string;
  vendor_county?: string;
  vendor_constituency?: string;
  vendor_ward?: string;
  customer_county?: string;
  customer_constituency?: string;
  customer_ward?: string;
  distance_km: number;
  original_order_id: string;
}

export class DeliveryTasksAPI {
  // Create a new delivery task from ecommerce website
  static async createDeliveryTask(taskData: FikishaDeliveryTask): Promise<{ success: boolean; data?: any; error?: string; trackingCode?: string }> {
    try {
      // Generate tracking and confirmation codes
      const trackingCode = taskData.tracking_code || this.generateTrackingCode();
      const confirmationCode = taskData.confirmation_code || this.generateConfirmationCode();

      const { data, error } = await supabase
        .from('orders')
        .insert({
          tracking_code: trackingCode,
          sender_id: taskData.sender_id,
          receiver_name: taskData.receiver_name,
          receiver_phone: taskData.receiver_phone,
          pickup_address: taskData.pickup_address,
          pickup_latitude: taskData.pickup_latitude,
          pickup_longitude: taskData.pickup_longitude,
          delivery_address: taskData.delivery_address,
          delivery_latitude: taskData.delivery_latitude,
          delivery_longitude: taskData.delivery_longitude,
          package_description: taskData.package_description,
          delivery_amount: taskData.delivery_amount,
          status: 'pending',
          confirmation_code: confirmationCode,
          estimated_delivery_time: taskData.estimated_delivery_time,
          // Store additional integration data in package_description or create a separate field
          total_amount: taskData.delivery_amount
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Store additional integration data in a separate table or JSON field
      // For now, we'll store it in the package_description as JSON
      const integrationData = {
        vendor_whatsapp: taskData.vendor_whatsapp,
        customer_whatsapp: taskData.customer_whatsapp,
        vendor_county: taskData.vendor_county,
        vendor_constituency: taskData.vendor_constituency,
        vendor_ward: taskData.vendor_ward,
        customer_county: taskData.customer_county,
        customer_constituency: taskData.customer_constituency,
        customer_ward: taskData.customer_ward,
        distance_km: taskData.distance_km,
        original_order_id: taskData.original_order_id,
        isa_delivery_id: taskData.id
      };

      // Update the order with integration data
      await supabase
        .from('orders')
        .update({
          package_description: JSON.stringify({
            description: taskData.package_description,
            integration_data: integrationData
          })
        })
        .eq('id', data.id);

      return { success: true, data, trackingCode };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Get available delivery tasks for drivers
  static async getAvailableTasks(): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .is('driver_id', null)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      // Parse integration data from package_description
      const tasksWithIntegrationData = data?.map(task => {
        try {
          const packageData = JSON.parse(task.package_description || '{}');
          return {
            ...task,
            package_description: packageData.description || task.package_description,
            integration_data: packageData.integration_data || {}
          };
        } catch {
          return task;
        }
      });

      return { success: true, data: tasksWithIntegrationData };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Accept a delivery task
  static async acceptTask(taskId: string, driverId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          driver_id: driverId,
          status: 'accepted'
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Update task status
  static async updateTaskStatus(
    taskId: string, 
    status: string, 
    additionalData?: any
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const updateData: any = { status };
      
      if (status === 'picked_up') {
        updateData.picked_up_at = new Date().toISOString();
      } else if (status === 'delivered') {
        updateData.delivered_at = new Date().toISOString();
      }

      if (additionalData) {
        Object.assign(updateData, additionalData);
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', taskId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Get task by ID
  static async getTaskById(taskId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Parse integration data
      try {
        const packageData = JSON.parse(data.package_description || '{}');
        return {
          success: true,
          data: {
            ...data,
            package_description: packageData.description || data.package_description,
            integration_data: packageData.integration_data || {}
          }
        };
      } catch {
        return { success: true, data };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Get driver's tasks
  static async getDriverTasks(driverId: string): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('driver_id', driverId)
        .in('status', ['accepted', 'picked_up', 'out_for_delivery'])
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      // Parse integration data
      const tasksWithIntegrationData = data?.map(task => {
        try {
          const packageData = JSON.parse(task.package_description || '{}');
          return {
            ...task,
            package_description: packageData.description || task.package_description,
            integration_data: packageData.integration_data || {}
          };
        } catch {
          return task;
        }
      });

      return { success: true, data: tasksWithIntegrationData };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Generate tracking code
  private static generateTrackingCode(): string {
    return 'FKS' + Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  // Generate confirmation code
  private static generateConfirmationCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Complete delivery with tracking code verification
  static async completeDeliveryWithTrackingCode(
    taskId: string, 
    trackingCode: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // First verify the tracking code matches
      const { data: task, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', taskId)
        .single();

      if (fetchError) {
        return { success: false, error: 'Task not found' };
      }

      if (task.tracking_code !== trackingCode) {
        return { success: false, error: 'Invalid tracking code' };
      }

      // Update task status to delivered
      const { data, error } = await supabase
        .from('orders')
        .update({
          status: 'delivered',
          delivered_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

