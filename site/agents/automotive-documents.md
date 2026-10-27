# Automotive documents

Source: Business Network Process Genome, Process Genome for Automotive (https://process-genome.onrender.com/#automotive/map).
Status: Examples describe typical operating scenarios, not specific customer accounts. Standards, versions, and mandate dates vary by partner and region. Confirm requirements with each partner before building.

Code key: X12 set, or the EDIFACT or VDA message where no X12 set exists. 25 documents, grouped by family in flow order.

## Catalog

- **832 Price and sales catalog**. Sender: Supplier. Receiver: Aftermarket buyer. Europe and international: PRICAT. Part list with identifiers, descriptions and prices, sent at setup and on change. Fitment and attribute data travel separately as files. Used in: Aftermarket order to cash.

## Order

- **850 Purchase order**. Sender: Customer. Receiver: Supplier. Europe and international: ORDERS. Blanket order setting price, terms and ship-to per part, or a spot order in the aftermarket. Used in: Forecast and release; Sub-tier procurement; Aftermarket order to cash.
- **860 Purchase order change**. Sender: Customer. Receiver: Supplier. Europe and international: ORDCHG. Changes price, part, engineering level or terms on an open blanket order. Used in: Forecast and release; Sub-tier procurement.
- **855 Order acknowledgment**. Sender: Supplier. Receiver: Customer. Europe and international: ORDRSP. Confirms each order line, with substitutions for superseded parts and ship dates. Used in: Aftermarket order to cash.

## Plan and release

- **830 Planning schedule**. Sender: Customer. Receiver: Supplier. Europe and international: DELFOR. Odette DELINS. VDA 4984, replacing VDA 4905. Forecast by part and ship-to with firm and planning periods, cum received, and fabrication and material authorizations. Used in: Forecast and release; Cumulative reconciliation and balance-out; Just in sequence; Sub-tier procurement.
- **862 Shipping schedule**. Sender: Customer. Receiver: Supplier. Europe and international: DELJIT. Odette CALDEL. VDA 4985, which with VDA 4984 replaces VDA 4915. Penalty-prone. Near-term ship or delivery quantities and dates that supersede the forecast's near-term ship data. Used in: Forecast and release; Sub-tier procurement.
- **866 Production sequence**. Sender: Customer. Receiver: Sequencing supplier. Europe and international: DELJIT. Odette SYNCRO. VDA 4986, replacing VDA 4916. Penalty-prone. Build sequence by vehicle: identifier, sequence number, variant, assembly point and time of use. Used in: Just in sequence.
- **846 Inventory advice**. Sender: Supplier. Receiver: Customer. Europe and international: INVRPT. Available quantity by part. In aftermarket drop ship it sets what the buyer can promise. Used in: Aftermarket order to cash.

## Ship and confirm

- **856 Ship notice**. Sender: Supplier. Receiver: Customer. Europe and international: DESADV. Odette AVIEXP. VDA 4987, replacing VDA 4913. Penalty-prone. Shipment, bill of lading, parts, quantities, cum shipped, packaging and container serials that match the labels. Used in: Forecast and release; Cumulative reconciliation and balance-out; Ship notice and labels; Just in sequence; Receipt and settlement; Inbound transport; Sub-tier procurement; Aftermarket order to cash; Returnable containers.
- **997 Functional acknowledgment**. Sender: Either party. Receiver: Either party. Europe and international: CONTRL. Confirms receipt and syntax. It does not confirm business acceptance. Used in: Forecast and release; Ship notice and labels; Sub-tier procurement.
- **824 Application advice**. Sender: Customer. Receiver: Supplier. Europe and international: APERAK. VDA 4937. Penalty-prone. Accepts or rejects a ship notice or invoice, with error detail. Used in: Ship notice and labels; Receipt and settlement.

## Move

- **204 Load tender**. Sender: Lead logistics provider. Receiver: Carrier. Europe and international: IFTMIN. VDA 4933. Offers a planned load to a carrier with stops, windows and load number. Used in: Inbound transport.
- **990 Tender response**. Sender: Carrier. Receiver: Lead logistics provider. Europe and international: VDA 4933 covers the transport order confirmation. Carrier accepts or declines the tendered load. Used in: Inbound transport.
- **214 Shipment status**. Sender: Carrier. Receiver: Lead logistics provider or booking party. Europe and international: IFTSTA. VDA 4945. Penalty-prone. Pickup, in-transit and delivery events against the load and bill of lading. Used in: Ship notice and labels; Inbound transport.
- **210 Freight invoice**. Sender: Carrier. Receiver: Bill-to party. Europe and international: INVOIC. VDA 4938 part 4 covers the freight invoice. Carrier bill for a delivered load, audited against the tender. Used in: Inbound transport.

## Receive and settle

- **861 Receiving advice**. Sender: Customer. Receiver: Supplier. Europe and international: RECADV. VDA 4989 uses it as the entry certificate for intra-EU deliveries. Penalty-prone. Reports receipt differences: over, short, no notice, returns, scrap and cum adjustments. Used in: Cumulative reconciliation and balance-out; Receipt and settlement.
- **810 Invoice**. Sender: Supplier. Receiver: Customer. Europe and international: INVOIC. VDA 4938, replacing VDA 4906. Penalty-prone. Bills a shipment where the customer does not pay from receipts. Used in: Receipt and settlement; Sub-tier procurement; Aftermarket order to cash.
- **INVOIC Self-billing invoice**. Sender: Customer. Receiver: Supplier. Europe and international: EDIFACT INVOIC. VDA 4938, replacing VDA 4908. No X12 set. Penalty-prone. The customer's invoice for the supply, built from its receipts and agreed price; the supplier's tax record. Used in: Receipt and settlement; Sub-tier procurement.
- **820 Remittance advice**. Sender: Customer. Receiver: Supplier. Europe and international: REMADV. VDA 4988, replacing VDA 4907. Penalty-prone. Payment detail by receipt or invoice, net of debits, with reason codes. Used in: Receipt and settlement; Sub-tier procurement; Aftermarket order to cash.

## Return

- **180 Return authorization**. Sender: Buyer requests, supplier authorizes. Receiver: The other party. Europe and international: RETANN, RETINS. Requests and authorizes a parts return, with disposition. Used in: Aftermarket order to cash.

## Container series

- **4946 Container order**. Sender: Supplier or container owner. Receiver: The other party. Europe and international: VDA 4946. No X12 set. Orders empty returnable containers and confirms the order. Used in: Returnable containers.
- **4943 Empties despatch advice**. Sender: Container owner. Receiver: Supplier. Europe and international: VDA 4943. No X12 set. Forecasts and announces empty container shipments to the supplier. Used in: Returnable containers.
- **4947 Container movement**. Sender: Supplier. Receiver: Container owner. Europe and international: VDA 4947. No X12 set. Penalty-prone. Confirms empties received and books container movements. Used in: Returnable containers.
- **4941 Container account statement**. Sender: Container owner. Receiver: Supplier. Europe and international: VDA 4941. No X12 set. Penalty-prone. Periodic statement of bookings and closing balance per container type. Used in: Returnable containers.
- **4942 Container inventory**. Sender: Supplier. Receiver: Container owner. Europe and international: VDA 4942. No X12 set. Penalty-prone. Container count on hand by type and site, usually at year end, with any differences. Used in: Returnable containers.
