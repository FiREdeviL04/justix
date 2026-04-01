import ReviewCard from "../components/ReviewCard";

const reviews = [
  { name: "Priya, Pune", rating: 5, text: "Affordable and easy to understand. I found a family lawyer in one day." },
  { name: "Harish, Delhi", rating: 4, text: "Simple dashboard and quick responses. Budget filter is very useful." },
  { name: "Nasreen, Lucknow", rating: 5, text: "Very smooth process for booking a consultation and tracking status." },
  { name: "Rohit, Jaipur", rating: 4, text: "Clear lawyer profiles and transparent pricing. Good for first-time users." },
];

const ReviewsPage = () => {
  return (
    <section className="space-y-5">
      <h1 className="text-3xl text-brand-900">Reviews & Testimonials</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {reviews.map((review) => (
          <ReviewCard key={review.name} review={review} />
        ))}
      </div>
    </section>
  );
};

export default ReviewsPage;
