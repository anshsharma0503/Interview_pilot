function escapeHtml(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function renderBullets(items = []) {
    return items.length
        ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
        : "";
}

function buildResumeHtml(resume) {
    const experience = resume.experience.map((item) => `
        <article>
            <h3>${escapeHtml(item.role)} | ${escapeHtml(item.organization)}</h3>
            <p class="meta">${escapeHtml(item.period)}</p>
            ${renderBullets(item.bullets)}
        </article>
    `).join("");

    const projects = resume.projects.map((item) => `
        <article>
            <h3>${escapeHtml(item.name)}</h3>
            <p class="meta">${item.technologies.map(escapeHtml).join(" | ")}</p>
            ${renderBullets(item.bullets)}
        </article>
    `).join("");

    const education = resume.education.map((item) => `
        <article>
            <h3>${escapeHtml(item.qualification)}</h3>
            <p>${escapeHtml(item.institution)} | ${escapeHtml(item.period)}</p>
        </article>
    `).join("");

    return `<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<style>
    @page {
        size: A4;
        margin: 14mm 15mm;
    }

    * {
        box-sizing: border-box;
    }

    html,
    body {
        margin: 0;
        padding: 0;
    }

    body {
        color: #172033;
        font-family: Arial, sans-serif;
        font-size: 10pt;
        line-height: 1.4;
    }

    h1 {
        margin: 0;
        font-size: 23pt;
        line-height: 1.15;
        color: #0f172a;
    }

    h2 {
        margin: 14px 0 6px;
        padding-bottom: 3px;
        border-bottom: 1px solid #94a3b8;
        font-size: 11pt;
        text-transform: uppercase;
    }

    h3 {
        margin: 8px 0 2px;
        font-size: 10pt;
    }

    p {
        margin: 2px 0;
    }

    ul {
        margin: 5px 0 7px;
        padding-left: 18px;
    }

    li {
        margin-bottom: 2px;
    }

    article {
        break-inside: avoid;
    }

    .contact,
    .meta {
        color: #475569;
    }

    .contact {
        margin-top: 3px;
        font-size: 8.5pt;
    }

    .skills {
        color: #1e3a5f;
    }
</style>
</head>
<body>
    <header>
        <h1>${escapeHtml(resume.candidateName)}</h1>
        <p class="contact">${resume.contactDetails.map(escapeHtml).join(" | ")}</p>
    </header>

    <h2>Professional Summary</h2>
    <p>${escapeHtml(resume.professionalSummary)}</p>

    <h2>Skills</h2>
    <p class="skills">${resume.skills.map(escapeHtml).join(" | ")}</p>

    ${experience ? `<h2>Experience</h2>${experience}` : ""}
    ${projects ? `<h2>Projects</h2>${projects}` : ""}
    ${education ? `<h2>Education</h2>${education}` : ""}
    ${resume.achievements.length ? `<h2>Achievements</h2>${renderBullets(resume.achievements)}` : ""}
</body>
</html>`;
}

module.exports = {
    buildResumeHtml
};