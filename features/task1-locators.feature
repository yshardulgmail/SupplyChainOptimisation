# TASK 1 — Locators & Assertions

# Website: https://the-internet.herokuapp.com

#

# Write your own Gherkin scenarios AND step definitions for this task.

# URLs:

#   Login:      https://the-internet.herokuapp.com/login

#   Checkboxes: https://the-internet.herokuapp.com/checkboxes

 

Feature: Locators and Assertions

  As a QE engineer

  I want to verify login flows, error handling, and checkbox interactions

  So that I can demonstrate proficiency with locators and assertions

 

  Scenario: Verify login page elements
    Given I open the login page
    Then the page heading contains "Login Page"
    And the username and password fields should be visible
    And the login button is visible and has text "Login"

  Scenario: Login to the page with given credentials
    Given I open the login page
    When I enter username "tomsmith" and password "SuperSecretPassword!"
    And I click the login button
    Then the URL changes to contain "/secure"
    And I should see the success flash message "You logged into a secure area!"
    And the logout button should be visible

  Scenario Outline: Verify login fails with invalid credentials
    Given I open the login page
    When I enter username "<username>" and password "<password>"
    And I click the login button
    Then the URL should not contain "/secure"
    And I should see the error message "<flash_message>"

    Examples:
      | username    | password    | flash_message           |
      | invaliduser | invalidpass | Your username is invalid! |
      | tomsmith    | wrongpass   | Your password is invalid! |

  Scenario: Toggle checkbox states on checkboxes page
    Given I open the checkboxes page
    Then there must be exactly 2 checkboxes
    And I note the initial checked state of each checkbox
    When I toggle all checkboxes
    Then each checkbox state should be opposite to its initial state
    When I toggle all checkboxes back again
    Then each checkbox should return to its original state