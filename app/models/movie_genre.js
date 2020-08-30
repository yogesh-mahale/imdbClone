'use strict';

module.exports = function(sequelize, DataTypes) {
    var Movie_genre = sequelize.define('Movie_genre', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        movieId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        genreId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        associate: function (models) {
            Movie_genre.belongsTo(models.Movie, {foreignKey: 'movieId', onDelete: 'CASCADE'});
            Movie_genre.belongsTo(models.Genre, {foreignKey: 'genreId', onDelete: 'CASCADE'});
        },
        loadScopes: function(models) {

            Movie_genre.addScope('withMovie', function(params) {
                return {
                    include: [{
                        model: models.Movie,
                        required: false
                    }]
                }
            }, {});

            Movie_genre.addScope('withGenre', function(params) {
                return {
                    include: [{
                        model: models.Genre,
                        required: false
                    }]
                }
            }, {});

            Movie_genre.addScope('offsetLimit', function(params) {
                return {
                    offset: params.offset ? parseInt(params.offset) : null,
                    limit: params.limit ? parseInt(params.limit) : null,
                }
            }, {});

            Movie_genre.addScope('orderBy', function(orderBy) {
                return {
                    order: [orderBy.split(' ')]
                }
            }, {});
        },
        tableName: 'movie_genre'
    });

    return Movie_genre;
};
