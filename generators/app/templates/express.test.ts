import supertest from "supertest";
import 'jest-extended';
import { app } from '../src/server';

const request = supertest(app);

describe('GET /', () => {
    it('should be a successful response', async () => {
        const response = await request.get('/')
        expect(response.status).toBe(200);
    })
});