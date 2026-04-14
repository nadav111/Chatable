import swaggerAutogen from 'swagger-autogen';

const outputFile = './swagger_output.json';
const endpointsFiles = ['../app.js'];

const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: 'localhost:3000' // Change this to your port
};

/* NOTE: If you are using the build-in express router, you must use 
   the "endpointsFiles" only. The "doc" variable is optional. */

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log("Swagger documentation generated successfully!");
});