#!/usr/bin/env node
/**
 * PostLang CLI
 *
 * Usage:
 *   postlang <input.post> [output.txt]
 *   postlang --validate <input.post>
 *   postlang --analyze <input.txt>
 *   postlang --stdin
 */

import * as fs from 'fs';
import { compile, analyze, postlang } from './index';

function printUsage(): void {
  console.log(`
PostLang - A DSL for writing LinkedIn posts that don't suck

Usage:
  postlang <input.post> [output.txt]    Compile to LinkedIn post
  postlang --validate <input.post>      Validate PostLang syntax
  postlang --analyze <input.txt>        Analyze plain text post
  postlang --stdin                      Read from stdin

Options:
  --validate    Check PostLang syntax only
  --analyze     Check if plain text follows PostLang rules
  --stdin       Read from stdin instead of file
  --help, -h    Show this help
  --version     Show version

Examples:
  postlang posts/my-post.post
  postlang posts/my-post.post output/post.txt
  postlang --validate posts/my-post.post
  postlang --analyze output/linkedin-post.txt
  cat posts/my-post.post | postlang --stdin
`);
}

async function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => (data += chunk));
    process.stdin.on('end', () => resolve(data));
  });
}

function runValidate(source: string): void {
  const result = compile(source);

  console.log('PostLang Validation Report');
  console.log('==========================\n');

  const { ast } = postlang.parse(source);
  console.log('Structure:');
  console.log(`  # Title:      ${ast.title ? '✓' : '✗'}`);
  console.log(`  ! Claim:      ${ast.claim ? '✓' : '✗'}`);
  console.log(`  + Evidence:   ${ast.evidence?.length || 0} items`);
  console.log(`  > Insight:    ${ast.insight ? '✓' : '✗'}`);
  console.log(`  ? Context:    ${ast.context ? '✓' : '—'}`);
  console.log(`  * Credential: ${ast.credential ? '✓' : '—'}`);
  console.log(`  @ Source:     ${ast.source ? '✓' : '✗'}`);
  console.log('');

  if (ast.title || ast.claim || ast.insight) {
    console.log('Character Counts:');
    if (ast.title) console.log(`  # Title:    ${ast.title.length} chars`);
    if (ast.claim) console.log(`  ! Claim:    ${ast.claim.length} chars`);
    if (ast.insight) console.log(`  > Insight:  ${ast.insight.length} chars`);
    if (ast.context) console.log(`  ? Context:  ${ast.context.length} chars`);
    if (result.output)
      console.log(`  Total:      ${result.output.length} chars`);
    console.log('');
  }

  if (result.warnings.length > 0) {
    console.log('Warnings:');
    result.warnings.forEach((w) => console.log(`  ⚠ ${w}`));
    console.log('');
  }

  if (result.errors.length > 0) {
    console.log('Errors:');
    result.errors.forEach((e) => console.log(`  ✗ ${e}`));
    console.log('');
    console.log('Status: INVALID');
    process.exit(1);
  }

  console.log('Status: VALID');
}

function runAnalyze(text: string): void {
  const result = analyze(text);

  console.log('LinkedIn Post Analysis');
  console.log('======================\n');

  const scoreEmoji = result.score >= 80 ? '✓' : result.score >= 60 ? '⚠' : '✗';
  console.log(`Score: ${result.score}/100 ${scoreEmoji}\n`);

  console.log('Structure:');
  console.log(`  Title:      ${result.structure.hasTitle ? '✓' : '✗'}`);
  console.log(`  Claim:      ${result.structure.hasClaim ? '✓' : '✗'}`);
  console.log(
    `  Evidence:   ${result.structure.evidenceCount} items ${result.structure.hasEvidence ? '✓' : '✗'}`,
  );
  console.log(`  Insight:    ${result.structure.hasInsight ? '✓' : '✗'}`);
  console.log(`  Source:     ${result.structure.hasSource ? '✓' : '✗'}`);
  console.log('');

  if (result.issues.length > 0) {
    console.log('Issues:');
    result.issues.forEach((i) => console.log(`  ✗ ${i}`));
    console.log('');
  }

  if (result.warnings.length > 0) {
    console.log('Warnings:');
    result.warnings.forEach((w) => console.log(`  ⚠ ${w}`));
    console.log('');
  }

  if (result.suggestions.length > 0) {
    console.log('Suggestions:');
    result.suggestions.forEach((s) => console.log(`  → ${s}`));
    console.log('');
  }

  if (result.valid) {
    console.log('Status: VALID PostLang structure');
  } else {
    console.log('Status: Does NOT follow PostLang rules');
    process.exit(1);
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(0);
  }

  if (args.includes('--version')) {
    const pkg = require('../package.json');
    console.log(`postlang v${pkg.version}`);
    process.exit(0);
  }

  const validateMode = args.includes('--validate');
  const analyzeMode = args.includes('--analyze');
  const stdinMode = args.includes('--stdin');

  let source: string;
  let outputFile: string | null = null;

  if (stdinMode) {
    source = await readStdin();
  } else {
    const inputFile = args.find((a) => !a.startsWith('--'));
    if (!inputFile) {
      console.error('Error: No input file specified');
      process.exit(1);
    }

    const nonFlagArgs = args.filter((a) => !a.startsWith('--'));
    outputFile = nonFlagArgs[1] || null;

    if (!fs.existsSync(inputFile)) {
      console.error(`Error: File not found: ${inputFile}`);
      process.exit(1);
    }

    source = fs.readFileSync(inputFile, 'utf-8');
  }

  if (validateMode) {
    runValidate(source);
    return;
  }

  if (analyzeMode) {
    runAnalyze(source);
    return;
  }

  // Compile mode
  const result = compile(source);

  if (result.warnings.length > 0) {
    console.error('Warnings:');
    result.warnings.forEach((w) => console.error(`  - ${w}`));
    console.error('');
  }

  if (!result.success) {
    console.error('Compilation failed:');
    result.errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  if (outputFile) {
    fs.writeFileSync(outputFile, result.output!);
    console.log(`Compiled to: ${outputFile}`);
  } else {
    console.log(result.output);
  }
}

main();
