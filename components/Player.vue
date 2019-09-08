<template>
  <div>
    <h1>Player</h1>
    <ul>
      <li v-for="song in playlist" v-bind:key="song.id" v-on:click="play(song.id)">{{ song.title }}</li>
    </ul>
    <button v-on:click="play">Play</button>
  </div>
</template>

<script>
import {Howl, Howler} from 'howler';
var player = {};

export default {
  created: function() {
    this.$bus.$on('add-playlist', function(songs) {
      this.addPlaylist(songs);
    }.bind(this));

    this.$bus.$on('play',function(songId) {
      this.play(songId);
    }.bind(this));
  },
  data: function() {
    return {
      playlist: [],
      playing: null,
    }
  },
  methods: {
    play: function(songId) {
      var song = this.playlist.find(function(song) {
        return song.id == songId;
      });

      if(this.playing) {
        player[this.playing].stop();
      }

      if(player[songId]) {
        player[songId].play();
      }
      else {
        player[songId] = new Howl({
          src: [song.link],
          html5: true,
          onloaderror: function(id, message) {
            console.log(message);
          },
          onplayerror: function(id, message) {
            console.log(message);
          },
          onseek: function() {
            console.log('seek');
          }
        });

        player[songId].play();
      }
      this.playing = songId;
    },
    addPlaylist: function(songs) {
      this.playlist = songs;
    }
  }
}
</script>