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
  let stepDuration = $state(defaultParameters.stepDuration);
  let colors = $state(defaultParameters.colors.length);

  const reset = () => {
    balls = defaultParameters.balls;
    width = defaultParameters.width;
    height = defaultParameters.height;
    colors = defaultParameters.colors.length;
  };

  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    onNewGame({
      balls,
      width,
      height,
      stepDuration,
      colors: commonColors.slice(0, colors),
    });
  };
</script>

<form onsubmit={submit} class="card w-72 shadow-xl mb-3">
  <div class="card-body">
    <h2 class="card-title">Paramètres du jeu :</h2>
    <label class="form-control">
      Nombre de billes: <input
        class="input input-bordered input-sm"
        type="number"
        required
        bind:value={balls}
        min={2}
        max={6}
      /></label
    >
    <label class="form-control"
      >Largeur du cadre: <input
        class="input input-bordered input-sm"
        type="number"
        required
        bind:value={width}
        min={3}
        max={10}
      /></label
    >
    <label class="form-control">
      Hauteur du cadre: <input
        class="input input-bordered input-sm"
        type="number"
        required
        bind:value={height}
        min={5}
        max={20}
      /></label
    >
    <label class="form-control">
      Nombre de couleurs: <input
        class="input input-bordered Iinput-sm"
        type="number"
        required
        bind:value={colors}
        min={2}
        max={commonColors.length}
      /></label
    >
    <label class="form-control">
      Durée (ms): <input
        class="input input-bordered Iinput-sm"
        type="number"
        required
        bind:value={stepDuration}
        min={250}
        max={5000}
      /></label
    >
    <div class="card-actions justify-end mt-3">
      <button class="btn" type="button" onclick={reset}>Réinitialiser</button>
      <button class="btn btn-primary" type="submit">Démarrer</button>
    </div>
  </div>
</form>
