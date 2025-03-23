// app/api/upload/route.ts
import { NextRequest } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { mkdirSync, existsSync } from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("images") as File[];

  if (files.length > 5) {
    return new Response(JSON.stringify({ error: "Maximum 5 files allowed." }), {
      status: 400,
    });
  }

  const uploadDir = path.join(process.cwd(), "public/uploads");

  if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

  const urls: string[] = [];

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);
    urls.push(`/uploads/${filename}`);
  }

  return new Response(JSON.stringify({ urls }), { status: 200 });
}
