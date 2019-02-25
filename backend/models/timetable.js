/* jshint indent: 2 */
const db = require('../database.js')
const sequelize = require('sequelize')
const DataTypes = sequelize.DataTypes;

module.exports =  db.sequelize.define('timetable', {
    SubjectID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
      
    },
    MeetingDay: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    StartTime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    EndTime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    Capacity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Room: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Subject_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },}
    ,{ timestamps: false
    })