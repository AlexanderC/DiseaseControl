const Sequelize = require('sequelize');

class Tag extends Sequelize.Model {
  // TODO
}

module.exports = sequelize => {
  Tag.init(
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

  Tag.associate = models => {
    const { Hospital, Inventory } = models;

    Tag.belongsToMany(Hospital, { through: 'HospitalTag', as: 'hospitals' });
    Tag.belongsToMany(Inventory, { through: 'InventoryTag', as: 'inventory' });
  };

  return Tag;
};
