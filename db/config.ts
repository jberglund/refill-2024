import { defineTable, column, defineDb, NOW } from "astro:db";

const Todo = defineTable({
  columns: {
    slug: column.text({ primaryKey: true, unique: true }),
    text: column.text(),
    published: column.date({ default: NOW, optional: true }),
    done: column.boolean({ default: false }),
    //likes: column.number({default: 0 })
  },
  indexes: [{ on: ["published", "slug"], unique: true }],
});

const Author = defineTable({
  columns: {
    authorId: column.number({ primaryKey: true }),
    name: column.text(),
  },
});
const Post = defineTable({
  columns: {
    slug: column.text({ primaryKey: true }),
    authorId: column.number({ references: () => Author.columns.authorId }),
    text: column.text(),
    published: column.date({ default: NOW, optional: true }),
    likes: column.number({ default: 0 }),
  },
  indexes: [{ on: ["published", "slug"], unique: true }],
});

// https://astro.build/db/config
export default defineDb({
  tables: { Todo, Post, Author },
});
