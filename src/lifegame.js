import { writable } from 'svelte/store';

// グリッドの初期値
function defaultGrid(rowSize, colSize) {
  const grid = [];
  for (let i = 0; i < rowSize; i++) {
    grid[i] = [];
    for (let j = 0; j < colSize; j++) {
      // isAliveがtrueのとき、セルは生きている
      grid[i][j] = { isAlive: false };
    }
  }
  return grid;
}

// ライフゲームの初期値
function defaultState(rowSize, colSize) {
  return {
    grid: defaultGrid(rowSize, colSize),
    rowSize,
    colSize
  };
}

// ライフゲームをリセットして初期値に戻す
function reset(rowSize, colSize) {
  return defaultState(rowSize, colSize);
}

// グリッドのクリックされたセルの生死を反転する
function toggle(oldState, row, col) {
  const newState = JSON.parse(JSON.stringify(oldState));
  newState.grid[row][col] = {
    ...newState.grid[row][col],
    isAlive: !newState.grid[row][col].isAlive
  };
  return newState;
}

// ライフゲームのターンをひとつ進める
function moveNextTick(oldState) {
  const newState = JSON.parse(JSON.stringify(oldState));
  for (let i = 0; i < newState.rowSize; i++) {
    for (let j = 0; j < newState.colSize; j++) {
      newState.grid[i][j] = {
        ...newState.grid[i][j],
        isAlive: isCellAliveWhenNextTick(oldState, i, j)
      };
    }
  }
  return newState;
}

// ライフゲームのルール
function isCellAliveWhenNextTick(oldState, row, col) {
  const directions = [
    [-1, -1], [-1, +0], [-1, +1],
    [+0, -1],/*       */[+0, +1],
    [+1, -1], [+1, +0], [+1, +1]
  ];

  // 隣接するセルの生きたセルを数える
  let count = 0;
  for (const d of directions) {
    const newRow = row + d[0];
    const newCol = col + d[1];
    if (newRow < 0 || oldState.rowSize - 1 < newRow) {
      continue;
    }
    if (newCol < 0 || oldState.colSize - 1 < newCol) {
      continue;
    }
    if (oldState.grid[newRow][newCol].isAlive) {
      count++;
    }
  }

  if (oldState.grid[row][col].isAlive) {
    // 生存？
    if (count === 2 || count === 3) { return true; } else { return false; }
    // 過疎？
    if (count <= 1) { return false; } else { return true; }
    // 過密？
    if (count >= 4) { return false; } else { return true; }
    // 上記までで条件を網羅している。ここに到達することはない
    throw new Error('実装ミス');
  } else {
    // 誕生？
    if (count === 3) { return true; }
    // なにも起こらない
    return false;
  }
}

export function createLifeGame(rowSize, colSize) {
  const { subscribe, set, update } = writable(defaultState(rowSize, colSize));

  return {
    subscribe,
    toggle: (row, col) => update(state => toggle(state, row, col)),
    moveNextTick: () => update(moveNextTick),
    reset: () => set(reset(rowSize, colSize))
  };
}
