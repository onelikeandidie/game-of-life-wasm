import { Universe, Cell } from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";

const CELL_SIZE = 6; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

/** @type {number | undefined} */
let current_animator = undefined;
/** @type {Universe | undefined} */
let universe = undefined;

let reset_universe = async (seed) => {
    // This makes it so that when the universe is reset, the last universe
    // doesn't keep ticking...
    if (current_animator !== undefined) {
        cancelAnimationFrame(current_animator);
    }
    const canvas = document.querySelector("#game_of_life_canvas");
    if (canvas === undefined) {
        return;
    }
    // Free memory if the old universe still exists
    if (universe !== undefined) {
        universe.free();
    }
    // Create the world for the cells to exist
    if (seed != undefined) {
        universe = Universe.new(seed);
    } else {
        universe = Universe.new();
    }
    // Get the width and height to adjust resolution
    const width = universe.width();
    const height = universe.height();
    // Define render resolution
    canvas.height = (CELL_SIZE + 1) * height + 1;
    canvas.width = (CELL_SIZE + 1) * width + 1;
    // Create a 2d context
    const ctx = canvas.getContext('2d');
    const renderLoop = () => {
        universe.tick();

        drawGrid(ctx, universe);
        drawCells(ctx, universe);
      
        current_animator = requestAnimationFrame(renderLoop);
    };
    current_animator = requestAnimationFrame(renderLoop);
    update_textarea();
    return universe;
}

let update_textarea = async () => {
    /** @type {HTMLTextAreaElement} */
    const seed_textarea = document.querySelector("#game_of_life_seed textarea");
    if (seed_textarea === undefined) {
        return;
    }
    seed_textarea.value = universe.seed();
}

let main = async () => {
    let universe = await reset_universe();
    // Update the seed tag
    /** @type {HTMLTextAreaElement} */
    const seed_textarea = document.querySelector("#game_of_life_seed textarea");
    if (seed_textarea === undefined) {
        return;
    }
    seed_textarea.onkeydown = (e) => {
        if (e.code == "Enter") {
            e.preventDefault();
            let seed = seed_textarea.value;
            if (seed === "") {
                seed = undefined;
            }
            reset_universe(seed);
        }
    }
}

const drawGrid = (ctx, universe) => {
    const width = universe.width();
    const height = universe.height();
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;
  
    // Vertical lines.
    for (let i = 0; i <= width; i++) {
        ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
        ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }
  
    // Horizontal lines.
    for (let j = 0; j <= height; j++) {
        ctx.moveTo(0,                           j * (CELL_SIZE + 1) + 1);
        ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }
  
    ctx.stroke();
};

const getIndex = (row, column, universe) => {
    const width = universe.width();
    const height = universe.height();
    return row * width + column;
};
  
const drawCells = (ctx, universe) => {
    const width = universe.width();
    const height = universe.height();
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

    ctx.beginPath();

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const idx = getIndex(row, col, universe);
            
            ctx.fillStyle = cells[idx] === Cell.Dead
                ? DEAD_COLOR
                : ALIVE_COLOR;
            
            ctx.fillRect(
                col * (CELL_SIZE + 1) + 1,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }

    ctx.stroke();
};

main();