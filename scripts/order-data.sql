-- Agregando dos órdenes, una para cada cliente registrado
INSERT INTO "order" (id, "userId", "totalAmount", "shippingAddress", "status", "paymentDetails")
VALUES
  (
    '55555555-5555-5555-5555-555555555551',
    '11111111-1111-1111-1111-111111111113', -- Client One
    146000,
    '{"street": "Calle 123", "city": "Ciudad Uno", "state": "Estado Uno", "country": "País Uno", "zipCode": "12345"}',
    'PENDING',
    '{"method": "Credit Card", "transactionId": "txn12345", "status": "Pending"}'
  ),
  (
    '55555555-5555-5555-5555-555555555552',
    '11111111-1111-1111-1111-111111111114', -- Client Two
    60000,
    '{"street": "Avenida 456", "city": "Ciudad Dos", "state": "Estado Dos", "country": "País Dos", "zipCode": "67890"}',
    'PENDING',
    '{"method": "PayPal", "transactionId": "txn67890", "status": "Pending"}'
  );