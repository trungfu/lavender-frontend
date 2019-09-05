<template>
  <div>
    <nuxt />
    <player />
  </div>
</template>

<script>
import Player from '~/components/Player.vue';

export default {
  components: {
    player: Player
  }
}
</script>
