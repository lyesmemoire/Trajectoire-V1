/**
 * @WithLineage Decorator
 * Automatically tracks data lineage for method calls
 * Ensures complete traceability for all data transformations
 */

import {
  DataSource,
  SourceType,
  Transformation,
  TransformationType,
  DataRelation,
  RelationType,
  DataStorage,
  StorageType,
  RetentionPolicy,
} from './lineage.types';

export interface WithLineageOptions {
  sourceType: SourceType;
  sourceOrigin: string;
  sourceProvenance: string;
  sourcePipeline: string;
  sourceStage: string;
  transformationType: TransformationType;
  transformationOperation: string;
  transformationDescription: string;
  storageType: StorageType;
  storageLocation: string;
  storageFormat: string;
  storageRetention?: RetentionPolicy;
  graphNodeId?: string;
  relationType?: RelationType;
  relationName?: string;
}

export function WithLineage(options: WithLineageOptions) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Access lineageService from the instance (this)
      const lineageService = (this as any).lineageService;
      if (!lineageService) {
        console.warn(
          `@WithLineage: lineageService not found on ${target.constructor.name}`,
        );
        return originalMethod.apply(this, args);
      }

      // Create source
      const source: DataSource = {
        type: options.sourceType,
        origin: options.sourceOrigin,
        provenance: options.sourceProvenance,
        pipeline: options.sourcePipeline,
        stage: options.sourceStage,
      };

      // Extract parent UUID from context if available
      const parentUuid = args.find((arg) => arg?.lineageUuid)?.lineageUuid;

      // Create transformation
      const transformation: Transformation = {
        type: options.transformationType,
        operation: options.transformationOperation,
        inputUuids: parentUuid ? [parentUuid] : [],
        outputUuids: [],
        description: options.transformationDescription,
      };

      // Create storage
      const storage: DataStorage = {
        type: options.storageType,
        location: options.storageLocation,
        format: options.storageFormat,
        compressed: false,
        encrypted: false,
        retention: options.storageRetention || RetentionPolicy.PERMANENT,
      };

      // Create relation if specified
      let relation: DataRelation | undefined;
      if (options.relationType && options.relationName) {
        relation = {
          type: options.relationType,
          targetUuid: '', // Will be set after execution
          relationName: options.relationName,
        };
      }

      // Create lineage record
      const lineage = lineageService.createLineage({
        source,
        parentUuid,
        transformation,
        graphNodeId: options.graphNodeId,
        relation,
        storage,
        metadata: {
          className: target.constructor.name,
          methodName: propertyKey,
          args: JSON.stringify(
            args.map((arg) => (typeof arg === 'object' ? '[Object]' : arg)),
          ),
        },
      });

      // Execute original method
      const startTime = Date.now();
      try {
        const result = await originalMethod.apply(this, args);

        // Update transformation with output UUID
        transformation.outputUuids = [lineage.uuid];

        // If result has a UUID, create a relation
        if (result?.uuid && relation) {
          relation.targetUuid = result.uuid;
        }

        // Update lineage with execution metadata
        lineage.metadata = {
          ...lineage.metadata,
          executionTimeMs: Date.now() - startTime,
          success: true,
          resultType: typeof result,
        };

        return result;
      } catch (error) {
        // Update lineage with error metadata
        lineage.metadata = {
          ...lineage.metadata,
          executionTimeMs: Date.now() - startTime,
          success: false,
          error: (error as Error).message,
        };

        throw error;
      }
    };

    return descriptor;
  };
}
