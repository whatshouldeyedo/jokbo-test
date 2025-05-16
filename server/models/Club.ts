import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import type { User } from './User';

export interface ClubAttributes {
  id: number;
  name: string;
}

export interface ClubCreationAttributes extends Optional<ClubAttributes, 'id'> {}

export class Club extends Model<ClubAttributes, ClubCreationAttributes> implements ClubAttributes {
  public id!: number;
  public name!: string;
  public readonly Users?: User[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initClubModel(sequelize: Sequelize): typeof Club {
  Club.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'Club',
      tableName: 'Clubs',
      timestamps: true,
    }
  );

  return Club;
}
