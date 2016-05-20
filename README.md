# Angular Webapi - Get Started
Starter template for Angular with WebApi 2 & Identity .Net

When trying to angularize the account section of a standard mvc template with webapi and angular 
it was hard to come by a simple getting started explanation of flow for external logins
using the latest template which happens to have alot of the components built in to it.

From what I've read, I've put together the account section with a Facebook login 
and tried to use as many of the existing components as possible, for people who don't want or need 
to recode the wheel as the case may be.

Contributions welcome, I'd like to turn this into an account and social template with Webapi 2 using Identity and Angular


##Overview
Using local storage for token persistence

 - Login
 - Logout
 - Register
 - External login
 - Manage External logins
 - Account lockout

##Structure
Frontal files in /www

node and gulp used for pre processor tasks, compiled files go into /www/lib

bower used for client side script libs
