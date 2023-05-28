const { createHmac } = require("crypto");
const { createInterface } = require("readline");
const { argv, stdin: input, stdout: output } = require("process");
const { v4: keyGenerator } = require("uuid");

const rl = createInterface({ input, output });

class Rules {
  constructor(userMove, computerMove, moves) {
    this.userMove = userMove;
    this.computerMove = computerMove;
    this.moves = moves;
  }

  getOptions() {
    const winOptions = [],
      loseOptions = [];

    for (let i = 1; i < Math.floor(this.moves.length / 2) + 1; i++) {
      winOptions.push(this.moves[(this.computerMove + i) % 5]);
      loseOptions.push(
        this.moves[(this.moves.length + this.computerMove - i) % 5]
      );
    }

    return { winOptions, loseOptions };
  }

  getWinner() {
    if (this.moves[+this.userMove - 1] === this.moves[this.computerMove]) {
      return "Draw!";
    } else if (
      this.getOptions().winOptions.includes(this.moves[+this.userMove - 1])
    ) {
      return "You win!";
    } else {
      const winOptions = [],
        loseOptions = [];

      for (let i = 1; i < Math.floor(this.moves.length / 2) + 1; i++) {
        winOptions.push(this.moves[(this.computerMove + i) % 5]);
        loseOptions.push(
          this.moves[(this.moves.length + this.computerMove - i) % 5]
        );
      }
      return "Computer win!";
    }
  }
}

class Table {}

class Key {
  generate() {
    return keyGenerator();
  }
}

class HMAC {
  generate(body, key) {
    return createHmac("sha3-256", key).update(body).digest("hex");
  }
}

const game = (moves) => {
  if (moves.length < 3 || moves.length % 2 === 0) {
    console.log(
      "wrong number of arguments. you should give an odd number >=3 of strings!"
    );

    return;
  }

  if (new Set(moves).size !== moves.length) {
    console.log("do not repeat moves. moves should be non-repeating strings!");
    return;
  }

  const key = new Key().generate();
  const computerMove = Math.floor(Math.random() * moves.length);
  const computerMoveHMAC = new HMAC().generate(moves[computerMove], key);

  console.log(`HMAC: ${computerMoveHMAC}`);

  const gameProcess = () => {
    console.log("Available moves:");
    moves.forEach((el, index) => {
      console.log(`${index + 1} - ${el}`);
    });
    console.log("0 - exit");
    console.log("? - help");

    rl.question("Enter your move: ", (userMove) => {
      if (+userMove === 0) return rl.close();

      if (userMove === "?") {
      }
      if (+userMove <= moves.length && +userMove > 0) {
        console.log(`Your move: ${moves[+userMove - 1]}`);
        console.log(`Computer move: ${moves[computerMove]}`);
        console.log(new Rules(userMove, computerMove, moves).getWinner());
        console.log(`HMAC key: ${key}`);
        return rl.close();
      }
      gameProcess();
    });
  };

  gameProcess();
};

const moves = argv.slice(2);

game(moves);
