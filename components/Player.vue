<template>
  <div>
    <a-affix :style="{ position: 'absolute', bottom: 0, left: 0}">
      <h1>Player: {{ this.playing.songId }}</h1>
      <p>{{ this.playing.time }}</p>
      <ul>
        <li v-for="song in playlist" v-bind:key="song.id" v-on:click="play(song.id)">{{ song.title }}</li>
      </ul>
      <button v-on:click="play" v-if="status=='play'">Play</button>
      <button v-on:click="pause" v-if="status=='pause'">Pause</button>
    </a-affix>
  </div>
</template>

<script>
import {Howl, Howler} from 'howler';
var player = {};
var timer = null;

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
      status: null,
      playing: {
        songId: null,
        time: 0,
      },
    }
  },
  methods: {
    play: function(songId) {
      var song = this.playlist.find(function(song) {
        return song.id == songId;
      });

      if(this.playing.songId) {
        if(this.playing.songId != songId) {
          player[this.playing.songId].stop();
        }
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
          },
          onstop: function() {
            clearInterval(timer);
          }
        });
        player[songId].play();
      }
    
      timer = setInterval(function(){
        this.$set(this.playing, 'time', player[songId].seek());
      }.bind(this), 1000);
      this.$set(this.playing, 'songId', songId);
      this.status = 'play';
    },
    stop: function() {

    },
    pause: function() {
      if(this.playing.songId) {
        this.status = 'pause';
        player[this.playing.songId].pause();
      }
    },
    addPlaylist: function(songs) {
      this.playlist = songs;
    }
  }
}
</script>