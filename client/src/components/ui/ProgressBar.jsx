function ProgressBar({ value = 0, label }) {
  // Keep the value between 0 and 100, even if bad data comes in
  const safeValue = Math.min(100, Math.max(0, Math.round(value)));

  let tone = 'danger';
  if (safeValue >= 70) {
    tone = 'success';
  } else if (safeValue >= 40) {
    tone = 'warning';
  }

  return (
    <div className="progress">
      {label && (
        <div className="progress-header">
          <span>{label}</span>
          <span>{safeValue}%</span>
        </div>
      )}
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={safeValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`progress-fill progress-${tone}`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;