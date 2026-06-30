# Jira Dashboard

A personal dashboard that shows all your Jira issues in one place -- filter, sort, group, and edit them without leaving your browser.

---

## Setup (4 steps)

### Step 1 -- Download the code

1. Go to the repository page on GitHub
2. Click the green **Code** button
3. Click **Download ZIP**
4. Once downloaded, find the ZIP in your Downloads folder and double-click it to unzip
5. Move the unzipped `Jira-dashboard-main` folder somewhere easy to find, like your Desktop

---

### Step 2 -- Install Node.js

Node.js is what runs the dashboard on your computer. You only need to do this once.

1. Go to [nodejs.org](https://nodejs.org)
2. Click the big **LTS** download button (the one that says "Recommended for most users")
3. Open the downloaded file and follow the installer -- just keep clicking Next/Continue

---

### Step 3 -- Start the dashboard

**On Mac:** Double-click the `start.command` file inside the `Jira-dashboard-main` folder

**On Windows:** Double-click the `start.bat` file instead

A terminal window will open and the server will start automatically. The first time it runs it may take a minute to install dependencies -- after that it starts instantly.

**If the file doesn't open -- Mac security block:**

If nothing happens when you double-click, Mac has blocked it because it was downloaded from the internet. Here's how to fix it:

1. Double-click `start.command` -- it will get blocked and nothing will happen
2. Open **System Settings** (the gear icon in your Dock)
3. Go to **Privacy & Security**
4. Scroll down until you see a message saying `start.command was blocked`
5. Click **Open Anyway**
6. Enter your Mac password if asked
7. Double-click `start.command` again -- it will open normally this time and every time after

---

### Step 4 -- Enter your credentials

Your browser will open automatically to a setup page. Fill in:

- **Jira URL** -- the address you use to open Jira (e.g. `https://jira.yourcompany.com`)
- **Your work email**
- **Personal Access Token** -- the setup page explains exactly how to get this from Jira

Click **Save & Open Dashboard** and you're done. Your credentials are saved locally and you won't need to do this again.

---

## Every time you want to use it

1. Double-click `start.command` (Mac) or `start.bat` (Windows)
2. Click your **Jira Dashboard** bookmark in your browser

> Bookmark `http://localhost:3737` after your first visit. Keep the terminal window open in the background while you use the dashboard -- minimizing it is fine, but closing it will stop the dashboard. When you're done for the day, close the terminal window.

---

## Tips

- **Change a field** -- click any status, priority, due date, sprint, or assignee cell directly in the table
- **Edit a summary** -- hover over a row and click the pencil icon that appears
- **Group issues** -- use the Group By dropdown in the toolbar; drag group headers to reorder
- **Filter by status** -- click the To Do / In Progress / In Review / Done cards at the top
- **Copy to Slack** -- click the copy icon on any row to get a formatted message with the ticket key, project, and link
- **Comments** -- click the chat bubble icon on any row to read and post comments

---

## Troubleshooting

| Problem | What to do |
|---|---|
| Mac won't open `start.command` | Right-click it, choose Open, then click Open again |
| Page loads but no issues show | Go through the setup page again and double-check your Jira URL and token |
| `npm: command not found` | Node.js didn't install correctly -- go back to Step 2 |
| `EADDRINUSE` error | Something else is using port 3737 -- open `start.command` in a text editor and change `3737` to `3738` |
| Token error from Jira | Make sure you created a Personal Access Token in Jira (not your Jira password) |
