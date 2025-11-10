<!-- omit in toc -->
# Contributing to Rushed AI

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions. 🎉

> And if you like the project, but just don't have time to contribute, that's fine. There are other easy ways to support the project and show your appreciation, which we would also be very happy about:
> - Star the project
> - Tweet about it
> - Refer this project in your project's readme
> - Mention the project at local meetups and tell your friends/colleagues

<!-- omit in toc -->
## Table of Contents

- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
    - [Prerequisites](#prerequisites)
    - [Setting Up Development Environment](#setting-up-development-environment)
  - [Improving The Documentation](#improving-the-documentation)
- [Styleguides](#styleguides)
  - [Code Style](#code-style)
  - [Component Guidelines](#component-guidelines)
  - [Git Workflow](#git-workflow)
  - [Commit Messages](#commit-messages)
  - [Credits](#credits)



## I Have a Question

> If you want to ask a question, we assume that you have read the available [Documentation](https://github.com/brayanj4y/rushed-ai?tab=readme-ov-file#rushed-documentation).

Before you ask a question, it is best to search for existing [Issues](https://github.com/brayanj4y/rushed-ai/issues) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue. It is also advisable to search the internet for answers first.

If you then still feel the need to ask a question and need clarification, we recommend the following:

- Open an [Issue](https://github.com/brayanj4y/rushed-ai/issues/new).
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant.

We will then take care of the issue as soon as possible.

<!--
You might want to create a separate issue tag for questions and include it in this description. People should then tag their issues accordingly.

Depending on how large the project is, you may want to outsource the questioning, e.g. to Stack Overflow or Gitter. You may add additional contact and information possibilities:
- IRC
- Slack
- Gitter
- Stack Overflow tag
- Blog
- FAQ
- Roadmap
- E-Mail List
- Forum
-->

## I Want To Contribute

> ### Legal Notice <!-- omit in toc -->
> When contributing to this project, you must agree that you have authored 100% of the content, that you have the necessary rights to the content and that the content you contribute may be provided under the project licence.

### Reporting Bugs

<!-- omit in toc -->
#### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more information. Therefore, we ask you to investigate carefully, collect information and describe the issue in detail in your report. Please complete the following steps in advance to help us fix any potential bug as fast as possible.

- Make sure that you are using the latest version.
- Determine if your bug is really a bug and not an error on your side e.g. using incompatible environment components/versions (Make sure that you have read the [documentation](https://github.com/brayanj4y/rushed-ai?tab=readme-ov-file#rushed-documentation). If you are looking for support, you might want to check [this section](#i-have-a-question)).
- To see if other users have experienced (and potentially already solved) the same issue you are having, check if there is not already a bug report existing for your bug or error in the [bug tracker](https://github.com/brayanj4y/rushed-ai/issues?q=label%3Abug).
- Also make sure to search the internet (including Stack Overflow) to see if users outside of the GitHub community have discussed the issue.
- Collect information about the bug:
- Stack trace (Traceback)
- OS, Platform and Version (Windows, Linux, macOS, x86, ARM)
- Version of the interpreter, compiler, SDK, runtime environment, package manager, depending on what seems relevant.
- Possibly your input and the output
- Can you reliably reproduce the issue? And can you also reproduce it with older versions?

<!-- omit in toc -->
#### How Do I Submit a Good Bug Report?

> You must never report security related issues, vulnerabilities or bugs including sensitive information to the issue tracker, or elsewhere in public. Instead sensitive bugs must be sent by email to .
<!-- You may add a PGP key to allow the messages to be sent encrypted as well. -->

We use GitHub issues to track bugs and errors. If you run into an issue with the project:

- Open an [Issue](https://github.com/brayanj4y/rushed-ai/issues/new). (Since we can't be sure at this point whether it is a bug or not, we ask you not to talk about a bug yet and not to label the issue.)
- Explain the behavior you would expect and the actual behavior.
- Please provide as much context as possible and describe the *reproduction steps* that someone else can follow to recreate the issue on their own. This usually includes your code. For good bug reports you should isolate the problem and create a reduced test case.
- Provide the information you collected in the previous section.

Once it's filed:

- The project team will label the issue accordingly.
- A team member will try to reproduce the issue with your provided steps. If there are no reproduction steps or no obvious way to reproduce the issue, the team will ask you for those steps and mark the issue as `needs-repro`. Bugs with the `needs-repro` tag will not be addressed until they are reproduced.
- If the team is able to reproduce the issue, it will be marked `needs-fix`, as well as possibly other tags (such as `critical`), and the issue will be left to be [implemented by someone](#your-first-code-contribution).

<!-- You might want to create an issue template for bugs and errors that can be used as a guide and that defines the structure of the information to be included. If you do so, reference it here in the description. -->


### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for Rushed AI, **including completely new features and minor improvements to existing functionality**. Following these guidelines will help maintainers and the community to understand your suggestion and find related suggestions.

<!-- omit in toc -->
#### Before Submitting an Enhancement

- Make sure that you are using the latest version.
- Read the [documentation](https://github.com/brayanj4y/rushed-ai?tab=readme-ov-file#rushed-documentation) carefully and find out if the functionality is already covered, maybe by an individual configuration.
- Perform a [search](https://github.com/brayanj4y/rushed-ai/issues) to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.
- Find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case to convince the project's developers of the merits of this feature. Keep in mind that we want features that will be useful to the majority of our users and not just a small subset. If you're just targeting a minority of users, consider writing an add-on/plugin library.

<!-- omit in toc -->
#### How Do I Submit a Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://github.com/brayanj4y/rushed-ai/issues).

- Use a **clear and descriptive title** for the issue to identify the suggestion.
- Provide a **step-by-step description of the suggested enhancement** in as many details as possible.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why. At this point you can also tell which alternatives do not work for you.
- You may want to **include screenshots or screen recordings** which help you demonstrate the steps or point out the part which the suggestion is related to. You can use [LICEcap](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and the built-in [screen recorder in GNOME](https://help.gnome.org/users/gnome-help/stable/screen-shot-record.html.en) or [SimpleScreenRecorder](https://github.com/MaartenBaert/ssr) on Linux. <!-- this should only be included if the project has a GUI -->
- **Explain why this enhancement would be useful** to most Rushed AI users. You may also want to point out the other projects that solved it better and which could serve as inspiration.

<!-- You might want to create an issue template for enhancement suggestions that can be used as a guide and that defines the structure of the information to be included. If you do so, reference it here in the description. -->

### Your First Code Contribution

#### Prerequisites

Before you begin contributing, ensure you have:

- Node.js 13 or higher installed
- Git installed
- A code editor (preferably VS Code)

#### Setting Up Development Environment

1. Fork the repository

2. Clone your fork:

   ```bash
   git clone https://github.com/brayanj4y/rushed-ai.git
   cd rushed-ai
   ```

3. Install dependencies:

   ```bash
   npm install --legacy-peer-deps --legacy-peer-deps
   ```

4. Set up environment variables:


```env
# Required Environment Variables
DATABASE_URL=<NeonDB URL>
NEXT_PUBLIC_APP_URL=http://localhost:3000
E2B_API_KEY=<e2b Sandbox Key>
ANTHROPIC_API_KEY=<Anthropic API Key>

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<Clerk Public Key>
CLERK_SECRET_KEY=<Clerk Secret>
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
```
   - Copy `.env.example` to `.env.local`
   - Fill in required environment variables:
     - Database URL
     - Clerk authentication keys
     - Other necessary API keys

1. Set up the database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

The application should now be running at `http://localhost:3000`.

### Improving The Documentation

Documentation improvements are always welcome. Here's what you can help with:

1. README.md improvements
2. Code comments and documentation
3. API documentation
4. Contributing guidelines
5. Installation and setup instructions

When documenting:

- Use clear, concise language
- Include code examples where relevant
- Add screenshots for UI-related changes
- Ensure proper formatting and markdown usage
- Keep documentation up to date with code changes

## Styleguides

### Code Style

- Use TypeScript for all new code
- Follow the existing code formatting style
- Use ES6+ features when possible
- Add proper TypeScript types
- Use meaningful variable and function names

### Component Guidelines

- Use functional components with hooks
- Keep components small and focused
- Use proper prop typing
- Follow the file naming convention: `kebab-case.tsx`
- Place components in appropriate directories

### Git Workflow

1. Create a new branch for each feature/fix
2. Use meaningful branch names (e.g., `feature/user-authentication`, `fix/login-validation`)
3. Make regular, small commits
4. Keep pull requests focused on a single change

### Commit Messages

Follow these guidelines for commit messages:

1. Use the present tense ("Add feature" not "Added feature")
2. Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
3. Limit the first line to 72 characters or less
4. Reference issues and pull requests liberally after the first line
5. Consider starting the commit message with an applicable emoji:
   - ✨ `:sparkles:` when adding a new feature
   - 🐛 `:bug:` when fixing a bug
   - 📚 `:books:` when adding or updating documentation
   - ♻️ `:recycle:` when refactoring code
   - 🎨 `:art:` when improving the format/structure of the code
   - ⚡️ `:zap:` when improving performance
   - 🔒 `:lock:` when dealing with security


### Credits

This contributing guide is adapted from the [Atom](https://github.com/atom/atom/blob/master/CONTRIBUTING.md) contributing guide.

<!-- TODO

-->
<!-- omit in toc -->
## Attribution
This guide is based on the [contributing.md](https://contributing.md/generator)!
