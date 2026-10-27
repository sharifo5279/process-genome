# Retail and CPG product overlay

Source: Business Network Process Genome, Product overlay on the Retail and CPG Process Genome (https://process-genome.onrender.com/#retail/map).
Status: Concept preview for internal review. Diagrams are illustrative. Some capabilities shown are in development or planned and are not generally available. Results depend on implementation and partner participation. Names, scope and availability may change.

The Product overlay maps product coverage onto the retail documents in four steps: Connect, Comply, Optimize and Extend. Document codes follow each capability.

## Connect: partner connectivity
Brings partners without EDI teams onto electronic documents, on either side of the relationship. Web EDI lets suppliers answer retailer orders online. The supplier portal lets retailer and CPG hubs trade with vendors that have no EDI.

### Web EDI for suppliers
- Orders received and acknowledged online (850, 855)
- Order changes received and answered (860, 865)
- Ship notices with GS1-128 carton labels (856)
- Invoices filled from the order (810)
- Warehouse orders and shipping advice with 3PLs (940, 945)
- Remittance received (820)

### Supplier portal for retailer and CPG hubs
- Orders and changes tracked by vendor (850, 860)
- Line-level confirmations and counteroffers (855, 865)
- Ship notices built from the order, with matching labels (856)
- Goods receipt as proof of delivery (861)
- Invoices matched to the order (810)
- Remittance status (820)
- Carrier shipment status (214)

## Comply: retail compliance for suppliers
A separate product, not part of Command Center. Checks documents before delivery, alerts business users before a penalty, and scores compliance by retailer.

### Pre-delivery document validation
- Ship notices held when they break a retailer rule (856)
- Invoices held when they break a retailer rule (810)
- Held documents released, or replaced with a corrected version (856, 810)
- Duplicate ship notices and invoices stopped (856, 810)

### Order lifecycle and chargeback alerts
- Acknowledgment window set per retailer (855)
- Pending shipment alert before the ship notice window closes (850, 856)
- Invoice mismatch alert, with order, ship notice and invoice compared by SKU, quantity and price (810, 856, 850)
- Rejections by 824, 864 or email in the order lifecycle (824, 864)
- Deduction status and amount, with document evidence for disputes (820, 812)

### Fill rate and scorecard
- Fill rate by retailer, from order and acknowledgment (850, 855)
- Backordered and short lines followed to shipment and invoice (855, 856, 810)
- Ship notice accuracy and timeliness against variance bands (856)
- Invoice accuracy against the order and ship notice (810)

## Optimize: Command Center
Monitors each business process on the network and recommends the next action. Integration Monitor watches volume, timing and acknowledgments. Performance Monitor checks business rules across documents. ASN Intelligence monitors ship notice health by supplier.

### Integration Monitor
- Order volume against projection (850)
- Functional acknowledgments returned (997)
- Application advice rejections (824)
- Inventory feed on schedule (846)
- Sales feed on schedule (852)
- Remittance volume against projection (820)

### Performance Monitor rules
- Acknowledgment within 24 hours (855)
- Ship notice within 1 hour of pickup (856)
- Invoice matches order price and quantity (810)
- Item confirmed before the first order (CIC, CIN)
- Cost change loaded before invoicing (832, 879)
- Delivery events for every tendered load (214, 204)
- Shipping advice for every warehouse order (945, 940)
- Deduction backup inside the dispute window (812)
- Return credit matches an authorization (180)

### ASN Intelligence (in development)
- ASN health, failures and SLA adherence by supplier (856)
- Rejections explained with the rule and the fix (824)
- Missing acknowledgments on ship notices (997)

## Extend: agents at decision points
Agents predict a problem at a decision point, recommend an action and wait for a person to approve it.

1. **Cost change before invoicing** (879, 832, 810; value at stake: medium). Predicts invoice price mismatches before the invoice is sent. Where: Item sync into order to cash. Recommended action: Hold invoices and correct the cost on open orders. Approved by: Pricing analyst.
2. **Shipment at risk** (856; value at stake: high). Predicts a late or missing ship notice before arrival and recommends an action. Where: Ship notice interchange. Recommended action: Alert shipping to send the ship notices; track each 856 until accepted. Approved by: EDI operations lead.
3. **Dispute or accept a deduction** (820, 812; value at stake: high). Classifies the deduction, assembles backup and recommends dispute or accept. Where: Deductions. Recommended action: Dispute with backup attached, or accept. Approved by: Deductions analyst.
4. **Replenishment quantity** (852, 846; value at stake: medium). Recommends order quantities and flags out-of-stock risk from sales and stock. Where: VMI, drop ship and sales reporting. Recommended action: Adjust the proposed order quantity. Approved by: Demand planner.
5. **Repeat rejection** (824; value at stake: low). Traces the root cause and suggests the correction. Where: Application advice. Recommended action: Correct master data and resend. Approved by: Master data analyst.
6. **Carrier delay** (214, 204; value at stake: medium). Predicts a missed delivery appointment and recommends rebooking or retendering. Where: Routing and delivery. Recommended action: Rebook the appointment or retender the load. Approved by: Transportation planner.
7. **Store delivery dispute** (894, 895; value at stake: low). Flags adjustments likely to be disputed at check-in and the items behind them. Where: Direct store delivery. Recommended action: Flag items for check-in review. Approved by: Route sales manager.
8. **Inventory mismatch** (947; value at stake: low). Finds gaps between warehouse stock and supplier records before they hit fill rate. Where: 3PL fulfillment. Recommended action: Open a reconciliation with the 3PL. Approved by: Logistics coordinator.
9. **Return credit match** (180; value at stake: medium). Matches return credits to authorizations and flags unmatched deductions. Where: Returns. Recommended action: Match the credit or dispute the deduction. Approved by: Accounts receivable.

## Strategy overlay
How a hub grows its trading community, shown on the same documents.

- **Connect: Reach**. Bring trading partners onto the network so their documents flow. Question: Who is on the line? Measure: Active relationships, net new partners, and reach gap against the hub's supplier list.
- **Activate: Completeness**. Run every document each hub requires, so whole processes complete across the community. Question: Is each relationship running what its hub requires? Measure: Required documents live out of required, whole-line completion, and opportunity where a required document is not live.
- **Optimize: Performance**. Monitor every flow, catch exceptions and late documents, and fix them before they cost money. Question: Where does flow break or arrive late? Measure: Exceptions per 1,000 documents with volume, and timeliness against each hub's window.
- **Extend: Intelligence**. Use network data and intelligence to predict, recommend and act inside the process. Question: Where can intelligence decide or act? Measure: Decision points covered and value influenced, such as deductions recovered or chargebacks avoided.
