import { db, Post, Author, NOW } from 'astro:db';

export default async function() {
	await db.insert(Author).values([
		{authorId: 1, name: "Jacob Berglund"}
	]);
  await db.insert(Post).values([
    { postId: 1, slug: 'well-well-well', authorId: 1, text: 'Well, well, well. If it isnt content-type text/html', published: NOW, likes: 10},
  ])
}
