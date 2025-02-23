export default function Skeleton({ height = "20px", width = "100%", className = "" }) {
    return (
      <div
        className={`bg-gray-300 animate-pulse rounded-md ${className}`}
        style={{ height, width }}
      />
    );
  }
  