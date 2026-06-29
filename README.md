# Jira Dashboard

A local dashboard for Jira Data Center that makes it easy to see, filter, and edit everything assigned to or watched by you -- all in one place.

## Features

- All issues assigned to or watched by you in a single table
- Group by project, sprint, status, or epic
- Inline editing: status, priority, due date, summary, sprint, and assignee
- Filter by project, epic, status, priority, and date range
- Stat cards (To Do / In Progress / In Review / Done) that act as filters
- Light and dark mode
- Copy tickets to clipboard in Slack-friendly format
- Comment on issues with @mention support
- Sortable, resizable columns
- Saves your preferred view to the browser

## Requirements

- [Node.js](https://nodejs.org/) v16 or later
- A Jira Data Center instance
- A Jira personal access token (PAT)

## Setup

### 1. Get a Jira API token

1. Log in to your Jira instance
2. Click your avatar in the top right and go to **Profile**
3. In the left sidebar choose **Personal Access Tokens**
4. Click **Create token**, give it a name, and copy the value

### 2. Install and configure

```bash
# Clone the repo
git clone <repo-url>
cd jira-dashboard

# Install dependencies
npm install

# Create your local config
cp .env.example .env
```

Open `.env` in any text editor and fill in your details:

```
JIRA_BASE_URL=https://your-jira-instance.com
JIRA_EMAIL=you@yourcompany.com
JIRA_API_TOKEN=your_personal_access_token_here
PORT=3737
```

> Your `.env` file is listed in `.gitignore` and will never be committed. Keep your token private.

### 3. Run

```bash
npm start
```

Open [http://localhost:3737](http://localhost:3737) in your browser.

## Usage tips

- **Change a field inline** -- click any status, priority, due date, sprint, or assignee cell directly in the table
- **Edit a summary** -- hover over a row and click the pencil icon
- **Group issues** -- use the Group By selector in the toolbar; drag group headers to reorder
- **Filter by stat card** -- click To Do, In Progress, In Review, or Done at the top to narrow the table
- **Copy to Slack** -- click the copy icon on any row to get `KEY | Project | Summary` + link
- **Comments** -- click the chat icon on any row to read and post comments (@mention with `@name`)

## Troubleshooting

| Problem | Fix |
|---|---|
| Page loads but no issues appear | Check that `JIRA_BASE_URL` has no trailing slash and your token is correct |
| Epic column is blank | The server auto-detects custom field IDs on startup -- check the terminal for `Epic Link field:` output |
| Spinning on status/priority change | Confirm your token has write permissions in Jira |
| Port already in use | Change `PORT=3737` in `.env` to any free port |
