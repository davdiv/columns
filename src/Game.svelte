<script lang="ts">
  import { fade, scale } from "svelte/transition";
  import { newGame, type GameParameters, type GameState } from "./game.svelte";
  import LeftArrow from "./icons/LeftArrow.svelte";
  import RightArrow from "./icons/RightArrow.svelte";
  import Rotate from "./icons/Rotate.svelte";
  import DownArrow from "./icons/DownArrow.svelte";
  import Pause from "./icons/Pause.svelte";
  import Exit from "./icons/Exit.svelte";

  let {
    parameters,
    onNewGame,
  }: { parameters: GameParameters; onNewGame: () => void } = $props();

  const game = newGame(parameters);

  let ballSize = 35;
  let space = 4;

  function keydown(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowLeft":
        game.moveHorizontally(-1);
        break;
      case "ArrowRight":
        game.moveHorizontally(1);
        break;
      case "ArrowUp":
        game.rotateSet();
        break;
      case "ArrowDown":
        game.moveDown();
        break;
      case "p":
        game.togglePause();
        break;
      case "n":
        onNewGame();
      default:
        return;
    }
    event.preventDefault();
  }
</script>

<svelte:window onkeydown={keydown} />

<div class="flex flex-wrap gap-3">
  <div
    class="board flex-none"
    style:width={`${(ballSize + space) * game.parameters.width + space}px`}
    style:height={`${(ballSize + space) * game.parameters.height + space}px`}
  >
    {#each game.balls as ball}
      {#key ball.id}
        <div
          out:scale
          class="ball"
          style:left={`${space + ball.x * (ballSize + space)}px`}
          style:top={`${space + ball.y * (ballSize + space)}px`}
          style:width={`${ballSize}px`}
          style:height={`${ballSize}px`}
          style:background-color={game.parameters.colors[ball.color]}
        ></div>
      {/key}
    {/each}

    {#if game.gameOver}
      <div in:fade class="state-text">Perdu !</div>
    {:else if game.pause}
      <div in:fade class="state-text">Pause !</div>
    {/if}
  </div>
  <div class="flex flex-col">
    <div>Points : {game.points}</div>
    <div class="join">
      <button
        class="btn join-item"
        onclick={() => {
          game.moveHorizontally(-1);
        }}><LeftArrow></LeftArrow></button
      >
      <button
        class="btn join-item"
        onclick={() => {
          game.moveHorizontally(1);
        }}><RightArrow></RightArrow></button
      >
      <button
        class="btn join-item"
        onclick={() => {
          game.rotateSet();
        }}><Rotate></Rotate></button
      >
      <button
        class="btn join-item"
        onclick={() => {
          game.moveDown();
        }}><DownArrow></DownArrow></button
      >
      <button
        class="btn join-item"
        onclick={() => {
          game.togglePause();
        }}><Pause></Pause></button
      >
      <button
        class="btn join-item"
        onclick={() => {
          onNewGame();
        }}><Exit></Exit></button
      >
    </div>
    <div>Prochain :</div>
    <div
      class="next-balls"
      style:width={`${ballSize + 2 * space}px`}
      style:height={`${(ballSize + space) * game.nextSet.length + space}px`}
    >
      {#each game.nextSet as ball, y}
        {#key ball.id}
          <div
            class="ball"
            style:left={`${space}px`}
            style:top={`${space + y * (ballSize + space)}px`}
            style:width={`${ballSize}px`}
            style:height={`${ballSize}px`}
            style:background-color={game.parameters.colors[ball.color]}
          ></div>
        {/key}
      {/each}
    </div>
  </div>
</div>

<style>
  .ball {
    position: absolute;
    border-radius: 50%;
    box-shadow: 3px 1px 5px 0px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: radial-gradient(
      farthest-side circle at 50% 120%,
      rgba(255, 255, 255, 0.45),
      rgba(0, 0, 0, 0)
    );
    transition-property: left, top;
    transition-duration: 200ms;
    transition-timing-function: linear;
  }
  .ball:before {
    content: "";
    position: absolute;
    top: 1%;
    left: 5%;
    width: 90%;
    height: 90%;
    border-radius: 50%;
    background: radial-gradient(
      circle at 50% 0px,
      #ffffff,
      rgba(255, 255, 255, 0) 58%
    );
    filter: blur(5px);
    z-index: 2;
  }
  .board {
    box-sizing: content-box;
    display: inline-block;
    border: 10px solid gray;
    background: linear-gradient(to bottom, #fff, #88f);
    border-radius: 20px;
    position: relative;
  }
  .state-text {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    text-align: center;
    align-content: center;
    border-radius: 10px;
    color: red;
    font-weight: 900;
    font-size: 200%;
    text-shadow: 0px 0px 11px #a44;
    background-color: rgba(100, 100, 100, 0.8);
    z-index: 3;
  }
  .next-balls {
    display: inline-block;
    margin-left: 20px;
    position: relative;
  }
</style>
