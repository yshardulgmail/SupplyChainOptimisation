# TASK 2 — UI Component Handling

# Website: https://the-internet.herokuapp.com

#

# Write your own Gherkin scenarios AND step definitions for this task.

# URLs:

#   Dropdown:        https://the-internet.herokuapp.com/dropdown

#   JS Alerts:       https://the-internet.herokuapp.com/javascript_alerts

#   Dynamic Loading: https://the-internet.herokuapp.com/dynamic_loading/2

#   iFrame:          https://the-internet.herokuapp.com/iframe

#   Windows:         https://the-internet.herokuapp.com/windows

 

Feature: UI Component Handling

  As a QE engineer

  I want to interact with dropdowns, alerts, dynamic content, iframes, and multiple windows

  So that I can demonstrate proficiency with complex UI components

 

  Scenario: Select options from dropdown menu
    Given I open the dropdown page
    Then the dropdown should be visible with default unselected state
    When I select "Option 1" by visible text
    Then "Option 1" should be selected
    When I select "Option 2" by value attribute
    Then "Option 2" should be selected
    And "Option 1" should no longer be selected

  Scenario: Handle JavaScript alerts
    Given I navigate to the JS alerts page
    When I click "Click for JS Alert" button
    And I accept the alert
    Then I should see the result "You successfully clicked an alert"
    When I click "Click for JS Confirm" button
    And I dismiss the alert
    Then I should see the result "You clicked: Ok"
    When I click Click for JS Prompt and I enter Playwright Assessment in the prompt and I accept the prompt
    Then I should see the result "You entered: Playwright Assessment"

  Scenario: Wait for dynamically loaded content
    Given I navigate to the dynamic loading page
    When I click "Start" button
    Then the loading indicator should disappear
    And I should see the text "Hello World!"
    And the loading bar should not be visible

  Scenario: Interact with content inside an iFrame
    Given I navigate to the iframe page
    When I clear the TinyMCE editor
    And I type "Playwright iFrame Assessment" into the editor
    Then the editor should contain "Playwright iFrame Assessment"

  #   6. Switch back to the main frame and assert the page heading is visible

 

  # ─── Scenario 5 ────────────────────────────────────────────────────

  # TODO: Write a scenario for multi-window handling:

  #   1. Navigate to the windows page

  #   2. Click "Click Here" which opens a new tab

  #   3. Capture the new tab using Playwright's context event

  #   4. Assert the new tab URL contains "/windows/new"

  #   5. Assert the new tab has heading "New Window"

  #   6. Close the new tab

  #   7. Assert the original page still shows "Opening a new window"