/**
 * PostLang - A DSL for writing LinkedIn posts that don't suck
 *
 * @example
 * ```typescript
 * import { compile, validate, analyze } from 'postlang';
 *
 * const source = `
 * # "Your hook"
 * ! "Your claim"
 * + 22% | "improvement"
 * > "Your insight"
 * @ "Source" | https://example.com
 * `;
 *
 * const result = compile(source);
 * if (result.success) {
 *   console.log(result.output);
 * }
 * ```
 */

export {
  PostLangCompiler,
  postlang,
  PostLangAST,
  PostLangLimits,
  CompileResult,
} from './compiler';

export { PostLangAnalyzer, analyzer, AnalysisResult } from './analyzer';

// Convenience functions
import { postlang } from './compiler';
import { analyzer } from './analyzer';

/**
 * Compile PostLang source to LinkedIn post
 */
export function compile(source: string) {
  return postlang.compile(source);
}

/**
 * Parse PostLang source to AST
 */
export function parse(source: string) {
  return postlang.parse(source);
}

/**
 * Validate PostLang source
 */
export function validate(source: string) {
  const { ast, errors: parseErrors } = postlang.parse(source);
  if (parseErrors.length > 0) {
    return { valid: false, errors: parseErrors, warnings: [] };
  }
  const { errors, warnings } = postlang.validate(ast);
  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Analyze plain text LinkedIn post for PostLang compliance
 */
export function analyze(text: string) {
  return analyzer.analyze(text);
}
