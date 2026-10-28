(function () {
  "use strict";
  var config = window.GLASFORD_SUPABASE_CONFIG || {};
  if (!config.url || !config.publishableKey) return;

  var client = null;
  var ready = false, loading = false, revision = null, currentUser = null, blocked = false;
  var activeWrites = 0, writeQueue = Promise.resolve(), callbacks = null;
  var channel = null;
  var app = document.getElementById("app");

  function safe(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (v) {
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[v];
    });
  }
  function notice(msg, isError) {
    var el = document.getElementById("toast");
    if (!el) return;
    var item = document.createElement("div");
    item.className = "toast-item";
    item.textContent = msg;
    if (isError) item.style.background = "#893a34";
    el.appendChild(item);
    setTimeout(function () { item.remove(); }, 7500);
  }
  function authScreen(message, isError) {
    ready = false;
    document.body.style.overflow = "";
    app.innerHTML = '<div class="auth-wrap"><div class="auth-panel">' +
      '<img class="auth-logo" src="https://assets.cdn.filesafe.space/bF1dT8IAVuvat84LkAVe/media/6ae0bab4c62ddbd638d94b5b.png" alt="Glasford Tree Trimming" />' +
      '<div class="auth-overline">GLASFORD TREE TRIMMING</div><h1>Command Center</h1>' +
      '<p>Secure access to your leads, jobs, estimates, calendar and follow-ups.</p>' +
      '<form id="glasford-login-form"><label for="glasford-login-email">Email address</label>' +
      '<input id="glasford-login-email" name="email" type="email" autocomplete="email" inputmode="email" placeholder="you@example.com" required />' +
      '<button class="btn btn-primary" id="glasford-login-button" type="submit">Email me a sign-in link</button></form>' +
      '<div class="auth-help">We will email you a secure, one-time sign-in link. Open it on the device you want to use.</div>' +
      (message ? '<div class="auth-message' + (isError ? ' auth-error' : '') + '" role="status">' + safe(message) + '</div>' : '') +
      '</div></div>';
    document.getElementById("glasford-login-form").addEventListener("submit", async function (e) {
      e.preventDefault();
      var email = document.getElementById("glasford-login-email").value.trim().toLowerCase();
      var button = document.getElementById("glasford-login-button");
      button.disabled = true;
      button.textContent = "Sending link...";
      try {
        var r = await client.auth.signInWithOtp({
          email: email,
          options: { emailRedirectTo: window.location.origin + "/", shouldCreateUser: true }
        });
        if (r.error) throw r.error;
        authScreen("If this email is authorized, a sign-in link is on its way. Check your inbox.");
      } catch (err) {
        authScreen("Couldn't send the link: " + (err.message || "Please retry."), true);
      }
    });
  }
  function loadingScreen() {
    app.innerHTML = '<div class="auth-wrap"><div class="auth-panel"><h1>Glasford Command Center</h1><p>Loading your secure workspace...</p></div></div>';
  }
  async function loadWorkspace() {
    if (loading || !currentUser) return;
    loading = true;
    loadingScreen();
    try {
      var result = await client.from("glasford_workspace").select("snapshot,revision").eq("id", "main").maybeSingle();
      if (result.error) throw result.error;
      if (!result.data) {
        authScreen("This email doesn't have access to the Glasford CRM. Contact Ignite Co. to request access.", true);
        return;
      }
      revision = Number(result.data.revision);
      blocked = false;
      ready = true;
      callbacks.onData(result.data.snapshot);
      watchChanges();
    } catch (err) {
      ready = false;
      authScreen("Could not open your workspace: " + (err.message || "Unknown error"), true);
    } finally {
      loading = false;
    }
  }
  function watchChanges() {
    if (channel) return;
    channel = client.channel("glasford-workspace-sync")
      .on("postgres_changes", { event:"UPDATE", schema:"public", table:"glasford_workspace", filter:"id=eq.main" }, function (event) {
        var next = event.new;
        if (!next || !ready || Number(next.revision) <= revision) return;
        if (activeWrites || document.querySelector(".drawer form")) {
          notice("New changes from another device. Finish your work, then refresh to see them.", true);
          return;
        }
        revision = Number(next.revision);
        callbacks.onData(next.snapshot);
        notice("Workspace updated from another device");
      })
      .subscribe();
  }
  async function checkForUpdates() {
    if (!ready || activeWrites || loading || document.querySelector(".drawer form")) return;
    var r = await client.from("glasford_workspace").select("snapshot,revision").eq("id","main").maybeSingle();
    if (r.error || !r.data || Number(r.data.revision) <= revision) return;
    revision = Number(r.data.revision);
    callbacks.onData(r.data.snapshot);
  }
  function queueSave(snapshot) {
    if (!ready || blocked) {
      notice("Workspace is not writable. Refresh before making further changes.", true);
      return;
    }
    var content = JSON.parse(JSON.stringify(snapshot));
    activeWrites++;
    writeQueue = writeQueue.then(async function () {
      if (blocked) return;
      var r = await client.from("glasford_workspace").update({
        snapshot: content, revision: revision + 1, updated_at: new Date().toISOString(), updated_by: currentUser.id
      }).eq("id", "main").eq("revision", revision).select("revision").maybeSingle();
      if (r.error) throw r.error;
      if (!r.data) {
        blocked = true;
        notice("Another device saved newer changes. Export a backup if needed, then refresh before editing again.", true);
        window.alert("Another device updated this workspace. Your latest change was not saved. Export a backup in Settings if needed, then refresh to load the latest records.");
        return;
      }
      revision = Number(r.data.revision);
    }).catch(function (err) {
      blocked = true;
      notice("Cloud save failed: " + (err.message || "Unknown error") + ". Export a backup, then refresh.", true);
    }).finally(function () {
      activeWrites--;
    });
  }
  async function signOut() {
    blocked = true;
    ready = false;
    await writeQueue;
    if (channel) { await client.removeChannel(channel); channel = null; }
    await client.auth.signOut();
    currentUser = null;
    revision = null;
    authScreen();
  }
  function mount(hooks) {
    callbacks = hooks;
    if (!window.supabase || typeof window.supabase.createClient !== "function") {
      app.textContent = "Unable to load secure sign-in. Check your connection and refresh.";
      return;
    }
    client = window.supabase.createClient(config.url, config.publishableKey, {
      auth: { persistSession:true, autoRefreshToken:true, detectSessionInUrl:true }
    });
    loadingScreen();
    client.auth.onAuthStateChange(function (event, session) {
      if (event === "SIGNED_OUT") {
        currentUser = null; ready = false; revision = null;
        authScreen();
      } else if (event === "SIGNED_IN" && session && !ready && !loading) {
        currentUser = session.user;
        setTimeout(function () { loadWorkspace(); }, 0);
      }
    });
    client.auth.getSession().then(function (r) {
      if (r.error) { authScreen(r.error.message, true); return; }
      if (r.data.session) { currentUser = r.data.session.user; loadWorkspace(); }
      else authScreen();
    }).catch(function (e) { authScreen(e.message || "Sign-in could not start", true); });
    window.addEventListener("focus", function () { checkForUpdates().catch(function () {}); });
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) checkForUpdates().catch(function () {});
    });
    setInterval(function () { checkForUpdates().catch(function () {}); }, 30000);
  }
  window.GLASFORD_CLOUD = {
    mount: mount, queueSave: queueSave, signOut: signOut,
    get ready() { return ready; },
    get email() { return currentUser ? currentUser.email : ""; }
  };
})();
