---
title: "Butcher Shop Label Automation"
tagline: "A shop tool that checks label files against the traceability ledger and safely updates trace numbers, processing dates, and use-by dates"
summary: "It matches BIXOLON Label Artist-II labels against the shop's traceability ledger and the official livestock traceability lookups, backs everything up, and then updates the trace number and dates in the same label files."
audience: "Butcher shop staff who manage and print product labels, and the shop owner"
platform: "Windows desktop"
year: "2026"
order: 2
visibility: "private"
stack:
  - "Electron"
  - "React"
  - "TypeScript"
  - "Vite"
  - "Bun"
  - "SQLite"
  - "ExcelJS"
links: []
cover:
  src: "/images/label-automation/bulk-complete.webp"
  alt: "The finished bulk label update screen, summarizing trace-number replacement warnings, verified and failed counts, and manually excluded labels (Korean interface)"
features:
  - title: "Ledger and labels matched automatically"
    body: "It finds the item, product, origin, and trace-number headers in the traceability ledger spreadsheet and reads them even when rows and columns move. Products are matched by the cut name in each label file's name."
  - title: "Numbers verified against official lookups"
    body: "Imported meat is checked with MeatWatch, and domestic meat and bundle numbers with the national livestock traceability service (Mtrace). When several candidate numbers exist, slaughter dates are compared and only a clearly newest number is chosen."
  - title: "Only the needed fields, in the same file"
    body: "Only the trace number, processing date, and use-by date change; the rest of the design and text stays as it was. Folders and file names stay the same too, so staff open and print in Label Artist-II as usual."
  - title: "Use-by dates and replacement alerts"
    body: "The processing date is the day of the work, and the use-by date is calculated from the period printed on the label. Numbers past their maximum shelf life or ending within three months are listed separately as warnings."
  - title: "Bulk updates, single updates, and exclusions"
    body: "Update every label in the folder at once, or pick just one. Labels that should not be touched this time can be set aside as exclusions."
  - title: "Automatic backup and restore"
    body: "Files and trace history are backed up before any label changes. In Settings you pick a point in time and restore everything or a single label."
gallery:
  - src: "/images/label-automation/bulk-ready.webp"
    alt: "The bulk label update screen before running, with the update scope, label folder, and trace-number spreadsheet status on the right"
    caption: "Before work: once the label folder and ledger are ready, the black 'Verify and update labels' button turns on."
  - src: "/images/label-automation/details-dialog.webp"
    alt: "The run details dialog, showing per-cut states such as past maximum shelf life and needs replacement"
    caption: "Run details: trace numbers that need replacing are stamped 'expired' or 'replace' per cut. Real numbers are masked."
  - src: "/images/label-automation/settings-lookup.webp"
    alt: "The traceability lookup settings, with MeatWatch and Mtrace connections each shown as ready"
    caption: "Lookup settings: the import and domestic traceability connections are checked separately."
  - src: "/images/label-automation/settings-backups.webp"
    alt: "Settings for automatic backups and exclusions, with a list of backup points and a list of label files excluded from updates"
    caption: "Backups and exclusions: roll back to before an update, or manage labels left out of this run."
---

## What it does

A Korean butcher shop designs and prints its product labels (.lafx) in BIXOLON Label Artist-II. Each label carries a trace number, a processing date, and a use-by date, and these have to change whenever new meat comes in.

This program compares the shop's traceability ledger (.xlsx) with the label files. Whether each trace number is really registered is checked against the official livestock traceability lookups: MeatWatch for imported meat, and Mtrace for domestic meat and bundle numbers. Once verified, it backs up the labels automatically and replaces only the trace number, processing date, and use-by date in the same files.

The label design and other text are left alone. Folders and file names do not change either, so when the work is done staff open the labels in Label Artist-II and print as usual.

## Who it is for

Butcher shop staff who fix and print labels every day, and the shop owner who is responsible for the accuracy of what is printed. All menus and messages are in Korean. After the label folder and ledger are chosen once, every run starts with a single button.

## Workflow

1. In Settings, choose the shop's label folder and traceability ledger once, and check the lookup connections.
2. Set aside any labels that should not be touched this time as exclusions.
3. In 'Bulk label update', press 'Verify and update labels'. To fix a single label, use 'Single label update'.
4. The program matches the ledger with the labels, verifies the numbers with the official lookups, makes a backup, and updates the labels.
5. On the results screen, review updated labels, excluded labels, and trace numbers due for replacement.
6. Open the labels in Label Artist-II, check them, and print.

## Designed for safety

The trace number and use-by date on a label are shown to customers exactly as printed. So the program changes things only when it is certain, and stops when it is not.

- **Back up before changing anything.** Files and trace history are saved automatically before a label changes. There is no backup folder to set up.
- **Undo at any time.** Pick a backup point in Settings to restore all labels or just one. The state right before a restore is backed up as well.
- **Stop when unsure.** When it cannot tell which number is newest, when a lookup result cannot be trusted, or when a file changes mid-run, it does not guess. It stops and explains why. When several products match, staff choose first.
- **Change files without breaking them.** The original file is never deleted or emptied first; a complete new file is prepared and then swapped in. If the computer shuts down mid-run, it returns to a known state on the next start.
- **Never report a failed label as a success.** Labels that could not be updated or were excluded are shown separately on the results screen, so an unverified label is not printed as if it had been checked.

## Interface design

The design is called 'Cold Counter'. Its colors come from a butcher shop's stainless display counter and the labels staff actually hold.

- The background is a cool gray like cold-room lighting.
- The work area looks like white label stock.
- Text and the main action buttons are thermal-print black.
- Butcher red is reserved for the shop logo, the selected menu, and blocked states. Action buttons are black, not red, so red always reads as 'stop'.

Trace numbers and dates sit in black-bordered boxes with fixed-width digits, like the printed fields on a real label. States such as confirmed, caution, and blocked are never told apart by color alone; each always comes with an icon and a word.

> Real trace numbers and file locations in the screenshots are masked.
