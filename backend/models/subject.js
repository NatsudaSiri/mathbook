/* jshint indent: 2 */
const db = require('../database.js')
const sequelize = require('sequelize')
const DataTypes = sequelize.DataTypes;

module.exports = db.sequelize.define('subject', {
    SubjectID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    CatalogNumber: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Term: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    CourseTitle: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Section: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    TeachType: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Instructor: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  }, {
    tableName: 'subject',
    createdAt: false,
timestamps: false
  })
