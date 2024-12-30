<script lang="ts">
  import Game from "./Game.svelte";
  import { type GameParameters } from "./game.svelte";
  import Parameters from "./Parameters.svelte";

  let parameters: GameParameters | null = null;
</script>

<h1>Columns</h1>
<p>
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
