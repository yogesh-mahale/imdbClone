angular.module('imdbApp.user').controller('MovieController', ['$scope', '$window', 'Global', '$state', '$stateParams', 'UsersService', 'MoviesService', 'Notification',function ($scope, $window, Global, $state, $stateParams, UsersService, MoviesService, Notification) {

    /****************** VM Variables Declarations ************/
    let vm = this;

    // Holds the movie default img.
    vm.defaultImg = 'https://m.media-amazon.com/images/M/MV5BOTVjMmFiMDUtOWQ4My00YzhmLWE3MzEtODM1NDFjMWEwZTRkXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_QL50_SY1000_CR0,0,674,1000_AL_.jpg';

    // Holds the data of add movie form
    vm.movie = {
        id: null,
        name: null,
        director: null,
        writer: null,
        cast: null,
        description: null,
        imdbScore: null,
        popularity: null,
        releaseDate: null
    };

    vm.movies = []; // Holds the list of movies

    // Holds the details of paginations
    vm.pagination = {
        movie: {
            count: 0,
            page: 1,
            pages: 1,
            limitPerPage: 10,
            orderBy: 'addedOn DESC'
        },
        genre: {
            count: 0,
            page: 1,
            pages: 1,
            limitPerPage: 10,
            orderBy: 'addedOn DESC'
        }
    };

    // Holds the filter criteria
    vm.filter = {
        movie: {
            query: null,
            genres: null,
            orderBy: null
        }
    };

    vm.genres = []; // Holds the genres list

    // Holds the data of 'add genre form'
    vm.genre = {
        id: null,
        name: null,
        status: null
    };

    // Holds the select2 data for movieGenre dropdown on Add/Edit movie form
    vm.movieGenre = {
        access: 1, //
        genres: [],
        selectedMembers: []
    };


    /****************** Scopes Declarations ************/
    $scope.$stateParams = $stateParams;
    $scope.$state = $state;

    $scope.getUserCtrlInstance = function () {
        return vm;
    };

    $scope.maxSize = 5; // Max pagination pages

    /****************** VM Methods Declarations ************/
    /**
     * Create or Edit movie
     *
     * @param movieForm
     */
    vm.submit = function(movieForm) {
        //1. Check does form valid
        if (movieForm.$valid) {
            //2. If movie is in edit mode. Update the movie
            if (vm.movie.id) {
                //2.0 Note: Movie name should not be edited
                let params = {
                    movieId: vm.movie.id,
                    director: vm.movie.director,
                    writer: vm.movie.writer,
                    cast: vm.movie.cast,
                    description: vm.movie.description,
                    imdbScore: vm.movie.imdbScore,
                    popularity: vm.movie.popularity,
                    releaseDate: vm.movie.releaseDate,
                    genres: vm.movieGenre.selectedMembers
                };

                //3. Update the movie by calling api
                let moviesService = new MoviesService();
                moviesService.updateMovie(params).then(function (response) {
                    if (response.success) {

                        //3.1 Show success notification
                        Notification.success({
                            message: 'Movie updated successfully',
                            title: 'Success Notification'
                        });

                        //3.2 Go to the movies list
                        setTimeout(function () {
                            $state.go('movies.list');
                        }, 500);
                    } else {
                        //3.1 On error show error notification
                        Notification.error({
                            message: response.message,
                            title: 'Error Notification'
                        });
                    }

                });
            } else {
                //2. If movie is not in edit mode. Create the movie
                let params = {
                    name: vm.movie.name,
                    director: vm.movie.director,
                    writer: vm.movie.writer,
                    cast: vm.movie.cast,
                    description: vm.movie.description,
                    imdbScore: vm.movie.imdbScore,
                    popularity: vm.movie.popularity,
                    releaseDate: vm.movie.releaseDate,
                    genres: vm.movieGenre.selectedMembers
                };

                //3 Call the movie create api
                let moviesService = new MoviesService();
                moviesService.createMovie(params).then(function (response) {
                    if (response.success) {
                        //3.1 Show success notification
                        Notification.success({
                            message: 'Movie created successfully',
                            title: 'Success Notification'
                        });

                        //3.2 Go to the movies list
                        setTimeout(function () {
                            $state.go('movies.list');
                        }, 500);
                    } else {
                        //3.1 On error show error notification
                        Notification.error({
                            message: response.message,
                            title: 'Error Notification'
                        });
                    }
                });
            }
        } else {
            //1.1 If form is invalid then show error
            Notification.error({
                message: 'Form is invalid. Please fill all required details',
                title: 'Error Notification'
            });
        }
    };

    vm.initMovieList = function () {
        console.log('--> | in initMovieList');
        vm.getMovies(); // Get movies
        vm.getGenres(); // Get Genres
    };

    /**
     * Reset to default of movies params
     */
    vm.resetMoviesParams = function () {
        vm.movies = [];
        /*vm.pagination.movie = {
            count: 0,
            page: 1,
            pages: 1,
            limitPerPage: 10,
            orderBy: 'addedOn DESC'
        };*/

        vm.pagination.movie.count = 0;
        vm.pagination.movie.page = 1;
        vm.pagination.movie.pages = 1;
        vm.pagination.movie.limitPerPage = 10;

        vm.filter = {
            movie: {
                query: null,
                genres: null,
                orderBy: null
            }
        };
    };

    /**
     * Sorting algorithm for movies
     */
    vm.sortMovies = function (options) {
        if (options.orderBy) {
            //1. Reset the params
            vm.resetMoviesParams();

            //2. Set order by column on which sorting apply
            vm.pagination.movie.orderBy = options.orderBy;

            //3. Prepare params
            let params = {
                page: vm.pagination.movie.page,
                limitPerPage: vm.pagination.movie.limitPerPage,
                orderBy: vm.pagination.movie.orderBy,
                criteria: {
                    where: {}
                },
                scopes: ['withAddedBy']
            };

            //4. Get movies
            vm.getMovies(params);
        }
    };

    /**
     * Movie Search functionality
     * @param options
     * @returns {boolean}
     */
    vm.searchMovies = function (options) {
        //1. Reset the params
        if (_.get(options, 'reset', null)) {
            vm.filter.movie.query = null;
            vm.resetMoviesParams();
            vm.getMovies();
            return false;
        }

        //vm.resetMoviesParams();
        //2. Reset the params
        if (_.get(vm.filter, 'movie.query', null)) {
            let params = {
                page: vm.pagination.movie.page,
                limitPerPage: vm.pagination.movie.limitPerPage,
                orderBy: vm.pagination.movie.orderBy,
                criteria: {
                    where: {}
                },
                scopes: ['withAddedBy']
            };

            //2.1 Set query param in criteria
            params.criteria.where = Object.assign(
                params.criteria.where,
                {
                    query: vm.filter.movie.query
                }
            );

            //2.3 Fetch movies
            vm.getMovies(params);
        } else {
            //3 refresh the list
            vm.getMovies();
        }
    };

    /**
     * Filter the movies by genres on home page.
     * @param options
     * @returns {boolean}
     */
    vm.filterMovies = function (options) {
        //1. Reset the params
        if (_.get(options, 'reset', null)) {
            vm.filter.movie.query = null;
            vm.filter.movie.genres = null;
            vm.resetMoviesParams();
            vm.getMovies();
            return false;
        }

        //3. Prepare params
        let params = {
            page: vm.pagination.movie.page,
            limitPerPage: vm.pagination.movie.limitPerPage,
            orderBy: vm.pagination.movie.orderBy,
            criteria: {
                where: {}
            },
            scopes: []
        };

        //3.1 set query params
        if (_.get(vm.filter, 'movie.query', null)) {
            params.criteria.where = Object.assign(
                params.criteria.where,
                {
                    query: vm.filter.movie.query
                }
            );
        }

        //3.2 set genres in criteria. So only records of selected genres will be filtered
        if (_.get(vm.filter, 'movie.genres', null)) {
            const objectArray = Object.entries(vm.filter.movie.genres);

            //3.2.1 Get genreIds array from form data
            let selectedGenreIds = [];
            objectArray.forEach(([key, value])   => {
                console.log(key);
                console.log(value);
                if (value) {
                    selectedGenreIds.push(key);
                }
            });

            //3.3 Set genres criteria
            params.criteria.where = Object.assign(
                params.criteria.where,
                {
                    genres: selectedGenreIds
                }
            );
        }

        //4. Fetch movies
        vm.getMovies(params);
    };

    /**
     * Pagination of movies table
     *
     * @param page
     */
    vm.loadMoreMovies = function (page) {
        //1. Set current page of pagination
        vm.pagination.movie.page = page;

        //2. Prepare params
        let params = {
            page: vm.pagination.movie.page,
            limitPerPage: vm.pagination.movie.limitPerPage,
            orderBy: vm.pagination.movie.orderBy,
            criteria: {
                where: {}
            },
            scopes: ['withAddedBy']
        };

        if (_.get(vm.filter, 'movie.query', null)) {
            params.criteria.where = Object.assign(
                params.criteria.where,
                {
                    query: vm.filter.movie.query
                }
            );
        }

        //3. Fetch movies if page is not last page
        if (params.page <= vm.pagination.movie.pages) {
            vm.getMovies(params);
        } else {
            console.log('--> End of movies pagination..');
        }
    };

    /**
     * Get the movies list from db.
     * @param params
     */
    vm.getMovies = function (params) {
        //1 If params not set then default params should be set
        if (!params) {
            //2. Reset the old data.
            vm.resetMoviesParams();

            //2.1 Default pagination params
            params = {
                page: vm.pagination.movie.page,
                limitPerPage: vm.pagination.movie.limitPerPage,
                orderBy: vm.pagination.movie.orderBy,
                criteria: {
                    where: {}
                },
                scopes: ['withAddedBy']
            };

            if (_.get(vm.filter, 'movie.query', null)) {
                params.criteria.where = Object.assign(
                    params.criteria.where,
                    {
                        query: vm.filter.movie.query
                    }
                );
            }
        }

        //3. Fetch movies
        let moviesService = new MoviesService();
        moviesService.getMovies(params).then(function (movies) {
            //3.1 Parse the movies data
            vm.parseMoviesData(movies);
        });
    };

    /**
     * Parse the movies data
     * @param movies
     */
    vm.parseMoviesData = function (movies) {
        if (_.has(movies, 'result') && !_.isEmpty(movies.result)) {
            vm.movies = movies.result; // set movies list

            // Update pagination details
            vm.pagination.movie.count = movies.count;
            vm.pagination.movie.limitPerPage = movies.limitPerPage;
            vm.pagination.movie.page = movies.page;
            vm.pagination.movie.pages = movies.pages;
        }
    };

    /**
     * Open the movie details page.
     */
    vm.viewMovie = function() {
        vm.resetMovie();
        //1. Get movie using movieId in url
        if ($stateParams.movieId) {
            vm.getMovie($stateParams.movieId);
        }
    };

    /**
     * Initialize the movie edit page.
     */
    vm.initEditMovie = function() {
        if ($stateParams.movieId) {
            // Fetch movie
            vm.getMovie($stateParams.movieId)
        } else {
            vm.resetMovie();
        }

        // Fetch genres list
        vm.getGenres();
    };

    vm.resetMovie = function() {
        vm.movie = {
            id: null,
            name: null,
            director: null,
            writer: null,
            cast: null,
            description: null,
            imdbScore: null,
            popularity: null,
            releaseDate: null
        };
    };

    /**
     * Get movie details using movieId
     * @param movieId
     */
    vm.getMovie = function(movieId) {
        if (movieId) {
            //1. Prepare params
            let params = {
                movieId: movieId
            };

            //2. Fetch movie
            let moviesService = new MoviesService();
            moviesService.getMovie(params).then(function (movie) {
                vm.movie = movie;
                console.log('--> movie | ', vm.movie);
            });
        }
    };

    /**
     * Delete the movies
     * @param movieId
     */
    vm.deleteMovie = function(movieId) {
        //1 Delete movie by id
        let params = {
            movieId: movieId,
            status: -1
        };

        //2 Call Delete api
        let moviesService = new MoviesService();
        moviesService.deleteMovie(params).then(function (response) {
            if (response.error) {
                //2.1 Error notification
                Notification.error({
                    message: 'Error in updating movie',
                    title: 'Error Notification'
                });
            }

            if (response.success) {
                //2.2 Success notification
                Notification.success({
                    message: 'Movie deleted Successfully',
                    title: 'Success Notification'
                });

                //2.3 Refresh the list
                setTimeout(function() {
                    $state.reload();
                }, 500);
            }
        });
    };


    //////////////////// Genre //////////////////////
    vm.initGenreList = function () {
        console.log('--> | in initGenreList');
        vm.getGenres();
    };

    /**
     * Fetch genres list
     * @param params
     */
    vm.getGenres = function (params) {
        if (!params) {
            //1. Default pagination params
            params = {
                page: vm.pagination.genre.page,
                limitPerPage: vm.pagination.genre.limitPerPage,
                orderBy: vm.pagination.genre.orderBy,
                criteria: {
                    where: {}
                },
                scopes: []
            };
        }

        //2. Fetch details
        let moviesService = new MoviesService();
        moviesService.getGenres(params).then(function (genres) {
            vm.parseGenreData(genres);
        });
    };

    /**
     * Parse genres data
     * @param genres
     */
    vm.parseGenreData = function (genres) {
        if (_.has(genres, 'result') && !_.isEmpty(genres.result)) {
            vm.genres = genres.result;
            vm.movieGenre.genres = genres.result;

            // Update pagination details
            vm.pagination.genre.count = genres.count;
            vm.pagination.genre.limitPerPage = genres.limitPerPage;
            vm.pagination.genre.page = genres.page;
            vm.pagination.genre.pages = genres.pages;
        }
    };

    /**
     * Create the genre
     * @param genreForm
     */
    vm.submitGenre = function(genreForm) {
        if (genreForm.$valid) {
            if (vm.genre.id) {
                //1. Update the movie
                let params = {
                    name: vm.genre.name
                };

                //2. Update the genre
                let moviesService = new MoviesService();
                moviesService.updateGenre(params).then(function (response) {
                    if (response.success) {
                        Notification.success({
                            message: 'Genre updated successfully',
                            title: 'Success Notification'
                        });

                        //3. Go to genre list
                        setTimeout(function () {
                            $state.go('genre.list');
                        }, 500);
                    } else {
                        Notification.error({
                            message: response.message,
                            title: 'Error Notification'
                        });
                    }

                });
            } else {
                //1. Create the genre
                let params = {
                    name: vm.genre.name,
                    status: 1
                };

                //2. Create the genre
                let moviesService = new MoviesService();
                moviesService.createGenre(params).then(function (response) {
                    if (response.success) {
                        Notification.success({
                            message: 'Genre created successfully',
                            title: 'Success Notification'
                        });

                        //3. Go to genre list
                        setTimeout(function () {
                            $state.go('genres.list');
                        }, 500);
                    } else {
                        Notification.error({
                            message: response.message,
                            title: 'Error Notification'
                        });
                    }

                });
            }
        } else {
            Notification.error({
                message: 'Form is invalid. Please fill all required details',
                title: 'Error Notification'
            });
        }
    };

    vm.onItemClick = function (data) {
        console.log(data);
    };

    /****************** Controller Initialization ************/
    function init() {
        console.log('--> | Initialized the MovieController...');
    }

    // Staring point of ctrl.
    init();
}]);