import sql from "better-sqlite3";
import { promises as fs } from "node:fs";
import path from "node:path";
import slugify from "slugify";
import xss from "xss";

const db = sql("meals.db");

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  // throw new Error("Loading meals failed");
  return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(slug) {
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);
  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;
  const imageDir = path.join(process.cwd(), "public", "images");
  const imagePath = path.join(imageDir, fileName);

  try {
    await fs.mkdir(imageDir, { recursive: true });
    const bufferedImage = Buffer.from(await meal.image.arrayBuffer());
    await fs.writeFile(imagePath, bufferedImage);
  } catch (error) {
    throw new Error(`Saving image failed: ${error.message}`);
  }

  meal.image = `/images/${fileName}`;

  await new Promise((resolve) => setTimeout(resolve, 2000));

  db.prepare(
    `
    INSERT INTO meals
      (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (
      @title,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @image,
      @slug
    )
  `,
  ).run(meal);
}
