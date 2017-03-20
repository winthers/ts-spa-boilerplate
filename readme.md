
# Table of contents

<!-- TOC -->

- [Table of contents](#table-of-contents)
- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Build and Test](#build-and-test)

<!-- /TOC -->


# Introduction 
Boilerplate Project for creating Javascript Web Applications:
- typescript
- karma + jasmin

This version of the SPA runs Backbone.Marionette 


# Getting Started
TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:

- Remember to update the *title* in the package.json

**Installation**

    $ npm install
    
2.	Software dependencies
3.	Latest releases
4.	API references

# Build and Test


**Run all tests**

    $ karma start

**Production Build**

Builds the app as production to the build/ folder

    $ grunt release

**Development Build**

Builds the app as development to the build/ folder

    $ grunt build

**What is the difference between Dev/Prod builds**

- config is served with the dev/prod section
- the body tag have a development/production class added to it.
