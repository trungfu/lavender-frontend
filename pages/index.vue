<template>
  <div>
    <ul>
      <li v-for="song in songs" v-bind:key="song.id" v-on:click="playSong(song.id)">{{ song.title }}</li>
    </ul>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue';
import axios from 'axios';

export default {
  async asyncData({ params }) {
    let { data } = await axios.get('http://lavender.local/api/songs/popular');

    return {
      songs: data.data
    };
  },
  methods: {
    playSong: function(id) {
      this.$store.commit('songs/add', {'title': 'test'});
    }
  },
  components: {
    Logo
  }
}
</script>
