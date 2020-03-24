const BaseController = require('./lib/base-ctrl');

class Create extends BaseController {
  method = () => 'POST';

  path = () => '/admin/hospital';

  features = () => ({ auth: true, ws: false, docs: true });

  config = ({ Joi }) => {
    return {
      description: 'Add a new hospital.',
      validate: this._validationSchema(Joi),
    };
  };

  /**
   * @inheritdoc
   */
  async handler(kernel, request, _h) {
    const { transaction: txInit } = kernel.plugins.db;
    const hospitalData = request.payload;
    const {
      tags: tagNames,
      name,
      inventory: inventoryNames,
      supervisor,
    } = hospitalData;
    delete hospitalData.tags;

    if (!request.user.isAdmin()) {
      throw kernel.Boom.unauthorized('You must be an admin');
    }

    const Tag = this._tagModel(request);
    const User = this._userModel(request);
    const Inventory = this._inventoryModel(request);
    const Hospital = this._hospitalModel(request);

    const hospitalExists = await Hospital.count({ where: { name } });

    if (hospitalExists) {
      throw kernel.Boom.conflict('Hospital Already Exists');
    }

    await txInit.call(kernel.plugins.db, kernel, async transaction => {
      let tags = null;
      let inventory = null;

      if (tagNames && tagNames.length > 0) {
        tags = await Tag.findAll({
          where: { name: tagNames },
          transaction,
        });

        if (tags.length !== tagNames.length) {
          const foundNames = tags.map(tag => tag.name);
          const missingTags = tagNames.filter(x => !foundNames.includes(x));
          throw kernel.Boom.failedDependency(
            `Missing one or more tags: ${missingTags.join(', ')}`,
          );
        }
      }

      if (inventoryNames && inventoryNames.length > 0) {
        inventory = await Inventory.findAll({
          where: { name: inventoryNames },
          transaction,
        });

        if (inventory.length !== inventoryNames.length) {
          const foundNames = inventory.map(inv => inv.name);
          const missingInventory = inventoryNames.filter(
            x => !foundNames.includes(x),
          );
          throw kernel.Boom.failedDependency(
            `Missing one or more inventory items: ${missingInventory.join(
              ', ',
            )}`,
          );
        }
      }

      const entry = await Hospital.create(hospitalData, { transaction });

      if (tags) {
        entry.addTags(tags);
      }

      if (inventory) {
        entry.addInventory(inventory);
      }

      if (supervisor) {
        const supervisorUser = await User.findByPk(supervisor, { transaction });

        if (!supervisorUser) {
          throw kernel.Boom.failedDependency('Unable to find supervisor User');
        }

        if (!supervisorUser.isAtLeastSupervisor()) {
          supervisorUser.type = User.TYPE.SUPERVISOR;
          await supervisorUser.save({ transaction });
        }

        entry.addSupervisor(supervisor);
      }

      if (tags || inventory || supervisor) {
        await entry.save({ transaction });
      }
    });

    return Hospital.scope('tags', 'inventory', 'supervisors').findOne({
      where: { name },
    });
  }
}

module.exports = Create;
