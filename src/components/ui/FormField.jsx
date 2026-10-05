function FormField({ label, htmlFor, error, children }) {
  return (
    <div className="form-field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

export default FormField;