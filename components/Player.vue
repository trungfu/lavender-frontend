<template>
  <div>
    <a-affix :style="{ position: 'absolute', bottom: 0, left: 0}">
      <h1>Player: {{ this.playing.songId }}</h1>
      <p>{{ this.playing.time }}</p>
      <ul>
        <li v-for="song in playlist" v-bind:key="song.id" v-on:click="play(song.id)">{{ song.title }}</li>
      </ul>
      <button v-on:click="resume" v-if="canPlay">Play</button>
      <button v-on:click="pause" v-if="canPause">Pause</button>
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
        else {
          return;
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
          onend: function() {
            clearInterval(timer);
          },
          onstop: function() {
            clearInterval(timer);
          }
        });
        player[songId].play();
      }
    
      timer = setInterval(function(){
        this.$set(this.playing, 'time', player[this.playing.songId].seek());
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
    resume: function() {
      if(this.playing.songId) {
        this.status = 'play';
        player[this.playing.songId].play();
      }
    },
    addPlaylist: function(songs) {
      this.playlist = songs;
    }
  },
  computed: {
    canPlay: function() {
      if(this.status == 'pause') {
        return true;
      }

      return false;
    },
    canPause: function() {
      if(this.status == 'play') {
        return true;
      }

      return false;
    }
  }
}
</script>