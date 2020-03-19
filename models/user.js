const Sequelize = require('sequelize');
const EncryptedField = require('sequelize-encrypted');
const sequelizePaginate = require('sequelize-paginate');

class User extends Sequelize.Model {
  /**
   * User types vector
   * @returns {Array<string>}
   */
  static get TYPES() {
    return Object.values(this.TYPE);
  }

  /**
   * Get user types mapping
   * @returns {object}
   */
  static get TYPE() {
    return {
      USER: 'user',
      SUPERVISOR: 'supervisor',
      ADMIN: 'admin',
    };
  }

  /**
   * Check if this is a default user
   * @returns {boolean}
   */
  isUser() {
    return this.type === User.TYPE.USER;
  }

  /**
   * Check if this is an supervisor user
   * @returns {boolean}
   */
  isSupervisor() {
    return this.type === User.TYPE.SUPERVISOR;
  }

  /**
   * Check if this is an admin user
   * @returns {boolean}
   */
  isAdmin() {
    return this.type === User.TYPE.ADMIN;
  }

  /**
   * Get object to serialize
   * @returns {object}
   */
  toJSON() {
    const data = this.get({ plain: true });

    delete data.vault;
    delete data.password;

    return data;
  }
}

module.exports = sequelize => {
  const encFields = EncryptedField(Sequelize, process.env.SEC_SEED);

  User.init(
    {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      username: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      type: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: User.TYPES,
        defaultValue: User.TYPE.USER,
      },
      vault: encFields.vault('vault'),
      data: encFields.field('data', {
        type: Sequelize.JSON,
        allowNull: true,
      }),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    },
    {
      sequelize,
      timestamps: true,
    },
  );

  User.associate = models => {
    // TODO
  };

  sequelizePaginate.paginate(User);

  return User;
};
