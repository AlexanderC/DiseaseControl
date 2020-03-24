const BaseController = require('./lib/base-ctrl');

class Patch extends BaseController {
  method = () => 'PATCH';

  path = () => '/admin/hospital/{id}';

  features = () => ({ auth: true, ws: false, docs: true });

  config = ({ Joi }) => {
    return {
      description: 'Patch a hospital.',
      validate: this._validationSchema(Joi, /* partial = */ true),
    };
  };

  /**
   * @inheritdoc
   */
  async handler(kernel, request, _h) {
    const { transaction: txInit } = kernel.plugins.db;
    const { id } = request.params;
    const hospitalData = request.payload;
    const {
      tags: tagNames,
      description,
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
    const hospital = await Hospital.scope(
      'tags',
      'inventory',
      'supervisors',
    ).findByPk(id);

    if (!hospital) {
      throw kernel.Boom.notFound('Hospital Does Not Exist');
    }

    let saved = false;

    if (supervisor && !hospital.isSupervisor(supervisor)) {
      const supervisorUser = await User.findByPk(supervisor);

      if (!supervisorUser) {
        throw kernel.Boom.failedDependency('Unable to find supervisor User');
      }

      if (!supervisorUser.isAtLeastSupervisor()) {
        supervisorUser.type = User.TYPE.SUPERVISOR;
        await supervisorUser.save();
      }

      hospital.removeSupervisor(hospital.supervisor);
      hospital.addSupervisor(supervisor);
    }

    if (description) {
      hospital.description = description;
    }

    if (inventoryNames && inventoryNames.length > 0) {
      await txInit.call(kernel.plugins.db, kernel, async transaction => {
        const inventory = await Inventory.findAll({
          where: { name: inventoryNames },
          transaction,
        });

        if (inventory.length !== inventoryNames.length) {
          const fn = inventory.map(inv => inv.name);
          const mi = inventoryNames.filter(x => !fn.includes(x));
          throw kernel.Boom.failedDependency(
            `Missing one or more inventory items: ${mi.join(', ')}`,
          );
        }

        const existingInventoryId = x =>
          hospital.inventory.filter(iv => iv.name === x)[0].id;
        const newInventoryId = x => inventory.filter(iv => iv.name === x)[0].id;
        const existingNames = hospital.inventory.map(iv => iv.name);
        const missingInventory = inventoryNames.filter(
          x => !existingNames.includes(x),
        );
        const inventoryToRemove = existingNames.filter(
          x => !inventoryNames.includes(x),
        );

        for (const removeName of inventoryToRemove) {
          hospital.removeInventory(existingInventoryId(removeName));
        }

        for (const removeName of missingInventory) {
          hospital.addInventory(newInventoryId(removeName));
        }

        await hospital.save({ transaction });
        saved = true;
      });
    }

    if (tagNames && tagNames.length > 0) {
      await txInit.call(kernel.plugins.db, kernel, async transaction => {
        const tags = await Tag.findAll({
          where: { name: tagNames },
          transaction,
        });

        if (tags.length !== tagNames.length) {
          const fn = tags.map(tag => tag.name);
          const mt = tagNames.filter(x => !fn.includes(x));
          throw kernel.Boom.failedDependency(
            `Missing one or more tags: ${mt.join(', ')}`,
          );
        }

        const existingTagId = x =>
          hospital.tags.filter(tag => tag.name === x)[0].id;
        const newTagId = x => tags.filter(tag => tag.name === x)[0].id;
        const existingNames = hospital.tags.map(tag => tag.name);
        const missingTags = tagNames.filter(x => !existingNames.includes(x));
        const tagsToRemove = existingNames.filter(x => !tagNames.includes(x));

        for (const removeName of tagsToRemove) {
          hospital.removeTag(existingTagId(removeName));
        }

        for (const removeName of missingTags) {
          hospital.addTag(newTagId(removeName));
        }

        await hospital.save({ transaction });
        saved = true;
      });
    }

    if (!saved) {
      await hospital.save();
    }

    return hospital.reload();
  }
}

module.exports = Patch;
