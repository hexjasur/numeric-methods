import fs from "node:fs";
import path from "node:path";

type WindowsPlatform = {
  signature: string;
  url: string;
};

type TauriUpdaterManifest = {
  version: string;
  notes: string;
  pub_date: string;
  platforms: Record<"windows-x86_64", WindowsPlatform>;
};

const [version, repository, tag, installerPath, signaturePath, outputPath] =
  process.argv.slice(2);
if (
  !version ||
  !repository ||
  !tag ||
  !installerPath ||
  !signaturePath ||
  !outputPath
) {
  throw new Error(
    "Usage: bun run scripts/generate-updater-manifest.ts <version> <repository> <tag> <installer> <signature> <output>",
  );
}
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
  throw new Error(`Invalid updater version: ${version}`);
}
if (
  !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository) ||
  tag !== `v${version}`
) {
  throw new Error("Repository or release tag is invalid.");
}

const installerName = path.basename(installerPath);
if (!installerName.toLowerCase().endsWith("-setup.exe")) {
  throw new Error(
    `Expected a Windows NSIS setup executable, received: ${installerName}`,
  );
}
const signature = fs.readFileSync(signaturePath, "utf8").trim();
if (!signature) throw new Error("Tauri updater signature is empty.");

const manifest: TauriUpdaterManifest = {
  version,
  notes: process.env.RELEASE_NOTES ?? "",
  pub_date: new Date().toISOString(),
  platforms: {
    "windows-x86_64": {
      signature,
      url: `https://github.com/${repository}/releases/download/${tag}/${encodeURIComponent(installerName)}`,
    },
  },
};

fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Generated Tauri updater manifest for ${tag}: ${outputPath}`);
