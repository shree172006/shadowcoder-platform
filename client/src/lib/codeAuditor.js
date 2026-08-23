/**
 * ShadowCoder Client-Side AST & Syntax Auditor
 * Parses files, checks for syntax errors, JSON corruption, and runs deterministic test audits.
 */

export function auditWorkspaceFiles(files = {}) {
  const syntaxErrors = [];
  const analyzedFiles = {};

  for (const [filePath, content] of Object.entries(files)) {
    if (!content || typeof content !== 'string') continue;

    // 1. JSON File Validation
    if (filePath.endsWith('.json')) {
      try {
        JSON.parse(content);
        analyzedFiles[filePath] = { valid: true, type: 'json' };
      } catch (err) {
        syntaxErrors.push({
          file: filePath,
          line: 1,
          message: `JSON SyntaxError: ${err.message}`,
        });
        analyzedFiles[filePath] = { valid: false, error: err.message };
      }
      continue;
    }

    // 2. JavaScript / JSX Syntax Validation
    if (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.ts')) {
      try {
        // Strip ES module imports/exports for client-side Function parsing
        const strippedCode = content
          .replace(/^import\s+.*?['"].*?['"];?/gm, '// import stripped')
          .replace(/^export\s+(default\s+)?/gm, '');

        // Syntax checking using new Function compiler
        new Function(`return (async function() {\n${strippedCode}\n});`);
        analyzedFiles[filePath] = { valid: true, type: 'javascript' };
      } catch (err) {
        // Extract line number if possible
        const lines = content.split('\n');
        let errorLine = 1;

        // Try to find the line that causes the syntax error
        for (let i = 1; i <= lines.length; i++) {
          const slice = lines.slice(0, i).join('\n')
            .replace(/^import\s+.*?['"].*?['"];?/gm, '//')
            .replace(/^export\s+(default\s+)?/gm, '');
          try {
            new Function(`return (async function() {\n${slice}\n});`);
          } catch (sliceErr) {
            errorLine = i;
            break;
          }
        }

        syntaxErrors.push({
          file: filePath,
          line: errorLine,
          message: `SyntaxError: ${err.message}`,
          snippet: lines[errorLine - 1] || '',
        });
        analyzedFiles[filePath] = { valid: false, error: err.message };
      }
    }
  }

  return {
    isValid: syntaxErrors.length === 0,
    syntaxErrors,
    analyzedFiles,
  };
}
