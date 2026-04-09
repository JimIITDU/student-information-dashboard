function ErrorMessage({ message }) {
  return (
    <div className="error-container" role="alert">
      <strong>Error: </strong>{message}
    </div>
  );
}

export default ErrorMessage;