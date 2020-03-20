const Sequelize = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

class HospitalInventory extends Sequelize.Model {
  // TODO
}

module.exports = sequelize => {
  HospitalInventory.init(
    {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      quantity: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    },
    {
      sequelize,
      timestamps: true,
    },
  );

  sequelizePaginate.paginate(HospitalInventory);

  return HospitalInventory;
};
