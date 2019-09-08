<template>
  <div>
    <playlist v-bind:songs="songs" />
  </div>
</template>

<script>
import Playlist from '~/components/Playlist.vue';
import axios from 'axios';

export default {
  async asyncData({ params }) {
    let { data } = await axios.get('http://lavender.local/api/songs/popular');

    return {
      songs: data.data
    };
  },
  methods: {
    
  },
  components: {
    Playlist
  }
}
</script>
