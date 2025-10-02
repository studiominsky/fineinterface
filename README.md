<div align="start">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/fineinterface-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="public/fineinterface-light.svg">
    <img alt="Panellio Logo" src="public/logo-light.svg" width="200">
  </picture>
</div>

Find the best and most beautiful website designs on the web. A curated collection for your inspiration.

## Features

- **User Authentication:** Create an account and log in using Google or GitHub.
- **Submit Websites:** Registered users can submit websites for review.
- **Create Folders:** Organize your favorite websites by creating personal folders.
- **Admin Panel:** An admin panel to approve or reject website submissions.
- **Light & Dark Mode:** Switch between light and dark themes for your viewing pleasure.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Authentication & Database:** [Firebase](https://firebase.google.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)


### Tree structure of the project:

- app
  - admin
    - page.tsx
  - category
    - [slug]
      - page.tsx
    - layout.tsx
  - favicon.ico
  - layout.tsx
  - page.tsx
  - profile
    - page.tsx
- components
  - CategoryHeader.tsx
  - CategorySidebar.tsx
  - EditWebsiteDialog.tsx
  - FolderManager.tsx
  - Header.tsx
  - HomePageClient.tsx
  - Loading.tsx
  - Logo.tsx
  - MobileMenu.tsx
  - MobileSidebarContent.tsx
  - MySubmissions.tsx
  - SaveToFolderDialog.tsx
  - SaveToFolderPopover.tsx
  - SidebarContent.tsx
  - SignInDialog.tsx
  - ThemeProvider.tsx
  - ThemeToggle.tsx
  - UploadWebsiteDialog.tsx
  - UserSettings.tsx
  - WebsiteDetailDialog.tsx
  - WebsiteList.tsx
  - WebsitesGrid.tsx
  - ui
    - alert-dialog.tsx
    - badge.tsx
    - button.tsx
    - checkbox.tsx
    - command.tsx
    - dialog.tsx
    - dropdown-menu.tsx
    - input.tsx
    - label.tsx
    - popover.tsx
    - select.tsx
    - skeleton.tsx
    - sonner.tsx
    - spinner.tsx
    - textarea.tsx
- components.json
- context
  - AuthContext.tsx
- eslint.config.mjs
- firebase.json
- lib
  - categories.ts
  - firebase.ts
  - utils.ts
- next-env.d.ts
- next.config.ts
- package-lock.json
- package.json
- postcss.config.mjs
- public
  - android-chrome-192x192.png
  - android-chrome-512x512.png
  - apple-touch-icon.png
  - favicon-16x16.png
  - favicon-32x32.png
  - fineinterface-dark.svg
  - fineinterface-light.svg
  - logo.svg
  - site.webmanifest
  - studiominsky.png
  - website.svg
- services
  - folders.ts
  - website.ts
- set-admin.mjs
- styles
  - globals.css
- tsconfig.json
