import getReleasePlan from "@changesets/get-release-plan";
import path from "path";

const dirname = import.meta.dirname;
/** Get new version string from changesets */
export async function getNewVersion(): Promise<string> {
  const releasePlan = await getReleasePlan(path.resolve(dirname, "../.."));

  return releasePlan.releases.find(({ name }) => name === "eslint-plugin-toml")!
    .newVersion;
}
