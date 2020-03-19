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
    const { Tag } = models;

    Hospital.belongsToMany(Tag, { through: 'HospitalTags' });
    Hospital.addScope('tags', {
      include: [
        {
          model: Tag,
          attributes: ['name', 'description'],
        },
      ],
    });
  };

  sequelizePaginate.paginate(Hospital);

  return Hospital;
};
