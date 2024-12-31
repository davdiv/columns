<script lang="ts">
  import Game from "./Game.svelte";
  import { type GameParameters } from "./game.svelte";
  import Parameters from "./Parameters.svelte";

  let parameters: GameParameters | null = null;
</script>

<div class="m-3">
  <h1 class="text-4xl font-bold mb-3">Columns</h1>
  <p class="mb-3 italic">
    Règle du jeu : Formez des successions de 3 billes ou plus de même couleur
    (horizontalement, verticalement ou en diagonale).
  </p>

  {#if parameters}
    <Game
      {parameters}
      onNewGame={() => {
        parameters = null;
      }}
    ></Game>
  {:else}
    <Parameters
      onNewGame={(p) => {
        parameters = p;
      }}
    ></Parameters>
  {/if}

  <p class="pt-3 text-gray-500">
    Le <a class="link" href="https://github.com/davdiv/columns">code source</a> de ce jeu est
    disponible.
  </p>
</div>
