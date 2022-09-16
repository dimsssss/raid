module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface
      .createTable(
        'sample',
        {
          sampleId: {
            type: Sequelize.DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            allowNull: false,
          },
          placeId: {
            type: Sequelize.DataTypes.UUID,
            allowNull: false,
          },
          reviewId: {
            type: Sequelize.DataTypes.UUID,
            allowNull: false,
          },
          userId: {
            type: Sequelize.DataTypes.UUID,
            allowNull: false,
          },
          hasBonus: {
            type: Sequelize.DataTypes.TINYINT,
            allowNull: false,
          },
          point: {
            type: Sequelize.DataTypes.INTEGER,
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
        },
        {
          charset: 'utf8mb4',
          collate: 'utf8mb4_general_ci',
        },
      )
      .then(() => {
        queryInterface.addIndex('points', ['placeId', 'hasBonus'])
        queryInterface.addIndex('points', ['userId'])
        queryInterface.addIndex('points', ['reviewId'])
      })
  },
  down: queryInterface => {
    return queryInterface.dropTable('points')
  },
}
