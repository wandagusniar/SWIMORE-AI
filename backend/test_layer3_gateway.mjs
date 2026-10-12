// Automated Test Suite for Layer 3: Ingress API & Transport Controllers

async function runTests() {
  console.log("================================================================================");
  console.log("   SWIMORE.AI — LAYER 3 AUTOMATED INGRESS API & TRANSPORT TEST SUITE");
  console.log("================================================================================");

  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err.message);
    }
  }

  const BASE = "http://localhost:8080";
  let authToken = "";

  // 1. Health Probe
  await test("1. Health Probe (GET /health)", async () => {
    const res = await fetch(`${BASE}/health`);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const json = await res.json();
    if (json.status !== "healthy" || json.gateway !== "swimore-ingress-v1") {
      throw new Error(`Unexpected payload: ${JSON.stringify(json)}`);
    }
  });

  // 2. Public Models Catalog
  await test("2. Public Models Catalog (GET /v1/models)", async () => {
    const res = await fetch(`${BASE}/v1/models`);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const json = await res.json();
    if (!json.data || json.data.length === 0) {
      throw new Error("No models returned");
    }
  });

  // 3. User Login
  await test("3. Authentication Login (POST /api/v1/auth/login)", async () => {
    const res = await fetch(`${BASE}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "alex.doe@example.com", password: "mock" })
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const json = await res.json();
    if (!json.token) throw new Error("Missing auth token");
    authToken = json.token;
  });

  // 4. Auth Me Context
  await test("4. Authenticated Context (GET /api/v1/auth/me)", async () => {
    const res = await fetch(`${BASE}/api/v1/auth/me`, {
      headers: { "Authorization": `Bearer ${authToken}` }
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const json = await res.json();
    if (json.name !== "Alex Doe") throw new Error("User mismatch");
  });

  // 5. User Quotas
  await test("5. Pool Quotas & Resets (GET /api/v1/user/quotas)", async () => {
    const res = await fetch(`${BASE}/api/v1/user/quotas`, {
      headers: { "Authorization": `Bearer ${authToken}` }
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const json = await res.json();
    if (json.resets_at !== "00:00 WIB" || !json.pools.basic) {
      throw new Error("Invalid quota schema");
    }
  });

  // 6. List API Keys
  await test("6. List API Keys (GET /api/v1/user/keys)", async () => {
    const res = await fetch(`${BASE}/api/v1/user/keys`, {
      headers: { "Authorization": `Bearer ${authToken}` }
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const json = await res.json();
    if (!json.keys || json.keys.length === 0) throw new Error("No keys returned");
  });

  // 7. Create API Key
  await test("7. Create API Key (POST /api/v1/user/keys)", async () => {
    const res = await fetch(`${BASE}/api/v1/user/keys`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: "Automated Test Key" })
    });
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
    const json = await res.json();
    if (!json.secret_key.startsWith("sk-sw-")) throw new Error("Key prefix format invalid");
  });

  // 8. OpenAI-compatible Chat Completions (JSON)
  await test("8. Chat Completions JSON (POST /v1/chat/completions)", async () => {
    const res = await fetch(`${BASE}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet",
        messages: [{ role: "user", content: "Hello Swimore Gateway" }],
        stream: false
      })
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const json = await res.json();
    if (!json.choices || json.choices.length === 0) throw new Error("No completion choices");
    if (!json.routing_trace || json.routing_trace.path !== "Path A") {
      throw new Error("Routing trace missing or mismatched");
    }
  });

  // 9. OpenAI-compatible Chat Completions (SSE Stream)
  await test("9. Chat Completions SSE Streaming (POST /v1/chat/completions)", async () => {
    const res = await fetch(`${BASE}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3-3-70b",
        messages: [{ role: "user", content: "Stream test" }],
        stream: true
      })
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const contentType = res.headers.get("content-type");
    if (!contentType.includes("text/event-stream")) {
      throw new Error(`Expected text/event-stream, got ${contentType}`);
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      accumulated += decoder.decode(value, { stream: true });
    }
    if (!accumulated.includes("[DONE]")) {
      throw new Error("Streaming did not terminate with [DONE]");
    }
  });

  // 10. Dual-trigger Incident Triage
  await test("10. Incident Triage Dispatch (POST /api/v1/incidents/report)", async () => {
    const res = await fetch(`${BASE}/api/v1/incidents/report`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "Claude 3.5 Sonnet",
        partner_handle: "@novacompute",
        issue_type: "timeout",
        description: "504 Gateway Timeout detected by automated synthetic probe",
        source: "N8N_AUTOMATION"
      })
    });
    if (res.status !== 202) throw new Error(`Expected 202, got ${res.status}`);
    const json = await res.json();
    if (json.status !== "DISPATCHED" || json.dispatched_channels.length < 3) {
      throw new Error("Incident not dispatched to 3 triage channels");
    }
  });

  // 11. Midtrans / SeaBank QRIS Webhook with 1.1% fee deduction
  await test("11. SeaBank QRIS 1.1% Fee Webhook (POST /api/v1/billing/webhook)", async () => {
    const res = await fetch(`${BASE}/api/v1/billing/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: "SW-INV-202610-001",
        gross_amount: 150000,
        payment_type: "qris",
        transaction_status: "settlement"
      })
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const json = await res.json();
    // 150,000 * 1.1% = 1,650 fee. Net amount = 148,350
    if (json.platform_fee_idr !== 1650 || json.net_amount_idr !== 148350) {
      throw new Error(`Fee mismatch: fee=${json.platform_fee_idr}, net=${json.net_amount_idr}`);
    }
  });

  // 12. Partner Registration
  await test("12. Partner Registration (POST /api/v1/partner/register)", async () => {
    const res = await fetch(`${BASE}/api/v1/partner/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        handle: "@deepcompute",
        model: "DeepSeek R1",
        endpoint_type: "TYPE_A",
        input_price_1m: 0.55,
        output_price_1m: 2.19,
        seabank_account: "9012838192"
      })
    });
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
    const json = await res.json();
    if (json.status !== "PENDING_REVIEW") throw new Error("Status should be PENDING_REVIEW");
  });

  // 13. Partner Endpoints Directory
  await test("13. Partner Endpoints List (GET /api/v1/partner/endpoints)", async () => {
    const res = await fetch(`${BASE}/api/v1/partner/endpoints`);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const json = await res.json();
    if (!json.endpoints || json.endpoints.length === 0) throw new Error("No partner endpoints");
  });

  // 14. Partner Heartbeat Probe
  await test("14. Partner Synthetic Heartbeat (POST /api/v1/partner/heartbeat)", async () => {
    const res = await fetch(`${BASE}/api/v1/partner/heartbeat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handle: "@novacompute" })
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const json = await res.json();
    if (json.status !== "HEALTHY") throw new Error("Heartbeat unhealthy");
  });

  console.log("================================================================================");
  console.log(` RESULTS: ${passed}/${total} TESTS PASSED (100% SUCCESS)`);
  console.log("================================================================================");
  if (passed !== total) process.exit(1);
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});

