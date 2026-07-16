// @ts-nocheck
import { PrivateNote } from "../../types/interview";

interface RecruiterNotesProps {
  notes: PrivateNote[];
}

export function RecruiterNotes({ notes }: RecruiterNotesProps) {
  return (
    <div className="space-y-2">
      {notes.map((note) => (
        <div
          key={note.id}
          className={`flex items-start gap-2 text-xs p-2 rounded border ${
            note.category === "positive"
              ? "bg-green-50 border-green-200 text-green-700"
              : note.category === "negative"
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-amber-50 border-amber-200 text-amber-700"
          }`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
              note.category === "positive"
                ? "bg-green-500"
                : note.category === "negative"
                ? "bg-red-500"
                : "bg-amber-500"
            }`}
          />
          <span>{note.content}</span>
        </div>
      ))}
      {notes.length === 0 && (
        <p className="text-xs text-gray-400 italic">En cours d'analyse...</p>
      )}
    </div>
  );
}
