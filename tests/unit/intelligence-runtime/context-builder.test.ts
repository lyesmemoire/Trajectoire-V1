/**
 * ContextBuilder Unit Tests
 */

import { describe, it, expect } from "vitest";
import { ContextBuilder } from "../../../lib/intelligence-runtime/application/ContextBuilder";
import { RuntimeContext } from "../../../lib/intelligence-runtime/domain/context/RuntimeContext";

describe("ContextBuilder", () => {
  describe("build", () => {
    it("should build context from sources", () => {
      const builder = new ContextBuilder();
      const context = builder.build([
        { key: "key1", value: "value1" },
        { key: "key2", value: 42 },
      ]);

      expect(context.get("key1")).toBe("value1");
      expect(context.get("key2")).toBe(42);
    });

    it("should build empty context when no sources", () => {
      const builder = new ContextBuilder();
      const context = builder.build();

      expect(context.isEmpty()).toBe(true);
    });

    it("should use default sources", () => {
      const builder = new ContextBuilder({
        sources: [{ key: "default1", value: "default" }],
      });
      const context = builder.build([{ key: "key1", value: "value1" }]);

      expect(context.get("default1")).toBe("default");
      expect(context.get("key1")).toBe("value1");
    });

    it("should override default sources with provided sources", () => {
      const builder = new ContextBuilder({
        sources: [{ key: "key1", value: "default" }],
      });
      const context = builder.build([{ key: "key1", value: "override" }]);

      expect(context.get("key1")).toBe("override");
    });
  });

  describe("buildChild", () => {
    it("should build child context from parent", () => {
      const parent = new RuntimeContext();
      parent.set("parentKey", "parentValue");

      const builder = new ContextBuilder();
      const child = builder.buildChild(parent, [{ key: "childKey", value: "childValue" }]);

      expect(child.get("parentKey")).toBe("parentValue");
      expect(child.get("childKey")).toBe("childValue");
    });

    it("should not modify parent when building child", () => {
      const parent = new RuntimeContext();
      parent.set("parentKey", "parentValue");

      const builder = new ContextBuilder();
      builder.buildChild(parent, [{ key: "childKey", value: "childValue" }]);

      expect(parent.has("childKey")).toBe(false);
    });
  });

  describe("withDefaults", () => {
    it("should add default sources", () => {
      const builder = new ContextBuilder();
      const updated = builder.withDefaults([{ key: "default1", value: "default" }]);

      const context = updated.build();
      expect(context.get("default1")).toBe("default");
    });

    it("should chain multiple withDefaults calls", () => {
      const builder = new ContextBuilder();
      const updated = builder
        .withDefaults([{ key: "default1", value: "default1" }])
        .withDefaults([{ key: "default2", value: "default2" }]);

      const context = updated.build();
      expect(context.get("default1")).toBe("default1");
      expect(context.get("default2")).toBe("default2");
    });

    it("should return updated builder", () => {
      const builder = new ContextBuilder();
      const updated = builder.withDefaults([{ key: "default", value: "default" }]);

      expect(updated).toBe(builder);
    });
  });

  describe("withImmutable", () => {
    it("should set immutable flag", () => {
      const builder = new ContextBuilder();
      const updated = builder.withImmutable(true);

      const context = updated.build();
      expect(() => context.set("key", "value")).toThrow("Cannot set value on immutable context");
    });

    it("should return updated builder", () => {
      const builder = new ContextBuilder();
      const updated = builder.withImmutable(true);

      expect(updated).toBe(builder);
    });
  });

  describe("withParent", () => {
    it("should set parent context", () => {
      const parent = new RuntimeContext();
      parent.set("parentKey", "parentValue");

      const builder = new ContextBuilder();
      const updated = builder.withParent(parent);

      const context = updated.build();
      expect(context.get("parentKey")).toBe("parentValue");
    });

    it("should return updated builder", () => {
      const parent = new RuntimeContext();
      const builder = new ContextBuilder();
      const updated = builder.withParent(parent);

      expect(updated).toBe(builder);
    });
  });
});
