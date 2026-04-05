import "../styles/Skeleton.css";

function Skeleton({ type }) {
  const classes = `skeleton ${type}`;

  return <div className={`skeleton-wrapper ${type}`}>
    <div className={classes}></div>
    <div className="shimmer-wrapper">
      <div className="shimmer"></div>
    </div>
  </div>;
}

export default Skeleton;