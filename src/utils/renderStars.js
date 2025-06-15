export function renderStars(rating) {
  if (typeof rating !== "number" || isNaN(rating)) {
    return "No rating";
  }

  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <>
      {"★".repeat(fullStars)}
      {halfStar ? "☆" : ""}
      {"☆".repeat(emptyStars)}
      <span className="five-star"> ({rating.toFixed(1)}/5)</span>
    </>
  );
}
