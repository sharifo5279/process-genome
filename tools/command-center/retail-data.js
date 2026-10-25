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
      { id: "partners", hidden: true, title: "Partner readiness", subtitle: "Required feeds, configuration and connection health", icon: "users", processes: [0, 1] },
      { id: "orders", title: "Order commitments", subtitle: "Acknowledgments, accepted changes and fulfillment instructions", icon: "flow", processes: [0] },
      { id: "shipments", title: "Shipment readiness", subtitle: "Notice conformance, routing sequence and delivery documents", icon: "net", processes: [0, 1] },
      { id: "invoices", title: "Invoice and deduction control", subtitle: "Price matching, settlement evidence and review ownership", icon: "check", processes: [0, 1, 3] }
    ],
    cases: [
      
      
      
      {
        id: "rt-order-change", workflow: "orders", title: "Warehouse release uses the superseded quantity",
        source: "PM", agent: "Reese", severity: "critical", process: 8, detected: "08:41",
        ruleId: "rt-rule-order-change", partnerId: "pt-tidewell", owner: "Sam Lee · Fulfillment coordination",
        reference: "PO-78288 / WH-45018", amount: null, unit: "units above accepted change", value: 200,
        policy: "Fulfillment rule REV-01: the latest accepted order revision governs the quantity released to the warehouse; no quantity tolerance is configured for this account.",
        roles: {
          retailer: { partner: "Tidewell Home", direction: "Outbound order change · inbound supplier ship notice", summary: "Tidewell Home accepted a reduction from 1,000 to 800 units, but its ship notice ASN-10512 advises 1,000.", impact: "Receiving will see 200 units more than the accepted order. The overage is advised, not yet received.", nextAction: "Prepare a quantity review with Tidewell Home before the shipment arrives.",
            over: { process: 1, title: "Ship notice exceeds the accepted order revision", ruleId: "rt-rule-asn-revision", reference: "PO-78288 / ASN-10512", unit: "units above accepted revision", owner: "Sam Lee · Supplier compliance",
              policy: "Order rule REV-02: ship notice quantities must not exceed the latest accepted order revision; no quantity tolerance is configured for this supplier.",
              documents: [
                { type: "850", id: "PO-78288 v1", status: "pass", time: "23 Oct 16:00", detail: "Original quantity: 1,000 units" },
                { type: "860", id: "CHG-78288 v2", status: "pass", time: "08:00", detail: "Requested quantity: 800 units" },
                { type: "865", id: "ACK-78288 v2", status: "pass", time: "08:15", detail: "Revision 2 accepted" },
                { type: "856", id: "ASN-10512", status: "fail", time: "08:40", detail: "Advises 1,000 units" },
                { type: "861", id: "Not sent", status: "unknown", time: "09:30", detail: "Goods not received yet" }
              ],
              lines: [{ sku: "CW-120", description: "Cloudwash cleanser 120 ml", ordered: 800, acknowledged: 800, shipped: 1000, invoiced: null, price: 12, expectedPrice: 12, originalOrdered: 1000 }],
              lineNote: "Shipped quantities are the quantities advised in the ASN.",
              checks: [
                { name: "Latest accepted revision", expected: "Accepted 860/865 pair for revision 2", observed: "Revision 2 accepted at 08:15", status: "pass" },
                { name: "Ship notice quantity", expected: "800 units under accepted revision 2", observed: "856 advises 1,000 units; difference +200", status: "fail" },
                { name: "Item and unit alignment", expected: "Same item and each-unit basis", observed: "CW-120; units normalized to each", status: "pass" },
                { name: "Receipt", expected: "861 after the goods arrive", observed: "Not sent yet", status: "unknown" }
              ],
              timeline: [
                { time: "08:00", title: "Quantity reduction sent", detail: "The 860 changes the order from 1,000 to 800 units.", status: "pass" },
                { time: "08:15", title: "Change accepted", detail: "Tidewell Home accepts revision 2 with an 865.", status: "pass" },
                { time: "08:40", title: "Ship notice conflicts", detail: "ASN-10512 advises 1,000 units against the accepted 800.", status: "fail" },
                { time: "09:30", title: "Shipment in transit", detail: "No 861 until the goods arrive.", status: "unknown" }
              ],
              explanation: "Reese correlates the order, its accepted revision and the ship notice by PO number, line and normalized units. The accepted revision is the baseline. The ship notice advises 200 units more than the supplier accepted.",
              evidenceGap: "Goods are not received yet, so no 861 has been sent.",
              action: { label: "Prepare supplier review", completedLabel: "Supplier review prepared", completionNote: "A quantity review is prepared for Tidewell Home. No order was changed." } } },
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
          { time: "09:30", title: "Review window remains", detail: "Planned pick cutoff is 10:00. No 945 shipping advice received yet.", status: "unknown" }
        ],
        explanation: "Reese correlates the original order, its accepted revision and the warehouse release using order number, line identifier and normalized units. The accepted revision is the comparison baseline. The 200-unit difference is evidenced in instructions; no shipping outcome has been inferred.",
        evidenceGap: "No 945 shipping advice received yet, so the shipped quantity is not known.",
        action: { label: "Prepare fulfillment review", completedLabel: "Fulfillment review prepared", completionNote: "A hold-and-correct request is prepared for the fulfillment owner. No warehouse order was changed." }
      },
      {
        id: "rt-shipment-labels", workflow: "shipments", title: "Ship notice repeats two carton identifiers",
        source: "PM", agent: "Nora", severity: "critical", process: 0,
        ruleId: "rt-rule-sscc", partnerId: "pt-solara", owner: "Priya Shah · Shipment compliance",
        reference: "ASN-10482", amount: null, unit: "duplicate carton IDs", value: 2,
        policy: "ASN guide PACK-08: all eight cartons in this shipment require distinct SSCC identifiers. This is the configured receiving requirement for this relationship.",
        roles: {
          retailer: { partner: "Solara Personal Care", direction: "Inbound supplier ship notice", summary: "ASN-10482 describes eight cartons but has only six distinct carton identifiers. Application advice reports the duplicate references.", impact: "The notice does not meet this relationship's receiving requirements.", nextAction: "Prepare the failed carton references for supplier correction and receiving-team review.", over: { process: 1,
            timeline: [
              { time: "08:12", title: "Ship notice received", detail: "ASN-10482 advises 576 units across eight cartons.", status: "pass" },
              { time: "08:13", title: "Functional acknowledgment sent", detail: "Syntax processing is acknowledged.", status: "pass" },
              { time: "08:22", title: "Application rejection sent to Solara Personal Care", detail: "The 824 identifies duplicate carton references.", status: "fail" },
              { time: "08:24", title: "Conformance evidence assembled", detail: "Nora identifies two duplicate occurrences and the configured uniqueness rule.", status: "fail" }
            ] } },
          supplier: { partner: "Cedar & Coast", direction: "Outbound retailer ship notice", summary: "The ASN sent to Cedar & Coast repeats two carton identifiers. Its application advice rejects the carton-reference content.", impact: "The transmitted notice requires correction. A successful functional acknowledgment did not establish business acceptance.", nextAction: "Prepare a corrected-notice review with the retailer's duplicate-reference errors.", over: {
            checks: [
              { name: "Required carton references present", expected: "8 carton records with an SSCC value", observed: "8 of 8 carton records populated", status: "pass" },
              { name: "Carton identifier uniqueness", expected: "8 distinct values; 0 duplicate occurrences", observed: "6 distinct values; 2 duplicate occurrences", status: "fail" },
              { name: "Advised item quantity", expected: "576 units across the three order lines", observed: "576 units advised", status: "pass" },
              { name: "Corrected notice", expected: "Replacement 856 for ASN-10482", observed: "Not sent", status: "unknown" }
            ], evidenceGap: "No corrected 856 sent yet." } }
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
        lineNote: "Shipped quantities are the quantities advised in the ASN.",
        checks: [
          { name: "Required carton references present", expected: "8 carton records with an SSCC value", observed: "8 of 8 carton records populated", status: "pass" },
          { name: "Carton identifier uniqueness", expected: "8 distinct values; 0 duplicate occurrences", observed: "6 distinct values; 2 duplicate occurrences", status: "fail" },
          { name: "Advised item quantity", expected: "576 units across the three order lines", observed: "576 units advised", status: "pass" },
          { name: "Corrected notice", expected: "Replacement 856 for ASN-10482", observed: "Not received", status: "unknown" }
        ],
        timeline: [
          { time: "08:12", title: "Ship notice exchanged", detail: "ASN-10482 advises 576 units across eight cartons.", status: "pass" },
          { time: "08:13", title: "Functional acknowledgment received", detail: "Syntax processing is acknowledged.", status: "pass" },
          { time: "08:22", title: "Application rejection received", detail: "The 824 identifies duplicate carton references.", status: "fail" },
          { time: "08:24", title: "Conformance evidence assembled", detail: "Nora identifies two duplicate occurrences and the configured uniqueness rule.", status: "fail" }
        ],
        explanation: "Nora checks the carton records within the ASN against the partner's configured guide. Two repeated identifiers explain the application rejection. The check covers the ship notice content.",
        evidenceGap: "No corrected 856 received yet.",
        action: { label: "Prepare ASN correction review", completedLabel: "Correction review prepared", completionNote: "The duplicate references and application advice are prepared for Shipment compliance. No replacement ASN was generated or transmitted." }
      },
      {
        id: "rt-shipment-sequence", workflow: "shipments", title: "Shipped before routing instructions arrived",
        source: "PM", agent: "Liz", severity: "attention", process: 8,
        ruleId: "rt-rule-routing", partnerId: "pt-fieldstone", owner: "Taylor Chen · Transportation planning",
        reference: "ROUTE-38106 / WH-45022", amount: null, unit: "minutes before instructions", value: 50,
        policy: "Collect-freight program COLLECT-03: the supplier must not ship or send an 856 before the retailer's routing instructions (754) arrive.",
        roles: {
          retailer: { partner: "Fieldstone Essentials", direction: "Inbound routing request · outbound routing instructions", summary: "Fieldstone Essentials sent ASN-10520 at 08:20; routing instructions for this collect-freight shipment were issued at 09:10.", impact: "The shipment may move on a carrier other than the routed one, outside the collect-freight program.", nextAction: "Prepare a routing review with Fieldstone Essentials and Transportation planning before the load is tendered.",
            over: { process: 2, title: "Ship notice received before routing instructions", ruleId: "rt-rule-routing-asn", reference: "ROUTE-38106 / ASN-10520", unit: "minutes before instructions",
              policy: "Collect-freight program COLLECT-03: suppliers must not ship or send an 856 before Northfield Stores issues the 754.",
              documents: [
                { type: "753", id: "ROUTE-38106", status: "pass", time: "08:00", detail: "Routing request received" },
                { type: "856", id: "ASN-10520", status: "fail", time: "08:20", detail: "Shipment advised before routing instructions" },
                { type: "754", id: "APP-38106", status: "pass", time: "09:10", detail: "Routing instructions sent" },
                { type: "214", id: "Not received", status: "unknown", time: "09:30", detail: "No carrier pickup event" }
              ],
              checks: [
                { name: "Program applicability", expected: "Collect-freight program assigned", observed: "COLLECT-03 applies to this order", status: "pass" },
                { name: "Routing request correlation", expected: "Request and instructions use the same routing reference", observed: "ROUTE-38106 matched", status: "pass" },
                { name: "Instructions before shipment", expected: "754 at or before the supplier's 856", observed: "856 at 08:20; 754 at 09:10; 50-minute gap", status: "fail" },
                { name: "Carrier pickup", expected: "214 pickup event", observed: "Not received", status: "unknown" }
              ],
              timeline: [
                { time: "08:00", title: "Routing requested", detail: "Fieldstone Essentials asks for instructions under the collect-freight program.", status: "pass" },
                { time: "08:20", title: "Ship notice received", detail: "ASN-10520 arrives before routing instructions exist.", status: "fail" },
                { time: "09:10", title: "Routing instructions sent", detail: "The 754 names the routed carrier.", status: "pass" },
                { time: "09:12", title: "Sequence exception confirmed", detail: "Liz compares the 754 and 856 timestamps under the program rule.", status: "fail" }
              ],
              explanation: "Liz compares the routing request, the instructions Northfield Stores issued and the supplier's ship notice. The supplier advised shipment 50 minutes before instructions were issued, so the carrier may not be the routed one.",
              evidenceGap: "No 214 pickup event received yet." } },
          supplier: { partner: "Eastbank Market", direction: "Outbound routing request · inbound retailer instructions", summary: "Crestline Logistics confirmed WH-45022 shipped at 08:20 (945), 50 minutes before Eastbank Market's routing instructions arrived.", impact: "The load may have moved on a carrier other than the routed one, outside the collect-freight program.", nextAction: "Prepare a routing review with Transportation planning and confirm the carrier used before the 856 is sent." }
        },
        documents: [
          { type: "753", id: "ROUTE-38106", status: "pass", time: "07:40", detail: "Routing request sent with cartons, weight and cube" },
          { type: "945", id: "WH-45022", status: "fail", time: "08:20", detail: "3PL confirms the load shipped" },
          { type: "754", id: "APP-38106", status: "pass", time: "09:10", detail: "Routing instructions received" },
          { type: "856", id: "Not sent", status: "unknown", time: "09:30", detail: "Ship notice not yet sent" }
        ],
        checks: [
          { name: "Program applicability", expected: "Collect-freight program assigned", observed: "COLLECT-03 applies to this order", status: "pass" },
          { name: "Routing request correlation", expected: "Request and approval use the same routing reference", observed: "ROUTE-38106 matched", status: "pass" },
          { name: "Instructions before shipment", expected: "754 at or before the 945 ship time", observed: "945 at 08:20; 754 at 09:10; 50-minute gap", status: "fail" },
          { name: "Ship notice", expected: "856 with the routed carrier", observed: "Not sent", status: "unknown" }
        ],
        timeline: [
          { time: "07:40", title: "Routing requested", detail: "The 753 asks for instructions under the collect-freight program.", status: "pass" },
          { time: "08:20", title: "Load shipped", detail: "Crestline Logistics confirms WH-45022 shipped (945) before instructions exist.", status: "fail" },
          { time: "09:10", title: "Routing instructions arrive", detail: "The 754 names the routed carrier.", status: "pass" },
          { time: "09:12", title: "Sequence exception confirmed", detail: "Liz compares the 945 and 754 timestamps under the program rule.", status: "fail" }
        ],
        explanation: "Liz compares the routing request, the 3PL's shipping advice and the retailer's instructions. The load shipped 50 minutes before instructions arrived, so the carrier may not be the routed one.",
        evidenceGap: "No 856 sent yet, so the carrier used is not confirmed on Trading Grid.",
        action: { label: "Prepare routing review", completedLabel: "Routing review prepared", completionNote: "The sequence and the routing instructions are prepared for Transportation planning. No document was sent." }
      },
      
      {
        id: "rt-invoice-deduction", workflow: "invoices", title: "Two deductions without delivery or receipt documents",
        source: "PM", agent: "Reese", severity: "attention", process: 3,
        ruleId: "rt-rule-deduction", partnerId: "pt-nuvori", owner: "Jamie Brooks · Deductions review",
        reference: "REM-88027 / INV-10230", amount: 750, amountLabel: "Observed deductions", unit: "deductions for review", value: 2,
        policy: "Settlement terms REM-10: this account has a 30-calendar-day review window from remittance posting. The 22 Oct posting gives a configured review deadline of 21 Nov 2026, 23:59 ET.",
        roles: {
          retailer: { partner: "Nuvori Beauty", direction: "Outbound remittance · outbound receiving advice", summary: "The 820 to Nuvori Beauty deducts $450 for notice timing and $300 for shortage, but no 861 was sent for ASN-10391, so the supplier has no receiving evidence to reconcile against.", impact: "The supplier is likely to dispute both deductions.", nextAction: "Send the 861 for ASN-10391, or attach receipt detail to the deduction, before the supplier disputes.",
            over: { title: "Deductions taken without a receiving advice", owner: "Jamie Brooks · Vendor compliance",
              documents: [
                { type: "856", id: "ASN-10391", status: "pass", time: "14 Sep 15:25", detail: "Ship notice received" },
                { type: "997", id: "FA-10391", status: "pass", time: "14 Sep 15:26", detail: "Functional acknowledgment sent" },
                { type: "810", id: "INV-10230", status: "pass", time: "15 Sep 12:10", detail: "Invoice total $25,000" },
                { type: "820", id: "REM-88027", status: "pass", time: "22 Oct 07:40", detail: "$24,250 settlement plus two deductions totaling $750" },
                { type: "861", id: "Not sent", status: "fail", time: "09:30", detail: "No receiving advice sent for ASN-10391" }
              ],
              checks: [
                { name: "Remittance arithmetic", expected: "Invoice = net settlement + adjustments", observed: "$25,000 = $24,250 + $450 + $300", status: "pass" },
                { name: "Invoice correlation", expected: "Remittance references an identified invoice", observed: "INV-10230 matched", status: "pass" },
                { name: "Receiving advice sent", expected: "861 for ASN-10391 before the deduction", observed: "Not sent", status: "fail" },
                { name: "Deduction support", expected: "Received quantities and arrival time on file for both reason codes", observed: "Not on Trading Grid", status: "unknown" }
              ],
              evidenceGap: "No 861 sent for ASN-10391.",
              action: { label: "Prepare receiving advice follow-up", completedLabel: "Follow-up prepared", completionNote: "A follow-up to send the 861 for ASN-10391 is prepared for Vendor compliance. No document was sent." } } },
          supplier: { partner: "Northfield Stores", direction: "Inbound retailer remittance", summary: "Northfield Stores' remittance deducts $450 for notice timing and $300 for shortage from a $25,000 invoice. No 214 delivery event or 861 receiving advice is on file.", impact: "The $750 is an observed deduction, not a recoverable amount. Validity and dispute eligibility remain unconfirmed.", nextAction: "Prepare the remittance, invoice and ASN evidence for a deductions analyst and request the 861 receiving advice before 21 Nov." }
        },
        documents: [
          { type: "856", id: "ASN-10391", status: "pass", time: "14 Sep 15:25", detail: "Ship-notice timestamp available" },
          { type: "997", id: "FA-10391", status: "pass", time: "14 Sep 15:26", detail: "Functional acknowledgment available" },
          { type: "810", id: "INV-10230", status: "pass", time: "15 Sep 12:10", detail: "Invoice total $25,000" },
          { type: "820", id: "REM-88027", status: "pass", time: "22 Oct 07:40", detail: "$24,250 settlement plus two deductions totaling $750" },
          { type: "214", id: "Not received", status: "unknown", time: "09:30", detail: "No delivery event for ASN-10391" },
          { type: "861", id: "Not received", status: "unknown", time: "09:30", detail: "No receiving advice for ASN-10391" }
        ],
        deductions: [
          { code: "ASN-TIME", label: "Notice timing", amount: 450, evidence: "214 delivery event and the notice-timing rule", status: "unknown" },
          { code: "QTY-SHORT", label: "Quantity shortage", amount: 300, evidence: "861 received quantities by line", status: "unknown" }
        ],
        checks: [
          { name: "Remittance arithmetic", expected: "Invoice = net settlement + adjustments", observed: "$25,000 = $24,250 + $450 + $300", status: "pass" },
          { name: "Invoice correlation", expected: "Remittance references an identified invoice", observed: "INV-10230 matched", status: "pass" },
          { name: "Review-packet completeness", expected: "214 delivery event and 861 receiving advice", observed: "Neither document on file", status: "fail" },
          { name: "Deduction validity", expected: "Applicable policy compared with the 214 and 861", observed: "Cannot determine from the available documents", status: "unknown" }
        ],
        timeline: [
          { time: "14 Sep 15:25", title: "Ship notice recorded", detail: "The notice and functional acknowledgment timestamps are available.", status: "pass" },
          { time: "15 Sep 12:10", title: "Invoice recorded", detail: "Invoice value is $25,000.", status: "pass" },
          { time: "22 Oct 07:40", title: "Deductions observed", detail: "The remittance nets $750 across two stated reason codes.", status: "pass" },
          { time: "24 Oct 09:20", title: "Evidence gap identified", detail: "Reese cannot verify timing or shortage without a 214 delivery event or 861 receiving advice.", status: "fail" }
        ],
        explanation: "Reese reconciles the invoice, net settlement and adjustment amounts, then checks the evidence required by each deduction reason. The arithmetic matches. Without a 214 delivery event and 861 receiving advice, validity cannot be concluded. The review deadline comes from the configured terms for this relationship.",
        evidenceGap: "No 214 delivery event or 861 receiving advice for ASN-10391.",
        action: { label: "Prepare deduction evidence request", completedLabel: "Evidence request prepared", completionNote: "An internal evidence request and review packet are prepared for Deductions review. No dispute was submitted and no recovery was recorded." }
      }
    ],
    rules: [
      
      
      { id: "rt-rule-ack", name: "Drop ship acknowledgment deadline", agent: "Lex", workflow: "orders", scope: "Drop ship policy ACK-120 for marketplace orders", condition: "Start from confirmed order receipt and seek a correlated business acknowledgment within the configured window.", threshold: 120, unit: "minutes after receipt", evidence: "Order receipt timestamp, order/partner correlation, 855 or equivalent business response and service calendar", guardrail: "Apply this relationship's policy only. A 997 is not a business commitment.", test: {
        operator: "max", measure: "Minutes from receipt to acknowledgment or current observation", passValue: 95, failValue: 140,
        passLabel: "Acknowledgment at 08:45", failLabel: "Still unobserved at 09:30",
        pass: "Order receipt at 07:10; matching 855 at 08:45: 95 minutes elapsed.", fail: "Order receipt at 07:10; no matching 855 by 09:30: 140 minutes elapsed.",
        passDecision: "No acknowledgment deadline breach", failDecision: "Raise an acknowledgment timing finding"
      } },
      { id: "rt-rule-order-change", roles: ["supplier"], name: "Release matches accepted order revision", agent: "Reese", workflow: "orders", scope: "Fulfillment rule REV-01", condition: "Compare released warehouse quantities with the latest accepted revision using order, line, item and normalized unit references.", threshold: 0, unit: "quantity tolerance", evidence: "850, accepted 860/865 revision, 940 release and unit/item reference data", guardrail: "A release mismatch is an instruction exception. The shipped quantity comes from the 945.", test: {
        operator: "max", measure: "Absolute quantity difference from accepted revision", passValue: 0, failValue: 200,
        passLabel: "Release at accepted quantity", failLabel: "Release at original quantity",
        pass: "Revision 2 accepts 800 units; warehouse release requests 800: difference 0.", fail: "Revision 2 accepts 800 units; warehouse release requests 1,000: difference 200.",
        passDecision: "Release quantity is within tolerance", failDecision: "Raise an accepted-revision mismatch"
      } },
      { id: "rt-rule-sscc", name: "Distinct carton identifiers in the ASN", agent: "Nora", workflow: "shipments", scope: "Receiving guide PACK-08", condition: "Require an SSCC value on each applicable carton and check uniqueness within the shipment notice.", threshold: 0, unit: "duplicate occurrences", evidence: "856 carton hierarchy and SSCC values, assigned partner packing guide and any 824 response", guardrail: "The check covers ship notice content only.", test: {
        operator: "max", measure: "Repeated carton-identifier occurrences", passValue: 0, failValue: 2,
        passLabel: "Eight distinct carton identifiers", failLabel: "Six distinct identifiers for eight cartons",
        pass: "8 populated carton records contain 8 distinct identifiers: 0 repeated occurrences.", fail: "8 populated carton records contain 6 distinct identifiers: 2 repeated occurrences.",
        passDecision: "Carton-identifier check passes", failDecision: "Raise a carton conformance finding"
      } },
      { id: "rt-rule-routing", roles: ["supplier"], name: "Shipment before routing instructions", agent: "Liz", workflow: "shipments", scope: "Collect-freight program COLLECT-03", condition: "For this program, compare the 3PL's 945 ship time and the 856 with the retailer's 754.", threshold: 0, unit: "minutes shipped before instructions", evidence: "753 request, 754 instructions, 945 shipping advice and program assignment", guardrail: "Apply only to configured collect-freight relationships.", test: {
        operator: "max", measure: "Minutes shipped before instructions; zero when the 754 came first", passValue: 0, failValue: 50,
        passLabel: "Instructions before shipment", failLabel: "Shipment before instructions",
        pass: "754 at 08:10; 945 at 08:20: 0 minutes early.", fail: "945 at 08:20; 754 at 09:10: 50 minutes early.",
        passDecision: "Sequence is within policy", failDecision: "Raise a routing-sequence finding"
      } },
      { id: "rt-rule-asn-revision", roles: ["retailer"], name: "Ship notice within accepted order revision", agent: "Reese", workflow: "orders", scope: "Order rule REV-02", condition: "Compare ship notice quantities with the latest accepted 860/865 revision by order, line, item and normalized unit.", threshold: 0, unit: "quantity tolerance", evidence: "850, accepted 860/865 revision, 856 and unit/item reference data", guardrail: "A ship notice overage is an advised quantity; the received quantity comes from the 861.", test: {
        operator: "max", measure: "Absolute quantity difference from accepted revision", passValue: 0, failValue: 200,
        passLabel: "Ship notice at accepted quantity", failLabel: "Ship notice at original quantity",
        pass: "Revision 2 accepts 800 units; the 856 advises 800: difference 0.", fail: "Revision 2 accepts 800 units; the 856 advises 1,000: difference 200.",
        passDecision: "Ship notice quantity is within tolerance", failDecision: "Raise a ship notice overage finding"
      } },
      { id: "rt-rule-routing-asn", roles: ["retailer"], name: "Routing instructions before ship notice", agent: "Liz", workflow: "shipments", scope: "Collect-freight program COLLECT-03", condition: "For collect-freight orders, compare the 754 timestamp with the supplier's 856.", threshold: 0, unit: "minutes shipped before instructions", evidence: "753 request, 754 instructions, 856 ship notice and program assignment", guardrail: "Apply only to configured collect-freight relationships.", test: {
        operator: "max", measure: "Minutes the 856 preceded the 754; zero when instructions came first", passValue: 0, failValue: 50,
        passLabel: "Instructions before ship notice", failLabel: "Ship notice before instructions",
        pass: "754 at 08:10; 856 at 08:20: 0 minutes early.", fail: "856 at 08:20; 754 at 09:10: 50 minutes early.",
        passDecision: "Sequence is within policy", failDecision: "Raise a routing-sequence finding"
      } },
      { id: "rt-rule-price", name: "Invoice matches accepted order price", agent: "Nora", workflow: "invoices", scope: "Pricing agreement PRICE-06", condition: "Compare invoice unit prices with the latest accepted order on the same item, unit and currency basis.", threshold: 0, unit: "USD per-unit price tolerance", evidence: "Accepted order, business acknowledgment, invoice lines, revision history and item/unit references", guardrail: "This is a two-document price check. Three-way matching adds the 861 where the retailer sends it.", test: {
        operator: "max", measure: "Absolute unit-price variance in USD per each", passValue: 0, failValue: 0.5,
        passLabel: "Invoice at accepted order price", failLabel: "Invoice fifty cents above order price",
        pass: "600 units invoiced and accepted at $12.00 each: $0.00 per-unit variance.", fail: "600 units at $12.50 rather than $12.00: $0.50 per-unit variance, $300 total.",
        passDecision: "Unit price is within tolerance", failDecision: "Raise an invoice price-variance finding"
      } },
      { id: "rt-rule-deduction", name: "Deduction evidence and review window", agent: "Reese", workflow: "invoices", scope: "Settlement terms REM-10", condition: "Reconcile adjustments to the invoice and require the evidence assigned to each reason code before concluding validity.", threshold: 30, unit: "calendar days in this account's review window", evidence: "820 adjustments, 810 invoice, 856 and 997, 214 delivery event, 861 receiving advice, reason mappings and settlement terms", guardrail: "Observed deductions are not recoverable amounts. Preparing evidence is not submitting a dispute or recording recovery.", test: {
        operator: "max", measure: "Calendar days elapsed since remittance posting", passValue: 2, failValue: 2,
        requireEvidence: true, passEvidenceComplete: true, failEvidenceComplete: false,
        passLabel: "Complete evidence packet on day two", failLabel: "Incomplete evidence packet on day two",
        pass: "Day 2 after posting. Invoice and settlement reconcile; the 214 and 861 are on file.", fail: "Day 2 after posting. Amounts reconcile, but the 214 and 861 are missing.",
        passDecision: "Ready for analyst review; validity still requires a decision", failDecision: "Hold the conclusion; review the deadline and request missing evidence"
      } }
    ],
    partners: [
      {
        id: "pt-nuvori", names: { retailer: "Nuvori Beauty", supplier: "Northfield Stores" }, status: "watch", lastActivity: "09:12", owner: "Alex Morgan",
        documents: [
          { type: "850", label: "Purchase order", status: "healthy", required: true, lastSeen: "09:12", detail: "Order feed is active." },
          { type: "855", label: "Order acknowledgment", status: "healthy", required: true, lastSeen: "08:05", detail: "Configured and active; business deadlines are evaluated per order in PM." },
          { type: "856", label: "Ship notice", status: "late", required: true, lastSeen: "05:45", detail: "No 856 since 05:45 while 855 and 810 traffic continues." },
          { type: "810", label: "Invoice", status: "healthy", required: true, lastSeen: "08:45", detail: "Invoice feed is active." },
          { type: "820", label: "Remittance", status: "healthy", required: true, lastSeen: "22 Oct 07:40", detail: "Weekly remittance exchanged on schedule." },
          { type: "824", label: "Application advice", status: "healthy", required: true, lastSeen: "08:40", detail: "Application advice route is active." },
          { type: "861", label: "Receiving advice", status: "healthy", required: true, lastSeen: "08:10", detail: "Exchanged after each receipt; none yet for ASN-10391." },
          { type: "997", label: "Functional acknowledgment", status: "healthy", required: true, lastSeen: "08:46", detail: "Functional acknowledgment route is active." },
          { type: "846", label: "Inventory advice", status: "not-required", required: false, lastSeen: "Not required", detail: "Excluded from this relationship's required-feed coverage." }
        ]
      },
      {
        id: "pt-meadowline", names: { retailer: "Meadowline Care", supplier: "Harbor Grocers" }, status: "watch", lastActivity: { retailer: "09:18", supplier: "05:52" }, owner: "Dana Ortiz",
        documents: [
          { type: "850", label: "Purchase order", status: "late", required: true, lastSeen: "05:52", detail: "No 850 exchanged since 05:52; AS2 failures on this connection." },
          { type: "855", label: "Order acknowledgment", status: "healthy", required: true, lastSeen: "09:02", detail: "The feed is active." },
          { type: "856", label: "Ship notice", status: "healthy", required: true, lastSeen: "08:51", detail: "Ship-notice feed is active." },
          { type: "810", label: "Invoice", status: "healthy", required: true, lastSeen: "08:42", detail: "Invoice feed is active." },
          { type: "820", label: "Remittance", status: "missing", required: true, lastSeen: "17 Oct 05:40", detail: "Weekly 820 due today at 06:00 was not exchanged." },
          { type: "997", label: "Functional acknowledgment", status: "late", required: true, lastSeen: "05:52", detail: "Acknowledgments stopped with the AS2 failures at 05:52." }
        ]
      },
      {
        id: "pt-liora", names: { retailer: "Liora Wellness", supplier: "Coastal Drug" }, status: "onboarding", lastActivity: "23 Oct 16:20", owner: "Jordan Lee",
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
          { type: "856", label: "Ship notice", status: "healthy", required: true, lastSeen: "09:05", detail: "Feed is active." },
          { type: "810", label: "Invoice", status: "healthy", required: true, lastSeen: "09:18", detail: "52 invoices since 05:00 have no 997." },
          { type: "997", label: "Functional acknowledgment", status: "late", required: true, lastSeen: "05:00", detail: "Acknowledgments for invoices behind since 05:00." },
          { type: "846", label: "Inventory advice", status: "healthy", required: true, lastSeen: "09:00", detail: "Hourly inventory feed is within the configured schedule." }
        ]
      },
      {
        id: "pt-solara", names: { retailer: "Solara Personal Care", supplier: "Cedar & Coast" }, status: "watch", lastActivity: "09:15", owner: "Priya Shah",
        documents: [
          { type: "850", label: "Purchase order", status: "healthy", required: true, lastSeen: "09:15", detail: "Order feed is active." },
          { type: "855", label: "Order acknowledgment", status: "healthy", required: true, lastSeen: "08:48", detail: "Acknowledgment feed is active." },
          { type: "856", label: "Ship notice", status: "healthy", required: true, lastSeen: "08:12", detail: "Transmission completed; ASN-10482 has a separate PM carton-conformance finding." },
          { type: "810", label: "Invoice", status: "late", required: true, lastSeen: "07:30", detail: "112 invoices rejected by 824 on unit price since 04:20." },
          { type: "832", label: "Price catalog", status: "healthy", required: true, lastSeen: "Mon 10:05", detail: "Cost change for 9 items exchanged Monday." },
          { type: "824", label: "Application advice", status: "healthy", required: true, lastSeen: "08:22", detail: "Application advice route is active." },
          { type: "997", label: "Functional acknowledgment", status: "healthy", required: true, lastSeen: "08:13", detail: "Functional acknowledgment recorded for ASN-10482." }
        ]
      },
      {
        id: "pt-fieldstone", names: { retailer: "Fieldstone Essentials", supplier: "Eastbank Market" }, status: "watch", lastActivity: "09:10", owner: "Taylor Chen",
        documents: [
          { type: "850", label: "Purchase order", status: "healthy", required: true, lastSeen: "08:55", detail: "Order feed is active." },
          { type: "753", label: "Routing request", status: "healthy", required: true, lastSeen: "08:00", detail: "Routing request processed successfully." },
          { type: "754", label: "Routing instructions", status: "healthy", required: true, lastSeen: "09:10", detail: "Routing instructions exchanged; PM checks their sequence against shipment." },
          { type: "856", label: "Ship notice", status: "healthy", required: true, lastSeen: "08:32", detail: "Feed is active." },
          { type: "214", label: "Shipment status", status: "unconfigured", required: false, lastSeen: "No route", detail: "No carrier events configured. Excluded from required integration coverage but shown as a PM evidence gap." }
        ]
      },
      {
        id: "pt-copperleaf", names: { retailer: "Copperleaf Living", supplier: "Westline Home" }, status: "active", lastActivity: "09:22", owner: "Casey Park",
        documents: [
          { type: "850", label: "Purchase order", status: "healthy", required: true, lastSeen: "09:22", detail: "Configured and active." },
          { type: "855", label: "Order acknowledgment", status: "healthy", required: true, lastSeen: "09:10", detail: "Configured and active." },
          { type: "856", label: "Ship notice", status: "healthy", required: true, lastSeen: "08:50", detail: "Configured and active." },
          { type: "810", label: "Invoice", status: "healthy", required: true, lastSeen: "09:05", detail: "Configured and active." },
          { type: "852", label: "Product activity", status: "healthy", required: true, lastSeen: "06:00", detail: "Daily activity feed exchanged within its configured window." },
          { type: "861", label: "Receiving advice", status: "healthy", required: true, lastSeen: "08:30", detail: "Receiving advice exchanged after each receipt." },
          { type: "997", label: "Functional acknowledgment", status: "healthy", required: true, lastSeen: "09:22", detail: "Functional acknowledgment route is active." }
        ]
      },
      {
        id: "pt-crestline", names: { retailer: "Crestline Logistics", supplier: "Crestline Logistics" }, status: "active", lastActivity: "09:26", owner: "Sam Lee",
        type: "3PL", only: "supplier",
        documents: [
          { type: "940", label: "Warehouse shipping order", status: "healthy", required: true, lastSeen: "09:26", detail: "Warehouse release feed is active; individual release content is evaluated in PM." },
          { type: "945", label: "Warehouse shipping advice", status: "healthy", required: true, lastSeen: "09:21", detail: "Shipping advice feed is active; absence for an individual order requires a configured process rule." },
          { type: "944", label: "Transfer receipt", status: "healthy", required: true, lastSeen: "08:45", detail: "Warehouse transfer-receipt feed is active; this is not retail delivery evidence." },
          { type: "947", label: "Inventory adjustment", status: "healthy", required: true, lastSeen: "07:55", detail: "Inventory-adjustment feed is within its configured schedule." }
        ]
      }
    ]
  };
