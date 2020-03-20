const Sequelize = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

class Hospital extends Sequelize.Model {
  // TODO
}

module.exports = sequelize => {
  Hospital.init(
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

  Hospital.associate = models => {
    const { Tag, Inventory } = models;

    Hospital.belongsToMany(Tag, { through: 'HospitalTags', as: 'tags' });
    Hospital.belongsToMany(Inventory, {
      through: 'HospitalInventory',
      as: 'inventory',
    });
    Hospital.addScope('tags', {
      include: [
        {
          model: Tag,
          as: 'tags',
          attributes: ['id', 'name', 'description'],
          through: { attributes: [] },
        },
      ],
    });
    Hospital.addScope('inventory', {
      include: [
        {
          model: Inventory,
          as: 'inventory',
          attributes: ['id', 'name', 'description', 'quantity'],
          through: { attributes: [] },
        },
      ],
    });
  };

  sequelizePaginate.paginate(Hospital);

  return Hospital;
};