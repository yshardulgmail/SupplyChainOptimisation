# TASK 6 — API + Browser (API UI) Testing

#

# Reference the same service and expectations as TASK 4:

#   tests/features/task4-api.feature

#   tests/steps/task4-api.steps.ts

# Base URL for HTTP calls: https://dummyjson.com

#

# This task adds a browser (Playwright Page) on top of APIRequestContext:

# validate data returned by the API also appears when the same resource

# is loaded in the browser (JSON rendered as the document body).

#

# Write your own Gherkin scenarios AND step definitions for this task.

# Use Playwright APIRequestContext for API calls — do NOT use external HTTP libraries.

 

Feature: API and browser correlation (API UI)

  As a QE engineer

  I want to validate API responses against what the browser shows for the same URLs

  So that UI clients and API consumers stay in sync

 

  Scenario: Correlate single user API response with browser display
    When I send a GET request to "/users/1" via API
    Then the API response status should be 200
    And the API response email should be "emily.johnson@x.dummyjson.com"
    When I navigate to "https://dummyjson.com/users/1" in the browser
    Then the page should display the email "emily.johnson@x.dummyjson.com"
    And the page should display the firstName "Emily"

  Scenario: Correlate paginated user list API with browser display
    When I send a GET request to "/users?limit=5" via API
    Then the API response status should be 200
    And the users array should have exactly 5 users
    When I note the first user's email from the API response
    And I navigate to "https://dummyjson.com/users?limit=5" in the browser
    Then the page should contain the noted email address
    And the page should contain "@x.dummyjson.com"

  Scenario: Correlate 404 error response across API and browser
    When I send a GET request to "/users/999" via API
    Then the API response status should be 404
    When I navigate to "https://dummyjson.com/users/999" in the browser
    Then the page should display a "not found" message