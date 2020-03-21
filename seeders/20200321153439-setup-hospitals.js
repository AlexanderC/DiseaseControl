'use strict';

const { MYSQL_NOW } = process.env;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hospitals = await queryInterface.sequelize.query(
      'SELECT * FROM Hospitals WHERE name IN(?) ',
      {
        replacements: [['scmbcc', 'tomaciorba', 'mama-copilul', 'scr']],
        type: Sequelize.QueryTypes.SELECT,
      },
    );
    const tags = await queryInterface.sequelize.query(
      'SELECT * FROM Tags WHERE name IN(?) ',
      {
        replacements: [
          [
            'copii',
            'adulti',
            'gravide',
            'forma-usoara',
            'forma-medie',
            'forma-severa',
          ],
        ],
        type: Sequelize.QueryTypes.SELECT,
      },
    );
    const inventory = await queryInterface.sequelize.query(
      'SELECT * FROM Inventories WHERE name IN(?) ',
      {
        replacements: [['pat']],
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    const hospitalTagsInserts = [];
    const hospitalIntentoriesInserts = [];

    // eslint-disable-next-line guard-for-in
    for (const hospital of hospitals) {
      for (const inventoryItem of inventory) {
        hospitalIntentoriesInserts.push({
          HospitalId: hospital.id,
          InventoryId: inventoryItem.id,
          createdAt: MYSQL_NOW,
          updatedAt: MYSQL_NOW,
        });
      }

      switch (hospital.name) {
        case 'scmbcc':
          for (const tag of tags.filter(t =>
            ['copii', 'forma-usoara', 'forma-medie'].includes(t.name),
          )) {
            hospitalTagsInserts.push({
              HospitalId: hospital.id,
              TagId: tag.id,
              createdAt: MYSQL_NOW,
              updatedAt: MYSQL_NOW,
            });
          }
          break;
        case 'tomaciorba':
          for (const tag of tags.filter(t =>
            ['adulti', 'gravide', 'forma-usoara', 'forma-medie'].includes(
              t.name,
            ),
          )) {
            hospitalTagsInserts.push({
              HospitalId: hospital.id,
              TagId: tag.id,
              createdAt: MYSQL_NOW,
              updatedAt: MYSQL_NOW,
            });
          }
          break;
        case 'mama-copilul':
          for (const tag of tags.filter(t =>
            ['copii', 'forma-severa'].includes(t.name),
          )) {
            hospitalTagsInserts.push({
              HospitalId: hospital.id,
              TagId: tag.id,
              createdAt: MYSQL_NOW,
              updatedAt: MYSQL_NOW,
            });
          }
          break;
        case 'scr':
          for (const tag of tags.filter(t =>
            ['adulti', 'gravide', 'forma-severa'].includes(t.name),
          )) {
            hospitalTagsInserts.push({
              HospitalId: hospital.id,
              TagId: tag.id,
              createdAt: MYSQL_NOW,
              updatedAt: MYSQL_NOW,
            });
          }
          break;
        default:
          throw new Error('Unhandleable hospital');
      }
    }

    return Promise.all([
      queryInterface.bulkInsert(
        'HospitalInventories',
        hospitalIntentoriesInserts,
        {},
      ),
      queryInterface.bulkInsert('HospitalTag', hospitalTagsInserts, {}),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    const hospitals = await queryInterface.sequelize.query(
      'SELECT * FROM Hospitals WHERE name IN(?) ',
      {
        replacements: [['scmbcc', 'tomaciorba', 'mama-copilul', 'scr']],
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    return Promise.all([
      queryInterface.bulkDelete(
        'HospitalInventories',
        {
          HospitalId: {
            [Sequelize.Op.in]: hospitals.map(hospital => hospital.id),
          },
        },
        {},
      ),
      queryInterface.bulkDelete(
        'HospitalTag',
        {
          HospitalId: {
            [Sequelize.Op.in]: hospitals.map(hospital => hospital.id),
          },
        },
        {},
      ),
    ]);
  },
};
