const BOARD_SETTINGS = {
    WIDTH: 20,
    HEIGHT: 20,
};
const DIRECTIONS = [
    [-1, 0], // UP
    [-1, -1], // UPLEFT
    [0, -1], // LEFT
    [1, -1], // DOWNLEFT
    [1, 0], // DOWN
    [1, 1], // DOWNRIGHT
    [0, 1], // RIGHT
    [-1, 1], // UPRIGHT
];
const CELL_SIZE = Math.floor(500 / BOARD_SETTINGS.WIDTH);

const board_states = new Array(BOARD_SETTINGS.HEIGHT);
const next_states = new Array(BOARD_SETTINGS.HEIGHT);
const btn_list = new Array(BOARD_SETTINGS.HEIGHT);
for (let yi = 0; yi < BOARD_SETTINGS.HEIGHT; yi++) {
    board_states[yi] = new Array(BOARD_SETTINGS.WIDTH).fill(false);
    next_states[yi] = new Array(BOARD_SETTINGS.WIDTH).fill(false);
    btn_list[yi] = new Array(BOARD_SETTINGS.WIDTH).fill(null);
}
const $root = document.getElementById("root");
const $nextGenBtn = document.getElementById("nextGenBtn");
$nextGenBtn.addEventListener("click", () => {
    moveNextGen();
});
const $autoPlayBtn = document.getElementById("autoPlayBtn");
$autoPlayBtn.addEventListener("click", () => {
    autoPlay();
});
const $stopPlayBtn = document.getElementById("stopPlayBtn");
$stopPlayBtn.addEventListener("click", () => {
    stopPlay();
});
for (let yi = 0; yi < BOARD_SETTINGS.HEIGHT; yi++) {
    const $row = document.createElement("div");
    for (let xi = 0; xi < BOARD_SETTINGS.WIDTH; xi++) {
        const $btn = document.createElement("button");
        $btn.addEventListener("click", () => {
            onClickSquare(yi, xi);
        });
        $btn.style.background = "white";
        $btn.style.width = `${CELL_SIZE}px`;
        $btn.style.height = `${CELL_SIZE}px`;
        btn_list[yi][xi] = $btn;
        $row.appendChild($btn);
    }
    $root.appendChild($row);
}

const onClickSquare = (yi, xi) => {
    console.log(yi, xi);
    board_states[yi][xi] = !board_states[yi][xi];
    if (board_states[yi][xi]) {
        btn_list[yi][xi].style.background = "black";
    } else {
        btn_list[yi][xi].style.background = "white";
    }
};

const moveNextGen = () => {
    for (let yi = 0; yi < BOARD_SETTINGS.HEIGHT; yi++) {
        for (let xi = 0; xi < BOARD_SETTINGS.WIDTH; xi++) {
            let cnt = 0;
            for (let [dy, dx] of DIRECTIONS) {
                y = (BOARD_SETTINGS.HEIGHT + yi + dy) % BOARD_SETTINGS.HEIGHT;
                x = (BOARD_SETTINGS.WIDTH + xi + dx) % BOARD_SETTINGS.WIDTH;
                if (board_states[y][x]) {
                    cnt++;
                }
            }
            // 維持
            if (cnt == 2) {
                next_states[yi][xi] = board_states[yi][xi];
                continue;
            }
            // 誕生
            if (cnt == 3) {
                next_states[yi][xi] = true;
                continue;
            }
            // 死滅
            next_states[yi][xi] = false;
        }
    }
    for (let yi = 0; yi < BOARD_SETTINGS.HEIGHT; yi++) {
        for (let xi = 0; xi < BOARD_SETTINGS.WIDTH; xi++) {
            board_states[yi][xi] = next_states[yi][xi];
            renderBoard();
        }
    }
};
const renderBoard = () => {
    for (let yi = 0; yi < BOARD_SETTINGS.HEIGHT; yi++) {
        for (let xi = 0; xi < BOARD_SETTINGS.WIDTH; xi++) {
            flipColor(yi, xi);
        }
    }
};
const flipColor = (yi, xi) => {
    if (board_states[yi][xi]) {
        btn_list[yi][xi].style.background = "black";
    } else {
        btn_list[yi][xi].style.background = "white";
    }
};

let timerId = null;
const autoPlay = () => {
    stopPlay();
    timerId = setInterval(moveNextGen, 1000);
};

const stopPlay = () => {
    if (timerId !== null) {
        clearInterval(timerId);
    }
};
