import { db, Post, Author, NOW, Todo } from "astro:db";

export default async function () {
  await db.insert(Author).values([{ authorId: 1, name: "Jacob Berglund" }]);
  await db.insert(Post).values([
    {
      slug: "well-well-well",
      authorId: 1,
      text: "Well, well, well. If it isnt content-type text/html",
      published: NOW,
      likes: 10,
    },
  ]);

  await db.insert(Todo).values([
    {
      slug: "this-is-a-todo",
      text: "This is a todo",
      published: NOW,
      done: false,
    },
    {
      slug: "this-is-a-another-todo",
      text: "This is another todo",
      published: NOW,
      done: true,
    },
  ]);
}
