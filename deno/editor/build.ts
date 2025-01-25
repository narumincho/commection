import { fromFileUrl } from "jsr:@std/path";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader";
import { build as esBuild, stop } from "npm:esbuild";
import { ensureFile } from "jsr:@std/fs";
import { encodeBase64, encodeHex } from "jsr:@std/encoding";

type BuildClientResult = {
  readonly scriptHash: string;
  readonly scriptContent: string;
  readonly iconHash: string;
  readonly iconBase64Content: string;
};

const buildClientScript = async (): Promise<Uint8Array> => {
  const esbuildResult = await esBuild({
    entryPoints: ["./deno/editor/main.tsx"],
    plugins: denoPlugins(),
    write: false,
    bundle: true,
    format: "esm",
    target: ["chrome114"],
  });

  for (const esbuildResultFile of esbuildResult.outputFiles) {
    if (esbuildResultFile.path === "<stdout>") {
      return esbuildResultFile.contents;
    }
  }
  throw new Error("esbuild で <stdout> の出力を取得できなかった...");
};

const buildClientEditor = async (): Promise<BuildClientResult> => {
  const scriptContent = await buildClientScript();
  const iconContent = await Deno.readFile(
    new URL("./icon.png", import.meta.url),
  );

  return {
    scriptHash: encodeHex(
      await crypto.subtle.digest("SHA-256", scriptContent),
    ),
    scriptContent: new TextDecoder().decode(scriptContent),
    iconHash: encodeHex(
      await crypto.subtle.digest("SHA-256", iconContent),
    ),
    iconBase64Content: encodeBase64(iconContent),
  };
};

const main = async (): Promise<void> => {
  const clientBuildResult = await buildClientEditor();
  console.log("clientEditor のビルドデータ生成完了");
  await writeTextFileWithLog(
    new URL("../dist.json", import.meta.url),
    JSON.stringify(clientBuildResult),
  );
  console.log("ファイルに保存した");
  await stop();
};

const writeTextFileWithLog = async (
  path: URL,
  content: string,
): Promise<void> => {
  console.log(path.toString() + " に書き込み中... " + content.length + "文字");
  await ensureFile(path);
  await Deno.writeTextFile(path, content);
  console.log(path.toString() + " に書き込み完了!");
};

main();
