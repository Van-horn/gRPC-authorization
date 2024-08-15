const sequelize = require('../');
const { DataTypes } = require('sequelize');

const UsersSchema = sequelize.define('Users', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  login: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING,  unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: true },
},{  freezeTableName: true,updatedAt:false,
});
const TokensSchema = sequelize.define('Tokens', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  refreshToken: { type: DataTypes.STRING, unique: true },
},{  freezeTableName: true,timestamps: false,
});
const BasketSchema = sequelize.define('Basket', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  basketId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
},{  freezeTableName: true,
});
const ProductsSchema = sequelize.define('Products', {
  productId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  seller: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
},{  freezeTableName: true,
});
const FavoritesSchema = sequelize.define('Favorites', {
  favoriteId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
},{  freezeTableName: true,timestamps: false,
});
const RatingsSchema = sequelize.define('Ratings', {
  ratingId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating: { type: DataTypes.DOUBLE, allowNull: false },
},{  freezeTableName: true,timestamps: false,
});
const ProductCommentsSchema = sequelize.define('ProductComments', {
  commentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: { type: DataTypes.STRING, allowNull: false },
},{  freezeTableName: true,
});
const ProductImagesSchema = sequelize.define('ProductImages', {
  itemImagetId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  image: { type: DataTypes.STRING, allowNull: false },
},{  freezeTableName: true,timestamps: false,
});
const ProductPreviewImageSchema = sequelize.define('ProductPreviewImage', {
  productId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  previewImage: { type: DataTypes.STRING, allowNull: false },
},{  freezeTableName: true,timestamps: false,
});
const ProductDescriptionsSchema = sequelize.define('ProductDescriptions', {
  ItemDescriptionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
},{  freezeTableName: true,
});

UsersSchema.hasOne(TokensSchema, { foreignKey: 'userId' });
TokensSchema.belongsTo(UsersSchema, { foreignKey: 'userId' });

UsersSchema.hasMany(BasketSchema, { foreignKey: 'userId', as: 'basket' });
BasketSchema.belongsTo(UsersSchema, { foreignKey: 'userId' });

ProductsSchema.hasMany(BasketSchema, { foreignKey: 'productId' });
BasketSchema.belongsTo(ProductsSchema, { foreignKey: 'productId' });

UsersSchema.hasMany(FavoritesSchema, { foreignKey: 'userId' });
FavoritesSchema.belongsTo(UsersSchema, { foreignKey: 'userId' });

ProductsSchema.hasMany(FavoritesSchema, {
  foreignKey: 'productId',
  as: 'allFavorite',
});
FavoritesSchema.belongsTo(ProductsSchema, { foreignKey: 'productId' });

UsersSchema.hasMany(RatingsSchema, { foreignKey: 'userId' });
RatingsSchema.belongsTo(UsersSchema, { foreignKey: 'userId' });

ProductsSchema.hasMany(RatingsSchema, {
  foreignKey: 'productId',
  as: 'averageRating',
});
RatingsSchema.belongsTo(ProductsSchema, { foreignKey: 'productId' });

UsersSchema.hasMany(ProductCommentsSchema, { foreignKey: 'userId' });
ProductCommentsSchema.belongsTo(UsersSchema, { foreignKey: 'userId' });

ProductsSchema.hasMany(ProductCommentsSchema, {
  foreignKey: 'productId',
  as: 'allComments',
});
ProductCommentsSchema.belongsTo(ProductsSchema, { foreignKey: 'productId' });

ProductsSchema.hasMany(ProductImagesSchema, {
  foreignKey: 'productId',
  as: 'images',
});
ProductImagesSchema.belongsTo(ProductsSchema, { foreignKey: 'productId' });

ProductsSchema.hasMany(ProductDescriptionsSchema, {
  foreignKey: 'productId',
  as: 'descriptions',
});
ProductDescriptionsSchema.belongsTo(ProductsSchema, {
  foreignKey: 'productId',
});

ProductsSchema.hasMany(ProductPreviewImageSchema, {
  foreignKey: 'productId',
  as: 'previewImg',
});
ProductPreviewImageSchema.belongsTo(ProductsSchema, {
  foreignKey: 'productId',
});

module.exports = {
  UsersSchema,
  TokensSchema,
  BasketSchema,
  ProductsSchema,
  RatingsSchema,
  ProductCommentsSchema,
  ProductDescriptionsSchema,
  ProductImagesSchema,
  FavoritesSchema,
  ProductPreviewImageSchema,
};
