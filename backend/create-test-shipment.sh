#!/bin/bash

# Create test shipment with in_transit status
# This script uses the API to create a shipment and set it to in_transit

echo "🚀 Creating test shipment with in_transit status..."
echo ""

# Login as warehouse user to get token
echo "📝 Logging in as warehouse user..."
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "warehouse@example.com",
    "password": "warehouse123"
  }' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Login failed. Please make sure warehouse@example.com exists."
    echo "   Register at: http://localhost:8080/register"
    exit 1
fi

echo "✅ Login successful!"
echo ""

# Create shipment
echo "📦 Creating shipment..."
SHIPMENT_RESPONSE=$(curl -s -X POST http://localhost:3001/api/shipments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "shipment_name": "Electronics Shipment - TRACKING TEST",
    "weight_kg": 500,
    "volume_m3": 2.5,
    "destination_city": "Delhi",
    "destination_state": "Delhi",
    "destination_latitude": 28.6139,
    "destination_longitude": 77.2090,
    "estimated_distance_km": 350,
    "delivery_deadline": "'$(date -u -v+3d +"%Y-%m-%dT%H:%M:%S.000Z")'",
    "priority": "high"
  }')

SHIPMENT_ID=$(echo $SHIPMENT_RESPONSE | grep -o '"shipmentId":[0-9]*' | cut -d':' -f2)

if [ -z "$SHIPMENT_ID" ]; then
    echo "❌ Failed to create shipment"
    echo "Response: $SHIPMENT_RESPONSE"
    exit 1
fi

echo "✅ Shipment created! ID: $SHIPMENT_ID"
echo ""

# Update status to in_transit (using SQL through a custom endpoint or manually)
echo "🚛 Setting status to in_transit..."
echo ""
echo "⚠️  Note: The shipment is created as 'pending'"
echo "   To set it to 'in_transit', you need to:"
echo "   1. Get truck recommendations"
echo "   2. Request a booking"
echo "   3. Have dealer approve it"
echo "   4. Status will automatically change to 'in_transit'"
echo ""
echo "📍 Quick access:"
echo "   Shipment List: http://localhost:8080/shipments"
echo "   Direct Tracking: http://localhost:8080/shipments/$SHIPMENT_ID/track"
echo ""
echo "🎉 Test shipment created successfully!"
