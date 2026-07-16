// @ts-nocheck
interface InterviewProgressProps {
  remainingTopics: string[];
}

export function InterviewProgress({ remainingTopics }: InterviewProgressProps) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Questions restantes</p>
      <ul className="space-y-2">
        {remainingTopics.map((topic, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-2 h-2 rounded-full bg-gray-300" />
            <span>{topic}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
