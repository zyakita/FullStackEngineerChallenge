'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PerformanceFeedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PerformanceFeedback.belongsTo(models.PerformanceReview, {
        foreignKey: 'prId',
        onDelete: 'CASCADE',
      });
      PerformanceFeedback.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
    }
  }
  PerformanceFeedback.init(
    {
      prId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'PerformanceFeedback',
    }
  );
  return PerformanceFeedback;
};
