import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { RecruiterProfile, RecruiterBehavior } from "../../types/interview";

interface RecruiterCardProps {
  profile: RecruiterProfile;
  behavior?: RecruiterBehavior;
}

export function RecruiterCard({ profile, behavior }: RecruiterCardProps) {
  const getHeadTilt = () => {
    if (behavior?.currentFocus === "thinking") return { rotate: [-2, 2, -2] };
    if (behavior?.currentFocus === "notes") return { rotate: [0, -3, 0] };
    return { rotate: [0, 1, 0] };
  };

  const getGazeAnimation = () => {
    if (behavior?.currentFocus === "candidate") return { x: [0, 5, 0] };
    if (behavior?.currentFocus === "notes") return { x: [0, -10, 0] };
    return { x: [0, 2, 0] };
  };

  const getExpressionAnimation = () => {
    switch (behavior?.currentExpression) {
      case "smiling":
        return { scale: [1, 1.05, 1] };
      case "serious":
        return { scale: [1, 0.98, 1] };
      case "thoughtful":
        return { y: [0, -2, 0] };
      case "encouraging":
        return { scale: [1, 1.03, 1] };
      default:
        return { scale: [1, 1.01, 1] };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8"
    >
      <div className="bg-white border border-gray-200/60 shadow-sm rounded-lg p-6">
        <div className="flex items-start gap-6">
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-32 h-32 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden relative"
          >
            <motion.div
              animate={getHeadTilt()}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-full h-full"
            >
              <motion.div
                animate={getGazeAnimation()}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-full h-full"
              >
                <motion.div
                  animate={getExpressionAnimation()}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-full h-full"
                >
                  <img
                    src="/images/recruiter-professional.jpg"
                    alt="Recruteur professionnel"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<svg class="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>';
                    }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                {profile.title}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{profile.experience}</p>
            <div className="flex items-center gap-4 mb-4">
              {profile.traits.map((trait, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-600">{trait}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-700 italic border-l-2 border-blue-200 pl-3">
              {profile.openingMessage}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
