# B2B operations work areas and stakeholders

Source: Business Network Process Genome, Operations map, common to all industries (https://process-genome.onrender.com/#all/opsmap).
Status: Examples describe typical operating scenarios, not specific customer accounts. Standards, versions, and mandate dates vary by partner and region. Confirm requirements with each partner before building.

The work an EDI and B2B operations team does, where each area breaks, and the internal and external stakeholders involved. Roles: owner, contributor, affected.

## Daily operations

### Monitoring
Watch every document flow and scheduled job for failures.

- What the work involves:
  - Review error queues and failed ERP interface records
  - Check communication sessions and scheduled jobs
  - Report open issues to business owners each morning
- Where it breaks: Breaks at the EDI team. Failures found late delay orders, shipments, payments, and claims.
- Who is involved: Customer service, operations, finance
- Examples:
  - Retail and CPG: Overnight purchase orders (850) from a retailer fail a mapping step and sit unnoticed, so they miss the warehouse pick cutoff. The EDI team finds them in the morning error queue review, fixes the cause, and reloads the orders.
  - Automotive: The early-morning job that loads an OEM's shipping schedules (862) into the ERP fails silently, so the plant ships to yesterday's quantities. The EDI team catches the failed job, reruns the load, and confirms quantities match the OEM's file.
  - Financial services: The job that transfers the day's supplier payment file to the bank fails silently, putting the bank cutoff and value date at risk. The EDI team's afternoon check finds no bank receipt, resends the file, and confirms acceptance before cutoff.
- Stakeholders:
  - Customer service (internal, affected): Stuck orders and acknowledgments miss customer order cutoffs
  - Supply chain (internal, affected): Failed releases and ship notices delay plant and warehouse work
  - Finance and treasury (internal, affected): Failed invoices and payment files delay cash and miss bank cutoffs
  - IT and ERP (internal, contributor): Runs the ERP interface jobs whose failed records the EDI team reviews
  - EDI service providers (external, contributor): Reports network, mailbox, and translator status and delivery failures

### Support desk and on-call
Answer partners and colleagues through the EDI mailbox, phone, and tickets.

- What the work involves:
  - Triage requests against service levels
  - Route each request to the right owner
  - Cover nights and weekends by rotation
- Where it breaks: Breaks at the EDI team. Support work pulls the same people off onboarding and map changes.
- Who is involved: Trading partners, internal teams, provider help desks
- Examples:
  - Retail and CPG: A retailer, a sales rep, and the warehouse each open tickets about the same unshipped promotional order. The EDI desk merges the tickets, finds the order on credit hold, and routes it to order management that morning.
  - Automotive: A supplier plant calls on-call overnight because no shipping schedule (862) arrived for the morning truck, and the OEM line could run short. On-call confirms the OEM sent nothing, calls the OEM help desk, and gets a confirmed schedule.
  - Financial services: Treasury calls at midday: the bank rejected this morning's payment file, and suppliers miss today's value date unless it is resent before cutoff. The EDI desk pulls the bank's rejection report, works the bank help desk, and updates treasury hourly.
- Stakeholders:
  - Customer service (internal, contributor): Passes customer EDI questions to the desk and relays answers back
  - Supply chain (internal, affected): Plants and warehouses need overnight answers on missing releases
  - IT and ERP (internal, contributor): Shares on-call coverage for ERP, servers, and network issues
  - Customers (external, contributor): Raise document issues through the EDI mailbox and partner contacts
  - Suppliers (external, contributor): Report missing orders and failed documents to the desk
  - EDI service providers (external, contributor): Provider help desk takes network and translator tickets

### Rejections
Find why a document failed and explain it in business terms.

- What the work involves:
  - Read the 997, 999, or 824 acknowledgment
  - Locate the failing segment and value
  - Write the cause and the fix for the owner
- Where it breaks: Breaks at the partner. Unclear rejections lead to guessing and repeat failures.
- Who is involved: Business users, partner EDI teams
- Examples:
  - Retail and CPG: A retailer rejects an invoice (810) because the unit price differs from the purchase order, and the invoice goes unpaid. The EDI team reads the rejection message (824), finds the line, and shows billing the ordered versus invoiced price.
  - Automotive: An OEM rejects a ship notice (856) because a part number does not match its current schedule, so the parts cannot be received and a debit memo may follow. The EDI team finds the bad value and tells shipping.
  - Financial services: The bank rejects a payment file (pain.001) because several supplier account numbers fail its IBAN check, and those payments miss their value date. The EDI team reads the bank's status report and gives accounts payable each failing payment and field.
- Stakeholders:
  - Customer service (internal, affected): Needs rejected orders and acknowledgments explained in business terms
  - Finance and treasury (internal, affected): Needs invoice and payment rejections explained to correct them
  - Supply chain (internal, affected): Needs ship notice rejections explained before the next shipment
  - Customers (external, contributor): Return 997, 999, and 824 acknowledgments with the rejection detail
  - Suppliers (external, affected): Need our rejection of their documents explained to resend correctly
  - Banks (external, contributor): Return payment status reports that state why a file was rejected
  - Web and portal partners (external, contributor): Correct and resend documents in web forms after a partner rejection

### Fix routing
Get the right owner to fix the cause and resend.

- What the work involves:
  - Assign the fix to master data, order entry, finance, or the partner
  - Back out and resend the corrected document
  - Track it until the partner accepts
- Where it breaks: Breaks inside the company. Fixes stall when nobody owns them.
- Who is involved: Master data, order entry, finance, partners
- Examples:
  - Retail and CPG: Invoices to a retailer keep rejecting because a cost change agreed by sales never reached the ERP, delaying cash. The EDI team assigns the update to sales operations, resends the invoices once fixed, and tracks them to acceptance.
  - Automotive: An OEM schedule fails to post because master data has not loaded a new engineering change level, so the plant ships to an old schedule. The EDI team routes the fix to master data, then reprocesses the schedule.
  - Financial services: A supplier payment fails because the supplier changed banks and accounts payable never updated the vendor record, so the supplier goes unpaid. The EDI team assigns the update to accounts payable with callback verification, then regenerates and resends the payment.
- Stakeholders:
  - Master data (internal, contributor): Corrects item, location, and account records at the source
  - Customer service (internal, contributor): Corrects order entry errors so documents can be resent
  - Finance and treasury (internal, contributor): Corrects prices, invoice data, and vendor bank details
  - Supply chain (internal, contributor): Corrects shipment, lot, and carton data on ship notices
  - Customers (external, contributor): Fix and resend when the error is on the customer side
  - Suppliers (external, contributor): Fix and resend ship notices and invoices that failed our checks

### Missing documents
Catch documents and acknowledgments that never arrived.

- What the work involves:
  - Watch for overdue acknowledgments
  - Flag orders without confirmations and shipments without ship notices
  - Chase the partner or internal owner
- Where it breaks: Silent gap with the partner. No error fires, so the gap surfaces later as a penalty or delay.
- Who is involved: Partners, operations, finance
- Examples:
  - Retail and CPG: A supplier sends a ship notice (856), but the retailer's acknowledgment (997) never returns, and no error fires. The EDI team's overdue acknowledgment check flags it, confirms delivery in network logs, and resends before the truck arrives.
  - Automotive: A truck leaves a supplier plant without its ship notice because shipping skipped a confirm step, so the OEM issues a debit memo. The EDI team matches shipments to sent notices hourly and sends the missing one before arrival.
  - Financial services: One bank's prior-day statement (BAI2 or camt.053) does not arrive, so treasury positions cash without that bank's balances. The EDI team flags the file at its expected time, checks the connection, requests a resend, and alerts treasury.
- Stakeholders:
  - Supply chain (internal, affected): Shipments without ship notices slow receiving and cause penalties
  - Customer service (internal, affected): Orders without acknowledgments leave order status unconfirmed
  - Finance and treasury (internal, affected): Missing remittance and bank statements block cash application
  - Customers (external, contributor): Asked to resend missing orders and acknowledgments
  - Suppliers (external, contributor): Asked to send overdue ship notices and invoices
  - Carriers and 3PLs (external, contributor): Asked to send overdue shipment status updates
  - Web and portal partners (external, contributor): Key ship notices and invoices from the order online; late keying shows up as missing documents

### Cross-references and master data
Keep partner codes matched to internal records.

- What the work involves:
  - Map partner item, location, and account codes
  - Update tables when partners or products change
  - Fix mismatches that block documents
- Where it breaks: Breaks inside the company. One wrong code rejects every document that uses it.
- Who is involved: Master data, sales, finance
- Examples:
  - Retail and CPG: A retailer orders a new item using its own item number, which is missing from the cross-reference table, so orders fail before launch. The EDI team maps the retailer's number to the internal SKU and reprocesses held orders.
  - Automotive: An OEM issues a new part number for a revised component, but the supplier's cross-reference still points to the old one, so demand goes unseen. The EDI team adds the new mapping with its effective date and reprocesses the schedules.
  - Financial services: A customer pays several invoices with one remittance (820) that uses its own reference numbers, so cash cannot be applied. The EDI team maps the customer's references to invoice numbers in the matching rules and reruns cash application.
- Stakeholders:
  - Master data (internal, owner): Owns the item, customer, vendor, and location records behind each code
  - Sales and key accounts (internal, contributor): Supplies customer item numbers, ship-to lists, and agreed pricing
  - Finance and treasury (internal, contributor): Supplies account, remit-to, and payment reference data
  - Customers (external, contributor): Send item catalogs, location lists, and code changes
  - Suppliers (external, contributor): Send part number, item, and location changes

## Partner lifecycle

### Partner onboarding
Take a new partner from questionnaire to first live document.

- What the work involves:
  - Collect capabilities, IDs, and contacts
  - Set up connections and maps from the partner's guide
  - Test, certify, and cut over to production
- Where it breaks: Breaks at the partner. Testing needs both sides at the same time, and missing data stalls mapping.
- Who is involved: Partner EDI team, provider, business owners
- Examples:
  - Retail and CPG: A new retailer requires orders, ship notices, carton labels, and invoices to pass certification before the first order ships. The EDI team collects IDs and guides, builds maps, tests in the retailer's portal, and goes live after sign-off.
  - Automotive: A supplier wins parts on a new vehicle program, and the OEM requires schedules, ship notices, and labels working before launch. The EDI team maps the OEM's specifications, tests with the OEM's EDI coordinator, and goes live on time.
  - Financial services: A company opens accounts at a new bank, and payments stay manual in the bank portal until files are connected. The EDI team completes the bank's setup forms, exchanges security keys, maps the bank's formats, and sends test payments.
- Stakeholders:
  - Sales and key accounts (internal, owner): Drives customer onboarding to start orders on a won account
  - Procurement (internal, owner): Drives supplier onboarding under purchasing and supply terms
  - Master data (internal, contributor): Creates partner, item, and location records needed for mapping
  - IT and ERP (internal, contributor): Configures ERP partner settings and joins integration testing
  - Customers (external, contributor): Provide guides, IDs, and test windows, then certify the setup
  - Suppliers (external, contributor): Complete questionnaires, connections, and test documents
  - EDI service providers (external, contributor): Set up connections and maps and run testing under a service plan
  - Web and portal partners (external, contributor): Register online and start on web forms or a portal instead of a full EDI setup

### Map build and maintenance
Build and change the maps between partner formats and the ERP.

- What the work involves:
  - Build maps for new partners and documents
  - Update maps when a partner or the ERP changes
  - Retest before each change reaches production
- Where it breaks: Breaks at the EDI team. Changes arrive on the partner's schedule, and every change needs retesting.
- Who is involved: Partners, provider, ERP team
- Examples:
  - Retail and CPG: A grocer now requires promotional allowances on each invoice line, which the current invoice map does not carry, so invoices get short-paid. The EDI team maps the ERP's promotion fields into the invoice, tests with samples, and releases the change.
  - Automotive: An OEM introduces a production sequence (866) for a new seat module, and without it the supplier cannot build modules in vehicle order. The EDI team builds the map into the sequencing system and tests with the OEM's sample files.
  - Financial services: Treasury adds same-day ACH as a payment type, and urgent payments stay manual in the bank portal until the map supports it. The EDI team adds the payment codes and cutoff logic, tests with the bank, and releases.
- Stakeholders:
  - IT and ERP (internal, contributor): Owns ERP interface fields and tables that maps read and write
  - Customers (external, contributor): Publish implementation guides that define map content
  - EDI service providers (external, contributor): Builds and changes maps when mapping is a managed service

### Partner follow-up
Chase test files, sign-offs, certificates, and overdue responses.

- What the work involves:
  - Send reminders and escalate by phone
  - Raise tickets in partner portals
  - Track open items for each partner
- Where it breaks: Breaks at the partner. Unresponsive partners delay go-lives and cutovers.
- Who is involved: Partner contacts, provider, internal owners
- Examples:
  - Retail and CPG: A new retailer has not approved test ship notices sent weeks ago, and missing the peak-season freeze pushes go-live past holiday orders. The EDI team sends dated reminders, opens a portal ticket, and escalates through the sales account manager.
  - Automotive: A tier 2 supplier keeps sending test ship notices with errors, so the tier 1 still receives parts without notice and keys receipts by hand. The EDI team sends a specific error list and tracks each retest.
  - Financial services: A bank has not returned its signed certificate for a new payment connection, blocking production testing and delaying treasury's migration. The EDI team opens a case with the bank's implementation manager, escalates through the relationship manager, and logs each contact.
- Stakeholders:
  - Sales and key accounts (internal, contributor): Escalates through the account relationship when a customer stalls
  - Procurement (internal, contributor): Escalates through the buyer relationship when a supplier stalls
  - Customers (external, contributor): Owe test approvals, sign-offs, and responses
  - Suppliers (external, contributor): Owe test files, corrections, and connection details
  - EDI service providers (external, contributor): Holds open setup tickets that need chasing
  - Web and portal partners (external, affected): Reached through portal alerts and email when documents are late

### Connections and protocols
Set up and maintain the transport connections to each partner.

- What the work involves:
  - Configure AS2, AS4, OFTP2, SFTP, VAN, and API connections
  - Test connectivity and acknowledgments with each partner
  - Move partners when they change protocols or networks
- Where it breaks: Breaks on the connection. A partner changes its endpoint or protocol, and documents stop without a clear error.
- Who is involved: Partner technical contacts, networks, security, IT
- Examples:
  - Retail and CPG: A European retailer requires suppliers to send EANCOM messages over AS2 and stops accepting files through its old VAN mailbox. The EDI team sets up the AS2 connection, exchanges certificates, and tests EANCOM orders and invoices before the cutover date.
  - Automotive: A European OEM requires suppliers to connect over OFTP2 with an Odette-issued certificate before it switches off its legacy connection. The EDI team obtains the certificate, configures the OFTP2 link, and confirms schedules arrive before the switch-off.
  - Financial services: A corporate client connects to a European bank over EBICS while keeping its SWIFT connection for other banks. The EDI team sets up the EBICS keys and bank parameters, tests payment and statement files, and confirms both channels run in parallel.
- Stakeholders:
  - IT and ERP (internal, contributor): Provides servers, firewall rules, and network routes for connections
  - Information security (internal, contributor): Approves protocols, encryption, and inbound access
  - EDI service providers (external, contributor): Runs VAN interconnects and hosted connections
  - Customers (external, contributor): Share endpoints and test connectivity, and announce changes
  - Banks (external, contributor): Require host-to-host or network connections with strict onboarding

### Certificate management
Track, renew, and exchange the certificates that secure partner connections.

- What the work involves:
  - Keep a register of certificates by partner and expiry date
  - Renew 60 to 90 days ahead and exchange with each partner
  - Cut over together and confirm traffic after the change
- Where it breaks: Breaks on the connection. An expired certificate stops one partner completely while other flows keep working.
- Who is involved: Partner security contacts, security team, banks, networks
- Examples:
  - Retail and CPG: A retailer emails notice of its security certificate change to a former employee's inbox, and on the change date all its orders would stop. The EDI team routes partner notices to a shared mailbox, loads the certificate, and tests.
  - Automotive: The company's own OFTP2 certificate from the Odette CA is due to expire, and every OEM connection depends on it. The EDI team renews the certificate, distributes it to each OEM, and confirms schedules on every connection after the change.
  - Financial services: A bank renews the certificate on its host-to-host connection, and files signed for the old certificate will be refused. The EDI team exchanges the new certificate with the bank, sends a test payment file, and confirms the status report before releasing live payments.
- Stakeholders:
  - Information security (internal, contributor): Sets key policy and issues or approves certificates
  - Customers (external, contributor): Exchange certificates and cut over on an agreed date
  - Banks (external, contributor): Require formal certificate exchange before payments resume
  - EDI service providers (external, contributor): Renews certificates on hosted connections and notifies partners

### Document and version changes
Implement new versions, documents, and rules from partners.

- What the work involves:
  - Review the partner's revised guide
  - Remap, retest, and run mixed versions
  - For hub programs, publish guides and track adoption
- Where it breaks: Breaks at the partner. Notice periods are short, and penalties start on the compliance date.
- Who is involved: Partners, provider, business owners
- Examples:
  - Retail and CPG: A retailer revises its ship notice guide with a sixty-day compliance date, after which every nonconforming notice draws a chargeback. The EDI team compares old and new guides, updates the map, tests with the retailer, and goes live early.
  - Automotive: An OEM replaces its delivery schedule format with a newer EDIFACT version, and suppliers on the old format stop receiving schedules at cutover. The EDI team maps the new version, runs both in parallel, and confirms quantities match.
  - Financial services: A bank moves daily statements from BAI2 to camt.053 and sets a date to stop BAI2, after which cash reconciliation would stop. The EDI team maps the new format into the treasury system and runs both until balances match.
- Stakeholders:
  - Sales and key accounts (internal, affected): Carries compliance penalties when customer changes miss the date
  - Supply chain (internal, affected): Changes labeling, packing, or shipping steps to meet new rules
  - IT and ERP (internal, contributor): Adds ERP fields and data the new version requires
  - Customers (external, owner): Issue revised guides and set the compliance date
  - Suppliers (external, affected): Adopt the guides we publish when we run a supplier program
  - EDI service providers (external, contributor): Supplies updated standards and maps for new versions
  - Web and portal partners (external, affected): Receive updated forms when a partner changes its requirements, with no map to change

## Programs and compliance

### Business programs
Set up the documents for programs other teams own.

- What the work involves:
  - Gather requirements from the program owner
  - Build and test the new document flows
  - Support the launch and early volume
- Where it breaks: Breaks inside the company. Each partner's version of a program differs.
- Who is involved: Program owners, partners, provider
- Examples:
  - Retail and CPG: Merchandising launches drop ship with an online retailer, and without daily inventory feeds (846) the site sells stock the supplier lacks. The EDI team builds the order, ship notice, invoice, and inventory flows and tests with the retailer.
  - Automotive: An OEM moves a supplier to pay on receipt, paying from its own receiving records instead of supplier invoices, so receipt errors leave parts unpaid. The EDI team maps the OEM's receipt and self-billing documents and reconciles them to shipments.
  - Financial services: Treasury launches supply chain finance, where the bank offers suppliers early payment based on approved invoices the company sends. The EDI team builds the approved invoice file in the bank's format, tests matching with the bank, and monitors daily files.
- Stakeholders:
  - Sales and key accounts (internal, owner): Owns customer programs such as drop ship, inventory feeds, and rebates
  - Supply chain (internal, contributor): Runs the inventory, sequencing, and fulfillment behind the program
  - Finance and treasury (internal, contributor): Owns payment programs such as early pay and supply chain finance
  - IT and ERP (internal, contributor): Builds the ERP side of new program flows
  - Customers (external, contributor): Define their version of the program and test it
  - Carriers and 3PLs (external, contributor): Exchange warehouse and shipment documents for logistics programs
  - Banks (external, contributor): Exchange files for payment and financing programs
  - Web and portal partners (external, contributor): Print carton labels and follow partner rules that web forms check before sending

### Regulatory mandates
Deliver changes required by law or regulation.

- What the work involves:
  - Track mandates and their effective dates
  - Change maps and data to comply
  - Test with partners before the deadline
- Where it breaks: Breaks at the partner. Requirements differ by country and change late.
- Who is involved: Compliance, tax, finance, partners
- Examples:
  - Retail and CPG: A country where the company sells adopts real-time e-invoicing, so the tax authority must clear each invoice before customers can pay it. The EDI team works with tax to map invoices to the national format and tests clearance.
  - Automotive: Mexico requires a digital bill of lading supplement (Carta Porte) for goods on federal roads, and trucks without it can be held at inspection. The EDI team adds the required data with tax and logistics and tests before enforcement.
  - Financial services: Banks begin rejecting cross-border payments without structured payer and payee addresses under ISO 20022 rules, so international supplier payments would fail. The EDI team reviews vendor addresses with accounts payable, maps the structured fields, and tests with each bank.
- Stakeholders:
  - Compliance and legal (internal, owner): Tracks mandates, interprets requirements, and signs off compliance
  - Finance and treasury (internal, contributor): Owns tax, e-invoicing, and payment format requirements
  - IT and ERP (internal, contributor): Changes ERP data and systems to produce mandated content
  - Supply chain (internal, contributor): Supplies traceability and customs data from operations
  - Regulators (external, owner): Set the mandated formats, data, and effective dates
  - EDI service providers (external, contributor): Provides certified access points, clearinghouses, and formats

### Chargebacks and deductions management
Issue, reconcile, and dispute chargebacks and deductions between trading partners.

- What the work involves:
  - Track partner error, timeliness, and accuracy rates behind each chargeback
  - Issue chargebacks with the failing document and rule
  - Dispute chargebacks and deductions received with documents and timestamps
- Where it breaks: Breaks at the partner. Chargebacks without clear error detail or archived evidence become disputes instead of fixes.
- Who is involved: Finance, deductions team, vendor compliance, partners
- Examples:
  - Retail and CPG: A retailer's scorecard shows a supplier sending ship notices (856) after trucks arrive, and a chargeback comes out of the next payment. The retailer's EDI team shares the late notices by date, and the supplier's EDI team checks its send timestamps and disputes any notice that arrived on time.
  - Automotive: An OEM issues a debit memo to a supplier for a ship notice (856) with quantities that did not match the release. The OEM's EDI team supplies the failing notice and the schedule in force, and the supplier's EDI team checks both against the OEM's acceptance before agreeing or disputing.
  - Financial services: A customer pays a corporate client short and lists deduction codes in its remittance (820), which the bank's lockbox passes through. The client's EDI team maps deduction codes to open invoices for the deductions team, and the bank's integration team fixes lockbox files that drop remittance detail.
- Stakeholders:
  - Finance and treasury (internal, owner): Deductions staff match each deduction to its invoice and dispute invalid ones with the document trail
  - Supply chain (internal, contributor): Acts on pending shipment alerts, supplies proof of shipment, and fixes labeling and timing causes
  - Sales and key accounts (internal, contributor): Negotiates disputed deductions with the customer buyer
  - Procurement (internal, contributor): Issues supplier chargebacks under vendor compliance terms
  - Customers (external, contributor): Issue chargebacks under their compliance terms and deduct them from payments
  - Suppliers (external, affected): Receive chargebacks we issue for late or noncompliant documents
  - Carriers and 3PLs (external, contributor): Supply proof of delivery for carrier and delivery disputes

## Change and continuity

### Outages and recovery
Restore flow after a provider, network, or system outage.

- What the work involves:
  - Notify partners and business owners
  - Separate received, failed, and unsent documents
  - Replay the backlog and review the root cause
- Where it breaks: Breaks on the connection. Document status is unclear after recovery.
- Who is involved: Provider, infrastructure, partners
- Examples:
  - Retail and CPG: The EDI provider's network goes down for most of a day before a major holiday, and orders pile up against ship windows. The EDI team notifies retailers, sorts sent, received, and failed documents, and replays the backlog without duplicates.
  - Automotive: A supplier's translator server fails overnight and no schedules or ship notices flow, so plants lose current demand. The EDI team runs the contingency plan, pulls schedules from OEM web portals, ships to them, and replays messages after recovery.
  - Financial services: The bank connection fails mid-transfer, and treasury cannot tell whether the morning payment file arrived; resending risks paying twice. The EDI team confirms receipt with the bank first, checks its status report, and resends only payments the bank lacks.
- Stakeholders:
  - IT and ERP (internal, contributor): Restores infrastructure and ERP interfaces
  - Customer service (internal, affected): Takes customer calls and manual orders during the outage
  - Supply chain (internal, affected): Plants and warehouses run on held releases and ship notices
  - EDI service providers (external, contributor): Restores the network or translator and helps replay the backlog
  - Customers (external, affected): Receive outage notices and replayed documents
  - Suppliers (external, affected): Receive outage notices and are asked to resend documents

### Platform and ERP upgrades
Keep translators, gateways, and ERP interfaces current.

- What the work involves:
  - Plan upgrades and patches
  - Regression-test every active partner flow
  - Support cutover and the weeks after go-live
- Where it breaks: Breaks at the EDI team. A flow missed in testing fails after go-live.
- Who is involved: IT, ERP team, provider, partners
- Examples:
  - Retail and CPG: The company upgrades its ERP, which changes how orders, ship notices, and invoices reach EDI, and any flow missed in testing draws chargebacks. The EDI team regression-tests every retailer and document against the new ERP and staffs support after go-live.
  - Automotive: A supplier moves its plants to a new ERP, and a broken schedule flow after cutover can stop shipments to OEM lines. The EDI team runs schedules in parallel, compares cumulative quantities, and cuts plants over one at a time.
  - Financial services: Treasury replaces the system that creates payment files and loads bank statements, and a format error could stop all outbound payments. The EDI team retests every bank's files in bank test environments and runs statements in parallel before cutover.
- Stakeholders:
  - IT and ERP (internal, owner): Owns the ERP and platform upgrade plan, budget, and cutover
  - Customer service (internal, contributor): Business users test order and acknowledgment flows
  - Finance and treasury (internal, contributor): Business users test invoice and payment flows
  - EDI service providers (external, contributor): Upgrades the translator or network and supports regression tests
  - Customers (external, contributor): Retest with us when a change touches their flows

### Mergers and consolidations
Absorb acquisitions, divestitures, and consolidations on either side of a relationship.

- What the work involves:
  - Track partner mergers, renamed entities, and ID changes
  - Consolidate or split connections, IDs, and maps
  - Migrate in waves and confirm routing after each change
- Where it breaks: Breaks at the partner. Unannounced ID or connection changes send documents to the wrong place.
- Who is involved: Partners, corporate development, IT, finance
- Examples:
  - Retail and CPG: A retailer acquires a regional chain and moves its stores onto the retailer's EDI IDs and ordering system, so orders start arriving from new IDs. The EDI team updates IDs and store cross-references, tests the flow, and retires the old connection.
  - Automotive: A customer divests a plant to another company, which starts sending releases (830) under a new identity and payment terms. The EDI team sets up the new trading relationship, carries over the plant's open releases, and confirms invoices route to the new owner.
  - Financial services: A company's bank is acquired and moves clients to the acquiring bank's file formats and connection on a fixed date. The EDI team remaps payment and statement files, tests with the new bank, and runs both connections until cutover.
- Stakeholders:
  - Compliance and legal (internal, contributor): Confirms legal entity changes and deal dates
  - Master data (internal, contributor): Merges or splits customer, vendor, and entity records
  - IT and ERP (internal, contributor): Consolidates or separates ERP instances and interfaces
  - Finance and treasury (internal, contributor): Updates remit-to, bank, and tax details for changed entities
  - Customers (external, contributor): Announce merged entities, new IDs, and connection changes
  - Suppliers (external, contributor): Announce merged entities, new IDs, and connection changes
  - EDI service providers (external, contributor): Moves mailboxes, IDs, and connections between accounts

### Provider management
Manage the EDI provider's service levels and billing.

- What the work involves:
  - Escalate tickets and track service levels
  - Oversee managed services and contractors
  - Reconcile charges against activity
- Where it breaks: Breaks on the connection. Charges vary with volume and are hard to verify.
- Who is involved: Provider, procurement, finance
- Examples:
  - Retail and CPG: During peak season, the EDI provider takes days to fix a mailbox issue blocking one retailer's orders, and ship windows slip. The EDI team escalates through the provider's account manager, documents the delay against the service agreement, and tracks closure.
  - Automotive: A managed services provider owns map changes, and an OEM change must be live before a plant launch or parts cannot ship. The EDI team sets the deadline in the work order, reviews progress weekly, and enforces plant-critical response times.
  - Financial services: The provider manages direct bank connections, and a bank key change falls on a month-end weekend, when failure would stop payments during close. The EDI team reviews the provider's change plan, staffs a joint test, and agrees a rollback.
- Stakeholders:
  - Procurement (internal, owner): Owns the provider contract, service levels, and renewals
  - Finance and treasury (internal, contributor): Pays provider invoices and checks charges against budget
  - EDI service providers (external, contributor): Delivers the contracted service and reports levels and usage

### Governance and change control
Control access, changes, archives, and contingency plans.

- What the work involves:
  - Move changes through release windows
  - Maintain access roles and audit evidence
  - Keep archives and outage plans current
- Where it breaks: Breaks at the EDI team. Urgent partner deadlines collide with release controls.
- Who is involved: Security, audit, IT change board
- Examples:
  - Retail and CPG: A retailer requires a ship notice change during the company's peak-season change freeze: breaking the freeze risks outages, waiting risks chargebacks. The EDI team brings test evidence to the change board and gets an exception or negotiates a later date.
  - Automotive: An OEM requires each supplier to keep a documented, tested EDI contingency plan, and a missing plan fails audits. The EDI team maintains the plan with portal fallbacks and contacts and tests it with plant operations on a set schedule.
  - Financial services: One user can both edit payment files and release them to the bank, which breaks segregation of duties and invites fraud. The EDI team splits the roles, requires dual approval to release files, and logs who released each file.
- Stakeholders:
  - IT and ERP (internal, owner): Runs the change board and release windows
  - Information security (internal, contributor): Sets access roles and reviews privileged access
  - Compliance and legal (internal, contributor): Sets retention rules and collects audit evidence
  - Customers (external, contributor): Some require contingency plans and archived records on request
  - Regulators (external, contributor): Set retention, privacy, and access rules that audits check

### Reporting and documentation
Report EDI health and keep operating knowledge current.

- What the work involves:
  - Produce error, volume, and onboarding reports
  - Maintain partner catalogs, procedures, and runbooks
  - Train business users on EDI requests
- Where it breaks: Breaks at the EDI team. Knowledge stays with long-tenured staff.
- Who is involved: Leadership, business users, team members
- Examples:
  - Retail and CPG: Sales leadership asks why a key retailer's compliance scorecard dropped, since low scores bring fines and weaken the relationship. The EDI team breaks chargebacks down by cause and site, reports the top issues, and tracks fixes monthly.
  - Automotive: Plant managers learn about late or wrong ship notices only when the OEM scorecard drops. The EDI team publishes weekly ship notice timeliness and accuracy by plant and OEM, with a runbook for each recurring failure.
  - Financial services: The only analyst who knows the bank connection setup is leaving, and the next key change or failure would have no owner. The EDI team documents each bank's connection, formats, contacts, and recovery steps and trains a second analyst.
- Stakeholders:
  - Sales and key accounts (internal, affected): Uses error reports and its own compliance scorecard in customer reviews
  - Supply chain (internal, affected): Uses delivery and ship notice performance by site or partner
  - Finance and treasury (internal, affected): Uses invoice and payment exception reports
  - Customer service (internal, contributor): Business users trained to raise EDI requests correctly

## Stakeholders

### Internal
- Customer service: Order entry and customer inquiries; first to feel order and ship notice failures
- Finance and treasury: Billing, payables, deductions, and treasury; owns invoices, payments, bank files
- Supply chain: Planning, plants, warehouses, and shipping; depends on releases and ship notices
- Master data: Item, customer, vendor, and location records that partner codes must match
- IT and ERP: ERP, interfaces, infrastructure, and the change board
- Information security: Key and certificate policy, encryption, access, and connection approval
- Compliance and legal: Regulatory, tax, audit, and contract obligations, including entity changes
- Sales and key accounts: Owns customer relationships, programs, scorecards, and escalations
- Procurement: Owns supplier relationships, vendor compliance terms, and provider contracts

### External
- Customers: Buyers such as retailers, OEMs, distributors, and payers that set EDI rules
- Suppliers: Vendors that receive orders and send acknowledgments, ship notices, and invoices
- Web and portal partners: Smaller suppliers and vendors without EDI that answer orders through web forms or a buyer's portal
- Carriers and 3PLs: Carriers and logistics providers exchanging tenders, status, and freight bills
- Banks: Banks exchanging payment files, remittance, statements, and status reports
- EDI service providers: VANs, networks, clearinghouses, managed services, and translator vendors
- Regulators: Tax, health, drug, customs, and payment authorities that mandate formats
