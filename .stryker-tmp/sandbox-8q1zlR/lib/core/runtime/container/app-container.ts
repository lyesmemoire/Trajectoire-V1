// @ts-nocheck
import { Container } from "./Container";

// Lazy initialization to avoid build-time Supabase errors
let _appContainer: Container | null = null;

function getContainer(): Container {
  if (!_appContainer) {
    _appContainer = new Container();

    // Only register modules at runtime, not during build
    if (typeof window !== "undefined" || process.env.NODE_ENV !== "production") {
      try {
        const CvModule = require("@/lib/cv/CvModule").CvModule;
        const CareerModule = require("@/lib/career/CareerModule").CareerModule;
        const InterviewModule = require("@/lib/interview/interview.module").InterviewModule;
        const AiModule = require("@/lib/ai/ai.module").AiModule;
        const AuthModule = require("@/lib/auth/AuthModule").AuthModule;

        // Register the CV Module
        new CvModule().register(_appContainer);

        // Register the Career Module
        new CareerModule().register(_appContainer);

        // Register the Interview Module
        new InterviewModule().register(_appContainer);

        // Register the AI Module
        new AiModule().register(_appContainer);

        // Register the Auth Module
        new AuthModule().register(_appContainer);
      } catch (e) {
        console.warn("Failed to register modules during build:", e);
      }
    }

    // Temporary mocks for CommandBus and QueryBus and DomainEventPublisher
    // if they are not already in the container from another module
    if (!_appContainer["singletons"]?.has("CommandBus")) {
      _appContainer.registerSingleton("CommandBus", {
        execute: async () => ({ isFailure: () => false, unwrap: () => {}, unwrapError: () => {} })
      });
    }
    if (!_appContainer["singletons"]?.has("QueryBus")) {
      _appContainer.registerSingleton("QueryBus", {
        execute: async () => ({ isFailure: () => false, unwrap: () => true, unwrapError: () => {} })
      });
    }
    if (!_appContainer["singletons"]?.has("DomainEventPublisher")) {
      _appContainer.registerSingleton("DomainEventPublisher", {
        publishEventsFrom: async () => {},
        persistEventsFrom: async () => {},
        publish: async () => {}
      });
    }
  }
  return _appContainer;
}

// Export a getter instead of the container directly
export const appContainer = new Proxy({} as Container, {
  get(target, prop) {
    const container = getContainer();
    return container[prop as keyof Container];
  },
  has(target, prop) {
    const container = getContainer();
    return prop in container;
  },
});
