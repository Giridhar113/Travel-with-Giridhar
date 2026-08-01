(function () {
  const tokenKey = "travelWithGiridharAdminToken";
  const adminKey = "travelWithGiridharAdminUser";
  const page = document.body.dataset.adminPage;
  const siteConfig = window.TRAVEL_SITE_CONFIG || {};
  const apiBaseUrl = String(siteConfig.apiBaseUrl || "http://localhost:5000").replace(/\/$/, "");
  const state = {
    bookings: [],
    filtered: [],
    status: "",
    paymentStatus: "",
    query: "",
    sortKey: "createdAt",
    sortDirection: "desc",
    page: 1,
    pageSize: 15,
    selectedBooking: null,
    charts: {},
  };

  function getToken() {
    return sessionStorage.getItem(tokenKey);
  }

  function getAdmin() {
    try {
      return JSON.parse(sessionStorage.getItem(adminKey) || "{}");
    } catch (error) {
      return {};
    }
  }

  function requireAuth() {
    if (page !== "login" && !getToken()) {
      window.location.href = "login.html";
      return false;
    }

    return true;
  }

  function apiUrl(path) {
    return `${apiBaseUrl}${path}`;
  }

  async function apiFetch(path, options) {
    const headers = {
      "Content-Type": "application/json",
      ...(options && options.headers ? options.headers : {}),
    };
    const token = getToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(apiUrl(path), {
      ...options,
      headers,
    });
    const data = await response.json().catch(function () {
      return {};
    });

    if (!response.ok) {
      const error = new Error(data.error || "Request failed.");
      error.status = response.status;
      throw error;
    }

    return data;
  }

  function formatDate(value) {
    if (!value) {
      return "Not set";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  }

  function formatDateTime(value) {
    if (!value) {
      return "Not available";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  }

  function formatRupees(value) {
    return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
  }

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = String(value || "");
    return div.innerHTML;
  }

  function labelize(value) {
    return String(value || "new")
      .replace(/-/g, " ")
      .replace(/\b\w/g, function (letter) {
        return letter.toUpperCase();
      });
  }

  function statusBadge(status) {
    const safeStatus = String(status || "new").toLowerCase();
    return `<span class="status-badge status-${safeStatus}">${labelize(safeStatus)}</span>`;
  }

  function paymentBadge(status) {
    const safeStatus = String(status || "pending").toLowerCase();
    return `<span class="payment-badge payment-${safeStatus}">${labelize(safeStatus)}</span>`;
  }

  function setButtonLoading(button, isLoading) {
    if (!button) {
      return;
    }

    button.disabled = isLoading;
    button.classList.toggle("is-loading", isLoading);
  }

  function initLogin() {
    const form = document.getElementById("adminLoginForm");
    const loginError = document.getElementById("loginError");

    if (!form) {
      return;
    }

    if (getToken()) {
      window.location.href = "dashboard.html";
      return;
    }

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const submitButton = form.querySelector('button[type="submit"]');
      const buttonText = submitButton && submitButton.querySelector(".btn-text");
      const email = form.elements.email.value.trim();
      const pin = form.elements.pin.value;
      let valid = true;

      form.querySelector('[data-error-for="email"]').textContent = "";
      form.querySelector('[data-error-for="pin"]').textContent = "";
      loginError.textContent = "";

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        form.querySelector('[data-error-for="email"]').textContent = "Enter a valid admin email.";
        valid = false;
      }

      if (!pin) {
        form.querySelector('[data-error-for="pin"]').textContent = "Admin PIN is required.";
        valid = false;
      }

      if (!valid) {
        return;
      }

      setButtonLoading(submitButton, true);
      if (buttonText) {
        buttonText.textContent = "Verifying PIN...";
      }

      try {
        const data = await apiFetch("/api/admin/login", {
          method: "POST",
          body: JSON.stringify({ email, pin, password: pin }),
        });
        sessionStorage.setItem(tokenKey, data.token);
        sessionStorage.setItem(adminKey, JSON.stringify(data.admin || { email }));
        document.body.classList.add("auth-success");
        form.classList.add("login-approved");
        if (buttonText) {
          buttonText.textContent = "Opening dashboard...";
        }
        window.setTimeout(function () {
          window.location.href = "dashboard.html";
        }, 720);
      } catch (error) {
        loginError.textContent = error.message;
        if (buttonText) {
          buttonText.textContent = "Login";
        }
      } finally {
        if (!form.classList.contains("login-approved")) {
          setButtonLoading(submitButton, false);
        }
      }
    });
  }

  function initShell() {
    if (!requireAuth()) {
      return false;
    }

    const admin = getAdmin();
    const adminEmail = document.getElementById("adminEmail");
    const sidebar = document.getElementById("adminSidebar");
    const backdrop = document.getElementById("sidebarBackdrop");

    if (adminEmail && admin.email) {
      adminEmail.textContent = admin.email;
    }

    document.querySelectorAll("[data-logout]").forEach(function (button) {
      button.addEventListener("click", function () {
        sessionStorage.removeItem(tokenKey);
        sessionStorage.removeItem(adminKey);
        window.location.href = "login.html";
      });
    });

    const menuToggle = document.getElementById("menuToggle");

    if (menuToggle && sidebar && backdrop) {
      menuToggle.addEventListener("click", function () {
        sidebar.classList.add("is-open");
        backdrop.classList.add("is-open");
      });
      backdrop.addEventListener("click", function () {
        sidebar.classList.remove("is-open");
        backdrop.classList.remove("is-open");
      });
    }

    return true;
  }

  async function loadBookings(filters) {
    const params = new URLSearchParams();

    if (filters && filters.status) {
      params.set("status", filters.status);
    }

    if (filters && filters.paymentStatus) {
      params.set("paymentStatus", filters.paymentStatus);
    }

    const data = await apiFetch(`/api/admin/bookings${params.toString() ? `?${params}` : ""}`);
    state.bookings = data.bookings || [];
    return data;
  }

  function getThisWeekBookings(bookings, paymentStatus) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return bookings.filter(function (booking) {
      const matchesPayment = !paymentStatus || booking.paymentStatus === paymentStatus;
      return matchesPayment && new Date(booking.createdAt) >= weekAgo;
    });
  }

  function getMonthRevenue(bookings) {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    return bookings
      .filter(function (booking) {
        return booking.paymentStatus === "paid" && new Date(booking.createdAt) >= monthStart;
      })
      .reduce(function (sum, booking) {
        return sum + Number(booking.amount || 0);
      }, 0);
  }

  function renderDashboardStats(bookings, stats) {
    const statsGrid = document.getElementById("dashboardStats");
    const paidThisWeek = stats.paidThisWeek || getThisWeekBookings(bookings, "paid").length;
    const revenueThisMonth = stats.revenueThisMonth || getMonthRevenue(bookings);

    statsGrid.innerHTML = [
      ["Total Bookings", stats.total || bookings.length, "All stored inquiries"],
      ["New Leads", stats.new || bookings.filter((booking) => booking.status === "new").length, "Need first response"],
      ["This Week", stats.thisWeek || getThisWeekBookings(bookings).length, "Recent booking demand"],
      ["Paid This Week", paidThisWeek, `${formatRupees(revenueThisMonth)} revenue this month`],
    ]
      .map(function ([title, value, helper]) {
        return `
          <article class="stat-card">
            <span>${escapeHtml(title)}</span>
            <strong>${escapeHtml(value)}</strong>
            <small>${escapeHtml(helper)}</small>
          </article>
        `;
      })
      .join("");
  }

  function getWeeklyData(bookings) {
    const now = new Date();
    const buckets = Array.from({ length: 6 }).map(function (_, index) {
      const start = new Date(now);
      start.setDate(now.getDate() - (5 - index) * 7);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      return {
        label: start.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        start,
        end,
        count: 0,
      };
    });

    bookings.forEach(function (booking) {
      const created = new Date(booking.createdAt);
      const bucket = buckets.find(function (item) {
        return created >= item.start && created <= item.end;
      });

      if (bucket) {
        bucket.count += 1;
      }
    });

    return buckets;
  }

  function getStatusData(bookings) {
    return ["new", "contacted", "confirmed", "closed"].map(function (status) {
      return {
        label: labelize(status),
        count: bookings.filter((booking) => booking.status === status).length,
      };
    });
  }

  function renderCharts(bookings) {
    if (!window.Chart) {
      return;
    }

    const weeklyCanvas = document.getElementById("weeklyBookingsChart");
    const statusCanvas = document.getElementById("statusBreakdownChart");
    const weeklyData = getWeeklyData(bookings);
    const statusData = getStatusData(bookings);

    if (state.charts.weekly) {
      state.charts.weekly.destroy();
    }

    if (state.charts.status) {
      state.charts.status.destroy();
    }

    state.charts.weekly = new Chart(weeklyCanvas, {
      type: "bar",
      data: {
        labels: weeklyData.map((item) => item.label),
        datasets: [
          {
            label: "Bookings",
            data: weeklyData.map((item) => item.count),
            backgroundColor: "rgba(34, 211, 197, 0.35)",
            borderColor: "#22d3c5",
            borderWidth: 2,
            borderRadius: 12,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } },
        },
      },
    });

    state.charts.status = new Chart(statusCanvas, {
      type: "doughnut",
      data: {
        labels: statusData.map((item) => item.label),
        datasets: [
          {
            data: statusData.map((item) => item.count),
            backgroundColor: ["#f59e0b", "#3b82f6", "#22c55e", "#64748b"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "68%",
      },
    });
  }

  function renderRecentBookings(bookings) {
    const body = document.getElementById("recentBookingsBody");
    const recent = bookings.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

    if (!recent.length) {
      body.innerHTML = '<tr><td colspan="5">No bookings yet.</td></tr>';
      return;
    }

    body.innerHTML = recent
      .map(function (booking) {
        return `
          <tr>
            <td><strong>${escapeHtml(booking.name)}</strong><br><span class="muted">${escapeHtml(booking.email)}</span></td>
            <td><strong>${escapeHtml(booking.destination)}</strong><br><span class="muted">${escapeHtml(booking.package)}</span></td>
            <td>${paymentBadge(booking.paymentStatus)}</td>
            <td>${statusBadge(booking.status)}</td>
            <td>${escapeHtml(formatDateTime(booking.createdAt))}</td>
          </tr>
        `;
      })
      .join("");
  }

  async function initDashboard() {
    if (!initShell()) {
      return;
    }

    try {
      const data = await loadBookings();
      renderDashboardStats(state.bookings, data.stats || {});
      renderCharts(state.bookings);
      renderRecentBookings(state.bookings);
    } catch (error) {
      if (error.status === 401) {
        sessionStorage.removeItem(tokenKey);
        window.location.href = "login.html";
      }
    }
  }

  function applyBookingFilters() {
    const query = state.query.trim().toLowerCase();

    state.filtered = state.bookings
      .filter(function (booking) {
        const searchable = [booking.name, booking.email, booking.phone, booking.package, booking.destination]
          .join(" ")
          .toLowerCase();
        const matchesQuery = !query || searchable.includes(query);
        const matchesStatus = !state.status || booking.status === state.status;
        const matchesPayment = !state.paymentStatus || booking.paymentStatus === state.paymentStatus;

        return matchesQuery && matchesStatus && matchesPayment;
      })
      .sort(function (a, b) {
        const left = a[state.sortKey] || "";
        const right = b[state.sortKey] || "";
        const modifier = state.sortDirection === "asc" ? 1 : -1;

        if (state.sortKey === "createdAt" || state.sortKey === "travelDate") {
          return (new Date(left) - new Date(right)) * modifier;
        }

        return String(left).localeCompare(String(right)) * modifier;
      });

    renderBookingsTable();
  }

  function renderBookingsTable() {
    const body = document.getElementById("bookingsTableBody");
    const count = document.getElementById("bookingsCount");
    const label = document.getElementById("paginationLabel");
    const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));

    if (state.page > totalPages) {
      state.page = totalPages;
    }

    const start = (state.page - 1) * state.pageSize;
    const pageRows = state.filtered.slice(start, start + state.pageSize);

    count.textContent = `Showing ${state.filtered.length} booking${state.filtered.length === 1 ? "" : "s"}`;
    label.textContent = `Page ${state.page} of ${totalPages}`;
    document.getElementById("prevPage").disabled = state.page === 1;
    document.getElementById("nextPage").disabled = state.page === totalPages;

    if (!pageRows.length) {
      body.innerHTML = '<tr><td colspan="10">No bookings found for this filter.</td></tr>';
      return;
    }

    body.innerHTML = pageRows
      .map(function (booking) {
        return `
          <tr data-booking-id="${escapeHtml(booking._id)}">
            <td><strong>${escapeHtml(booking.name)}</strong></td>
            <td>${escapeHtml(booking.email)}</td>
            <td>${escapeHtml(booking.phone)}</td>
            <td>${escapeHtml(booking.package)}</td>
            <td>${escapeHtml(booking.destination)}</td>
            <td>${escapeHtml(formatDate(booking.travelDate))}</td>
            <td>${escapeHtml(booking.travelers)}</td>
            <td>${statusBadge(booking.status)}</td>
            <td>${paymentBadge(booking.paymentStatus)}</td>
            <td>${escapeHtml(formatDateTime(booking.createdAt))}</td>
          </tr>
        `;
      })
      .join("");
  }

  function openDrawer(booking) {
    state.selectedBooking = booking;
    const drawer = document.getElementById("bookingDrawer");
    const backdrop = document.getElementById("drawerBackdrop");
    const title = document.getElementById("drawerTitle");
    const body = document.getElementById("drawerBody");

    title.textContent = booking.name;
    body.innerHTML = `
      <div class="drawer-grid">
        ${detailTile("Email", booking.email)}
        ${detailTile("Phone", booking.phone)}
        ${detailTile("Destination", booking.destination)}
        ${detailTile("Package", booking.package)}
        ${detailTile("Travel Date", formatDate(booking.travelDate))}
        ${detailTile("Travelers", booking.travelers)}
        ${detailTile("Amount", formatRupees(booking.amount))}
        ${detailTile("Payment", paymentBadge(booking.paymentStatus), true)}
        ${detailTile("Razorpay Order", booking.razorpayOrderId || "Not created")}
        ${detailTile("Razorpay Payment", booking.razorpayPaymentId || "Not paid")}
      </div>
      <label class="search-control">
        Update lead status
        <select id="drawerStatusSelect">
          ${["new", "contacted", "confirmed", "closed"]
            .map(function (status) {
              return `<option value="${status}" ${booking.status === status ? "selected" : ""}>${labelize(status)}</option>`;
            })
            .join("")}
        </select>
      </label>
      <section class="message-tile">
        <span>Message</span>
        <p>${escapeHtml(booking.message || "No special requests added.")}</p>
      </section>
    `;

    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    backdrop.classList.add("is-open");
    document.body.style.overflow = "hidden";

    document.getElementById("drawerStatusSelect").addEventListener("change", function (event) {
      updateBookingStatus(booking._id, event.target.value);
    });
  }

  function detailTile(label, value, allowHtml) {
    return `<div class="detail-tile"><span>${escapeHtml(label)}</span><strong>${
      allowHtml ? value : escapeHtml(value)
    }</strong></div>`;
  }

  function closeDrawer() {
    const drawer = document.getElementById("bookingDrawer");
    const backdrop = document.getElementById("drawerBackdrop");

    if (!drawer || !backdrop) {
      return;
    }

    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    backdrop.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  async function updateBookingStatus(bookingId, nextStatus) {
    const booking = state.bookings.find((item) => item._id === bookingId);
    const previousStatus = booking ? booking.status : "";

    if (booking) {
      booking.status = nextStatus;
      applyBookingFilters();
      openDrawer(booking);
    }

    try {
      await apiFetch(`/api/admin/bookings/${encodeURIComponent(bookingId)}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (error) {
      if (booking) {
        booking.status = previousStatus;
        applyBookingFilters();
        openDrawer(booking);
      }
      window.alert(error.message);
    }
  }

  function debounce(callback, delay) {
    let timer;
    return function (...args) {
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        callback.apply(null, args);
      }, delay);
    };
  }

  function bindBookingsEvents() {
    document.getElementById("bookingSearch").addEventListener(
      "input",
      debounce(function (event) {
        state.query = event.target.value;
        state.page = 1;
        applyBookingFilters();
      }, 180)
    );

    document.querySelectorAll("[data-status-filter]").forEach(function (button) {
      button.addEventListener("click", function () {
        document.querySelectorAll("[data-status-filter]").forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        state.status = button.dataset.statusFilter;
        state.page = 1;
        applyBookingFilters();
      });
    });

    document.querySelectorAll("[data-payment-filter]").forEach(function (button) {
      button.addEventListener("click", function () {
        document.querySelectorAll("[data-payment-filter]").forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        state.paymentStatus = button.dataset.paymentFilter;
        state.page = 1;
        applyBookingFilters();
      });
    });

    document.querySelectorAll("[data-sort-key]").forEach(function (button) {
      button.addEventListener("click", function () {
        const key = button.dataset.sortKey;
        state.sortDirection = state.sortKey === key && state.sortDirection === "asc" ? "desc" : "asc";
        state.sortKey = key;
        applyBookingFilters();
      });
    });

    document.getElementById("prevPage").addEventListener("click", function () {
      state.page = Math.max(1, state.page - 1);
      renderBookingsTable();
    });

    document.getElementById("nextPage").addEventListener("click", function () {
      const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
      state.page = Math.min(totalPages, state.page + 1);
      renderBookingsTable();
    });

    document.getElementById("bookingsTableBody").addEventListener("click", function (event) {
      const row = event.target.closest("[data-booking-id]");

      if (!row) {
        return;
      }

      const booking = state.bookings.find((item) => item._id === row.dataset.bookingId);

      if (booking) {
        openDrawer(booking);
      }
    });

    document.getElementById("closeDrawer").addEventListener("click", closeDrawer);
    document.getElementById("drawerBackdrop").addEventListener("click", closeDrawer);
    document.getElementById("refreshBookings").addEventListener("click", initBookingsPage);
  }

  async function initBookingsPage() {
    if (!initShell()) {
      return;
    }

    try {
      await loadBookings();
      state.filtered = state.bookings.slice();
      applyBookingFilters();
    } catch (error) {
      if (error.status === 401) {
        sessionStorage.removeItem(tokenKey);
        window.location.href = "login.html";
      }
    }
  }

  if (page === "login") {
    initLogin();
  }

  if (page === "dashboard") {
    initDashboard();
  }

  if (page === "bookings") {
    bindBookingsEvents();
    initBookingsPage();
  }
})();
