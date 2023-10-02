import { Model, ScopeOptions, WhereAttributeHash } from "@sequelize/core";
import { AllowReadonlyArray, Nullish } from "@sequelize/core/types/utils/types";

export type PK = number | string;
export type Scope<M> = Nullish<AllowReadonlyArray<string | ScopeOptions> | WhereAttributeHash<M>>;

export type GetterOptionsType<M> = {
  depth?: number;
  scope?: Scope<M>;
};

/**
 * Hierarchical Model extends the base Model(Sequelize Model) class to provide hierarchical functionalities.
 */
export class HierarchicalModel extends Model {
  /**
   * Flag indicating if the hierarchy is ready for use.
   */
  static hierarchReady: boolean = false;

  /**
   * Alias for children association.
   */
  static as: string;

  /**
   * Alias for parent association.
   */
  static inverseAs: string;

  /**
   * Foreign key for establishing parent-child relationship.
   */
  static foreignKey: string;

  /**
   * Primary key of the model.
   */
  static primaryKey: string;

  /**
   * Initializes the hierarchical model settings.
   * @param options - Options for initialization.
   * @param options.as - Alias for children association. Default is "children".
   * @param options.inverseAs - Alias for parent association. Default is "parent".
   * @param options.primaryKey - Primary key of the model. Default is "id".
   * @param options.foreignKey - Foreign key for establishing parent-child relationship. Default is "parentId".
   */
  public static initHierarchy(
    options: {
      as?: string;
      inverseAs?: string;
      primaryKey?: string;
      foreignKey?: string;
    } = {}
  ): void {
    this.hierarchReady = true;
    this.as = options.as || "children";
    this.inverseAs = options.inverseAs || "parent";
    this.foreignKey = options.foreignKey || "parentId";
    this.primaryKey = options.primaryKey || "id";

    // Define the association for children.
    this.hasMany(this, {
      as: this.as,
      inverse: {
        as: this.inverseAs,
      },
      foreignKey: this.foreignKey,
    });
  }

  /**
   * Retrieves children of a model by primary key.
   * @param pk - Primary key of the model.
   * @param options - Options for retrieving children.
   * @param options.depth - Maximum depth to retrieve children. Default is Number.MAX_SAFE_INTEGER.
   * @param options.scope - Optional scope for querying.
   * @returns A promise that resolves to the children data.
   */
  public static async getChildrenByPk<M extends HierarchicalModel>(
    pk: PK,
    options: GetterOptionsType<M>
  ): Promise<any> {
    const d = options.depth ?? Number.MAX_SAFE_INTEGER;
    const obj = options.scope ? this.withScope(options.scope) : this;

    // Find all children of the model with the given primary key.
    const result = await obj.findAll({
      where: { [this.foreignKey]: pk },
    });

    if (d) {
      // If depth is specified, recursively retrieve children of each child.
      const data = await Promise.all(
        result.map(async (item, index) => ({
          ...item.toJSON(),
          [this.as]: await this.getChildrenByPk(item[this.primaryKey], { depth: d - 1, scope: options.scope }),
        }))
      );
      return data;
    } else {
      return result;
    }
  }

  /**
   * Retrieves a tree structure of a model by primary key.
   * @param pk - Primary key of the model.
   * @param options - Options for retrieving the tree.
   * @param options.depth - Maximum depth to retrieve children. Default is Number.MAX_SAFE_INTEGER.
   * @param options.scope - Optional scope for querying.
   * @returns A promise that resolves to the tree data.
   */
  public static async getTreeByPk<M extends HierarchicalModel>(pk: PK, options: GetterOptionsType<M>): Promise<any> {
    const obj = options.scope ? this.withScope(options.scope) : this;

    // Find the model with the given primary key and its children.
    const [result, children] = await Promise.all([obj.findByPk(pk), this.getChildrenByPk(pk, options)]);
    return { ...result.toJSON(), [this.as]: children };
  }

  /**
   * Retrieves ancestors of a model by primary key.
   * @param pk - Primary key of the model.
   * @param options - Options for retrieving ancestors.
   * @param options.depth - Maximum depth to retrieve ancestors. Default is Number.MAX_SAFE_INTEGER.
   * @param options.scope - Optional scope for querying.
   * @returns A promise that resolves to the ancestors data.
   */
  public static async getAncestorsByPk<M extends HierarchicalModel>(
    pk: PK,
    options: GetterOptionsType<M>
  ): Promise<any> {
    const obj = options.scope ? this.withScope(options.scope) : this;

    // Find the model with the given primary key.
    const result = await obj.findByPk(pk);
    let parent = [];

    if (result[this.foreignKey] && options.depth) {
      // If there is a parent, recursively retrieve ancestors.
      parent = await this.getAncestorsByPk(result[this.foreignKey], { depth: options.depth - 1, scope: options.scope });
    }

    return [result.toJSON(), ...parent];
  }
}
