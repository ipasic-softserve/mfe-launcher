# mfe-launcher

Launch your MFE apps with `ui-console-shell` and `localdev proxy` easily from VSCode.

## Features

- Run your Micro Frontend (MFE) project with predefined commands for QA and DEV environments.
- Store and manage the path to your `ui-console-shell` folder once, no need to set it every time.
- Change your `ui-console-shell` folder path anytime via a dedicated command.

## Commands
- 🚀 run in QA — Runs `pnpm local:react-app -e qa -a <folder>` inside your orchestrator terminal and `localdev proxy qa`.
- 💻 run in DEV — Same as above but with `-e dev`.
- 📁 change ui-console-shell folder — Pick and save the path to your `ui-console-shell` orchestrator directory.

## How to Use
1. Open your MFE workspace folder in VSCode.
2. Run Change ui-console-shell folder the first time to set your orchestrator path.
3. Run MFE in QA or DEV to start terminals with the correct commands.

## Requirements
- `pnpm` installed and available in your system PATH.
- Your MFE repo opened as the current VSCode workspace folder.

## Extension Settings
- `mfeLauncher.orchestratorPath` - Stores the absolute path to your ui-console-shell orchestrator folder.

## Known Issues
- Only supports one workspace folder at a time.
- Terminals open side-by-side but terminal layout might depend on user’s VSCode settings.


## Release Notes
### 0.0.1
- Initial release with commands to launch MFE in QA or DEV.
- Folder picker and path persistence for orchestrator folder.
