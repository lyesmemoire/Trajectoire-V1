export function selectModel(plan, _endpoint) {
    if (plan === "enterprise")
        return "gpt-4o";
    // Default for Free and Pro is the much cheaper and still highly capable mini
    return "gpt-4o-mini";
}
//# sourceMappingURL=model-router.js.map