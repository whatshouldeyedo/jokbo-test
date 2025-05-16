import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export interface PaperAttributes {
  id: number;
  filename: string;
  description?: string;
  userId: number;
  subjectId: number;
}

export interface PaperCreationAttributes extends Optional<PaperAttributes, 'id'> {}

export class Paper extends Model<PaperAttributes, PaperCreationAttributes> implements PaperAttributes {
  public id!: number;
  public filename!: string;
  public description?: string;
  public userId!: number;
  public subjectId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initPaperModel(sequelize: Sequelize): typeof Paper {
  Paper.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Paper',
      tableName: 'Papers',
      timestamps: true,
    }
  );

  return Paper;
}
