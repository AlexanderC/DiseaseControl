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
        set(value) {
          value = parseInt(value, 10);

          if (value > this.getDataValue('total')) {
            throw new Error('Quantity cannot be more than the total amount');
          }

          const detailed = this.getDataValue('detailed') || {};
          let count = 0;

          for (const key of Object.keys(detailed)) {
            count += Math.abs(parseInt(detailed[key], 10));
          }

          if (value !== count) {
            throw new Error(
              'Detailed amount is different from detailed amount',
            );
          }

          this.setDataValue('quantity', value);
        },
      },
      total: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        set(value) {
          value = parseInt(value, 10);

          if (value < this.getDataValue('quantity')) {
            throw new Error('Total amount cannot be less than the quantity');
          }

          this.setDataValue('total', value);
        },
      },
      detailed: {
        type: Sequelize.JSON,
        allowNull: true,
        set(value) {
          if (!value || typeof value !== 'object') {
            throw new Error('Inventory details not an object');
          }

          let total = 0;
          const details = { ...value };

          for (const key of Object.keys(details)) {
            details[key] = Math.abs(parseInt(details[key], 10));
            total += details[key];
          }

          this.setDataValue('detailed', details);
          this.setDataValue('quantity', total);
        },
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
