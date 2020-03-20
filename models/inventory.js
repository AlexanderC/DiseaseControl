const Sequelize = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

class Inventory extends Sequelize.Model {
  // TODO
}

module.exports = sequelize => {
  Inventory.init(
    {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.TEXT, allowNull: true },
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

  Inventory.associate = models => {
    const { Tag, Hospital } = models;

    Inventory.belongsToMany(Tag, { through: 'InventoryTags', as: 'tags' });
    Inventory.belongsToMany(Hospital, {
      through: 'HospitalInventory',
      as: 'hospitals',
    });
    Inventory.addScope('tags', {
      include: [
        {
          model: Tag,
          as: 'tags',
          attributes: ['id', 'name', 'description'],
          through: { attributes: [] },
        },
      ],
    });
    Inventory.addScope('hospitals', {
      include: [
        {
          model: Hospital,
          as: 'hospitals',
          attributes: ['id', 'name', 'description'],
          through: { attributes: [] },
        },
      ],
    });
  };

  sequelizePaginate.paginate(Inventory);

  return Inventory;
};
