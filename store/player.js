export const state = () => ({
  playlist: []
});

export const mutations = {
  addSong(state, song) {
    state.playlist.push(song);
  },
  addPlaylist(state, playlist) {
    state.playlist = playlist;
  }
}