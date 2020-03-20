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
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    },
    {
      sequelize,
      timestamps: true,
    },
  );

  Inventory.associate = models => {
    const { Tag, Hospital, HospitalInventory } = models;

    Inventory.belongsToMany(Tag, { through: 'InventoryTag', as: 'tags' });
    Inventory.belongsToMany(Hospital, {
      through: HospitalInventory,
      as: 'hospitals',
    });
    Inventory.addScope('tags', {
      include: [
        {
          model: Tag,
          as: 'tags',
        },
      ],
    });
    Inventory.addScope('hospitals', {
      include: [
        {
          model: Hospital,
          as: 'hospitals',
        },
      ],
    });
  };

  sequelizePaginate.paginate(Inventory);

  return Inventory;
};
