import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("mfeLauncher.run.qa", () =>
      runOrchestrator("qa")
    ),
    vscode.commands.registerCommand("mfeLauncher.run.dev", () =>
      runOrchestrator("dev")
    ),
    vscode.commands.registerCommand(
      "mfeLauncher.changeOrchestratorPath",
      async () => {
        await promptAndSaveOrchestratorPath();
      }
    )
  );
}

async function runOrchestrator(env: string) {
  const orchestratorPath = await getOrchestratorPath();
  if (!orchestratorPath) {
    return;
  }

  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) {
    vscode.window.showErrorMessage("No workspace folder is open.");
    return;
  }

  const repoName = folder.name;

  const orchestrator = vscode.window.createTerminal({
    name: "ui-console-shell",
  });
  orchestrator.show(true);
  orchestrator.sendText(
    `cd "${orchestratorPath}" && pnpm local:react-app -e ${env} -a ${repoName}`
  );

  const localdev = vscode.window.createTerminal({
    name: "localdev proxy",
    location: { parentTerminal: orchestrator },
  });
  localdev.show(true);
  localdev.sendText(`localdev proxy ${env}`);
}

export function deactivate() {}

async function getOrchestratorPath(): Promise<string | undefined> {
  const config = vscode.workspace.getConfiguration("mfeLauncher");
  let path = config.get<string>("orchestratorPath");

  if (!path) {
    path = await promptAndSaveOrchestratorPath();
  }

  return path;
}

async function promptAndSaveOrchestratorPath(): Promise<string | undefined> {
  const picked = await vscode.window.showOpenDialog({
    canSelectFolders: true,
    canSelectFiles: false,
    canSelectMany: false,
    title: "Select ui-console-shell folder",
    openLabel: "Use this folder",
  });

  if (!picked || picked.length === 0) {
    vscode.window.showWarningMessage("No folder selected.");
    return undefined;
  }

  const path = picked[0].fsPath;
  const config = vscode.workspace.getConfiguration("mfeLauncher");
  await config.update(
    "orchestratorPath",
    path,
    vscode.ConfigurationTarget.Global
  );

  vscode.window.showInformationMessage(`ui-console-shell path saved: ${path}`);
  return path;
}
