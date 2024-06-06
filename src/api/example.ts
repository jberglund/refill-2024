import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  // Do something with the data, then return a success response
  return new Response(
    JSON.stringify({
      message: "Success!",
    }),
    { status: 200 }
  );
};
