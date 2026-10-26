  /* Command Center data for Retail and CPG. Illustrative values for the concept preview. */
  var CCF = [
    { id: "f1", p: 0, st: 2, sev: "c", mod: "Performance Monitor", how: "Rule and prediction", pil: "Extend", dp: 2, partner: "Northfield Stores", n: 14, val: 8400, at: "07:10",
      ot: "Ship notices not sent for 14 shipments", os: "Crestline Logistics confirmed 14 loads shipped (945) at 06:10. No 856 sent to Northfield Stores, and the loads arrive at its DC in about 5 hours.",
      bt: "14 shipments arriving before their ship notice", bs: "Northfield Stores cannot receive the loads by scan until the ship notices arrive.",
      ev: [["05:45", "Last 856 sent to Northfield Stores"], ["06:10", "Shipping advice (945) from Crestline Logistics for 14 loads"], ["07:10", "Rule breached: no 856 within 1 hour of shipment"], ["08:05", "Predicted arrival before ship notice for all 14 loads"]],
      cause: "No 856 has been sent since 05:45, while 855 and 810 traffic continues. The ship notice feed into Trading Grid stopped.",
      act: "Ask shipping and the ERP team to restart the 856 feed. Command Center confirms when the 14 ship notices are sent and accepted.", appr: "EDI operations lead",
      area: "Missing documents", who: ["Supply chain", "IT and ERP", "Customer service"] },
    { id: "f2", p: 0, st: 0, sev: "c", mod: "Integration Monitor", how: "Anomaly", pil: "Optimize", partner: "Harbor Grocers", n: 74, val: 182000, at: "06:30",
      ot: "Order volume 64% below projection", os: "Harbor Grocers sent 41 purchase orders since 05:00 against 115 projected. Last interchange at 05:52.",
      bt: "Harbor Grocers orders down 64% this morning", bs: "About $182,000 in expected orders has not arrived in this window.",
      ev: [["05:52", "Last 850 interchange received"], ["06:30", "Volume fell below the projected band"], ["06:41", "AS2 receipts from the partner failing signature checks"], ["07:15", "Anomaly confirmed across two order windows"]],
      cause: "The partner rotated its AS2 signing certificate. Messages fail signature checks at the connection.",
      act: "Confirm the new certificate fingerprint with Harbor Grocers by phone and ask the Trading Grid administrator to load it. Then ask the partner to resend orders since 05:52.", appr: "EDI operations lead",
      area: "Certificate management", who: ["Customer service", "Information security", "Sales and key accounts"] },
    { id: "f3", p: 0, st: 1, sev: "w", mod: "Performance Monitor", how: "Rule", pil: "Optimize", partner: "Westline Home", n: 37, val: 91000, at: "05:00",
      ot: "37 acknowledgments past the 24-hour window", os: "Purchase orders received yesterday have no 855. Westline Home requires acknowledgment within 24 hours.",
      bt: "37 orders not confirmed with Westline Home", bs: "Unconfirmed orders risk cancellation by the customer.",
      ev: [["Yesterday 04:58", "37 purchase orders received and loaded"], ["05:00", "24-hour acknowledgment window closed"], ["05:05", "Acknowledgments sent for other orders; none for these 37"]],
      cause: "Only these 37 orders lack an 855 while other orders are acknowledged, which points to an order hold before acknowledgment.",
      act: "Ask order management to release the 37 orders or acknowledge them with a hold status.", appr: "Customer service lead",
      area: "Fix routing", who: ["Customer service", "Finance and treasury"] },
    { id: "f4", p: 0, st: 4, sev: "c", mod: "Performance Monitor", how: "Rule", pil: "Optimize", partner: "Northfield Stores", n: 112, val: 46200, at: "04:20",
      ot: "112 invoices rejected on unit price", os: "824 application advice cites a price mismatch on 9 items since Monday's cost change.",
      bt: "$46,200 in invoices held for price mismatch", bs: "Northfield Stores will not pay the invoices until prices match the order.",
      ev: [["Monday", "New costs sent in the 832 price catalog"], ["04:20", "First 824 rejection on unit price"], ["07:30", "112 rejections on the same 9 items"]],
      cause: "Northfield Stores' purchase orders still carry the pre-Monday cost; the invoices bill the new 832 cost.",
      act: "Ask billing to rebill the 112 invoices at the PO cost, or ask Northfield Stores for 860 changes with the new cost.", appr: "Billing and pricing",
      area: "Rejections", who: ["Finance and treasury", "Master data"] },
    { id: "f7", p: 0, st: 5, sev: "w", mod: "Integration Monitor", how: "Missing document", pil: "Optimize", partner: "Harbor Grocers", n: 1, val: 0, at: "06:00",
      ot: "Remittance advice not received", os: "The weekly 820 from Harbor Grocers was due at 06:00. The last remittance arrived 7 days ago.",
      bt: "Harbor Grocers payments cannot be applied", bs: "Cash received without remittance detail stays unapplied until the 820 arrives.",
      ev: [["Last Saturday 05:40", "Last 820 received"], ["06:00", "Expected remittance window closed"]],
      cause: "Same certificate change as the order volume finding for Harbor Grocers.",
      act: "Ask Harbor Grocers to resend the 820 once its certificate is loaded.", appr: "EDI operations lead",
      area: "Missing documents", who: ["Accounts receivable", "Sales and key accounts"] },
    { id: "f9", p: 0, st: 4, sev: "w", mod: "Performance Monitor", how: "Prediction", pil: "Extend", dp: 1, partner: "Northfield Stores", n: 61, val: 28400, at: "07:50",
      ot: "Cost change not applied to 61 open orders", os: "Open orders still carry the old cost for 9 items. Invoices from these orders will reject.",
      bt: "$28,400 in invoices likely to reject", bs: "The same price mismatch will hit 61 orders that have not been invoiced yet.",
      ev: [["Monday", "832 cost change sent for 9 items"], ["07:50", "61 open orders found with the old cost"]],
      cause: "Purchase orders received after Monday's 832 still carry the old cost.",
      act: "Ask pricing to invoice the 61 open orders at the PO cost, or ask Northfield Stores for 860 changes.", appr: "Pricing analyst",
      area: "Cross-references and master data", who: ["Master data", "Finance and treasury"] },
    { id: "f10", p: 0, st: 4, sev: "w", mod: "Integration Monitor", how: "Anomaly", pil: "Optimize", partner: "Brightway Marketplace", n: 52, val: 0, at: "08:10",
      ot: "Functional acknowledgments missing for 52 invoices", os: "Brightway Marketplace has returned no 997 for invoices sent since 05:00. Its 997s for ship notices and its purchase orders arrive normally.",
      bt: "52 invoices without confirmed receipt", bs: "Invoices without a 997 may not have reached Brightway Marketplace.",
      ev: [["05:00", "Last 997 received for an invoice"], ["06:00", "Acknowledgment volume fell below the projected band"], ["08:10", "52 invoices unacknowledged"]],
      cause: "Not yet known. The partner's acknowledgments for other document types are flowing.",
      act: "Ask Brightway Marketplace to confirm receipt. Redeliver any invoice it did not receive from TG Insights.", appr: "EDI operations lead",
      area: "Monitoring", who: ["Accounts receivable", "IT and ERP"] },
  ];
  /* The demo client solution covers three processes */
  /* Key measure per process: index into the process measures, illustrative value */
  /* Product overlay coverage for the retail genome */
  var PMPV = { retail: {
    im: [["Order volume against projection", ["850"]], ["Functional acknowledgments returned", ["997"]], ["Application advice rejections", ["824"]],
      ["Inventory feed on schedule", ["846"]], ["Sales feed on schedule", ["852"]], ["Remittance volume against projection", ["820"]]],
    pm: [["Acknowledgment within 24 hours", ["855"]], ["Ship notice within 1 hour of pickup", ["856"]], ["Invoice matches order price and quantity", ["810"]],
      ["Item confirmed before the first order", ["CIC", "CIN"]], ["Cost change loaded before invoicing", ["832", "879"]], ["Delivery events for every tendered load", ["214", "204"]],
      ["Shipping advice for every warehouse order", ["945", "940"]], ["Deduction backup inside the dispute window", ["812"]], ["Return credit matches an authorization", ["180"]]],
    asn: [["ASN health, failures and SLA adherence by supplier", ["856"]], ["Rejections explained with the rule and the fix", ["824"]], ["Missing acknowledgments on ship notices", ["997"]]],
    /* Partner connectivity: web EDI for suppliers (supplier side) and the supplier portal for retailer and CPG hubs (buyer side), for partners without EDI teams */
    web: [["Orders received and acknowledged online", ["850", "855"]], ["Order changes received and answered", ["860", "865"]], ["Ship notices with GS1-128 carton labels", ["856"]],
      ["Invoices filled from the order", ["810"]], ["Warehouse orders and shipping advice with 3PLs", ["940", "945"]], ["Remittance received", ["820"]]],
    sp: [["Orders and changes tracked by vendor", ["850", "860"]], ["Line-level confirmations and counteroffers", ["855", "865"]], ["Ship notices built from the order, with matching labels", ["856"]],
      ["Goods receipt as proof of delivery", ["861"]], ["Invoices matched to the order", ["810"]], ["Remittance status", ["820"]], ["Carrier shipment status", ["214"]]],
    /* Retail compliance for suppliers: documents validated before delivery, alerts before a penalty, fill rate and scorecards (separate product, not part of Command Center) */
    val: [["Ship notices held when they break a retailer rule", ["856"]], ["Invoices held when they break a retailer rule", ["810"]],
      ["Held documents released, or replaced with a corrected version", ["856", "810"]], ["Duplicate ship notices and invoices stopped", ["856", "810"]]],
    alr: [["Acknowledgment window set per retailer", ["855"]], ["Pending shipment alert before the ship notice window closes", ["850", "856"]],
      ["Invoice mismatch alert, with order, ship notice and invoice compared by SKU, quantity and price", ["810", "856", "850"]],
      ["Rejections by 824, 864 or email in the order lifecycle", ["824", "864"]], ["Deduction status and amount, with document evidence for disputes", ["820", "812"]]],
    sc: [["Fill rate by retailer, from order and acknowledgment", ["850", "855"]], ["Backordered and short lines followed to shipment and invoice", ["855", "856", "810"]],
      ["Ship notice accuracy and timeliness against variance bands", ["856"]], ["Invoice accuracy against the order and ship notice", ["810"]]],
    /* Recommended action and approver for each Extend decision point, in decision point order */
    ag: [["Hold invoices and correct the cost on open orders", "Pricing analyst"], ["Alert shipping to send the ship notices; track each 856 until accepted", "EDI operations lead"],
      ["Dispute with backup attached, or accept", "Deductions analyst"], ["Adjust the proposed order quantity", "Demand planner"],
      ["Correct master data and resend", "Master data analyst"], ["Rebook the appointment or retender the load", "Transportation planner"],
      ["Flag items for check-in review", "Route sales manager"], ["Open a reconciliation with the 3PL", "Logistics coordinator"],
      ["Match the credit or dispute the deduction", "Accounts receivable"]]
  } };
  /* Retailer perspective (Northfield Stores) of the same findings. Base records above are the CPG supplier perspective (Nuvori Beauty). */
  var CCFR = {
    f1: { p: 1, st: 3, partner: "Nuvori Beauty", ot: "No ship notices for 14 inbound loads", os: "Carrier pickup confirmed at 06:10 for 14 Nuvori Beauty loads. No 856 received, and the loads reach the DC in about 5 hours.",
      bt: "14 inbound loads will be received by hand", bs: "Loads that arrive before their ship notice cannot be scanned at the dock.",
      ev: [["06:10", "Carrier pickup confirmed for 14 loads"], ["07:10", "Rule breached: no 856 within 1 hour of pickup"], ["08:05", "Predicted arrival before ship notice for all 14 loads"]],
      cause: "Nuvori Beauty has sent no ship notices since 05:45. Its acknowledgments and invoices arrive normally.",
      act: "Request the 14 ship notices from Nuvori Beauty and alert DC receiving to plan for manual receipt.", appr: "Supplier compliance lead", who: ["Supplier compliance", "DC receiving", "Merchandising"] },
    f2: { p: 1, st: 0, partner: "Meadowline Care", ot: "74 purchase orders failed AS2 delivery to Meadowline Care", os: "Trading Grid holds 74 purchase orders for Meadowline Care since 05:52. Deliveries to its AS2 endpoint fail with connection errors.",
      bt: "Replenishment orders not reaching Meadowline Care", bs: "About $182,000 in store replenishment orders is waiting for delivery.",
      ev: [["05:52", "Last 850 delivered to Meadowline Care"], ["06:30", "Volume fell below the projected band"], ["06:41", "AS2 deliveries returning connection errors"], ["07:15", "Anomaly confirmed across two order windows"]],
      cause: "Meadowline Care moved its AS2 endpoint in a maintenance window. Deliveries to the previous address fail.",
      act: "Confirm the new AS2 endpoint with Meadowline Care, ask the Trading Grid administrator to update it, then redeliver the held orders from TG Insights.", appr: "EDI operations lead", who: ["Replenishment", "Supplier compliance", "Information security"] },
    f3: { p: 1, st: 1, partner: "Copperleaf Living", ot: "37 acknowledgments past the 24-hour window", os: "Purchase orders sent to Copperleaf Living yesterday have no 855. Store allocation waits on confirmed quantities.",
      bt: "37 orders not confirmed by Copperleaf Living", bs: "Unconfirmed orders delay allocation and may need another source.",
      ev: [["Yesterday 04:58", "37 purchase orders delivered and functionally acknowledged"], ["05:00", "24-hour acknowledgment window closed"]],
      cause: "Copperleaf Living received the orders. Its order acknowledgments have not been generated.",
      act: "Send an acknowledgment reminder to Copperleaf Living and flag the 37 orders to buying.", appr: "Buying operations lead", who: ["Buying", "Replenishment"] },
    f4: { p: 1, st: 6, partner: "Solara Personal Care", ot: "112 supplier invoices rejected on unit price", os: "824 rejections sent to Solara Personal Care cite unit price on 9 items. The invoices carry new costs; the purchase orders carry the previous cost.",
      bt: "112 invoices rejected with 824 (unit price)", bs: "Rejected invoices are rebilled or disputed, which delays payment.",
      ev: [["Monday", "832 cost change received from Solara Personal Care"], ["04:20", "First invoice failed price match"], ["07:30", "112 invoices held on the same 9 items"]],
      cause: "Invoice cost differs from PO cost on 9 items; the 832 with the new costs arrived Monday.",
      act: "Ask merchandising to send 860 cost changes for open orders, or ask Solara Personal Care to rebill at the PO cost.", appr: "Accounts payable lead", who: ["Accounts payable", "Merchandising", "Master data"] },
    f7: { p: 1, st: 8, partner: "Meadowline Care", ot: "Remittance advice not delivered", os: "The weekly 820 to Meadowline Care was due at 06:00. The last remittance went out 7 days ago.",
      bt: "Meadowline Care cannot apply this week's payments", bs: "Supplier collections may escalate while payments stay unapplied.",
      ev: [["Last Saturday 05:40", "Last 820 delivered"], ["06:00", "Expected remittance window closed"]],
      cause: "Same AS2 endpoint change as the order volume finding for Meadowline Care.",
      act: "Redeliver the 820 from TG Insights once the Meadowline Care endpoint is updated.", who: ["Accounts payable", "Supplier collaboration"] },
    f9: { p: 1, st: 0, partner: "Solara Personal Care", os: "New costs for 9 Solara Personal Care items are not on 61 open purchase orders. Invoices for these orders will fail price match.",
      bt: "$28,400 in invoices likely to fail match", bs: "The same price mismatch will affect 61 orders that are not invoiced yet.",
      ev: [["Monday", "832 cost change received for 9 items"], ["07:50", "61 open orders found with the previous cost"]],
      cause: "Purchase orders sent after Monday's 832 still carry the previous cost.",
      act: "Ask merchandising to send 860 cost changes for the 61 open orders.", appr: "Merchandising analyst", who: ["Merchandising", "Accounts payable"] },
    f10: { p: 1, st: 6, partner: "Tidewell Home", ot: "Functional acknowledgments not sent for 52 invoices", os: "52 invoices from Tidewell Home were delivered to your AS2 endpoint since 05:00 (MDNs returned). No 997 has gone back.",
      bt: "52 inbound invoices not acknowledged (no 997 sent)", bs: "Tidewell Home cannot confirm delivery and may resend, which risks duplicate invoices.",
      ev: [["05:00", "Last 997 sent for an invoice"], ["06:00", "Acknowledgment volume fell below the projected band"], ["08:10", "52 invoices held in the inbound queue"]],
      cause: "Your inbound translator queue for invoices paused after a restart at 04:55.",
      act: "Ask the integration team to restart the inbound invoice queue. The 52 997s go out when it resumes.", who: ["Accounts payable", "IT and ERP"] },
  };
  /* Demo state shared by the console and the Product overlay */
  var ccDone = {};
  var CCNET = /^(\d{3}|GDSN)/;
  function ccToks(lbl) { return lbl.split(" / ")[0].replace(/^GDSN /, "").split(/,\s*| or /); }
  /* The client solution depends on which side of the relationship the client is on. A supplier runs order to cash, warehouse fulfillment and deductions;
     a retailer runs purchase to pay, routing and delivery, and chargebacks. Indices refer to the reference processes. */
  var CCSOL = { supplier: [0, 8, 3], retailer: [1, 2, 3] };
  /* Client view of each process: steps the retailer adds in front (its own orders), steps hidden because another process in the solution already counts them,
     and 824 and 997 shown on the step they answer rather than as steps of their own */
  var CCVIEW = {
    supplier: { 0: { hide: [3], add: [["Order change", "860, 865 / ORDCHG, ORDRSP", 1]], order: [0, 1, 6, 2, 3, 4, 5] },
      8: { hide: [1, 4], add: [["Routing request", "753", 0], ["Routing instructions", "754", 1]], order: [0, 2, 6, 7, 3, 1, 4, 5] } },
    retailer: { 1: { n: "Purchase to pay", short: "Purchase to pay", owner: "Buying, receiving and accounts payable", pre: [["Purchase order", "850 / ORDERS", 0], ["Order acknowledgment", "855 / ORDRSP", 1], ["Order change", "860, 865 / ORDCHG, ORDRSP", 0]] },
      2: { hide: [3] }, 3: { n: "Chargebacks and deductions", short: "Chargebacks", owner: "Vendor compliance and accounts payable" } }
  };
  /* Per step, in client-view step order (null where Command Center cannot see the step): [direction, documents today, past SLA, 997 overdue, 824 rejects, oldest open].
     Breached = past SLA + 824 rejects; at risk = 997 overdue + predicted (pred). Illustrative. */
  var CCFLOW = {
    supplier: {
      0: { pred: 61, steps: [["In", 310, 0, 0, 0, "4 h 30 m"], ["Out", 262, 37, 3, 0, "28 h"], ["Out", 248, 14, 4, 9, "3 h 40 m"], null, ["Out", 226, 0, 52, 112, "2 d"], ["In", 146, 1, 0, 0, "7 d"], ["In", 38, 0, 0, 0, "1 d"]] },
      8: { pred: 0, steps: [["In", 18, 0, 0, 0, "1 d"], null, ["Out", 64, 0, 0, 0, "1 h 10 m"], ["In", 57, 1, 0, 0, "50 m"], null, ["In", 12, 0, 1, 0, "1 d"], ["Out", 24, 0, 0, 0, "2 h"], ["In", 22, 1, 0, 0, "1 h 50 m"]] },
      3: { pred: 0, steps: [null, ["In", 46, 0, 0, 0, "12 d"], ["In", 38, 2, 0, 0, "2 d"], null, null, ["Out / In", 16, 0, 0, 0, "9 d"]] }
    },
    retailer: {
      1: { pred: 61, steps: [["Out", 340, 74, 0, 0, "3 h 38 m"], ["In", 262, 37, 0, 0, "28 h"], ["Out / In", 41, 0, 0, 0, "1 d"], ["In", 58, 14, 0, 9, "3 h 20 m"], null, ["Out", 66, 0, 0, 0, "1 d"], ["In", 226, 0, 52, 112, "2 d"], null, ["Out", 28, 1, 0, 0, "7 d"]] },
      2: { pred: 0, steps: [["In", 22, 0, 0, 0, "4 h"], ["Out", 20, 1, 0, 0, "1 h 10 m"], ["Out / In", 31, 2, 1, 0, "5 h"], null, ["In", 140, 6, 0, 0, "1 d"], ["In", 35, 0, 0, 0, "6 d"]] },
      3: { pred: 0, steps: [null, ["Out", 46, 0, 0, 0, "12 d"], ["Out", 38, 1, 0, 0, "2 d"], null, null, ["Out", 16, 0, 0, 0, "9 d"]] }
    }
  };
  /* Key EDI measure per process: [label, value] */
  var CCKPI = {
    supplier: { 0: ["855 within SLA", "96.5%"], 8: ["945 within 4 hours of 940", "97.2%"], 3: ["Deduction rate on 820", "2.1%"] },
    retailer: { 1: ["856 first-pass acceptance", "97.4%"], 2: ["214 delivery event received", "88.0%"], 3: ["Chargeback lines per 820", "1.8"] }
  };
  /* Generic Performance Monitor process templates, used when the Retail pack is off. Steps come from the matching reference process unless given here. */
  var CCGEN = {
    0: { n: "Order to cash", owner: "Order management and accounts receivable", outcome: "Turn customer orders into shipped goods, invoices and collected cash.", measures: ["Order acknowledgment rate"] },
    8: { n: "Warehouse fulfillment", owner: "Distribution and logistics", outcome: "Release orders to the warehouse and confirm what shipped.", measures: ["Shipping advice within SLA"] },
    3: { n: "Claims and disputes", owner: "Accounts receivable", outcome: "Resolve customer claims and short payments with evidence.", measures: ["Dispute rate"],
      steps: [["Claim raised", "Off network"], ["Debit memo", "812"], ["Net remittance", "820 / REMADV"], ["Research and classify", "Off network"], ["Dispute", "Off network"], ["Settle", "812, 820 / REMADV"]] }
  };
  /* Business process board: open EDI work grouped by who must act next. Columns: us (we owe a document, a fix or a 997), pt (the partner owes one),
     rj (824 application advice), cl (cleared today). s is the flow step code the item belongs to; d and dir are the document in question from the client's side.
     sla: [rule, elapsed against window, percent of window used]. Items with f take partner, severity, agent and action from the finding; rt links a Retail pack case
     and only: "rt" shows the item only with that pack. Illustrative. */
  var CCBOARD = {
    supplier: {
      0: [
        { k: "s0a", c: "us", s: "850", d: "850", dir: "In", f: "f2", t: "74 purchase orders failing AS2 signature checks", n: 74, sla: ["850 volume within projected band", "64% below band", 150], ack: "AS2 MDN: signature verification failed", age: "3 h 38 m" },
        { k: "s0b", c: "us", s: "855", d: "855", dir: "Out", f: "f3", t: "37 purchase orders without an 855", n: 37, sla: ["855 within 24 h of 850", "28 h of 24 h", 117], ack: "850s acknowledged with 997 (AK9 A)", age: "28 h" },
        { k: "s0c", c: "us", s: "860", d: "865", dir: "Out", p: "Eastbank Market", ag: "Lex", t: "6 order changes without an 865", n: 6, sla: ["865 within 24 h of 860", "9 h of 24 h", 38], ack: "860s acknowledged with 997 (AK9 A)", age: "9 h",
          act: "Send 865 responses for the 6 changes, or hold them in order management with a reason.", appr: "Customer service lead" },
        { k: "s0d", c: "us", s: "856", d: "856", dir: "Out", f: "f1", t: "14 shipments without a ship notice", n: 14, sla: ["856 within 1 h of 945", "3 h 20 m of 1 h", 150], ack: "Not sent", age: "3 h 20 m", nt: "Loads reach the DC in about 5 h" },
        { k: "s0e", c: "us", s: "810", d: "810", dir: "Out", f: "f9", t: "61 open orders will invoice at the old cost", n: 61, pred: 1, ack: "Not yet invoiced", age: "1 h 40 m" },
        { k: "s0f", c: "pt", s: "810", d: "997", dir: "In", f: "f10", t: "52 invoices without a 997", n: 52, sla: ["997 within 2 h", "4 h 30 m of 2 h", 135], ack: "No AK9 received", age: "4 h 30 m" },
        { k: "s0g", c: "pt", s: "855", d: "997", dir: "In", p: "Harbor Grocers", ag: "Ivy", t: "3 order acknowledgments without a 997", n: 3, sla: ["997 within 2 h", "3 h 35 m of 2 h", 150], ack: "No AK9 received", age: "3 h 35 m",
          nt: "Same certificate change as the inbound 850s", act: "Ask Harbor Grocers to resend the 997s after its certificate is loaded.", appr: "EDI operations lead" },
        { k: "s0h", c: "pt", s: "856", d: "997", dir: "In", p: "Cedar & Coast", ag: "Ivy", t: "4 ship notices without a 997", n: 4, sla: ["997 within 2 h", "2 h 40 m of 2 h", 133], ack: "No AK9 received", age: "2 h 40 m",
          act: "Ask Cedar & Coast to confirm receipt of the 4 ship notices, and resend those it did not receive.", appr: "EDI operations lead" },
        { k: "s0i", c: "pt", s: "820", d: "820", dir: "In", f: "f7", t: "Weekly remittance advice not received", n: 1, sla: ["820 weekly, due 06:00", "3 h 30 m late", 150], ack: "No 820 received", age: "3 h 30 m" },
        { k: "s0j", c: "rj", s: "810", d: "824", dir: "In", f: "f4", t: "112 invoices rejected on unit price", n: 112, rej: ["011", "Not matching", "Unit price differs from PO"], ack: "810s acknowledged with 997 (AK9 A)", age: "5 h 10 m" },
        { k: "s0k", c: "rj", s: "856", d: "824", dir: "In", p: "Cedar & Coast", ag: "Nora", rt: "rt-shipment-labels", t: "9 ship notices rejected for duplicate SSCC", n: 9, rej: ["012", "Invalid combination", "Duplicate SSCC in carton loop"], ack: "856s acknowledged with 997 (AK9 A)", age: "1 h 08 m",
          act: "Ask shipping to correct the carton labels and resend the 9 ship notices with distinct SSCCs.", appr: "Shipping supervisor" },
        { k: "s0l", c: "cl", s: "856", d: "856", dir: "Out", p: "Eastbank Market", t: "6 ship notices accepted on resend", n: 6, at: "08:55", ack: "AK9 A received" },
        { k: "s0m", c: "cl", s: "850", d: "850", dir: "In", p: "Brightway Marketplace", t: "18 purchase orders loaded after ship-to cross-reference fix", n: 18, at: "07:40", ack: "997 sent (AK9 A)" }
      ],
      8: [
        { k: "s8a", c: "us", s: "940", d: "940", dir: "Out", p: "Crestline Logistics", ag: "Reese", rt: "rt-order-change", only: "rt", t: "Warehouse order carries the superseded quantity", n: 1, sla: ["940 matches the accepted 865 revision", "Pick cutoff 10:00", 85], ack: "940 acknowledged with 997 (AK9 A)", age: "50 m" },
        { k: "s8b", c: "us", s: "846", d: "997", dir: "Out", p: "Crestline Logistics", ag: "Ivy", t: "1 inventory advice without our 997", n: 1, sla: ["997 within 2 h", "2 h 25 m of 2 h", 121], ack: "Not sent", age: "2 h 25 m",
          act: "Ask the integration team to release the held 997 for the Crestline Logistics inventory advice.", appr: "EDI operations lead" },
        { k: "s8c", c: "us", s: "753", d: "945", dir: "In", p: "Eastbank Market", ag: "Liz", rt: "rt-shipment-sequence", only: "rt", t: "Load shipped before routing instructions", n: 1, sla: ["Ship after the 754 arrives", "50 m before the 754", 150], ack: "945 acknowledged with 997 (AK9 A)", age: "1 h 10 m" },
        { k: "s8d", c: "pt", s: "945", d: "945", dir: "In", p: "Crestline Logistics", ag: "Lex", t: "1 shipping advice past SLA", n: 1, sla: ["945 within 4 h of 940", "5 h 10 m of 4 h", 129], ack: "940 acknowledged with 997 (AK9 A)", age: "5 h 10 m",
          act: "Ask Crestline Logistics to confirm the shipment and send the 945.", appr: "Logistics coordinator" },
        { k: "s8e", c: "pt", s: "754", d: "754", dir: "In", p: "Eastbank Market", ag: "Lex", t: "1 routing request without instructions", n: 1, sla: ["754 within 1 h of 753", "1 h 50 m of 1 h", 150], ack: "753 acknowledged with 997 (AK9 A)", age: "1 h 50 m",
          act: "Follow up with Eastbank Market routing for the 754 before the load is released.", appr: "Transportation planner" },
        { k: "s8f", c: "cl", s: "945", d: "945", dir: "In", p: "Crestline Logistics", t: "57 shipping advices matched to warehouse orders", n: 57, at: "09:15", ack: "997 sent (AK9 A)" }
      ],
      3: [
        { k: "s3a", c: "us", s: "812", d: "812", dir: "In", p: "Brightway Marketplace", ag: "Reese", t: "4 debit memos to research", n: 4, sla: ["Dispute within 30 days of 812", "12 d of 30 d", 40], ack: "997 sent (AK9 A)", age: "12 d", val: 3860,
          act: "Match the debit memos to the invoices and ship notices, then dispute or accept each one.", appr: "Deductions analyst" },
        { k: "s3b", c: "pt", s: "820", d: "820", dir: "In", p: "Westline Home, Eastbank Market", ag: "Lex", t: "2 remittance advices past due", n: 2, sla: ["820 within 2 days of payment", "2 d 6 h of 2 d", 112], ack: "No 820 received", age: "2 d 6 h",
          act: "Ask both partners to send the 820 for the payments received.", appr: "Accounts receivable" },
        { k: "s3c", c: "pt", s: "820", d: "861", dir: "In", p: "Northfield Stores", ag: "Reese", rt: "rt-invoice-deduction", only: "rt", t: "2 deductions without a receiving advice", n: 2, val: 750, sla: ["Dispute within 30 days of 820", "2 d of 30 d", 7], ack: "No 861 received", age: "2 d" },
        { k: "s3d", c: "cl", s: "812", d: "812", dir: "In", p: "4 partners", t: "16 deductions settled", n: 16, at: "08:30", ack: "820 matched" }
      ]
    },
    retailer: {
      1: [
        { k: "r1a", c: "us", s: "850", d: "850", dir: "Out", f: "f2", t: "74 purchase orders failing AS2 delivery", n: 74, sla: ["850 delivered within 15 m", "3 h 38 m of 15 m", 150], ack: "AS2 connection refused; no MDN", age: "3 h 38 m" },
        { k: "r1b", c: "us", s: "810", d: "997", dir: "Out", f: "f10", t: "52 invoices without our 997", n: 52, sla: ["997 within 2 h", "4 h 30 m of 2 h", 135], ack: "Inbound invoice queue paused", age: "4 h 30 m" },
        { k: "r1c", c: "us", s: "820", d: "820", dir: "Out", f: "f7", t: "Weekly remittance advice not delivered", n: 1, sla: ["820 weekly, due 06:00", "3 h 30 m late", 150], ack: "Not sent", age: "3 h 30 m" },
        { k: "r1d", c: "us", s: "860", d: "860", dir: "Out", f: "f9", t: "61 open orders at the previous cost", n: 61, pred: 1, ack: "No 860 sent", age: "1 h 40 m" },
        { k: "r1e", c: "pt", s: "855", d: "855", dir: "In", f: "f3", t: "37 purchase orders without an 855", n: 37, sla: ["855 within 24 h of 850", "28 h of 24 h", 117], ack: "850s acknowledged with 997 (AK9 A)", age: "28 h" },
        { k: "r1f", c: "pt", s: "856", d: "856", dir: "In", f: "f1", t: "14 inbound loads without a ship notice", n: 14, sla: ["856 within 1 h of pickup", "3 h 20 m of 1 h", 150], ack: "Not received", age: "3 h 20 m", nt: "Loads reach the DC in about 5 h" },
        { k: "r1g", c: "pt", s: "856", d: "856", dir: "In", p: "Tidewell Home", ag: "Reese", rt: "rt-order-change", only: "rt", t: "Ship notice above the accepted order revision", n: 1, sla: ["856 within the accepted 865 revision", "1,000 of 800 units", 125], ack: "997 sent (AK9 A)", age: "50 m" },
        { k: "r1h", c: "rj", s: "810", d: "824", dir: "Out", f: "f4", t: "112 invoices rejected on unit price", n: 112, rej: ["011", "Not matching", "Unit price differs from PO"], ack: "810s acknowledged with 997 (AK9 A)", age: "5 h 10 m" },
        { k: "r1i", c: "rj", s: "856", d: "824", dir: "Out", p: "Solara Personal Care", ag: "Nora", rt: "rt-shipment-labels", t: "9 ship notices rejected for duplicate SSCC", n: 9, rej: ["012", "Invalid combination", "Duplicate SSCC in carton loop"], ack: "856s acknowledged with 997 (AK9 A)", age: "1 h 08 m",
          act: "Wait for corrected ship notices from Solara Personal Care; plan manual receipt if the loads arrive first.", appr: "DC receiving lead" },
        { k: "r1j", c: "cl", s: "810", d: "810", dir: "In", p: "Copperleaf Living", t: "23 invoices matched after 860 cost update", n: 23, at: "08:40", ack: "997 sent (AK9 A)" },
        { k: "r1k", c: "cl", s: "860", d: "865", dir: "In", p: "Fieldstone Essentials", t: "41 order changes acknowledged", n: 41, at: "09:05", ack: "997 sent (AK9 A)" }
      ],
      2: [
        { k: "r2a", c: "us", s: "754", d: "754", dir: "Out", p: "Fieldstone Essentials", ag: "Liz", rt: "rt-shipment-sequence", t: "1 routing request answered late", n: 1, sla: ["754 within 1 h of 753", "1 h 10 m of 1 h", 117], ack: "Supplier shipped before the 754", age: "1 h 10 m",
          act: "Review the sequence exception with Fieldstone Essentials and record the routing decision.", appr: "Transportation planner" },
        { k: "r2b", c: "pt", s: "204", d: "990", dir: "In", p: "Ridgeway Freight", ag: "Lex", t: "2 load tenders without a 990", n: 2, sla: ["990 within 2 h of 204", "5 h of 2 h", 150], ack: "1 tender without a 997", age: "5 h",
          act: "Call Ridgeway Freight for the tender responses, or retender the 2 loads.", appr: "Transportation planner" },
        { k: "r2c", c: "pt", s: "214", d: "214", dir: "In", p: "Ridgeway Freight", ag: "Lex", t: "6 loads without a delivery event", n: 6, sla: ["214 within 4 h of appointment", "1 d of 4 h", 150], ack: "No 214 received", age: "1 d",
          act: "Request the delivery status messages from Ridgeway Freight for the 6 loads.", appr: "Transportation planner" },
        { k: "r2d", c: "cl", s: "210", d: "210", dir: "In", p: "Ridgeway Freight", t: "35 freight invoices matched to tenders", n: 35, at: "08:10", ack: "997 sent (AK9 A)" }
      ],
      3: [
        { k: "r3a", c: "us", s: "820", d: "861", dir: "Out", p: "Nuvori Beauty", ag: "Reese", rt: "rt-invoice-deduction", t: "2 deductions without a receiving advice", n: 2, val: 750, sla: ["Supplier dispute window", "2 d of 30 d", 7], ack: "No 861 sent", age: "2 d",
          act: "Send the 861 receiving advice for the shipment, or reverse the two deductions.", appr: "Vendor compliance" },
        { k: "r3b", c: "us", s: "820", d: "820", dir: "Out", p: "Fieldstone Essentials", ag: "Lex", t: "1 remittance advice past due", n: 1, sla: ["820 within 2 days of payment", "2 d 4 h of 2 d", 108], ack: "Not sent", age: "2 d 4 h",
          act: "Ask accounts payable to release the 820 for Fieldstone Essentials.", appr: "Accounts payable lead" },
        { k: "r3c", c: "cl", s: "812", d: "812", dir: "Out", p: "5 suppliers", t: "16 deductions settled", n: 16, at: "08:30", ack: "820 sent" }
      ]
    }
  };
