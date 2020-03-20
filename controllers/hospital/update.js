const BaseController = require('./lib/base-ctrl');

class Create extends BaseController {
  method = () => 'PATCH';

  path = () => '/admin/hospital/{id}';

  features = () => ({ auth: true, ws: false, docs: true });

  config = ({ Joi }) => {
    return {
      description: 'Update a hospital.',
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
    const { tags: tagNames, description } = hospitalData;
    delete hospitalData.tags;

    if (!request.user.isAdmin()) {
      throw kernel.Boom.unauthorized('You must be an admin');
    }

    const Tag = this._tagModel(request);
    const Hospital = this._hospitalModel(request);
    const hospital = await Hospital.scope('tags', 'inventory').findByPk(id);

    if (!hospital) {
      throw kernel.Boom.notFound('Hospital Does Not Exist');
    }

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

      if (description) {
        hospital.description = description;
      }

      await hospital.save({ transaction });
    });

    return hospital.reload();
  }
}

module.exports = Create;
