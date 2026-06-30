require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // allow self-signed certs on internal Jira instances
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3737;

let { JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN } = process.env;

let EPIC_LINK_FIELD = 'customfield_10014'; // resolved at startup
let EPIC_NAME_FIELD = 'customfield_10008'; // resolved at startup

async function resolveEpicFields() {
  try {
    const res = await fetch(`${JIRA_BASE_URL}/rest/api/2/field`, {
      headers: { Authorization: `Bearer ${JIRA_API_TOKEN}`, Accept: 'application/json' },
    });
    if (!res.ok) return;
    const fields = await res.json();
    const link = fields.find(f => f.name === 'Epic Link' || f.name === 'Epic link');
    const name = fields.find(f => f.name === 'Epic Name' || f.name === 'Epic name');
    if (link) { EPIC_LINK_FIELD = link.id; console.log(`Epic Link field: ${link.id}`); }
    if (name) { EPIC_NAME_FIELD = name.id; console.log(`Epic Name field: ${name.id}`); }
  } catch {}
}
resolveEpicFields();

function getFields() {
  return `summary,status,priority,project,issuetype,customfield_10020,${EPIC_LINK_FIELD},updated,created,duedate,assignee,reporter,comment`;
}

function jiraHeaders() {
  return {
    Authorization: `Bearer ${JIRA_API_TOKEN}`,
    Accept: 'application/json',
  };
}

async function jiraGet(p) {
  const res = await fetch(`${JIRA_BASE_URL}/rest/api/2${p}`, { headers: jiraHeaders() });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Jira API ${res.status}: ${text}`);
  }
  return res.json();
}

function buildJql(mode, done, createdFrom, createdTo) {
  const parts = [];

  if (mode === 'assigned') parts.push('assignee = currentUser()');
  else if (mode === 'watched') parts.push('watcher = currentUser()');
  else parts.push('(assignee = currentUser() OR watcher = currentUser())');

  parts.push(done ? 'statusCategory = Done' : 'statusCategory != Done');

  if (createdFrom) parts.push(`created >= "${createdFrom}"`);
  if (createdTo)   parts.push(`created <= "${createdTo}"`);

  return parts.join(' AND ') + ' ORDER BY updated DESC';
}

app.get('/api/issues', async (req, res) => {
  try {
    const { mode = 'both', createdFrom, createdTo } = req.query;
    const jql = encodeURIComponent(buildJql(mode, false, createdFrom, createdTo));
    const data = await jiraGet(`/search?jql=${jql}&maxResults=200&fields=${getFields()}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/issues/done', async (req, res) => {
  try {
    const { mode = 'both', createdFrom, createdTo } = req.query;
    const jql = encodeURIComponent(buildJql(mode, true, createdFrom, createdTo));
    const data = await jiraGet(`/search?jql=${jql}&maxResults=50&fields=${getFields()}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Read helpers ──────────────────────────────────────────────────────────────
app.get('/api/transitions/:key', async (req, res) => {
  try {
    const data = await jiraGet(`/issue/${req.params.key}/transitions`);
    res.json(data.transitions || []);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/priorities', async (req, res) => {
  try {
    const data = await jiraGet('/priority');
    res.json(Array.isArray(data) ? data : []);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/sprints', async (req, res) => {
  try {
    const boards = await fetch(`${JIRA_BASE_URL}/rest/agile/1.0/board?maxResults=50&type=scrum`, { headers: jiraHeaders() });
    if (!boards.ok) return res.json([]);
    const { values = [] } = await boards.json();
    const results = await Promise.allSettled(
      values.slice(0, 8).map(b =>
        fetch(`${JIRA_BASE_URL}/rest/agile/1.0/board/${b.id}/sprint?state=active,future&maxResults=20`, { headers: jiraHeaders() })
          .then(r => r.json()).then(d => d.values || [])
      )
    );
    const sprints = results.filter(r => r.status === 'fulfilled').flatMap(r => r.value)
      .filter((s, i, a) => a.findIndex(x => x.id === s.id) === i)
      .sort((a, b) => (a.state === 'active' ? -1 : 1) || a.name.localeCompare(b.name));
    res.json(sprints);
  } catch (err) { res.json([]); }
});

// ── Write helpers ─────────────────────────────────────────────────────────────
app.put('/api/issue/:key', express.json(), async (req, res) => {
  try {
    const r = await fetch(`${JIRA_BASE_URL}/rest/api/2/issue/${req.params.key}`, {
      method: 'PUT',
      headers: { ...jiraHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: req.body.fields }),
    });
    if (!r.ok) throw new Error(await r.text());
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/transition/:key', express.json(), async (req, res) => {
  try {
    const r = await fetch(`${JIRA_BASE_URL}/rest/api/2/issue/${req.params.key}/transitions`, {
      method: 'POST',
      headers: { ...jiraHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ transition: { id: req.body.transitionId } }),
    });
    if (!r.ok) throw new Error(await r.text());
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/sprint/:sprintId/issue', express.json(), async (req, res) => {
  try {
    const r = await fetch(`${JIRA_BASE_URL}/rest/agile/1.0/sprint/${req.params.sprintId}/issue`, {
      method: 'POST',
      headers: { ...jiraHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ issues: req.body.issues }),
    });
    if (!r.ok) throw new Error(await r.text());
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/users', async (req, res) => {
  try {
    const q = encodeURIComponent(req.query.q || '');
    const data = await jiraGet(`/user/search?username=${q}&maxResults=10`);
    res.json(Array.isArray(data) ? data : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/comments/:key', express.json(), async (req, res) => {
  try {
    const { body } = req.body;
    if (!body) return res.status(400).json({ error: 'body required' });
    const result = await fetch(`${JIRA_BASE_URL}/rest/api/2/issue/${req.params.key}/comment`, {
      method: 'POST',
      headers: { ...jiraHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    });
    if (!result.ok) throw new Error(await result.text());
    res.json(await result.json());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/epics', async (req, res) => {
  try {
    const values = (req.query.keys || '').split(',').map(k => k.trim()).filter(Boolean);
    if (!values.length) return res.json({ epics: [] });
    const isKey = v => /^[A-Z][A-Z0-9]*-\d+$/.test(v);
    let jql;
    if (values.every(isKey)) {
      jql = `issuetype = Epic AND key in (${values.join(',')})`;
    } else {
      const quoted = values.map(v => `"${v.replace(/"/g, '\\"')}"`).join(',');
      jql = `issuetype = Epic AND summary in (${quoted})`;
    }
    const data = await jiraGet(`/search?jql=${encodeURIComponent(jql)}&maxResults=200&fields=summary,${EPIC_NAME_FIELD}`);
    const epics = (data.issues || []).map(i => ({
      key: i.key,
      summary: i.fields.summary || '',
      name: i.fields[EPIC_NAME_FIELD] || i.fields.summary || i.key,
    }));
    res.json({ epics });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/comments/:key', async (req, res) => {
  try {
    const data = await jiraGet(`/issue/${req.params.key}/comment?maxResults=50&orderBy=-created`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/version', (req, res) => {
  res.json({ version: require('./package.json').version });
});

