export const state = () => ({
  songs: []
});

export const mutations = {
  add(state, song) {
    state.songs.push(song);
  }
}