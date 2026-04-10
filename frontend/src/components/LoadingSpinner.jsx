function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner" role="status" aria-label="Loading"></div>
      <p className="loading-text">Loading...</p>
    </div>
  );
}

export default LoadingSpinner;