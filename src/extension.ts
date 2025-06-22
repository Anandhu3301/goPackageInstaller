import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import dotenv from "dotenv";
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log("✅ .env loaded:", process.env.GITHUB_TOKEN?.slice(0, 8));
} else {
  console.warn("❌ .env not found at:", envPath);
}
import { characterChecker } from "./helpers/charcorrector";
import { checkingPackage } from "./api/packagechecker";
import { terminalExecutor, versionFinder } from "./helpers/terminalrunner";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "go-package-installer" is now active!'
  );

  const disposable = vscode.commands.registerCommand(
    "go-package-installer.helloWorld",
    async () => {
      const userInput = await vscode.window.showInputBox({
        placeHolder: "Enter GO package Keyword⚡",
      });

      if (userInput) {
        var keyword: string = characterChecker(userInput) as string;
        let resultpackages: string[] | undefined;
        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: `Searching for "${userInput}"`,
            cancellable: false,
          },
          async (progress) => {
            resultpackages = await checkingPackage(keyword);
          }
        );
        if (Array.isArray(resultpackages) && resultpackages.length > 0) {
          const selected = await vscode.window.showQuickPick(resultpackages, {
            placeHolder: "Select a Go package",
          });
          if (selected) {
            const url = selected.split(" ⭐ ")[0];
            let versions: string[] | undefined;
            await vscode.window.withProgress(
              {
                location: vscode.ProgressLocation.Notification,
                title: `Searching for "${url}"`,
                cancellable: false,
              },
              async (progress) => {
                versions = await versionFinder(url);
              }
            );
            if (Array.isArray(versions) && versions.length > 0) {
              const selectVersion = await vscode.window.showQuickPick(
                versions,
                {
                  placeHolder: "Choose Package Version",
                }
              );
              if (selectVersion) {
                terminalExecutor(url, selectVersion);
              } else {
                vscode.window.showErrorMessage("Invalid package version");
              }
            } else {
              vscode.window.showErrorMessage("no version found");
            }
          }
        } else {
          vscode.window.showErrorMessage("no package found");
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
