'use strict';

module.exports = function(sequelize, DataTypes) {
    var Genre = sequelize.define('Genre', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false
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
            Genre.belongsTo(models.User, {as: 'AddedByUser', foreignKey: 'addedBy', onDelete: 'CASCADE'});
            Genre.belongsTo(models.User, {as: 'UpdatedByUser', foreignKey: 'updatedBy', onDelete: 'CASCADE'});

        },
        loadScopes: function(models) {

            Genre.addScope('withAddedBy', function(params) {
                return {
                    include: [{
                        model: models.User.schema(params.biz),
                        as: 'AddedByUser',
                        required: false,
                        attributes: params.attributes || ['id', 'firstName', 'lastName', 'email']
                    }]
                }
            }, {});

            Genre.addScope('withUpdatedBy', function(params) {
                return {
                    include: [{
                        model: models.User.schema(params.biz),
                        as: 'UpdatedByUser',
                        required: false,
                        attributes: params.attributes || ['id', 'firstName', 'lastName', 'email']
                    }]
                }
            }, {});

            Genre.addScope('offsetLimit', function(params) {
                return {
                    offset: params.offset ? parseInt(params.offset) : null,
                    limit: params.limit ? parseInt(params.limit) : null,
                }
            }, {});

            Genre.addScope('orderBy', function(orderBy) {
                return {
                    order: [orderBy.split(' ')]
                }
            }, {});
        },
        tableName: 'genre'
    });

    return Genre;
};
