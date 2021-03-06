/**
 * Keg model.
 * Represents a physical keg.
 */

module.exports = (sequelize, DataTypes) => sequelize.define('Keg', {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },
  // beerName: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  //   defaultValue: 'beer name',
  // },
  // breweryName: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  //   defaultValue: 'brewery name',
  // },
  // abv: DataTypes.FLOAT,
  tapped: {
    type: DataTypes.DATE,
    allowNull: true,
    // return null if that's what's in the db.
    // otherwise sequelize coerces to an invalid date for some
    // dumb reason. possibly sqlite only, i don't know.
    get: function getTapped() {
      const dataValue = this.dataValues.tapped;
      if (dataValue && dataValue.getDate && !isNaN(dataValue.getDate())) {
        return dataValue;
      }
      return null;
    },
  },
  untapped: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notes: DataTypes.STRING,
  beerId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Kegs',
      key: 'id',
    },
    allowNull: false,
  },
});
