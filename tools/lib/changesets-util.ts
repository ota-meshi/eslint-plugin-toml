import getReleasePlan from "@changesets/get-release-plan";
import path from "path";

// eslint-disable-next-line n/no-unsupported-features/node-builtins -- It's only used in script
const dirname = import.meta.dirname;
/** Get new version string from changesets */
export async function getNewVersion(): Promise<string> {
  const releasePlan = await getReleasePlan(path.resolve(dirname, "../.."));

  return releasePlan.releases.find(({ name }) => name === "eslint-plugin-toml")!
    .newVersion;
}
