import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DeliveryTask {
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
  confirmation_code: string;
  estimated_delivery_time?: string;
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
  isa_delivery_id?: string;
}

function generateTrackingCode(): string {
  return 'FKS' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function generateConfirmationCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    console.log(`[${method}] ${path}`);

    // POST /delivery-tasks - Create new delivery task from ecommerce
    if (path === '/delivery-tasks' && method === 'POST') {
      const taskData: DeliveryTask = await req.json();
      
      console.log('Creating delivery task:', taskData);

      // Generate codes if not provided
      const trackingCode = taskData.tracking_code || generateTrackingCode();
      const confirmationCode = taskData.confirmation_code || generateConfirmationCode();

      // Insert into orders table
      const { data, error } = await supabaseClient
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
          package_description: JSON.stringify({
            description: taskData.package_description,
            integration_data: {
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
              isa_delivery_id: taskData.isa_delivery_id
            }
          }),
          delivery_amount: taskData.delivery_amount,
          total_amount: taskData.delivery_amount,
          status: 'pending',
          confirmation_code: confirmationCode,
          estimated_delivery_time: taskData.estimated_delivery_time
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating delivery task:', error);
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Delivery task created successfully:', data);

      return new Response(
        JSON.stringify({ success: true, data, trackingCode }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /delivery-tasks - Get available tasks
    if (path === '/delivery-tasks' && method === 'GET') {
      const { data, error } = await supabaseClient
        .from('orders')
        .select('*')
        .is('driver_id', null)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, data }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Endpoint not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
