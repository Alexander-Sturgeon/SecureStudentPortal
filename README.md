# SecureStudentPortal

This is a app developed specifically for a security course taken in college. It is developed keeping in mind secure design and preventing common malicious attacks.

The project is split into two applications that run at the same time:

- `express/` is the REST API, built with Express 5, TypeScript and MySQL. It runs on port 3000.
- `client/` is the front end, built with React 19, Vite and React Router. It runs on port 5173.

---

## 1. Prerequisites

Install these before doing anything else. The versions listed are what the project is developed
against.

- **Node.js 22.x (LTS)**, which comes with npm 10. Check what you have with `node -v` and `npm -v`.
- **MySQL Server 8.0**. The Community Server edition is fine.
- **MySQL Workbench**, any recent version. Optional, but it is the easiest way to run the two `.sql`
  files.
- **Git**, any recent version.

During the MySQL installer, **write down the root password you set.** You need it in step 4.

> **Windows tip:** the `mysql` command-line client is not added to your PATH by default. It lives at
> `C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe`. Either use the full path, add that `bin`
> folder to your PATH, or just use Workbench instead (step 5 covers both).

---

## 2. Clone the repository

```bash
git clone https://github.com/Alexander-Sturgeon/SecureStudentPortal.git
cd SecureStudentPortal
```

---

## 3. Install dependencies

The two applications have separate `package.json` files, so `npm install` has to be run **twice**,
once in each folder. Installing at the repo root is not enough.

```bash
# from the repo root
cd express
npm install

cd ../client
npm install

cd ..
```

Each install takes a minute or two and creates a `node_modules/` folder that is gitignored.

> The `package.json` at the repo root is a leftover with a single dependency in it. You can ignore
> it — nothing is run from the root.

---

## 4. Configure the API environment file

The API reads its database credentials and secrets from `express/.env`, which is **gitignored and
therefore not in your clone**. You have to create it from the committed template.

```bash
# Windows PowerShell, from the repo root
Copy-Item express\.env.example express\.env
```

```bash
# Git Bash
cp express/.env.example express/.env
```

Now open `express/.env` and edit the values:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_root_password_here
DB_NAME=studentportal
PORT=3000
JWT_SECRET=any_long_random_string
```

What each one does:

- **`DB_HOST`** — leave as `localhost`; the database runs on your own machine.
- **`DB_USER`** — your MySQL account. `root` is fine for local development.
- **`DB_PASSWORD`** — **the password you set during the MySQL install.** This is the single most
  common reason the API fails to start.
- **`DB_NAME`** — must stay `studentportal`. That is the schema name created by `database.sql`.
- **`PORT`** — **must stay `3000`.** The front end has `http://localhost:3000` hard-coded in
  `client/src/services/*.ts`. Changing this breaks every API call unless you edit those files too.
- **`JWT_SECRET`** — signs the session cookie. Any long random string works locally; just don't
  leave it empty, or login will fail.

Two things to watch out for:

- The template has `#` comments after each value. `dotenv` strips those, so they are safe to leave —
  but if your MySQL password itself contains a `#`, wrap the value in quotes:
  `DB_PASSWORD="pa#ssword"`.
- **Never commit `.env`.** It is already in `express/.gitignore`; leave it that way.

### Optional: `CLIENT_ORIGIN`

The API's CORS policy defaults to `http://localhost:5173`, which is Vite's normal port, so you do
not need to set this. Only add it if Vite starts on a different port (see Troubleshooting):

```env
CLIENT_ORIGIN=http://localhost:5174
```

---

## 5. Set up the MySQL database

There are two SQL files in `express/`, and **the order matters**:

1. **`database.sql`** — creates the `studentportal` schema and all nine tables (`user`, `student`,
   `teacher`, `class`, `assignment`, `student_has_class`, `student_has_assignment`, `lecture`,
   `Security_Logs`).
2. **`seed.sql`** — inserts the sample users, class, assignment, and lecture used for testing.

`seed.sql` will fail with `No database selected` if you run it before `database.sql`, because it
relies on the schema created there.

### Option A — MySQL Workbench (recommended)

1. Open Workbench and connect to your **Local instance MySQL80** connection.
2. **File → Open SQL Script…**, choose `express/database.sql`, and click the **⚡ lightning bolt**
   to execute the whole script.
3. In the **Schemas** panel on the left, click the refresh icon. A `studentportal` schema should now
   appear. **Double-click it** so its name goes bold — this makes it the active schema.
4. **File → Open SQL Script…**, choose `express/seed.sql`, and execute it the same way.
   - `seed.sql` has no `USE studentportal;` line of its own, so step 3 is what makes it land in the
     right place. If you skipped it you will get `Error 1046: No database selected`.
5. Verify with a quick query:

   ```sql
   USE studentportal;
   SELECT user_id, first_name, email FROM user;
   ```

   You should get four rows back.

### Option B — `mysql` command line

From the repo root, run both files in order. You will be prompted for your MySQL password each time:

```bash
mysql -u root -p < express/database.sql
mysql -u root -p studentportal < express/seed.sql
```

Note the `studentportal` argument on the second command — that is the CLI equivalent of selecting
the schema, and it is required.

On Windows PowerShell, `<` input redirection is not supported, so use `-e` with `source` instead:

```powershell
mysql -u root -p -e "source express/database.sql"
mysql -u root -p studentportal -e "source express/seed.sql"
```

### Seed accounts for testing

`seed.sql` creates four users. Their plaintext passwords are in `express/seed_passwords.txt`:

- **Kenneth Barclay** — `kdb@conestoga.com` / `Test1234!` — student, id `123456`
- **Alex Sturgeon** — `as@conestoga.com` / `password2772` — student, id `567891`
- **Gurkirat Singh** — `gs@conestoga.com` / `mrman21` — teacher, id `654321`
- **no rush** — `nonw@conestoga.com` / `absolutelynorushguys` — teacher, id `198765`

Kenneth is the student enrolled in the seeded class `PROG123`, and Gurkirat is the teacher who owns
it, so those two accounts are the ones that actually have data to look at.

These are throwaway development credentials for a course project. They are committed on purpose so
the group can all test against the same data, and they must never be reused anywhere real.

---

## 6. Run both applications at the same time

Both dev servers need to be running together — the front end is useless without the API behind it.
Open **two terminals**, both at the repo root.

**Terminal 1 — the API:**

```bash
cd express
npm run dev
```

This starts `nodemon` running `src/server.ts` through `ts-node`, and restarts on every file save.
Wait for:

```
Server running on port 3000
```

**Terminal 2 — the front end:**

```bash
cd client
npm run dev
```

Wait for Vite to print its local URL:

```
VITE v8.x  ready in ### ms
➜  Local:   http://localhost:5173/
```

Then open **<http://localhost:5173>** in your browser and log in with one of the seed accounts
above.

### Quick check that the API is alive on its own

Visit **<http://localhost:3000>** directly. It should return the plain text
`Secure Student Portal API`. If that works but the front end still can't log in, the problem is CORS
or the database, not the server itself.

### Stopping the servers

`Ctrl + C` in each terminal.

---

## Notes on file uploads

Assignment submissions are written to `express/uploads/`. That folder is created automatically on
first run and is fully gitignored — student submissions are never committed. You do not need to
create it yourself, and it will be empty in a fresh clone.
