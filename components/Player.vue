<template>
  <div>
    <h1>Player</h1>
    <button v-on:click="play">Play</button>
  </div>
</template>

<script>
export default {
  methods: {
    play: function() {
      console.log(this.$store.state.songs.songs);
    }
  }
}
</script>