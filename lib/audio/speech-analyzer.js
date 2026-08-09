const WPM_TARGETS = {
    MIN_IDEAL: 110,
    MAX_IDEAL: 150,
    TOO_SLOW: 80,
    TOO_FAST: 180,
};
const FILLER_WORDS_FR = [
    "euh",
    "heu",
    "hum",
    "um",
    "eh",
    "voilà",
    "donc",
    "alors",
    "ben",
    "bah",
    "genre",
    "en fait",
    "du coup",
    "c'est-à-dire",
    "clairement",
    "ouais",
    "ok",
];
const FILLER_WORDS_EN = [
    "um",
    "uh",
    "er",
    "ah",
    "like",
    "you know",
    "i mean",
    "basically",
    "actually",
    "right",
    "so",
    "well",
];
const ALL_FILLER_WORDS = [...FILLER_WORDS_FR, ...FILLER_WORDS_EN];
const PAUSE_THRESHOLDS = {
    SILENCE_DB: -40,
    PAUSE_MIN_MS: 400,
    LONG_PAUSE_MS: 2000,
};
export class SpeechAnalyzer {
    audioContext = null;
    analyserNode = null;
    stream = null;
    volumeHistory = [];
    segmentBuffer = [];
    recordingStart = 0;
    isCurrentlySilent = true;
    silenceStart = 0;
    async initialize() {
        if (typeof window === "undefined")
            return;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyserNode = this.audioContext.createAnalyser();
        this.analyserNode.fftSize = 2048;
    }
    async connectStream(stream) {
        if (!this.audioContext || !this.analyserNode)
            await this.initialize();
        const source = this.audioContext.createMediaStreamSource(stream);
        source.connect(this.analyserNode);
        this.stream = stream;
    }
    getCurrentVolumeDb() {
        if (!this.analyserNode)
            return -Infinity;
        const bufferLength = this.analyserNode.fftSize;
        const dataArray = new Float32Array(bufferLength);
        this.analyserNode.getFloatTimeDomainData(dataArray);
        let sum = 0;
        for (const amplitude of dataArray)
            sum += amplitude * amplitude;
        const rms = Math.sqrt(sum / bufferLength);
        return rms === 0 ? -Infinity : 20 * Math.log10(rms);
    }
    startVolumeTracking(intervalMs = 100) {
        this.volumeHistory = [];
        this.recordingStart = performance.now();
        const id = setInterval(() => {
            const db = this.getCurrentVolumeDb();
            this.volumeHistory.push(db);
            this.detectSilence(db, performance.now() - this.recordingStart);
        }, intervalMs);
        return () => clearInterval(id);
    }
    detectSilence(db, elapsedMs) {
        const isSilent = db < PAUSE_THRESHOLDS.SILENCE_DB;
        if (isSilent && !this.isCurrentlySilent) {
            this.isCurrentlySilent = true;
            this.silenceStart = elapsedMs;
        }
        else if (!isSilent && this.isCurrentlySilent) {
            this.isCurrentlySilent = false;
            const silenceDuration = elapsedMs - this.silenceStart;
            if (silenceDuration >= PAUSE_THRESHOLDS.PAUSE_MIN_MS) {
                this.segmentBuffer.push({
                    startTime: this.silenceStart / 1000,
                    endTime: elapsedMs / 1000,
                    wordsPerMinute: 0,
                    isSilence: true,
                    text: "",
                });
            }
        }
    }
    analyzeTranscript(transcript, durationSeconds, segments) {
        const words = transcript
            .toLowerCase()
            .replace(/[.,!?;:()[\]{}'"]/g, " ")
            .split(/\s+/)
            .filter((w) => w.length > 0);
        const totalWords = words.length;
        const wpm = durationSeconds > 0 ? Math.round((totalWords / durationSeconds) * 60) : 0;
        const wpmRating = this.rateWPM(wpm);
        const fillerWords = this.detectFillerWords(transcript);
        const fillerWordCount = fillerWords.reduce((sum, f) => sum + f.count, 0);
        const fillerWordRate = totalWords > 0 ? Math.round((fillerWordCount / totalWords) * 100) : 0;
        const speechSegments = segments
            ? this.analyzeWhisperSegments(segments)
            : this.segmentBuffer;
        const silenceSegments = speechSegments.filter((s) => s.isSilence);
        const pauseCount = silenceSegments.length;
        const totalSilence = silenceSegments.reduce((sum, s) => sum + (s.endTime - s.startTime), 0);
        const avgPause = pauseCount > 0 ? totalSilence / pauseCount : 0;
        const longPauses = silenceSegments.filter((s) => s.endTime - s.startTime >= 2).length;
        const pauseRatio = durationSeconds > 0
            ? Math.round((totalSilence / durationSeconds) * 100)
            : 0;
        const variation = this.analyzeSpeedVariation(segments);
        const score = this.computeScore(wpm, fillerWordRate, longPauses, variation.speedVariation);
        return {
            wordsPerMinute: wpm,
            wordsPerMinuteRating: wpmRating,
            totalWords,
            totalDurationSeconds: durationSeconds,
            pauseCount,
            averagePauseDuration: Math.round(avgPause * 10) / 10,
            longPauseCount: longPauses,
            pauseRatio,
            fillerWords,
            fillerWordCount,
            fillerWordRate,
            speedVariation: Math.round(variation.speedVariation * 100) / 100,
            speedVariationRating: variation.speedVariationRating,
            overallScore: score,
            overallRating: this.rateOverall(score),
            recommendations: this.buildRecommendations(wpm, wpmRating, fillerWordRate, fillerWords, longPauses, variation.speedVariation),
            segments: speechSegments,
        };
    }
    rateWPM(wpm) {
        if (wpm < WPM_TARGETS.TOO_SLOW)
            return "too_slow";
        if (wpm < WPM_TARGETS.MIN_IDEAL)
            return "slow";
        if (wpm > WPM_TARGETS.TOO_FAST)
            return "too_fast";
        if (wpm > WPM_TARGETS.MAX_IDEAL)
            return "fast";
        return "ideal";
    }
    detectFillerWords(text) {
        const lower = text.toLowerCase();
        return ALL_FILLER_WORDS.map((filler) => {
            const regex = new RegExp(`\\b${filler}\\b`, "gi");
            const matches = [...lower.matchAll(regex)];
            return {
                word: filler,
                count: matches.length,
                timestamps: matches.map((m) => (m.index || 0) / lower.length),
            };
        })
            .filter((f) => f.count > 0)
            .sort((a, b) => b.count - a.count);
    }
    analyzeWhisperSegments(segments) {
        return segments.map((s) => ({
            startTime: s.start,
            endTime: s.end,
            wordsPerMinute: Math.round((s.text.split(" ").length / (s.end - s.start)) * 60),
            isSilence: false,
            text: s.text,
        }));
    }
    analyzeSpeedVariation(segments) {
        if (!segments || segments.length < 3)
            return { speedVariation: 0, speedVariationRating: "Non évaluable" };
        const wpms = segments
            .map((s) => (s.text.split(" ").length / (s.end - s.start)) * 60)
            .filter((w) => w > 0);
        const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
        const stdDev = Math.sqrt(wpms.reduce((s, w) => s + Math.pow(w - mean, 2), 0) / wpms.length);
        const cv = stdDev / mean;
        return {
            speedVariation: cv,
            speedVariationRating: cv < 0.15 ? "Excellent" : cv < 0.3 ? "Bon" : "Irrégulier",
        };
    }
    computeScore(wpm, fillers, longPauses, variation) {
        let s = 0;
        s += Math.max(0, 40 - Math.abs(wpm - 130) / 2);
        s += Math.max(0, 30 - fillers * 4);
        s += Math.max(0, 15 - longPauses * 3);
        s += Math.max(0, 15 - variation * 30);
        return Math.round(s);
    }
    rateOverall(score) {
        if (score >= 85)
            return "excellent";
        if (score >= 70)
            return "good";
        if (score >= 50)
            return "average";
        return "needs_work";
    }
    buildRecommendations(wpm, rating, fillerRate, fillers, longPauses, variation) {
        const recs = [];
        if (rating === "fast" || rating === "too_fast")
            recs.push({
                type: "speed",
                severity: "critical",
                title: "Débit rapide",
                description: "Ralentissez pour être mieux compris.",
                tip: "Marquez des pauses.",
            });
        if (fillerRate > 5)
            recs.push({
                type: "fillers",
                severity: "warning",
                title: "Tics de langage",
                description: `Mots parasites fréquents (${fillerRate}%).`,
                tip: "Assumez le silence.",
            });
        return recs;
    }
    destroy() {
        this.stream?.getTracks().forEach((t) => t.stop());
        this.audioContext?.close();
    }
}
export const speechAnalyzer = new SpeechAnalyzer();
//# sourceMappingURL=speech-analyzer.js.map