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

const [
  version,
  repository,
  tag,
  installerPath,
  signaturePath,
  installerDownloadUrl,
  outputPath,
] = process.argv.slice(2);
if (
  !version ||
  !repository ||
  !tag ||
  !installerPath ||
  !signaturePath ||
  !installerDownloadUrl ||
  !outputPath
) {
  throw new Error(
    "Usage: bun run scripts/generate-updater-manifest.ts <version> <repository> <tag> <installer> <signature> <installer-download-url> <output>",
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
const downloadUrl = new URL(installerDownloadUrl);
const expectedReleasePath = `/${repository}/releases/download/${tag}/`;
if (
  downloadUrl.origin !== "https://github.com" ||
  !downloadUrl.pathname.startsWith(expectedReleasePath) ||
  !downloadUrl.pathname.toLowerCase().endsWith("-setup.exe")
) {
  throw new Error(
    "Expected the published GitHub release URL for the Windows NSIS installer.",
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
      url: installerDownloadUrl,
    },
  },
};

fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Generated Tauri updater manifest for ${tag}: ${outputPath}`);
