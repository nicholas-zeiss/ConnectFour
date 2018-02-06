# Connect Four
A web app that allows a user to play a game of [Connect Four](https://en.wikipedia.org/wiki/Connect_Four) against an AI. Moves can be made by using the buttons labeled 1-7 or the corresponding number keys of the keyboard. A top 10 scoreboard is visible on the left, see if you can earn a spot on it!

## Installation
All you need to do to get this site up and running locally is a few simple commands:
```
 $ git clone https://github.com/nicholas-zeiss/ConnectFour.git
 $ cd ConnectFour/
 $ mkdir app/server/db/data
 $ npm i
 $ npm start
```
The app will now be running on your localhost at port 6050.

## Implementation

Stack: React, Express, Node.js, SQL via Knex.js

The front-end is implemented using React. The game is displayed via a canvas element. The AI against which the user plays is a [minimix algorithm](https://en.wikipedia.org/wiki/Minimax) optimized with [alpha-beta pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning). I have never been able to beat it.

The back-end database responsible for holding high scores is an SQL database which is interacted with via Knex.js.

