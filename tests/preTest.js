const db = require('../src/database/models');
async function resetData() {
  try {
    await db.sequelize.sync({ force: true }); // This drops all tables and re-creates them
    console.log('Database tables dropped and re-created successfully');
  } catch (error) {
    console.error('Error dropping database tables:', error);
  }
}

resetData();