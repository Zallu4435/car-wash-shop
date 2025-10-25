import { CheckCircle, Circle } from 'lucide-react';

interface TimelineStep {
  label: string;
  date?: string;
  completed: boolean;
}

interface StatusTimelineProps {
  steps: TimelineStep[];
}

export function StatusTimeline({ steps }: StatusTimelineProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="relative">
            {step.completed ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <Circle className="h-6 w-6 text-gray-300" />
            )}
            {index < steps.length - 1 && (
              <div className={`absolute left-3 top-6 w-0.5 h-8 ${step.completed ? 'bg-green-600' : 'bg-gray-300'}`} />
            )}
          </div>
          <div className="flex-1">
            <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
              {step.label}
            </p>
            {step.date && <p className="text-sm text-gray-500">{step.date}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
