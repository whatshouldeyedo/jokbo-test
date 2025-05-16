import { Sequelize, DataTypes, Model } from 'sequelize';

export class UserClub extends Model {
  public userId!: number;
  public clubId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initUserClubModel(sequelize: Sequelize): typeof UserClub {
  UserClub.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      clubId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: 'UserClub',
      tableName: 'UserClubs',
      timestamps: true,
    }
  );

  return UserClub;
}
