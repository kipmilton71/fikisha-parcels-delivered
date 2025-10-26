// Test script for Fikisha integration
const testDeliveryTask = {
  id: 'test-delivery-123',
  tracking_code: 'ISA12345678',
  sender_id: 'test-vendor-id',
  receiver_name: 'Test Customer',
  receiver_phone: '+254712345678',
  pickup_address: 'Test Vendor Location, Nairobi',
  pickup_latitude: -1.2921,
  pickup_longitude: 36.8219,
  delivery_address: 'Test Customer Location, Nairobi',
  delivery_latitude: -1.2634,
  delivery_longitude: 36.8050,
  package_description: 'Test Order #12345',
  delivery_amount: 250,
  status: 'pending',
  confirmation_code: 'TEST123',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  
  // Integration data
  vendor_whatsapp: '+254700000001',
  customer_whatsapp: '+254700000002',
  vendor_county: 'Nairobi',
  vendor_constituency: 'Westlands',
  vendor_ward: 'Parklands',
  customer_county: 'Nairobi',
  customer_constituency: 'Langata',
  customer_ward: 'Karen',
  distance_km: 15.5,
  original_order_id: 'test-order-123'
};

async function testIntegration() {
  const API_URL = 'http://localhost:3001/api';
  
  console.log('🧪 Testing Fikisha Integration...\n');
  
  try {
    // Test 1: Create delivery task
    console.log('1️⃣ Creating test delivery task...');
    const createResponse = await fetch(`${API_URL}/delivery-tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testDeliveryTask)
    });
    
    if (createResponse.ok) {
      const createResult = await createResponse.json();
      console.log('✅ Delivery task created successfully');
      console.log('   Task ID:', createResult.data?.id);
    } else {
      const error = await createResponse.text();
      console.log('❌ Failed to create delivery task:', error);
      return;
    }
    
    // Test 2: Get available tasks
    console.log('\n2️⃣ Fetching available tasks...');
    const getResponse = await fetch(`${API_URL}/delivery-tasks`);
    
    if (getResponse.ok) {
      const getResult = await getResponse.json();
      console.log('✅ Available tasks fetched successfully');
      console.log('   Number of tasks:', getResult.data?.length || 0);
      
      if (getResult.data?.length > 0) {
        const task = getResult.data[0];
        console.log('   Sample task:');
        console.log('   - Tracking Code:', task.tracking_code);
        console.log('   - Receiver:', task.receiver_name);
        console.log('   - Amount:', task.delivery_amount);
        console.log('   - Vendor WhatsApp:', task.integration_data?.vendor_whatsapp);
        console.log('   - Customer WhatsApp:', task.integration_data?.customer_whatsapp);
        console.log('   - Vendor Location:', task.integration_data?.vendor_county, task.integration_data?.vendor_constituency);
        console.log('   - Customer Location:', task.integration_data?.customer_county, task.integration_data?.customer_constituency);
      }
    } else {
      const error = await getResponse.text();
      console.log('❌ Failed to fetch available tasks:', error);
    }
    
    // Test 3: Health check
    console.log('\n3️⃣ Checking API health...');
    const healthResponse = await fetch('http://localhost:3001/health');
    
    if (healthResponse.ok) {
      const health = await healthResponse.json();
      console.log('✅ API is healthy');
      console.log('   Status:', health.status);
      console.log('   Timestamp:', health.timestamp);
    } else {
      console.log('❌ API health check failed');
    }
    
    console.log('\n🎉 Integration test completed!');
    console.log('\nNext steps:');
    console.log('1. Start the Fikisha frontend: npm run dev');
    console.log('2. Open http://localhost:5174');
    console.log('3. Login as a driver');
    console.log('4. Check the "Available Orders" tab');
    console.log('5. You should see the test delivery task with WhatsApp contact buttons');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\nMake sure the Fikisha API server is running:');
    console.log('npm run server');
  }
}

// Run the test
testIntegration();


