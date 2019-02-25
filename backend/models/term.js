/* jshint indent: 2 */
const db = require('../database.js')
const sequelize = require('sequelize')
const DataTypes = sequelize.DataTypes;

module.exports =  db.sequelize.define('terms', {
    termID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
      
    },
    StartDate: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    EndDate: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    }
    ,{ timestamps: false
    })