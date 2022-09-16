module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'raidRecord',
      {
        raidRecordId: {
          type: Sequelize.DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        userId: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
        },
        state: {
          type: Sequelize.DataTypes.ENUM,
          values: ['enter', 'exit'],
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DataTypes.DATE,
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DataTypes.DATE,
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        deletedAt: {
          type: Sequelize.DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      },
    )
  },
  down: queryInterface => {
    return queryInterface.dropTable('bossRadeHistory')
  },
}
