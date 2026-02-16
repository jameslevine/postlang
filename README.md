# PostLang

A DSL for writing LinkedIn posts that don't suck.

## Why?

LinkedIn is drowning in AI-generated slop. PostLang enforces structure, requires evidence, and bans the patterns that make content feel like spam.

## Installation

```bash
npm install -g post-lang
```

Or use directly with npx:

```bash
npx post-lang posts/my-post.post
```

## Quick Start

Create a file `my-post.post`:

```postlang
# "Verification beats scale for AI reliability"
! "Test-time verification outperforms larger model training"
+ 22% | "in-distribution improvement"
+ 13% | "out-of-distribution improvement"
+ 45% | "real-world improvement"
> "Verify outputs at inference instead of training bigger models"
@ "Scaling Verification vs Policy Learning" | https://arxiv.org/abs/2602.12281 | "peer-reviewed preprint from arXiv"
```

Compile it:

```bash
postlang my-post.post
```

Output:

```
Verification beats scale for AI reliability.

Test-time verification outperforms larger model training.

Results:
- 22% in-distribution improvement
- 13% out-of-distribution improvement
- 45% real-world improvement

Verify outputs at inference instead of training bigger models.

Source: Scaling Verification vs Policy Learning
[peer-reviewed preprint from arXiv]
arxiv.org/abs/2602.12281
```

## Syntax

| Symbol | Name       | Required  | Description                          |
| ------ | ---------- | --------- | ------------------------------------ |
| `^`    | Limit      | No        | Custom character limits              |
| `#`    | Title      | Yes       | Hook (max 80 chars)                  |
| `!`    | Claim      | Yes       | Main point (max 150)                 |
| `+`    | Evidence   | Yes (1-5) | Data: `value \| "context"`           |
| `>`    | Insight    | Yes       | Takeaway (max 120)                   |
| `?`    | Context    | No        | Background info                      |
| `*`    | Credential | No        | Why you're qualified                 |
| `@`    | Source     | Yes       | Attribution with URL and credibility |

## CLI Commands

```bash
# Compile to stdout
postlang my-post.post

# Compile to file
postlang my-post.post output.txt

# Validate syntax
postlang --validate my-post.post

# Analyze existing LinkedIn post
postlang --analyze linkedin-post.txt

# Read from stdin
cat my-post.post | postlang --stdin
```

## Programmatic Usage

```typescript
import { compile, validate, analyze } from 'postlang';

// Compile PostLang to LinkedIn post
const result = compile(`
# "Your hook"
! "Your claim"
+ 22% | "improvement"
> "Your insight"
@ "Source" | https://example.com | "why this source is credible"
`);

if (result.success) {
  console.log(result.output);
}

// Validate PostLang syntax
const validation = validate(source);
console.log(validation.valid, validation.errors);

// Analyze plain text for PostLang compliance
const analysis = analyze(linkedinPost);
console.log(analysis.score, analysis.issues);
```

## What's Banned

PostLang rejects posts containing:

- Emojis
- Exclamation marks
- Questions as titles
- "Game-changer", "Revolutionary", "Exciting"
- "I'm thrilled to announce"
- "Let me tell you"
- "Here's the thing"
- And 20+ more AI slop phrases

## Documentation

- [Full Specification](docs/SPEC.md)
- [Article: Why PostLang?](docs/ARTICLE.md)

## License

MIT
