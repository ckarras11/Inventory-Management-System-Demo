# Inventory-Management-System

## Overview
This application was designed for a small company to use as an inventory management solution.  The user is able to create multiple inventories across different vehicles/locations.  The user is also able to run a report across all vehicles to create a master reorder list.  The direct link for the app is [here!](https://inventory-mgmt.herokuapp.com/)

## Landing Page
The landing page is there to direct a user to either a register page (if the user does not have an account) or a login page (if the user is already registered)
![image](https://user-images.githubusercontent.com/30561347/32411225-458efe08-c1ac-11e7-90bd-1cd53d4e6717.png)
## Register Page
This is where a user can create a new account.  Since the software is used for a specific companies inventory a company code is required to create an account.  When all the information is entered and validated on the server side, the password is then salted and hashed with ``bcryptjs`` and all of the information is stored on the db.  The user is redirected to the login page where they can use their new credentials to login.

## Login Page
Here a user may login if they have already created an account.  The user is authenticated with ``passport.js`` and the password handled by ``bcryptjs``.  When a user is succesfully authenticated the authentication is stored in a session so the user can access protected routes.

## Home Page
The home page gives a broad overview of the use of the application.  The navigation bar on the right side allows the user to navigate to inventory or reports.  The logout button ends the session.

## Inventory Page
The inventory page displays a list of vehicles/locations and also allows a user to create a new one.  Clicking on a specific vehicle will get the inventory for that specific vehicle.  Both vehicle and items support all CRUD operations.

## Reports Page
The reports page compares current inventory quantity to the reorder point set on each item.  All items with a quantity below the reorder point are then displayed in a ordered list.

## Technologies Used
### Client Side
* Handlebars
* Sass
* Javascript
* jQuery
* Gulp
### Server Side
* Node.js
* Express
* Passport.js
* Bcrypt.js
* Mongoose
* MongoDB

## Responsive Design
This page was made responsive using ``flexbox`` and ``@media querys``
