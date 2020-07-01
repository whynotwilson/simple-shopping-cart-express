'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Carts', 'quantity');
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Carts', 'quantity', {
      type: Sequelize.INTEGER
    });
  }
};
