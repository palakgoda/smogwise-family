import React from "react";
import { AlertCircle } from "lucide-react";

export const MedicalDisclaimer: React.FC = () => {
  return (
    <div
      role="note"
      aria-label="Medical Disclaimer"
      className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-amber-900 shadow-sm"
    >
      <div className="flex items-start space-x-3">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700" aria-hidden="true" />
        <div className="text-xs sm:text-sm leading-relaxed">
          <strong className="font-semibold text-amber-950">Medical & Health Disclaimer: </strong>
          SmogWise Family provides lifestyle, indoor air quality, and routine planning support based on environmental sensor readings. It is not a substitute for professional medical diagnosis or personalized treatment. If anyone in your home experiences shortness of breath, continuous coughing, chest pain, or acute respiratory distress, please contact a qualified healthcare professional immediately.
        </div>
      </div>
    </div>
  );
};

