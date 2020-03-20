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
    const { tags: tagNames, name } = hospitalData;
    delete hospitalData.tags;

    if (!request.user.isAdmin()) {
      throw kernel.Boom.unauthorized('You must be an admin');
    }

    const Tag = this._tagModel(request);
    const Hospital = this._hospitalModel(request);

    const hospitalExists = await Hospital.count({ where: { name } });

    if (hospitalExists) {
      throw kernel.Boom.conflict('Hospital Already Exists');
    }

    await txInit.call(kernel.plugins.db, kernel, async transaction => {
      const tags = await Tag.findAll({
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

      const entry = await Hospital.create(hospitalData, { transaction });
      entry.addTags(tags);

      await entry.save({ transaction });
    });

    return Hospital.scope('tags', 'inventory').findOne({ where: { name } });
  }
}

module.exports = Create;
