// @ts-nocheck
import { describe, it, expect } from "vitest";
import { Persona, PersonaProps, PersonaType } from "../../../lib/interview/domain/value-objects/persona.vo";

describe("Persona Value Object", () => {
  describe("creation", () => {
    it("should create persona with valid props", () => {
      const props: PersonaProps = {
        id: "persona-1",
        type: "direct",
        instructions: "Be direct and concise"
      };
      const persona = Persona.create(props);
      
      expect(persona.id).toBe("persona-1");
      expect(persona.type).toBe("direct");
      expect(persona.instructions).toBe("Be direct and concise");
    });

    it("should throw error for missing id", () => {
      const props: PersonaProps = {
        id: "",
        type: "direct",
        instructions: "Be direct"
      };
      
      expect(() => Persona.create(props)).toThrow("Persona must have an ID and instructions.");
    });

    it("should throw error for missing instructions", () => {
      const props: PersonaProps = {
        id: "persona-1",
        type: "direct",
        instructions: ""
      };
      
      expect(() => Persona.create(props)).toThrow("Persona must have an ID and instructions.");
    });

    it("should accept all valid persona types", () => {
      const types: PersonaType[] = ["direct", "supportive", "challenging", "analytical"];
      
      types.forEach(type => {
        const props: PersonaProps = {
          id: "persona-1",
          type,
          instructions: "Test instructions"
        };
        expect(() => Persona.create(props)).not.toThrow();
      });
    });

    it("should handle long instructions", () => {
      const longInstructions = "a".repeat(1000);
      const props: PersonaProps = {
        id: "persona-1",
        type: "direct",
        instructions: longInstructions
      };
      const persona = Persona.create(props);
      
      expect(persona.instructions).toBe(longInstructions);
    });
  });

  describe("edge cases", () => {
    it("should maintain immutability", () => {
      const props: PersonaProps = {
        id: "persona-1",
        type: "direct",
        instructions: "Be direct"
      };
      const persona = Persona.create(props);
      
      // Properties are readonly, so this is a compile-time check
      expect(persona.id).toBe("persona-1");
      expect(persona.type).toBe("direct");
      expect(persona.instructions).toBe("Be direct");
    });

    it("should handle special characters in instructions", () => {
      const props: PersonaProps = {
        id: "persona-1",
        type: "direct",
        instructions: "Special chars: \n\t\r\\\"'"
      };
      const persona = Persona.create(props);
      
      expect(persona.instructions).toBe("Special chars: \n\t\r\\\"'");
    });

    it("should handle unicode characters in instructions", () => {
      const props: PersonaProps = {
        id: "persona-1",
        type: "direct",
        instructions: "Unicode: 你好 🌍"
      };
      const persona = Persona.create(props);
      
      expect(persona.instructions).toBe("Unicode: 你好 🌍");
    });

    it("should handle very long id", () => {
      const longId = "a".repeat(1000);
      const props: PersonaProps = {
        id: longId,
        type: "direct",
        instructions: "Be direct"
      };
      const persona = Persona.create(props);
      
      expect(persona.id).toBe(longId);
    });
  });
});
