import * as vscode from 'vscode';
import axios from "axios";

export async function versionFinder(importPath: string) {
  if (importPath !== null) {
    return versionGetter(importPath);
  }
}

async function versionGetter(importPath: string): Promise<string[]> {
  var proxyUrl = `https://proxy.golang.org/github.com/${importPath}/@v/list`;
  try {
    const response = await axios.get(proxyUrl, {
      headers: {
        Accept: "text/plain",
      },
    });
    const versions = response.data.split("\n").filter(Boolean);
    return versions;
  } catch (err: any) {
    console.error("Failed to fetch versions:", err.message);
    return [];
  }
}

export async function terminalExecutor(repoPath: string, version: string | null) {
   if (version !== null) {
    const terminal = vscode.window.createTerminal("Go Installer");
    terminal.show(true);
    terminal.sendText(`go get github.com/${repoPath}/${version}`);
   } else {
    const terminal = vscode.window.createTerminal("Go Installer");
    terminal.show(true);
    terminal.sendText(`go get -u github.com/${repoPath}`);
   }
}
