/**
 * SkillGap AI - Frontend Application Controller
 * Handles UI interactions, file drag-and-drop, API communication,
 * interactive metric rendering, and history state management.
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const resumeTabs = document.querySelectorAll("#resumeTabs .tab-btn");
  const jdTabs = document.querySelectorAll("#jdTabs .tab-btn");
  const resumeUploadTab = document.getElementById("resumeUploadTab");
  const resumeTextTab = document.getElementById("resumeTextTab");
  const jdTextTab = document.getElementById("jdTextTab");
  const jdUrlTab = document.getElementById("jdUrlTab");

  const dropzone = document.getElementById("dropzone");
  const resumeFileInput = document.getElementById("resumeFileInput");
  const dropzoneContent = document.getElementById("dropzoneContent");
  const filePreview = document.getElementById("filePreview");
  const selectedFileName = document.getElementById("selectedFileName");
  const selectedFileSize = document.getElementById("selectedFileSize");
  const fileExtIcon = document.getElementById("fileExtIcon");
  const removeFileBtn = document.getElementById("removeFileBtn");

  const candidateNameInput = document.getElementById("candidateNameInput");
  const resumeTextInput = document.getElementById("resumeTextInput");
  const jobTitleInput = document.getElementById("jobTitleInput");
  const jdTextInput = document.getElementById("jdTextInput");
  const jdUrlInput = document.getElementById("jdUrlInput");
  const fetchUrlBtn = document.getElementById("fetchUrlBtn");
  const scrapedPreview = document.getElementById("scrapedPreview");

  const runAnalysisBtn = document.getElementById("runAnalysisBtn");
  const analysisSpinner = document.getElementById("analysisSpinner");
  const alertBanner = document.getElementById("alertBanner");
  const resultsDashboard = document.getElementById("resultsDashboard");

  // Metric Elements
  const compositeScoreText = document.getElementById("compositeScoreText");
  const circleProgress = document.getElementById("circleProgress");
  const readinessBadge = document.getElementById("readinessBadge");
  const readinessTierText = document.getElementById("readinessTierText");
  const readinessDescText = document.getElementById("readinessDescText");
  const weightedSkillScore = document.getElementById("weightedSkillScore");
  const skillScoreFill = document.getElementById("skillScoreFill");
  const vectorSimScore = document.getElementById("vectorSimScore");
  const vectorScoreFill = document.getElementById("vectorScoreFill");

  const statMatched = document.getElementById("statMatched");
  const statMissingReq = document.getElementById("statMissingReq");
  const statMissingPref = document.getElementById("statMissingPref");
  const statAdditional = document.getElementById("statAdditional");

  const categoryBarsContainer = document.getElementById("categoryBarsContainer");
  const skillsGridContainer = document.getElementById("skillsGridContainer");
  const skillFilterPills = document.querySelectorAll("#skillFilterPills .pill");
  const pillCountMatched = document.getElementById("pillCountMatched");
  const pillCountReq = document.getElementById("pillCountReq");
  const pillCountPref = document.getElementById("pillCountPref");
  const pillCountAdd = document.getElementById("pillCountAdd");

  const roadmapSummaryBadge = document.getElementById("roadmapSummaryBadge");
  const roadmapTotalHours = document.getElementById("roadmapTotalHours");
  const roadmapWeeks = document.getElementById("roadmapWeeks");
  const milestonesContainer = document.getElementById("milestonesContainer");

  // History Drawer Elements
  const historyBtn = document.getElementById("historyBtn");
  const historyCount = document.getElementById("historyCount");
  const historyDrawer = document.getElementById("historyDrawer");
  const drawerBackdrop = document.getElementById("drawerBackdrop");
  const closeDrawerBtn = document.getElementById("closeDrawerBtn");
  const historyListContainer = document.getElementById("historyListContainer");
  const presetsContainer = document.getElementById("presetsContainer");

  let selectedFile = null;
  let currentReport = null;
  let activeFilter = "all";

  // ================= Tab Switching =================
  resumeTabs.forEach(btn => {
    btn.addEventListener("click", () => {
      resumeTabs.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.getAttribute("data-tab");
      if (tab === "upload") {
        resumeUploadTab.classList.add("active");
        resumeTextTab.classList.remove("active");
      } else {
        resumeUploadTab.classList.remove("active");
        resumeTextTab.classList.add("active");
      }
    });
  });

  jdTabs.forEach(btn => {
    btn.addEventListener("click", () => {
      jdTabs.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.getAttribute("data-tab");
      if (tab === "jd-text") {
        jdTextTab.classList.add("active");
        jdUrlTab.classList.remove("active");
      } else {
        jdTextTab.classList.remove("active");
        jdUrlTab.classList.add("active");
      }
    });
  });

  // ================= Dropzone & File Handling =================
  dropzone.addEventListener("click", (e) => {
    if (e.target !== removeFileBtn && !removeFileBtn.contains(e.target)) {
      resumeFileInput.click();
    }
  });

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("drag-over");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("drag-over");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("drag-over");
    if (e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  });

  resumeFileInput.addEventListener("change", () => {
    if (resumeFileInput.files.length > 0) {
      handleFileSelected(resumeFileInput.files[0]);
    }
  });

  removeFileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    selectedFile = null;
    resumeFileInput.value = "";
    filePreview.classList.add("hidden");
    dropzoneContent.classList.remove("hidden");
  });

  function handleFileSelected(file) {
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["pdf", "docx", "txt"].includes(ext)) {
      showAlert("Unsupported file format. Please upload .pdf, .docx, or .txt", "danger");
      return;
    }
    selectedFile = file;
    selectedFileName.textContent = file.name;
    selectedFileSize.textContent = formatBytes(file.size);
    fileExtIcon.textContent = ext.toUpperCase();

    dropzoneContent.classList.add("hidden");
    filePreview.classList.remove("hidden");
  }

  function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  // ================= URL Scraper =================
  fetchUrlBtn.addEventListener("click", async () => {
    const url = jdUrlInput.value.trim();
    if (!url) {
      showAlert("Please enter a valid job URL to scrape.", "danger");
      return;
    }

    const btnText = fetchUrlBtn.querySelector(".btn-text");
    const btnSpinner = fetchUrlBtn.querySelector(".btn-spinner");

    btnText.classList.add("hidden");
    btnSpinner.classList.remove("hidden");
    fetchUrlBtn.disabled = true;

    try {
      const response = await fetch("/api/scrape-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to scrape job posting");

      if (data.title && (!jobTitleInput.value || jobTitleInput.value === "Target Job Role")) {
        jobTitleInput.value = data.title;
      }
      scrapedPreview.value = data.text;
      scrapedPreview.classList.remove("hidden");
      showAlert("Job description scraped successfully!", "success");
    } catch (err) {
      showAlert(err.message, "danger");
    } finally {
      btnText.classList.remove("hidden");
      btnSpinner.classList.add("hidden");
      fetchUrlBtn.disabled = false;
    }
  });

  // ================= Quick Demo Presets =================
  async function loadPresets() {
    try {
      const res = await fetch("/api/samples");
      const samples = await res.json();
      presetsContainer.innerHTML = "";

      samples.forEach(sample => {
        const chip = document.createElement("button");
        chip.className = "preset-chip";
        chip.textContent = sample.label;
        chip.title = sample.description;
        chip.addEventListener("click", () => applyPreset(sample));
        presetsContainer.appendChild(chip);
      });
    } catch (err) {
      console.error("Failed to load presets:", err);
    }
  }

  function applyPreset(sample) {
    candidateNameInput.value = sample.candidate_name;
    jobTitleInput.value = sample.job_title;

    // Switch to text tabs and populate
    resumeTabs.forEach(b => b.classList.remove("active"));
    document.querySelector('#resumeTabs [data-tab="text"]').classList.add("active");
    resumeUploadTab.classList.remove("active");
    resumeTextTab.classList.add("active");
    resumeTextInput.value = sample.resume_text.trim();

    jdTabs.forEach(b => b.classList.remove("active"));
    document.querySelector('#jdTabs [data-tab="jd-text"]').classList.add("active");
    jdUrlTab.classList.remove("active");
    jdTextTab.classList.add("active");
    jdTextInput.value = sample.jd_text.trim();

    showAlert(`Loaded preset: "${sample.label}"`, "success");
  }

  // ================= Run Skill-Gap Analysis =================
  runAnalysisBtn.addEventListener("click", async () => {
    hideAlert();

    const isUploadActive = resumeUploadTab.classList.contains("active");
    const isJdUrlActive = jdUrlTab.classList.contains("active");

    const candidateName = candidateNameInput.value.trim() || "Candidate Profile";
    const jobTitle = jobTitleInput.value.trim() || "Target Job Role";

    // Validate inputs
    if (isUploadActive && !selectedFile) {
      showAlert("Please upload a resume file (.pdf, .docx, .txt) or switch to Paste Text tab.", "danger");
      return;
    }
    if (!isUploadActive && !resumeTextInput.value.trim()) {
      showAlert("Please paste resume text into the Candidate Resume field.", "danger");
      return;
    }
    if (isJdUrlActive && !jdUrlInput.value.trim() && !scrapedPreview.value.trim()) {
      showAlert("Please enter a Job Posting URL or paste the job description directly.", "danger");
      return;
    }
    if (!isJdUrlActive && !jdTextInput.value.trim()) {
      showAlert("Please provide target Job Description prose.", "danger");
      return;
    }

    // Set Loading State
    runAnalysisBtn.disabled = true;
    analysisSpinner.classList.remove("hidden");

    try {
      let reportData;

      if (isUploadActive && selectedFile) {
        // Multipart Form Submit
        const formData = new FormData();
        formData.append("resume_file", selectedFile);
        formData.append("candidate_name", candidateName);
        formData.append("job_title", jobTitle);

        if (isJdUrlActive) {
          if (scrapedPreview.value.trim()) {
            formData.append("jd_text", scrapedPreview.value.trim());
          } else {
            formData.append("jd_url", jdUrlInput.value.trim());
          }
        } else {
          formData.append("jd_text", jdTextInput.value.trim());
        }

        const res = await fetch("/api/analyze", {
          method: "POST",
          body: formData
        });
        reportData = await res.json();
        if (!res.ok) throw new Error(reportData.detail || "Analysis request failed.");
      } else {
        // JSON Direct Endpoint
        const payload = {
          resume_text: resumeTextInput.value.trim(),
          candidate_name: candidateName,
          job_title: jobTitle
        };

        if (isJdUrlActive) {
          if (scrapedPreview.value.trim()) {
            payload.jd_text = scrapedPreview.value.trim();
          } else {
            payload.jd_url = jdUrlInput.value.trim();
          }
        } else {
          payload.jd_text = jdTextInput.value.trim();
        }

        const res = await fetch("/api/analyze/direct", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        reportData = await res.json();
        if (!res.ok) throw new Error(reportData.detail || "Analysis request failed.");
      }

      currentReport = reportData;
      renderResults(reportData);
      updateHistoryCount();
      showAlert("Skill-Gap Analysis complete! Personalized roadmap generated below.", "success");

      // Scroll smoothly to results
      resultsDashboard.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      showAlert(err.message, "danger");
    } finally {
      runAnalysisBtn.disabled = false;
      analysisSpinner.classList.add("hidden");
    }
  });

  // ================= Render Results Dashboard =================
  function renderResults(report) {
    resultsDashboard.classList.remove("hidden");

    const scores = report.scores || {};
    const stats = report.stats || {};
    const skills = report.skills || {};
    const categories = report.category_breakdown || {};
    const learningPath = report.learning_path || {};

    // 1. Hero Score & Progress Ring
    const compositeScore = Math.round(scores.composite_readiness_score || 0);
    compositeScoreText.textContent = `${compositeScore}%`;

    // SVG stroke dasharray: circumference is ~100
    circleProgress.setAttribute("stroke-dasharray", `${compositeScore}, 100`);
    circleProgress.style.stroke = scores.readiness_color || "#10b981";

    readinessBadge.textContent = scores.readiness_badge || "Evaluated";
    readinessBadge.style.color = scores.readiness_color || "#10b981";
    readinessBadge.style.background = `${scores.readiness_color}22`;

    readinessTierText.textContent = scores.readiness_tier || "Readiness Rating";
    readinessDescText.textContent = scores.readiness_desc || "";

    // 2. Metrics
    weightedSkillScore.textContent = `${scores.weighted_skill_match_pct || 0}%`;
    skillScoreFill.style.width = `${scores.weighted_skill_match_pct || 0}%`;

    vectorSimScore.textContent = `${scores.semantic_vector_sim_pct || 0}%`;
    vectorScoreFill.style.width = `${scores.semantic_vector_sim_pct || 0}%`;

    // 3. Counts
    statMatched.textContent = stats.matched_skills_count || 0;
    statMissingReq.textContent = stats.missing_required_count || 0;
    statMissingPref.textContent = stats.missing_preferred_count || 0;
    statAdditional.textContent = stats.additional_skills_count || 0;

    pillCountMatched.textContent = stats.matched_skills_count || 0;
    pillCountReq.textContent = stats.missing_required_count || 0;
    pillCountPref.textContent = stats.missing_preferred_count || 0;
    pillCountAdd.textContent = stats.additional_skills_count || 0;

    // 4. Category Breakdown
    renderCategoryCoverage(categories);

    // 5. Skills Grid
    renderSkillsGrid(skills);

    // 6. Roadmap
    renderRoadmap(learningPath);
  }

  function renderCategoryCoverage(categories) {
    categoryBarsContainer.innerHTML = "";
    Object.keys(categories).forEach(catKey => {
      const cat = categories[catKey];
      if (cat.total_job_skills === 0 && cat.matched_skills === 0) return;

      const item = document.createElement("div");
      item.className = "category-bar-item";

      const pct = Math.round(cat.coverage_pct || 0);
      item.innerHTML = `
        <div class="cat-header">
          <span class="cat-title">
            <span class="cat-dot" style="background: ${cat.color};"></span>
            ${cat.label}
          </span>
          <span class="cat-pct" style="color: ${cat.color};">${pct}%</span>
        </div>
        <div class="cat-track">
          <div class="cat-fill" style="width: ${pct}%; background: ${cat.color};"></div>
        </div>
        <div class="cat-footer">
          <span>${cat.matched_skills} of ${cat.total_job_skills} matched</span>
          <span>${cat.missing_skills} missing</span>
        </div>
      `;
      categoryBarsContainer.appendChild(item);
    });
  }

  function renderSkillsGrid(skills) {
    skillsGridContainer.innerHTML = "";
    const allItems = [];

    (skills.matched || []).forEach(s => allItems.push({ ...s, type: "matched", tagClass: "tag-matched", tagLabel: "Matched" }));
    (skills.missing_required || []).forEach(s => allItems.push({ ...s, type: "missing_req", tagClass: "tag-req", tagLabel: "Missing Required" }));
    (skills.missing_preferred || []).forEach(s => allItems.push({ ...s, type: "missing_pref", tagClass: "tag-pref", tagLabel: "Missing Preferred" }));
    (skills.additional || []).forEach(s => allItems.push({ ...s, type: "additional", tagClass: "tag-add", tagLabel: "Bonus Profile" }));

    const filtered = allItems.filter(item => activeFilter === "all" || item.type === activeFilter);

    if (filtered.length === 0) {
      skillsGridContainer.innerHTML = `<p class="field-hint">No skills match the selected filter.</p>`;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement("div");
      card.className = "skill-card";
      card.innerHTML = `
        <div class="skill-card-top">
          <span class="skill-name">${item.name}</span>
          <span class="skill-tag ${item.tagClass}">${item.tagLabel}</span>
        </div>
        <p class="skill-desc">${item.description || "Core engineering competency"}</p>
        <div class="skill-footer">
          <span>${item.category_label || item.category || ""}</span>
          ${item.weight ? `<span>Weight: ${item.weight}x</span>` : ""}
        </div>
      `;
      skillsGridContainer.appendChild(card);
    });
  }

  // Filter Pill Listeners
  skillFilterPills.forEach(pill => {
    pill.addEventListener("click", () => {
      skillFilterPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      activeFilter = pill.getAttribute("data-filter");
      if (currentReport && currentReport.skills) {
        renderSkillsGrid(currentReport.skills);
      }
    });
  });

  function renderRoadmap(learningPath) {
    milestonesContainer.innerHTML = "";
    const summary = learningPath.summary || {};
    const milestones = learningPath.milestones || [];

    roadmapTotalHours.textContent = `${summary.total_estimated_hours || 0} Hours`;
    roadmapWeeks.textContent = `${summary.estimated_completion_weeks || 0} Weeks Plan`;

    if (milestones.length === 0) {
      milestonesContainer.innerHTML = `
        <div class="milestone-block">
          <h4>No Critical Skill Gaps Identified!</h4>
          <p class="field-hint">Candidate possesses all key technical competencies required for this role.</p>
        </div>
      `;
      return;
    }

    milestones.forEach(m => {
      const block = document.createElement("div");
      block.className = "milestone-block";

      const stepsHtml = (m.steps || []).map(step => `
        <div class="step-card">
          <div class="step-top">
            <div class="step-title">
              <span class="step-num">${step.step_number}</span>
              <span>${step.skill_name}</span>
            </div>
            <div class="step-meta">
              <span>${step.importance_label}</span> •
              <span>${step.difficulty}</span> •
              <strong>~${step.est_hours} hrs</strong>
            </div>
          </div>

          ${step.prerequisites && step.prerequisites.length > 0 ? `
            <div style="font-size: 11px; color: var(--text-dim); margin-bottom: 6px;">
              Prerequisites: <em>${step.prerequisites.join(", ")}</em>
            </div>
          ` : ""}

          ${step.syllabus && step.syllabus.length > 0 ? `
            <div class="step-syllabus">
              ${step.syllabus.map(item => `<span class="syllabus-item">✓ ${item}</span>`).join("")}
            </div>
          ` : ""}

          ${step.mini_project ? `
            <div class="step-project-box">
              <strong>Hands-On Milestone:</strong> ${step.mini_project}
            </div>
          ` : ""}

          ${step.resources && step.resources.length > 0 ? `
            <div class="step-resources">
              ${step.resources.map(res => `
                <a href="${res.url}" target="_blank" rel="noopener noreferrer" class="resource-btn">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  ${res.title} (${res.cost})
                </a>
              `).join("")}
            </div>
          ` : ""}
        </div>
      `).join("");

      block.innerHTML = `
        <div class="milestone-header">
          <div class="milestone-title-wrap">
            <h4>${m.title}</h4>
            <p class="milestone-desc">${m.description}</p>
          </div>
          <span class="milestone-badge">Est. ${m.est_weeks} Weeks</span>
        </div>
        <div class="step-cards-list">
          ${stepsHtml}
        </div>
      `;
      milestonesContainer.appendChild(block);
    });
  }

  // ================= History Drawer =================
  historyBtn.addEventListener("click", () => {
    openHistoryDrawer();
  });

  closeDrawerBtn.addEventListener("click", () => {
    closeHistoryDrawer();
  });

  drawerBackdrop.addEventListener("click", () => {
    closeHistoryDrawer();
  });

  function openHistoryDrawer() {
    historyDrawer.classList.remove("hidden");
    drawerBackdrop.classList.remove("hidden");
    loadHistoryList();
  }

  function closeHistoryDrawer() {
    historyDrawer.classList.add("hidden");
    drawerBackdrop.classList.add("hidden");
  }

  async function updateHistoryCount() {
    try {
      const res = await fetch("/api/history");
      const list = await res.json();
      historyCount.textContent = list.length;
    } catch (e) {
      console.warn("Could not fetch history count");
    }
  }

  async function loadHistoryList() {
    historyListContainer.innerHTML = `<div class="field-hint">Loading history records...</div>`;
    try {
      const res = await fetch("/api/history");
      const records = await res.json();

      if (records.length === 0) {
        historyListContainer.innerHTML = `<div class="field-hint">No past analyses recorded yet. Run an analysis to track history.</div>`;
        return;
      }

      historyListContainer.innerHTML = "";
      records.forEach(rec => {
        const item = document.createElement("div");
        item.className = "history-item";

        const dateStr = new Date(rec.created_at).toLocaleDateString(undefined, {
          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
        });

        item.innerHTML = `
          <div class="history-item-top">
            <span class="history-title">${rec.candidate_name || "Candidate"}</span>
            <span class="history-score">${Math.round(rec.composite_score)}%</span>
          </div>
          <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">
            Target: ${rec.job_title || "Role"}
          </div>
          <div class="history-meta">
            <span>${dateStr}</span> • <span>${rec.matched_count} Matched</span> • <span>${rec.missing_required_count} Missing Req</span>
          </div>
        `;

        item.addEventListener("click", async () => {
          try {
            const detailRes = await fetch(`/api/history/${rec.id}`);
            const detail = await detailRes.json();
            if (detail.report) {
              currentReport = detail.report;
              renderResults(detail.report);
              closeHistoryDrawer();
              showAlert(`Restored analysis: ${rec.candidate_name} -> ${rec.job_title}`, "success");
              resultsDashboard.scrollIntoView({ behavior: "smooth" });
            }
          } catch (err) {
            showAlert("Failed to load historical record details.", "danger");
          }
        });

        historyListContainer.appendChild(item);
      });
    } catch (err) {
      historyListContainer.innerHTML = `<div class="field-hint text-danger">Failed to fetch history list.</div>`;
    }
  }

  // ================= Alerts =================
  function showAlert(msg, type = "danger") {
    alertBanner.className = `alert-banner alert-${type}`;
    alertBanner.textContent = msg;
    alertBanner.classList.remove("hidden");
  }

  function hideAlert() {
    alertBanner.classList.add("hidden");
  }

  // Initial Boot
  loadPresets();
  updateHistoryCount();
});
