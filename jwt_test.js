const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'supersecretbeathubkey123';
const id = '6655c65f0123456789abcdef';

console.log('Secret:', secret);
const token = jwt.sign({ id }, secret, { expiresIn: '7d' });
console.log('Token:', token);

try {
  const decoded = jwt.verify(token, secret);
  console.log('Decoded:', decoded);
} catch (e) {
  console.error('Error:', e);
}
