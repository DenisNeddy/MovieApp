import IDs from "@/store/mock/imdb_top250";
import axios from "@/plugins/axios";
import mutations from "@/store/mutations";

function serializeRespons(movies) {
  return movies.reduce((acc, movie) => {
    acc[movie.imdbID] = movie;
    return acc;
  }, {});
}

const { MOVIES } = mutations;

const moviesStore = {
  namespaced: true,
  state: {
    top250IDs: IDs,
    moviesPerPage: 12,
    currentPage: 1,
    movies: {},
  },
  getters: {
    slicedIDs:
      ({ top250IDs }) =>
      (form, to) =>
        top250IDs.slice(form, to),
    currentPage: ({ currentPage }) => currentPage,
    moviesPerPage: ({ moviesPerPage }) => moviesPerPage,
  },
  mutations: {
    [MOVIES](state, value) {
      state.movies = value;
    },
  },
  actions: {
    async fetchMovies({ getters, commit }) {
      try {
        const { currentPage, moviesPerPage, slicedIDs } = getters;
        const from = currentPage * moviesPerPage - moviesPerPage;
        const to = currentPage * moviesPerPage;
        const moviesToFetch = slicedIDs(from, to);

        const request = moviesToFetch.map((id) => axios.get(`/?i=${id}`));
        const response = await Promise.all(request);
        const movies = serializeRespons(response);
        commit(MOVIES, movies);
      } catch (err) {
        console.log(err);
      }
    },
  },
};

export default moviesStore;
