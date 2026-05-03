# TASK 3 — End-to-End Shopping Flow (HARD)

# Website: https://www.saucedemo.com

# Credentials: standard_user / secret_sauce

#

# Write your own Gherkin scenarios AND step definitions for this task.

# This is a multi-step purchase journey covering sorting, cart, and checkout.

 

Feature: End-to-End Shopping Flow

  As a logged-in SauceDemo user

  I want to browse, sort, manage cart, and complete checkout

  So that I can purchase products successfully

 

  Scenario: Sort products by name and price
    Given I login to SauceDemo with username "standard_user" and password "secret_sauce"
    Then I should be on the inventory page with products visible
    And the default sort order should be "Name (A to Z)"
    When I change the sort order to "Price (low to high)"
    Then all product prices should be in ascending order
    And the total number of products should be 6
    When I change the sort order to "Price (high to low)"
    Then all product prices should be in descending order

  Scenario: Manage items in the shopping cart
    Given I login to SauceDemo with username "standard_user" and password "secret_sauce"
    When I add "Sauce Labs Backpack" to the cart
    Then the cart badge should show "1"
    When I add "Sauce Labs Bolt T-Shirt" to the cart
    Then the cart badge should show "2"
    When I navigate to the cart page
    Then both items should be listed with correct names and prices
    When I remove "Sauce Labs Bolt T-Shirt" from the cart
    Then the cart badge should show "1"
    And only "Sauce Labs Backpack" should remain in the cart
    When I click "Continue Shopping"
    Then I should be back on the inventory page
    And the "Sauce Labs Backpack" button should say "Remove"

  Scenario: Complete checkout with price verification
    Given I login to SauceDemo with username "standard_user" and password "secret_sauce"
    When I add "Sauce Labs Backpack" and "Sauce Labs Fleece Jacket" to the cart
    When I navigate to the cart page 
    And I click "Checkout"
    And I fill in checkout form with firstName "John", lastName "Doe", zip "10001"
    And I click "Continue"
    Then the item total should be "$79.98"
    And tax should be calculated and greater than "$0.00"
    And the total should equal item total plus tax
    When I click "Finish"
    Then I should see "Thank you for your order!"
    And the order dispatch message should be visible
    When I click "Back Home"
    Then I should be on inventory page with empty cart