app.get('/api/config', (req, res) => {
  res.json({
    baseUrl: JIRA_BASE_URL,
    epicLinkField: EPIC_LINK_FIELD,
    epicNameField: EPIC_NAME_FIELD,
    configured: !!(JIRA_BASE_URL && JIRA_EMAIL && JIRA_API_TOKEN),
  });
});

// Setup endpoint — writes .env and reloads config
app.post('/api/setup', express.json(), (req, res) => {
  const { baseUrl, email, token } = req.body;
  if (!baseUrl || !email || !token) return res.status(400).json({ error: 'All fields required' });
  const envPath = path.join(__dirname, '.env');
  const content = `JIRA_BASE_URL=${baseUrl.replace(/\/$/, '')}\nJIRA_EMAIL=${email}\nJIRA_API_TOKEN=${token}\nPORT=${PORT}\n`;
  try {
    fs.writeFileSync(envPath, content);
    JIRA_BASE_URL = baseUrl.replace(/\/$/, '');
    JIRA_EMAIL = email;
    JIRA_API_TOKEN = token;
    resolveEpicFields();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve setup page if not configured
app.get('/', (req, res) => {
  if (!JIRA_BASE_URL || !JIRA_EMAIL || !JIRA_API_TOKEN) {
    res.sendFile(path.join(__dirname, 'public', 'setup.html'));
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Jira Dashboard running at http://localhost:${PORT}`);
});
