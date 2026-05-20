import { useNavigate } from 'react-router-dom';

export default function ErrorMessage({ message, onRetry }) {
  const navigate = useNavigate();

  return (
    <div className="alert alert-danger text-center my-4" role="alert">
      <h5 className="alert-heading">Oops!</h5>
      <p className="mb-2">{message || 'Something went wrong.'}</p>
      <div className="d-flex gap-2 justify-content-center">
        {onRetry && (
          <button className="btn btn-outline-danger btn-sm" onClick={onRetry}>
            Retry
          </button>
        )}
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    </div>
  );
}
