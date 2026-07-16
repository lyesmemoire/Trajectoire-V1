/**
 * Prompt Renderer
 *
 * Renders prompts with variable substitution and formatting.
 */

export interface PromptVariables {
  [key: string]: string | number | boolean | object;
}

export interface PromptTemplate {
  system?: string;
  user: string;
  variables?: string[]; // List of expected variable names
}

/**
 * Prompt Renderer
 *
 * Renders prompt templates with variable substitution.
 */
export class PromptRenderer {
  /**
   * Render a prompt template with variables
   */
  static render(template: PromptTemplate, variables: PromptVariables = {}): {
    system?: string;
    user: string;
  } {
    const system = template.system ? this.substitute(template.system, variables) : undefined;
    const user = this.substitute(template.user, variables);

    return { system, user };
  }

  /**
   * Substitute variables in a string
   * Supports {{variable}} syntax
   */
  private static substitute(template: string, variables: PromptVariables): string {
    let result = template;

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      const regex = new RegExp(this.escapeRegex(placeholder), "g");
      
      let replacement: string;
      if (typeof value === "object") {
        replacement = JSON.stringify(value, null, 2);
      } else {
        replacement = String(value);
      }

      result = result.replace(regex, replacement);
    }

    return result;
  }

  /**
   * Escape special regex characters
   */
  private static escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * Validate that all required variables are provided
   */
  static validateVariables(template: PromptTemplate, variables: PromptVariables): {
    valid: boolean;
    missing: string[];
  } {
    const missing: string[] = [];

    if (template.variables) {
      for (const variable of template.variables) {
        if (!(variable in variables)) {
          missing.push(variable);
        }
      }
    }

    return {
      valid: missing.length === 0,
      missing,
    };
  }

  /**
   * Extract variable names from a template
   */
  static extractVariables(template: string): string[] {
    const regex = /\{\{([^}]+)\}\}/g;
    const variables = new Set<string>();
    let match;

    while ((match = regex.exec(template)) !== null) {
      if (match[1]) {
        variables.add(match[1]);
      }
    }

    return Array.from(variables);
  }

  /**
   * Format JSON for prompt inclusion
   * Ensures proper indentation and escaping
   */
  static formatJSON(data: object, indent: number = 2): string {
    return JSON.stringify(data, null, indent);
  }

  /**
   * Truncate content to fit within token limits
   * Simple character-based truncation (for more accuracy, use token counter)
   */
  static truncate(content: string, maxLength: number, suffix: string = "..."): string {
    if (content.length <= maxLength) {
      return content;
    }

    return content.substring(0, maxLength - suffix.length) + suffix;
  }
}
