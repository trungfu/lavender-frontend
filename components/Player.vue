<template>
  <div>
    <a-affix class="player">
      <a-row>
        <a-col :span="4">
          <div class="player-control">
            <a-button type="primary" shape="circle" icon="step-backward" v-if="canPrevious" v-on:click="previous" />
            <a-button type="primary" shape="circle" icon="play-circle" v-if="canPlay" v-on:click="resume" />
            <a-button type="primary" shape="circle" icon="pause-circle" v-if="canPause" v-on:click="pause" />
            <a-button type="primary" shape="circle" icon="step-forward" v-if="canNext" v-on:click="next" />
          </div>
        </a-col>
        <a-col :span="15">
          <p>Player {{ this.currentSongIndex }}</p>
          <p>{{ this.playing.time }}</p>
        </a-col>
        <a-col :span="5">
          <a-button v-on:click="isShowPlaylist = !isShowPlaylist" >Playlist</a-button>
        </a-col>
      </a-row>
      <div class="playlist" v-bind:class="{ open: isShowPlaylist }">
        <ul>
          <li v-for="song in playlist" v-bind:key="song.id" v-on:click="play(song.id)">{{ song.title }}</li>
        </ul>
      </div>
    </a-affix>
  </div>
</template>

<script>
import {Howl, Howler} from 'howler';
import _ from 'lodash';

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
      isShowPlaylist: false,
      status: null,
      playing: {
        song: null,
        time: 0,
      },
    }
  },
  methods: {
    play: function(songId) {
      var song = this.playlist.find(function(song) {
        return song.id == songId;
      });

      if(_.get(this.playing, 'song.id')) {
        if(this.playing.song.id != songId) {
          player[this.playing.song.id].stop();
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
          onend: function() {
            clearInterval(timer);
            this.next();
          },
          onstop: function() {
            clearInterval(timer);
          }
        });
        player[songId].play();
      }
    
      this.$set(this.playing, 'song', song);

      timer = setInterval(function(){
        this.$set(this.playing, 'time', player[this.playing.song.id].seek());
      }.bind(this), 1000);

      this.status = 'play';
    },
    stop: function() {

    },
    pause: function() {
      if(this.playing.song.id) {
        this.status = 'pause';
        player[this.playing.song.id].pause();
      }
    },
    resume: function() {
      if(this.playing.song.id) {
        this.status = 'play';
        player[this.playing.song.id].play();
      }
    },
    next: function() {
      if(this.canNext) {
        var nextSongIndex = this.currentSongIndex + 1;
        this.play(this.playlist[nextSongIndex].id);
      }
    },
    previous: function() {
      if(this.canPrevious) {
        var previousSongIndex = this.currentSongIndex - 1;
        this.play(this.playlist[previousSongIndex].id);
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
    },
    canNext: function() {
      return this.currentSongIndex < this.playlist.length - 1;
    },
    canPrevious: function() {
      return this.currentSongIndex >= 1;
    },
    currentSongIndex: function() {
      if(!this.playing.song) {
        return null;
      }

      return this.playlist.indexOf(this.playing.song);
    }
  }
}
</script>

<style lang="scss">
  .player{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #37829A;
    color: #C7D9DF;
    .player-control {
      button {
        background: #E6AFAD;
      }
    }
    .playlist {
      height: 0;
      bottom: 100%;
      left: 0;
      right: 0;
      margin-left: auto;
      margin-right: auto;
      width: 1024px;
      position: absolute;
      overflow: hidden;
      background: #204766;
    }
    .playlist.open {
      height: calc(100vh - 70px);
    }
  }
</style>
