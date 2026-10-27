# Retail and CPG documents

Source: Business Network Process Genome, Process Genome for Retail and CPG (https://process-genome.onrender.com/#retail/map).
Status: Examples describe typical operating scenarios, not specific customer accounts. Standards, versions, and mandate dates vary by partner and region. Confirm requirements with each partner before building.

Code key: X12 set, or the EDIFACT or GDSN message where no X12 set exists. 41 documents, grouped by family in flow order.

## Item data

- **CIN Catalogue item notification**. Sender: Data pool. Receiver: Retailer. Europe and international: GDSN CIN. Delivers the supplier's published item data to a subscribing retailer. Used in: Item and price synchronization.
- **CIC Catalogue item confirmation**. Sender: Retailer. Receiver: Supplier, through the data pool. Europe and international: GDSN CIC. Retailer's response to an item notification: synchronized, accepted, review or rejected. Used in: Item and price synchronization.
- **832 Price and sales catalog**. Sender: Supplier. Receiver: Retailer. Europe and international: PRICAT. Item list with identifiers, descriptions and costs, sent at setup and on change. Used in: Item and price synchronization; Drop ship and marketplaces.
- **888 Item maintenance**. Sender: Supplier. Receiver: Retailer. Europe and international: PRODAT. Adds or changes item records. Used for DSD and grocery item authorization. Used in: Item and price synchronization; Direct store delivery.
- **879 Price information**. Sender: Supplier. Receiver: Retailer. Europe and international: PRICAT. Penalty-prone. Cost changes with effective dates. Late changes cause invoice price mismatches. Used in: Item and price synchronization; Direct store delivery.
- **889 Promotion announcement**. Sender: Supplier. Receiver: Retailer. No EDIFACT equivalent. Promotion terms, allowances and dates used later to settle deals. Used in: Item and price synchronization; Returns, credits and allowances.

## Plan

- **852 Product activity data**. Sender: Retailer. Receiver: Supplier. Europe and international: SLSRPT, INVRPT. Sales and on-hand inventory by item and location. The input to replenishment and sales analytics. Used in: Direct store delivery; Vendor-managed inventory and CPFR; Sales and inventory reporting.
- **830 Planning schedule**. Sender: Retailer. Receiver: Supplier. Europe and international: SLSFCT. Forecast quantities by item and period for supply planning. Used in: Vendor-managed inventory and CPFR.
- **846 Inventory advice**. Sender: Supplier or 3PL. Receiver: Retailer or supplier. Europe and international: INVRPT. Penalty-prone. Available quantity by item. In drop ship it decides what the retailer can sell. Used in: Drop ship and marketplaces; 3PL fulfillment.

## Order

- **850 Purchase order**. Sender: Retailer. Receiver: Supplier. Europe and international: ORDERS. Items, quantities, cost, ship window and ship-to location. Used in: Order to cash; Item and price synchronization; Drop ship and marketplaces; 3PL fulfillment; Vendor onboarding and certification.
- **855 Order acknowledgment**. Sender: Supplier. Receiver: Retailer. Europe and international: ORDRSP. Penalty-prone. Accepts, changes or rejects each order line before shipment. Used in: Order to cash; Vendor-managed inventory and CPFR; Drop ship and marketplaces; Vendor onboarding and certification.
- **860 Order change**. Sender: Retailer. Receiver: Supplier. Europe and international: ORDCHG. Changes quantities, dates or lines on an open order. Used in: Order to cash; Drop ship and marketplaces.
- **865 Change acknowledgment**. Sender: Supplier. Receiver: Retailer. Europe and international: ORDRSP. Accepts or rejects the retailer's order change. Used in: Order to cash; Drop ship and marketplaces.
- **870 Order status**. Sender: Supplier. Receiver: Retailer. No EDIFACT equivalent. Status of open orders. Used in drop ship for backorders and cancellations. Used in: Drop ship and marketplaces.

## Move

- **753 Routing request**. Sender: Supplier. Receiver: Retailer. No EDIFACT equivalent. Penalty-prone. Ready-to-ship details (cartons, weight and cube) with a request for a carrier. Used in: Routing and delivery.
- **754 Routing instructions**. Sender: Retailer. Receiver: Supplier. No EDIFACT equivalent. Assigned carrier, load and pickup details for the shipment. Used in: Routing and delivery.
- **204 Load tender**. Sender: Retailer. Receiver: Carrier. Europe and international: IFTMIN. Offers a load to a carrier with stops, dates and references. Used in: Routing and delivery.
- **990 Tender response**. Sender: Carrier. Receiver: Retailer. No EDIFACT equivalent. Carrier accepts or declines the tendered load. Used in: Routing and delivery.
- **211 Bill of lading**. Sender: Supplier. Receiver: Carrier. Europe and international: IFTMIN. Electronic bill of lading for the shipment. Used in: Routing and delivery.
- **214 Shipment status**. Sender: Carrier. Receiver: Retailer. Europe and international: IFTSTA. Penalty-prone. Pickup, in-transit, appointment and delivery events. Used in: Routing and delivery.

## Ship and confirm

- **856 Ship notice**. Sender: Supplier. Receiver: Retailer. Europe and international: DESADV. Penalty-prone. Shipment, order, carton and item detail with SSCC labels, sent before arrival. Used in: Order to cash; Receive, match and pay; Routing and delivery; Vendor-managed inventory and CPFR; Drop ship and marketplaces; 3PL fulfillment; Vendor onboarding and certification.
- **997 Functional acknowledgment**. Sender: Either party. Receiver: Either party. Europe and international: CONTRL. Confirms receipt and syntax. It does not confirm business acceptance. Used in: Order to cash; Receive, match and pay; Drop ship and marketplaces; Sales and inventory reporting; Vendor onboarding and certification.
- **824 Application advice**. Sender: Retailer. Receiver: Supplier. Europe and international: APERAK. Penalty-prone. Accepts or rejects a received document, with reason codes. Used in: Order to cash; Receive, match and pay; Direct store delivery; Vendor-managed inventory and CPFR; Drop ship and marketplaces; Vendor onboarding and certification.
- **864 Text message**. Sender: Retailer. Receiver: Supplier. Europe and international: GENRAL. Free-form notice from the retailer, such as a document rejection, compliance notice or chargeback notice. Used in: Order to cash; Receive, match and pay; Deductions, chargebacks and disputes.
- **861 Receiving advice**. Sender: Retailer. Receiver: Supplier. Europe and international: RECADV. Accepted and rejected quantities after receipt, with reasons. Sent by some retailers only. Used in: Receive, match and pay.

## Settle

- **810 Invoice**. Sender: Supplier. Receiver: Retailer. Europe and international: INVOIC. Penalty-prone. Bills shipped quantities at the agreed cost and terms. Used in: Order to cash; Receive, match and pay; Deductions, chargebacks and disputes; Direct store delivery; Vendor-managed inventory and CPFR; Drop ship and marketplaces; 3PL fulfillment; Returns, credits and allowances; Vendor onboarding and certification.
- **820 Remittance**. Sender: Retailer. Receiver: Supplier. Europe and international: REMADV. Penalty-prone. Payment detail by invoice, including deductions with reason codes. Used in: Order to cash; Receive, match and pay; Deductions, chargebacks and disputes; Direct store delivery; Drop ship and marketplaces; Returns, credits and allowances.
- **812 Credit or debit memo**. Sender: Retailer for debits, supplier for credits. Receiver: The other party. Europe and international: COMDIS. Penalty-prone. Debits or credits against invoices for shortages, violations, returns and allowances. Used in: Receive, match and pay; Deductions, chargebacks and disputes; Returns, credits and allowances.
- **210 Freight invoice**. Sender: Carrier. Receiver: Retailer. Europe and international: INVOIC. Carrier bill for a delivered load. Used in: Routing and delivery.

## Return

- **180 Return authorization**. Sender: Retailer requests, supplier authorizes. Receiver: The other party. Europe and international: RETANN, RETINS. Requests and authorizes a return, with disposition instructions. Used in: Returns, credits and allowances.

## Grocery and DSD series

- **875 Grocery order**. Sender: Retailer. Receiver: Supplier. Europe and international: ORDERS. Purchase order format used in grocery and foodservice. Used in: Order to cash.
- **876 Grocery order change**. Sender: Retailer. Receiver: Supplier. Europe and international: ORDCHG. Changes an open grocery order. Used in: Order to cash.
- **880 Grocery invoice**. Sender: Supplier. Receiver: Retailer. Europe and international: INVOIC. Penalty-prone. Invoice format used in grocery and foodservice. Used in: Order to cash; Receive, match and pay.
- **894 DSD delivery record**. Sender: DSD supplier. Receiver: Store. No EDIFACT equivalent. Penalty-prone. Itemized delivery the store checks at the back door. Used in: Direct store delivery.
- **895 DSD adjustment**. Sender: Store. Receiver: DSD supplier. No EDIFACT equivalent. Store accepts or adjusts the delivery record. Used in: Direct store delivery.
- **882 DSD summary**. Sender: DSD supplier. Receiver: Retailer. No EDIFACT equivalent. Summary of store deliveries for settlement. Used in: Direct store delivery.

## Warehouse series

- **940 Warehouse shipping order**. Sender: Supplier. Receiver: 3PL. Europe and international: INSDES. Instructs the 3PL to pick and ship an order. Used in: 3PL fulfillment.
- **945 Warehouse shipping advice**. Sender: 3PL. Receiver: Supplier. Europe and international: DESADV. Penalty-prone. Confirms what the 3PL shipped. Used in: 3PL fulfillment.
- **943 Stock transfer advice**. Sender: Supplier. Receiver: 3PL. Europe and international: DESADV. Tells the 3PL that inbound stock is on the way. Used in: 3PL fulfillment.
- **944 Stock transfer receipt**. Sender: 3PL. Receiver: Supplier. Europe and international: RECADV. Confirms the stock the 3PL received. Used in: 3PL fulfillment.
- **947 Inventory adjustment**. Sender: 3PL. Receiver: Supplier. Europe and international: INVRPT. Reports damage, count and status changes to 3PL stock. Used in: 3PL fulfillment.
