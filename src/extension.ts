import * as vscode from "vscode";

const ORCHESTRATOR_NAME = "ui-console-shell";
const PROXY_NAME = "localdev proxy";

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

  vscode.window.terminals
    .filter((t) => t.name === ORCHESTRATOR_NAME || t.name === PROXY_NAME)
    .forEach((t) => t.dispose());

  const orchestrator = vscode.window.createTerminal({
    name: ORCHESTRATOR_NAME,
  });
  orchestrator.show(true);
  orchestrator.sendText(
    `cd "${orchestratorPath}" && pnpm local:react-app -e ${env} -a ${repoName}`
  );

  const proxy = vscode.window.createTerminal({
    name: PROXY_NAME,
    location: { parentTerminal: orchestrator },
  });
  proxy.show(true);
  proxy.sendText(`${PROXY_NAME} ${env}`);
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
    title: `Select ${ORCHESTRATOR_NAME} folder`,
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

  vscode.window.showInformationMessage(`${ORCHESTRATOR_NAME} path saved: ${path}`);
  return path;
}
