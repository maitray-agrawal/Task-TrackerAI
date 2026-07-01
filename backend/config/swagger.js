import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow Pro API Documentation',
      version: '1.0.0',
      description: 'API description for TaskFlow Pro, a modern MERN task management platform',
      contact: {
        name: 'Developer Support',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'Base API Path',
      },
      {
        url: 'http://localhost:5000/api',
        description: 'Development Server API Path',
      },
    ],
    components: {
      schemas: {
        Task: {
          type: 'object',
          required: ['title'],
          properties: {
            id: {
              type: 'string',
              description: 'The auto-generated id of the task',
            },
            title: {
              type: 'string',
              description: 'The task title',
            },
            description: {
              type: 'string',
              description: 'Detailed explanation of the task',
            },
            status: {
              type: 'string',
              enum: ['Pending', 'Completed'],
              default: 'Pending',
              description: 'Completion status of the task',
            },
            priority: {
              type: 'string',
              enum: ['Low', 'Medium', 'High'],
              default: 'Medium',
              description: 'Task priority level',
            },
            category: {
              type: 'string',
              enum: ['Work', 'Personal', 'Shopping', 'Others'],
              default: 'Others',
              description: 'Task category',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Deadline of the task',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
          example: {
            title: 'Design database schema',
            description: 'Create normalized SQL or MongoDB models for the project.',
            status: 'Pending',
            priority: 'High',
            category: 'Work',
            dueDate: '2026-07-15T12:00:00Z',
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Validation failed or resource not found',
            },
            error: {
              type: 'object',
              properties: {
                status: {
                  type: 'integer',
                  example: 400,
                },
                details: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js', './backend/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
