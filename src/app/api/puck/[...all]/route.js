import { puckHandler } from "@puckeditor/cloud-client";

export async function POST(request) {
  return puckHandler(request, {
    ai: {
      context: "You are building pages for a modern website. Create clean, professional, and responsive page layouts using the available components.",
    },
  });
}
