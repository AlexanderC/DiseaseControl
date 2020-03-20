const BaseController = require('./lib/base-ctrl');

class Upsert extends BaseController {
  method = () => 'POST';

  path = () => '/admin/tag';

  features = () => ({ auth: true, ws: false, docs: true });

  config = ({ Joi }) => {
    return {
      description: 'Update or insert a bunch of tags.',
      validate: this._validationSchema(Joi, /* multiple = */ true),
    };
  };

  /**
   * @inheritdoc
   */
  async handler(kernel, request, _h) {
    const tags = request.payload;
    const { transaction: txInit, Sequelize } = kernel.plugins.db;

    if (!request.user.isAdmin()) {
      throw kernel.Boom.unauthorized('You must be an admin');
    }

    const Tag = this._tagModel(request);

    const tagsNames = tags.map(tag => tag.name);
    const tagDescription = name =>
      tags.filter(tag => tag.name === name)[0].description;

    // Upsert tags...
    await txInit.call(kernel.plugins.db, kernel, async transaction => {
      const foundTags = await Tag.findAll({
        where: { name: tagsNames },
        transaction,
      });
      const isNewTag = name =>
        foundTags.find(tag => tag.name === name) === undefined;

      await Promise.all([
        // remove missing tags
        Tag.destroy({
          where: { name: { [Sequelize.Op.notIn]: tagsNames } },
          transaction,
        }),
        // create new tags
        Tag.bulkCreate(
          tags.filter(tag => isNewTag(tag.name)),
          { transaction },
        ),
        // update existing tags
        ...foundTags.map(tag => {
          tag.description = tagDescription(tag.name);
          return tag.save({ transaction });
        }),
      ]);
    });

    return Tag.findAll();
  }
}

module.exports = Upsert;
