-- Actualizar el script de inserción con los UserId de los clientes
INSERT INTO candle (id, name, description, price, "containerId", "aromaId", "imageUrl", "audioUrl", "message", "qrUrl", "userId")
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Vela Relajante',
    'Vela aromática con aroma a Calma Profunda, ideal para momentos de relajación.',
    25000,
    'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380d11',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'https://example.com/vela-relajante.jpg',
    'https://example.com/audio/relajante.mp3',
    'Relájate con esta vela.',
    'https://example.com/qr/relajante',
    '11111111-1111-1111-1111-111111111113' -- Client One
  ),
  (
    '11111111-1111-1111-1111-111111111112',
    'Vela Cítrica Pequeña',
    'Vela aromática con aroma a Vitalidad Cítrica, en un contenedor pequeño.',
    26000,
    'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380d11',
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    'https://example.com/vela-citrica-pequena.jpg',
    'https://example.com/audio/citrica.mp3',
    'Energízate con esta vela.',
    'https://example.com/qr/citrica',
    '11111111-1111-1111-1111-111111111114' -- Client Two
  ),
  (
    '11111111-1111-1111-1111-111111111113',
    'Vela Floral Mediana',
    'Vela aromática con aroma a Nube de Paz, en un contenedor mediano.',
    32000,
    'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380d12',
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'https://example.com/vela-floral-mediana.jpg',
    'https://example.com/audio/floral.mp3',
    'Disfruta de la serenidad floral.',
    'https://example.com/qr/floral',
    '11111111-1111-1111-1111-111111111113' -- Client One
  ),
  (
    '11111111-1111-1111-1111-111111111114',
    'Vela Relajante Mediana',
    'Vela aromática con aroma a Calma Profunda, en un contenedor mediano.',
    34000,
    'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380d12',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'https://example.com/vela-relajante-mediana.jpg',
    'https://example.com/audio/relajante-mediana.mp3',
    'Relájate profundamente.',
    'https://example.com/qr/relajante-mediana',
    '11111111-1111-1111-1111-111111111114' -- Client Two
  ),
  (
    '11111111-1111-1111-1111-111111111115',
    'Vela Energizante Grande',
    'Vela aromática con aroma a Vitalidad Cítrica, en un contenedor mediano.',
    36000,
    'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380d12',
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    'https://example.com/vela-energizante-grande.jpg',
    'https://example.com/audio/energizante.mp3',
    'Llena tu día de energía.',
    'https://example.com/qr/energizante',
    '11111111-1111-1111-1111-111111111113' -- Client One
  );