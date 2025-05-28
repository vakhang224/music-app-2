
const request = require('supertest');
const app = require('../Routes/Account'); // Đường dẫn đến app.js của bạn

describe('POST /account', () => {
    it('should return a success message with name and age', async () => {
        const response = await request(app)
            .post('/api/test')
            .send({ name: 'John', age: 25 });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Hello John, you are 25 years old!');
    });

    it('should return an error if name or age is missing', async () => {
        const response = await request(app)
            .post('/api/test')
            .send({ name: 'John' }); // thiếu tuổi
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Name and age are required!');
    });
});
