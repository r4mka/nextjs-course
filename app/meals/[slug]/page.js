export default async function MealPage({ params }) {
  const { slug } = await params;

  return (
    <main>
      <h1>Meal Page:</h1>
      <p>This is the meal page for the meal with the slug: {slug}</p>
    </main>
  );
}
