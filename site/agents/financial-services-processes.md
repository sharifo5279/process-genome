# Financial services business processes

Source: Business Network Process Genome, Process Genome for Financial services (https://process-genome.onrender.com/#banking/map).
Status: Examples describe typical operating scenarios, not specific customer accounts. Standards, versions, and mandate dates vary by partner and region. Confirm requirements with each partner before building.

## 1. Corporate client onboarding
Outcome: Each new corporate client sends and receives production files over a tested channel on the agreed go-live date.

The bank connects a new corporate client's ERP or treasury system to its payment and reporting services. The work covers the channel (Swift FileAct, EBICS, host-to-host or API), the keys and certificates that secure it, maps between the client's formats and the bank's implementation guide, and staged testing before go-live. Elapsed time is set less by mapping than by key exchange, test cycles and the client's own IT availability, and every channel added creates renewals the bank must track for years.

- Parties: Corporate, Bank
- Business owner: Bank implementation and client onboarding
- Measures: Days from signed agreement to go-live, Test cycles per client, Go-lives on the planned date, First-month production reject rate, Channel credentials expiring within 90 days
- Documents, North America: pain.001, Nacha CCD, Nacha CTX, 820, pain.002, BAI2, camt.053
- Documents, Europe and international: pain.001, MT101, pain.002, camt.052, camt.053, camt.054, MT940, MT942

### Steps
1. **Scope and entitlements** (Portal, from bank)
   - What happens: The bank confirms the products, accounts, formats and channel the client will use, and sets up users, approval rules and payment limits for the service.
   - Rules that bite: Account opening and know-your-customer checks must be complete before any channel goes live. Approval rules (single, dual or panel signatures) and per-user limits are agreed in writing and set in the bank's entitlement system.
   - EDI team work: Records the agreed formats, schema versions, accounts and file schedules in an implementation profile, and flags requests the bank's standard guide does not cover.
   - If it fails: The client goes live with the wrong accounts, formats or signing rules, and production files are rejected or held.
   - Work areas: Partner onboarding, Governance and change control
2. **Channel and keys** (FileAct, EBICS, SFTP, from corporate)
   - What happens: The client connects over the chosen channel and both sides exchange credentials: Swift PKI certificates, EBICS signature, authentication and encryption keys, SSH and PGP keys for host-to-host, or OAuth clients and TLS certificates for APIs.
   - Rules that bite: EBICS users are activated only after the bank checks the signed INI and HIA letters against the keys it received. On Swift, exchanges need relationship authorization (RMA) where the service requires it, and every key and certificate carries an expiry date.
   - EDI team work: Configures endpoints, installs and exchanges keys, runs connectivity tests in both directions, and records every credential with its expiry date and owner.
   - If it fails: Files cannot be sent, signed or decrypted, and the go-live date moves.
   - Work areas: Connections and protocols, Certificate management
3. **Map development** (pain.001, from corporate)
   - What happens: The client's ERP payment output is mapped to the bank's pain.001 implementation guide, and the bank's status reports and statements are mapped back into the ERP.
   - Rules that bite: Files must meet the schema version the bank supports (commonly pain.001.001.03 or pain.001.001.09) plus the bank's own rules on mandatory fields, character set and batch booking. Guides based on the Common Global Implementation (CGI-MP) narrow, but do not remove, differences between banks.
   - EDI team work: Builds or configures the outbound payment map and the inbound pain.002, statement and notification maps, or deploys a prebuilt ERP adapter, and keeps a version of each map per bank.
   - If it fails: Test files fail repeatedly and onboarding stalls in the test phase.
   - Work areas: Map build and maintenance, Document and version changes
4. **Format testing** (pain.001, pain.002, from bank)
   - What happens: The client sends test files to the bank's test environment, and the bank validates each one and returns a pain.002 with the result.
   - Rules that bite: Test files must cover every payment type, currency and debit account in scope. Many banks require a set of clean test files, often one per payment type, before they schedule end-to-end testing.
   - EDI team work: Builds test files from real payment scenarios, tracks each file against its status report, and fixes map errors by reason code until every scenario passes.
   - If it fails: Untested payment types fail on their first production run.
   - Work areas: Rejections, Map build and maintenance
5. **End-to-end test** (BAI2 / camt.053, from bank)
   - What happens: The client sends low-value live payments, or test payments through to the clearing, and confirms that status reports, debit advices and statements reach the ERP and reconcile.
   - Rules that bite: Live test payments move real money, so beneficiaries and amounts are agreed in advance. Reporting tests must cover at least one full statement cycle for every account in scope.
   - EDI team work: Checks that references sent in the payment come back in status and statement files, and that every account's statement loads and balances.
   - If it fails: Go-live proceeds with reconciliation gaps that surface at the first month-end close.
   - Work areas: Monitoring, Cross-references and master data
6. **Go-live and hypercare** (pain.002, from bank)
   - What happens: The bank switches the client to production, watches the first live files and reports closely, then hands the client to standard support.
   - Rules that bite: Cutover should avoid month-end and payroll runs where possible. Old channels or formats stay active until the client confirms the new route, with a fixed cutover date so the same payments are never sent on both.
   - EDI team work: Monitors every production file and acknowledgment during hypercare, resolves first-run rejects with the client, and decommissions the old route once agreed.
   - If it fails: First production rejects and missing reports reach the client's treasury before the bank sees them.
   - Work areas: Monitoring, Support desk and on-call, Rejections

### Variants
- **Swift for corporates** (pain.001, MT101, camt.053, MT940): The corporate joins Swift directly or through a service bureau and reaches many banks through one multi-bank channel, or one bank through its closed user group. It sends pain.001 or MT101 over FileAct or FIN and receives camt.053 or MT940.
- **EBICS**: The standard corporate channel in Germany, France, Austria and Switzerland. Each user signs with personal keys, and distributed electronic signature lets several signatories approve one file. EBICS 3.0 identifies files by BTF parameters instead of order types.
- **Host-to-host** (pain.001, BAI2): Common in North America and for large clients: SFTP, or AS2 at some banks, with SSH and PGP keys, using ISO 20022 or the bank's own layouts. Each bank defines its own folders, file naming and acknowledgment files.
- **API**: Real-time payment initiation, status and balance calls, secured with OAuth and mutual TLS. Bank APIs are not standardized across banks, so files usually remain the record for reconciliation.
- **Migration onboarding** (pain.001): Moving an existing client to a new schema version or channel, such as pain.001.001.03 to pain.001.001.09 or EBICS 2.5 to 3.0, follows the same steps with a period of parallel running.

### Penalties and disputes
- Delayed go-live: the client keeps paying through its old bank or channel, and revenue on the mandate starts late.
- Expired key or certificate on a live channel: files stop until new keys are exchanged and, for EBICS, new initialization letters are verified.
- Untested payment type in production: the first run is rejected in pain.002 and the client misses cutoff.
- Duplicate payments at cutover when the old and new routes both carry the same run.
- Swift users must attest each year to the Customer Security Programme controls; Swift can report users who do not attest to their supervisors.

### Watch for
- Track every channel's keys and certificates by expiry date and owner from day one. Renewals fall due long after the onboarding team has moved on.
- Ask which schema version and which guide version the bank validates against. A file built to an older guide passes the schema and fails the bank's rules.
- Test with production-like data: long beneficiary names, non-Latin characters, structured addresses and every currency in scope.
- Confirm which acknowledgments the bank returns on each channel (transport, file-level pain.002, transaction-level pain.002) so monitoring knows what to expect.
- Freeze the client's ERP payment configuration and the bank's client profile around the cutover date.

### Europe and international
- EBICS keys are initialized with INI and HIA, confirmed by signed letters, and the bank's keys are downloaded with HPB. Banks set their own dates for retiring EBICS 2.5 in favor of 3.0.
- SEPA files follow the EPC customer-to-bank implementation guidelines, which most banks extend with their own rules.
- Corporates are outside CBPR+, so MT101 and MT940 remain available on corporate Swift channels; each bank sets its own MT plans.
- Onboarding for euro credit transfers also covers Verification of Payee: whether the client opts out for bulk files and how results come back.

## 2. Payment initiation
Outcome: Pay beneficiaries on the intended value date, with every payment file accepted on first submission.

The corporate turns an approved payment run into a bank file, and the bank executes it through ACH, wire, SEPA or instant schemes. Formats depend on bank and region: pain.001 wherever the bank offers ISO 20022, Nacha files or X12 820 payment orders at US banks, and MT101 over Swift. Each bank publishes its own implementation guide, so one ERP payment run often needs a different map per bank. Cutoffs, beneficiary data quality and rejections nobody sees are where payments go wrong.

- Parties: Corporate, Bank
- Business owner: Treasury and accounts payable
- Measures: First-pass file acceptance rate, Straight-through processing (STP) rate, Cutoff adherence, Payments rejected or returned, Time to resolve rejects
- Documents, North America: pain.001, Nacha CCD, Nacha CTX, Nacha PPD, 820, pain.002, BAI2
- Documents, Europe and international: pain.001, MT101, pain.002, camt.054, camt.053, MT940

### Steps
1. **Payment run** (ERP, from corporate)
   - What happens: The ERP or treasury system selects due items, groups them by currency, payment method and debit account, and routes the run for approval.
   - Rules that bite: Beneficiary bank details and addresses must be complete, and ISO 20022 routes are moving to structured address fields. Approval must finish in time to make the bank's cutoff for the method and value date.
   - EDI team work: Maintains the mapping from ERP payment methods to bank products and the vendor bank data the file depends on, and flags runs with missing or invalid account details before release.
   - If it fails: Payments are held or sent with bad beneficiary data, and suppliers are paid late.
   - Work areas: Cross-references and master data, Governance and change control
2. **Payment file** (Nacha CCD, Nacha CTX, Nacha PPD / pain.001, MT101, from corporate)
   - What happens: The approved run is formatted as a Nacha file, a pain.001 credit transfer file or MT101 messages, signed, and sent over the agreed channel: Swift, EBICS, host-to-host or API.
   - Rules that bite: pain.001 must pass the ISO 20022 schema and the bank's guide; End-to-End ID is mandatory, up to 35 characters, and SEPA unstructured remittance is limited to 140. Nacha files use fixed 94-character records, and the SEC code (CCD, CTX, PPD) sets the receiver's return rights.
   - EDI team work: Builds and maintains one map per bank, validates files against schema, bank rules and run totals before release, and confirms transmission, including the keys and certificates the channel needs.
   - If it fails: A file that never reaches the bank, or arrives after cutoff, pays nobody that day.
   - Work areas: Map build and maintenance, Connections and protocols, Certificate management
3. **Bank validation** (pain.002, from bank)
   - What happens: The bank checks signatures, entitlements, duplicates and control totals, validates the file, and returns a status report: file accepted, or rejected with a reason code.
   - Rules that bite: A duplicate message ID (DU01) or a control sum that differs from the transactions rejects the whole file at many banks. A Nacha file gets no 997 or pain.002; each bank confirms receipt through its own acknowledgment report or portal.
   - EDI team work: Matches every file to its acknowledgment, chases missing ones before cutoff, and alerts treasury on rejects. See Payment status and returns for transaction-level outcomes.
   - If it fails: A rejected file goes unnoticed and nobody in it is paid.
   - Work areas: Missing documents, Rejections, Monitoring
4. **Bank execution** (Nacha CCD / pacs.008, from bank)
   - What happens: The bank books the debit and executes each payment on the requested date: ACH entries to the ACH operator, wires as pacs.008 over Fedwire or Swift, and euro payments through SEPA clearing.
   - Rules that bite: Same Day ACH has three ACH operator submission deadlines (10:30 a.m., 2:45 p.m. and 4:45 p.m. ET) and a per-payment limit, and each bank sets earlier internal cutoffs. Fedwire Funds moved to ISO 20022 in July 2025, so wire data must fit pacs.008 fields.
   - EDI team work: On the bank side, translates pain.001 into Nacha or pacs.008 and checks that references, remittance and addresses survive into the clearing format.
   - If it fails: Payments sit in the bank's queue past cutoff, or lose remittance and address data in translation.
   - Work areas: Map build and maintenance, Monitoring
5. **Debit reporting** (BAI2 / camt.054, from bank)
   - What happens: The bank reports the booked debits in intraday reports, debit advices and the next statement.
   - Rules that bite: A bulk file may book as one debit, so reporting must carry batch detail or the run cannot be matched. Payments that miss cutoff book on the next business day.
   - EDI team work: Confirms each released file appears as booked debits for the expected amount and date, and alerts treasury when a file was accepted but never booked.
   - If it fails: Treasury cannot confirm what left the account, and the cash position is wrong.
   - Work areas: Monitoring, Reporting and documentation
6. **Close the run** (ERP, from corporate)
   - What happens: Treasury matches booked debits to the payment run by End-to-End ID or batch reference, and accounts payable marks the invoices paid.
   - Rules that bite: Matching needs the reference the corporate sent to come back in bank reporting. Rejects and returns can arrive days after the debit and reopen paid items.
   - EDI team work: Maps bank references and transaction codes into reconciliation rules and routes rejected or returned payments to accounts payable.
   - If it fails: Payables stay open, suppliers are paid twice, or returned payments are never reissued.
   - Work areas: Cross-references and master data, Fix routing

### Variants
- **Payroll** (Nacha PPD, pain.001): Payroll runs as Nacha PPD credits with the Effective Entry Date set to payday, or as SEPA credit transfers with category purpose SALA. Since March 2026 Nacha requires PAYROLL in the company entry description of wage credits. Banks check payroll files against an exposure limit and may hold them for prefunding, and released credits can be reversed only for listed errors within five banking days.
- **Payroll provider** (Nacha CCD, Nacha PPD): A provider acting as Third-Party Sender debits the employer with a CCD entry and pays employees with PPD credits, under an exposure limit its own bank sets.
- **Direct Nacha file** (Nacha CCD, Nacha CTX): The corporate builds the Nacha file itself: CCD with at most one addenda record, or CTX with up to 9,999 addenda carrying a full 820 remittance. US banks receiving pain.001 translate it into Nacha, because US ACH does not carry ISO 20022 XML.
- **X12 820 payment order** (820, 997, 824): Some US banks accept an 820 as the payment order. BPR01 tells the bank what to do: C for payment with remittance, D for payment only, X where the bank may split payment and remittance, I for remittance only. The bank answers with a 997 and often an 824.
- **MT101 over Swift** (MT101): Corporates on Swift can keep sending MT101 to their banks. Swift is not enforcing the planned November 2026 end of MT101 and pain.001 coexistence between banks, so confirm each bank's plans and keep address data clean for later conversion.
- **Payment factory and POBO** (pain.001): A central entity pays from its own account per currency on behalf of group companies and books intercompany. ISO 20022 carries the ultimate debtor so beneficiaries can reconcile; whether this is allowed varies by country.

### Penalties and disputes
- Schema or bank-guide validation failure: the file or the failing transactions are rejected in pain.002 and must be corrected and resent.
- Missed cutoff: the payment executes on the next business day, and the payer can lose an early payment discount or owe late payment charges under the supplier's terms.
- Verification of Payee Close Match, No Match or Verification Not Possible on euro credit transfers: a payer who authorizes anyway carries the risk if the funds reach the wrong account.
- Payroll file held or late: employees are paid late, and the employer answers to them for late wages.
- Address data truncated in format conversion: the payment can be held for screening or rejected by the next bank in the chain.

### Watch for
- A file-level accept in pain.002 is not proof of payment. Transaction rejects can follow hours or days later, and only the booked debit confirms execution.
- Every bank adds its own rules to pain.001. CGI-MP narrows the differences, but a file valid at one bank is often rejected at the next, so treat maps as per bank.
- Never resend a full file after a partial reject. Resend only the rejected transactions, or the accepted payments go out twice.
- Cutoffs differ by method, currency and bank. A late file is executed on the next business day by some banks and rejected by others; learn each bank's rule.
- Check totals and the File ID Modifier against the previous Nacha file before sending. A duplicate payroll file pays everyone twice.

### Europe and international
- SEPA credit transfers use pain.001 and pain.002 under the EPC customer-to-bank guidelines, with funds reaching the beneficiary bank within one business day.
- Verification of Payee has applied since October 2025: euro banks check the payee name against the IBAN before SCT and SCT Inst. Non-consumers may opt out for bulk files.
- EBICS is the standard channel in Germany and is used in France, Austria and Switzerland, with distributed electronic signature for approval. Corporates on Swift send pain.001 over FileAct or MT101 over FIN.
- The EPC planned to accept only structured or hybrid addresses from November 2026, but in September 2026 postponed that end date; Swift also deferred its 2026 payments changes, with an update due by December 2026.
- UK domestic payments run on Bacs, with Standard 18 files on a three-day cycle, and on Faster Payments.

## 3. Payment status and returns
Outcome: Know the final status of every payment, and reissue rejected or returned payments before the payee notices.

An accepted file is not a paid file. Payments can be rejected by the bank before execution, rejected by the receiving bank, or returned after settlement. Rejections come back in pain.002; returns travel between banks as pacs.004 or Nacha return entries, and reach the corporate in camt.054, BAI2 or bank return files. Nacha adds notifications of change, return rate thresholds and update deadlines. The work is matching each status or return to the original payment quickly and fixing the master data behind it.

- Parties: Corporate, Bank, Receiving bank
- Business owner: Treasury operations, accounts payable and accounts receivable
- Measures: Payments with a final status by value date, Return rate by reason, Unauthorized return rate, Time to reissue returned payments, NOCs applied on time
- Documents, North America: pain.002, Nacha return entries, Nacha COR, pacs.004, BAI2
- Documents, Europe and international: pain.002, pacs.002, pacs.004, camt.054, ARUCS, AWACS

### Steps
1. **File status** (pain.002, from bank)
   - What happens: The bank returns a file or batch status: accepted after technical validation (ACTC), accepted with changes, or rejected with a reason code.
   - Rules that bite: Schema errors (FF01), duplicate message IDs (DU01) and control sum mismatches typically reject at file or batch level. Banks differ on whether they send positive status reports, so learn each bank's pattern.
   - EDI team work: Matches every file to its expected status reports by message ID, chases missing ones before cutoff, and alerts treasury on rejects.
   - If it fails: A rejected file goes unseen and nobody in it is paid.
   - Work areas: Missing documents, Rejections, Monitoring
2. **Transaction status** (pain.002, from bank)
   - What happens: As processing continues, the bank reports individual payments as in progress (ACSP), settled (ACSC), pending or rejected, each with an ISO reason code.
   - Rules that bite: Rejections from funds checks, screening or the clearing can arrive hours after the file was accepted. Codes such as AC01 incorrect account, AC04 closed account, AM04 insufficient funds and RR04 regulatory reason decide the next action.
   - EDI team work: Loads transaction statuses against the original payments by End-to-End ID, routes each reason code to treasury, payables or master data, and resends only the corrected transactions.
   - If it fails: Rejected payments go unnoticed, or accepted payments are paid twice when a whole file is resent.
   - Work areas: Rejections, Fix routing
3. **Interbank reject or return** (pacs.002, pacs.004, from receiving bank)
   - What happens: The receiving bank rejects a payment it cannot accept before settlement (pacs.002), or returns it after settlement (pacs.004) with the original references and a reason code.
   - Rules that bite: SEPA credit transfer returns must be made within three banking business days of settlement. Cross-border returns can arrive with charges deducted, so the returned amount may be lower than the original.
   - EDI team work: On the bank side, links each interbank reject or return to the customer's original payment by UETR or End-to-End ID and passes it into the customer's status and reporting files.
   - If it fails: The bank holds returned funds it cannot attribute, and the customer is never told.
   - Work areas: Cross-references and master data, Monitoring
4. **Nacha return** (Nacha return entry, from receiving bank)
   - What happens: The receiving bank returns an ACH entry through the ACH operator with a reason code and the original trace number.
   - Rules that bite: Most returns must reach the originating bank within two banking days of settlement: R01 insufficient funds, R02 account closed, R03 no account, R04 invalid account number. Consumer unauthorized returns (R05, R07, R10, R11) can arrive up to 60 calendar days after settlement.
   - EDI team work: Loads return files and reports from each bank, parses reason codes and original trace numbers, and alerts the owning team the same day.
   - If it fails: Returned money is still counted as paid or collected, and nobody follows up.
   - Work areas: Monitoring, Fix routing
5. **Notification of change** (Nacha COR, from receiving bank)
   - What happens: When an entry posts despite wrong data, the receiving bank sends a notification of change with the corrected value: C01 account number, C02 routing number, C03 both, C05 transaction code.
   - Rules that bite: The originator must apply the change within six banking days of receipt or before initiating the next entry to that account, whichever is later.
   - EDI team work: Parses the COR entry and the corrected data in its addenda, and routes each change to the master data owner with the original entry attached.
   - If it fails: The next entry carries the same bad data, and the originator falls out of compliance with Nacha rules.
   - Work areas: Cross-references and master data, Monitoring
6. **Return reporting** (BAI2 / camt.054, from bank)
   - What happens: The originating bank reports rejects, returns and NOCs to the corporate in a Nacha-format return file, BAI2 detail, camt.054 or a portal report.
   - Rules that bite: Each bank presents returns differently, and some show a return only as a credit with limited detail. The original End-to-End ID or trace number must survive into the report for matching.
   - EDI team work: Maps every bank's return source to one internal set of reason codes, and matches each return to its original payment or collection.
   - If it fails: Returned money is still counted as paid, and payables show invoices settled that the supplier never received.
   - Work areas: Map build and maintenance, Cross-references and master data
7. **Correct and reissue** (ERP, from corporate)
   - What happens: The owner decides by reason code: correct the account data and reissue, apply a NOC, pay another way, or stop and refer to compliance.
   - Rules that bite: Bank detail changes need approval and an audit trail, because vendor impersonation targets this step. A NOC confirms the money arrived: fix the data, do not reissue the payment.
   - EDI team work: Applies corrected data to the vendor, customer or employee record, checks the next file carries it, and blocks automatic reissue on codes such as R16 that need compliance review.
   - If it fails: The same payment fails again, or a reissued payment goes to an account a fraudster supplied.
   - Work areas: Cross-references and master data, Governance and change control, Rejections

### Variants
- **Debit returns**: Returns on collections reverse cash already counted as received; see Direct debit collections. Corporate debits disputed as unauthorized come back as R29 within two banking days.
- **Wire returns** (pacs.004, BAI2): Since the Fedwire ISO 20022 migration, wire returns travel between banks as pacs.004 referencing the original payment. The corporate sees them in bank reporting; recalls are covered under Investigations and payment tracking.
- **Sanctions returns**: R16 means the account is frozen or the entry was returned under OFAC instruction. The entry goes to compliance and is never retried to the same account without review.
- **Prenotes** (Nacha prenote): A prenotification entry with no amount tests account details before the first live entry. It can itself draw a return or a NOC.

### Penalties and disputes
- Nacha return rate review levels on debit entries: 0.5 percent for unauthorized returns, 3 percent for administrative returns (R02, R03, R04) and 15 percent overall. Breaches lead to inquiries and, for unauthorized returns, possible rules enforcement and fines.
- NOC not applied within six banking days or before the next entry: a Nacha rules violation.
- Improper reinitiation of a returned entry: a Nacha rules violation pursued through the originating bank.
- Returned supplier payment reissued late: the supplier treats the invoice as unpaid and applies its late payment terms.
- Cross-border returns with charges deducted: the payer bears the shortfall and the cost of paying again.

### Watch for
- The trace number or End-to-End ID is the link between a return and its payment. If the ERP never stored it, every return becomes manual research.
- Returns arrive days, or for consumer unauthorized codes weeks, after the payment run was closed.
- Banks present returns and NOCs differently: Nacha-format files, statement detail or portal reports. Map every source to the same internal codes.
- A status report that never arrives looks like success. Track expected status reports per file and per bank.
- R16 is a sanctions or frozen-account return. Route it to compliance before anyone tries a different account.

### Europe and international
- SEPA credit transfers have no notification of change. A payment to a wrong or closed IBAN is rejected before settlement (pain.002) or returned within three banking business days after it (camt.054).
- ISO 20022 returns travel between banks as pacs.004 with reason codes such as AC04 closed account or AC06 blocked account, and reference the original payment.
- Verification of Payee flags a payee name that does not match the IBAN before the payment is sent. It does not confirm that the account is open.
- UK Bacs returns credits it cannot apply through ARUCS, with a reason code per item, and reports wrong account details for credits through AWACS.

## 4. Sanctions screening and fraud controls
Outcome: Stop prohibited and fraudulent payments before they leave, and release legitimate payments in time for their value date.

Every payment a bank executes passes entitlement checks, sanctions screening and fraud monitoring inside the payment flow. The duty to screen comes from sanctions law and scheme rules; the lists screened, matching thresholds, hold times and information requests are each bank's own. A potential match holds the payment until an analyst clears it, so the quality of names and addresses decides how many legitimate payments wait. On the corporate side, approval controls, positive pay and payee verification are the matching defenses.

- Parties: Corporate, Bank
- Business owner: Bank payments compliance and operations; corporate treasury
- Measures: Payments held for screening, False positive rate, Average time to clear a hold, Held payments that missed their value date, Fraud losses
- Documents, North America: pain.001, pacs.008, pain.002, Positive pay issue file, BAI2
- Documents, Europe and international: pain.001, pacs.008, pain.002, camt.053

### Steps
1. **Sign and submit** (pain.001, from corporate)
   - What happens: The corporate's approvers release the payment file, signing it in the ERP or on the bank channel, and send it to the bank.
   - Rules that bite: The approval rules agreed at onboarding apply: dual or panel signatures and per-user and per-file limits. EBICS distributed signature lets each signatory authorize the file separately at the bank.
   - EDI team work: Keeps signing workflows and signatory keys aligned with the bank's entitlement setup, and alerts when a file waits for a missing signature near cutoff.
   - If it fails: Payments wait for approval past cutoff, or a file released by one person bypasses dual control.
   - Work areas: Governance and change control, Certificate management
2. **Entitlement checks** (pain.001, from bank)
   - What happens: The bank authenticates the channel and signatures, checks each signer's authority and limits, and runs duplicate and control total checks.
   - Rules that bite: Signer authority, limits and duplicate rules are bank-specific and set in the client profile. A file above a user or account limit is held for further approval or rejected.
   - EDI team work: Maintains the client entitlement profile from signed mandates, and routes limit holds to relationship and operations teams.
   - If it fails: Unauthorized files are executed, or valid files are rejected for outdated entitlements.
   - Work areas: Governance and change control, Cross-references and master data
3. **Sanctions screening** (pacs.008, from bank)
   - What happens: Before release, the bank screens the parties, banks, countries and free text of each payment against the sanctions lists it applies, and holds potential matches for review.
   - Rules that bite: Screening is a legal duty, but the lists applied depend on jurisdiction and bank policy (for example OFAC, EU, UN and UK lists). US persons must block property of blocked persons and report blocked or rejected transactions to OFAC within 10 business days.
   - EDI team work: Feeds complete party and address data from the payment format into screening, and fixes truncation and character conversion that create false matches.
   - If it fails: A prohibited payment is executed, or legitimate payments wait in a screening queue past cutoff.
   - Work areas: Regulatory mandates, Cross-references and master data
4. **Fraud scoring** (pain.001, from bank)
   - What happens: The bank scores each payment against fraud rules and behavior models: new or changed beneficiaries, unusual amounts or countries, and account takeover signals.
   - Rules that bite: Rules, thresholds and models are bank-specific. Since 2026 Nacha rules require originating banks and non-consumer originators to run risk-based monitoring for fraud, including false pretenses entries, and receiving banks to monitor incoming credits.
   - EDI team work: Supplies payment history and beneficiary reference data to the fraud engine, and helps tune rules that flag routine payments.
   - If it fails: A payment to a fraudster's account is released, or regular suppliers are held every run.
   - Work areas: Regulatory mandates, Monitoring
5. **Hold and query** (Portal, from corporate)
   - What happens: The bank asks the corporate for more information on a held payment: a full beneficiary address, payment purpose, the underlying invoice, or a callback to confirm a new beneficiary.
   - Rules that bite: Banks often cannot say why a payment is held, and hold times are bank-specific. The value date is not guaranteed while the payment is held.
   - EDI team work: Routes bank queries to the payment owner with the original payment record, and tracks open holds against cutoff.
   - If it fails: The query sits unanswered and the payment misses its value date or is rejected.
   - Work areas: Support desk and on-call, Fix routing
6. **Release, reject or block** (pain.002, from bank)
   - What happens: The analyst clears the hold and the payment proceeds; or the bank rejects it with a reason code; or, for a true sanctions match, freezes the funds and reports them.
   - Rules that bite: Sanctions rejects usually carry a generic code such as RR04 regulatory reason, not the match detail. Blocked funds stay frozen until the authority licenses their release.
   - EDI team work: Loads the outcome against the original payment, routes regulatory rejects to compliance, and blocks automatic reissue to the same beneficiary.
   - If it fails: A rejected payment is reissued unchanged and held again, or a blocked payment is reported to the supplier as paid.
   - Work areas: Rejections, Regulatory mandates, Fix routing

### Variants
- **Check positive pay** (Positive pay issue file): The corporate sends an issue file of checks written and voided. The bank matches presented checks and lists exceptions for a pay or return decision by its daily cutoff; undecided items take the default set at onboarding. Layouts are bank-specific: there is no industry standard format.
- **Payee positive pay** (Positive pay issue file): The bank also compares the payee name on each check with the issue file, which catches altered payees but creates exceptions when names are truncated or abbreviated differently.
- **Reverse positive pay** (Bank file): The bank sends a daily list of presented checks and the corporate reviews each one, with no issue file. Missed reviews often default to pay.
- **ACH debit blocks and filters** (Portal): A block rejects every ACH debit to the account; a filter allows only approved originator company IDs. ACH positive pay presents other debits as exceptions to pay or return.
- **Payee verification**: Euro banks check the payee name against the IBAN before SCT and SCT Inst; the UK runs Confirmation of Payee for Faster Payments and CHAPS. In the US, account validation services and prenotes play a similar role.
- **Inbound screening** (pacs.008): Banks also screen incoming payments before crediting. A held incoming payment reaches the beneficiary late, and the payer is not told.

### Penalties and disputes
- Executing a prohibited payment: civil penalties under sanctions law, which in the US apply on a strict liability basis, plus remediation demanded by regulators.
- Blocking or reject report filed late or not at all: a separate reporting violation for the bank.
- Payment held past cutoff: executed on a later value date, with late payment charges under the corporate's supplier terms.
- Fraudulent payment released: an authorized push payment loss, recoverable only through a recall the receiving bank and beneficiary must cooperate with. In the UK, reimbursement rules for such fraud cover consumers, microenterprises and charities.
- Positive pay exception not decided by cutoff: the default decision applies and cannot be changed after the bank's processing cutoff.

### Watch for
- Truncated names and addresses from format conversion or short ERP fields create false matches. Structured addresses help screening only when town and country are filled correctly.
- A held payment shows no error to the corporate; it simply does not settle. Monitor payments without a final status by value date.
- A change of beneficiary bank details is the most common fraud entry point. Confirm changes by calling a known contact before the next run.
- Screening and fraud rules are bank-specific, so the same payment can clear at one bank and be held at another.
- Positive pay defaults and ACH filters are set once at onboarding and forgotten. Confirm them per account.

### Europe and international
- EU sanctions apply through the EU consolidated list; frozen funds are reported to the national competent authority.
- Under the Instant Payments Regulation, banks verify at least daily whether their customers are designated under EU targeted financial sanctions, instead of screening each euro instant transfer against those lists. Lists from other jurisdictions are screened under bank policy.
- Verification of Payee has been mandatory for euro credit transfers since October 2025, answering Match, Close Match, No Match or Verification Not Possible. Businesses may opt out for bulk files.
- EBICS distributed signature (VEU in German, EDS in the English EBICS specification) lets several signatories authorize one file at the bank channel.
- Checks are a small share of euro area non-cash payments, so positive pay plays a minor role in Europe.

## 5. Cross-border payments
Outcome: Every cross-border payment reaches the beneficiary bank on time, tracked end to end, with complete party data and no repair.

Banks move customer and own-account payments across borders over Swift, through accounts they hold with each other. Since 22 November 2025, payment instructions in the CBPR+ scope travel as ISO 20022: pacs.008 for customer payments, pacs.009 for bank transfers and pacs.009 COV for cover, with pacs.002 for rejects and pacs.004 for returns. gpi banks in the chain update the tracker by UETR, and the bank that credits the customer confirms the credit or rejection. Data lost in translation, incomplete party data and screening holds at correspondents are where payments slow down.

- Parties: Instructing bank, Correspondent bank, Beneficiary bank
- Business owner: Bank payment operations and correspondent banking
- Measures: Straight-through processing rate, Payments credited same day (tracker), Messages repaired or rejected, MT traffic still sent through translation, Investigations per thousand payments
- Documents, North America: pacs.008, pacs.009, pacs.002, pacs.004, camt.054, BAI2
- Documents, Europe and international: pacs.008, pacs.009, pacs.009 COV, pacs.002, pacs.004, MT103, MT202, MT202COV, camt.054

### Steps
1. **Customer instruction** (pain.001, MT101, from instructing bank)
   - What happens: The instructing bank receives the customer's payment by file, MT101 or channel, checks and screens it, and builds the interbank message.
   - Rules that bite: Names, accounts and addresses must fit pacs.008 fields: CBPR+ accepts structured or hybrid addresses, and Swift will set a new date for ending fully unstructured ones. The UETR is assigned here, or taken from the customer's pain.001, and never changes along the chain.
   - EDI team work: Maps customer formats into pacs.008, keeps the customer's End-to-End ID and remittance intact, and stops payments whose data would be truncated.
   - If it fails: Payments leave with incomplete data and are held or rejected downstream.
   - Work areas: Map build and maintenance, Cross-references and master data
2. **Customer credit transfer** (MT103 / pacs.008, from instructing bank)
   - What happens: The bank sends a pacs.008 to the next bank in the chain (serial), or directly to the beneficiary bank with a separate cover payment.
   - Rules that bite: Swift no longer supports MT103 for CBPR+ payment instructions since November 2025; MT still sent goes through chargeable contingency translation. The charge bearer (DEBT, CRED, SHAR) replaces MT103 field 71A (OUR, BEN, SHA).
   - EDI team work: Builds and validates pacs.008 against the CBPR+ usage guidelines, monitors any MT traffic still routed through translation, and keeps both versions of a payment linked by UETR.
   - If it fails: The message is rejected by the network or the next bank, or data is truncated in translation.
   - Work areas: Map build and maintenance, Document and version changes
3. **Cover payment** (MT202COV / pacs.009 COV, from instructing bank)
   - What happens: When the bank sends the pacs.008 direct to the beneficiary bank, it settles through correspondents with a pacs.009 COV carrying the underlying customer details.
   - Rules that bite: The cover must carry the underlying debtor and creditor exactly as in the pacs.008, so every bank in the cover chain can screen them. A mismatch between instruction and cover delays the credit.
   - EDI team work: Generates the cover from the same payment record as the pacs.008 and reconciles the two by UETR.
   - If it fails: The beneficiary bank has the instruction but not the funds, and the payment sits unapplied.
   - Work areas: Cross-references and master data, Monitoring
4. **Correspondent processing** (MT202 / pacs.009, from correspondent bank)
   - What happens: The correspondent debits the sender's account, screens the payment, deducts charges where the charge option allows, and passes it on; bank-to-bank transfers on own account travel as pacs.009.
   - Rules that bite: Each gpi bank must update the tracker with status and charges. A payment the correspondent cannot process is rejected with pacs.002 quoting the original references.
   - EDI team work: On the correspondent side, monitors queues held for screening or funding, and repairs or rejects messages within the agreed service level.
   - If it fails: Payments wait in a correspondent queue and the value date is lost.
   - Work areas: Monitoring, Rejections, Provider management
5. **Status and tracking** (pacs.002, gpi tracker, from beneficiary bank)
   - What happens: Each bank in the chain reports status to the gpi tracker against the UETR, and the beneficiary bank confirms the credit or the rejection.
   - Rules that bite: Under universal confirmations, every bank receiving a customer credit transfer over Swift must confirm credit or rejection to the tracker. A pacs.002 reject must reference the original message and give an ISO reason code.
   - EDI team work: Links tracker updates and pacs.002 status to each outgoing payment, and alerts operations on payments without a credit confirmation past the expected time.
   - If it fails: Payments stall unseen until the customer asks.
   - Work areas: Monitoring, Missing documents
6. **Credit beneficiary** (BAI2 / camt.054, from beneficiary bank)
   - What happens: The beneficiary bank screens the payment, converts currency if needed, credits the customer and reports the credit with payer, remittance and references.
   - Rules that bite: gpi member banks commit to crediting within their cutoff on the day of receipt and to passing remittance unaltered. Charges deducted along the chain under SHAR or CRED reduce the amount credited.
   - EDI team work: Maps inbound pacs.008 into customer reporting, so the beneficiary sees payer, remittance and End-to-End ID in camt.054, camt.053 or BAI2.
   - If it fails: The beneficiary receives a credit it cannot identify, and the payer is chased for proof.
   - Work areas: Map build and maintenance, Cross-references and master data
7. **Return or reject** (pacs.004, from beneficiary bank)
   - What happens: A payment the beneficiary bank cannot apply is rejected with pacs.002 before crediting, or returned with pacs.004 after, referencing the original UETR.
   - Rules that bite: Returns travel back along the chain and each bank may deduct charges, so the returned amount can be less than the original. The return quotes an ISO reason, such as AC04 closed account or BE04 missing creditor address.
   - EDI team work: Matches returns to the original payment by UETR and reports them to the debtor's customer.
   - If it fails: Returned funds sit in suspense and the debtor is never told.
   - Work areas: Rejections, Cross-references and master data

### Variants
- **Serial method** (pacs.008): The pacs.008 travels bank by bank through each correspondent, and settlement follows the message. Simpler to reconcile, but slower, and each bank may deduct charges.
- **Financial institution transfers** (pacs.009, MT202): Treasury, FX settlement and nostro funding between banks use pacs.009 (formerly MT202), with no underlying customer.
- **Market infrastructure legs** (pacs.008, pacs.009): Domestic legs often settle in a high-value system that also runs ISO 20022, such as Fedwire Funds and CHIPS in the US, T2 in the euro area and CHAPS in the UK, each with usage guidelines of its own alongside CBPR+.
- **Corporate visibility** (pain.002): Corporates follow their payments by UETR where the bank offers gpi status through status reports, API or portal.
- **Pre-validation**: Where both banks use a pre-validation service, the instructing bank checks beneficiary account details with the beneficiary bank before sending.

### Penalties and disputes
- Rejected or repaired messages: a later value date, repair handling at each bank, and poor-quality traffic raised in correspondent relationship reviews.
- MT payment instructions sent after November 2025: Swift charges for contingency translation, and data may be truncated.
- Missing or inaccurate payer and payee information: breaches payment transparency rules (FATF Recommendation 16, the EU Transfer of Funds Regulation) and leads to holds, rejects and correspondent queries.
- Sanctions match at a correspondent: funds blocked in the correspondent's jurisdiction, outside the instructing bank's control.
- Late credit: the payer bears late payment terms with its supplier, and the bank answers investigations it could have avoided.

### Watch for
- Keep the UETR unchanged end to end. A new UETR on a forwarded payment breaks tracking and recall.
- Translation from ISO 20022 to MT for banks still on MT can truncate names, addresses and remittance. Check what the next bank actually receives.
- A pacs.008 and its pacs.009 COV must agree on the underlying parties.
- Charge codes change the amount credited. SHAR and CRED payments arrive short, which the beneficiary's cash application must expect.
- Statements and confirmations stayed outside the November 2025 deadline: MT940, MT950 and MT900 or MT910 still coexist with camt between banks for now.

### Europe and international
- Euro payments within SEPA usually go as SCT rather than through correspondents; CBPR+ covers payments outside SEPA and in other currencies.
- T2 moved to ISO 20022 in March 2023 and CHAPS in June 2023.
- The EU Transfer of Funds Regulation requires complete payer and payee information on transfers and lets the payee's bank reject or suspend transfers with missing data.
- In August 2026 Swift deferred all payments changes in its 2026 standards release, including the end of fully unstructured addresses, with an update due by December 2026 at the latest.

## 6. Instant payments
Outcome: Every instant payment is confirmed or rejected within seconds, and both sides know the result at once.

Instant credit transfer schemes settle single payments in seconds, around the clock, every day of the year. Between banks they run on ISO 20022: pacs.008 for the payment and pacs.002 for the payee bank's accept or reject. Corporates send pain.001 or API calls and receive pain.002 and camt.054. Request to pay (pain.013, pain.014) lets a payee ask for a payment that the payer approves. Time is the constraint: every check must finish inside the scheme limit, and an accepted payment is irrevocable.

- Parties: Payer, Payer bank, Payee bank
- Business owner: Treasury operations and bank instant payments operations
- Measures: Payments confirmed within the scheme limit, Reject rate by reason, Time-outs, Requests to pay accepted, Credits reported in real time
- Documents, North America: pacs.008, pacs.002, pain.013, pain.014, camt.056, pacs.004
- Documents, Europe and international: pain.001, pain.002, pacs.008, pacs.002, pain.013, pain.014, camt.054

### Steps
1. **Request to pay** (pain.013, from payee bank)
   - What happens: Where the payee uses request to pay, its bank sends the payer a request with amount, due date and reference, which arrives in the payer's banking channel.
   - Rules that bite: Request to pay is optional, and the payer may accept, decline or ignore it. The euro SEPA Request-to-Pay scheme and the US instant schemes each set their own pain.013 usage rules.
   - EDI team work: Maps outgoing requests from billing and links each to its invoice and expected payment.
   - If it fails: Requests go unanswered and the payee falls back to slower collection methods.
   - Work areas: Map build and maintenance, Business programs
2. **Accept or decline** (pain.014, from payer)
   - What happens: The payer accepts or declines the request; acceptance triggers an instant payment for the requested amount.
   - Rules that bite: The response must reference the original request. An accepted request is not a payment until the pacs.008 is confirmed.
   - EDI team work: Returns the response status to billing and matches the later credit to the accepted request.
   - If it fails: The payee treats an accepted request as paid when the payment itself failed.
   - Work areas: Cross-references and master data, Monitoring
3. **Instant instruction** (pain.001, from payer)
   - What happens: The payer sends a single instant payment by API or channel, or a batch of instant payments in a pain.001 marked for instant execution.
   - Rules that bite: SCT Inst payments carry local instrument INST. Euro banks that accept batch files for standard transfers must also accept them for instant transfers, and each payment in the batch is executed and confirmed separately.
   - EDI team work: Maps instant payment requests with the right instrument and service level codes, and splits batches against the payer's limits.
   - If it fails: Payments go out as standard credit transfers, or are rejected for exceeding a limit.
   - Work areas: Map build and maintenance, Business programs
4. **Checks and send** (pacs.008, from payer bank)
   - What happens: The payer bank verifies the payee where required, checks funds and limits, screens and scores the payment, reserves the funds and sends a pacs.008 to the clearing.
   - Rules that bite: All of this runs inside the scheme limit: for SCT Inst, 10 seconds from the payer bank's time stamp to confirmation. Limits come from the bank and the payer, since the EPC no longer sets a scheme maximum amount.
   - EDI team work: Monitors latency per step, keeps reference data for screening and limit checks available around the clock, and alerts on time-outs.
   - If it fails: The payment times out and is rejected, or is sent without required checks.
   - Work areas: Monitoring, Outages and recovery, Regulatory mandates
5. **Accept and credit** (pacs.002, from payee bank)
   - What happens: The payee bank validates and screens the payment, credits the payee's account and returns a positive pacs.002, or rejects it with a reason code.
   - Rules that bite: Funds must be available to the payee as soon as the payment is accepted. If no confirmation arrives within the deadline, the payer bank treats the payment as rejected and releases the reserved funds.
   - EDI team work: Runs monitoring and on-call for the receiving side every hour of every day, since an unavailable bank rejects every incoming payment.
   - If it fails: Incoming payments are rejected while systems are down, and payers switch to slower routes.
   - Work areas: Support desk and on-call, Outages and recovery
6. **Status to payer** (pain.002, from payer bank)
   - What happens: The payer bank passes the final status to the payer within seconds: settled or rejected with a reason.
   - Rules that bite: Instant status is final, and an accepted payment cannot be cancelled. A wrong payment can be recovered only through a recall the payee agrees to.
   - EDI team work: Pushes status into the ERP in real time and alerts on rejects, so treasury can pay by another route the same day.
   - If it fails: The payer resends a payment that already settled and pays twice.
   - Work areas: Rejections, Monitoring
7. **Credit notification** (camt.054, from payee bank)
   - What happens: The payee bank reports each credit to the payee, with payer and references, by camt.054, API or the next intraday report.
   - Rules that bite: Banks differ: some notify each instant credit in real time, others only in intraday and end-of-day reporting. End-to-End ID and remittance must pass through unchanged for automatic matching.
   - EDI team work: Loads credit notifications into cash application and reconciles them with intraday and end-of-day statements without counting a credit twice.
   - If it fails: Cash arrives but sits unapplied until the next day's statement.
   - Work areas: Map build and maintenance, Monitoring

### Variants
- **US instant schemes** (pacs.008, pacs.002, camt.056, pacs.004): The two US instant schemes run on ISO 20022 pacs.008 and pacs.002, both with request for payment. Neither has a returns process: a payer seeking recovery sends a return request (camt.056), and the payee bank may return the funds with pacs.004.
- **UK Faster Payments**: Near-real-time payments on a scheme message standard of its own, with Confirmation of Payee before payment. Moving the scheme to ISO 20022 is part of the planned renewal of UK payments infrastructure.
- **Instant batch** (pain.001, pain.002): A corporate sends one pain.001 with many instant payments, for example urgent payroll corrections; each payment receives its own status.
- **Recall** (camt.056, camt.029, pacs.004): Instant payments are irrevocable. A wrong payment is recalled with camt.056, answered with camt.029, and recovered by pacs.004 only if the payee agrees.

### Penalties and disputes
- Time-out: the payment is rejected and must be sent again or by another route; a payer that resends without checking status can pay twice.
- Payee bank unavailable: every incoming payment is rejected while it is down.
- Fraud on irrevocable payments: authorized push payment losses fall on the payer unless a reimbursement regime applies, such as the UK's for consumers, microenterprises and charities.
- Euro area banks that fail Instant Payments Regulation duties, including price parity with standard transfers and Verification of Payee, face penalties set by national competent authorities.

### Watch for
- There is no cutoff and no batch window. Monitoring, on-call and reference data must work every hour of every day.
- Instant status is final. Retry on the reject reason, never on a missing response, and check status before resending.
- Real-time notifications and the end-of-day statement report the same credit. Remove duplicates before reconciliation.
- Per-payment limits differ by bank and by customer setting. Large payments in a batch can be rejected one by one.

### Europe and international
- Under the Instant Payments Regulation, euro area banks have had to receive SCT Inst since January 2025 and send it since October 2025, at no higher price than standard transfers and with Verification of Payee.
- The 2025 SCT Inst rulebook keeps the 10 second limit and removes the scheme-wide maximum amount.
- Banks verify at least daily whether their customers are designated under EU sanctions, instead of screening each instant transfer against EU lists.
- The EPC SEPA Request-to-Pay scheme uses pain.013 and pain.014 between request-to-pay providers; take-up varies by country.

## 7. Statements and cash reporting
Outcome: Know every account's cash position each morning and reconcile every bank transaction to the ledger.

Banks send a prior-day statement for every account each morning, intraday reports during the day, and booking notifications that break batch bookings into items. Treasury uses them for the cash position, and accounting matches every transaction to the ledger. North American banks mostly report in BAI2, European banks in camt.053, camt.052 and camt.054 or MT940 and MT942. With many banks and accounts, the hard parts are complete, on-time delivery from each bank and transaction codes that map cleanly to matching rules.

- Parties: Bank, Corporate
- Business owner: Treasury and general accounting
- Measures: Statement timeliness by bank, Statement completeness by account, Auto-reconciliation rate, Unreconciled items by age, Days to close bank reconciliation
- Documents, North America: BAI2, camt.052, camt.053, camt.054
- Documents, Europe and international: camt.052, camt.053, camt.054, MT940, MT942

### Steps
1. **Intraday report** (BAI2 / camt.052, MT942, from bank)
   - What happens: The bank sends current-day reports through the day with ledger and available balances and the items posted so far.
   - Rules that bite: Intraday data is provisional, and each bank sends it on its own schedule, often hourly. A late report forces funding and investment decisions on stale balances.
   - EDI team work: Monitors each scheduled intraday delivery by bank and account, and alerts treasury when a report is missing or late.
   - If it fails: Treasury funds or invests on incomplete data, leaving accounts overdrawn or cash idle.
   - Work areas: Monitoring, Missing documents
2. **Prior-day statement** (BAI2 / camt.053, MT940, from bank)
   - What happens: Each morning the bank sends the prior day's statement: opening and closing ledger balances, available balances, and every booked transaction with a type code and references.
   - Rules that bite: The file must arrive before the morning cash position and cover every account. Every BAI2 type code or ISO bank transaction code in it must already be mapped by the corporate.
   - EDI team work: Tracks arrival per bank and account against the delivery schedule, chases missing or partial files, and requests resends for gaps.
   - If it fails: The cash position is wrong, and the day's reconciliation cannot start.
   - Work areas: Missing documents, Monitoring, Partner follow-up
3. **Booking detail** (BAI2 / camt.054, from bank)
   - What happens: The bank sends debit and credit notifications per booking, or itemized detail for batch bookings such as a payment file, a direct debit collection or returns.
   - Rules that bite: A batch booking on the statement must be broken down by camt.054 or BAI2 detail records, or individual payments and returns cannot be matched. Banks differ on whether this detail is standard or an extra service.
   - EDI team work: Links notifications to statement entries by the bank's reference, and keeps the same item from loading twice.
   - If it fails: Batch bookings stay unmatched and individual returns are missed.
   - Work areas: Map build and maintenance, Cross-references and master data
4. **Load and validate** (ERP, from corporate)
   - What happens: The treasury system or ERP loads the statement and checks that every expected account arrived and each opening balance equals the prior closing balance.
   - Rules that bite: A break in balance continuity means a missing or duplicate statement. Loading a statement twice doubles its transactions.
   - EDI team work: Maps BAI2, camt and MT files into the bank statement import, maintains account and code tables, and investigates load failures and continuity breaks.
   - If it fails: Wrong balances flow into the cash position and the general ledger.
   - Work areas: Map build and maintenance, Cross-references and master data, Rejections
5. **Auto-reconcile items** (ERP, from corporate)
   - What happens: Matching rules pair each bank transaction with an open item in payables, receivables or the ledger, using amount, references and transaction code.
   - Rules that bite: Rules depend on references surviving the trip through the bank. Bulk bookings without item detail and truncated MT fields break matching.
   - EDI team work: Maps transaction codes to posting rules, adds rules for new codes and banks, and fixes references lost in format conversion.
   - If it fails: Items fall to manual matching, and the month-end close slips.
   - Work areas: Cross-references and master data, Map build and maintenance
6. **Clear exceptions** (ERP, from corporate)
   - What happens: Accountants research unmatched items, post bank fees and interest, and request missing detail from the bank.
   - Rules that bite: Unreconciled items must be cleared or explained before period close.
   - EDI team work: Supplies original files and delivery evidence, and traces whether missing detail was never sent by the bank or was lost in mapping.
   - If it fails: Unexplained differences stay on the balance sheet, and the close takes longer.
   - Work areas: Reporting and documentation, Fix routing

### Variants
- **MT940 and MT942** (MT940, MT942): Corporates on Swift can keep receiving MT940 statements and MT942 intraday reports; Swift does not require corporates to move to camt, though each bank sets its own plans for retiring MT.
- **camt in North America** (camt.052, camt.053): Some North American banks offer camt.052 and camt.053 alongside BAI2. camt adds ISO bank transaction codes and End-to-End IDs, but needs XML parsing and produces larger files.
- **Multibank aggregation**: A corporate with many banks collects statements through Swift or a single provider, or pulls balances by API. APIs add real-time balances but lack common standards, so batch files remain the record.
- **Account analysis** (822, camt.086): Banks report service charges per account and service in a separate analysis statement, where offered as X12 822 or camt.086, which treasury uses to check fees.

### Penalties and disputes
- Missing or late statement: the cash position runs on stale balances, leading to overdraft charges or idle cash.
- Balance continuity break: the load is suspended until the bank resends the missing statement.
- Unmapped transaction code: the item loads but cannot match and falls to manual work.
- Unreconciled items at period end: audit findings against the cash reconciliation control.

### Watch for
- BAI2 is maintained by X9, but banks differ in type codes and continuation records. Check each bank's mapping separately.
- A camt.053 is not an MT940 in XML. It carries more detail, including batch contents and End-to-End IDs, and files are much larger.
- Intraday reports overlap the prior-day statement. Loading both into reconciliation without removing duplicates doubles transactions.
- Every newly opened account must be added to the expected statement list, or its missing statement is never noticed.
- The CBPR+ structured address deadlines target payment messages. Confirm with each bank whether its camt.052, camt.053 and camt.054 versions change with them.

### Europe and international
- camt.053 replaces MT940 and camt.052 replaces MT942, with camt.054 for batch detail and R-transactions. Banks run MT and camt in parallel during migration.
- camt carries ISO bank transaction codes (domain, family, subfamily) in place of BAI2 type codes.
- In Germany statements are fetched over EBICS with order types such as C52, C53, C54 and STA, or the equivalent BTF parameters under EBICS 3.0.
- Between banks, Swift has set a separate, later path for moving MT9xx statements to camt; corporates are not in scope and can keep MT940 and MT942.

## 8. Receivables and cash application
Outcome: Apply every incoming payment to the right invoices on the day the cash arrives.

Customers pay by ACH, wire, check or card, and the remittance that says which invoices are paid often travels separately from the money. Banks deliver payments and remittance through CTX addenda, X12 820 files, lockbox files (X12 823) and BAI2 or camt.054 reporting. Cash application matches each payment to its remittance and to open invoices. Unapplied cash and unmatched deductions build up when remittance is late, missing or carries references the corporate cannot match.

- Parties: Customer, Bank, Corporate
- Business owner: Accounts receivable and cash application
- Measures: Auto-match rate, Unapplied cash, Days sales outstanding (DSO), Payments received with remittance, Time to apply cash
- Documents, North America: Nacha CTX, 820, 823, BAI2
- Documents, Europe and international: REMADV, remt.001, camt.054, camt.053

### Steps
1. **Customer payment** (Nacha CTX, from customer)
   - What happens: The customer pays through its bank by ACH, ideally CTX carrying the full remittance as an 820 in the addenda.
   - Rules that bite: CTX carries up to 9,999 addenda, CCD+ carries one reference, and CCD carries none. The customer chooses the format unless the corporate's terms require CTX.
   - EDI team work: Agrees remittance requirements with major customers and confirms the corporate's bank delivers CTX addenda.
   - If it fails: Cash arrives without the information needed to apply it.
   - Work areas: Partner onboarding, Business programs
2. **Separate remittance** (820 / REMADV, from customer)
   - What happens: When the payment carries little or no detail, the customer sends the remittance separately: an EDI 820, an email, or a download from the customer's portal.
   - Rules that bite: A separate 820 needs its own trading partner setup, and remittance can arrive late or never. Payment and remittance must share a reference to be matched.
   - EDI team work: Onboards the 820 partner, maps it into cash application, links each remittance to its payment by reference and amount, and chases remittances missing after the payment posts.
   - If it fails: Payments sit unapplied while collectors chase customers for detail.
   - Work areas: Partner onboarding, Missing documents, Partner follow-up
3. **Lockbox file** (823, from bank)
   - What happens: For checks mailed to a bank lockbox, the bank images and keys checks and remittance stubs, deposits the funds and sends a lockbox file with deposit, batch, payment and remittance detail.
   - Rules that bite: Lockbox files arrive on the bank's schedule, often several per day, as X12 823 or in the bank's own layout. Data keyed from stubs is only as good as the stub, and unmatched items need the image.
   - EDI team work: Maps each bank's lockbox file into cash application, checks file totals against the deposit on the statement, and chases files missing after the deposit posts.
   - If it fails: Deposits post with no detail and the cash sits unapplied.
   - Work areas: Map build and maintenance, Missing documents, Monitoring
4. **Bank reporting** (BAI2 / camt.054, from bank)
   - What happens: The corporate's bank reports each credit in intraday and prior-day reporting and passes on CTX addenda as a reassembled 820, a report or a portal view, depending on the service.
   - Rules that bite: Nacha requires the bank to provide CCD and CTX addenda to a business receiver that asks for them. Remittance the bank drops or truncates cannot be recovered later.
   - EDI team work: Sets up remittance delivery with each bank, checks that addenda arrive complete, and reconciles credits on the statement with remittance files received.
   - If it fails: Payments are visible but cannot be tied to customers or invoices.
   - Work areas: Monitoring, Map build and maintenance
5. **Match and apply** (ERP, from corporate)
   - What happens: Cash application matches each payment to its remittance and to open invoices, then posts the cash.
   - Rules that bite: The payment must equal the invoices listed less deductions. Invoice numbers in the remittance must match the corporate's format, or the match fails.
   - EDI team work: Maps remittance fields to matching rules, normalizes reference formats, and maintains cross-references for customers who quote their own document numbers.
   - If it fails: Unapplied cash grows, DSO rises, and customers are dunned for invoices already paid.
   - Work areas: Cross-references and master data, Map build and maintenance
6. **Route deductions** (ERP, from corporate)
   - What happens: Short payments are split out by reason code and routed to deductions or collections; unidentified cash goes to an exceptions queue.
   - Rules that bite: Deduction dispute windows start when the customer takes the deduction. Unidentified cash must be applied or returned under the corporate's policy.
   - EDI team work: Maps customer reason codes to internal deduction codes and supplies remittance and payment records as dispute evidence.
   - If it fails: Deductions age past the dispute window and are written off.
   - Work areas: Chargebacks and deductions management, Reporting and documentation

### Variants
- **Integrated receivables** (823): Many banks combine check, ACH, wire and card remittance into one consolidated receivables file, often in the lockbox layout, so cash application reads a single feed.
- **CCD+ and CCD** (Nacha CCD): CCD+ carries one reference, usually an invoice number, which works for single-invoice payments. CCD carries none and always needs a separate remittance.
- **Wires**: Wire remittance is usually a short reference, so most wires need a separate remittance or manual research.
- **ISO 20022 remittance** (remt.001, remt.002, camt.054): remt.001 carries the remittance separately from the payment, and remt.002 tells the creditor where to find it. In one model the creditor's bank reports the linked remittance in camt.053 or camt.054.

### Penalties and disputes
- Unapplied cash: customers are dunned or put on credit hold for invoices already paid.
- Deductions not disputed within the customer's window: written off as lost revenue.
- Remittance never received: the payment is applied on account and researched by hand, delaying the close.
- Remittance delivery not set up with a bank or customer: 820s never arrive, or CTX addenda never reach cash application.

### Watch for
- Payment and remittance are separate events. Track remittance received against payments posted, not only files received.
- Customers often remit their own document numbers, such as a voucher or check number, rather than the corporate's invoice number.
- A CTX entry carries the 820 split across its addenda records. It must be reassembled before an EDI translator can read it.
- Lockbox files often arrive after the deposit posts, sometimes the next morning. The cash is in the account before the detail is.
- One customer payment can cover hundreds of invoices and several deductions.

### Europe and international
- SEPA credit transfers carry 140 characters of remittance, so larger remittances travel separately as REMADV, remt.001, email or portal.
- The creditor's bank reports credits in camt.054 and camt.053 with the End-to-End ID the payer sent, which helps matching when the payer fills it in.
- A structured creditor reference (ISO 11649 RF reference) in the payment lets the creditor match without free text.
- Check lockbox is mainly a North American service. Most European receivables arrive as credit transfers or direct debits.

## 9. Direct debit collections
Outcome: Collect recurring amounts on the due date with valid authorizations and few returns.

The creditor pulls funds from the debtor's account under an authorization or mandate the debtor gave. In North America this runs as Nacha PPD debits for consumers and CCD debits for businesses; in Europe as SEPA Core and B2B (pain.008 from creditor to bank, pacs.003 between banks) or Bacs Direct Debit. Rejects come back in pain.002 and returns, refunds and other R-transactions as pacs.004 or Nacha returns. Authorization evidence, account data quality and return windows decide whether collected cash stays collected.

- Parties: Creditor, Creditor bank, Debtor bank
- Business owner: Accounts receivable and treasury operations
- Measures: Return rate by reason, Unauthorized return rate, Collections on due date, Mandate and authorization errors, Days sales outstanding (DSO)
- Documents, North America: Nacha PPD, Nacha CCD, Nacha return entries, Nacha COR, BAI2
- Documents, Europe and international: pain.008, pain.002, pacs.003, pacs.004, pacs.007, camt.054, AUDDIS, ARUDD, ADDACS

### Steps
1. **Mandate capture** (ERP, from creditor)
   - What happens: The creditor obtains the debtor's authorization or mandate and bank details and records them against the customer account.
   - Rules that bite: The creditor carries the burden of proving authorization. SEPA mandates need a unique mandate reference and signature date; internet-initiated US consumer debits need account validation on first use.
   - EDI team work: Maps mandate records and bank details into the billing system, and validates account, routing and IBAN formats before the first collection.
   - If it fails: Debits without provable authorization are returned as unauthorized, and the cash is lost.
   - Work areas: Cross-references and master data, Partner onboarding
2. **Collection file** (Nacha CCD, Nacha PPD / pain.008, from creditor)
   - What happens: The creditor builds the collection file with amounts, account details and the due or effective entry date, and sends it to its bank before cutoff.
   - Rules that bite: pain.008 carries the creditor identifier, mandate reference, signature date and sequence type per collection, and Core and B2B go in separate files. Business debits use CCD and consumer debits PPD, and the code sets the debtor's return rights.
   - EDI team work: Builds and validates the file, confirms the bank received it, and reconciles file totals to the billing run.
   - If it fails: Collections arrive late or not at all, and the cash forecast misses.
   - Work areas: Map build and maintenance, Connections and protocols, Monitoring
3. **File status** (pain.002, from creditor bank)
   - What happens: The creditor bank validates the file and reports rejected collections before they are sent to the clearing, with a reason code.
   - Rules that bite: Rejects at this stage cost no settlement, but the collection misses its due date unless corrected and resent within the scheme's presentation deadline.
   - EDI team work: Matches status reports to collection files, routes rejects by reason to billing or master data, and resends only corrected items.
   - If it fails: Rejected collections are counted as collected until the statement shows otherwise.
   - Work areas: Rejections, Missing documents
4. **Interbank collection** (pacs.003, from creditor bank)
   - What happens: The creditor bank sends the collections to the clearing as pacs.003, or as ACH debit entries, for settlement on the due date.
   - Rules that bite: SEPA Core and B2B collections may be presented up to 14 calendar days before the due date and must reach the debtor bank at least one interbank business day before it. Nacha debits settle on the effective entry date, or the same day for Same Day ACH.
   - EDI team work: On the bank side, maps pain.008 into pacs.003 and checks that mandate and creditor data pass through intact.
   - If it fails: The collection reaches the debtor bank late and is rejected or settles late.
   - Work areas: Map build and maintenance, Monitoring
5. **Returns and refunds** (Nacha return entry / pacs.004, from debtor bank)
   - What happens: The debtor bank rejects, returns or refunds collections it cannot or should not pay, with a reason code, reversing the credit already booked.
   - Rules that bite: SEPA Core returns are allowed up to five interbank business days after settlement and B2B up to two; Core refunds up to eight weeks for authorized and 13 months for unauthorized debits. Nacha R01, R02 and R29 returns arrive within two banking days; consumer unauthorized returns such as R07 and R10 up to 60 calendar days.
   - EDI team work: Parses returns and refunds, matches each to the original collection by mandate reference or trace number, and reopens the receivable with the reason code.
   - If it fails: Customers appear paid when they are not, and return rates rise unseen.
   - Work areas: Rejections, Fix routing, Monitoring
6. **Credit and return reporting** (BAI2 / camt.054, from creditor bank)
   - What happens: The creditor bank credits the collection, usually as one booking per file or batch, and reports returns as separate debits.
   - Rules that bite: The batch credit is not final: returns and refunds can reverse individual items afterwards. Item detail is needed to clear receivables per customer.
   - EDI team work: Matches batch credits to the files sent, supplies item detail to receivables, and reports returns by reason and customer.
   - If it fails: Receivables are cleared against cash that later comes back.
   - Work areas: Monitoring, Reporting and documentation
7. **Re-present or pursue** (ERP, from creditor)
   - What happens: Collections decides by reason code: re-present insufficient funds items, correct account data from NOCs, or contact the customer.
   - Rules that bite: A returned Nacha debit for insufficient funds may be reinitiated at most twice within 180 days of settlement, as a RETRY PYMT entry for the same amount. Unauthorized returns need a new authorization before any new debit.
   - EDI team work: Builds retry entries to the reinitiation rules, applies NOC corrections to master data, and blocks automatic retries on codes that forbid them.
   - If it fails: Improper retries break the Nacha rules, invite unauthorized disputes and raise the creditor's risk standing with its bank.
   - Work areas: Rejections, Cross-references and master data, Governance and change control

### Variants
- **SEPA B2B** (pain.008): Business debtors only. The debtor confirms the mandate to its bank, which checks it before debiting. There is no refund of authorized debits, and the return window is two interbank business days against five for Core.
- **Creditor reversal** (pacs.007): A creditor that collected in error asks its bank to reverse the collection after settlement, sent between banks as pacs.007.
- **Bacs Direct Debit** (Standard 18, AUDDIS, ARUDD, ADDACS, DDIC): UK collections in Standard 18 files on a three-day cycle. Instructions are lodged through AUDDIS, unpaid debits reported in ARUDD and amendments in ADDACS. The Direct Debit Guarantee requires advance notice and gives the payer an immediate refund for errors, reclaimed from the creditor through DDIC.
- **Internet-initiated debits** (Nacha WEB): Consumer debits authorized online use the WEB code and need account validation on first use: a prenote, micro-entries, a validation service or an API.

### Penalties and disputes
- Unauthorized returns (R05, R07, R10, R11, R29, R51) above Nacha's 0.5 percent threshold: the creditor must bring the rate down, and Nacha can start rules enforcement that can end in fines.
- Administrative returns (R02, R03, R04) above 3 percent or all returns above 15 percent: an inquiry into the creditor's practices.
- SEPA Core refunds: authorized debits refunded on request within eight weeks and unauthorized debits within 13 months, charged back to the creditor.
- Bacs indemnity claims (DDIC): the debtor's bank reclaims the amount from the creditor under the Direct Debit Guarantee.
- Improper reinitiation: a Nacha rules violation pursued through the creditor's bank.

### Watch for
- A settled batch credit is not final. Consumer unauthorized returns can arrive up to 60 days later, and SEPA Core refunds up to 13 months.
- A consumer debited under a corporate code can still return the debit as R05 within the consumer window.
- NOCs on debits must be applied within six banking days or before the next debit, whichever is later.
- Retries must carry RETRY PYMT in the company entry description. A quietly resubmitted debit counts as improper reinitiation.
- Mandate data in pain.008 must match what the debtor bank holds for B2B. A changed mandate reference without the amendment fields is rejected as no mandate.

### Europe and international
- SEPA collections go as pain.008 with a unique mandate reference, the creditor identifier and the mandate signature date. Core and B2B are separate schemes sent in separate files, for example EBICS order types CDD and CDB in Germany. Mandates lapse 36 months after the last collection.
- Pre-notify the debtor 14 calendar days before the debit unless agreed otherwise.
- R-transactions (reject, refusal, return, refund, reversal) carry ISO reason codes such as AC04 closed account, AM04 insufficient funds and MD01 no mandate, reported to the creditor in pain.002 before settlement or camt.054 after it.
- UK Bacs Direct Debit lodges, amends and cancels instructions through AUDDIS and reports unpaid debits through ARUDD, amendments through ADDACS and indemnity claims through DDIC.

## 10. Supplier payment and remittance
Outcome: Pay suppliers on terms, to the right account, with remittance detail the supplier can apply automatically.

The buyer's flow from approved invoices to a bank payment and the remittance that tells the supplier what was paid. Remittance can ride with the payment (structured remittance in pain.001, an 820 in CTX addenda) or travel separately as an 820, REMADV or remt.001. The supplier can apply cash only when both arrive and agree. Vendor bank detail changes are a common fraud entry point in this flow.

- Parties: Buyer, Bank, Supplier
- Business owner: Accounts payable and treasury
- Measures: On-time payment to terms, Electronic payment share, Payment reject and return rate, Supplier remittance inquiries, Early payment discount capture
- Documents, North America: 820, 997, 824, Nacha CTX, BAI2
- Documents, Europe and international: pain.001, pain.002, camt.054, camt.053, REMADV, remt.001

### Steps
1. **Vendor bank details** (ERP, from buyer)
   - What happens: Accounts payable records the supplier's bank account and remittance preference, and verifies any change before the next payment run.
   - Rules that bite: Change requests by email or letter are a common route for vendor impersonation fraud; confirm by calling a known contact. Since 2026 Nacha requires non-consumer originators to run risk-based checks for false pretenses entries.
   - EDI team work: Maintains each supplier's payment method, remittance channel and EDI identifiers, validates new accounts by prenote or a validation service, and flags bank detail changes made close to a payment run.
   - If it fails: Payment goes to a fraudster's account, and the supplier is still owed the money.
   - Work areas: Cross-references and master data, Partner onboarding, Governance and change control
2. **Payment run** (ERP, from buyer)
   - What happens: Accounts payable selects invoices due under terms, nets open credit memos, groups payments by supplier and method, and releases the run for approval.
   - Rules that bite: Payment date decides whether terms and early payment discounts are met. The person who changes vendor bank details should not also release payments.
   - EDI team work: Checks that every selected supplier has a valid payment method and remittance channel, and that credit memos carry references the supplier can match.
   - If it fails: Suppliers are paid late or twice, and discounts are lost.
   - Work areas: Monitoring, Cross-references and master data
3. **Payment with remittance** (820, Nacha CTX / pain.001, from buyer)
   - What happens: The buyer sends the payment file to its bank before cutoff, with each payment and its invoice-level remittance.
   - Rules that bite: pain.001 carries structured remittance per invoice (document number, date, amount, discount, credit note), but SEPA allows 140 characters and banks may drop structured detail they cannot pass on. A CTX entry carries an 820 in up to 9,999 addenda; CCD allows one.
   - EDI team work: Maps the payment run to each bank's format, places remittance in structured fields where the bank supports it, validates totals before sending, and confirms the file reached the bank before cutoff.
   - If it fails: The run misses cutoff and every supplier in it is paid a day late, or remittance is lost on the way.
   - Work areas: Map build and maintenance, Connections and protocols, Monitoring
4. **Bank status** (997, 824 / pain.002, from bank)
   - What happens: The bank confirms receipt and reports each payment as accepted or rejected, with a reason for each rejection.
   - Rules that bite: A 997 only confirms the 820 was readable; payment-level accepts and rejects come in an 824 or a bank report. Rejected payments are resent as new instructions, never by resending the whole file.
   - EDI team work: Monitors status for every file, alerts treasury when a status is missing or a rejection arrives, and routes reject reasons to accounts payable or master data.
   - If it fails: Rejected payments go unnoticed until the supplier calls.
   - Work areas: Rejections, Missing documents, Fix routing
5. **Remittance advice** (820 / REMADV, from buyer)
   - What happens: Where remittance does not travel with the payment, the buyer sends it directly to the supplier as an EDI 820, REMADV, remt.001 or email on the payment date.
   - Rules that bite: The advice must carry the same payment reference and amount as the bank payment, with credit memos as negative lines. An 820 sent as remittance only uses BPR01 code I.
   - EDI team work: Generates advices from the same payment run as the bank file, sends them to each supplier's preferred channel, and reports advices that failed delivery.
   - If it fails: The supplier holds cash it cannot apply and keeps chasing invoices already paid.
   - Work areas: Partner onboarding, Map build and maintenance, Missing documents
6. **Credit and remittance** (Nacha CTX / camt.054, from bank)
   - What happens: The supplier's bank credits the account on settlement date and passes on any remittance that came with the payment, as an 820 file, camt.054, a report or a portal view.
   - Rules that bite: The supplier sees CTX addenda only if its bank service delivers them. Remittance that arrives late, or never, leaves cash unapplied.
   - EDI team work: On the supplier side, receives the 820 or camt.054 from the bank, translates it for cash application, and chases buyers whose remittance is missing.
   - If it fails: Cash is visible but cannot be applied.
   - Work areas: Missing documents, Partner follow-up, Map build and maintenance
7. **Cash application** (ERP, from supplier)
   - What happens: The supplier matches the payment to open invoices using the remittance, and records short payments for follow-up.
   - Rules that bite: Matching depends on invoice numbers appearing exactly as the supplier issued them. Netted credit memos and short payments without a reason are common causes of unmatched cash.
   - EDI team work: Maintains the mapping from remittance references to open items, and reports unmatched payments by buyer so the cause is fixed at source.
   - If it fails: Cash sits unapplied and collections chase invoices that are already paid.
   - Work areas: Cross-references and master data, Reporting and documentation

### Variants
- **Virtual card** (Portal): The buyer pays each invoice with a single-use card number. Suppliers pay card acceptance fees and often resist; a straight-through variant pushes funds to the supplier's account with remittance.
- **Check** (Positive pay issue file): The buyer prints checks and sends an issued check file for positive pay. See Sanctions screening and fraud controls.
- **Early payment programs** (Portal): With dynamic discounting the buyer pays early from its own cash in return for a discount. With supply chain finance a funder pays early and the buyer repays the funder at maturity, priced on the buyer's credit.
- **Cross-border supplier payment** (pain.001, MT101): The buyer sends the payment as pain.001 or MT101 with a UETR for tracking. Remittance space is limited and can be truncated along the chain, so invoice detail usually travels separately.

### Penalties and disputes
- Bank rejects: a file or payment fails bank validation or arrives after cutoff, and the payment goes on a later run and reaches the supplier late.
- ACH returns: closed, missing, invalid or frozen accounts (R02, R03, R04, R16) come back within two banking days. The buyer corrects vendor master data and pays again.
- Late payment: payments outside terms forfeit early payment discounts and, in the EU, give the supplier a statutory right to late payment interest.
- Fraud: a credit sent to an impersonator's account is an authorized payment. Recovery depends on a recall request and the receiving bank's cooperation.

### Watch for
- An 820 sent to a bank as a payment order and an 820 sent to a supplier as remittance are different implementations. BPR01 tells them apart: C for payment with remittance, X when the bank may split payment and remittance, I for remittance only.
- CTX only helps if the supplier's bank delivers the addenda. Ask before switching a supplier from CCD to CTX.
- A Nacha file gets no 997. Each bank confirms receipt through its own report or portal, so monitoring needs a check per bank.
- Credit memos netted in a payment must appear in the remittance as negative lines with their own numbers, or the supplier cannot balance the payment.

### Europe and international
- SEPA credit transfers go to the bank as pain.001 and come back with pain.002; the supplier sees the credit in camt.054 or camt.053.
- SEPA remittance is limited to 140 characters, so multi-invoice detail travels separately as REMADV, remt.001 or email.
- Verification of Payee checks the supplier's name against the IBAN before each euro credit transfer. Businesses may opt out for bulk files, and bulk checking between customer and bank is not yet standardized.
- The EU Late Payment Directive gives suppliers a statutory right to interest on late commercial payments.

## 11. Investigations and payment tracking
Outcome: Locate every queried payment quickly, and recover or correct wrong payments while the funds can still be stopped.

When a payment is late, wrong or disputed, the corporate asks its bank, and the bank works the case with the other banks in the chain by UETR. Cancellations and recalls travel as camt.056 with answers in camt.029 (MT192 and MT196 where banks still use MT); claims of non-receipt and other queries run as camt.027, camt.110 and camt.111, or free-format MT199. A recall is a request: once a credit settles, funds come back only if the beneficiary's bank and the beneficiary agree. The original references decide whether any bank can act.

- Parties: Corporate, Bank, Counterparty bank
- Business owner: Treasury operations and bank payment investigations
- Measures: Payments tracked end to end, Investigation resolution time, Recall recovery rate, Open cases by age, Cases handled in free format
- Documents, North America: camt.055, camt.056, camt.029, camt.027, pacs.004, MT199, BAI2
- Documents, Europe and international: camt.055, camt.056, camt.029, camt.027, camt.110, camt.111, MT192, MT196, MT199, pacs.004, camt.054

### Steps
1. **Track by UETR** (gpi tracker, from bank)
   - What happens: The bank looks up the payment in the gpi tracker by UETR and sees each bank's status, charges and the credit confirmation, or where the payment stopped.
   - Rules that bite: Tracking works only if every bank kept the UETR. Where the bank offers it, corporates see the same status through status reports, API or portal.
   - EDI team work: Stores the UETR with each payment, links it to the ERP payment document, and checks status before anyone opens a case or resends.
   - If it fails: Cases open on payments that already arrived, or a stuck payment is resent and paid twice.
   - Work areas: Monitoring, Cross-references and master data
2. **Corporate request** (camt.055, from corporate)
   - What happens: The corporate asks its bank to cancel a payment sent in error, or to investigate a payment the beneficiary says it has not received.
   - Rules that bite: A cancellation request must quote the original message ID and End-to-End ID. Banks that do not accept camt.055 take requests through their portal. A payment still at the bank can be stopped; once sent, only a recall is possible.
   - EDI team work: Builds the request from the original payment record, sends it on the same channel as the payment, and opens a case to track the answer.
   - If it fails: The wrong payment settles and recovery depends on the beneficiary.
   - Work areas: Map build and maintenance, Support desk and on-call
3. **Query the chain** (camt.027, camt.110, MT199, from bank)
   - What happens: For a claim of non-receipt or another question, the bank sends a query to the next bank by UETR, asking where the funds went or for missing information.
   - Rules that bite: Swift is moving investigations to camt.110 and camt.111 through its case management service, with MT n95 and n96 to be removed and MT n99 no longer used for investigations, on a timeline currently set for November 2027. Free-format MT199 queries cannot be processed automatically.
   - EDI team work: Maps queries from the bank's case system into the formats each counterparty accepts, and links every message to its case and UETR.
   - If it fails: Queries go unanswered or are answered out of context, and the case restarts.
   - Work areas: Map build and maintenance, Document and version changes
4. **Recall between banks** (MT192 / camt.056, from bank)
   - What happens: The bank forwards the cancellation or recall to the next bank with the original UETR, and the beneficiary's bank asks the beneficiary where consent is needed.
   - Rules that bite: Swift plans to require its Stop and Recall service and ISO-only camt.056 and camt.029 for all payment cancellations from November 2027; until then MT192 and MT292 still run. Response times depend on the scheme: SEPA gives the beneficiary bank 15 banking days.
   - EDI team work: Sends the recall with the original references, and tracks the case against the scheme's response window.
   - If it fails: The case stalls at the beneficiary's bank while the funds move on.
   - Work areas: Partner follow-up, Monitoring, Document and version changes
5. **Counterparty answer** (MT196 / camt.029, from counterparty bank)
   - What happens: The counterparty bank answers with the outcome: cancelled (CNCL), pending (PDCR) or rejected (RJCR) with a reason, or the information requested.
   - Rules that bite: A pending answer keeps the case open. A rejection ends the bank route, and further recovery becomes a direct claim against the beneficiary.
   - EDI team work: Maps resolution codes into the case record, closes or escalates each case, and reports open cases by age and counterparty.
   - If it fails: Cases close without action, or stay open long after the answer arrived.
   - Work areas: Rejections, Reporting and documentation
6. **Funds returned** (pacs.004, from counterparty bank)
   - What happens: Recovered funds come back between banks as a pacs.004 referencing the original payment.
   - Rules that bite: The returned amount can be lower than the original where banks deduct charges; SEPA lets the beneficiary's bank charge a fee for a positive recall answer.
   - EDI team work: Matches the pacs.004 to the original payment and the open case by UETR, and credits the customer with the original references.
   - If it fails: Returned funds sit in suspense and the customer is never told.
   - Work areas: Cross-references and master data, Monitoring
7. **Report and close** (BAI2 / camt.054, from bank)
   - What happens: The bank reports the returned funds to the corporate, which matches them to the original payment, posts the reversal and makes the correct payment.
   - Rules that bite: The return must be matched to the original payment, not posted as unidentified cash. Every open case needs an answer before it is closed.
   - EDI team work: Matches the return by reference, posts the reversal in the ERP, triggers the corrected payment, and closes the case.
   - If it fails: Returned funds sit as unidentified cash and the correct payment is never made.
   - Work areas: Cross-references and master data, Reporting and documentation

### Variants
- **SEPA recall** (camt.056, camt.029, pacs.004): For SCT, the bank recalls duplicates or technical errors within 10 banking days and fraud within 13 months. The corporate's own request for a wrong amount or wrong IBAN goes as a request for recall by the originator, within 13 months. The beneficiary's bank answers within 15 banking days.
- **ACH reversal** (Nacha reversal): The originator sends a reversing entry within five banking days of settlement for a duplicate, wrong receiver, wrong amount or wrong date. Otherwise the bank can ask the receiving bank to return the entry (R06), which that bank may refuse.
- **Fedwire recall** (camt.056, camt.029, pacs.004): US wires on Fedwire carry the same ISO 20022 recall flow between banks since July 2025.
- **Instant payment recall** (camt.056, pacs.004): Instant payments are final. Recovery runs as a recall or return request the payee must agree to.

### Penalties and disputes
- Requests without the original references can be rejected by the bank.
- Recall answered RJCR: the bank route ends, and recovery becomes a direct claim on the beneficiary.
- SEPA lets the beneficiary's bank charge a fee for a positive recall answer, taken from the returned amount.
- ACH reversals sent after five banking days, or for reasons the rules do not allow, are not permitted.
- SEPA recalls for duplicates or technical errors after 10 banking days are refused; only the fraud route or a direct claim remains.

### Watch for
- Never resend a payment that shows no status. Trace it first, or the beneficiary may be paid twice.
- Keep the UETR. It is the one reference every bank in a cross-border chain shares.
- camt.055 goes from corporate to bank; camt.056 goes between banks. Corporates normally do not send camt.056.
- Free-format MT199 answers cannot be matched automatically. Expect manual handling until counterparties move to camt.110 and camt.111.
- Raise fraud recalls the day the fraud is found. Funds the beneficiary has moved on are hard to recover.

### Europe and international
- SEPA recall rules set fixed windows: 10 banking days for duplicates and technical errors, 13 months for fraud and for the originator's own recall requests, 15 banking days for the answer.
- Cancellation and investigation messages are moving to ISO 20022 more slowly than payment instructions: MT192, MT196 and MT199 still run alongside camt.056, camt.029, camt.110 and camt.111. Swift revised its 2026 timeline in August 2026, so confirm current dates.
- Some European banks accept camt.055 from corporates and answer with pain.002 and camt.029.
- Recovered euro payments appear in camt.054 or camt.053 as a return linked to the original payment.

## 12. Trade finance and FX confirmations
Outcome: Issue trade instruments on time with the intended terms, and confirm every FX deal with the bank before value date.

Two request-and-confirm flows between corporates and their banks. For trade, the corporate applies for letters of credit and guarantees, and the bank issues them to the beneficiary's bank: MT700 and MT707 for documentary credits, MT760 for guarantees and standbys, carried between corporate and bank inside MT798 where both use Swift. For FX, each bank confirmation (MT300, or ISO 20022 fxtr messages where a matching service uses them) must match the deal in the treasury system before value date. Portals and email still carry much of both, so electronic and manual flows run side by side.

- Parties: Corporate, Bank
- Business owner: Treasury and trade operations
- Measures: Confirmations matched same day, Unmatched confirmations by age, Settlement failures, Trade instrument turnaround time, Discrepant document presentations
- Documents, North America: MT798, MT700, MT707, MT760, MT300, BAI2
- Documents, Europe and international: MT798, MT700, MT707, MT760, MT767, MT300, fxtr.014, camt.053

### Steps
1. **LC application** (MT798, from corporate)
   - What happens: The importer applies for a documentary credit in an MT798 envelope (index 770) carrying MT700 fields, or in the bank's trade portal.
   - Rules that bite: MT798 needs Swift connectivity for the corporate and a bank that supports the corporate-to-bank trade guidelines. Terms follow UCP 600, and the goods, documents and conditions fields have length limits, with MT701 carrying overflow.
   - EDI team work: Maps applications from the trade or ERP system into MT798, and links each to the purchase order and the bank's reference.
   - If it fails: The credit is issued late or with wrong terms, and the shipment waits.
   - Work areas: Map build and maintenance, Partner onboarding
2. **LC issuance** (MT700, from bank)
   - What happens: The issuing bank issues the credit to the advising bank as MT700 and notifies the applicant of issuance (MT798 index 771).
   - Rules that bite: The issuing bank is irrevocably bound from issuance. Terms the applicant did not ask for, or vague document requirements, become discrepancies later.
   - EDI team work: Loads the notification of issuance and the issued terms, and compares them with the application.
   - If it fails: The corporate learns of changed terms only when documents are refused.
   - Work areas: Monitoring, Missing documents
3. **LC amendment** (MT707, from bank)
   - What happens: Changes to amount, dates or terms are requested by the applicant (MT798 index 772), sent by the issuing bank as MT707, and advised to the beneficiary.
   - Rules that bite: An amendment binds the beneficiary only once it accepts it, and partial acceptance is not allowed; until then the original terms stand.
   - EDI team work: Links each amendment to the original credit by reference, so the credit has one complete history.
   - If it fails: Documents are prepared against the wrong version of the credit.
   - Work areas: Cross-references and master data, Fix routing
4. **Guarantee issuance** (MT760, from bank)
   - What happens: Guarantees and standby letters of credit are applied for in MT798 and issued by the bank as MT760 to the beneficiary's bank; amendments travel as MT767.
   - Rules that bite: Since the November 2021 standards release MT760 carries separate sequences for the guarantee and any local undertaking. Guarantees follow URDG 758 and standbys ISP98 where the text incorporates them.
   - EDI team work: Maps guarantee requests and the bank's wording templates, and tracks expiry and claim dates per instrument.
   - If it fails: A guarantee is issued late, and the corporate misses a tender or contract deadline.
   - Work areas: Map build and maintenance, Document and version changes
5. **FX confirmation** (MT300, fxtr.014, from bank)
   - What happens: The bank sends its confirmation with trade and value dates, amounts, rate and both sides' settlement instructions.
   - Rules that bite: Corporates on Swift can receive MT300 directly; others receive confirmations through a matching service, portal or email. Amendments and cancellations arrive as new messages (MT300 field 22A AMND or CANC).
   - EDI team work: Receives confirmations over each channel, loads them into the treasury system, and chases banks whose confirmations are missing by end of day.
   - If it fails: Unconfirmed deals stay open and errors surface only at settlement.
   - Work areas: Missing documents, Connections and protocols, Partner follow-up
6. **Match and resolve** (ERP, from corporate)
   - What happens: The treasury system or a matching service compares each confirmation to the deal record; treasury raises mismatches with the bank, which amends or cancels.
   - Rules that bite: Trade date, value date, amounts, rate and settlement instructions must agree, and breaks must be resolved before value date. A changed settlement instruction is also a fraud signal and needs a callback to a known contact.
   - EDI team work: Maintains matching rules and each bank's field formats, links amendments to the original deal, and reports unmatched confirmations by bank and age.
   - If it fails: A wrong rate or value date settles unnoticed, or funds settle to the wrong account.
   - Work areas: Monitoring, Fix routing, Reporting and documentation
7. **Value date settlement** (BAI2 / camt.053, from bank)
   - What happens: On value date the bank debits the corporate in one currency and pays the other currency as instructed; both legs appear on statements.
   - Rules that bite: Each leg must reconcile to the deal by amount and value date. A missing leg is a settlement failure to raise with the bank the same day.
   - EDI team work: Matches statement entries to deal legs and reports unreconciled legs to treasury operations.
   - If it fails: Cash positions are wrong, and overdrafts or failed payments follow.
   - Work areas: Reporting and documentation, Monitoring

### Variants
- **Export letter of credit** (MT700, MT734, MT798): The exporter's bank advises the credit as received in MT700, and the exporter presents documents. Each bank examining them has up to five banking days under UCP 600; an issuing bank that refuses sends MT734 to the presenting bank, and the exporter's bank reports discrepancies through MT798.
- **ISO 20022 FX messages** (fxtr.014, fxtr.017): Some matching services use fxtr.014 for the trade instruction and fxtr.017 for status and details; MT300 remains the common bank-to-corporate confirmation.
- **Matching service** (MT300): A third-party service receives bank confirmations and matches them against the corporate's deals, so treasury works only the exceptions.
- **Portal and email** (Portal): Many corporates still apply for trade instruments and confirm FX in each bank's portal or by email. The steps are the same; matching is manual.

### Penalties and disputes
- Late FX confirmation: under EMIR, non-financial counterparties must confirm OTC derivatives such as forwards and swaps by the end of the next business day above the clearing threshold, or the second business day below it.
- Unmatched settlement instructions: the payment goes to the wrong account, or fails and the corporate bears overdraft and late settlement costs.
- Discrepant trade documents: the bank refuses them, and payment waits for a waiver or corrected documents.
- Late guarantee: the corporate is excluded from a tender or breaches contract terms.

### Watch for
- The MT300 is the bank's view. Match it against your own deal record, never against the dealer's chat or email.
- Confirmation channels vary by bank. Expect Swift, matching services, portal and email, and run one exception queue for all of them.
- MT798 index numbers and field rules follow the version of the corporate-to-bank guidelines each bank supports. Confirm the version before building maps.
- Amendments and cancellations arrive as new messages. Link them to the original by reference, or one deal or credit shows as two.

### Europe and international
- The messages are global: MT300, MT700, MT760 and MT798 sit outside the payments migration that ended MT coexistence for cross-border payment instructions in November 2025.
- EMIR requires timely confirmation of OTC derivatives, which covers FX forwards and swaps unless a forward qualifies for the means-of-payment exclusion; spot deals are not covered.
- UCP 600, URDG 758 and ISP98 are ICC and industry rules used worldwide; local law can still override guarantee terms in some countries.
- Swift's trade standards changes were decoupled from the 2026 payments deferral and are now set for 12 June 2027.

## 13. Fund order processing
Outcome: Every fund order reaches the transfer agent before the dealing cutoff, is priced at the right NAV, and is confirmed and settled on the settlement date.

Distributors, platforms and wealth managers place subscription, redemption and switch orders with a fund's transfer agent, which prices them at the next net asset value (NAV) and confirms units, price and cash. In Europe the orders travel mainly as ISO 20022 setr messages, with ISO 15022 MT502 and MT515 still used on some links. The dealing cutoff, correct fund and account identifiers, and cash arriving on the settlement date decide whether an order executes as intended.

- Parties: Fund distributor, Transfer agent
- Business owner: Fund operations at distributors and transfer agents
- Measures: Orders received before cutoff, Orders rejected by the transfer agent, Confirmations received by the next business day, Late cash settlements, Unreconciled positions
- Documents, North America: Clearing utility order files, MT502, MT509, MT515
- Documents, Europe and international: acmt.001, acmt.002, setr.010, setr.004, setr.013, setr.016, setr.012, setr.006, setr.015, MT502, MT509, MT515, semt.002

### Steps
1. **Account opening** (acmt.001, from fund distributor)
   - What happens: The distributor opens an account with the transfer agent, in its own nominee name or designated per investor, and the transfer agent confirms the account details (acmt.002).
   - Rules that bite: Orders cannot be accepted until the account exists and the transfer agent's anti-money laundering checks are complete, or it relies on the distributor's under an agreement.
   - EDI team work: Maps account opening instructions and confirmations, and holds the cross-reference of distributor accounts to transfer agent account numbers per fund range.
   - If it fails: Orders are rejected for an unknown account, or booked to the wrong one.
   - Work areas: Partner onboarding, Cross-references and master data
2. **Subscribe or redeem** (setr.010, setr.004 / MT502, from fund distributor)
   - What happens: The distributor sends subscription orders (setr.010) and redemption orders (setr.004) per fund, by amount or by units, identified by ISIN and account.
   - Rules that bite: Orders received before the fund's dealing cutoff are priced at the next NAV; later orders roll to the next dealing day. Each order needs a unique reference, and amount or unit orders must be ones the fund accepts.
   - EDI team work: Aggregates orders from the distributor's platform, validates fund identifiers, accounts and cutoffs before sending, and confirms every order was delivered before the cutoff.
   - If it fails: Orders miss the cutoff and investors get a later price.
   - Work areas: Monitoring, Map build and maintenance, Cross-references and master data
3. **Switch order** (setr.013, from fund distributor)
   - What happens: A switch moves an investor between funds of the same range in one order: a redemption leg and one or more subscription legs.
   - Rules that bite: Legs may price on different days when the funds have different cutoffs or settlement cycles. Whether the subscription waits for the redemption proceeds is set by the transfer agent's rules for the range.
   - EDI team work: Maps switch orders with all legs under one reference, and checks the switch confirmation (setr.015) covers every leg.
   - If it fails: One leg executes and the other does not, leaving the investor out of the market.
   - Work areas: Cross-references and master data, Rejections
4. **Order status** (setr.016 / MT509, from transfer agent)
   - What happens: The transfer agent reports each order as received, accepted, rejected with a reason, or pending, and reports the status of cancellation requests (setr.017).
   - Rules that bite: A rejected order is not priced; it must be corrected and resent before the next cutoff. Cancellation requests (setr.005, setr.011, setr.014) are usually accepted only before the dealing cutoff.
   - EDI team work: Matches every order to its status, chases missing statuses before cutoff, and routes rejects by reason to operations.
   - If it fails: A rejected order is found only when no confirmation arrives, and the dealing day is lost.
   - Work areas: Missing documents, Rejections, Fix routing
5. **Order confirmation** (setr.012, setr.006 / MT515, from transfer agent)
   - What happens: After the NAV is struck, the transfer agent confirms each order with the price, units, gross and net amounts, charges and the settlement date.
   - Rules that bite: Confirmations follow the NAV calculation, often on the next business day. Units, price and amount must agree with the published NAV, and amendments or cancellations of confirmations travel as separate setr messages.
   - EDI team work: Loads confirmations into the distributor's books and investor accounts, compares price to the published NAV, and links amended confirmations to the original order.
   - If it fails: Investor holdings and cash are wrong, and statements show trades that never happened as confirmed.
   - Work areas: Monitoring, Reporting and documentation
6. **Cash settlement** (pacs.008, from fund distributor)
   - What happens: The distributor pays subscription money to the fund's collection account, and the transfer agent pays redemption proceeds to the distributor, on the settlement date.
   - Rules that bite: The settlement cycle is set in the fund prospectus and varies by fund. Cash that arrives late, or without the order reference, can delay the units or lead to interest claims under the transfer agent's terms.
   - EDI team work: Generates payments carrying the order or confirmation reference, matches redemption proceeds to confirmations, and reports unsettled items by fund.
   - If it fails: Subscriptions are cancelled or charged interest, and redemption cash sits unapplied.
   - Work areas: Cross-references and master data, Monitoring
7. **Position reconciliation** (semt.002, from transfer agent)
   - What happens: The transfer agent sends statements of holdings per account, and the distributor reconciles units by fund and investor against its own records.
   - Rules that bite: Statement frequency is agreed per relationship. Breaks usually trace to an unconfirmed order, a fund merger or share class change, or a reinvested distribution.
   - EDI team work: Loads statements, reports breaks by fund and account, and traces each break to its order and confirmation.
   - If it fails: Investor holdings drift from the fund register and are found only at audit or on redemption.
   - Work areas: Reporting and documentation, Cross-references and master data

### Variants
- **Bulk orders** (setr.007, setr.001): Several investors' orders for one fund travel in one bulk message (setr.007 for subscriptions, setr.001 for redemptions) with one bulk confirmation.
- **ISO 15022 links** (MT502, MT509, MT515): Some distributors and transfer agents still exchange MT502 orders, MT509 status and MT515 confirmations. The business content is the same, and fund platforms commonly map between them and setr.
- **Fund platforms and order hubs**: Distributors often route orders through a platform or hub connected to many transfer agents, keeping one connection while the hub maps to each transfer agent's requirements.
- **US mutual funds**: In the US most mutual fund orders between broker-dealers and fund transfer agents run through a central clearing utility in its own formats, with net cash settlement.
- **Exchange-traded funds**: ETFs trade on exchanges and settle as securities; see Securities settlement and custody.

### Penalties and disputes
- Order sent after cutoff: priced at a later NAV, and the distributor may owe the investor the difference where the delay was its own.
- Pricing error at the fund: corrected under the fund's NAV error policy, which can compensate investors above a materiality threshold.
- Late subscription cash: the transfer agent may cancel the order or claim interest under its terms.
- Unreconciled holdings held in nominee: findings under client asset rules for the distributor.

### Watch for
- Cutoffs are per fund and in the transfer agent's time zone. A platform cutoff set too close to it leaves no time to fix rejects.
- Orders by amount and orders by units confirm differently. Map both, and check the confirmation matches the order type.
- Confirmation amendments and cancellations refer to the original. Process them, or holdings and cash stay wrong.
- A switch is confirmed per leg. Check every leg executed before reporting it to the investor.
- Fund identifiers change with share class launches, mergers and closures. Keep the ISIN and transfer agent fund code cross-reference current.

### Europe and international
- Luxembourg and Ireland, the main cross-border fund centres, process most orders as ISO 20022 setr messages.
- Market practice for fund messages is set by the Securities Market Practice Group funds working group and national market practice groups.
- EU securities markets move to T+1 settlement on 11 October 2027. Fund dealing cycles follow each prospectus, but ETFs and funds holding T+1 securities are affected.

## 14. Securities settlement and custody
Outcome: Every trade settles on the intended date, and holdings agree with the custodian every day.

After a trade is executed, the investment manager instructs its custodian to receive or deliver securities, against payment or free. The custodian instructs the central securities depository (CSD) directly or through a subcustodian, where the instruction must match the counterparty's. Status, confirmations and statements flow back as ISO 15022 MT54x and MT53x or ISO 20022 sese and semt messages. With US settlement at T+1 and the EU, UK and Switzerland moving to T+1 in October 2027, little time remains to fix an unmatched or late instruction, and EU fails carry daily cash penalties.

- Parties: Investment manager, Custodian, Clearing and settlement
- Business owner: Investment operations and custody operations
- Measures: Instructions sent on trade date, Matching rate before the settlement date, Settlement fail rate, Penalties paid and received, Holdings breaks by age
- Documents, North America: MT540, MT541, MT542, MT543, MT544, MT545, MT546, MT547, MT548, MT535, MT536
- Documents, Europe and international: sese.023, sese.024, sese.025, semt.002, semt.017, MT540, MT541, MT542, MT543, MT544, MT545, MT546, MT547, MT548, MT535, MT536

### Steps
1. **Trade instruction** (MT540, MT541, MT542, MT543 / sese.023, from investment manager)
   - What happens: The investment manager sends its custodian a settlement instruction for each allocated trade: receive or deliver, against payment (MT541, MT543) or free of payment (MT540, MT542).
   - Rules that bite: Instructions carry trade and settlement dates, ISIN, quantity, settlement amount, counterparty and its agent, and the place of settlement, and must reach the custodian by its deadline, often trade date in T+1 markets. In the US, SEC rules require broker-dealers to have agreements or policies aimed at completing allocation, confirmation and affirmation by the end of trade date.
   - EDI team work: Generates instructions from the order management system, enriches them with standing settlement instructions, and validates them before release.
   - If it fails: The instruction arrives late or incomplete and cannot match.
   - Work areas: Map build and maintenance, Cross-references and master data, Monitoring
2. **Market instruction** (sese.023, from custodian)
   - What happens: The custodian validates the instruction against the client's holdings and cash, and instructs the CSD directly or through its subcustodian in the local market.
   - Rules that bite: Market deadlines fall earlier than the custodian's client deadline, and each market adds its own mandatory fields. Participants connected directly to the Eurosystem settlement platform (T2S) use ISO 20022 only.
   - EDI team work: Maps client instructions to each market's format and checks market-specific fields are present before release.
   - If it fails: The market rejects the instruction and the settlement date is lost.
   - Work areas: Map build and maintenance, Rejections
3. **Market matching** (MT548 / sese.024, from clearing and settlement)
   - What happens: The CSD matches the two counterparties' instructions on the mandatory matching fields and reports each as matched, unmatched or pending, with a reason.
   - Rules that bite: Unmatched reasons, such as counterparty instruction missing, and pending reasons, such as lack of securities or insufficient money, need action before the market's settlement deadline. Some markets allow a small tolerance on the settlement amount.
   - EDI team work: Passes market status to the client the same day and alerts on unmatched trades as the deadline approaches.
   - If it fails: Unmatched trades are found after the deadline and fail.
   - Work areas: Monitoring, Fix routing
4. **Status and fails** (MT548 / sese.024, from custodian)
   - What happens: The custodian reports matching status and reasons to the investment manager, which corrects its side or chases the broker; trades not settled on the intended date become fails.
   - Rules that bite: In the EU, CSDs calculate a cash penalty on each failing instruction for every business day it fails, under CSDR. Status and reason travel in separate qualifiers, so map reasons, not only statuses.
   - EDI team work: Routes each status by reason to trade support, tracks fails by age and counterparty, and reconciles the monthly penalty reports.
   - If it fails: Fails age unseen, and penalties and funding costs build up.
   - Work areas: Fix routing, Rejections, Reporting and documentation
5. **Settlement confirmation** (MT544, MT545, MT546, MT547 / sese.025, from custodian)
   - What happens: When the CSD settles, the custodian confirms to the client the securities and cash that moved, with the actual settlement date.
   - Rules that bite: A confirmation must reference the client's original instruction. Where the market allows partial settlement, each partial produces its own confirmation.
   - EDI team work: Loads confirmations into the investment book of record, closes the open trade, and flags partial settlements and cash amounts that differ from the instruction.
   - If it fails: Positions and cash in the book of record are wrong, and the next trade is placed on stale data.
   - Work areas: Monitoring, Cross-references and master data
6. **Holdings statement** (MT535 / semt.002, from custodian)
   - What happens: The custodian sends a statement of holdings per account, usually daily, with positions by ISIN and place of safekeeping.
   - Rules that bite: The statement states its basis, settled or traded positions, which must match how the client reconciles. Every expected account must arrive for the reconciliation to be complete.
   - EDI team work: Loads statements, checks every expected account arrived, and reconciles positions against the book of record.
   - If it fails: Breaks go unseen until a trade fails for lack of securities.
   - Work areas: Missing documents, Reporting and documentation
7. **Transaction statement** (MT536 / semt.017, from custodian)
   - What happens: The custodian reports the transactions that settled in the period, which the investment manager reconciles to its trades, corporate actions and transfers.
   - Rules that bite: Every change in holdings should appear as a transaction. A holdings break with no matching transaction points to a missed corporate action or an unreported settlement.
   - EDI team work: Matches transactions to trade records and corporate action entitlements, and investigates breaks with the custodian.
   - If it fails: Holdings differences stay unexplained until period end or audit.
   - Work areas: Reporting and documentation, Partner follow-up

### Variants
- **Free of payment** (MT540, MT542, MT544, MT546): Transfers between accounts or custodians without cash use MT540 and MT542, confirmed by MT544 and MT546.
- **Cancellation** (sese.020): An instruction is cancelled with the same message type and function CANC in ISO 15022, or sese.020 in ISO 20022. Once matched in the market, both sides usually must cancel.
- **Pending transactions** (MT537, semt.018): MT537 (semt.018) reports instructions not yet settled, which helps manage fails ahead of the deadline.
- **Corporate actions** (MT564, MT566): Income and events on held securities travel as MT564 notifications and MT566 confirmations, or seev messages, and change holdings that must reconcile with statements.
- **Trade affirmation**: Before settlement the broker's trade confirmation is affirmed by the investment manager, often through a central matching service that can also generate the settlement instruction.

### Penalties and disputes
- EU settlement fails: daily cash penalties under CSDR, charged by the CSD to the failing participant and passed on by custodians to clients.
- Late affirmation or instruction in T+1 markets: the trade misses its settlement date, and the investment manager carries funding and overdraft costs.
- Persistent fails: close-out requirements in some markets, and counterparty and custodian reviews of settlement performance.
- Holdings breaks at period end: audit findings and, where client assets are held, exposure under client asset rules.

### Watch for
- T+1 leaves hours, not days, between trade and the market deadline. Instruction files sent in a next-morning batch are already late.
- Standing settlement instructions drive matching. A stale instruction for one broker fails every trade with that broker.
- Client links often stay on ISO 15022 while market links run ISO 20022. Check field lengths and code mappings between them.
- Partial settlements create several confirmations for one instruction. Close the trade only when the full quantity has settled.
- MT548 status reasons drive the fix. Map every reason code, or every unmatched trade looks the same.

### Europe and international
- The EU, UK and Swiss markets move to T+1 settlement on 11 October 2027.
- Most euro area settlement runs on T2S, where directly connected participants use ISO 20022 sese and semt messages.
- CSDR cash penalties have applied since February 2022. The CSDR Refit keeps mandatory buy-ins only as a backstop that is not in force.
- Swift's securities standards changes, including those supporting T+1, were decoupled from the 2026 payments deferral and are now set for 12 June 2027.
