import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const INPUT_DIR = "inputs";
const OUTPUT_DIR = "outputs";

if (!existsSync(INPUT_DIR)) {
  mkdirSync(INPUT_DIR);
}

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR);
}

Bun.serve({
  port: 3000,

  async fetch(req) {
    const url = new URL(req.url);

    if (req.method === "POST" && url.pathname === "/upload") {
      try {
        const formData = await req.formData();

        const image = formData.get("image");
        const width = formData.get("width");
        const height = formData.get("height");

        if (!(image instanceof File)) {
          return Response.json({ error: "Image is required" }, { status: 400 });
        }

        if (!width || !height) {
          return Response.json(
            { error: "Width and height are required" },
            { status: 400 },
          );
        }

        const inputFileName = `input-${Date.now()}.jpg`;
        const outputFileName = `output-${Date.now()}.jpg`;

        const inputPath = join(INPUT_DIR, inputFileName);
        const outputPath = join(OUTPUT_DIR, outputFileName);

        const imageBuffer = Buffer.from(await image.arrayBuffer());

        writeFileSync(inputPath, imageBuffer);

        const process = Bun.spawn([
          "cargo",
          "run",
          "--manifest-path",
          "../hammer/Cargo.toml",
          inputPath,
          outputPath,
          width.toString(),
          height.toString(),
        ]);

        const exitCode = await process.exited;

        if (exitCode !== 0) {
          return Response.json(
            { error: "Image processing failed" },
            { status: 500 },
          );
        }

        return Response.json({
          success: true,
          output: outputPath,
        });
      } catch (error) {
        console.error(error);

        return Response.json(
          { error: "Internal server error" },
          { status: 500 },
        );
      }
    }

    return new Response("PixelForge API");
  },
});

console.log("Dock running on http://localhost:3000");
