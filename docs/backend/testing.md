# Testing


The backend API will be tested on a unit test level along with end to end testing

## Unit Testing Strategy 
Jest will be used to unit test the backend, along with helper functions from ts-test to allow for easier mocks. Jest is supported out of the box by nest, and it allows us to follow nest specific formatting (such as creating test modules). 

The backend API will be tested through the following levels:
- controller
- service

As the idea is to test these modules in isolation, so all dependencies must be mocked

### General Testing Idea 
- Manually mock dependencies (ex: injected service, or repository) using jest
   - as we test modules in isolation, we assume dependencies are working optimally
- Call the appropriate function with the controller method
- When writing tests, it is important to validate the following
  - mocked dependencies called with correct parameters
  - values that mocked dependencies returned with are handled appropriately 
  - it is important to test edge cases within the code, along with error handling

### Running Tests
- tests are constrained to a nestjs project, so they can be run using the command: `npx nx run <project-name>:test`
 - this will generate a coverage report in the console, along with the /coverage directory which can be used to improve tests

## End to End Testing Strategy (To be refined)

End to end testing will involving integration all the components, and testing the application by hitting specific endpoints

As we do not mock dependencies, it will need to add data to a test database
