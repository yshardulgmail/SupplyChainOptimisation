# TASK 5 — Bug Hunt: Detect Defects on SauceDemo (HARD)

# Website: https://www.saucedemo.com

# Credentials: All passwords are "secret_sauce"

#

# Write your own Gherkin scenarios AND step definitions for this task.

#

# SauceDemo ships with INTENTIONALLY BUGGY users.

# Your job is to detect bugs by comparing buggy users against

# standard_user (baseline) behavior.

#

# Users:

#   standard_user  → Works correctly (use as baseline)

#   problem_user   → Has UI/functional bugs

#

# Approach:

#   1. Run a flow with standard_user → note the expected behavior

#   2. Run the same flow with problem_user → catch the deviation

#   3. Assert the specific defect with a clear failure message

 

Feature: Bug Hunt — Detect Real Defects

  As a QE engineer

  I want to detect bugs in SauceDemo's problem_user account

  So that I can document defects by comparing against baseline behavior

 

  Scenario: Detect broken product images in problem_user account
    Given I login as "standard_user" with password "secret_sauce" and collect baseline product images
    When I logout from SauceDemo
    And I login as "problem_user" with password "secret_sauce"
    And I navigate to the inventory page
    Then I should detect broken product images compared to baseline
    And at least one product should have a broken image

  Scenario: Detect wrong items added to cart for problem_user
    Given I login as "problem_user" with password "secret_sauce"
    When I add at least 3 products to cart and note their displayed names
    And I go to the cart page
    Then I should detect mismatches between clicked product names and cart item names
    And the cart should contain different items than what was clicked