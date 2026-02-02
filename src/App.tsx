import { useState } from "react";
import "./index.css";
import Figure from "./Figure";

export default function App() {
  const [total, setTotal] = useState(100);
  const [better, setBetter] = useState(5);
  const [devastating, setDevastating] = useState(2);

  // Clamp values safely
  const safeBetter = Math.min(better, total);
  const safeDevastating = Math.min(devastating, safeBetter);
  const unaffected = total - safeBetter - safeDevastating;

  const cells = Array.from({ length: 100 });

  const resetSliders = () => {
    setTotal(100);
    setBetter(5);
    setDevastating(2);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center gap-6">
      <h1 className="text-xl font-semibold">Population Outcome Visualizer</h1>

      {/* Controls */}
      <div className="w-full max-w-xl space-y-4 bg-white p-4 rounded-lg shadow">
        <Slider
          label="Total population"
          value={total}
          max={100}
          onChange={setTotal}
        />

        <Slider
          label="Benefit"
          value={safeBetter}
          max={total}
          onChange={setBetter}
          color="text-green-600"
        />

        <Slider
          label="Harm"
          value={safeDevastating}
          max={safeBetter}
          onChange={setDevastating}
          color="text-red-600"
        />
        <button onClick={resetSliders}>Reset</button>
      </div>

      {/* Infographic */}
      <div className="grid grid-cols-10 gap-1">
        {cells.map((_, i) => {
          let status = "default";

          if (i < total) {
            if (i < safeBetter) {
              status = "benefit";
            } else if (i >= total - safeDevastating) {
              status = "harm";
            } else {
              status = "unharmed";
            }
          }

          return (
            <div key={i} className="w-14 h-14 rounded-sm">
              <Figure status={status} />
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-sm">
        <Legend color="bg-green-500" label="Benefit" />
        <Legend color="bg-red-500" label="Harm" />
        <Legend color="bg-gray-400" label="No change" />
      </div>

      {/* Summary */}
      <div className="max-w-xl text-center text-gray-700">
        <p>
          Out of <strong>{total}</strong> people,{" "}
          <strong className="text-green-600">{safeBetter}</strong> will have
          benefit, <strong className="text-red-600">{safeDevastating}</strong>{" "}
          will harm, and <strong>{unaffected}</strong> will experience no
          meaningful change.
        </p>
      </div>
    </div>
  );
}
interface SliderProps {
  label: string;
  value: number;
  max?: number;
  onChange: (value: number) => void;
  color?: string;
}

function Slider({ label, value, max, onChange, color = "" }: SliderProps) {
  const step = label.toLowerCase().includes("population") ? 1 : 0.1;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <label className={color} htmlFor={label}>
          {label}
        </label>
        <input
          className="w-16 outline-1 p-1 border"
          id={label}
          type="number"
          step={step}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.currentTarget.value))}
        />
      </div>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

interface LegendProps {
  color: string;
  label: string;
}

function Legend({ color, label }: LegendProps) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 ${color} rounded-sm`} />
      <span>{label}</span>
    </div>
  );
}
