<script lang="ts">
  import {
    commonColors,
    defaultParameters,
    type GameParameters,
  } from "./game.svelte";

  let { onNewGame }: { onNewGame: (game: GameParameters) => void } = $props();
  let balls = $state(defaultParameters.balls);
  let width = $state(defaultParameters.width);
  let height = $state(defaultParameters.height);
  let colors = $state(defaultParameters.colors.length);
  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    onNewGame({
      balls,
      width,
      height,
      colors: commonColors.slice(0, colors),
    });
  };
</script>

<h2>Paramètres du jeu:</h2>
<form onsubmit={submit}>
  <p>Nombre de billes: <input type="number" bind:value={balls} /></p>
  <p>Largeur du cadre: <input type="number" bind:value={width} /></p>
  <p>Hauteur du cadre: <input type="number" bind:value={height} /></p>
  <p>Nombre de couleurs: <input type="number" bind:value={colors} /></p>
  <button type="submit">Démarrer</button>
</form>
