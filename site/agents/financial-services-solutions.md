# Financial services solutions on Trading Grid

Source: Business Network Process Genome, Solution overview for Financial services (https://process-genome.onrender.com/#banking/solution).
Status: Concept preview for internal review. Diagrams are illustrative. Some capabilities shown are in development or planned and are not generally available. Results depend on implementation and partner participation. Figures are as published by OpenText. Names, scope and availability may change.

Bank and corporate relationships, connected and managed. Connect the banks, corporate clients, payment networks and market participants you work with on Trading Grid, and monitor every payment, statement and confirmation.

## Solutions by stage

- Connect and pay: Corporate onboarding and connectivity; Corporate payment initiation; Instant payments and request to pay; Supplier payment and remittance delivery
- Collect and report: Direct debit collection management; Receivables and cash application; Statement and cash reporting
- Screen and resolve: Sanctions screening and fraud controls; Payment status and returns management; Payment tracking and investigations
- Cross-border and markets: Cross-border payments and ISO 20022 transformation; Trade finance and FX confirmation; Fund order processing; Securities settlement and custody messaging

### Connect and pay
Clients connected and payments initiated on every channel.

#### Corporate onboarding and connectivity
- Purpose: Bring each client live on its channel
- Summary: Set up Swift, EBICS, host-to-host or API channels for each corporate client, build maps, and test files before go-live.
- Capabilities:
  - Channel, keys and certificates set up per client
  - Test files validated against the bank's formats
  - Onboarding status tracked from request to first live file
- Parties: Banks, Corporate clients
- Outcome: Shorter onboarding for corporate clients.

#### Corporate payment initiation
- Purpose: Catch payment file errors before the bank does
- Summary: Validate payment files against schema and bank rules before release, and track each file to its status report.
- Capabilities:
  - Files checked against ISO 20022, Nacha and bank-specific rules
  - Cutoffs monitored by payment method and value date
  - Rejected files explained with the field to correct
- Parties: Corporates, Banks
- Outcome: Fewer rejected payment files.

#### Instant payments and request to pay
- Purpose: Know instant payment status in seconds
- Summary: Route instant credit transfers and request-to-pay messages, and track each one to its final status within scheme time limits.
- Capabilities:
  - Instant transfers tracked to accept or reject
  - Request-to-pay responses matched to the request
  - Timeouts and rejects flagged as they occur
- Parties: Banks, Instant schemes
- Outcome: Instant payment status in real time.

#### Supplier payment and remittance delivery
- Purpose: Send remittance detail with every payment
- Summary: Carry structured remittance with supplier payments, and deliver remittance advice that suppliers can apply automatically.
- Capabilities:
  - Structured remittance carried in the payment
  - Remittance advice delivered in each supplier's format
  - Unapplied supplier payments traced to the remittance
- Parties: Corporates, Banks, Suppliers
- Outcome: Fewer supplier payment inquiries.

### Collect and report
Collections, receipts and balances reported and applied.

#### Direct debit collection management
- Purpose: Collect on the due date
- Summary: Submit collections against valid mandates, and handle returns and rejections inside scheme timelines.
- Capabilities:
  - Collections checked against mandates before submission
  - Returns and rejects matched to the original collection
  - Return reasons reported by debtor and reason
- Parties: Creditors, Banks, Debtors
- Outcome: Fewer returned collections.

#### Receivables and cash application
- Purpose: Apply incoming cash to open invoices
- Summary: Combine lockbox, remittance and credit notifications, and match payments to open receivables.
- Capabilities:
  - Lockbox, remittance and credit notifications combined
  - Payments matched to open invoices by reference
  - Unapplied cash flagged with the missing detail
- Parties: Corporates, Banks
- Outcome: Less unapplied cash.

#### Statement and cash reporting
- Purpose: Deliver balances before treasury needs them
- Summary: Collect prior-day and intraday statements from every bank, convert them to one format, and flag missing reports.
- Capabilities:
  - Statements in BAI2, camt and MT formats normalized
  - Missing or late statements flagged by bank and account
  - Balances available for daily cash positioning
- Parties: Banks, Corporate treasury
- Outcome: Complete daily cash position.

### Screen and resolve
Payments screened, rejected items returned and cases closed.

#### Sanctions screening and fraud controls
- Purpose: Screen payments inside the flow
- Summary: Screen payments against sanctions lists before release, hold matches for review, and monitor for fraud patterns.
- Capabilities:
  - Screening embedded before payment release
  - Held payments routed for review and decision
  - Unusual payment patterns flagged for investigation
- Parties: Banks, Corporates
- Outcome: Screening without leaving the payment flow.

#### Payment status and returns management
- Purpose: Know the status of every payment
- Summary: Collect status reports, returns and change notifications, and link each one to the original payment.
- Capabilities:
  - Status reports linked to the original payment
  - Returns and notifications of change routed to the owner
  - Return trends by reason and beneficiary bank
- Parties: Banks, Corporates
- Outcome: Rejected payments found the same day.

#### Payment tracking and investigations
- Purpose: Close payment cases faster
- Summary: Track cross-border payments end to end, and manage cancellation requests and inquiries with their responses.
- Capabilities:
  - Payment progress tracked across banks
  - Cancellation requests matched to their resolution
  - Open cases aged by bank and reason
- Parties: Banks, Correspondents
- Outcome: Fewer open payment investigations.

### Cross-border and markets
Correspondent, trade, fund and securities flows.

#### Cross-border payments and ISO 20022 transformation
- Purpose: Send cross-border payments in ISO 20022
- Summary: Transform between MT and ISO 20022 formats, validate rich data, and route payments through correspondents.
- Capabilities:
  - MT and ISO 20022 messages transformed and validated
  - Truncation and data loss flagged before sending
  - Payment progress followed across correspondents
- Parties: Banks, Correspondents
- Outcome: Truncation risk flagged before payments leave.

#### Trade finance and FX confirmation
- Purpose: Exchange trade and FX messages with banks
- Summary: Send and receive letters of credit, guarantees and amendments, and match FX confirmations to trades.
- Capabilities:
  - Letter of credit and guarantee messages exchanged with banks
  - Amendments linked to the original instrument
  - FX confirmations matched to the trade
- Parties: Corporates, Banks
- Outcome: Trade and FX messages in one view.

#### Fund order processing
- Purpose: Process fund orders to confirmation
- Summary: Route subscription, redemption and switch orders to transfer agents, and match each order to its confirmation.
- Capabilities:
  - Orders validated before cutoff
  - Confirmations matched to the original order
  - Unconfirmed orders flagged by fund and agent
- Parties: Distributors, Transfer agents
- Outcome: Fewer unconfirmed fund orders.

#### Securities settlement and custody messaging
- Purpose: Settle trades on the intended date
- Summary: Send settlement instructions to custodians, follow their status, and reconcile confirmations and holdings.
- Capabilities:
  - Settlement instructions validated before sending
  - Status and confirmations linked to each instruction
  - Holdings statements reconciled to internal positions
- Parties: Investment managers, Custodians
- Outcome: Fewer failed settlements.

## What OpenText provides
Bank connectivity, message transformation, controls, visibility and AI agents across financial services flows.

### Connect and onboard
- Bank connectivity: Swift, EBICS, host-to-host and API channels, with keys and certificates managed.
- Managed Swift access: Swift connectivity as a managed service, without in-house infrastructure.
- Corporate client onboarding: Connectivity setup, map development and end-to-end testing for each new client.
- Large file exchange: Managed file transfer for high-volume and large files.

### Transform and control
- ISO 20022 transformation: Conversion between MT, ISO 20022, Nacha, BAI2 and ERP formats, with validation.
- Embedded sanctions screening: Screening inside the payment flow, with alerts on held payments.
- Fraud monitoring: Payment patterns monitored for anomalies before release.
- Release controls: Value limits and multilevel approval on payment release.

### See and measure
- Transaction lifecycle tracking: Payments and statements traced from file receipt to final status.
- Payments portal: Clients submit instructions and follow status in a web portal.
- Bank and client scorecards: Acceptance rates, reject reasons and cutoff adherence by bank and client.
- Governed data delivery: Network data explored in place or delivered to your own analytics on a schedule.

### Act with AI agents
- Errors explained and routed: Agents read a reject or return, explain it in business terms and route it to the team that fixes it.
- Root cause across failures: Related rejects grouped to one cause, with the follow-up to each bank or client drafted.
- Agents in your tools: Ask about payment status, returns and statements from the assistants your teams already use.
- Approval before change: Agents investigate and recommend; a person approves resends, releases and updates.

## Network
- 30+: Years supporting financial services
- 14 of 15: Largest North American banks run transactions on the network
- 31B+: Transactions processed each year
