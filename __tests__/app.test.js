const request = require('supertest');
const fs = require('fs');
const app = require('../app'); 
const { saveResultIfRequested } = require('../numberUtils');

let server;

beforeAll(async () => {
  server = await app.listen(3000);
});

afterAll(async () => {
  await server.close();
});

describe('GET /mean', () => {
  
  test('should calculate mean and return JSON response', async () => {
    const response = await request(app).get('/mean?nums=1,2,3,4,5');
    expect(response.statusCode).toBe(200);
    expect(response.body.operation).toBe('mean');
    expect(response.body.value).toBe(3);
  });

  test('should handle missing nums query parameter', async () => {
    const response = await request(app).get('/mean');
    expect(response.statusCode).toBe(400); // Bad Request
    expect(response.body.error.message).toBe('nums are required.');
  });

  test('should handle invalid numbers', async () => {
    const response = await request(app).get('/mean?nums=1,2,3,foo');
    expect(response.statusCode).toBe(400); // Bad Request
    expect(response.body.error.message).toBe('foo is not a valid number.');
  });
});

describe('GET /median', () => {

    test('should calculate median and return JSON response', async () => {
      const response = await request(app).get('/median?nums=1,2,3,4,5');
      expect(response.statusCode).toBe(200);
      expect(response.body.operation).toBe('median');
      expect(response.body.value).toBe(3);
    });
  
    test('should handle missing nums query parameter', async () => {
      const response = await request(app).get('/median');
      expect(response.statusCode).toBe(400);
      expect(response.body.error.message).toBe('nums are required.');
    });
  
    test('should handle invalid numbers', async () => {
      const response = await request(app).get('/median?nums=1,2,3,foo');
      expect(response.statusCode).toBe(400);
      expect(response.body.error.message).toBe('foo is not a valid number.');
    });

});
  
describe('GET /mode', () => {

  test('should calculate mode and return JSON response', async () => {
        const response = await request(app).get('/mode?nums=1,2,2,3,4');
        expect(response.statusCode).toBe(200);
        expect(response.body.operation).toBe('mode');
        expect(response.body.value).toBe(2);
  });

  test('should handle missing nums query parameter', async () => {
      const response = await request(app).get('/mode');
      expect(response.statusCode).toBe(400);
      expect(response.body.error.message).toBe('nums are required.');
  });

  test('should handle invalid numbers', async () => {
      const response = await request(app).get('/mode?nums=1,2,3,foo');
      expect(response.statusCode).toBe(400);
      expect(response.body.error.message).toBe('foo is not a valid number.');
  });

});

describe('GET /all', () => {

  test('should calculate all operations and return JSON response', async () => {
    const response = await request(app).get('/all?nums=1,2,3,4,5');
    expect(response.statusCode).toBe(200);
    expect(response.body.operation).toBe('all');
    expect(response.body.mean).toBe(3);
    expect(response.body.median).toBe(3);
    expect(response.body.mode).toBe(undefined); 
  });

});

describe('File Saving', () => {

  it('should save result to file if "save" query parameter is true', async () => {
    const response = await request(app).get('/mean?nums=1,2,3,4,5&save=true');
    expect(response.statusCode).toBe(200);
    expect(fs.existsSync('results.json')).toBe(true);
    const data = JSON.parse(fs.readFileSync('results.json', 'utf8'));
    expect(data.operation).toBe('mean');
    expect(data.value).toBe(3);
    fs.unlinkSync('results.json'); // Clean up
  });

  it('should handle file writing error', async () => {
    jest.spyOn(fs, 'writeFile').mockImplementation((file, data, callback) => {
        callback(new Error('Error writing to file'));
    });

    const response = await request(app).get('/mean?nums=1,2,3,4,5&save=true');
    expect(response.statusCode).toBe(500); // Internal server error
    expect(response.body.error).toBeDefined(); // Check if error is defined
    expect(response.body.error.message).toBe('Failed to save result to file'); // Check error message in response
    expect(fs.existsSync('results.json')).toBe(false); // File should not exist
  });

  afterAll(() => {
      jest.restoreAllMocks(); // Restore original implementation of fs.writeFile
  });
  
});
