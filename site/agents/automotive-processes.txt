# Automotive business processes

Source: Business Network Process Genome, Process Genome for Automotive (https://process-genome.onrender.com/#automotive/map).
Status: Examples describe typical operating scenarios, not specific customer accounts. Standards, versions, and mandate dates vary by partner and region. Confirm requirements with each partner before building.

## 1. Forecast and release
Outcome: Build and ship exactly what the OEM's releases call for, on the due date, without excess or obsolete stock.

The OEM tells suppliers what to make and ship through layered schedules: a blanket order for price and terms, a weekly forecast with firm near-term weeks, and a daily or weekly shipping schedule. Each new release replaces the last, and quantities are tracked as cumulative totals rather than order lines. Common errors are loading a release wrongly or netting it against the wrong cum.

- Parties: Supplier, OEM
- Business owner: Production control and material planning
- Measures: On-time delivery rating, Cum variance with the OEM, Premium freight events, Excess and obsolete inventory
- Documents, North America: 850, 860, 830, 862, 856
- Documents, Europe and international: DELFOR, DELJIT, DESADV, VDA 4984 and 4985 (replacing VDA 4905 and 4915), Odette KANBAN (DELJIT)

### Steps
1. **Blanket order** (850, from oEM)
   - What happens: The OEM issues a blanket purchase order, by 850 or on its supplier portal, setting price, terms and ship-to per part for the contract period. It carries no ship quantities. Changes to price, terms or engineering level follow on the 860 or the portal, where the OEM uses them.
   - Rules that bite: Shipments are authorized by releases, not by the blanket order. Under evaluated receipt settlement the OEM pays the order price, so a price mismatch surfaces only as a payment difference.
   - EDI team work: Maps the order into customer part and price records, maintains the cross-reference from the OEM part number to the internal item, and flags price changes to sales and accounts receivable.
   - If it fails: Releases arrive for a part the system does not know, and shipments are valued at the wrong price.
   - Work areas: Cross-references and master data, Map build and maintenance
2. **Planning schedule** (830 / DELFOR, from oEM)
   - What happens: The OEM sends a weekly forecast by part and ship-to over several months, in weekly then monthly buckets, with firm periods marked and cumulative authorizations stated.
   - Rules that bite: Each schedule replaces the previous one unless coded as a net change. Firm and planning quantities are coded per line, and fabrication and raw material authorizations cap what the OEM pays for if demand drops.
   - EDI team work: Loads each schedule so it replaces the prior one, checks the purpose code, maps firm and planning flags and authorizations into planning, and alerts planners to large week-over-week swings.
   - If it fails: Planning runs on an old or doubled forecast, and the supplier builds the wrong parts or runs short.
   - Work areas: Monitoring, Map build and maintenance, Missing documents
3. **Shipping schedule** (862 / DELJIT, from oEM)
   - What happens: The OEM sends near-term ship quantities and dates, often daily, that supersede the forecast's near-term ship data without replacing the forecast.
   - Rules that bite: Dates are often due-at-plant dates, so transit time is the supplier's to subtract. The shipping schedule does not authorize labor or material; the forecast's authorizations still govern.
   - EDI team work: Matches each shipping schedule to its forecast by part and ship-to, confirms it reached shipping before the cut-off, and chases the OEM when an expected file does not arrive.
   - If it fails: Shipping works from yesterday's numbers, and the plant receives too little, too much, or nothing.
   - Work areas: Missing documents, Monitoring, Partner follow-up
4. **Net and plan** (ERP, from supplier)
   - What happens: The supplier nets the requirement: the OEM's cum required less the supplier's cum shipped is what is still due. Planning schedules production and shipments from that.
   - Rules that bite: Netting works only if both sides count from the same cum start date and cum shipped includes every shipment. One missed ship notice or a reset on the wrong date skews every later release.
   - EDI team work: Compares cum received on each release with cum shipped, flags differences larger than goods in transit, and routes them to production control before the next ship date.
   - If it fails: The supplier over-ships into stock the OEM has not authorized, or under-ships and pays premium freight to recover.
   - Work areas: Cross-references and master data, Fix routing
5. **Ship to release** (856 / DESADV, from supplier)
   - What happens: The supplier ships the due quantity and sends a ship notice per shipment, which updates its cum shipped and tells the OEM what is in transit.
   - Rules that bite: The ship notice is due at or shortly after truck departure under each OEM's timing rule. Quantities beyond the release are over-shipments, and early or late arrival counts against the delivery rating.
   - EDI team work: Generates the ship notice from shipping, checks part, quantity and cum against the release, and confirms the OEM accepted it. See Ship notice and labels.
   - If it fails: The OEM's cum received drifts from the supplier's cum shipped, and the next release asks for the wrong quantity.
   - Work areas: Rejections, Monitoring

### Variants
- **Shipping schedule cadence**: The shipping schedule is daily in many programs and weekly in others. The forecast stays weekly either way.
- **Net change releases** (830 net change): Some OEMs send only the changes since the last release, and the purpose code says so. Loading a net change as a replacement wipes out the unchanged lines.
- **Kanban** (862 or Portal / DELJIT (Odette KANBAN)): Kanban plants send a pull signal per card or container instead of a dated schedule. X12 has no separate kanban set: depending on the OEM, signals arrive on the 862 or through its supplier portal. Odette publishes a KANBAN message built on DELJIT.
- **Phase-out**: At model-year end or part phase-out the forecast flags the part for balance-out, and the supplier builds only what the final releases authorize. See Cumulative reconciliation and balance-out.
- **Tier 1 to sub-tier** (830, 862, 856): Tier 1 suppliers pass the same forecast and shipping schedules down to their own suppliers and require the same ship notices back.

### Penalties and disputes
- Delivery rating: each shipment is scored against its due date, and stricter programs count early and late arrivals alike as misses. At some customers a low rating triggers a recovery plan and then a countermeasure, each within a fixed time.
- Flexibility rules: many customers' supplier manuals require suppliers to absorb defined week-over-week and cumulative increases inside the raw material and fabrication window. A shortage caused by not absorbing them is the supplier's to recover.
- Premium freight caused by the supplier is paid by the supplier, and expedites usually need the customer's approval number before shipping or are debited.
- Over-shipment beyond the released quantity is a delivery discrepancy, and the excess sits outside what the OEM has authorized.
- Obsolescence: when demand drops, the OEM pays for material only up to the highest fabrication and raw material authorization it sent, and only for claims filed by its deadline.

### Watch for
- The forecast is not a shipping authorization. Ship from the shipping schedule, or from the firm periods where the OEM's guide says so, never from planning quantities.
- Each release replaces the last. A release loaded twice or out of order doubles or rolls back demand, so check release number and date on every load.
- A shipping schedule supersedes the forecast's near-term ship data, not its authorizations or later weeks.
- Due-at-plant dates and ship dates look alike in different OEM guides. Confirm which one each partner sends before mapping.
- Read the cum received on every release. A gap larger than goods in transit means a lost ship notice or receipt, and every later release is off by the same amount.
- Schedules state demand either as discrete quantities per date or as cum required. Netting one as the other double counts or drops demand, so confirm which each OEM sends.
- Where the customer's guide carries the engineering change level on the release, ship and label at the released level. A level mismatch is a common cause of ship notice rejections.

### Europe and international
- DELFOR carries the call-off and DELJIT the just-in-time call-off with unloading point and time window. The call-off typically looks months ahead; the JIT call-off covers the next days to weeks.
- In Germany, VDA 4905 and 4915 flat files are being replaced by VDA 4984 (DELFOR) and VDA 4985 (DELJIT), but the flat files are still widely used. Expect both across one customer base.
- Each VDA call-off supersedes the earlier ones and carries the customer's cum received, as the 830 does.
- In Japan, the JAMA and JAPIA DELFOR covers plan, tentative and confirmed quantities, and every DELJIT instruction is firm, with date and time slot, dock and unloading point.

## 2. Cumulative reconciliation and balance-out
Outcome: Keep supplier and OEM cum totals in agreement, and get paid for authorized material left at phase-out.

Automotive schedules run on cumulative quantities: the OEM reports what it has received since a start date, and the supplier tracks what it has shipped. The difference should equal goods in transit. When it does not, every release is wrong and payments drift, and at model-year end or phase-out the gap decides who pays for leftover material.

- Parties: Supplier, OEM
- Business owner: Production control and accounts receivable
- Measures: Cum variance with the OEM, Time to close cum discrepancies, Obsolescence claims recovered, Unexplained payment differences
- Documents, North America: 856, 861, 830
- Documents, Europe and international: DESADV, RECADV, DELFOR, VDA 4987, VDA 4984 (replacing VDA 4905)

### Steps
1. **Cum shipped** (856 / DESADV, from supplier)
   - What happens: Every ship notice adds its quantity to the supplier's cum shipped for that part and ship-to, counted from the agreed cum start date.
   - Rules that bite: Each shipment must be counted exactly once, including notices cancelled and resent. The supplier's cum start date must match the OEM's, or the two totals never agree.
   - EDI team work: Reconciles ship notices sent against shipments in the ERP every day, and finds notices that failed, were rejected or went out twice.
   - If it fails: Cum shipped is wrong, and every reconciliation after it starts from a false number.
   - Work areas: Missing documents, Rejections, Monitoring
2. **Receipt adjustments** (861 / RECADV, from oEM)
   - What happens: Where its program uses the advice, the OEM reports receiving problems: over or short against the notice, no notice, returns, authorized scrap and cum adjustments.
   - Rules that bite: Receipts against a failed or missing notice may be booked late, by hand or at a different quantity. Whether returns and scrap reduce cum received depends on the OEM's rules.
   - EDI team work: Maps each receiving advice to the original ship notice, posts adjustments to the cum record, and routes quantity differences to shipping and quality for evidence.
   - If it fails: Adjustments sit unread, and the cum gap grows without anyone knowing why.
   - Work areas: Fix routing, Cross-references and master data
3. **Cum received** (830 / DELFOR, from oEM)
   - What happens: Each release carries the OEM's last receipt and its cum received since the start date, alongside the fabrication and raw material authorizations.
   - Rules that bite: Cum shipped minus cum received must equal goods in transit, checked on every release. Some programs allow only a short window to raise a discrepancy.
   - EDI team work: Extracts last receipt and cum received from each release, compares them with cum shipped and open ship notices, and opens a discrepancy with the OEM for any unexplained gap.
   - If it fails: The discrepancy window passes, and the supplier is left arguing against the OEM's count without a timely claim.
   - Work areas: Monitoring, Partner follow-up
4. **Cum reset** (830 / DELFOR, from oEM)
   - What happens: On the agreed date, often yearly or at model-year change, the OEM resets cum received to zero, and both sides restart their counts.
   - Rules that bite: Both sides must reset on the same date. Close open discrepancies before it, because releases after the reset no longer show the old totals.
   - EDI team work: Confirms the reset date with the OEM, checks that the first release after it shows the new start date for every part, and resets cum shipped in the ERP on the same date.
   - If it fails: The two sides count from different dates, and every release after the reset nets wrongly.
   - Work areas: Partner follow-up, Cross-references and master data
5. **Balance-out** (830 / DELFOR, from oEM)
   - What happens: At phase-out or model-year end the OEM flags the part for balance-out and sends final releases; the supplier builds and ships only to that final quantity.
   - Rules that bite: The OEM pays for leftover material only up to its highest fabrication and raw material authorization, and only for claims filed within a fixed period. Some OEMs ignore claims below a minimum value.
   - EDI team work: Maps the balance-out flag so planning stops building past the final quantity, and keeps every release with its authorizations as evidence for the claim.
   - If it fails: The supplier builds parts no one will buy and cannot prove what the OEM authorized.
   - Work areas: Map build and maintenance, Reporting and documentation

### Variants
- **Returns and the cum**: Practice varies. Some OEMs never reduce cum received for returns to the supplier; others let returns linked to discrepancy reports move it up or down. Read each OEM's rule before reconciling.
- **Reset timing**: Resets fall on a fixed annual date, at model-year change, or on a date the OEM announces in advance. VDA call-offs carry the reset date, so check it on every call-off.
- **Tier 1 to sub-tier** (830, 856): Tier 1 suppliers run the same cum logic with their own suppliers, so a tier 1 is the customer in one reconciliation and the supplier in another.

### Penalties and disputes
- Discrepancy windows: some programs allow only a short period after a release to raise a cum discrepancy, and a late challenge is hard to win.
- Shipments without a ship notice, or with a quantity that differs from the notice, become discrepancy reports and debits, and also distort the cum.
- Under evaluated receipt settlement the supplier is paid on the OEM's receipts, so a receipt the OEM never booked is a shipment never paid.
- Obsolescence claims: limited to the highest fabrication and raw material authorization, filed by a deadline after phase-out, and subject to a minimum value at some OEMs.

### Watch for
- Cum received is the OEM's count, not the supplier's. The difference to cum shipped should equal goods in transit and nothing more.
- Check the cum start date on every release. A new start date means a reset happened, announced or not.
- Returns are a common source of cum arguments because OEMs treat them differently. Agree in writing whether each return type moves the cum.
- A ship notice resent after a rejection must replace the original, or the OEM may expect the shipment twice.
- Keep every release and receiving advice. In a phase-out claim the authorization history is the evidence.
- Many OEM 856 guides require the supplier's cum shipped on each line, in the quantity shipped to date field. A wrong or reset value there starts a cum dispute on its own.

### Europe and international
- VDA call-offs carry the customer's cum received. In-transit is cum shipped minus cum received, as in North America.
- The customer announces a cum reset by sending the reset date in the call-off. Check that every part's next call-off shows the new date.
- VDA 4905 is being replaced by VDA 4984 (DELFOR). Where the customer reports receipts electronically, it uses RECADV.

## 3. Ship notice and labels
Outcome: Every shipment arrives with an accepted ship notice and scannable labels, so the dock receives it at once.

The ship notice and container labels are how an automotive plant receives material: the dock scans labels and books them against the notice. Notices are due within a set time after truck departure, must carry the bill of lading, and must match the labels exactly. Errors become discrepancy reports, scorecard hits and debits, and goods that arrive before their notice can wait at the gate.

- Parties: Supplier, OEM, Carrier
- Business owner: Shipping and logistics
- Measures: ASN timeliness, ASN accuracy, Label compliance, Discrepancy reports received
- Documents, North America: AIAG B-10, AIAG B-16, 214, 856, 997, 824
- Documents, Europe and international: Odette OTL, VDA 4994 (replacing VDA 4902), IFTSTA, DESADV, VDA 4987 (replacing VDA 4913), APERAK (VDA 4937)

### Steps
1. **Pack and label** (B-10, B-16 / VDA 4994, from supplier)
   - What happens: The supplier packs to the OEM's packaging specification and labels each container and load with part number, quantity, supplier and a unique serial or license plate in barcode form.
   - Rules that bite: Label content and layout follow the OEM's guide: the AIAG trading partner label or the Global Transport Label, with license plate identifiers and linear or 2D symbols. Label data must match the ship notice.
   - EDI team work: Maintains label templates and serial number ranges, and checks that label serials and the ship notice come from the same shipping record.
   - If it fails: The dock cannot scan the containers, and each label error is written up as a discrepancy.
   - Work areas: Business programs, Cross-references and master data
2. **Carrier pickup** (214 / IFTSTA, from carrier)
   - What happens: The carrier collects the load against a signed bill of lading and reports pickup and delivery status to the party that booked it.
   - Rules that bite: The bill of lading number must also appear on the ship notice. Under OEM-managed freight the carrier and pickup window come from the OEM's routing, not the supplier's choice.
   - EDI team work: Captures the bill of lading and carrier code from shipping for the ship notice, and monitors carrier status messages where the supplier receives them.
   - If it fails: The ship notice goes out without a bill of lading and fails, or the load misses its pickup window.
   - Work areas: Cross-references and master data, Monitoring
3. **Ship notice** (856 / DESADV, from supplier)
   - What happens: At truck departure the supplier sends one notice per shipment with bill of lading, carrier, parts, quantities, packaging and container serials that match the labels.
   - Rules that bite: Timing is set per OEM: within a fixed time after departure, or before arrival if that is sooner. A notice without a bill of lading, or with quantities or serials that differ from the labels, fails.
   - EDI team work: Generates the notice from the shipping record at departure, validates bill of lading, quantities and label serials before sending, and tracks every shipment that left without a notice.
   - If it fails: The truck waits at the gate or the plant receives by hand, and a debit and scorecard hit follow.
   - Work areas: Monitoring, Missing documents, Rejections
4. **Application advice** (824, from oEM)
   - What happens: Where the OEM uses it, it validates each ship notice against its guide and open releases, and returns acceptance or the errors for a rejected notice.
   - Rules that bite: A rejected notice must be corrected and resent, ideally before the truck arrives. Repeat errors can escalate from discrepancy reports to formal corrective action, and then to debit notes.
   - EDI team work: Routes each rejection to shipping or master data by error type, confirms the corrected notice replaces the original, and reports rejection trends against the OEM's scorecard.
   - If it fails: Rejected notices go unseen, receipts stall, and accuracy scores fall.
   - Work areas: Rejections, Fix routing, Reporting and documentation
5. **Dock receipt** (ERP, from oEM)
   - What happens: The OEM's dock scans container labels and books the receipt against the ship notice, which updates received quantities and the cum.
   - Rules that bite: Goods that arrive before their ship notice may be held at the gate or received by hand. Label mismatches and quantities over or under the notice are written up as delivery or information discrepancies.
   - EDI team work: Watches for receipt problems the OEM reports, and pulls the shipping record, label data and ship notice needed to answer each one.
   - If it fails: Material sits unreceived, the line may run short, and the shipment stays unpaid until resolved.
   - Work areas: Fix routing, Support desk and on-call

### Variants
- **Evaluated receipt settlement**: Where the OEM pays from receipts, the ship notice acts as the invoice, so its part, quantity and order data decide what the supplier is paid. See Receipt and settlement.
- **Supplier-booked freight** (204, 990, 214): When the supplier books transport, it chooses the carrier and receives its status messages. Under OEM-managed freight the OEM or its logistics provider books it. See Inbound transport.
- **Global Transport Label** (B-16, VDA 4994): The Global Transport Label is a joint AIAG, Odette and Japanese standard: AIAG B-16 in North America and the Odette profile VDA 4994 in Europe. Programs move to it from older national labels.

### Penalties and disputes
- Late or missing ship notice: sent after the OEM's window from truck departure, or not at all. Commonly charged back per shipment.
- Ship notice without a bill of lading, or with quantities or serials that do not match the labels: written up as a discrepancy report, scored against information accuracy, and debited per report.
- Label errors: missing, unscannable or wrong labels are discrepancy reports, and repeats escalate to a formal quality complaint.
- Repeat ship notice errors: at some customers, structured problem solving (8D) is required within a fixed period, followed by debit notes if errors continue.
- Debits arrive on remittance or as debit notes. Some buyers require a response within a few working days and make unanswered debits final.

### Watch for
- The clock runs from truck departure, not end of shift. A notice created by a nightly batch is late under any departure-based rule.
- The ship notice and the labels must come from the same shipping record. A label printed before a last-minute change is a common cause of mismatch.
- A transmission acknowledgment shows only that the file arrived. The application advice shows whether the notice was accepted.
- A corrected notice must replace the original, using the cancel or replace method the OEM's guide specifies. Two notices for one shipment double what the OEM expects to receive and distort the cum.
- Plants close to the supplier can receive the truck soon after departure, so a rejected notice must be fixed in minutes, not the next day.
- Master and mixed-load labels must line up with the pallet level of the ship notice, and container label serials with its container lines.

### Europe and international
- DESADV is the ship notice. In Germany VDA 4913 is being replaced by VDA 4987 (DESADV); VDA 4913 carries delivery note and transport data, including the packaging structure.
- Labels follow the Odette transport label or the Global Transport Label, whose Odette profile is VDA 4994; VDA 4994 replaces VDA 4902.
- Some customers require the ship notice to match the Global Transport Label exactly and debit repeated mismatches after corrective action.
- Carrier status travels as IFTSTA, which VDA 4945 profiles in Germany.
- Japanese guides from JAMA and JAPIA call for one DESADV per shipping operation on EDIFACT D.07A, aligned with the AIAG and Odette guides.
- VDA 4937 covers APERAK, the application advice some customers use to return ship notice errors, as the 824 does in North America.

## 4. Just in sequence
Outcome: Deliver each vehicle's parts in build order, on time to the line, without stopping it.

The OEM tells a sequencing supplier which part variant to deliver for each vehicle, in build order, timed to the assembly line. There are no line-side buffers, so a wrong, late or out-of-order part can stop the line. Timing ranges from a daily sequence sent weeks ahead to a call per vehicle that leaves little time between call and shipment.

- Parties: Sequencing supplier, OEM
- Business owner: Production control and sequencing operations
- Measures: Sequence accuracy, On-time delivery to line, Line stoppages caused, Premium freight events
- Documents, North America: 830, 866, 856
- Documents, Europe and international: DELFOR, DELJIT (Odette SYNCRO), VDA 4986 (replacing VDA 4916), DESADV, VDA 4987

### Steps
1. **Volume forecast** (830 / DELFOR, from oEM)
   - What happens: The OEM sends the planning forecast for the sequenced parts, which sets capacity, material and authorizations, as for any production part.
   - Rules that bite: The sequence message does not authorize labor or material. Material liability still comes from the forecast's authorizations, so the forecast is loaded and reconciled as usual.
   - EDI team work: Loads the forecast and authorizations as in Forecast and release, and checks that the sequenced part numbers match the variants that appear in the sequence.
   - If it fails: The supplier lacks components for the variants the line will call.
   - Work areas: Map build and maintenance, Cross-references and master data
2. **Sequence broadcast** (866 / DELJIT, from oEM)
   - What happens: The OEM sends the build sequence: for each vehicle, its identifier, sequence number, part or variant, assembly point and when the part is needed.
   - Rules that bite: New messages replace or amend earlier sequence data, and cancellations remove a vehicle without replacement. Sequence numbers, not vehicle numbers, set rack order, because vehicle numbers can have gaps.
   - EDI team work: Monitors the feed continuously, alerts at once on gaps in sequence numbers or a stalled feed, and resolves unknown part or variant codes against master data.
   - If it fails: The supplier builds blind or stops, and the line runs out of parts once the lead time is used up.
   - Work areas: Monitoring, Support desk and on-call, Outages and recovery
3. **Build in sequence** (ERP, from sequencing supplier)
   - What happens: The supplier builds or picks each variant, loads racks in sequence-number order, and prints rack and sequence papers.
   - Rules that bite: Each rack position matches one sequence number, and a vehicle without the part leaves its position empty. The rack must ship by the time the call sets.
   - EDI team work: Keeps the interface from the broadcast to the sequencing system running around the clock, and recovers it after an outage without skipping or repeating vehicles.
   - If it fails: A rack ships out of order, and the line installs the wrong part or stops.
   - Work areas: Outages and recovery, Monitoring
4. **Sequence ship notice** (856 / DESADV, from sequencing supplier)
   - What happens: The supplier sends a ship notice per sequenced delivery as it leaves, usually naming the rack and the sequence numbers or vehicle references in it, as each OEM's guide sets.
   - Rules that bite: The notice follows the same timing and accuracy rules as any ship notice, with less time to fix it, because the next delivery follows soon after.
   - EDI team work: Generates the notice from the sequencing system at departure, checks it against the racks shipped, and fixes rejections before the next delivery leaves.
   - If it fails: The plant cannot book the receipt, and payment and the cum drift for every rack after it.
   - Work areas: Rejections, Missing documents
5. **Line delivery** (ERP, from oEM)
   - What happens: The OEM's line takes parts from the rack in order and installs them on each vehicle as it reaches the station.
   - Rules that bite: With no line-side buffer, a missing, wrong or out-of-order part stops the line or forces rework. Buyers' terms let them charge back the costs of a stoppage or missed delivery the supplier caused.
   - EDI team work: Supports root-cause analysis with message timestamps, sequence numbers and ship notices, to show whether an error came from the broadcast or from the supplier.
   - If it fails: The line stops, and the supplier pays recovery and downtime costs.
   - Work areas: Reporting and documentation, Chargebacks and deductions management

### Variants
- **Daily sequence weeks ahead** (866 / DELJIT (Odette SYNCRO)): Some OEMs send the sequence once a day, well before assembly, with each vehicle sent once. Check how the OEM sends later changes.
- **Per-vehicle calls** (VDA 4986): Other programs send one call per part and vehicle, continuously through each shift, with little time from call to shipment.
- **Sequencing center** (866 / DELJIT; 830, 862 upstream): A sequencing center near the plant, run by a tier 1 or a logistics provider, receives the broadcast and sequences parts from stock. Its parts suppliers ship on ordinary releases.

### Penalties and disputes
- Line stoppage: costs from a stoppage or missed delivery the supplier caused are charged back under the buyer's terms, and the incident is recorded on the supplier scorecard.
- Premium freight to recover a missed delivery is at the supplier's expense and needs the customer's approval number before it ships, or it is debited.
- Wrong or nonconforming parts: the costs of containment and rework are charged back to the supplier.
- Ship notice errors follow the same discrepancy report and debit rules as any other shipment.

### Watch for
- In EDIFACT, sequence calls travel on DELJIT, under the Odette SYNCRO subset or the VDA 4986 profile. Look for those, not for a separate sequencing message.
- In per-vehicle programs a stalled feed uses up the lead time in minutes, so alerting and on-call response matter more here than in any other flow.
- Some plants send the broadcast in their own format over a direct connection instead of the 866. Check each plant's guide before assuming X12.
- The sequence message is not a material authorization. Authorizations still come from the forecast.
- Amendments and cancellations arrive on the same feed. Apply them in the order received, or a cancelled vehicle gets built.
- Many plants run around the clock, so schedule map changes, certificate renewals and connection work in the plant's downtime windows.

### Europe and international
- DELJIT carries the sequence, using the Odette SYNCRO subset. In Germany VDA 4916 flat files are being replaced by VDA 4986 (JIS call-off on DELJIT).
- VDA 4986 data takes precedence over the earlier call-off (VDA 4984) and JIT call-off (VDA 4985) for the same part, and the shipment is reported with VDA 4987.
- A VDA 4986 call covers one part for one vehicle, with production number, assembly line, parts family, part number, shipping time and sequence number. Items of the same parts family can share a rack.

## 5. Receipt and settlement
Outcome: Get paid the right amount for every receipt, on time, with debits and disputes closed inside their windows.

Many OEMs pay suppliers from their own receipts and agreed prices without a supplier invoice: evaluated receipt settlement in North America, self-billing in Europe. The supplier's control point moves from issuing invoices to checking what the OEM paid against what it shipped. Receipt errors, price differences and debits all surface in the remittance.

- Parties: Supplier, OEM
- Business owner: Accounts receivable and customer accounting
- Measures: Days sales outstanding (DSO), Payment differences per remittance, Debits disputed and recovered, Invoice rejection rate
- Documents, North America: 856, 861, 820, 810, 824
- Documents, Europe and international: DESADV, RECADV, INVOIC (self-billing), REMADV, VDA 4989 (entry certificate on RECADV), VDA 4938 (replacing VDA 4908 and 4906), VDA 4988 (replacing VDA 4907)

### Steps
1. **Ship notice** (856 / DESADV, from supplier)
   - What happens: The ship notice states part, quantity, purchase order and bill of lading for each shipment. Under receipt settlement it is the basis for payment.
   - Rules that bite: Under evaluated receipt settlement the ship notice acts as the invoice, so a wrong order, part or quantity is paid wrongly or not at all.
   - EDI team work: Validates order and part references on every notice against the blanket order, and treats a rejected notice as unpaid revenue until it is corrected.
   - If it fails: Shipments go unpaid, or are paid at the wrong price or against the wrong order.
   - Work areas: Rejections, Cross-references and master data
2. **Receiving advice** (861 / RECADV, from oEM)
   - What happens: Where its program uses the advice, the OEM reports receipt differences: over or short against the notice, no notice, returns, scrap and cum adjustments.
   - Rules that bite: The OEM pays what it booked, not what was shipped. Differences must be challenged with shipping evidence inside the OEM's response window.
   - EDI team work: Matches each receiving advice to its ship notice, and routes differences to shipping and accounts receivable with the bill of lading and proof of delivery.
   - If it fails: Short receipts become short payments that nobody challenges.
   - Work areas: Fix routing, Chargebacks and deductions management
3. **Settle receipts** (ERP / INVOIC, from oEM)
   - What happens: The OEM values each receipt at the agreed price and creates the payable itself. In Europe it sends a self-billing invoice, which is the VAT invoice for the supply.
   - Rules that bite: Payment uses the OEM's price, so a price change not loaded on both sides becomes a payment difference. The supplier must check each self-billing invoice against delivery notes, price and deductions.
   - EDI team work: Loads self-billing invoices into accounts receivable, matches them line by line to ship notices and prices, and keeps them as the supplier's VAT records.
   - If it fails: Price and quantity errors pass unnoticed, and VAT records do not match what was paid.
   - Work areas: Chargebacks and deductions management, Regulatory mandates
4. **Payment and remittance** (820 / REMADV, from oEM)
   - What happens: The OEM pays by electronic funds transfer and sends remittance detail listing the receipts or invoices paid and any debits taken.
   - Rules that bite: One payment covers many shipments, net of debits for discrepancies, chargebacks and premium freight. Dispute windows start when the debit is issued, and unanswered debits become final.
   - EDI team work: Loads the remittance into cash application, maps debit reason codes, and sends each debit to its owner with the matching notice, receipt and remittance line.
   - If it fails: Cash sits unapplied, and debits pass their dispute window.
   - Work areas: Chargebacks and deductions management, Missing documents
5. **Reconcile and dispute** (ERP, from supplier)
   - What happens: The supplier matches payments to its own shipments and prices, and disputes short payments and debits with evidence.
   - Rules that bite: Some buyers require a response to a chargeback within a few working days and debit it automatically after a fixed period. Evidence is the ship notice, bill of lading, signed receipt and price agreement.
   - EDI team work: Produces open-shipment and unpaid-receipt reports from ship notices and remittances, and retrieves the original documents and timestamps each dispute needs.
   - If it fails: Revenue is lost to debits and short payments that were never challenged.
   - Work areas: Chargebacks and deductions management, Reporting and documentation

### Variants
- **Supplier invoice** (810, 824 / INVOIC): Where the OEM does not use receipt settlement, the supplier invoices each shipment, and the OEM's application advice rejects invoices with bad references for correction.
- **EU self-billing agreement** (INVOIC (self-billing)): EU VAT rules allow self-billing only under a prior agreement with the supplier and a procedure for it to accept each invoice. The self-billed invoice must state that it is self-billing.
- **Tier 1 to sub-tier** (856, 820 or 810): Tier 1 suppliers settle with their own suppliers the same way, by receipt settlement or by supplier invoice.

### Penalties and disputes
- Discrepancy debits: shipments without a ship notice, with wrong quantities or with failed labels are debited per report and netted from the next payment.
- Price differences: payment at the OEM's price where the supplier's differs, settled as a short payment the supplier must chase.
- Premium freight and line stoppage costs the supplier caused are charged back and netted from remittance.
- Invoices, where used: wrong order, part or price references are rejected by application advice and stay unpaid until corrected.
- Response windows: chargebacks not answered within the buyer's window are debited automatically and are hard to reverse.

### Watch for
- Under receipt settlement there is no invoice to fix. Correct the ship notice or the price record, or the error repeats on every shipment.
- Payment follows the OEM's receipt, not the supplier's shipment. A receipt never booked is a shipment never paid.
- Check a self-billing invoice as closely as a customer's own invoice: line by line against delivery notes, price and deductions.
- Keep ship notices, receipts and remittance lines linked by shipment number. Disputes are won with that chain.
- Price changes agreed after shipment are often settled as separate retroactive credits or debits. Track them apart from shipment payments, or they look like short payments.

### Europe and international
- Self-billing is the usual model. VDA 4908 and 4906 flat files no longer meet legal requirements and are replaced by VDA 4938 (INVOIC, including self-billing); VDA 4988 (REMADV) replaces VDA 4907, and VDA 4989 uses RECADV as the entry certificate a customer sends to confirm receipt of an intra-EU delivery.
- Some customers still send self-billing invoices as PDF instead of VDA 4938, which leaves the supplier keying or extracting the data.
- Germany: all businesses must accept e-invoices since 2025, and issuing becomes mandatory for larger companies in 2027 and for all in 2028, on an EN 16931 basis. EDI formats such as EDIFACT remain allowed by agreement where the VAT data can be extracted correctly and completely into EN 16931 form, and self-billing invoices follow the same rules.
- France: all businesses receive e-invoices through approved platforms since September 2026, large and mid-sized companies issue since then, and smaller ones from September 2027. Italy has routed invoices through its SDI exchange since 2019.

## 6. Inbound transport
Outcome: Have parts collected in the planned window by the approved carrier, with no supplier-paid premium freight.

Many OEMs control inbound freight. A lead logistics provider (LLP) plans loads, chooses carriers and runs milk runs and cross-docks, while the supplier has parts and paperwork ready at the pickup window. The supplier rarely exchanges EDI with the carrier directly. Cost disputes come from unapproved carriers, missed windows and premium shipments, and the evidence is the bill of lading and the ship notice.

- Parties: Supplier, Lead logistics provider, Carrier
- Business owner: Supplier shipping and the OEM's inbound logistics team
- Measures: Pickup window compliance, Premium freight incidents, Routing guide compliance, On-time delivery to plant, Freight cost per shipment
- Documents, North America: 204, 990, 856, 214, 210
- Documents, Europe and international: IFTMIN, DESADV, IFTSTA; VDA 4933, 4945

### Steps
1. **Routing instructions** (Portal, from lead logistics provider)
   - What happens: The LLP publishes the routing guide and planned pickups: carrier, mode, pickup window and load number for each supplier ship point.
   - Rules that bite: Shipments must use the carrier and mode the routing names. Planned pickups follow the LLP's schedule, and unplanned loads need approval before a fixed cutoff.
   - EDI team work: Maintains ship-from codes, plant codes and carrier SCACs in master data so the routing, bill of lading and ship notice carry the same values.
   - If it fails: The supplier books its own carrier, and the excess freight cost comes back as a debit.
   - Work areas: Cross-references and master data, Business programs
2. **Shipment request** (Portal, from supplier)
   - What happens: The supplier enters ready quantities, weight, pallet count and ready time in the LLP's transport system and receives a load number.
   - Rules that bite: Exceptions such as material not ready, extra quantity or short quantity must be reported a fixed time before pickup. Every shipping document must carry the load number.
   - EDI team work: Keys or uploads shipment details and stores the returned load number in the ERP, so it prints on the bill of lading and flows into the ship notice.
   - If it fails: No load is planned, the parts miss the truck, and the plant orders premium freight.
   - Work areas: Missing documents, Cross-references and master data
3. **Load tender** (204, 990 / IFTMIN, from lead logistics provider)
   - What happens: The LLP tenders each planned load to the carrier with stops, windows, references and special instructions, and the carrier accepts or declines it.
   - Rules that bite: The tender must carry the load number, ship-from and ship-to codes and the windows the carrier will see at the dock.
   - EDI team work: At the LLP, maps tenders to each carrier's guide, monitors for tenders with no response, and alerts planners to retender before the pickup window.
   - If it fails: Nobody arrives at the window, and the plant pays for an expedite.
   - Work areas: Monitoring, Map build and maintenance, Connections and protocols
4. **Pickup and ASN** (856 / DESADV, from supplier)
   - What happens: The carrier collects in the window. The supplier signs the bill of lading and sends the ship notice with carrier code, bill of lading and load number.
   - Rules that bite: Material and paperwork must be ready at the window. A ship notice without the bill of lading number fails at receiving, and carrier data must match the routing.
   - EDI team work: Maps SCAC, bill of lading, PRO and load number into the ship notice, checks them against the routing before sending, and resends corrected notices before arrival.
   - If it fails: Missed windows cause detention or premium freight, and a notice without carrier data fails at the dock.
   - Work areas: Rejections, Fix routing, Monitoring
5. **Shipment status** (214 / IFTSTA, from carrier)
   - What happens: The carrier reports pickup, in-transit events, delays and delivery against the load and bill of lading.
   - Rules that bite: A carrier that misses the pickup window must be escalated to the LLP at once, so the record shows a carrier delay and not a supplier miss.
   - EDI team work: Monitors status against planned windows, flags loads with no pickup event, and gives plant schedulers in-transit visibility on short parts.
   - If it fails: Plants learn about late parts at the dock, too late to recover without premium freight.
   - Work areas: Monitoring, Missing documents, Partner follow-up
6. **Freight audit** (210, from carrier)
   - What happens: The carrier bills freight to the bill-to party on the bill of lading, and the LLP audits each charge. Suppliers see the 210 only on freight they arrange.
   - Rules that bite: Charges must match the tendered mode and references. Extra cost from a supplier deviation, such as an unapproved carrier or supplier-caused expedite, is recovered from the supplier.
   - EDI team work: On the LLP or freight payment side, validates freight invoices against tenders and status, holds mismatches, and supplies load and reason-code evidence for deviation and premium freight debits.
   - If it fails: Freight is overpaid, or the plant absorbs costs the supplier caused.
   - Work areas: Chargebacks and deductions management, Rejections, Reporting and documentation

### Variants
- **Milk run**: One carrier collects from several suppliers on a fixed route and schedule. Windows are tight and shared, so one supplier not ready can hold up the rest of the route.
- **Cross-dock consolidation**: Less-than-truckload freight is consolidated at a cross-dock before delivery to the plant. Same-day shipments to one consignee go on one bill of lading.
- **Supplier-arranged freight**: Where the buyer does not control freight, the supplier books the carrier and sets the window with the plant. Carrier data is still required in the ship notice.
- **Premium shipment**: Expedites outside the plan are scheduled by the paying plant. Each carries a reason code, and supplier-caused expedites are charged back to the supplier.

### Penalties and disputes
- Unapproved carrier or mode: the excess freight cost is debited, often with an administrative fee per incident.
- Bill of lading without the load number, or with the wrong bill-to party or freight terms: debit per incident plus any extra cost.
- Material not ready at the pickup window: carrier detention charges and any resulting premium freight are debited.
- Supplier-caused premium freight, coded by reason such as supplier behind schedule or supplier quality: full cost recovered by debit.
- Debits arrive as debit notes netted against payments. Disputes need the bill of lading, tender and carrier status, and must be raised within the buyer's response window.

### Watch for
- Check whether a release date is a ship date or a delivery date. A delivery date means arrival at the plant, so transit time comes out of the supplier's lead time.
- In buyer-controlled freight the supplier usually has no EDI with the carrier. Its data reaches the carrier through the LLP's transport system and the bill of lading.
- SCAC, bill of lading and load number must agree across the bill of lading, the ship notice and the LLP's system. One mismatched reference turns a clean shipment into a debit.
- Escalate a late carrier at once and keep the record. Without it, a carrier miss is scored as a supplier miss.
- Baseline pickup schedules and unplanned-load cutoffs run on their own clocks. A release increase after the cutoff still needs an approved load.

### Europe and international
- Buyer-collected freight is common. Under buyer-collected terms, call-off dates are often pickup dates, and the buyer's transport desk plans collection from them.
- VDA 4933, which replaced VDA 4920 and VDA 4944, standardizes the transport order the shipper sends the carrier and its confirmation, in separate parts for full goods and empty packaging.
- Carrier status uses IFTSTA under VDA 4945, which replaced VDA 4921. VDA 4996 covers truck control at the arrival area and VDA 4998 a REST API for track and trace, both outside EDIFACT.
- Cross-border road shipments travel with a CMR consignment note in place of the North American bill of lading.

## 7. Sub-tier procurement
Outcome: Hold sub-tier suppliers to the same release, ship notice and settlement discipline the OEM applies to the tier 1.

Tier 1 suppliers pass OEM demand down to their own suppliers using the same documents: blanket order, forecast and firm releases, ship notice, and invoice or self-billing. Many sub-tier suppliers are small, with limited systems and little EDI capability. Web EDI portals, rekeyed data and releases sent by email are where this process breaks, and the tier 1 carries the consequence with the OEM.

- Parties: Tier 1, Sub-tier supplier
- Business owner: Tier 1 purchasing, material planning and supplier development
- Measures: Sub-tier on-time delivery, Ship notice accuracy, Suppliers on electronic exchange, Premium freight incidents, Discrepancy debits per supplier
- Documents, North America: 850, 830, 862, 997, 856, 810, 820
- Documents, Europe and international: ORDERS, DELFOR, DELJIT, DESADV, INVOIC, REMADV; VDA 4905, 4913, 4984, 4987

### Steps
1. **Blanket order** (850 / ORDERS, from tier 1)
   - What happens: The tier 1 issues a blanket purchase order per part that sets price, terms and ship-to, with no fixed delivery quantities or dates.
   - Rules that bite: The blanket authorizes no shipment; quantities come only from the releases. Invoices or self-billing are priced from it, so the price on it must be current.
   - EDI team work: Onboards the sub-tier as a trading partner, maps the order, and maintains cross-references between tier 1 and sub-tier part numbers.
   - If it fails: Releases and ship notices cannot match a valid order, so receipts and payments stall.
   - Work areas: Partner onboarding, Cross-references and master data
2. **Schedule release** (830, 862 / DELFOR, DELJIT, from tier 1)
   - What happens: The tier 1 converts OEM demand into its own weekly forecast for the sub-tier and sends firm near-term ship schedules.
   - Rules that bite: Each release replaces the prior one. Firm periods and raw and fabrication authorizations limit what the tier 1 will pay for if demand drops.
   - EDI team work: Confirms every release reached the sub-tier and was acknowledged, chases suppliers who did not pick up portal releases, and checks release cumulative quantities against shipments.
   - If it fails: The sub-tier builds to an old release, and the tier 1 short-ships the OEM.
   - Work areas: Missing documents, Partner follow-up, Monitoring
3. **Ship notice** (856 / DESADV, from sub-tier supplier)
   - What happens: The sub-tier ships against the release, labels each container and sends the ship notice with bill of lading, quantities and container serials.
   - Rules that bite: The notice is due at or shortly after truck departure, must match the labels and packing slip, and must carry the bill of lading number.
   - EDI team work: Validates incoming notices against open releases, rejects notices with unknown parts or wrong references, and chases sub-tier suppliers whose notice is missing when the truck arrives.
   - If it fails: Receipts are keyed by hand, cumulative quantities drift, and the tier 1's own ship notice to the OEM runs late.
   - Work areas: Rejections, Missing documents, Partner follow-up
4. **Receipt** (ERP, from tier 1)
   - What happens: The tier 1 receives against the ship notice and logs discrepancies in quantity, labels, packaging and documents.
   - Rules that bite: Over and under shipment, missing or wrong notices, label errors and wrong packaging are logged as discrepancies and debited per occurrence.
   - EDI team work: Reports notice-versus-receipt mismatches by supplier, keeps the original notices as dispute evidence, and feeds repeat offenders to supplier development.
   - If it fails: Shortages reach the line with no record of what the sub-tier actually sent.
   - Work areas: Chargebacks and deductions management, Reporting and documentation
5. **Invoice** (810 / INVOIC, from sub-tier supplier)
   - What happens: The sub-tier invoices each shipment with the order and ship notice references, quantities and blanket order price.
   - Rules that bite: Price must match the blanket order and quantity must match the receipt. Invoices that do not match are rejected or short-paid.
   - EDI team work: Maps invoices, checks order and ship notice references before posting, and returns rejected invoices to the sub-tier with the reason.
   - If it fails: Payment is delayed, and mismatches turn into manual accounts payable work.
   - Work areas: Rejections, Fix routing, Cross-references and master data
6. **Payment and remittance** (820 / REMADV, from tier 1)
   - What happens: The tier 1 pays and sends remittance listing the invoices paid and any discrepancy debits taken.
   - Rules that bite: Debits are netted from payment. The sub-tier has a short window, often counted in working days, to respond before a debit becomes final.
   - EDI team work: Delivers remittance by EDI or portal, and supplies the matching notice and receipt records when a sub-tier disputes a debit.
   - If it fails: Sub-tier cash is delayed, and unresolved debits damage the supply relationship.
   - Work areas: Chargebacks and deductions management, Partner follow-up

### Variants
- **Web EDI portal** (Portal): A sub-tier without EDI software reads releases and creates ship notices and invoices in a browser portal run by the tier 1 or a network. Portal fees are often charged to the sub-tier.
- **Evaluated receipt settlement** (856, 820; INVOIC self-billing in Europe): The tier 1 pays from receipts at the agreed price with no supplier invoice. The ship notice then drives payment, so its accuracy decides what the sub-tier is paid.
- **Kanban and min/max**: Some parts are replenished on kanban or min/max signals instead of dated releases. Over and under shipment are measured against the signal.
- **VDA flat files** (VDA 4905, 4913 replaced by 4984, 4987): German sub-tiers may still run VDA flat files while the tier 1 has moved to EDIFACT, so the tier 1 supports both until the supplier migrates.

### Penalties and disputes
- Missing, late or inaccurate ship notice, or a notice without the bill of lading number: logged as a discrepancy and debited per occurrence.
- Label nonconformance, wrong part on the label or wrong packaging: debit per occurrence, with repeats escalated to a formal quality complaint.
- Over or under shipment against the release or kanban signal: discrepancy debit, plus recovery of any premium freight the sub-tier caused.
- Debits are netted from payment. Disputes need a response within a short window, after which the debit is taken automatically.

### Watch for
- Low EDI capability is the main failure point. Match the method to the supplier: a portal for a small shop, full EDI for a high-volume supplier.
- Portal users rekey data from their own systems. Rekeyed ship notices are where quantities, bill of lading numbers and cumulative totals drift from what shipped.
- Confirm early that the sub-tier tracks cumulative shipped quantities. Without its record, cum reconciliation rests on the tier 1's numbers alone.
- Release changes made by phone or email and not in the EDI release leave the documents and the shipment out of step.
- OEM rules do not pass down on their own. The tier 1's supplier manual must state ship notice timing, labels and debits, or they cannot be enforced.
- MMOG/LE, the joint AIAG and Odette logistics self-assessment, covers electronic exchange with suppliers, and some OEMs require tier 1s to submit it annually.

### Europe and international
- Many tier 1s accept VDA flat files, EDIFACT and XML over OFTP2, AS2, SFTP or a VAN, depending on what the supplier can run.
- Web EDI portals run by industry networks are common, often at the supplier's cost.
- Self-billing, the European form of evaluated receipt settlement, is common, so sub-tiers may receive self-billing invoices on INVOIC instead of sending invoices.
- Old VDA flat files (4905 call-off, 4913 delivery note) are still widely used at small suppliers, alongside their EDIFACT replacements VDA 4984 and 4987.

## 8. Aftermarket order to cash
Outcome: Ship the current part with correct fitment data, in full and on time, and collect without deductions.

Aftermarket parts move from suppliers to retailers, distributors and dealers through standard order to cash documents, with no releases or cumulative quantities. Item data carries more weight than in production supply: fitment and product data under ACES and PIES decide whether a part can be found and sold, and supersession decides whether the right number is ordered. Buyers score OTIF and invoice matching much as general retail does.

- Parties: Parts supplier, Distributor or dealer
- Business owner: Aftermarket sales operations, product data management and accounts receivable
- Measures: Fill rate, On-time and in-full (OTIF), Catalog data acceptance, First-pass invoice acceptance, Return rate
- Documents, North America: ACES, PIES, 832, 846, 850, 855, 856, 810, 820
- Documents, Europe and international: ORDERS, ORDRSP, DESADV, INVOIC, REMADV; VDA 4948, 4949

### Steps
1. **Product data** (832, ACES, PIES, from parts supplier)
   - What happens: The supplier sends price and catalog data by 832, and vehicle fitment and product attributes as ACES and PIES XML files.
   - Rules that bite: Files must validate against the Auto Care Association databases and a version the buyer accepts. Missing required fields such as part type or brand code can fail the load.
   - EDI team work: Generates and validates catalog files, tracks each buyer's accepted ACES and PIES versions, and resolves load rejections before the item goes live.
   - If it fails: The part does not appear in vehicle lookup, or shows wrong fitment and comes back as a return.
   - Work areas: Cross-references and master data, Document and version changes, Rejections
2. **Purchase order** (850 / ORDERS, from distributor or dealer)
   - What happens: The distributor or dealer orders stock replenishment or urgent parts, and the order class sets shipping priority.
   - Rules that bite: Ordered part numbers may have been superseded. The supplier must ship the current number and report the substitution, and the order class sets the ship deadline.
   - EDI team work: Loads orders, maps order classes, applies supersession cross-references so old numbers resolve to the current part, and holds lines with unknown parts.
   - If it fails: An obsolete or wrong part ships, or the order never loads.
   - Work areas: Monitoring, Cross-references and master data, Missing documents
3. **Acknowledge order** (855 / ORDRSP, from parts supplier)
   - What happens: The supplier confirms each line, with substitutions for superseded parts, back orders and ship dates.
   - Rules that bite: Acknowledgment is due within a short window set by the buyer. Substitutions must be stated on the acknowledgment, not shipped without notice.
   - EDI team work: Generates acknowledgments with line status codes, reports superseding part numbers, and chases missing acknowledgments before the window closes.
   - If it fails: The buyer plans against parts that will not arrive, and later invoices fail to match.
   - Work areas: Map build and maintenance, Partner follow-up
4. **Ship notice** (856 / DESADV, from parts supplier)
   - What happens: The supplier ships with labeled cartons and pallets and sends the ship notice with pack detail, carrier and bill of lading.
   - Rules that bite: Missing, late or incomplete notices are fined, and some buyers refuse freight without a correct notice. Some buyers require a separate notice per trailer.
   - EDI team work: Builds the notice from warehouse data, validates pack hierarchy and carrier references, and corrects rejected notices before the freight arrives.
   - If it fails: Freight is refused or received by hand, and compliance fines follow.
   - Work areas: Rejections, Fix routing, Monitoring
5. **Invoice** (810 / INVOIC, from parts supplier)
   - What happens: The supplier invoices per order and shipment with part numbers, quantities and cost.
   - Rules that bite: The invoice must match the order on item, cost and quantity. A mismatch can produce an adjustment memo for the difference.
   - EDI team work: Validates invoices against the order and acknowledgment, including superseded part numbers and agreed cost, and corrects rejected invoices instead of resending them.
   - If it fails: Cost and quantity mismatches are short-paid.
   - Work areas: Rejections, Cross-references and master data, Chargebacks and deductions management
6. **Payment and deductions** (820 / REMADV, from distributor or dealer)
   - What happens: The buyer pays net of fines, billbacks, adjustment memos and return credits, listing each with a reason code.
   - Rules that bite: Deductions appear on remittance as offsets. Dispute windows differ by deduction type and start when the deduction is taken.
   - EDI team work: Loads remittance into cash application, maps reason codes, and assembles order, ship notice, proof of delivery and label evidence for disputes.
   - If it fails: Invalid deductions age past the dispute window and become permanent losses.
   - Work areas: Chargebacks and deductions management, Reporting and documentation

### Variants
- **Order classes**: Dealers tag each order with a class such as emergency, vehicle off road or stock, and the class sets shipping priority.
- **Drop ship** (850, 846, 856, 810; VDA 4948 in Europe): The buyer takes the end customer's order and the supplier ships direct under the buyer's order and paperwork. The supplier's 846 inventory feed tells the buyer what it can promise.
- **Returns** (180 / RETANN, RETINS): Buyers return wrong, obsolete or overstocked parts under agreed return rules. Credits appear as deductions on remittance and have their own dispute window.

### Penalties and disputes
- OTIF or fill rate below the buyer's threshold, and incomplete shipments: fine or billback deducted from remittance.
- Missing, late or incomplete ship notice, wrong or missing transport system ship IDs, and routing guide violations: fine per occurrence.
- Invoice that does not match the order on item, cost or quantity: adjustment memo for the difference.
- Hazardous material not declared in item data or on the bill of lading: compliance fine, and freight may be refused.
- Deductions settle as offsets on remittance. Disputes go by portal, email or a fixed template within windows that differ by deduction type, with proof of delivery and label copies as evidence.

### Watch for
- The 832 does not replace ACES and PIES. Price and catalog travel by EDI; fitment and attributes travel as XML files validated against the association databases.
- The association supports more than one ACES and PIES version at a time, and buyers adopt new versions at different speeds, so suppliers often produce several.
- A broken supersession chain, where an old number does not point to its current replacement, causes misorders and returns. Keep the chain in the item master and the EDI cross-reference.
- Orders keep arriving for old numbers long after supersession. Agree with each buyer whether to ship the new number with a substitution on the acknowledgment or reject the line.
- Aftermarket buyers run retail-style compliance programs. Treat this as order to cash with per-order invoices, not as production supply with releases and cums.
- Dealer orders to an OEM's own parts organization run through the OEM's dealer systems. STAR publishes an XML parts order that dealers send to the manufacturer, so these orders may not arrive as X12.

### Europe and international
- Orders, acknowledgments, ship notices and invoices use EDIFACT ORDERS, ORDRSP, DESADV and INVOIC in place of the X12 sets.
- VDA 4948 covers bypass and drop ship flows in the aftermarket with order, order response and delivery messages, and VDA 4949 covers exception handling in the aftermarket supply chain.
- E-invoicing mandates apply to aftermarket invoices as to any B2B invoice. In Germany an EDIFACT INVOIC qualifies only if its VAT data can be extracted into an EN 16931 conformant form.
- ACES and PIES are North American. European aftermarket catalogs use their own product and fitment data standards, so catalog work does not carry over.

## 9. Returnable containers
Outcome: Keep enough clean returnable containers at the supplier and a container account that matches physical stock.

OEMs and tier 1s ship parts in returnable racks, bins and small load carriers they own or pool, and keep an account per supplier of every container sent and returned. Each despatch, receipt and count is a booking, and the balance drives rent, loss charges and container shortages. Many disputes come from bookings that never happened, found months later at the annual inventory.

- Parties: Supplier, OEM
- Business owner: Supplier logistics and packaging, with the OEM's container management team
- Measures: Container balance variance, Container shortages, Rent and loss charges, Statement disputes closed in window, Packaging nonconformances
- Documents, North America: 856, Portal
- Documents, Europe and international: DESADV; VDA 4941, 4942, 4943, 4946, 4947

### Steps
1. **Empties supply** (Portal / VDA 4943, from oEM)
   - What happens: The OEM ships empty containers to the supplier from the receiving plant or an empties shipping point, based on demand planning and the supplier's account.
   - Rules that bite: The supplier must watch empties stock and warn the shipping plant before a shortage. The supply obligation continues during a shortage, using approved expendable packaging.
   - EDI team work: Loads empties despatch advice into the supplier's container stock, maps container type codes to the OEM's list, and flags announced empties that never arrived.
   - If it fails: Containers run out, and the supplier ships in unapproved packaging or misses shipments.
   - Work areas: Monitoring, Cross-references and master data, Missing documents
2. **Empties receipt** (Portal / VDA 4947, from supplier)
   - What happens: The supplier confirms receipt of the empties against the consignment note, and the booking moves the containers onto its account.
   - Rules that bite: Receipt is confirmed on the carrier's consignment note. Damaged or wrongly loaded empties must be reported within a short window.
   - EDI team work: Sends or keys the receipt confirmation, records short or damaged empties as exceptions, and keeps the signed consignment note as evidence.
   - If it fails: Containers that never arrived stay on the supplier's account and are later charged as losses.
   - Work areas: Missing documents, Reporting and documentation
3. **Ship in returnables** (856 / DESADV, from supplier)
   - What happens: The supplier ships parts in the specified containers and lists each container type and quantity on the ship notice and packing slip, booking them back.
   - Rules that bite: Container code and quantity must appear for each type. Old labels must be removed, and parts shipped in expendable packaging where returnables are specified are a nonconformance.
   - EDI team work: Maps returnable container codes and counts into the ship notice packaging lines, validates them against the OEM's container list, and corrects notices that omit them.
   - If it fails: The containers stay on the supplier's account and accrue rent or loss charges.
   - Work areas: Map build and maintenance, Rejections, Cross-references and master data
4. **Account statement** (Portal / VDA 4941, from oEM)
   - What happens: The OEM sends a periodic account statement, usually monthly, listing bookings and the closing balance per container type.
   - Rules that bite: Postings not disputed within the complaint window are deemed accepted. Disputes need the delivery note, ship notice or carrier-signed consignment note as evidence.
   - EDI team work: Reconciles the statement against the supplier's container ledger, ship notices and receipts, and files disputes with documents before the window closes.
   - If it fails: Wrong balances are accepted, and the supplier pays for containers it returned.
   - Work areas: Chargebacks and deductions management, Reporting and documentation
5. **Annual inventory** (Portal / VDA 4942, from supplier)
   - What happens: The supplier counts containers on hand at year end and reports the count. Differences are posted to the account in a later statement.
   - Rules that bite: Counts are due by a fixed date. A missing or late count leaves the owner's booked balance standing, and later corrections are hard to win.
   - EDI team work: Collects counts by site and container type, submits the inventory message or portal entry, and explains differences with booking history.
   - If it fails: The owner's booked balance stands, and the supplier pays for containers it cannot account for.
   - Work areas: Business programs, Reporting and documentation, Partner follow-up
6. **Rent and losses** (ERP, from oEM)
   - What happens: The OEM invoices rent on pooled containers by days held and charges lost or unreturned containers at transfer or replacement price.
   - Rules that bite: In pooled programs rent runs per day on the balance, corrections are limited to a recent period, and containers with no movement for months can be charged as lost.
   - EDI team work: Checks rent and loss invoices against the reconciled balance and supports disputes with booking evidence.
   - If it fails: Avoidable container costs land on the supplier's margin.
   - Work areas: Chargebacks and deductions management, Rejections

### Variants
- **Supplier-owned containers**: The supplier owns the containers and marks them with return-to labels, so it tracks its own fleet at each customer plant.
- **Pooled small load carriers**: Standard small load carriers and pallets are shared across the plants of a pool. Only pool member plants count, and sending pool containers outside the pool is charged as a loss.
- **Expendable fallback**: When returnables run short, the supplier ships in an approved expendable alternative of matching size, function and pack quantity. Unapproved substitutes are a packaging nonconformance.
- **Empties transport order** (VDA 4933 parts 2 and 4): Where empties move on buyer-managed freight, the transport order for empties runs as a separate flow from full goods.

### Penalties and disputes
- Containers not returned within the buyer's time limit, or container bookings missing in the buyer's system: discrepancy debit per occurrence.
- Parts shipped in expendable packaging where returnables are specified, or in the wrong container: packaging nonconformance debit.
- Pool containers with no movement for an extended period and no proof of return or possession: invoiced at transfer or replacement price.
- Rent is charged per day on the balance and invoiced periodically. Balance disputes must be raised within the statement's complaint window, with delivery notes or consignment notes.

### Watch for
- In most programs the ship notice is the booking for full containers. A notice that omits the container lines moves the parts but leaves the containers on the supplier's account.
- Rent and loss problems surface months later, often at the annual inventory, when the evidence is hard to find. Reconcile every statement as it arrives.
- Each container type has its own code. A wrong code books the right quantity to the wrong container type and creates two discrepancies.
- Remove old labels from returnables before reuse. A stale label scanned at receiving books the wrong part and quantity.
- Containers delivered to the wrong plant or to another customer count as losses against the supplier.
- Keep carrier-signed consignment notes and receipt confirmations. Without them, balance disputes are lost.

### Europe and international
- VDA 4941 (account statement) and 4942 (inventory) replace the VDA 4927 flat file. VDA 4943 (despatch forecast and advice), 4946 (order and confirmation) and 4947 (movement and receipt confirmation) complete the set.
- Standard small load carriers are pooled across plants, and pool rules decide where containers may go.
- Account statements carry a formal complaint period. Postings not disputed in time are deemed accepted.
- Empties transport orders follow VDA 4933 parts 2 and 4, which replaced VDA 4944, separate from the full-goods transport order.
