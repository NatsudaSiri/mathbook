const Sequelize = require('sequelize')
const UserModel = require('./models/user')
const Timetable = require('./models/timetable')
const Subject = require('./models/subject')
const Term = require('./models/term')

//const BlogModel = require('./models/blog')
//const TagModel = require('./models/tag')

const sequelize = new Sequelize('mydb', 'gaam', 'gaam@1234', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: false
}
});
//Subject.hasMany(Timetable);
//Timetable.belongsTo(Subject);


Subject.hasMany(Timetable,{foreignKey: 'Subject_id', sourceKey: 'SubjectID'})
Timetable.belongsTo(Subject, {foreignKey: 'Subject_id', targetKey: 'SubjectID'});
const user = new UserModel(sequelize, Sequelize)
const time = new Timetable(sequelize, Sequelize)
const subject = new Subject(sequelize, Sequelize)
const term = new Term(sequelize, Sequelize)


sequelize.sync({ force: true })
  .then(() => {
    console.log(`Database & tables created!`)
  })

module.exports = {
  user,time,subject,term
}