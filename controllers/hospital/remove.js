const BaseController = require('./lib/base-ctrl');

class Remove extends BaseController {
  method = () => 'DELETE';

  path = () => '/admin/hospital/{id}';

  features = () => ({ auth: true, ws: false, docs: true });

  config = ({ Joi }) => {
    return {
      description: 'Delete a hospital',
      validate: this._validationSchema(Joi, /* partial = */ true),
    };
  };

  /**
   * @inheritdoc
   */
  async handler(kernel, request, _h) {
    const { id } = request.params;

    if (!request.user.isAdmin()) {
      throw kernel.Boom.unauthorized('You must be an admin');
    }

    const Hospital = this._hospitalModel(request);
    const hospital = await Hospital.findByPk(id);

    if (!hospital) {
      throw kernel.Boom.notFound('Hospital Does Not Exist');
    }

    return hospital.destroy();
  }
}

module.exports = Remove;
