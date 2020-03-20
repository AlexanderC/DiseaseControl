const BaseController = require('./lib/base-ctrl');

class Upsert extends BaseController {
  method = () => 'POST';

  path = () => '/admin/inventory';

  features = () => ({ auth: true, ws: false, docs: true });

  config = ({ Joi }) => {
    return {
      description: 'Update or insert a bunch of inventory items.',
      validate: this._validationSchema(Joi, /* multiple = */ true),
    };
  };

  /**
   * @inheritdoc
   */
  async handler(kernel, request, _h) {
    const inventory = request.payload;
    const { transaction: txInit, Sequelize } = kernel.plugins.db;

    if (!request.user.isAdmin()) {
      throw kernel.Boom.unauthorized('You must be an admin');
    }

    const Inventory = this._inventoryModel(request);

    const inventoryNames = inventory.map(iv => iv.name);
    const inventoryDescription = name =>
      inventory.filter(iv => iv.name === name)[0].description;

    // Upsert inventory items...
    await txInit.call(kernel.plugins.db, kernel, async transaction => {
      const foundInventory = await Inventory.findAll({
        where: { name: inventoryNames },
        transaction,
      });
      const isNewInventory = name =>
        foundInventory.find(iv => iv.name === name) === undefined;

      await Promise.all([
        // remove missing inventory items
        Inventory.destroy({
          where: { name: { [Sequelize.Op.notIn]: inventoryNames } },
          transaction,
        }),
        // create new inventory items
        Inventory.bulkCreate(
          inventory.filter(iv => isNewInventory(iv.name)),
          { transaction },
        ),
        // update existing inventory items
        ...foundInventory.map(iv => {
          iv.description = inventoryDescription(iv.name);
          return iv.save({ transaction });
        }),
      ]);
    });

    return Inventory.findAll();
  }
}

module.exports = Upsert;
