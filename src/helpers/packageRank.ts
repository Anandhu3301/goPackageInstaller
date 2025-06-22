import axios from "axios";




export function extractRepoPath(pkgUrl : string) : string | null {
      const match = pkgUrl.match(/github\.com\/([^/]+\/[^/]+)/); 
      return match ? match[1] : null;
}

export async function getRepoStars(repoPath:string) : Promise<number> {
     const url = `https://api.github.com/repos/${repoPath}`;
     try {
        const res = await axios.get(url, {
            headers : {
               'Accept': 'application/vnd.github.v3+json',
               'Authorization': `Bearer ${process.env.GITHUB_TOKEN }`,
            },
        });
        return res.data.stargazers_count || 0;
     } catch(err : any) {
        console.warn(`Github fetch failed for ${repoPath}`,err.message);
        return 0;
     }
}

