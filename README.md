# Welcome to @sap/mdk-mcp-server

[![REUSE status](https://api.reuse.software/badge/github.com/sap/mdk-mcp-server)](https://api.reuse.software/info/github.com/sap/mdk-mcp-server)



> [!NOTE]
> This project is in beta state.



## About This Project

A Model Context Protocol (MCP) server for the [SAP Mobile Developmet Kit(MDK)]
Use it for AI-assisted development of MDK applications (_agentic coding_).



## Table of Contents

- [About This Project](#about-this-project)
- [Requirements](#requirements)
- [Setup](#setup)
  - [Usage in VS Code](#usage-in-vs-code)
  - [Usage in opencode](#usage-in-opencode)
  - [Prepare project folder in VS Code](#prepare-project-folder-in-vs-code)
- [Available Tools](#available-tools)
  - [`mdk-gen-project`](#mdk-gen-project)
  - [`mdk-gen-i18n`](#mdk-gen-i18n)
  - [`mdk-gen-databinding-page`](#mdk-gen-databinding-page)
  - [`mdk-gen-layout-page`](#mdk-gen-layout-page)
  - [`mdk-gen-entity`](#mdk-gen-entity)
  - [`mdk-gen-action`](#mdk-gen-action)
  - [`mdk-build`](#mdk-build)
  - [`mdk-deploy`](#mdk-deploy)
  - [`mdk-show-qrcode`](#mdk-show-qrcode)
  - [`mdk-migrate`](#mdk-migrate)
  - [`mdk-validate`](#mdk-validate)
  - [`mdk-search-documentation`](#mdk-search-documentation)
  - [`mdk-get-component-documentation`](#mdk-get-component-documentation)
  - [`mdk-get-property-documentation`](#mdk-get-property-documentation)
  - [`mdk-get-example`](#mdk-get-example)
  - [`mdk-open-mobile-app-editor`](#mdk-open-mobile-app-editor)
- [Development](#development)
  - [`Running Tests`](#running-tests)
  - [`Building`](#building)
  - [`Running Linting`](#running-linting)
- [Support, Feedback, Contributing](#support-feedback-contributing)
- [Security / Disclosure](#security--disclosure)
- [Code of Conduct](#code-of-conduct)
- [Licensing](#licensing)
- [Acknowledgments](#acknowledgments)



## Requirements

See [Getting Started](https://help.sap.com/docs/MDK) on how to jumpstart your development and grow as you go with SAP Mobile Developmet Kit(MDK).



## Setup

```sh
npm i -g yo@4.3.1


For installing the MDK MCP server, we offer two options: 

1. Use npm to install it from the public npmjs registry at @sap/mdk-mcp-server. 
 
npm install -g @sap/mdk-mcp-server 
 
2. Clone the open-source code repository at https://github.com/SAP/mdk-mcp-server, and use npm to install. 
 
git clone https://github.com/SAP/mdk-mcp-server.git 
cd mdk-mcp-server 
npm i --include=optional 
npm i -g @sap/mdk-mcp-server@. 

```


To start from a new project, create a empty project folder in your VS Code workspace first.


If you want to create a .service.metadata file that contains the mobile service app and the OData specification informations in your project folder.

1. Install Mobile development kit extension for Visual Studio Code 1.32.0 in your Visual Studio Code.
2. Execute "cf login --sso" in a terminal window.
3. Press "Command+Shift+P" and then select "MDK: Open Mobile App Editor" command.
4. Create/Select a new/existing mobile app.
5. Select a destination.
6. Click "Add App to Project" button.


This will provide the command `mdk-mcp` to start the MDK MCP server.

Configure your MCP client (Cline, opencode, Claude Code, GitHub Copilot, etc.) to start the server using the `mdk-mcp` command.

### Usage in VS Code

Example for VS Code extension [Cline](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev):

Configure mdk-mcp in cline_mcp_settings.json
```json
{
  "mcpServers": {
    "mdk-mcp": {
      "type": "stdio",
      "command": "mdk-mcp",
      "args": []
    }
  }
}
```

Configure API Provider and related settings and Model in API Configuration Settings of Cline.

See [VS Code Marketplace](https://marketplace.visualstudio.com/search?term=tag%3Aagent&target=VSCode&category=All%20categories&sortBy=Relevance) for more agent extensions.

### Usage in opencode

Example for [opencode](https://github.com/sst/opencode):
```json
{
  "mcp": {
    "mdk-mcp": {
      "type": "local",
      "command": ["mdk-mcp"],
      "enabled": true
    }
  }
}
```

### Rules

The following rules help the LLM use the server correctly:

```markdown
- Don't generate .service.metadata file
- Don't generate .xml file in `Services` folder.
- Don't change .project.json file.
```

Add these rules to your existing global or project-specific [`AGENTS.md`](https://agents.md/) (specifics may vary based on respective MCP client).


## Available Tools

> [!NOTE]
> Tools are meant to be used by AI models and do not constitute a stable API.

The server provides these tools for MDK development:

### `mdk-gen-project`

Generates a new MDK project in the current directory.

Parameters:
`folderRootPath*` The path of the current project root folder.

`templateType*` The type of the template to be used.

`oDataEntitySets*` The OData entity sets are relevant to the user prompt, separated by commas.

`offline*` Whether to generate the project in offline mode, set to false unless offline is explicitly specified.

### `mdk-gen-i18n`

Returns a prompt to be used for generating i18n files for the MDK application. You can describe texts, labels, messages.

Parameters:

`folderRootPath*` The path of the current project root folder.

### `mdk-gen-databinding-page`

Returns a prompt to be used for generating a databinding-enabled MDK page. Using the prompt, a .page file is created that describes the page layout, controls and data bindings.

Parameters:

`folderRootPath*` The path of the current project root folder.

`controlType*` The type of the control to be used in the MDK page.

### `mdk-gen-layout-page`

Generates a layout-based MDK page. You can describe the page layout, controls. It saves the response to .page file.

Parameters:

`folderRootPath*` The path of the current project root folder.

`layoutType*` The type of the layout to be used in the MDK page.

### `mdk-gen-entity`

Generates CRUD or List Detail template metadata for a new entity set.

Parameters:

`folderRootPath*` The path of the current project root folder.

`templateType*` The type of the entity template to be used.

`oDataEntitySets*` The OData entity sets are relevant to the user prompt, separated by commas.

### `mdk-gen-action`

Returns a prompt to be used for generating an MDK action. Using the prompt, a .action file will be created that describes the action type and data bindings.

Parameters:

`folderRootPath*` The path of the current project root folder.

`actionType*` The type of the action.

### `mdk-build`

Build a MDK project.

Parameters:

`folderRootPath*` The path of the current project root folder.

### `mdk-deploy`

Deploy a MDK project to the Mobile Services.

Parameters:

`folderRootPath*` The path of the current project root folder.

### `mdk-show-qrcode`

Show QR code for a MDK application.

Parameters:

`folderRootPath*` The path of the current project root folder.

### `mdk-migrate`
Migrate a MDK project to the latest MDK version.

Parameters:

`folderRootPath*` The path of the current project root folder.

### `mdk-validate`

Validate a MDK project.

Parameters:

`folderRootPath*` The path of the current project root folder.

### `mdk-search-documentation`
Returns the top N results from MDK documentation by semantic search, sorted by relevance.

Parameters:

`query*` Search query string.

`N` Number of results to return.

### `mdk-get-component-documentation`

Returns the schema of an MDK component based on the name of the component.

Parameters:

`component_name*` Name of the component.

### `mdk-get-property-documentation`

Returns the documentation of a specific property of an MDK component.

Parameters:

`component_name*` Name of the component.

`property_name*` Name of the property.

### `mdk-get-example`

Returns an example usage of an MDK component.

Parameters:

`component_name*` Name of the component.

### `mdk-open-mobile-app-editor`

Instruct how to open the Mobile App Editor to create .service.metadata file.

Parameters:

None required.


## Development

### Running Tests

```bash
npm test
```

### Building

```bash
npm run build
```

### Running Linting

```bash
npm run lint:all
```



## Support, Feedback, Contributing

This project is open to feature requests/suggestions, bug reports, and so on, via [GitHub issues](https://github.com/sap/mdk-mcp-server/issues). Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](CONTRIBUTING.md).



## Security / Disclosure

If you find any bug that may be a security problem, please follow our instructions at [in our security policy](https://github.com/sap/mdk-mcp-server/security/policy) on how to report it. Please don't create GitHub issues for security-related doubts or problems.



## Code of Conduct

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone. By participating in this project, you agree to abide by its [Code of Conduct](https://github.com/cap-js/.github/blob/main/CODE_OF_CONDUCT.md) at all times.



## Licensing

Copyright 2025 SAP SE or an SAP affiliate company and @sap/mdk-mcp-server contributors. Please see our [LICENSE](LICENSE) for copyright and license information. Detailed information including third-party components and their licensing/copyright information is available [via the REUSE tool](https://api.reuse.software/info/github.com/sap/mdk-mcp-server).



## Acknowledgments

- **@huggingface/transformers.js** is used to compare the output of the WordPiece tokenizer.
- **@modelcontextprotocol/sdk** provides the SDK for MCP.
