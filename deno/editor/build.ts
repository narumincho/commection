import { fromFileUrl } from "https://deno.land/std@0.191.0/path/posix.ts";
import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.8.1/mod.ts";
import { build as esBuild } from "https://deno.land/x/esbuild@v0.18.0/mod.js";
import { ensureFile } from "https://deno.land/std@0.191.0/fs/mod.ts";
import { toHashString } from "https://deno.land/std@0.191.0/crypto/mod.ts";

type BuildClientResult = {
  readonly scriptHash: string;
  readonly scriptContent: string;
};

const buildClientEditor = async (): Promise<BuildClientResult> => {
  const esbuildResult = await esBuild({
    entryPoints: [fromFileUrl(import.meta.resolve("./main.tsx"))],
    plugins: denoPlugins(),
    write: false,
    bundle: true,
    format: "esm",
    target: ["chrome114"],
  });

  for (const esbuildResultFile of esbuildResult.outputFiles) {
    if (esbuildResultFile.path === "<stdout>") {
      const hash = toHashString(
        await crypto.subtle.digest("SHA-256", esbuildResultFile.contents),
        "hex"
      );
      console.log("js 発見");
      const scriptContent = new TextDecoder().decode(
        esbuildResultFile.contents
      );

      return {
        scriptHash: hash,
        scriptContent: scriptContent,
      };
    }
  }
  throw new Error("esbuild で <stdout> の出力を取得できなかった...");
};

const main = async (): Promise<void> => {
  const clientBuildResult = await buildClientEditor();
  console.log("clientEditor のビルドデータ生成完了");
  await writeTextFileWithLog(
    new URL("../dist.json", import.meta.url),
    JSON.stringify(clientBuildResult)
  );
  console.log("ファイルに保存した");
  Deno.exit();
};

const writeTextFileWithLog = async (
  path: URL,
  content: string
): Promise<void> => {
  console.log(path.toString() + " に書き込み中... " + content.length + "文字");
  await ensureFile(path);
  await Deno.writeTextFile(path, content);
  console.log(path.toString() + " に書き込み完了!");
};

main();
