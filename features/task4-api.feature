# TASK 4 — REST API Testing

# API Base URL: https://dummyjson.com

#

# Write your own Gherkin scenarios AND step definitions for this task.

# Use Playwright's APIRequestContext — do NOT use external HTTP libraries.

 

Feature: REST API Testing

  As a QE engineer

  I want to test RESTful API endpoints

  So that I can validate CRUD operations and authentication

 

  Scenario: Retrieve user list with pagination
    When I send a GET request to "/users?limit=5"
    Then the response status should be 200
    And the response "limit" field should equal 5
    And the "users" array should have exactly 5 users
    And each user should have id, email, firstName, lastName, and image fields
    And all email addresses should contain "@x.dummyjson.com"

  Scenario: Retrieve single user and handle 404 errors
    When I send a GET request to "/users/1"
    Then the response status should be 200
    And the user email should be "emily.johnson@x.dummyjson.com"
    When I send a GET request to "/users/999"
    Then the response status should be 404
    And the response should contain a "message" field

  Scenario: Create a new user via POST
    When I send a POST request to "/users/add" with firstName "Playwright", lastName "Tester", age 25
    Then the response status should be 201
    And the response firstName should be "Playwright"
    And the response lastName should be "Tester"
    And the response should have a numeric "id" field

  Scenario: Update user data with PUT and PATCH
    When I send a PUT request to "/users/1" with firstName "Updated", lastName "Name"
    Then the response status should be 200
    And the response firstName should be "Updated"
    And the response lastName should be "Name"
    When I send a PATCH request to "/users/1" with lastName "Patched"
    Then the response status should be 200
    And the response lastName should be "Patched"

  Scenario: Delete user and handle authentication
    When I send a DELETE request to "/users/1"
    Then the response status should be 200
    And the response "isDeleted" should be true
    When I send a POST request to "/auth/login" with username "emilys", password "emilyspass"
    Then the response status should be 200
    And the response should contain an "accessToken" field
    When I send a POST request to "/auth/login" with username "emilys"
    Then the response status should be 400
    And the response should contain a "message" field