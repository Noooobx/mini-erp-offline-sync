curl -v -X POST http://localhost:5000/sync/push \
  -H "Content-Type: application/json" \
  -d '{"events":[{"action":"CREATE","table":"products","data":{"id":"test-1234-5678-9abc-def012345678","name":"CURL TEST PRODUCT","barcode":"CURL001","price":100,"stock_qty":10,"is_deleted":false},"timestamp":"2026-05-21T03:55:00.000Z"}]}'
