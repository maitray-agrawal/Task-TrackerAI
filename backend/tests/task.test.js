// Set environment variables before any imports
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/taskflow_test';

import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import Task from '../models/task.model.js';

describe('TaskFlow Pro API Integration Tests', () => {
  let createdTaskId;

  beforeAll(async () => {
    // Ensure database is connected and clean before running tests
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    await Task.deleteMany({});
  });

  afterAll(async () => {
    // Clear tests tasks collection and close db connection
    await Task.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/tasks', () => {
    it('should fail to create a task when title is missing', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          description: 'Testing task validation',
          category: 'Work',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should create a task successfully with valid parameters', async () => {
      const taskPayload = {
        title: 'Run Jest Integration Tests',
        description: 'Ensure backend API endpoints work properly under load',
        category: 'Work',
        priority: 'High',
        dueDate: new Date(Date.now() + 86400000).toISOString(), // tomorrow
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskPayload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(taskPayload.title);
      expect(response.body.data.status).toBe('Pending');
      
      createdTaskId = response.body.data._id;
    });
  });

  describe('GET /api/tasks', () => {
    it('should return a paginated list of tasks', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.tasks)).toBe(true);
      expect(response.body.data.tasks.length).toBeGreaterThan(0);
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should filter tasks by category', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .query({ category: 'Work' });

      expect(response.status).toBe(200);
      expect(response.body.data.tasks.every(t => t.category === 'Work')).toBe(true);
    });

    it('should search tasks safely including special regex characters', async () => {
      await request(app)
        .post('/api/tasks')
        .send({
          title: 'SearchQueryUniqueXYZ',
          description: 'Special character task (test-search)*',
          category: 'Work',
          priority: 'High',
          dueDate: new Date(Date.now() + 86400000).toISOString(),
        });

      const response = await request(app)
        .get('/api/tasks')
        .query({ q: 'SearchQueryUniqueXYZ' });

      expect(response.status).toBe(200);
      expect(response.body.data.tasks.length).toBe(1);

      const regexResponse = await request(app)
        .get('/api/tasks')
        .query({ q: '(test-search)*' });

      expect(regexResponse.status).toBe(200);
      expect(regexResponse.body.data.tasks.length).toBe(1);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return 400 for an invalid MongoDB ObjectId', async () => {
      const response = await request(app)
        .get('/api/tasks/invalid-id-format');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 404 for a non-existent task ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .get(`/api/tasks/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should retrieve the created task by ID', async () => {
      const response = await request(app)
        .get(`/api/tasks/${createdTaskId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(createdTaskId);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update task details successfully', async () => {
      const updatePayload = {
        title: 'Updated Test Title',
        priority: 'Low',
        category: 'Personal',
        dueDate: new Date(Date.now() + 172800000).toISOString(), // day after tomorrow
      };

      const response = await request(app)
        .put(`/api/tasks/${createdTaskId}`)
        .send(updatePayload);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updatePayload.title);
      expect(response.body.data.priority).toBe('Low');
      expect(response.body.data.category).toBe('Personal');
    });
  });

  describe('PATCH /api/tasks/:id/status', () => {
    it('should return 400 when status parameter is invalid', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${createdTaskId}/status`)
        .send({ status: 'invalid_status_type' });

      expect(response.status).toBe(400);
    });

    it('should update the task status successfully', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${createdTaskId}/status`)
        .send({ status: 'Completed' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('Completed');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete the task successfully', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${createdTaskId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify that the task is actually deleted
      const checkResponse = await request(app)
        .get(`/api/tasks/${createdTaskId}`);
      expect(checkResponse.status).toBe(404);
    });
  });
});
