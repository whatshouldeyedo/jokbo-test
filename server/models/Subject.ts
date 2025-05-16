import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export interface SubjectAttributes {
  id: number;
  name: string;
}

export interface SubjectCreationAttributes extends Optional<SubjectAttributes, 'id'> {}

export class Subject extends Model<SubjectAttributes, SubjectCreationAttributes> implements SubjectAttributes {
  public id!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initSubjectModel(sequelize: Sequelize): typeof Subject {
  Subject.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Subject',
      tableName: 'Subjects',
      timestamps: true,
    }
  );

  return Subject;
}
