const Sequelize = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');

class Hospital extends Sequelize.Model {
  /**
   * Check if an user is hospital supervisor
   * @param {string|User} user
   */
  isSupervisor(user) {
    const id = typeof user === 'string' ? user : user.id;

    return (this.supervisors || []).filter(supervisor => supervisor.id === id);
  }
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
    const { Tag, Inventory, HospitalInventory, User } = models;

    Hospital.belongsToMany(Tag, { through: 'HospitalTag', as: 'tags' });
    Hospital.belongsToMany(Inventory, {
      through: HospitalInventory,
      as: 'inventory',
    });
    Hospital.hasMany(HospitalInventory, { as: 'assignedInventory' });
    Hospital.belongsToMany(User, {
      through: 'HospitalSupervisor',
      as: 'supervisors',
    });
    Hospital.addScope('supervisors', {
      include: [
        {
          model: User,
          as: 'supervisors',
          attributes: ['id'],
        },
      ],
    });
    Hospital.addScope('tags', {
      include: [
        {
          model: Tag,
          as: 'tags',
        },
      ],
    });
    Hospital.addScope('inventory', {
      include: [
        {
          model: Inventory,
          as: 'inventory',
        },
      ],
    });
  };

  sequelizePaginate.paginate(Hospital);

  return Hospital;
};
