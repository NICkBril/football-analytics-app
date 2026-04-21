import "../styles/Skeleton.css";

function Skeleton({ type }) {
  if (type === "card") {
    return (
      <div className="skeleton-card">
        <div className="skeleton-card-left">
          <div className="skeleton-block skeleton-circle" />
        </div>
        <div className="skeleton-card-body">
          <div className="skeleton-block skeleton-line w-60" />
          <div className="skeleton-block skeleton-line w-40" />
        </div>
        <div className="skeleton-shimmer" />
      </div>
    );
  }

  if (type === "title") {
    return (
      <div className="skeleton-title-wrap">
        <div className="skeleton-block skeleton-line w-50" style={{ height: "22px" }} />
        <div className="skeleton-shimmer" />
      </div>
    );
  }

  if (type === "text") {
    return (
      <div className="skeleton-text-wrap">
        <div className="skeleton-block skeleton-line w-100" />
        <div className="skeleton-block skeleton-line w-80" />
        <div className="skeleton-block skeleton-line w-60" />
        <div className="skeleton-shimmer" />
      </div>
    );
  }

  if (type === "avatar") {
    return (
      <div className="skeleton-avatar-wrap">
        <div className="skeleton-block skeleton-circle skeleton-circle-lg" />
        <div className="skeleton-shimmer" />
      </div>
    );
  }

  if (type === "thumbnail") {
    return (
      <div className="skeleton-thumbnail-wrap">
        <div className="skeleton-block skeleton-rect" />
        <div className="skeleton-shimmer" />
      </div>
    );
  }

  return (
    <div className="skeleton-title-wrap">
      <div className="skeleton-block skeleton-line w-100" />
      <div className="skeleton-shimmer" />
    </div>
  );
}

export default Skeleton;