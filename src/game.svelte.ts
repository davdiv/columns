export interface GameParameters {
  balls: number;
  width: number;
  height: number;
  stepDuration: number;
  colors: string[];
}

export interface Counter {
  counter: number;
}

export interface Ball {
  id: number;
  color: number;
  x: number;
  y: number;
}

export interface GameState {
  parameters: GameParameters;
  table: (Ball | null)[];
  balls: Ball[];
  currentSet: Ball[];
  currentSetX: number;
  currentSetY: number;
  nextSet: Ball[];
  points: 0;
  pause: boolean;
  togglePause: () => void;
  gameOver: boolean;
  rotateSet: () => void;
  moveHorizontally: (delta: 1 | -1) => void;
  moveDown: () => void;
}

export const commonColors = [
  "blue",
  "red",
  "#0a0",
  "yellow",
  "darkorange",
  "black",
  "darkviolet",
  "aquamarine",
  "chartreuse",
  "#f942f5",
];

export const defaultParameters: GameParameters = {
  balls: 3,
  width: 7,
  height: 10,
  stepDuration: 1000,
  colors: commonColors.slice(0, 6),
};

const createTable = (size: number): (Ball | null)[] => {
  const table = [];
  for (let i = 0; i < size; i++) {
    table.push(null);
  }
  return table;
};

const createBallsSet = (
  parameters: GameParameters,
  counter: Counter
): Ball[] => {
  const item: Ball[] = [];
  for (let i = 0, l = parameters.balls; i < l; i++) {
    const color = Math.floor(Math.random() * parameters.colors.length);
    item.push({
      id: counter.counter++,
      color,
      x: -1,
      y: -1,
    });
  }
  return item;
};

