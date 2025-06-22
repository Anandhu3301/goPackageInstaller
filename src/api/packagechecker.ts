import * as cheerio from "cheerio";
import axios from "axios";
import { arrayCharacterChecker } from "../helpers/charcorrector";
import { extractRepoPath, getRepoStars } from "../helpers/packageRank";

export async function checkingPackage(
  keyword: string
): Promise<string[] | undefined> {
  const url = `https://pkg.go.dev/search?q=${encodeURIComponent(keyword)}`;
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });
    const $ = cheerio.load(response.data);
    const results: string[] = [];
    $("a[href^='/github.com/']").each((_, element) => {
      const href = $(element).attr("href");
      if (href && !results.includes(href)) {
        results.push(`https://pkg.go.dev${href}`);
      }
    });

    if (results.length === 0) {
      return undefined;
    }
    var arrayAfterCheck = arrayCharacterChecker(results);
    const rankedPackages = await Promise.all(arrayAfterCheck.map(async (pkgUrl) => {
        const repo = extractRepoPath(pkgUrl);
        const stars = repo ? await getRepoStars(repo) : 0;
        return {url : repo, stars};
    }));

    rankedPackages.sort((a,b) => b.stars - a.stars);
    const topResults: string[] = [];
    const seen = new Set<string>();
    for (const pkg of rankedPackages) {
      if(pkg.url && !seen.has(pkg.url)) {
        seen.add(pkg.url);
        topResults.push(`${pkg.url} ⭐ ${pkg.stars}`);
      }
    }
    return topResults;

  } catch (err: any) {
    console.error("Error fetching or parsing:", err.message);
    return err;
  }
}
