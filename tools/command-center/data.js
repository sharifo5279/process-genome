  /* Command Center data for Retail and CPG. Illustrative values for the concept preview. */
  var CCF = [
    { id: "f1", p: 0, st: 2, sev: "c", mod: "Performance Monitor", how: "Rule and prediction", pil: "Extend", dp: 2, partner: "Northfield Stores", n: 14, val: 8400, at: "07:10",
      ot: "Ship notices not sent for 14 shipments", os: "Carrier pickup confirmed at 06:10. No 856 sent, and the loads arrive at the DC in about 5 hours.",
      bt: "14 shipments arriving before their ship notice", bs: "Northfield Stores cannot receive the loads by scan until the ship notices arrive.",
      ev: [["06:10", "Carrier pickup confirmed for 14 loads"], ["06:12", "Shipments closed in the ERP"], ["07:10", "Rule breached: no 856 within 1 hour of pickup"], ["08:05", "Predicted arrival before ship notice for all 14 loads"]],
      cause: "The ERP shipment export stopped after a release at 05:45. Orders and invoices are unaffected.",
      act: "Build the 14 ship notices from carrier pickup and pack data, then send them to Northfield Stores.", appr: "EDI operations lead",
      area: "Missing documents", who: ["Supply chain", "IT and ERP", "Customer service"] },
    { id: "f2", p: 0, st: 0, sev: "c", mod: "Integration Monitor", how: "Anomaly", pil: "Optimize", partner: "Harbor Grocers", n: 74, val: 182000, at: "06:30",
      ot: "Order volume 64% below projection", os: "Harbor Grocers sent 41 purchase orders since 05:00 against 115 projected. Last interchange at 05:52.",
      bt: "Harbor Grocers orders down 64% this morning", bs: "About $182,000 in expected orders has not arrived in this window.",
      ev: [["05:52", "Last 850 interchange received"], ["06:30", "Volume fell below the projected band"], ["06:41", "AS2 receipts from the partner failing signature checks"], ["07:15", "Anomaly confirmed across two order windows"]],
      cause: "The partner rotated its AS2 signing certificate. Messages fail signature checks at the connection.",
      act: "Request the new certificate from Harbor Grocers, load it, and ask the partner to resend orders since 05:52.", appr: "EDI operations lead",
      area: "Certificate management", who: ["Customer service", "Information security", "Sales and key accounts"] },
    { id: "f3", p: 0, st: 1, sev: "w", mod: "Performance Monitor", how: "Rule", pil: "Optimize", partner: "Westline Home", n: 37, val: 3700, at: "05:00",
      ot: "37 acknowledgments past the 24-hour window", os: "Purchase orders received yesterday have no 855. Westline Home requires acknowledgment within 24 hours.",
      bt: "37 orders not confirmed with Westline Home", bs: "Unconfirmed orders risk cancellation by the customer.",
      ev: [["Yesterday 04:58", "37 purchase orders received and loaded"], ["05:00", "24-hour acknowledgment window closed"], ["05:05", "Orders found on credit hold in the ERP"]],
      cause: "The orders sit in ERP credit review. Acknowledgments are generated only after release.",
      act: "Ask order management to release the orders, or send acknowledgments with a hold status.", appr: "Customer service lead",
      area: "Fix routing", who: ["Customer service", "Finance and treasury"] },
    { id: "f4", p: 0, st: 4, sev: "c", mod: "Performance Monitor", how: "Rule", pil: "Optimize", partner: "Northfield Stores", n: 112, val: 46200, at: "04:20",
      ot: "112 invoices rejected on unit price", os: "824 application advice cites a price mismatch on 9 items since Monday's cost change.",
      bt: "$46,200 in invoices held for price mismatch", bs: "Northfield Stores will not pay the invoices until prices match the order.",
      ev: [["Monday", "New costs sent in the 832 price catalog"], ["04:20", "First 824 rejection on unit price"], ["07:30", "112 rejections on the same 9 items"]],
      cause: "The new costs were sent to the retailer but not loaded into billing.",
      act: "Correct the billing cost for 9 items and resend the 112 invoices.", appr: "Billing and pricing",
      area: "Rejections", who: ["Finance and treasury", "Master data"] },
    { id: "f7", p: 0, st: 5, sev: "w", mod: "Integration Monitor", how: "Missing document", pil: "Optimize", partner: "Harbor Grocers", n: 1, val: 0, at: "06:00",
      ot: "Remittance advice not received", os: "The weekly 820 from Harbor Grocers was due at 06:00. The last remittance arrived 7 days ago.",
      bt: "Harbor Grocers payments cannot be applied", bs: "Cash received without remittance detail stays unapplied until the 820 arrives.",
      ev: [["Last Saturday 05:40", "Last 820 received"], ["06:00", "Expected remittance window closed"]],
      cause: "Same certificate change as the order volume finding for Harbor Grocers.",
      act: "Ask Harbor Grocers to resend the 820 after the certificate is updated.", appr: "EDI operations lead",
      area: "Missing documents", who: ["Accounts receivable", "Sales and key accounts"] },
    { id: "f9", p: 0, st: 4, sev: "w", mod: "Performance Monitor", how: "Prediction", pil: "Extend", dp: 1, partner: "Northfield Stores", n: 61, val: 28400, at: "07:50",
      ot: "Cost change not applied to 61 open orders", os: "Open orders still carry the old cost for 9 items. Invoices from these orders will reject.",
      bt: "$28,400 in invoices likely to reject", bs: "The same price mismatch will hit 61 orders that have not been invoiced yet.",
      ev: [["Monday", "832 cost change sent for 9 items"], ["07:50", "61 open orders found with the old cost"]],
      cause: "The cost change did not update open orders in the ERP.",
      act: "Update the cost on the 61 open orders before invoicing.", appr: "Pricing analyst",
      area: "Cross-references and master data", who: ["Master data", "Finance and treasury"] },
    { id: "f10", p: 1, st: 3, sev: "w", mod: "Integration Monitor", how: "Anomaly", pil: "Optimize", partner: "Westline Home", n: 52, val: 0, at: "08:10",
      ot: "Functional acknowledgments missing for 52 invoices", os: "Westline Home has returned no 997 for invoices sent since 05:00. Its order acknowledgments arrive normally.",
      bt: "52 invoices without confirmed receipt", bs: "Invoices without a 997 may not have reached accounts payable at Westline Home.",
      ev: [["05:00", "Last 997 received for an invoice"], ["06:00", "Acknowledgment volume fell below the projected band"], ["08:10", "52 invoices unacknowledged"]],
      cause: "Not yet known. The partner's acknowledgments for other document types are flowing.",
      act: "Ask Westline Home to confirm receipt of the 52 invoices, and resend those it did not receive.", appr: "EDI operations lead",
      area: "Monitoring", who: ["Accounts receivable", "IT and ERP"] },
  ];
  /* The demo client solution covers three processes */
  var CCSTG = [["Order and fulfill", [0]], ["Receive and pay", [1]], ["Settle and recover", [3]]];
  /* Key measure per process: index into the process measures, illustrative value */
  var CCM = [[0, "96.4%"], [0, "93.8%"], [2, "91.5%"], [0, "2.1%"], [2, "98.6%"], [0, "0.9%"], [0, "97.2%"], [0, "95.1%"], [2, "99.1%"], [2, "6.5 days"], [0, "88.0%"]];
  /* Product overlay coverage for the retail genome */
  var PMPV = { retail: {
    im: [["Order volume against projection", ["850"]], ["Functional acknowledgments returned", ["997"]], ["Application advice rejections", ["824"]],
      ["Inventory feed on schedule", ["846"]], ["Sales feed on schedule", ["852"]], ["Remittance volume against projection", ["820"]]],
    pm: [["Acknowledgment within 24 hours", ["855"]], ["Ship notice within 1 hour of pickup", ["856"]], ["Invoice matches order price and quantity", ["810"]],
      ["Item confirmed before the first order", ["CIC", "CIN"]], ["Cost change loaded before invoicing", ["832", "879"]], ["Delivery events for every tendered load", ["214", "204"]],
      ["Shipping advice for every warehouse order", ["945", "940"]], ["Deduction backup inside the dispute window", ["812"]], ["Return credit matches an authorization", ["180"]]],
    asn: [["ASN health, failures and SLA adherence by supplier", ["856"]], ["Rejections explained with the rule and the fix", ["824"]], ["Missing acknowledgments on ship notices", ["997"]]],
    /* Recommended action and approver for each Extend decision point, in decision point order */
    ag: [["Hold invoices and correct the cost on open orders", "Pricing analyst"], ["Build and send the ship notice from pickup data", "EDI operations lead"],
      ["Dispute with backup attached, or accept", "Deductions analyst"], ["Adjust the proposed order quantity", "Demand planner"],
      ["Correct master data and resend", "Master data analyst"], ["Rebook the appointment or retender the load", "Transportation planner"],
      ["Flag items for check-in review", "Route sales manager"], ["Open a reconciliation with the 3PL", "Logistics coordinator"],
      ["Match the credit or dispute the deduction", "Accounts receivable"]]
  } };
  /* Retailer perspective (Northfield Stores) of the same findings. Base records above are the CPG supplier perspective (Nuvori Beauty). */
  var CCFR = {
    f1: { partner: "Nuvori Beauty", ot: "No ship notices for 14 inbound loads", os: "Carrier pickup confirmed at 06:10 for 14 Nuvori Beauty loads. No 856 received, and the loads reach the DC in about 5 hours.",
      bt: "14 inbound loads will be received by hand", bs: "Loads that arrive before their ship notice cannot be scanned at the dock.",
      ev: [["06:10", "Carrier pickup confirmed for 14 loads"], ["07:10", "Rule breached: no 856 within 1 hour of pickup"], ["08:05", "Predicted arrival before ship notice for all 14 loads"]],
      cause: "Nuvori Beauty has sent no ship notices since 05:45. Its acknowledgments and invoices arrive normally.",
      act: "Request the 14 ship notices from Nuvori Beauty and alert DC receiving to plan for manual receipt.", appr: "Supplier compliance lead", who: ["Supplier compliance", "DC receiving", "Merchandising"] },
    f2: { partner: "Meadowline Care", ot: "Outbound order volume 64% below projection", os: "41 purchase orders delivered to Meadowline Care since 05:00 against 115 projected. Last successful delivery at 05:52.",
      bt: "Replenishment orders not reaching Meadowline Care", bs: "About $182,000 in store replenishment orders is waiting for delivery.",
      ev: [["05:52", "Last 850 delivered to Meadowline Care"], ["06:30", "Volume fell below the projected band"], ["06:41", "AS2 deliveries returning connection errors"], ["07:15", "Anomaly confirmed across two order windows"]],
      cause: "Meadowline Care moved its AS2 endpoint in a maintenance window. Deliveries to the previous address fail.",
      act: "Confirm the new AS2 endpoint with Meadowline Care, update the connection, and resend orders since 05:52.", appr: "EDI operations lead", who: ["Replenishment", "Supplier compliance", "Information security"] },
    f3: { partner: "Copperleaf Living", ot: "37 acknowledgments past the 24-hour window", os: "Purchase orders sent to Copperleaf Living yesterday have no 855. Store allocation waits on confirmed quantities.",
      bt: "37 orders not confirmed by Copperleaf Living", bs: "Unconfirmed orders delay allocation and may need another source.",
      ev: [["Yesterday 04:58", "37 purchase orders delivered and functionally acknowledged"], ["05:00", "24-hour acknowledgment window closed"]],
      cause: "Copperleaf Living received the orders. Its order acknowledgments have not been generated.",
      act: "Send an acknowledgment reminder to Copperleaf Living and flag the 37 orders to buying.", appr: "Buying operations lead", who: ["Buying", "Replenishment"] },
    f4: { partner: "Solara Personal Care", ot: "112 supplier invoices failed price match", os: "Invoices from Solara Personal Care carry new costs on 9 items. The purchase orders still carry the previous cost.",
      bt: "$46,200 in invoices held in accounts payable", bs: "Held invoices miss early-payment terms unless resolved this week.",
      ev: [["Monday", "832 cost change received from Solara Personal Care"], ["04:20", "First invoice failed price match"], ["07:30", "112 invoices held on the same 9 items"]],
      cause: "The supplier cost change was received but not approved in the item master.",
      act: "Route the 9 cost changes to merchandising for approval, then rerun the invoice match.", appr: "Accounts payable lead", who: ["Accounts payable", "Merchandising", "Master data"] },
    f7: { partner: "Meadowline Care", ot: "Remittance advice not delivered", os: "The weekly 820 to Meadowline Care was due at 06:00. The last remittance went out 7 days ago.",
      bt: "Meadowline Care cannot apply this week's payments", bs: "Supplier collections may escalate while payments stay unapplied.",
      ev: [["Last Saturday 05:40", "Last 820 delivered"], ["06:00", "Expected remittance window closed"]],
      cause: "Same AS2 endpoint change as the order volume finding for Meadowline Care.",
      act: "Resend the 820 to Meadowline Care after the connection is updated.", who: ["Accounts payable", "Supplier collaboration"] },
    f9: { partner: "Solara Personal Care", os: "New costs for 9 Solara Personal Care items are not on 61 open purchase orders. Invoices for these orders will fail price match.",
      bt: "$28,400 in invoices likely to fail match", bs: "The same price mismatch will affect 61 orders that are not invoiced yet.",
      ev: [["Monday", "832 cost change received for 9 items"], ["07:50", "61 open orders found with the previous cost"]],
      cause: "Approved cost changes do not update open purchase orders.",
      act: "Update the cost on the 61 open orders, or ask Solara Personal Care to invoice at the order cost.", appr: "Merchandising analyst", who: ["Merchandising", "Accounts payable"] },
    f10: { partner: "Tidewell Home", ot: "Functional acknowledgments not sent for 52 invoices", os: "Invoices received from Tidewell Home since 05:00 have no outbound 997. The inbound invoice queue is paused.",
      bt: "52 supplier invoices not yet in accounts payable", bs: "Tidewell Home cannot confirm delivery and may resend, which risks duplicate invoices.",
      ev: [["05:00", "Last 997 sent for an invoice"], ["06:00", "Acknowledgment volume fell below the projected band"], ["08:10", "52 invoices held in the inbound queue"]],
      cause: "The inbound invoice queue paused after a translator restart at 04:55.",
      act: "Restart the inbound invoice queue, then send the 52 acknowledgments to Tidewell Home.", who: ["Accounts payable", "IT and ERP"] },
  };
  /* Demo state shared by the console and the Product overlay */
  var ccDone = {};
  var CCNET = /^(\d{3}|GDSN)/;
  function ccToks(lbl) { return lbl.split(" / ")[0].replace(/^GDSN /, "").split(/,\s*| or /); }
  /* Process instances in flight for the client solution, with documents waiting at each step (illustrative) */
  var CCFLOW = { 0: { n: 1284, ok: 1150, risk: 84, br: 50, steps: [310, 262, 248, 92, 226, 146] }, 1: { n: 284, ok: 262, risk: 16, br: 6, steps: [58, 41, 66, 52, 39, 28] }, 3: { n: 188, ok: 171, risk: 13, br: 4, steps: [22, 46, 38, 41, 25, 16] } };
  /* Generic Performance Monitor process templates, used when the Retail pack is off. Steps come from the matching reference process unless given here. */
  var CCGEN = {
    0: { n: "Order to cash", owner: "Order management and accounts receivable", outcome: "Turn customer orders into shipped goods, invoices and collected cash.", measures: ["Order acknowledgment rate"] },
    1: { n: "Procure to pay", owner: "Procurement and accounts payable", outcome: "Receive supplier goods against orders, match invoices and pay on terms.", measures: ["Supplier on-time delivery"] },
    3: { n: "Claims and disputes", owner: "Accounts receivable", outcome: "Resolve customer claims and short payments with evidence.", measures: ["Dispute rate"],
      steps: [["Claim raised", "Portal"], ["Debit memo", "812"], ["Net remittance", "820 / REMADV"], ["Research and classify", "ERP"], ["Dispute", "Portal"], ["Settle", "812, 820 / REMADV"]] }
  };
