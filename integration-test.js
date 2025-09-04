const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'http://localhost:5001';
const AI_URL = 'http://localhost:8000';

async function testServiceIntegration() {
  console.log('🧪 Starting integration tests...\n');

  try {
    // 1. Backend health check
    console.log('1. Testing backend health...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log(`✅ Backend: ${healthResponse.status} - ${healthResponse.data.status}\n`);

    // 2. AI service health check
    console.log('2. Testing AI service health...');
    const aiHealthResponse = await axios.get(`${AI_URL}/health`);
    console.log(`✅ AI Service: ${aiHealthResponse.status} - ${aiHealthResponse.data.status}\n`);

    // 3. Database connection test
    console.log('3. Testing database connection...');
    const dbResponse = await axios.get(`${BASE_URL}/api/posts`);
    console.log(`✅ Database: ${dbResponse.status} - Retrieved ${dbResponse.data.length} posts\n`);

    // 4. Full workflow test (if test image exists)
    if (fs.existsSync('./test-image.jpg')) {
      console.log('4. Testing full workflow...');
      const formData = new FormData();
      formData.append('image', fs.createReadStream('./test-image.jpg'));
      formData.append('location', JSON.stringify({ lat: 35.6762, lng: 139.6503 }));
      formData.append('description', 'Integration test post');
      formData.append('nickname', 'TestUser');

      const postResponse = await axios.post(`${BASE_URL}/api/posts`, formData, {
        headers: formData.getHeaders()
      });
      console.log(`✅ Full workflow: Post created with ID ${postResponse.data.id}\n`);
    }

    console.log('🎉 All integration tests passed!');
  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    process.exit(1);
  }
}

testServiceIntegration();
