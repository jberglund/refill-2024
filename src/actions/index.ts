import { defineAction, z, formDataToObject } from "astro:actions";

export const server = {
  simple: defineAction({
    accept: "form",
    input: z.object({
      receivingAccount: z.string().length(11, "Kontonummer må være 11 tegn"),
      amount: z.coerce
        .number()
        .min(1, "Beløp må være større enn 0")
        .max(2415, "You must construct additional pylons 💎"),
      message: z
        .string()
        .regex(/^((?!\p{Emoji_Presentation}).)*$/u, "Bare emojis, takk!"),
      //.optional(),
    }),
    handler: async () => {
      return { success: true };
    },
  }),
};
