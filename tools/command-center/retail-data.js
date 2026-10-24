  /* Retail Command Center demonstration data.
     Every company, record, policy and value is illustrative. The two perspectives
     use corresponding examples; changing perspective does not connect an account.
     Process indices refer to GENOME.retail.short. All times are Eastern Time. */
  var RTDATA = {
    snapshot: {
      date: "2026-10-24",
      time: "09:30 ET",
      label: "24 Oct 2026 · 09:30 ET · Illustrative",
      timezone: "America/New_York",
      mode: "Illustrative scenario",
      note: "A fixed demonstration snapshot. No live integrations, document transmissions or financial actions."
    },
    roles: {
      retailer: {
        company: "Northfield Stores", label: "Retailer", partnerLabel: "Suppliers",
        direction: "Outbound orders · inbound fulfillment and invoices",
        orderLabel: "Purchase orders", shipmentLabel: "Inbound shipments", invoiceLabel: "Supplier invoices",
        overview: "Coordinate supplier participation, purchase commitments, inbound shipment information and payable exceptions."
      },
      supplier: {
        company: "Nuvori Beauty", label: "CPG supplier", partnerLabel: "Retail accounts",
        direction: "Inbound orders · outbound fulfillment and invoices",
        orderLabel: "Retailer orders", shipmentLabel: "Outbound shipments", invoiceLabel: "Retailer billing",
        overview: "Coordinate retail account requirements, order commitments, shipment notices and receivable exceptions."
      }
    },
    workflows: [
      { id: "partners", title: "Partner readiness", subtitle: "Required feeds, configuration and connection health", icon: "users", processes: [0, 4, 10] },
      { id: "orders", title: "Order commitments", subtitle: "Acknowledgments, accepted changes and fulfillment instructions", icon: "flow", processes: [0, 7, 8] },
      { id: "shipments", title: "Shipment readiness", subtitle: "Notice conformance, routing sequence and receiving evidence", icon: "net", processes: [1, 2, 8] },
      { id: "invoices", title: "Invoice and deduction control", subtitle: "Price matching, settlement evidence and review ownership", icon: "check", processes: [0, 1, 3, 9] }
    ],
    cases: [
      {
        id: "rt-partner-signature", workflow: "partners", title: "Order feed failing signature checks",
        source: "IM", agent: "Ivy", severity: "critical", process: 0,
        ruleId: "rt-rule-signature", partnerId: "pt-nuvori", owner: "Alex Morgan · Integration operations",
        reference: "AS2-1024-0912", amount: null, unit: "failed attempts", value: 12,
        policy: "Connection policy AS2-04: alert after 5 signature-validation failures within 15 minutes on this connection.",
        roles: {
          retailer: { partner: "Nuvori Beauty", direction: "Outbound 850 order feed", summary: "Twelve order-delivery attempts to Nuvori Beauty failed signature validation between 09:00 and 09:12.", impact: "Order transmission is impaired. The failed-attempt count does not establish how many distinct orders are affected.", nextAction: "Review the connection evidence with the supplier's integration team and agree a replay plan after signature validation succeeds." },
          supplier: { partner: "Northfield Stores", direction: "Inbound 850 order feed", summary: "Twelve inbound delivery attempts from Northfield Stores failed signature validation between 09:00 and 09:12.", impact: "The inbound order channel is impaired. No accepted business documents can be established from these failed attempts.", nextAction: "Review the configured signing certificate with the retailer's integration team and agree a replay plan after validation succeeds." }
        },
        documents: [
          { type: "AS2", id: "AS2-1024-0912", status: "fail", time: "09:12", detail: "Most recent failed transmission attempt" },
          { type: "MDN", id: "MDN-1024-0912", status: "fail", time: "09:12", detail: "Negative transport receipt: signature validation failed" },
          { type: "850 feed", id: "Last accepted interchange", status: "pass", time: "08:08", detail: "Last successful transport and translation event" }
        ],
        checks: [
          { name: "Connection reachability", expected: "Partner AS2 endpoint responds", observed: "Endpoint responded to all 12 attempts", status: "pass" },
          { name: "Signature validation", expected: "Configured signing certificate accepted", observed: "12 failed validations in 12 minutes", status: "fail" },
          { name: "Failure-burst threshold", expected: "Fewer than 5 failures in 15 minutes", observed: "12 failures in the current window", status: "fail" },
          { name: "Affected order count", expected: "Accepted and deduplicated business-document evidence", observed: "Unavailable for failed attempts", status: "unknown" }
        ],
        timeline: [
          { time: "08:08", title: "Last successful interchange", detail: "Transport and translation completed for the preceding batch.", status: "pass" },
          { time: "09:00", title: "First signature failure", detail: "The receiving gateway rejected signature validation.", status: "fail" },
          { time: "09:05", title: "Connection threshold exceeded", detail: "The fifth failure met this connection's configured alert threshold.", status: "fail" },
          { time: "09:12", title: "Twelve attempts affected", detail: "Ivy grouped the attempts into one connection finding.", status: "fail" }
        ],
        explanation: "The AS2 endpoint is reachable, but signature validation is failing. This points to a connection or signing-configuration issue; the available telemetry does not prove which party changed a certificate. Ivy groups transport evidence without inferring order-level business failure.",
        evidenceGap: "No trusted business acceptance, unique order count or order value is available for the failed attempts.",
        action: { label: "Prepare connection review", completedLabel: "Review prepared", completionNote: "An internal review packet is prepared for Integration operations. No certificate was changed and no documents were replayed." }
      },
      {
        id: "rt-partner-coverage", workflow: "partners", title: "One required document route is unconfigured",
        source: "IM", agent: "Ivy", severity: "attention", process: 0,
        ruleId: "rt-rule-coverage", partnerId: "pt-liora", owner: "Jordan Lee · Partner enablement",
        reference: "PROFILE-RT-CPG-02", amount: null, unit: "required route missing", value: 1,
        policy: "Partner profile RT-CPG-02 requires configured directions for 850, 855, 856, 810 and 997. The 846 is optional for this relationship.",
        roles: {
          retailer: { partner: "Liora Wellness", direction: "Supplier-to-retailer 856 route", summary: "Four of five required document directions are configured for Liora Wellness. The inbound supplier ship-notice route is missing.", impact: "The configured-document checklist is incomplete. This is an integration setup gap, not proof that a shipment is missing.", nextAction: "Prepare the missing 856 route requirement for Partner enablement, including the expected sender, receiver and document standard." },
          supplier: { partner: "Westline Home", direction: "Supplier-to-retailer 856 route", summary: "Four of five required document directions are configured for Westline Home. The outbound retailer ship-notice route is missing.", impact: "The account's configured-document checklist is incomplete. Successful order tests do not establish readiness to exchange ship notices.", nextAction: "Prepare the missing 856 route requirement for Partner enablement before completing this retail account's setup review." }
        },
        documents: [
          { type: "850", id: "CFG-850-021", status: "pass", time: "23 Oct 15:30", detail: "Required order direction configured" },
          { type: "855", id: "CFG-855-021", status: "pass", time: "23 Oct 15:35", detail: "Required acknowledgment direction configured" },
          { type: "856", id: "No route configured", status: "fail", time: "09:20", detail: "Required ship-notice direction missing" },
          { type: "810", id: "CFG-810-021", status: "pass", time: "23 Oct 15:40", detail: "Required invoice direction configured" },
          { type: "997", id: "CFG-997-021", status: "pass", time: "23 Oct 15:45", detail: "Functional acknowledgment direction configured" }
        ],
        checks: [
          { name: "Required document configuration", expected: "5 required directions configured", observed: "4 configured; 856 absent", status: "fail" },
          { name: "Optional inventory advice", expected: "846 excluded from required coverage", observed: "846 is marked not required", status: "pass" },
          { name: "Ship-notice test evidence", expected: "A completed test after route configuration", observed: "No 856 test available", status: "unknown" }
        ],
        timeline: [
          { time: "23 Oct 15:00", title: "Relationship profile assigned", detail: "The provisioned retail profile identifies five required document directions.", status: "pass" },
          { time: "23 Oct 15:45", title: "Four directions configured", detail: "Order, acknowledgment, invoice and functional acknowledgment routes are present.", status: "pass" },
          { time: "09:20", title: "Coverage gap identified", detail: "The configuration matrix still has no 856 route.", status: "fail" }
        ],
        explanation: "The finding compares required directions in this partner profile with integration configuration. Optional document types stay outside the denominator. It establishes a configuration gap and does not infer process completion, test success or production readiness.",
        evidenceGap: "End-to-end ship-notice testing and business acceptance have not yet been evidenced.",
        action: { label: "Prepare enablement checklist", completedLabel: "Checklist prepared", completionNote: "The missing route and test requirements are prepared for Partner enablement. No integration configuration was changed." }
      },
      {
        id: "rt-order-ack", workflow: "orders", title: "Order acknowledgment is 20 minutes overdue",
        source: "PM", agent: "Lex", severity: "attention", process: 0,
        ruleId: "rt-rule-ack", partnerId: "pt-meadowline", owner: "Dana Ortiz · Order operations",
        reference: "PO-78316", amount: null, unit: "minutes overdue", value: 20,
        policy: "Trading terms ACK-120: this partner requires an 855 within 120 minutes of confirmed order receipt during its agreed service window.",
        roles: {
          retailer: { partner: "Meadowline Care", direction: "Outbound order · inbound acknowledgment", summary: "Meadowline Care received PO-78316 at 07:10. No business acknowledgment is observed by the configured 09:10 deadline.", impact: "The ordered quantities remain unconfirmed. A functional acknowledgment confirms message processing, not the supplier's commitment.", nextAction: "Prepare a supplier follow-up with the order lines and the agreed acknowledgment deadline." },
          supplier: { partner: "Harbor Grocers", direction: "Inbound order · outbound acknowledgment", summary: "Harbor Grocers' PO-78316 was received at 07:10. No outgoing business acknowledgment is observed by the configured 09:10 deadline.", impact: "The retail account has no evidenced confirmation of the requested quantities. The record does not establish cancellation or a financial penalty.", nextAction: "Prepare a review for Order operations to confirm quantities or explain the hold before an acknowledgment is issued." }
        },
        documents: [
          { type: "850", id: "PO-78316", status: "pass", time: "07:10", detail: "Order received and correlated" },
          { type: "997", id: "FA-78316", status: "pass", time: "07:12", detail: "Functional acknowledgment recorded" },
          { type: "855", id: "Not observed", status: "unknown", time: "Due 09:10", detail: "No matching business acknowledgment in the available feed" }
        ],
        lines: [
          { sku: "BL-250", description: "Hydrating body lotion 250 ml", ordered: 1200, acknowledged: null, shipped: null, invoiced: null, price: 8.4, expectedPrice: 8.4 },
          { sku: "HC-075", description: "Daily hand cream 75 ml", ordered: 600, acknowledged: null, shipped: null, invoiced: null, price: 4.8, expectedPrice: 4.8 }
        ],
        checks: [
          { name: "Order receipt anchor", expected: "Confirmed receipt timestamp", observed: "07:10 on 24 Oct", status: "pass" },
          { name: "Partner service window", expected: "120-minute policy applies to this order", observed: "ACK-120 applies; deadline 09:10", status: "pass" },
          { name: "Matching business acknowledgment", expected: "855 correlated by order and partner before 09:10", observed: "None observed by 09:30", status: "fail" },
          { name: "Supplier commitment", expected: "Accepted quantities and dates in a business response", observed: "Unknown; 997 does not establish a commitment", status: "unknown" }
        ],
        timeline: [
          { time: "07:10", title: "Order received", detail: "PO-78316 contains 1,800 units across two lines.", status: "pass" },
          { time: "07:12", title: "Functional acknowledgment recorded", detail: "Message processing is acknowledged; quantities are not yet committed.", status: "pass" },
          { time: "09:10", title: "Configured deadline passed", detail: "The partner-specific 120-minute window closed.", status: "fail" },
          { time: "09:30", title: "Acknowledgment still unobserved", detail: "Lex calculates 20 minutes overdue using the fixed snapshot.", status: "fail" }
        ],
        explanation: "Lex starts the clock from confirmed order receipt and evaluates the policy assigned to this relationship. The correlated 855 is absent from the available feed. The healthy feed check supports investigation, but an off-platform acknowledgment remains possible.",
        evidenceGap: "No ERP hold reason or acknowledgment sent outside the connected feed is available.",
        action: { label: "Prepare acknowledgment follow-up", completedLabel: "Follow-up prepared", completionNote: "An internal follow-up is prepared for Order operations with the two order lines and deadline. No partner message or acknowledgment was sent." }
      },
      {
        id: "rt-order-change", workflow: "orders", title: "Warehouse release uses the superseded quantity",
        source: "PM", agent: "Reese", severity: "critical", process: 8,
        ruleId: "rt-rule-order-change", partnerId: "pt-tidewell", owner: "Sam Lee · Fulfillment coordination",
        reference: "PO-78288 / WH-45018", amount: null, unit: "units above accepted change", value: 200,
        policy: "Fulfillment rule REV-01: the latest accepted order revision governs the quantity released to the warehouse; no quantity tolerance is configured for this account.",
        roles: {
          retailer: { partner: "Tidewell Home", direction: "Retailer order change · supplier warehouse release", summary: "The supplier accepted a reduction from 1,000 to 800 units, but the connected warehouse release still requests 1,000.", impact: "The fulfillment instructions exceed the accepted order by 200 units. This establishes an instruction mismatch, not an actual overshipment.", nextAction: "Prepare an exception review with the supplier and fulfillment owner before the 10:00 planned pick cutoff." },
          supplier: { partner: "Brightway Marketplace", direction: "Inbound order change · outbound warehouse release", summary: "Brightway Marketplace's reduction to 800 units was accepted, but the release to the warehouse still contains the original 1,000 units.", impact: "The warehouse has superseded fulfillment instructions. Shipment quantity is unknown until shipping evidence is received.", nextAction: "Prepare a hold-and-correct request for Fulfillment coordination before the 10:00 planned pick cutoff." }
        },
        documents: [
          { type: "850", id: "PO-78288 v1", status: "pass", time: "23 Oct 16:00", detail: "Original quantity: 1,000 units" },
          { type: "860", id: "CHG-78288 v2", status: "pass", time: "08:00", detail: "Requested quantity: 800 units" },
          { type: "865", id: "ACK-78288 v2", status: "pass", time: "08:15", detail: "Revision 2 accepted" },
          { type: "940", id: "WH-45018", status: "fail", time: "08:40", detail: "Warehouse release still requests 1,000 units" },
          { type: "945", id: "Not observed", status: "unknown", time: "09:30", detail: "No shipping advice in this snapshot" }
        ],
        lines: [
          { sku: "CW-120", description: "Cloudwash cleanser 120 ml", ordered: 800, acknowledged: 800, released: 1000, shipped: null, invoiced: null, price: 12, expectedPrice: 12, originalOrdered: 1000 }
        ],
        checks: [
          { name: "Latest accepted revision", expected: "Accepted 860/865 pair for revision 2", observed: "Revision 2 accepted at 08:15", status: "pass" },
          { name: "Order-to-release quantity", expected: "800 units under accepted revision 2", observed: "940 requests 1,000 units; difference +200", status: "fail" },
          { name: "Item and unit alignment", expected: "Same item and each-unit basis", observed: "CW-120; units normalized to each", status: "pass" },
          { name: "Actual shipment", expected: "945 or equivalent shipping evidence", observed: "Not available", status: "unknown" }
        ],
        timeline: [
          { time: "08:00", title: "Quantity reduction requested", detail: "The order changes from 1,000 to 800 units.", status: "pass" },
          { time: "08:15", title: "Change accepted", detail: "The 865 accepts revision 2 without a counteroffer.", status: "pass" },
          { time: "08:40", title: "Warehouse release conflicts", detail: "WH-45018 retains the original 1,000-unit quantity.", status: "fail" },
          { time: "09:30", title: "Review window remains", detail: "Planned pick cutoff is 10:00; physical pick status is not connected.", status: "unknown" }
        ],
        explanation: "Reese correlates the original order, its accepted revision and the warehouse release using order number, line identifier and normalized units. The accepted revision is the comparison baseline. The 200-unit difference is evidenced in instructions; no shipping outcome has been inferred.",
        evidenceGap: "Current warehouse pick status and actual shipped quantity are not connected.",
        action: { label: "Prepare fulfillment review", completedLabel: "Fulfillment review prepared", completionNote: "A hold-and-correct request is prepared for the fulfillment owner. No warehouse order was changed and no physical hold was applied." }
      },
      {
        id: "rt-shipment-labels", workflow: "shipments", title: "Ship notice repeats two carton identifiers",
        source: "PM", agent: "Nora", severity: "critical", process: 1,
        ruleId: "rt-rule-sscc", partnerId: "pt-solara", owner: "Priya Shah · Shipment compliance",
        reference: "ASN-10482", amount: null, unit: "duplicate carton IDs", value: 2,
        policy: "ASN guide PACK-08: all eight cartons in this shipment require distinct SSCC identifiers. This is the configured receiving requirement for this relationship.",
        roles: {
          retailer: { partner: "Solara Personal Care", direction: "Inbound supplier ship notice", summary: "ASN-10482 describes eight cartons but has only six distinct carton identifiers. Application advice reports the duplicate references.", impact: "The notice does not meet this relationship's receiving requirements. Actual carton labels and physical receipt are not available.", nextAction: "Prepare the failed carton references for supplier correction and receiving-team review." },
          supplier: { partner: "Cedar & Coast", direction: "Outbound retailer ship notice", summary: "The ASN sent to Cedar & Coast repeats two carton identifiers. Its application advice rejects the carton-reference content.", impact: "The transmitted notice requires correction. A successful functional acknowledgment did not establish business acceptance.", nextAction: "Prepare a corrected-notice review with the warehouse pack records and the retailer's duplicate-reference errors." }
        },
        documents: [
          { type: "856", id: "ASN-10482", status: "fail", time: "08:12", detail: "Eight carton records; six distinct SSCC values" },
          { type: "997", id: "FA-10482", status: "pass", time: "08:13", detail: "Functional acknowledgment recorded" },
          { type: "824", id: "AA-10482", status: "fail", time: "08:22", detail: "Application rejection: duplicate carton references" }
        ],
        lines: [
          { sku: "CW-120", description: "Cloudwash cleanser 120 ml", ordered: 192, acknowledged: 192, shipped: 192, invoiced: null, price: 12, expectedPrice: 12 },
          { sku: "BL-250", description: "Hydrating body lotion 250 ml", ordered: 192, acknowledged: 192, shipped: 192, invoiced: null, price: 8.4, expectedPrice: 8.4 },
          { sku: "HC-075", description: "Daily hand cream 75 ml", ordered: 192, acknowledged: 192, shipped: 192, invoiced: null, price: 4.8, expectedPrice: 4.8 }
        ],
        lineNote: "Shipped quantities are the quantities advised in the ASN; they are not independently verified physical receipt.",
        checks: [
          { name: "Required carton references present", expected: "8 carton records with an SSCC value", observed: "8 of 8 carton records populated", status: "pass" },
          { name: "Carton identifier uniqueness", expected: "8 distinct values; 0 duplicate occurrences", observed: "6 distinct values; 2 duplicate occurrences", status: "fail" },
          { name: "Advised item quantity", expected: "576 units across the three order lines", observed: "576 units advised", status: "pass" },
          { name: "Physical label and receipt check", expected: "Warehouse label scan or receiving evidence", observed: "Not connected", status: "unknown" }
        ],
        timeline: [
          { time: "08:12", title: "Ship notice exchanged", detail: "ASN-10482 advises 576 units across eight cartons.", status: "pass" },
          { time: "08:13", title: "Functional acknowledgment received", detail: "Syntax processing is acknowledged.", status: "pass" },
          { time: "08:22", title: "Application rejection received", detail: "The 824 identifies duplicate carton references.", status: "fail" },
          { time: "08:24", title: "Conformance evidence assembled", detail: "Nora identifies two duplicate occurrences and the configured uniqueness rule.", status: "fail" }
        ],
        explanation: "Nora checks the carton records within the ASN against the partner's configured guide. Two repeated identifiers explain the application rejection. This evidence does not establish whether the physical labels repeat the same identifiers, whether goods arrived, or whether any fee was assessed.",
        evidenceGap: "Physical label scans, carrier delivery and receiving records are not available.",
        action: { label: "Prepare ASN correction review", completedLabel: "Correction review prepared", completionNote: "The duplicate references and application advice are prepared for Shipment compliance. No replacement ASN was generated or transmitted." }
      },
      {
        id: "rt-shipment-sequence", workflow: "shipments", title: "Warehouse release preceded routing approval",
        source: "PM", agent: "Liz", severity: "attention", process: 2,
        ruleId: "rt-rule-routing", partnerId: "pt-fieldstone", owner: "Taylor Chen · Transportation planning",
        reference: "ROUTE-38106 / WH-45022", amount: null, unit: "minutes before approval", value: 50,
        policy: "Collect-freight program COLLECT-03: retailer routing instructions must be recorded before a warehouse shipping order is released for this program.",
        roles: {
          retailer: { partner: "Fieldstone Essentials", direction: "Supplier routing request · retailer instructions", summary: "The connected warehouse release was issued at 08:20, while this collect-freight shipment's routing instructions were recorded at 09:10.", impact: "The documented sequence conflicts with the configured collect-freight program. There is no evidence that the truck departed or an appointment was missed.", nextAction: "Prepare a routing review with the supplier's transportation owner before assuming the current warehouse instructions are correct." },
          supplier: { partner: "Eastbank Market", direction: "Outbound routing request · inbound retailer instructions", summary: "The warehouse shipping order was released 50 minutes before Eastbank Market's routing instructions arrived.", impact: "The warehouse may be working from instructions issued before approval. Physical pickup and actual carrier assignment remain unverified.", nextAction: "Prepare a review of the warehouse instruction against the latest routing approval and confirm the pickup plan with Transportation planning." }
        },
        documents: [
          { type: "753", id: "ROUTE-38106", status: "pass", time: "08:00", detail: "Routing request submitted" },
          { type: "940", id: "WH-45022", status: "fail", time: "08:20", detail: "Warehouse release before approval evidence" },
          { type: "754", id: "APP-38106", status: "pass", time: "09:10", detail: "Routing instructions recorded" },
          { type: "214", id: "Pickup not observed", status: "unknown", time: "09:30", detail: "No connected carrier pickup event" }
        ],
        checks: [
          { name: "Program applicability", expected: "Collect-freight program assigned", observed: "COLLECT-03 applies to this order", status: "pass" },
          { name: "Routing request correlation", expected: "Request and approval use the same routing reference", observed: "ROUTE-38106 matched", status: "pass" },
          { name: "Approval before warehouse release", expected: "754 timestamp at or before 940 release", observed: "09:10 approval after 08:20 release; 50-minute gap", status: "fail" },
          { name: "Physical pickup", expected: "Connected carrier or warehouse departure evidence", observed: "Not observed", status: "unknown" }
        ],
        timeline: [
          { time: "08:00", title: "Routing requested", detail: "The supplier asks for instructions under the collect-freight program.", status: "pass" },
          { time: "08:20", title: "Warehouse order released", detail: "WH-45022 is issued before routing approval is present.", status: "fail" },
          { time: "09:10", title: "Routing instructions arrive", detail: "The 754 identifies the approved route and carrier instructions.", status: "pass" },
          { time: "09:12", title: "Sequence exception confirmed", detail: "Liz compares the recorded step order using the configured program rule.", status: "fail" }
        ],
        explanation: "Liz evaluates the sequence of correlated business events. The routing request, approval and warehouse order are all present, but their order violates the policy configured for this collect-freight program. This is an evidenced sequence exception; transport failure is not established.",
        evidenceGap: "Actual warehouse execution, carrier pickup and delivery status are not connected.",
        action: { label: "Prepare routing review", completedLabel: "Routing review prepared", completionNote: "The conflicting sequence and current approval are prepared for Transportation planning. No load was held, retendered or rebooked." }
      },
      {
        id: "rt-invoice-price", workflow: "invoices", title: "Invoice exceeds the agreed line price by $300",
        source: "PM", agent: "Reese", severity: "attention", process: 1,
        ruleId: "rt-rule-price", partnerId: "pt-nuvori", owner: "Morgan Reed · Invoice exceptions",
        reference: "INV-10388 / PO-78219", amount: 300, amountLabel: "Documented price variance", unit: "price variance", value: 300,
        policy: "Pricing agreement PRICE-06: compare invoice lines with the latest accepted order price in USD per each. No price tolerance or later accepted price change is recorded for this order.",
        roles: {
          retailer: { partner: "Nuvori Beauty", direction: "Inbound supplier invoice", summary: "Nuvori Beauty's invoice uses $12.50 on 600 cleanser units; the accepted order price is $12.00. The other line matches.", impact: "The document comparison identifies a $300 price variance. Receipt-based matching and the payment decision remain separate checks.", nextAction: "Prepare the two-line comparison for Accounts payable and the supplier's billing contact to review." },
          supplier: { partner: "Northfield Stores", direction: "Outbound retailer invoice", summary: "The invoice to Northfield Stores bills 600 cleanser units at $12.50 instead of the accepted $12.00 order price.", impact: "A $300 billing variance is evidenced. The snapshot does not show that the retailer has rejected the invoice or imposed a deduction.", nextAction: "Prepare a billing correction review against the accepted order before issuing any replacement or credit document." }
        },
        documents: [
          { type: "850", id: "PO-78219", status: "pass", time: "22 Oct 11:00", detail: "Accepted price reference" },
          { type: "855", id: "ACK-78219", status: "pass", time: "22 Oct 12:15", detail: "Quantities and prices accepted" },
          { type: "856", id: "ASN-10479", status: "pass", time: "08:05", detail: "Advised quantities match the invoice" },
          { type: "810", id: "INV-10388", status: "fail", time: "08:45", detail: "$14,160 invoice; $13,860 at accepted order prices" },
          { type: "Receipt", id: "Not connected", status: "unknown", time: "09:30", detail: "Physical receipt cannot be verified" }
        ],
        lines: [
          { sku: "CW-120", description: "Cloudwash cleanser 120 ml", ordered: 600, acknowledged: 600, shipped: 600, invoiced: 600, price: 12.5, expectedPrice: 12, variance: 300 },
          { sku: "BB-200", description: "Everyday body balm 200 ml", ordered: 360, acknowledged: 360, shipped: 360, invoiced: 360, price: 18.5, expectedPrice: 18.5, variance: 0 }
        ],
        lineNote: "Shipped is the ASN-advised quantity. Invoice subtotal $14,160; accepted-order subtotal $13,860; difference $300. No tax or freight is included in this example.",
        checks: [
          { name: "Document correlation", expected: "Same order, partner, line and item identifiers", observed: "Both invoice lines matched to accepted order lines", status: "pass" },
          { name: "Price and currency basis", expected: "USD per each; accepted order price", observed: "CW-120: $12.50 invoiced vs $12.00 agreed", status: "fail" },
          { name: "Order-to-invoice quantities", expected: "600 cleanser and 360 body-balm units", observed: "Both line quantities match", status: "pass" },
          { name: "Three-way receipt match", expected: "Recorded received quantities", observed: "Receiving system not connected", status: "unknown" }
        ],
        timeline: [
          { time: "22 Oct 11:00", title: "Order prices established", detail: "The cleanser line is priced at $12.00 per unit.", status: "pass" },
          { time: "22 Oct 12:15", title: "Order accepted", detail: "The acknowledgment accepts the order quantities and prices.", status: "pass" },
          { time: "08:45", title: "Invoice exchanged", detail: "The cleanser line uses $12.50; the body-balm line matches.", status: "fail" },
          { time: "08:47", title: "Variance calculated", detail: "Reese calculates 600 × $0.50 = $300.", status: "fail" }
        ],
        explanation: "Reese compares each invoice line with the accepted order using normalized item, unit and currency references. The sole price difference is $0.50 on 600 units. A later catalog price alone would not replace the accepted order terms without applicable change evidence.",
        evidenceGap: "Receiving records, subsequent price authorization and invoice disposition are not available.",
        action: { label: "Prepare invoice review", completedLabel: "Invoice review prepared", completionNote: "A line-level price comparison is prepared for Invoice exceptions. No invoice was edited, rejected, retransmitted or paid." }
      },
      {
        id: "rt-invoice-deduction", workflow: "invoices", title: "Two deductions need receiving evidence",
        source: "PM", agent: "Reese", severity: "attention", process: 3,
        ruleId: "rt-rule-deduction", partnerId: "pt-meadowline", owner: "Jamie Brooks · Deductions review",
        reference: "REM-88027 / INV-10230", amount: 750, amountLabel: "Observed deductions", unit: "deductions for review", value: 2,
        policy: "Settlement terms REM-10: this account has a 10-calendar-day review window from remittance posting. The 22 Oct posting gives a configured review deadline of 1 Nov 2026, 23:59 ET.",
        roles: {
          retailer: { partner: "Meadowline Care", direction: "Outbound remittance · supplier settlement review", summary: "A $25,000 invoice was settled for $24,250 with a $450 notice-timing deduction and a $300 shortage deduction. Receiving evidence is absent from the review packet.", impact: "The recorded $750 in deductions needs a supported explanation before the supplier review. The current packet cannot validate either charge.", nextAction: "Prepare a request for receiving and deduction-policy evidence, with the configured review deadline attached." },
          supplier: { partner: "Harbor Grocers", direction: "Inbound retailer remittance", summary: "Harbor Grocers' remittance deducts $450 for notice timing and $300 for shortage from a $25,000 invoice. The packet lacks receiving evidence.", impact: "The $750 is an observed deduction, not a recoverable amount. Validity and dispute eligibility remain unconfirmed.", nextAction: "Prepare the remittance, invoice and ASN evidence for a deductions analyst and request the missing receiving records before 1 Nov." }
        },
        documents: [
          { type: "856", id: "ASN-10391", status: "pass", time: "19 Oct 15:25", detail: "Ship-notice timestamp available" },
          { type: "997", id: "FA-10391", status: "pass", time: "19 Oct 15:26", detail: "Functional acknowledgment available" },
          { type: "810", id: "INV-10230", status: "pass", time: "20 Oct 12:10", detail: "Invoice total $25,000" },
          { type: "820", id: "REM-88027", status: "pass", time: "22 Oct 07:40", detail: "$24,250 settlement plus two deductions totaling $750" },
          { type: "Receipt", id: "Not connected", status: "unknown", time: "09:30", detail: "Arrival timestamp and received quantity unavailable" }
        ],
        deductions: [
          { code: "ASN-TIME", label: "Notice timing", amount: 450, evidence: "Arrival/receiving timestamp and applicable notice rule", status: "unknown" },
          { code: "QTY-SHORT", label: "Quantity shortage", amount: 300, evidence: "Received line quantities and discrepancy record", status: "unknown" }
        ],
        checks: [
          { name: "Remittance arithmetic", expected: "Invoice = net settlement + adjustments", observed: "$25,000 = $24,250 + $450 + $300", status: "pass" },
          { name: "Invoice correlation", expected: "Remittance references an identified invoice", observed: "INV-10230 matched", status: "pass" },
          { name: "Review-packet completeness", expected: "Arrival and received-quantity evidence for both reason codes", observed: "Receiving evidence missing for both deductions", status: "fail" },
          { name: "Deduction validity", expected: "Applicable policy compared with arrival and receipt evidence", observed: "Cannot determine from the available documents", status: "unknown" }
        ],
        timeline: [
          { time: "19 Oct 15:25", title: "Ship notice recorded", detail: "The notice and functional acknowledgment timestamps are available.", status: "pass" },
          { time: "20 Oct 12:10", title: "Invoice recorded", detail: "Invoice value is $25,000.", status: "pass" },
          { time: "22 Oct 07:40", title: "Deductions observed", detail: "The remittance nets $750 across two stated reason codes.", status: "pass" },
          { time: "24 Oct 09:20", title: "Evidence gap identified", detail: "Reese cannot verify timing or shortage claims without receiving evidence.", status: "fail" }
        ],
        explanation: "Reese reconciles the invoice, net settlement and adjustment amounts, then checks the evidence required by each deduction reason. The arithmetic matches. The missing receiving timestamp and quantity records prevent a conclusion about validity or recovery. The review deadline comes from the configured terms for this relationship.",
        evidenceGap: "Actual arrival, received quantities, discrepancy records and the applied deduction-policy evidence are missing.",
        action: { label: "Prepare deduction evidence request", completedLabel: "Evidence request prepared", completionNote: "An internal evidence request and review packet are prepared for Deductions review. No dispute was submitted and no recovery was recorded." }
      }
    ],
    rules: [
      { id: "rt-rule-signature", name: "Connection signature-failure burst", agent: "Ivy", workflow: "partners", scope: "AS2 connection policy AS2-04", condition: "Group signature-validation failures on the same connection during a rolling 15-minute window.", threshold: 5, unit: "failures in 15 minutes", evidence: "Connection identifier, attempt timestamps, transport receipts and signature-validation result", guardrail: "An attempt count does not establish distinct orders or financial exposure.", test: {
        operator: "lt", measure: "Signature failures in a 15-minute window", passValue: 2, failValue: 12,
        passLabel: "Two-failure window", failLabel: "Twelve-failure window",
        pass: "2 signature failures within a 15-minute observation window.", fail: "12 signature failures within 12 minutes on the same connection.",
        passDecision: "No failure-burst finding", failDecision: "Raise a grouped connection finding"
      } },
      { id: "rt-rule-coverage", name: "Required partner document configuration", agent: "Ivy", workflow: "partners", scope: "Provisioned partner profile RT-CPG-02", condition: "Compare required document directions with configured integration routes; exclude optional types.", threshold: 5, unit: "required directions", evidence: "Partner profile, document standard, sender/receiver direction and route configuration", guardrail: "Configuration coverage does not establish business-process or production readiness. The required count must come from the assigned partner profile.", test: {
        operator: "min", measure: "Required document directions configured", passValue: 5, failValue: 4,
        passLabel: "All five directions present", failLabel: "Ship-notice direction absent",
        pass: "850, 855, 856, 810 and 997 directions are configured: 5 total.", fail: "The 856 direction is missing: 4 configured; optional 846 is excluded.",
        passDecision: "Required configuration count met", failDecision: "Raise a required-route coverage finding"
      } },
      { id: "rt-rule-ack", name: "Partner acknowledgment deadline", agent: "Lex", workflow: "orders", scope: "Partner policy ACK-120 and its agreed service window", condition: "Start from confirmed order receipt and seek a correlated business acknowledgment within the configured window.", threshold: 120, unit: "minutes after receipt", evidence: "Order receipt timestamp, order/partner correlation, 855 or equivalent business response and service calendar", guardrail: "Apply this relationship's policy only. A 997 is not a business commitment; missing off-platform evidence remains possible.", test: {
        operator: "max", measure: "Minutes from receipt to acknowledgment or current observation", passValue: 95, failValue: 140,
        passLabel: "Acknowledgment at 08:45", failLabel: "Still unobserved at 09:30",
        pass: "Order receipt at 07:10; matching 855 at 08:45: 95 minutes elapsed.", fail: "Order receipt at 07:10; no matching 855 by 09:30: 140 minutes elapsed.",
        passDecision: "No acknowledgment deadline breach", failDecision: "Raise an acknowledgment timing finding"
      } },
      { id: "rt-rule-order-change", name: "Release matches accepted order revision", agent: "Reese", workflow: "orders", scope: "Fulfillment rule REV-01", condition: "Compare released warehouse quantities with the latest accepted revision using order, line, item and normalized unit references.", threshold: 0, unit: "quantity tolerance", evidence: "850, accepted 860/865 revision, 940 release and unit/item reference data", guardrail: "A release mismatch is an instruction exception. Actual shipment requires shipping evidence.", test: {
        operator: "max", measure: "Absolute quantity difference from accepted revision", passValue: 0, failValue: 200,
        passLabel: "Release at accepted quantity", failLabel: "Release at original quantity",
        pass: "Revision 2 accepts 800 units; warehouse release requests 800: difference 0.", fail: "Revision 2 accepts 800 units; warehouse release requests 1,000: difference 200.",
        passDecision: "Release quantity is within tolerance", failDecision: "Raise an accepted-revision mismatch"
      } },
      { id: "rt-rule-sscc", name: "Distinct carton identifiers in the ASN", agent: "Nora", workflow: "shipments", scope: "Receiving guide PACK-08", condition: "Require an SSCC value on each applicable carton and check uniqueness within the shipment notice.", threshold: 0, unit: "duplicate occurrences", evidence: "856 carton hierarchy and SSCC values, assigned partner packing guide and any 824 response", guardrail: "ASN conformance does not verify physical labels, delivery, receipt or assessed charges.", test: {
        operator: "max", measure: "Repeated carton-identifier occurrences", passValue: 0, failValue: 2,
        passLabel: "Eight distinct carton identifiers", failLabel: "Six distinct identifiers for eight cartons",
        pass: "8 populated carton records contain 8 distinct identifiers: 0 repeated occurrences.", fail: "8 populated carton records contain 6 distinct identifiers: 2 repeated occurrences.",
        passDecision: "Carton-identifier check passes", failDecision: "Raise a carton conformance finding"
      } },
      { id: "rt-rule-routing", name: "Routing approval before warehouse release", agent: "Liz", workflow: "shipments", scope: "Collect-freight program COLLECT-03", condition: "For this program, compare the correlated routing approval timestamp with warehouse release time.", threshold: 0, unit: "minutes released before approval", evidence: "753 request, 754 instructions, 940 release and program assignment", guardrail: "Apply only to configured collect-freight relationships. A sequence exception is not proof of physical departure.", test: {
        operator: "max", measure: "Early-release minutes; zero when approval precedes release", passValue: 0, failValue: 50,
        passLabel: "Approval before warehouse release", failLabel: "Approval after warehouse release",
        pass: "Approval at 08:10; release at 08:20: 0 minutes released early.", fail: "Release at 08:20; approval at 09:10: 50 minutes released early.",
        passDecision: "Release sequence is within policy", failDecision: "Raise a routing-sequence finding"
      } },
      { id: "rt-rule-price", name: "Invoice matches accepted order price", agent: "Reese", workflow: "invoices", scope: "Pricing agreement PRICE-06", condition: "Compare invoice unit prices with the latest accepted order on the same item, unit and currency basis.", threshold: 0, unit: "USD per-unit price tolerance", evidence: "Accepted order, business acknowledgment, invoice lines, revision history and item/unit references", guardrail: "This is a two-document price check. Three-way matching additionally requires receipt evidence.", test: {
        operator: "max", measure: "Absolute unit-price variance in USD per each", passValue: 0, failValue: 0.5,
        passLabel: "Invoice at accepted order price", failLabel: "Invoice fifty cents above order price",
        pass: "600 units invoiced and accepted at $12.00 each: $0.00 per-unit variance.", fail: "600 units at $12.50 rather than $12.00: $0.50 per-unit variance, $300 total.",
        passDecision: "Unit price is within tolerance", failDecision: "Raise an invoice price-variance finding"
      } },
      { id: "rt-rule-deduction", name: "Deduction evidence and review window", agent: "Reese", workflow: "invoices", scope: "Settlement terms REM-10", condition: "Reconcile adjustments to the invoice and require the evidence assigned to each reason code before concluding validity.", threshold: 10, unit: "calendar days in this account's review window", evidence: "820 adjustments, invoice, ASN and acknowledgment, receiving evidence, reason mappings and configured settlement terms", guardrail: "Observed deductions are not recoverable amounts. Preparing evidence is not submitting a dispute or recording recovery.", test: {
        operator: "max", measure: "Calendar days elapsed since remittance posting", passValue: 2, failValue: 2,
        requireEvidence: true, passEvidenceComplete: true, failEvidenceComplete: false,
        passLabel: "Complete evidence packet on day two", failLabel: "Incomplete evidence packet on day two",
        pass: "Day 2 after posting. Invoice and settlement reconcile; arrival and receipt evidence is present for both reason codes.", fail: "Day 2 after posting. Amounts reconcile, but arrival and received-quantity evidence is missing for both reason codes.",
        passDecision: "Ready for analyst review; validity still requires a decision", failDecision: "Hold the conclusion; review the deadline and request missing evidence"
      } }
    ],
    partners: [
      {
        id: "pt-nuvori", names: { retailer: "Nuvori Beauty", supplier: "Northfield Stores" }, status: "watch", lastActivity: "09:12", owner: "Alex Morgan",
        documents: [
          { type: "850", label: "Purchase order", status: "late", required: true, lastSeen: "08:08", detail: "Last successful interchange at 08:08; 12 later attempts failed signature validation." },
          { type: "855", label: "Order acknowledgment", status: "healthy", required: true, lastSeen: "08:05", detail: "Configured and active; business deadlines are evaluated per order in PM." },
          { type: "856", label: "Ship notice", status: "healthy", required: true, lastSeen: "08:05", detail: "Integration processing is healthy; this does not verify receipt." },
          { type: "810", label: "Invoice", status: "healthy", required: true, lastSeen: "08:45", detail: "Invoice feed processed successfully; INV-10388 has a separate PM price variance." },
          { type: "997", label: "Functional acknowledgment", status: "healthy", required: true, lastSeen: "08:46", detail: "Functional acknowledgment route is active." },
          { type: "846", label: "Inventory advice", status: "not-required", required: false, lastSeen: "Not required", detail: "Excluded from this relationship's required-feed coverage." }
        ]
      },
      {
        id: "pt-meadowline", names: { retailer: "Meadowline Care", supplier: "Harbor Grocers" }, status: "watch", lastActivity: "09:18", owner: "Dana Ortiz",
        documents: [
          { type: "850", label: "Purchase order", status: "healthy", required: true, lastSeen: "09:18", detail: "Order feed is active." },
          { type: "855", label: "Order acknowledgment", status: "healthy", required: true, lastSeen: "09:02", detail: "The feed is active. PO-78316 has a correlated deadline finding in PM." },
          { type: "856", label: "Ship notice", status: "healthy", required: true, lastSeen: "08:51", detail: "Ship-notice feed is active." },
          { type: "810", label: "Invoice", status: "healthy", required: true, lastSeen: "08:42", detail: "Invoice feed is active." },
          { type: "820", label: "Remittance", status: "healthy", required: true, lastSeen: "22 Oct 07:40", detail: "Within this relationship's weekly remittance schedule; not an overdue daily feed." }
        ]
      },
      {
        id: "pt-liora", names: { retailer: "Liora Wellness", supplier: "Westline Home" }, status: "onboarding", lastActivity: "23 Oct 16:20", owner: "Jordan Lee",
        documents: [
          { type: "850", label: "Purchase order", status: "healthy", required: true, lastSeen: "23 Oct 16:05", detail: "Configured; onboarding test evidence available." },
          { type: "855", label: "Order acknowledgment", status: "healthy", required: true, lastSeen: "23 Oct 16:10", detail: "Configured; onboarding test evidence available." },
          { type: "856", label: "Ship notice", status: "unconfigured", required: true, lastSeen: "No route", detail: "Required under profile RT-CPG-02. Route and subsequent test are outstanding." },
          { type: "810", label: "Invoice", status: "healthy", required: true, lastSeen: "23 Oct 16:15", detail: "Configured; onboarding test evidence available." },
          { type: "997", label: "Functional acknowledgment", status: "healthy", required: true, lastSeen: "23 Oct 16:20", detail: "Configured; onboarding test evidence available." },
          { type: "846", label: "Inventory advice", status: "not-required", required: false, lastSeen: "Not required", detail: "Optional for this relationship and excluded from coverage." }
        ]
      },
      {
        id: "pt-tidewell", names: { retailer: "Tidewell Home", supplier: "Brightway Marketplace" }, status: "watch", lastActivity: "09:24", owner: "Sam Lee",
        documents: [
          { type: "850", label: "Purchase order", status: "healthy", required: true, lastSeen: "09:24", detail: "Order feed is active." },
          { type: "860", label: "Order change", status: "healthy", required: true, lastSeen: "08:00", detail: "Revision 2 for PO-78288 processed successfully." },
          { type: "865", label: "Change acknowledgment", status: "healthy", required: true, lastSeen: "08:15", detail: "Accepted change processed successfully." },
          { type: "856", label: "Ship notice", status: "healthy", required: true, lastSeen: "09:05", detail: "Feed is active; no actual shipment evidence for PO-78288 yet." },
          { type: "846", label: "Inventory advice", status: "healthy", required: true, lastSeen: "09:00", detail: "Hourly inventory feed is within the configured schedule." }
        ]
      },
      {
        id: "pt-solara", names: { retailer: "Solara Personal Care", supplier: "Cedar & Coast" }, status: "watch", lastActivity: "09:15", owner: "Priya Shah",
        documents: [
          { type: "850", label: "Purchase order", status: "healthy", required: true, lastSeen: "09:15", detail: "Order feed is active." },
          { type: "855", label: "Order acknowledgment", status: "healthy", required: true, lastSeen: "08:48", detail: "Acknowledgment feed is active." },
          { type: "856", label: "Ship notice", status: "healthy", required: true, lastSeen: "08:12", detail: "Transmission completed; ASN-10482 has a separate PM carton-conformance finding." },
          { type: "824", label: "Application advice", status: "healthy", required: true, lastSeen: "08:22", detail: "Application rejection delivered successfully; message transport is healthy." },
          { type: "997", label: "Functional acknowledgment", status: "healthy", required: true, lastSeen: "08:13", detail: "Functional acknowledgment recorded for ASN-10482." }
        ]
      },
      {
        id: "pt-fieldstone", names: { retailer: "Fieldstone Essentials", supplier: "Eastbank Market" }, status: "watch", lastActivity: "09:10", owner: "Taylor Chen",
        documents: [
          { type: "850", label: "Purchase order", status: "healthy", required: true, lastSeen: "08:55", detail: "Order feed is active." },
          { type: "753", label: "Routing request", status: "healthy", required: true, lastSeen: "08:00", detail: "Routing request processed successfully." },
          { type: "754", label: "Routing instructions", status: "healthy", required: true, lastSeen: "09:10", detail: "Approval received; PM identifies its sequence relative to warehouse release." },
          { type: "856", label: "Ship notice", status: "healthy", required: true, lastSeen: "08:32", detail: "Feed is active; no physical delivery conclusion follows from feed status." },
          { type: "214", label: "Shipment status", status: "unconfigured", required: false, lastSeen: "Not connected", detail: "Carrier-event coverage is unavailable. Excluded from required integration coverage but shown as a PM evidence gap." }
        ]
      },
      {
        id: "pt-copperleaf", names: { retailer: "Copperleaf Living", supplier: "Stonebridge Stores" }, status: "active", lastActivity: "09:22", owner: "Casey Park",
        documents: [
          { type: "850", label: "Purchase order", status: "healthy", required: true, lastSeen: "09:22", detail: "Configured and active." },
          { type: "855", label: "Order acknowledgment", status: "healthy", required: true, lastSeen: "09:10", detail: "Configured and active." },
          { type: "856", label: "Ship notice", status: "healthy", required: true, lastSeen: "08:50", detail: "Configured and active." },
          { type: "810", label: "Invoice", status: "healthy", required: true, lastSeen: "09:05", detail: "Configured and active." },
          { type: "852", label: "Product activity", status: "healthy", required: true, lastSeen: "06:00", detail: "Daily activity feed received within its configured window." }
        ]
      },
      {
        id: "pt-crestline", names: { retailer: "Crestline Logistics", supplier: "Crestline Logistics" }, status: "active", lastActivity: "09:26", owner: "Sam Lee",
        type: "3PL",
        documents: [
          { type: "940", label: "Warehouse shipping order", status: "healthy", required: true, lastSeen: "09:26", detail: "Warehouse release feed is active; individual release content is evaluated in PM." },
          { type: "945", label: "Warehouse shipping advice", status: "healthy", required: true, lastSeen: "09:21", detail: "Shipping advice feed is active; absence for an individual order requires a configured process rule." },
          { type: "944", label: "Transfer receipt", status: "healthy", required: true, lastSeen: "08:45", detail: "Warehouse transfer-receipt feed is active; this is not retail delivery evidence." },
          { type: "947", label: "Inventory adjustment", status: "healthy", required: true, lastSeen: "07:55", detail: "Inventory-adjustment feed is within its configured schedule." }
        ]
      }
    ]
  };
