# Jira Dashboard

A personal dashboard that shows all your Jira issues in one place -- filter, sort, group, and edit them without leaving your browser.

---

## Step 1 -- Download the code

1. Go to the repository page on GitHub
2. Click the green **Code** button
3. Click **Download ZIP**
4. Once downloaded, find the ZIP in your Downloads folder and double-click it to unzip
5. Move the unzipped `Jira-dashboard` folder somewhere easy to find, like your Desktop

---

## Step 2 -- Install Node.js

Node.js is what runs the dashboard on your computer. You only need to do this once.

1. Go to [nodejs.org](https://nodejs.org)
2. Click the big **LTS** download button (the one that says "Recommended for most users")
3. Open the downloaded file and follow the installer -- just keep clicking Next/Continue
4. When it finishes, close the installer

---

## Step 3 -- Start the dashboard

**On Mac:** Double-click the `start.command` file in the `Jira-dashboard` folder. A terminal window will open and the server will start automatically.

**On Windows:** Double-click the `start.bat` file instead.

> The first time it runs it may take a minute to install dependencies. After that it starts instantly.

---

## Step 4 -- Set up your credentials

Open your browser and go to `http://localhost:3737` -- you'll see a setup form. Fill in:

- **Jira URL** -- the address you use to open Jira (e.g. `https://jira.yourcompany.com`)
- **Your work email**
- **Personal Access Token** -- see instructions on the setup page for how to get this

Click **Save & Open Dashboard** and you're done. Your credentials are saved locally and you won't need to do this again.

---

## Old Step 3 -- Open Terminal (manual method)

**On Mac:**
- Press `Command + Space`, type `Terminal`, press Enter

**On Windows:**
- Press the Windows key, type `PowerShell`, press Enter

---

## Step 4 -- Navigate to the dashboard folder

In the Terminal window, type the following and press Enter. Replace the path with wherever you put the folder:

**Mac:**
```
cd ~/Desktop/Jira-dashboard
```

**Windows:**
```
cd C:\Users\YourName\Desktop\Jira-dashboard
```

> Tip: You can also type `cd ` (with a space) and then drag the folder into the Terminal window -- it will fill in the path for you.

---

## Step 5 -- Install dependencies

Copy and paste this into Terminal and press Enter:

```
npm install
```

You'll see some text scroll by. Wait for it to finish (usually under a minute).

---

## Step 6 -- Add your Jira credentials

1. Open the `Jira-dashboard` folder in Finder (Mac) or File Explorer (Windows)
2. Find the file called `.env.example`
3. Make a copy of it and rename the copy to `.env` (just `.env`, no `.example`)

> On Mac, files starting with `.` may be hidden. Press `Command + Shift + .` in Finder to show hidden files.

4. Open `.env` with any text editor (TextEdit on Mac, Notepad on Windows)
5. Fill in your details:

```
JIRA_BASE_URL=https://your-jira-instance.com
JIRA_EMAIL=you@yourcompany.com
JIRA_API_TOKEN=your_personal_access_token_here
PORT=3737
```

**Where to get your Jira API token:**
1. Log in to Jira
2. Click your profile picture in the top right
3. Go to **Profile** then **Personal Access Tokens** in the left sidebar
4. Click **Create token**, give it any name, and copy the value
5. Paste it into the `.env` file next to `JIRA_API_TOKEN=`

6. Save and close the `.env` file

---

## Step 7 -- Start the dashboard

In Terminal, paste this and press Enter:

```
npm start
```

You should see:
```
Jira Dashboard running at http://localhost:3737
```

---

## Step 8 -- Open it in your browser

Open any browser (Chrome, Safari, Edge) and go to:

```
http://localhost:3737
```

Your Jira issues should load within a few seconds.

---

## Every time you want to use it

You only need to do the setup steps once. From next time:

1. Open Terminal
2. Navigate to the folder: `cd ~/Desktop/Jira-dashboard`
3. Run: `npm start`
4. Minimize Terminal -- leave it running in the background
5. Click your **Jira Dashboard** bookmark in your browser (or go to `http://localhost:3737`)

> Bookmark `http://localhost:3737` in your browser after your first visit so you never have to type it again. Terminal must stay open in the background while you use the dashboard -- minimizing it is fine, but closing it will stop the dashboard. When you're done for the day, press `Control + C` in Terminal to shut it down.

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
| `npm: command not found` | Node.js didn't install correctly -- go back to Step 2 |
| Page loads but no issues show | Double-check your `.env` file -- make sure there are no extra spaces and the URL has no trailing slash |
| `EADDRINUSE` error | Something else is using port 3737 -- change `PORT=3737` to `PORT=3738` in `.env` |
| Can't find the `.env.example` file | Enable hidden files: on Mac press `Command + Shift + .` in Finder |
| Token error from Jira | Make sure you created a Personal Access Token (not your Jira password) |
