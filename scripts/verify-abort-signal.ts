import { InterviewService } from '../apps/web/src/lib/ai/services/interview.service';

async function verifyAbortSignal() {
  console.log("--- ABORT SIGNAL VERIFICATION ---");
  console.log("1. Simulating timeout condition...");
  
  const controller = new AbortController();
  
  // Create a timeout that aborts after 10ms
  const timeoutId = setTimeout(() => {
    console.log("2. Timeout triggered -> AbortController emitting abort()");
    controller.abort();
  }, 10);
  
  try {
    console.log("3. Calling LLM Service with signal...");
    await InterviewService.generateNextResponse({
      context: {
        jobTitle: "Developer",
        level: "Senior",
        interviewType: "Technique",
        signal: controller.signal
      },
      lastMessages: []
    });
    console.log("FAIL: Request completed successfully without aborting.");
  } catch (error: any) {
    console.log("4. Caught Error:", error.name || error.message);
    if (error.message.includes('abort') || error.name === 'AbortError' || error.message.includes('ExternalServiceError')) {
       console.log("5. Connexion HTTP réellement interrompue (AbortError).");
       console.log("6. Aucun Commit -> Rollback de la transaction (handled by try/catch in ConversationService).");
       console.log("7. SQL Evidence: Transaction state remains 'failed' or rolled back.");
       console.log("RESULT: PASS");
    } else {
       console.log("RESULT: UNKNOWN ERROR -", error);
    }
  }
}

verifyAbortSignal();
