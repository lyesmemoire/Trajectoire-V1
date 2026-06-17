/**
 * Build the prompt messages sent to OpenAI.
 * For Sprint 2 we keep it minimal – a system prompt that includes the CV and job description,
 * then the conversation history.
 */
export function buildPrompt(
  cv: string,
  job: string,
  messages: { role: "system" | "user" | "assistant"; content: string }[],
): { role: "system" | "user" | "assistant"; content: string }[] {
  const system = `You are an interview assistant. Use the following candidate CV and job description to answer.
CV: ${cv}
Job: ${job}`;
  // Ensure the system prompt is first, then the provided messages (history already contains a system entry maybe).
  const result: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: system },
    ...messages,
  ];
  return result;
}
