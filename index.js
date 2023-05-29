const { createHmac } = require("crypto");
const { createInterface } = require("readline");
const { argv, stdin: input, stdout: output } = require("process");
const { v4: keyGenerator } = require("uuid");
const { table } = require("ascii-data-table").default;

const rl = createInterface({ input, output });

class Table {
  generate(moves) {
    const data = [[" v PC / You > ", ...moves]];

    for (let i = 0; i < moves.length; i++) {
      const row = [moves[i]];
      row[i + 1] = "Draw";
      for (let j = 1; j < Math.floor(moves.length / 2) + 1; j++) {
        row[((i + j) % moves.length) + 1] = "Win";
        row[((moves.length + (i - j)) % moves.length) + 1] = "Lose";
      }
      data.push(row);
    }
    return table(data);
  }
}

class Rules {
  constructor(userMove, computerMove, moves) {
    this.userMove = userMove;
    this.computerMove = computerMove;
    this.moves = moves;
  }

  getWinner() {
    const winOptions = [];

    for (let i = 1; i < Math.floor(this.moves.length / 2) + 1; i++) {
      winOptions.push(this.moves[(this.computerMove + i) % moves.length]);
    }

    if (this.moves[+this.userMove - 1] === this.moves[this.computerMove]) {
      return "Draw!";
    }
    if (winOptions.includes(this.moves[+this.userMove - 1])) {
      return "You win!";
    }
    return "Computer win!";
  }
}

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

    return rl.close();
  }

  if (new Set(moves).size !== moves.length) {
    console.log("do not repeat moves. moves should be non-repeating strings!");
    return rl.close();
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
        console.log(new Table().generate(moves));
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
