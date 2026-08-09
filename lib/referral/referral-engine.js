import prisma from "@/lib/prisma";
/**
 * Referral Engine - Growth Loop Logic
 */
export async function processReferral(newUserId, referralCode) {
    const referrer = await prisma.user.findUnique({
        where: { referralCode },
    });
    if (!referrer)
        return null;
    // 1. Link new user to referrer
    await prisma.user.update({
        where: { id: newUserId },
        data: { referredBy: referrer.id },
    });
    // 2. Increment referral count
    await prisma.user.update({
        where: { id: referrer.id },
        data: { referralCount: { increment: 1 } },
    });
    // 3. Apply Reward (e.g., Unlock a special Persona or give credits)
    await applyReferralReward(referrer.id);
    return referrer;
}
async function applyReferralReward(userId) {
    const profile = await prisma.careerProfile.findUnique({
        where: { userId },
    });
    if (!profile)
        return;
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { referralCount: true },
    });
    if (user && user.referralCount % 3 === 0) {
        const newPersonas = [...(profile.unlockedPersonas || []), "cto_hardcore"];
        await prisma.careerProfile.update({
            where: { userId },
            data: { unlockedPersonas: Array.from(new Set(newPersonas)) },
        });
    }
}
export async function getReferralStats(userId) {
    return await prisma.user.findUnique({
        where: { id: userId },
        select: {
            referralCode: true,
            referralCount: true,
        },
    });
}
//# sourceMappingURL=referral-engine.js.map