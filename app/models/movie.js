'use strict';

module.exports = function(sequelize, DataTypes) {
    var Movie = sequelize.define('Movie', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        director: {
            type: DataTypes.STRING,
            allowNull: true
        },
        writer: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        cast: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        imdbScore: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "-1 for deleted, 0 for Draft, 1 for Active, 2 for Publish, 3 for Paused"
        },
        popularity: {
            type: DataTypes.STRING,
            allowNull: true
        },
        totalViewed: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        totalLiked: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        extra: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        addedOn: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        },
        updatedOn: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        },
        releaseDate: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        },
        addedBy: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        associate: function (models) {
            Movie.belongsTo(models.User, {as: 'AddedByUser', foreignKey: 'addedBy', onDelete: 'CASCADE'});
            Movie.belongsTo(models.User, {as: 'UpdatedByUser', foreignKey: 'updatedBy', onDelete: 'CASCADE'});
        },
        loadScopes: function(models) {

            Movie.addScope('withAddedBy', function(params) {
                return {
                    include: [{
                        model: models.User.schema(params.biz),
                        as: 'AddedByUser',
                        required: false,
                        attributes: params.attributes || ['id', 'name', 'email', 'status']
                    }]
                }
            }, {});

            Movie.addScope('withUpdatedBy', function(params) {
                return {
                    include: [{
                        model: models.User.schema(params.biz),
                        as: 'UpdatedByUser',
                        required: false,
                        attributes: params.attributes || ['id', 'name', 'email', 'status']
                    }]
                }
            }, {});

            Movie.addScope('offsetLimit', function(params) {
                return {
                    offset: params.offset ? parseInt(params.offset) : null,
                    limit: params.limit ? parseInt(params.limit) : null,
                }
            }, {});

            Movie.addScope('orderBy', function(orderBy) {
                /* orderBy should be 'id DESC' or 'name ASC' like that.
                     example:
                     return {
                         order: [['updatedOn', 'DESC']]
                     }
                 */
                return {
                    order: [orderBy.split(' ')]
                }
            }, {});
        },
        tableName: 'movie'
    });

    return Movie;
};
'use strict';

module.exports = function(sequelize, DataTypes) {
    var Movie = sequelize.define('Movie', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        director: {
            type: DataTypes.STRING,
            allowNull: true
        },
        writer: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        cast: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        imdbScore: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "-1 for deleted, 0 for Draft, 1 for Active, 2 for Publish, 3 for Paused"
        },
        popularity: {
            type: DataTypes.STRING,
            allowNull: true
        },
        totalViewed: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        totalLiked: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        extra: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        addedOn: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        },
        updatedOn: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        },
        releaseDate: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        },
        addedBy: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        associate: function (models) {
            Movie.belongsTo(models.User, {as: 'AddedByUser', foreignKey: 'addedBy', onDelete: 'CASCADE'});
            Movie.belongsTo(models.User, {as: 'UpdatedByUser', foreignKey: 'updatedBy', onDelete: 'CASCADE'});

            Movie.hasMany(models.Movie_genre, {foreignKey: 'movieId', onDelete: 'CASCADE'});
        },
        loadScopes: function(models) {

            Movie.addScope('withAddedBy', function(params) {
                return {
                    include: [{
                        model: models.User,
                        as: 'AddedByUser',
                        required: false,
                        attributes: params.attributes || ['id', 'name', 'email', 'status']
                    }]
                }
            }, {});

            Movie.addScope('withUpdatedBy', function(params) {
                return {
                    include: [{
                        model: models.User,
                        as: 'UpdatedByUser',
                        required: false,
                        attributes: params.attributes || ['id', 'name', 'email', 'status']
                    }]
                }
            }, {});

            Movie.addScope('withMovieGenre', function(params) {
                return {
                    include: [{
                        model: models.Movie_genre,
                        required: false,
                        include: [{
                            model: models.Genre,
                            required: false
                        }]
                    }]
                }
            }, {});

            Movie.addScope('offsetLimit', function(params) {
                return {
                    offset: params.offset ? parseInt(params.offset) : null,
                    limit: params.limit ? parseInt(params.limit) : null,
                }
            }, {});

            Movie.addScope('orderBy', function(orderBy) {
                return {
                    order: [orderBy.split(' ')]
                }
            }, {});
        },
        tableName: 'movie'
    });

    return Movie;
};
