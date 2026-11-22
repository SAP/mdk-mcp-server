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
    scheme;
    authority;
    path;
    query;
    fragment;
    fsPath;
    constructor(scheme, authority, path, query, fragment) {
        this.scheme = scheme;
        this.authority = authority;
        this.path = path;
        this.query = query;
        this.fragment = fragment;
        this.fsPath = path;
    }
    static file(fsPath) {
        return new Uri("file", "", fsPath, "", "");
    }
    static parse(value) {
        const url = new URL(value);
        return new Uri(url.protocol.replace(":", ""), url.hostname, url.pathname, url.search.replace("?", ""), url.hash.replace("#", ""));
    }
    toString() {
        return `${this.scheme}://${this.authority}${this.path}`;
    }
    with(change) {
        return new Uri(change.scheme ?? this.scheme, change.authority ?? this.authority, change.path ?? this.path, change.query ?? this.query, change.fragment ?? this.fragment);
    }
}
/**
 * Mock workspace API
 */
export const workspace = {
    workspaceFolders: [],
    getWorkspaceFolder(_uri) {
        // Simple implementation - assumes single workspace
        if (this.workspaceFolders.length > 0) {
            return this.workspaceFolders[0];
        }
        return undefined;
    },
    fs: {
        readFile(uri) {
            return new Promise((resolve, reject) => {
                fs.readFile(uri.fsPath, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(new Uint8Array(data));
                    }
                });
            });
        },
        writeFile(uri, content) {
            return new Promise((resolve, reject) => {
                const dir = path.dirname(uri.fsPath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                fs.writeFile(uri.fsPath, Buffer.from(content), err => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        },
        stat(uri) {
            return new Promise((resolve, reject) => {
                fs.stat(uri.fsPath, (err, stats) => {
                    if (err) {
                        reject(err);
                    }
                    else {
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
        readDirectory(uri) {
            return new Promise((resolve, reject) => {
                fs.readdir(uri.fsPath, { withFileTypes: true }, (err, files) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        const result = files.map(file => [
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
export function createMockVSCode(workspaceRoot) {
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
