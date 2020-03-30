const BaseController = require('./lib/base-ctrl');

class UpdateInventory extends BaseController {
  method = () => 'POST';

  path = () => '/hospital/{id}/inventory/{hospitalInventoryId}';

  features = () => ({ auth: true, ws: false, docs: true });

  config = ({ Joi }) => {
    return {
      description: 'Update hospital inventory',
      validate: {
        params: Joi.object({
          id: Joi.number()
            .integer()
            .required()
            .min(1)
            .description('Hospital ID')
            .example(1),
          hospitalInventoryId: Joi.number()
            .integer()
            .required()
            .min(1)
            .description('Hospital Inventory ID')
            .example(1),
        }).label('HospitalID'),
        payload: Joi.object({
          quantity: Joi.number()
            .integer()
            .optional()
            .min(0)
            .description('Hospital Inventory Quantity')
            .example(100),
          total: Joi.number()
            .integer()
            .optional()
            .min(0)
            .description('Hospital Inventory Total Quantity (admin only)')
            .example(500),
        }).label('Inventory'),
      },
    };
  };

  /**
   * @inheritdoc
   */
  async handler(kernel, request, _h) {
    const { id, hospitalInventoryId } = request.params;
    const { quantity, total } = request.payload;

    if (!request.user.isAtLeastSupervisor()) {
      throw kernel.Boom.unauthorized('You must be a supervisor or an admin');
    }

    const User = this._userModel(request);
    const Hospital = this._hospitalModel(request);
    const HospitalInventory = this._hospitaliInventoryModel(request);
    const hospital = await Hospital.findOne({
      where: { id },
      include: [
        {
          model: HospitalInventory,
          where: { id: hospitalInventoryId },
          as: 'assignedInventory',
        },
        {
          model: User,
          as: 'supervisors',
          attributes: ['id'],
          through: { attributes: [] },
        },
      ],
    });

    if (
      !hospital ||
      !hospital.assignedInventory ||
      hospital.assignedInventory.length <= 0
    ) {
      throw kernel.Boom.notFound('Hospital or Inventory Item does not exist');
    } else if (
      !request.user.isAdmin() &&
      !hospital.isSupervisor(request.user)
    ) {
      throw kernel.Boom.unauthorized('You can update only assigned hospitals');
    } else if (!quantity && !total) {
      throw kernel.Boom.badRequest(
        'Missing both quantity and total parameters',
      );
    }

    if (quantity) {
      hospital.assignedInventory[0].quantity = quantity;
    }

    if (total && request.user.isAdmin()) {
      hospital.assignedInventory[0].total = total;
    }

    if (
      hospital.assignedInventory[0].quantity >
      hospital.assignedInventory[0].total
    ) {
      throw kernel.Boom.badRequest(
        'Quantity cannot be more than the total amount',
      );
    }

    await hospital.assignedInventory[0].save();

    return Hospital.scope('tags', 'inventory', 'supervisors').findByPk(
      hospital.id,
    );
  }
}

module.exports = UpdateInventory;
