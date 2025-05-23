import { denoPlugins } from "jsr:@luca/esbuild-deno-loader";
import { build as esBuild, stop } from "npm:esbuild";
import { ensureFile } from "jsr:@std/fs";
import { encodeBase64, encodeHex } from "jsr:@std/encoding";

const buildClientScript = async (): Promise<Uint8Array> => {
  const esbuildResult = await esBuild({
    entryPoints: ["./deno/editor/main.tsx"],
    plugins: denoPlugins(),
    write: false,
    bundle: true,
    minify: true,
    format: "esm",
    target: ["chrome136"],
  });

  for (const esbuildResultFile of esbuildResult.outputFiles) {
    if (esbuildResultFile.path === "<stdout>") {
      return esbuildResultFile.contents;
    }
  }
  throw new Error("esbuild で <stdout> の出力を取得できなかった...");
};

const main = async (): Promise<void> => {
  const iconContent = await Deno.readFile(
    new URL("./icon.png", import.meta.url),
  );
  await writeTextFileWithLog(
    "./deno/icon.generated.json",
    JSON.stringify({
      content: encodeBase64(iconContent),
      hash: encodeHex(
        await crypto.subtle.digest("SHA-256", iconContent),
      ),
    }),
  );

  const scriptContent = await buildClientScript();

  await writeTextFileWithLog(
    "./deno/script.generated.json",
    JSON.stringify({
      content: new TextDecoder().decode(scriptContent),
      hash: encodeHex(
        await crypto.subtle.digest("SHA-256", scriptContent),
      ),
    }),
  );

  await stop();
};

const writeTextFileWithLog = async (
  path: string,
  content: string,
): Promise<void> => {
  console.log(path + " に書き込み中... " + content.length + "文字");
  await ensureFile(path);
  await Deno.writeTextFile(path, content);
  console.log(path.toString() + " に書き込み完了!");
};

main();