export const newGame = (parameters: GameParameters): GameState => {
  const counter = { counter: 0 };
  const initialSetX = Math.floor(parameters.width / 2);
  let busy = false;
  const game: GameState = $state({
    parameters,
    table: createTable(parameters.width * parameters.height),
    balls: [],
    currentSetX: initialSetX,
    currentSetY: 0,
    currentSet: createBallsSet(parameters, counter),
    nextSet: createBallsSet(parameters, counter),
    points: 0,
    pause: false,
    gameOver: false,
    togglePause: () => {
      game.pause = !game.pause;
    },
    rotateSet: () => {
      if (busy || game.gameOver || game.pause) {
        return;
      }
      game.currentSet.unshift(game.currentSet.pop()!);
      setSetAt(game.currentSetX, game.currentSetY, game.currentSet);
    },
    moveHorizontally: async (delta: 1 | -1) => {
      if (busy || game.gameOver || game.pause) {
        return;
      }
      const newCurrentSetX = game.currentSetX + delta;
      if (
        newCurrentSetX >= 0 &&
        newCurrentSetX < parameters.width &&
        isEmpty(newCurrentSetX, game.currentSetY, game.currentSet.length)
      ) {
        removeSetAt(game.currentSetX, game.currentSetY, game.currentSet.length);
        game.currentSetX = newCurrentSetX;
        setSetAt(newCurrentSetX, game.currentSetY, game.currentSet);
      }
      await checkCurrentSetEnd();
    },
    moveDown: async () => {
      if (busy || game.gameOver || game.pause) {
        return;
      }
      const currentSet = game.currentSet;
      while (game.currentSet === currentSet && !game.gameOver) {
        await nextStep();
      }
    },
  });

  const removeSetAt = (x: number, y: number, setSize: number) => {
    for (let i = 0; i < setSize; i++) {
      game.table[x + (y + i) * parameters.width] = null;
    }
  };

  const setSetAt = (x: number, y: number, set: Ball[]) => {
    for (let i = 0, l = set.length; i < l; i++) {
      const ball = set[i];
      ball.x = x;
      ball.y = y + i;
      game.table[ball.x + ball.y * parameters.width] = ball;
    }
  };

  const isEmpty = (x: number, y: number, setSize: number) => {
    for (let i = 0; i < setSize; i++) {
      if (game.table[x + (y + i) * parameters.width]) return false;
    }
    return true;
  };

  const checkAlignedItems = (
    x: number,
    y: number,
    dx: number,
    dy: number,
    set: Set<Ball>
  ) => {
    const refBall = game.table[x + parameters.width * y]!;
    const color = refBall.color;
    const items: Ball[] = [refBall];
    let curX = x + dx;
    let curY = y + dy;
    let ball: Ball | null = null;
    while (
      curX >= 0 &&
      curX < parameters.width &&
      curY >= 0 &&
      curY < parameters.height &&
      (ball = game.table[curX + parameters.width * curY]) &&
      ball?.color === color
    ) {
      items.push(ball);
      curX += dx;
      curY += dy;
    }
    if (items.length >= 3) {
      for (let i = 0; i < items.length; i++) {
        set.add(items[i]);
      }
    }
  };

  const findAndRemoveAlignments = async () => {
    while (true) {
      const ballsToRemove = new Set<Ball>();
      // spot items
      for (let x = 0; x < parameters.width; x++) {
        for (let y = 0; y < parameters.height; y++) {
          const item = game.table[x + parameters.width * y];
          if (item) {
            checkAlignedItems(x, y, 1, 0, ballsToRemove);
            checkAlignedItems(x, y, 0, 1, ballsToRemove);
            checkAlignedItems(x, y, 1, 1, ballsToRemove);
            checkAlignedItems(x, y, 1, -1, ballsToRemove);
          }
        }
      }
      if (ballsToRemove.size === 0) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
      const columns = new Set<number>();
      // remove them
      for (const ball of ballsToRemove) {
        columns.add(ball.x);
        game.table[ball.x + parameters.width * ball.y] = null;
        game.points++;
        const index = game.balls.indexOf(ball);
        if (index > -1) {
          game.balls.splice(index, 1);
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
      // move down corresponding items
      for (const x of columns) {
        let nextItem = parameters.height - 1;
        for (let y = parameters.height - 1; y >= 0; y--) {
          const currentItem = game.table[x + y * parameters.width];
          if (currentItem) {
            currentItem.y = nextItem;
            game.table[x + nextItem * parameters.width] = currentItem;
            nextItem--;
          }
        }
        for (let y = nextItem; y >= 0; y--) {
          game.table[x + y * parameters.width] = null;
        }
      }
    }
  };

  const checkCurrentSetEnd = async () => {
    busy = true;
    try {
      let nextPositionY = game.currentSetY + game.currentSet.length;
      if (
        nextPositionY >= parameters.height ||
        game.table[game.currentSetX + parameters.width * nextPositionY]
      ) {
        await findAndRemoveAlignments();
        if (!isEmpty(initialSetX, 0, game.nextSet.length)) {
          // game over
          game.gameOver = true;
          return;
        }
        game.currentSet = game.nextSet;
        game.balls.push(...game.currentSet);
        game.currentSetX = initialSetX;
        game.currentSetY = 0;
        game.nextSet = createBallsSet(parameters, counter);
        setSetAt(game.currentSetX, game.currentSetY, game.currentSet);
        await checkCurrentSetEnd();
      }
    } finally {
      busy = false;
    }
  };

  const nextStep = async () => {
    if (busy || game.gameOver) {
      return;
    }
    game.table[game.currentSetX + parameters.width * game.currentSetY] = null;
    game.currentSetY++;
    setSetAt(game.currentSetX, game.currentSetY, game.currentSet);
    await checkCurrentSetEnd();
  };
  game.balls.push(...game.currentSet);
  setSetAt(game.currentSetX, 0, game.currentSet);
  $effect(() => {
    if (game.pause) {
      return;
    }
    let active = true;
    const callNextStep = async () => {
      timeout = null;
      await nextStep();
      if (!game.gameOver && active) {
        timeout = setTimeout(callNextStep, parameters.stepDuration);
      }
    };
    let timeout: null | ReturnType<typeof setTimeout> = setTimeout(
      callNextStep,
      parameters.stepDuration
    );
    return () => {
      active = false;
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  });
  return game;
};
