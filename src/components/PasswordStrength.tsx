import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
  showRequirements?: boolean;
  className?: string;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    label: "At least 8 characters",
    test: (p) => p.length >= 8,
  },
  {
    label: "Contains uppercase letter",
    test: (p) => /[A-Z]/.test(p),
  },
  {
    label: "Contains lowercase letter",
    test: (p) => /[a-z]/.test(p),
  },
  {
    label: "Contains a number",
    test: (p) => /\d/.test(p),
  },
  {
    label: "Contains special character (!@#$%^&*)",
    test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
  },
];

function calculateStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!password) {
    return { score: 0, label: "", color: "bg-muted" };
  }

  let score = 0;

  // Length scoring
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Character variety scoring
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

  // Bonus for mixing
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const varietyCount = [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length;

  if (varietyCount >= 3) score += 1;
  if (varietyCount >= 4) score += 1;

  // Penalize common patterns
  if (/^[a-zA-Z]+$/.test(password)) score -= 1; // Only letters
  if (/^\d+$/.test(password)) score -= 2; // Only numbers
  if (/(.)\1{2,}/.test(password)) score -= 1; // Repeated characters
  if (/^(password|123456|qwerty)/i.test(password)) score -= 3; // Common passwords

  // Normalize score to 0-4
  const normalizedScore = Math.max(0, Math.min(4, Math.round(score / 2.5)));

  const strengthLevels = [
    { label: "Very Weak", color: "bg-red-500" },
    { label: "Weak", color: "bg-orange-500" },
    { label: "Fair", color: "bg-yellow-500" },
    { label: "Strong", color: "bg-lime-500" },
    { label: "Very Strong", color: "bg-green-500" },
  ];

  return {
    score: normalizedScore,
    ...strengthLevels[normalizedScore],
  };
}

export function PasswordStrength({
  password,
  showRequirements = true,
  className,
}: PasswordStrengthProps) {
  const strength = useMemo(() => calculateStrength(password), [password]);

  const metRequirements = useMemo(() => {
    return PASSWORD_REQUIREMENTS.map((req) => ({
      ...req,
      met: req.test(password),
    }));
  }, [password]);

  if (!password) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Password Strength</span>
          <span
            className={cn(
              "font-medium",
              strength.score <= 1 && "text-red-500",
              strength.score === 2 && "text-yellow-500",
              strength.score >= 3 && "text-green-500"
            )}
          >
            {strength.label}
          </span>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={cn(
                "h-2 flex-1 rounded-full transition-colors",
                index <= strength.score ? strength.color : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* Requirements List */}
      {showRequirements && (
        <ul className="space-y-1 text-sm">
          {metRequirements.map((req, index) => (
            <li
              key={index}
              className={cn(
                "flex items-center gap-2 transition-colors",
                req.met ? "text-green-600" : "text-muted-foreground"
              )}
            >
              {req.met ? (
                <Check className="h-4 w-4 shrink-0" />
              ) : (
                <X className="h-4 w-4 shrink-0" />
              )}
              <span>{req.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Hook to validate password strength
 */
export function usePasswordStrength(password: string) {
  return useMemo(() => {
    const strength = calculateStrength(password);
    const requirements = PASSWORD_REQUIREMENTS.map((req) => ({
      ...req,
      met: req.test(password),
    }));

    const allRequirementsMet = requirements.every((req) => req.met);
    const isStrong = strength.score >= 3;

    return {
      strength,
      requirements,
      isValid: allRequirementsMet && password.length >= 8,
      isStrong,
    };
  }, [password]);
}
