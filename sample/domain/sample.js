const {v4: uuidv4} = require('uuid')

module.exports = (sequelize, DataTypes) => {
  const points = sequelize.define(
    'sample',
    {
      sampleId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      placeId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      reviewId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      hasBonus: {
        type: DataTypes.TINYINT,
        allowNull: false,
      },
      point: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        onUpdate: DataTypes.NOW,
      },
    },
    {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      freezeTableName: true,
    },
  )

  return points
}
