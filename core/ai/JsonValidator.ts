/**
 * JSON Validator
 *
 * Validates AI responses as JSON with schema validation.
 */

export interface ValidationResult {
  valid: boolean;
  data?: unknown;
  error?: string;
}

export interface JSONSchema {
  type: "object" | "array" | "string" | "number" | "boolean" | "null";
  properties?: Record<string, JSONSchema>;
  items?: JSONSchema;
  required?: string[];
  additionalProperties?: boolean;
}

/**
 * JSON Validator
 *
 * Validates JSON responses from AI providers.
 */
export class JsonValidator {
  /**
   * Validate JSON string and parse it
   */
  static validateAndParse(jsonString: string, schema?: JSONSchema): ValidationResult {
    try {
      // First, try to extract JSON from markdown code blocks
      const extracted = this.extractJSON(jsonString);
      const parsed = JSON.parse(extracted);

      if (schema) {
        const schemaValidation = this.validateSchema(parsed, schema);
        if (!schemaValidation.valid) {
          return schemaValidation;
        }
      }

      return {
        valid: true,
        data: parsed,
      };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : "Invalid JSON",
      };
    }
  }

  /**
   * Extract JSON from markdown code blocks or plain text
   */
  private static extractJSON(text: string): string {
    // Try to extract from ```json ... ```
    const jsonCodeBlockRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = text.match(jsonCodeBlockRegex);

    if (match && match[1]) {
      return match[1].trim();
    }

    // Try to extract from ``` ... ```
    const codeBlockRegex = /```\s*([\s\S]*?)\s*```/;
    const codeMatch = text.match(codeBlockRegex);

    if (codeMatch && codeMatch[1]) {
      return codeMatch[1].trim();
    }

    // Return as-is if no code blocks found
    return text.trim();
  }

  /**
   * Validate data against JSON schema
   */
  private static validateSchema(data: unknown, schema: JSONSchema): ValidationResult {
    if (schema.type === "object") {
      if (typeof data !== "object" || data === null || Array.isArray(data)) {
        return {
          valid: false,
          error: `Expected object, got ${typeof data}`,
        };
      }

      // Check required properties
      if (schema.required) {
        for (const prop of schema.required) {
          if (!(prop in data)) {
            return {
              valid: false,
              error: `Missing required property: ${prop}`,
            };
          }
        }
      }

      // Check properties
      if (schema.properties) {
        for (const [key, propSchema] of Object.entries(schema.properties)) {
          if (key in data) {
            const validation = this.validateSchema((data as Record<string, unknown>)[key], propSchema);
            if (!validation.valid) {
              return validation;
            }
          }
        }
      }

      // Check additional properties
      if (schema.additionalProperties === false) {
        const allowedKeys = new Set(Object.keys(schema.properties || {}));
        const actualKeys = Object.keys(data);
        for (const key of actualKeys) {
          if (!allowedKeys.has(key)) {
            return {
              valid: false,
              error: `Unexpected property: ${key}`,
            };
          }
        }
      }
    } else if (schema.type === "array") {
      if (!Array.isArray(data)) {
        return {
          valid: false,
          error: `Expected array, got ${typeof data}`,
        };
      }

      if (schema.items) {
        for (const item of data) {
          const validation = this.validateSchema(item, schema.items);
          if (!validation.valid) {
            return validation;
          }
        }
      }
    } else if (schema.type === "string") {
      if (typeof data !== "string") {
        return {
          valid: false,
          error: `Expected string, got ${typeof data}`,
        };
      }
    } else if (schema.type === "number") {
      if (typeof data !== "number") {
        return {
          valid: false,
          error: `Expected number, got ${typeof data}`,
        };
      }
    } else if (schema.type === "boolean") {
      if (typeof data !== "boolean") {
        return {
          valid: false,
          error: `Expected boolean, got ${typeof data}`,
        };
      }
    } else if (schema.type === "null") {
      if (data !== null) {
        return {
          valid: false,
          error: `Expected null, got ${typeof data}`,
        };
      }
    }

    return { valid: true };
  }

  /**
   * Create a simple schema from a TypeScript interface-like object
   */
  static createSchema(example: unknown): JSONSchema {
    if (Array.isArray(example)) {
      return {
        type: "array",
        items: example.length > 0 ? this.createSchema(example[0]) : { type: "string" },
      };
    }

    if (example === null) {
      return { type: "null" };
    }

    if (typeof example === "object") {
      const properties: Record<string, JSONSchema> = {};
      const required: string[] = [];

      for (const [key, value] of Object.entries(example as Record<string, unknown>)) {
        properties[key] = this.createSchema(value);
        required.push(key);
      }

      return {
        type: "object",
        properties,
        required,
      };
    }

    return { type: typeof example as "string" | "number" | "boolean" };
  }
}
