<template>
  <div>
    <ul>
      <li v-for="song in songs" v-bind:key="song.id" v-on:click="playAlbum(song.id)">{{ song.title }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['songs'],
  methods: {
    playAlbum: function(songId) {
      this.addPlaylist();
      this.playSong(songId);
    },
    playSong: function(songId) {
      this.$bus.$emit('play', songId);
    },
    addPlaylist: function() {
      this.$bus.$emit('add-playlist', this.songs);
    }
  }
}
</script>