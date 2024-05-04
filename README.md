# Express.JS Statistical Calculator

## Introduction

A searchbar based analytical calculator that can perform mean, median, and mode calculations or perform all three calculations at once. The app also offers the option to save the results. 

## Usage

### initate node.js using
```bash
npm init
```
### Run tests using Jest.
```bash
jest
```
### Run applcation using nodemon
```bash
nodemon app.js
```

### Calculation
__/mean__: Calculate the average value of the numbers inputed into the browser as the `nums=` parameter.
__/median__: Calculate the median value of the numbers inputed into the browser as the `nums=` parameter.
__/mode__: Calculate the mode value of the numbers inputed into the browser as the `nums=` parameter.
__/all__: Calculate the mean, median, mode value of the numbers inputed into the browser as the `nums=` parameter.

In the browser use one of the following routes, followed by the query string with nums parameter:
   * /mean?nums=1,2,3,4,5
   * /median?nums=1,2,3,4,5
   * /mode?nums=1,2,3,4,5
   * /all?nums=1,2,3,4,5

To save the calculation add the `save=` query paramater setting to true, like so:
  * /mean?nums=1,2,3,4,5&save=true
  * /median?nums=1,2,3,4,5&save=true
  * /mode?nums=1,2,3,4,5&save=true
  * /all?nums=1,2,3,4,5&save=true

Doing so will create a results.json file that will house every saved transaction.
