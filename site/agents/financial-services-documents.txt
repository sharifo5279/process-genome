# Financial services documents

Source: Business Network Process Genome, Process Genome for Financial services (https://process-genome.onrender.com/#banking/map).
Status: Examples describe typical operating scenarios, not specific customer accounts. Standards, versions, and mandate dates vary by partner and region. Confirm requirements with each partner before building.

Code key: ISO 20022 message, or the SWIFT MT, Nacha, BAI2 or X12 format where ISO 20022 is not used. 42 documents, grouped by family in flow order.

## Initiate

- **pain.001 Credit transfer initiation**. Sender: Corporate. Receiver: Bank. ISO 20022: pain.001; SWIFT MT: MT101; Other: Nacha CCD, CTX and PPD in the US. Penalty-prone. Payment instructions from a corporate to its bank: debtor account, beneficiaries, amounts, value date and remittance. Used in: Corporate client onboarding; Payment initiation; Sanctions screening and fraud controls; Cross-border payments; Instant payments; Supplier payment and remittance.
- **Nacha ACH entry file**. Sender: Corporate. Receiver: Originating bank. Other: US domestic ACH format with CCD, CTX and PPD entries. pain.001 where the bank supports it. Penalty-prone. US ACH batch file of credit or debit entries under a standard entry class code. Used in: Payment initiation; Receivables and cash application; Direct debit collections; Supplier payment and remittance.
- **pain.008 Direct debit initiation**. Sender: Creditor. Receiver: Creditor bank. ISO 20022: pain.008; SWIFT MT: MT104, rarely used; Other: Nacha PPD and CCD debit entries in the US. Penalty-prone. Collection instructions from a creditor to its bank, each referencing the debtor mandate. Used in: Direct debit collections.
- **pain.013 Request to pay**. Sender: Payee. Receiver: Payer. ISO 20022: pain.013. Asks the payer to approve and initiate a payment for a stated amount. Used in: Instant payments.
- **820 Payment order and remittance advice**. Sender: Payer. Receiver: Bank or payee. Other: X12 820. REMADV in EDIFACT. Payment order to a bank or remittance detail to a payee, by invoice and amount. Used in: Receivables and cash application; Supplier payment and remittance.

## Acknowledge

- **pain.002 Payment status report**. Sender: Bank. Receiver: Corporate. ISO 20022: pain.002; Other: Bank-specific acknowledgment files. Penalty-prone. Accepts or rejects a payment file, batch or transaction, with reason codes. Used in: Corporate client onboarding; Payment initiation; Payment status and returns; Sanctions screening and fraud controls; Instant payments; Direct debit collections; Supplier payment and remittance.
- **pain.014 Request to pay response**. Sender: Payer. Receiver: Payee. ISO 20022: pain.014. Accepts or refuses a request to pay. Used in: Instant payments.
- **997 Functional acknowledgment**. Sender: Bank. Receiver: Corporate. Other: X12 997. CONTRL in EDIFACT. Confirms receipt and syntax of an X12 file. It does not confirm payment. Used in: Supplier payment and remittance.
- **824 Application advice**. Sender: Bank. Receiver: Corporate. Other: X12 824. APERAK in EDIFACT. Penalty-prone. Accepts or rejects an X12 payment file on business rules, with error detail. Used in: Supplier payment and remittance.

## Clear and settle

- **pacs.008 Customer credit transfer**. Sender: Debtor bank. Receiver: Creditor bank or correspondent. ISO 20022: pacs.008; SWIFT MT: MT103. Penalty-prone. Interbank customer payment with debtor, creditor, agents, amount and remittance. Used in: Payment initiation; Sanctions screening and fraud controls; Cross-border payments; Instant payments; Fund order processing.
- **pacs.009 Financial institution transfer**. Sender: Bank. Receiver: Bank. ISO 20022: pacs.009; SWIFT MT: MT202, MT202 COV. Bank-to-bank transfer, including the cover leg of a customer payment. Used in: Cross-border payments.
- **pacs.003 Interbank direct debit**. Sender: Creditor bank. Receiver: Debtor bank. ISO 20022: pacs.003; Other: Nacha debit entries in the US. Collection exchanged between banks through the clearing scheme. Used in: Direct debit collections.
- **pacs.002 Interbank payment status**. Sender: Receiving bank or scheme. Receiver: Sending bank. ISO 20022: pacs.002. Penalty-prone. Accepts or rejects an interbank payment. Final status is mandatory in instant schemes. Used in: Payment status and returns; Cross-border payments; Instant payments.

## Report

- **camt.052 Intraday account report**. Sender: Bank. Receiver: Corporate. ISO 20022: camt.052; SWIFT MT: MT942; Other: BAI2 intraday. Intraday balances and entries for cash positioning. Used in: Statements and cash reporting.
- **camt.053 Account statement**. Sender: Bank. Receiver: Corporate. ISO 20022: camt.053; SWIFT MT: MT940; Other: BAI2 prior day. Penalty-prone. End-of-day statement with opening and closing balances and every booked entry. Used in: Corporate client onboarding; Statements and cash reporting; Trade finance and FX confirmations.
- **camt.054 Debit and credit notification**. Sender: Bank. Receiver: Corporate. ISO 20022: camt.054; SWIFT MT: MT900, MT910; Other: BAI2 detail records. Reports individual debits and credits, with remittance, as they post. Used in: Payment initiation; Payment status and returns; Cross-border payments; Instant payments; Statements and cash reporting; Receivables and cash application; Direct debit collections; Supplier payment and remittance; Investigations and payment tracking.
- **BAI2 Balance and transaction report**. Sender: Bank. Receiver: Corporate. Other: US format. camt.052 and camt.053 where the bank supports them. US prior-day and intraday balance and transaction reporting. Used in: Corporate client onboarding; Payment initiation; Payment status and returns; Cross-border payments; Statements and cash reporting; Receivables and cash application; Direct debit collections; Investigations and payment tracking; Trade finance and FX confirmations.
- **823 Lockbox**. Sender: Bank. Receiver: Corporate. Other: X12 823. US only. Check payments received at the bank lockbox, with remittance detail. Used in: Receivables and cash application.

## Return and investigate

- **pacs.004 Payment return**. Sender: Receiving bank. Receiver: Sending bank. ISO 20022: pacs.004; SWIFT MT: MT103 or MT202 return; Other: Nacha return entries (R codes) in the US. Penalty-prone. Returns funds of a settled payment with a reason code. Used in: Payment status and returns; Cross-border payments; Direct debit collections; Investigations and payment tracking.
- **COR Notification of change**. Sender: Receiving bank. Receiver: Originator. Other: Nacha COR entry. US only. Reports corrected account or routing data for future ACH entries. Used in: Payment status and returns.
- **camt.055 Customer cancellation request**. Sender: Corporate. Receiver: Bank. ISO 20022: camt.055; SWIFT MT: MT192, from the corporate. Asks the bank to cancel a payment the corporate instructed. Used in: Investigations and payment tracking.
- **camt.056 Interbank cancellation request**. Sender: Sending bank. Receiver: Receiving bank. ISO 20022: camt.056; SWIFT MT: MT192, MT292. Requests cancellation or recall of a payment between banks. Used in: Investigations and payment tracking.
- **camt.029 Resolution of investigation**. Sender: Receiving bank. Receiver: Requesting bank. ISO 20022: camt.029; SWIFT MT: MT196, MT296. Answers a cancellation request or inquiry. Used in: Investigations and payment tracking.
- **camt.027 Claim non receipt**. Sender: Corporate or bank. Receiver: Bank. ISO 20022: camt.027; SWIFT MT: MT199 free format. Reports that an expected payment was not received. Used in: Investigations and payment tracking.
- **camt.110 Investigation request**. Sender: Bank. Receiver: Bank. ISO 20022: camt.110; SWIFT MT: MT199 free format. Structured inquiry about a payment between banks, replacing free-format queries. Used in: Investigations and payment tracking.

## Trade and FX

- **MT798 Corporate trade envelope**. Sender: Corporate or bank. Receiver: The other party. SWIFT MT: MT798; Other: No ISO 20022 trade message in wide use. Carries trade applications and notifications between a corporate and its bank. Used in: Trade finance and FX confirmations.
- **MT700 Documentary credit issue**. Sender: Issuing bank. Receiver: Advising bank. SWIFT MT: MT700; Other: No ISO 20022 trade message in wide use. Penalty-prone. Issues a letter of credit with terms, documents and expiry. Used in: Trade finance and FX confirmations.
- **MT707 Documentary credit amendment**. Sender: Issuing bank. Receiver: Advising bank. SWIFT MT: MT707; Other: No ISO 20022 trade message in wide use. Amends the terms of an issued letter of credit. Used in: Trade finance and FX confirmations.
- **MT760 Guarantee or standby credit**. Sender: Issuing bank. Receiver: Advising bank. SWIFT MT: MT760; Other: No ISO 20022 trade message in wide use. Issues a demand guarantee or standby letter of credit. Used in: Trade finance and FX confirmations.
- **MT300 FX confirmation**. Sender: Either party. Receiver: The other party. ISO 20022: fxtr.014, fxtr.017; SWIFT MT: MT300. Penalty-prone. Confirms a foreign exchange trade: rate, amounts, value date and settlement instructions. Used in: Trade finance and FX confirmations.

## Securities

- **sese.023 Settlement instruction**. Sender: Investment manager. Receiver: Custodian. ISO 20022: sese.023; SWIFT MT: MT540 to MT543. Penalty-prone. Instructs receipt or delivery of securities, free or against payment. Used in: Securities settlement and custody.
- **sese.024 Settlement status**. Sender: Custodian. Receiver: Investment manager. ISO 20022: sese.024; SWIFT MT: MT548. Penalty-prone. Reports matching status, pending reasons and fails for an instruction. Used in: Securities settlement and custody.
- **sese.025 Settlement confirmation**. Sender: Custodian. Receiver: Investment manager. ISO 20022: sese.025; SWIFT MT: MT544 to MT547. Confirms settled quantity, amount and date. Used in: Securities settlement and custody.
- **semt.002 Statement of holdings**. Sender: Custodian or transfer agent. Receiver: Investment manager or distributor. ISO 20022: semt.002; SWIFT MT: MT535. Positions held by account and security at a statement date. Used in: Fund order processing; Securities settlement and custody.
- **semt.017 Statement of transactions**. Sender: Custodian. Receiver: Investment manager. ISO 20022: semt.017; SWIFT MT: MT536. Settled movements by security over a period. Used in: Securities settlement and custody.

## Funds

- **acmt.001 Account opening**. Sender: Distributor. Receiver: Transfer agent. ISO 20022: acmt.001. Opens an investor account at the transfer agent before orders are placed. Used in: Fund order processing.
- **setr.010 Subscription order**. Sender: Distributor. Receiver: Transfer agent. ISO 20022: setr.010; SWIFT MT: MT502; Other: Clearing utility order files in the US. Penalty-prone. Buys fund units by amount or quantity, before the dealing cutoff. Used in: Fund order processing.
- **setr.004 Redemption order**. Sender: Distributor. Receiver: Transfer agent. ISO 20022: setr.004; SWIFT MT: MT502; Other: Clearing utility order files in the US. Penalty-prone. Sells fund units by amount or quantity, before the dealing cutoff. Used in: Fund order processing.
- **setr.013 Switch order**. Sender: Distributor. Receiver: Transfer agent. ISO 20022: setr.013. Redeems from one fund and subscribes to another in one order. Used in: Fund order processing.
- **setr.016 Order status report**. Sender: Transfer agent. Receiver: Distributor. ISO 20022: setr.016; SWIFT MT: MT509. Reports the status of an order: received, accepted, rejected or pending. Used in: Fund order processing.
- **setr.012 Subscription confirmation**. Sender: Transfer agent. Receiver: Distributor. ISO 20022: setr.012; SWIFT MT: MT515. Confirms an executed subscription with price, units and settlement amount. Used in: Fund order processing.
- **setr.006 Redemption confirmation**. Sender: Transfer agent. Receiver: Distributor. ISO 20022: setr.006; SWIFT MT: MT515. Confirms an executed redemption with price, units and settlement amount. Used in: Fund order processing.
