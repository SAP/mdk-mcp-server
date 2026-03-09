/**
 * Mock implementation of VSCode API for standalone usage
 * This provides the minimal VSCode API surface needed by @sap/artifact-management
 */

import * as fs from "fs";
import * as path from "path";

/**
 * Mock Uri class compatible with VSCode's Uri
 */
export class Uri {
  public scheme: string;
  public authority: string;
  public path: string;
  public query: string;
  public fragment: string;
  public fsPath: string;

  constructor(
    scheme: string,
    authority: string,
    path: string,
    query: string,
    fragment: string
  ) {
    this.scheme = scheme;
    this.authority = authority;
    this.path = path;
    this.query = query;
    this.fragment = fragment;
    this.fsPath = path;
  }

  static file(fsPath: string): Uri {
    return new Uri("file", "", fsPath, "", "");
  }

  static parse(value: string): Uri {
    const url = new URL(value);
    return new Uri(
      url.protocol.replace(":", ""),
      url.hostname,
      url.pathname,
      url.search.replace("?", ""),
      url.hash.replace("#", "")
    );
  }

  toString(): string {
    return `${this.scheme}://${this.authority}${this.path}`;
  }

  with(change: {
    scheme?: string;
    authority?: string;
    path?: string;
    query?: string;
    fragment?: string;
  }): Uri {
    return new Uri(
      change.scheme ?? this.scheme,
      change.authority ?? this.authority,
      change.path ?? this.path,
      change.query ?? this.query,
      change.fragment ?? this.fragment
    );
  }
}

interface WorkspaceFolder {
  uri: Uri;
  name: string;
  index: number;
}

interface FileStat {
  type: number;
  ctime: number;
  mtime: number;
  size: number;
}

/**
 * Mock workspace API
 */
export const workspace = {
  workspaceFolders: [] as WorkspaceFolder[],

  getWorkspaceFolder(_uri: Uri): WorkspaceFolder | undefined {
    // Simple implementation - assumes single workspace
    if (this.workspaceFolders.length > 0) {
      return this.workspaceFolders[0];
    }
    return undefined;
  },

  fs: {
    readFile(uri: Uri): Promise<Uint8Array> {
      return new Promise((resolve, reject) => {
        fs.readFile(uri.fsPath, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(new Uint8Array(data));
          }
        });
      });
    },

    writeFile(uri: Uri, content: Uint8Array): Promise<void> {
      return new Promise((resolve, reject) => {
        const dir = path.dirname(uri.fsPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFile(uri.fsPath, Buffer.from(content), err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    },

    stat(uri: Uri): Promise<FileStat> {
      return new Promise((resolve, reject) => {
        fs.stat(uri.fsPath, (err, stats) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              type: stats.isDirectory() ? 2 : 1, // 1 = File, 2 = Directory
              ctime: stats.ctimeMs,
              mtime: stats.mtimeMs,
              size: stats.size,
            });
          }
        });
      });
    },

    readDirectory(uri: Uri): Promise<[string, number][]> {
      return new Promise((resolve, reject) => {
        fs.readdir(uri.fsPath, { withFileTypes: true }, (err, files) => {
          if (err) {
            reject(err);
          } else {
            const result: [string, number][] = files.map(file => [
              file.name,
              file.isDirectory() ? 2 : 1, // 1 = File, 2 = Directory
            ]);
            resolve(result);
          }
        });
      });
    },
  },
};

/**
 * Create a mock VSCode API object
 */
export function createMockVSCode(workspaceRoot?: string) {
  if (workspaceRoot) {
    workspace.workspaceFolders = [
      {
        uri: Uri.file(workspaceRoot),
        name: path.basename(workspaceRoot),
        index: 0,
      },
    ];
  }

  return {
    Uri,
    workspace,
    FileType: {
      Unknown: 0,
      File: 1,
      Directory: 2,
      SymbolicLink: 64,
    },
  };
}
