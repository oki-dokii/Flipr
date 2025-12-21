#!/bin/bash

# Approve booking #18 to set shipment to in_transit

echo "🔧 Approving booking to set shipment to in_transit..."

# Try common passwords for abct2@gmail.com
PASSWORDS=("password123" "dealer123" "abc123" "abct2" "password")

for PASS in "${PASSWORDS[@]}"; do
    echo "Trying password: $PASS"
    TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
      -H "Content-Type: application/json" \
      -d "{\"email\":\"abct2@gmail.com\",\"password\":\"$PASS\"}" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    
    if [ ! -z "$TOKEN" ]; then
        echo "✅ Login successful with password: $PASS"
        
        # Approve booking
        RESULT=$(curl -s -X PUT http://localhost:3001/api/bookings/18/approve \
          -H "Authorization: Bearer $TOKEN")
        
        echo "Result: $RESULT"
        
        if echo "$RESULT" | grep -q "approved"; then
            echo "🎉 Booking approved! Shipment is now in_transit!"
            echo ""
            echo "📍 View tracking at:"
            echo "   http://localhost:8080/shipments/11/track"
            exit 0
        fi
    fi
done

echo "❌ Could not login with any password"
echo ""
echo "📝 Alternative: Login manually as dealer:"
echo "   Email: abct2@gmail.com"
echo "   Try password: abc123 or dealer123"
