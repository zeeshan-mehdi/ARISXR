export interface SampleProcess {
  id: string;
  name: string;
  description: string;
  complexity: 1 | 2 | 3 | 4 | 5;
  xml: string;
}

export const sampleProcesses: SampleProcess[] = [
  {
    id: 'simple-approval',
    name: 'Simple Approval',
    description: 'Basic approval workflow with start, task, and end',
    complexity: 1,
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL">
  <process id="Process_1" name="Simple Approval Process">
    <startEvent id="StartEvent_1" name="Start"/>
    <task id="Task_1" name="Review Request"/>
    <endEvent id="EndEvent_1" name="End"/>
    <sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1"/>
    <sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="EndEvent_1"/>
  </process>
</definitions>`
  },
  {
    id: 'onboarding',
    name: 'Employee Onboarding',
    description: 'Sequential onboarding tasks for new employees',
    complexity: 2,
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL">
  <process id="Process_2" name="Employee Onboarding">
    <startEvent id="StartEvent_1" name="New Employee"/>
    <task id="Task_1" name="Submit Documents"/>
    <task id="Task_2" name="Setup Email Account"/>
    <task id="Task_3" name="Assign Workspace"/>
    <task id="Task_4" name="Schedule Training"/>
    <endEvent id="EndEvent_1" name="Onboarding Complete"/>
    <sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1"/>
    <sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="Task_2"/>
    <sequenceFlow id="Flow_3" sourceRef="Task_2" targetRef="Task_3"/>
    <sequenceFlow id="Flow_4" sourceRef="Task_3" targetRef="Task_4"/>
    <sequenceFlow id="Flow_5" sourceRef="Task_4" targetRef="EndEvent_1"/>
  </process>
</definitions>`
  },
  {
    id: 'purchase-order',
    name: 'Purchase Order',
    description: 'Order approval with decision gateway based on amount',
    complexity: 3,
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL">
  <process id="Process_3" name="Purchase Order Approval">
    <startEvent id="StartEvent_1" name="Order Requested"/>
    <task id="Task_1" name="Create Purchase Order"/>
    <exclusiveGateway id="Gateway_1" name="Amount > $1000?"/>
    <task id="Task_2" name="Manager Approval"/>
    <task id="Task_3" name="Auto Approve"/>
    <exclusiveGateway id="Gateway_2" name="Join"/>
    <task id="Task_4" name="Send to Vendor"/>
    <endEvent id="EndEvent_1" name="Order Placed"/>
    <sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1"/>
    <sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="Gateway_1"/>
    <sequenceFlow id="Flow_3" sourceRef="Gateway_1" targetRef="Task_2" name="Yes"/>
    <sequenceFlow id="Flow_4" sourceRef="Gateway_1" targetRef="Task_3" name="No"/>
    <sequenceFlow id="Flow_5" sourceRef="Task_2" targetRef="Gateway_2"/>
    <sequenceFlow id="Flow_6" sourceRef="Task_3" targetRef="Gateway_2"/>
    <sequenceFlow id="Flow_7" sourceRef="Gateway_2" targetRef="Task_4"/>
    <sequenceFlow id="Flow_8" sourceRef="Task_4" targetRef="EndEvent_1"/>
  </process>
</definitions>`
  },
  {
    id: 'incident-management',
    name: 'Incident Management',
    description: 'IT incident handling with parallel tasks and multiple paths',
    complexity: 4,
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL">
  <process id="Process_4" name="IT Incident Management">
    <startEvent id="StartEvent_1" name="Incident Reported"/>
    <task id="Task_1" name="Log Incident"/>
    <exclusiveGateway id="Gateway_1" name="Severity?"/>
    <task id="Task_2" name="Assign to L1 Support"/>
    <task id="Task_3" name="Escalate to L2"/>
    <parallelGateway id="Gateway_2" name="Parallel Actions"/>
    <task id="Task_4" name="Investigate Issue"/>
    <task id="Task_5" name="Notify Stakeholders"/>
    <task id="Task_6" name="Update Documentation"/>
    <parallelGateway id="Gateway_3" name="Join"/>
    <task id="Task_7" name="Resolve Incident"/>
    <task id="Task_8" name="Close Ticket"/>
    <endEvent id="EndEvent_1" name="Incident Closed"/>
    <sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1"/>
    <sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="Gateway_1"/>
    <sequenceFlow id="Flow_3" sourceRef="Gateway_1" targetRef="Task_2" name="Low/Medium"/>
    <sequenceFlow id="Flow_4" sourceRef="Gateway_1" targetRef="Task_3" name="High/Critical"/>
    <sequenceFlow id="Flow_5" sourceRef="Task_2" targetRef="Gateway_2"/>
    <sequenceFlow id="Flow_6" sourceRef="Task_3" targetRef="Gateway_2"/>
    <sequenceFlow id="Flow_7" sourceRef="Gateway_2" targetRef="Task_4"/>
    <sequenceFlow id="Flow_8" sourceRef="Gateway_2" targetRef="Task_5"/>
    <sequenceFlow id="Flow_9" sourceRef="Gateway_2" targetRef="Task_6"/>
    <sequenceFlow id="Flow_10" sourceRef="Task_4" targetRef="Gateway_3"/>
    <sequenceFlow id="Flow_11" sourceRef="Task_5" targetRef="Gateway_3"/>
    <sequenceFlow id="Flow_12" sourceRef="Task_6" targetRef="Gateway_3"/>
    <sequenceFlow id="Flow_13" sourceRef="Gateway_3" targetRef="Task_7"/>
    <sequenceFlow id="Flow_14" sourceRef="Task_7" targetRef="Task_8"/>
    <sequenceFlow id="Flow_15" sourceRef="Task_8" targetRef="EndEvent_1"/>
  </process>
</definitions>`
  },
  {
    id: 'loan-application',
    name: 'Loan Application',
    description: 'Complex loan processing with multiple decision points and reviews',
    complexity: 5,
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL">
  <process id="Process_5" name="Loan Application Process">
    <startEvent id="StartEvent_1" name="Application Received"/>
    <task id="Task_1" name="Verify Documents"/>
    <exclusiveGateway id="Gateway_1" name="Documents Complete?"/>
    <task id="Task_2" name="Request Missing Docs"/>
    <task id="Task_3" name="Check Credit Score"/>
    <exclusiveGateway id="Gateway_2" name="Score > 650?"/>
    <task id="Task_4" name="Reject Application"/>
    <endEvent id="EndEvent_1" name="Application Rejected"/>
    <parallelGateway id="Gateway_3" name="Parallel Checks"/>
    <task id="Task_5" name="Employment Verification"/>
    <task id="Task_6" name="Property Appraisal"/>
    <task id="Task_7" name="Financial Analysis"/>
    <parallelGateway id="Gateway_4" name="Join"/>
    <task id="Task_8" name="Risk Assessment"/>
    <exclusiveGateway id="Gateway_5" name="Risk Level?"/>
    <task id="Task_9" name="Standard Approval"/>
    <task id="Task_10" name="Committee Review"/>
    <exclusiveGateway id="Gateway_6" name="Approved?"/>
    <task id="Task_11" name="Prepare Offer"/>
    <task id="Task_12" name="Sign Agreement"/>
    <task id="Task_13" name="Disburse Funds"/>
    <endEvent id="EndEvent_2" name="Loan Disbursed"/>
    <sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1"/>
    <sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="Gateway_1"/>
    <sequenceFlow id="Flow_3" sourceRef="Gateway_1" targetRef="Task_2" name="No"/>
    <sequenceFlow id="Flow_4" sourceRef="Task_2" targetRef="Task_1"/>
    <sequenceFlow id="Flow_5" sourceRef="Gateway_1" targetRef="Task_3" name="Yes"/>
    <sequenceFlow id="Flow_6" sourceRef="Task_3" targetRef="Gateway_2"/>
    <sequenceFlow id="Flow_7" sourceRef="Gateway_2" targetRef="Task_4" name="No"/>
    <sequenceFlow id="Flow_8" sourceRef="Task_4" targetRef="EndEvent_1"/>
    <sequenceFlow id="Flow_9" sourceRef="Gateway_2" targetRef="Gateway_3" name="Yes"/>
    <sequenceFlow id="Flow_10" sourceRef="Gateway_3" targetRef="Task_5"/>
    <sequenceFlow id="Flow_11" sourceRef="Gateway_3" targetRef="Task_6"/>
    <sequenceFlow id="Flow_12" sourceRef="Gateway_3" targetRef="Task_7"/>
    <sequenceFlow id="Flow_13" sourceRef="Task_5" targetRef="Gateway_4"/>
    <sequenceFlow id="Flow_14" sourceRef="Task_6" targetRef="Gateway_4"/>
    <sequenceFlow id="Flow_15" sourceRef="Task_7" targetRef="Gateway_4"/>
    <sequenceFlow id="Flow_16" sourceRef="Gateway_4" targetRef="Task_8"/>
    <sequenceFlow id="Flow_17" sourceRef="Task_8" targetRef="Gateway_5"/>
    <sequenceFlow id="Flow_18" sourceRef="Gateway_5" targetRef="Task_9" name="Low"/>
    <sequenceFlow id="Flow_19" sourceRef="Gateway_5" targetRef="Task_10" name="High"/>
    <sequenceFlow id="Flow_20" sourceRef="Task_9" targetRef="Task_11"/>
    <sequenceFlow id="Flow_21" sourceRef="Task_10" targetRef="Gateway_6"/>
    <sequenceFlow id="Flow_22" sourceRef="Gateway_6" targetRef="Task_11" name="Yes"/>
    <sequenceFlow id="Flow_23" sourceRef="Gateway_6" targetRef="Task_4" name="No"/>
    <sequenceFlow id="Flow_24" sourceRef="Task_11" targetRef="Task_12"/>
    <sequenceFlow id="Flow_25" sourceRef="Task_12" targetRef="Task_13"/>
    <sequenceFlow id="Flow_26" sourceRef="Task_13" targetRef="EndEvent_2"/>
  </process>
</definitions>`
  },
  {
    id: 'e-commerce-fulfillment',
    name: 'E-Commerce Order Fulfillment',
    description: 'Large-scale order processing with inventory, payment, shipping, and customer service workflows',
    complexity: 5,
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL">
  <process id="Process_6" name="E-Commerce Order Fulfillment">
    <startEvent id="StartEvent_1" name="Order Placed"/>
    <task id="Task_1" name="Validate Order Data"/>
    <exclusiveGateway id="Gateway_1" name="Data Valid?"/>
    <task id="Task_2" name="Request Customer Info"/>
    <parallelGateway id="Gateway_2" name="Parallel Processing"/>
    <task id="Task_3" name="Check Inventory"/>
    <task id="Task_4" name="Process Payment"/>
    <task id="Task_5" name="Calculate Shipping"/>
    <parallelGateway id="Gateway_3" name="Join"/>
    <exclusiveGateway id="Gateway_4" name="Items Available?"/>
    <task id="Task_6" name="Reserve Stock"/>
    <task id="Task_7" name="Backorder Items"/>
    <task id="Task_8" name="Notify Customer Delay"/>
    <exclusiveGateway id="Gateway_5" name="Payment Success?"/>
    <task id="Task_9" name="Contact Customer"/>
    <task id="Task_10" name="Cancel Order"/>
    <endEvent id="EndEvent_1" name="Order Cancelled"/>
    <task id="Task_11" name="Generate Invoice"/>
    <task id="Task_12" name="Update Accounting"/>
    <parallelGateway id="Gateway_6" name="Warehouse Operations"/>
    <task id="Task_13" name="Pick Items"/>
    <task id="Task_14" name="Quality Check"/>
    <task id="Task_15" name="Pack Order"/>
    <parallelGateway id="Gateway_7" name="Join Warehouse"/>
    <exclusiveGateway id="Gateway_8" name="QC Pass?"/>
    <task id="Task_16" name="Repack Items"/>
    <task id="Task_17" name="Generate Shipping Label"/>
    <task id="Task_18" name="Schedule Pickup"/>
    <parallelGateway id="Gateway_9" name="Shipping Notifications"/>
    <task id="Task_19" name="Email Customer"/>
    <task id="Task_20" name="Update Order Status"/>
    <task id="Task_21" name="Notify Warehouse"/>
    <parallelGateway id="Gateway_10" name="Join Notifications"/>
    <task id="Task_22" name="Ship Package"/>
    <task id="Task_23" name="Track Shipment"/>
    <exclusiveGateway id="Gateway_11" name="Delivered?"/>
    <task id="Task_24" name="Confirm Delivery"/>
    <task id="Task_25" name="Contact Carrier"/>
    <task id="Task_26" name="Send Feedback Request"/>
    <parallelGateway id="Gateway_12" name="Post-Delivery"/>
    <task id="Task_27" name="Update Customer Record"/>
    <task id="Task_28" name="Generate Analytics"/>
    <task id="Task_29" name="Check Warranty"/>
    <parallelGateway id="Gateway_13" name="Join Final"/>
    <endEvent id="EndEvent_2" name="Order Complete"/>
    <sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1"/>
    <sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="Gateway_1"/>
    <sequenceFlow id="Flow_3" sourceRef="Gateway_1" targetRef="Task_2" name="No"/>
    <sequenceFlow id="Flow_4" sourceRef="Task_2" targetRef="Task_1"/>
    <sequenceFlow id="Flow_5" sourceRef="Gateway_1" targetRef="Gateway_2" name="Yes"/>
    <sequenceFlow id="Flow_6" sourceRef="Gateway_2" targetRef="Task_3"/>
    <sequenceFlow id="Flow_7" sourceRef="Gateway_2" targetRef="Task_4"/>
    <sequenceFlow id="Flow_8" sourceRef="Gateway_2" targetRef="Task_5"/>
    <sequenceFlow id="Flow_9" sourceRef="Task_3" targetRef="Gateway_3"/>
    <sequenceFlow id="Flow_10" sourceRef="Task_4" targetRef="Gateway_3"/>
    <sequenceFlow id="Flow_11" sourceRef="Task_5" targetRef="Gateway_3"/>
    <sequenceFlow id="Flow_12" sourceRef="Gateway_3" targetRef="Gateway_4"/>
    <sequenceFlow id="Flow_13" sourceRef="Gateway_4" targetRef="Task_6" name="Yes"/>
    <sequenceFlow id="Flow_14" sourceRef="Gateway_4" targetRef="Task_7" name="Partial"/>
    <sequenceFlow id="Flow_15" sourceRef="Task_7" targetRef="Task_8"/>
    <sequenceFlow id="Flow_16" sourceRef="Task_8" targetRef="Gateway_5"/>
    <sequenceFlow id="Flow_17" sourceRef="Task_6" targetRef="Gateway_5"/>
    <sequenceFlow id="Flow_18" sourceRef="Gateway_5" targetRef="Task_9" name="Failed"/>
    <sequenceFlow id="Flow_19" sourceRef="Task_9" targetRef="Task_10"/>
    <sequenceFlow id="Flow_20" sourceRef="Task_10" targetRef="EndEvent_1"/>
    <sequenceFlow id="Flow_21" sourceRef="Gateway_5" targetRef="Task_11" name="Success"/>
    <sequenceFlow id="Flow_22" sourceRef="Task_11" targetRef="Task_12"/>
    <sequenceFlow id="Flow_23" sourceRef="Task_12" targetRef="Gateway_6"/>
    <sequenceFlow id="Flow_24" sourceRef="Gateway_6" targetRef="Task_13"/>
    <sequenceFlow id="Flow_25" sourceRef="Gateway_6" targetRef="Task_14"/>
    <sequenceFlow id="Flow_26" sourceRef="Gateway_6" targetRef="Task_15"/>
    <sequenceFlow id="Flow_27" sourceRef="Task_13" targetRef="Gateway_7"/>
    <sequenceFlow id="Flow_28" sourceRef="Task_14" targetRef="Gateway_7"/>
    <sequenceFlow id="Flow_29" sourceRef="Task_15" targetRef="Gateway_7"/>
    <sequenceFlow id="Flow_30" sourceRef="Gateway_7" targetRef="Gateway_8"/>
    <sequenceFlow id="Flow_31" sourceRef="Gateway_8" targetRef="Task_17" name="Pass"/>
    <sequenceFlow id="Flow_32" sourceRef="Gateway_8" targetRef="Task_16" name="Fail"/>
    <sequenceFlow id="Flow_33" sourceRef="Task_16" targetRef="Task_17"/>
    <sequenceFlow id="Flow_34" sourceRef="Task_17" targetRef="Task_18"/>
    <sequenceFlow id="Flow_35" sourceRef="Task_18" targetRef="Gateway_9"/>
    <sequenceFlow id="Flow_36" sourceRef="Gateway_9" targetRef="Task_19"/>
    <sequenceFlow id="Flow_37" sourceRef="Gateway_9" targetRef="Task_20"/>
    <sequenceFlow id="Flow_38" sourceRef="Gateway_9" targetRef="Task_21"/>
    <sequenceFlow id="Flow_39" sourceRef="Task_19" targetRef="Gateway_10"/>
    <sequenceFlow id="Flow_40" sourceRef="Task_20" targetRef="Gateway_10"/>
    <sequenceFlow id="Flow_41" sourceRef="Task_21" targetRef="Gateway_10"/>
    <sequenceFlow id="Flow_42" sourceRef="Gateway_10" targetRef="Task_22"/>
    <sequenceFlow id="Flow_43" sourceRef="Task_22" targetRef="Task_23"/>
    <sequenceFlow id="Flow_44" sourceRef="Task_23" targetRef="Gateway_11"/>
    <sequenceFlow id="Flow_45" sourceRef="Gateway_11" targetRef="Task_24" name="Yes"/>
    <sequenceFlow id="Flow_46" sourceRef="Gateway_11" targetRef="Task_25" name="Issue"/>
    <sequenceFlow id="Flow_47" sourceRef="Task_25" targetRef="Task_23"/>
    <sequenceFlow id="Flow_48" sourceRef="Task_24" targetRef="Task_26"/>
    <sequenceFlow id="Flow_49" sourceRef="Task_26" targetRef="Gateway_12"/>
    <sequenceFlow id="Flow_50" sourceRef="Gateway_12" targetRef="Task_27"/>
    <sequenceFlow id="Flow_51" sourceRef="Gateway_12" targetRef="Task_28"/>
    <sequenceFlow id="Flow_52" sourceRef="Gateway_12" targetRef="Task_29"/>
    <sequenceFlow id="Flow_53" sourceRef="Task_27" targetRef="Gateway_13"/>
    <sequenceFlow id="Flow_54" sourceRef="Task_28" targetRef="Gateway_13"/>
    <sequenceFlow id="Flow_55" sourceRef="Task_29" targetRef="Gateway_13"/>
    <sequenceFlow id="Flow_56" sourceRef="Gateway_13" targetRef="EndEvent_2"/>
  </process>
</definitions>`
  },
  {
    id: 'insurance-claim',
    name: 'Insurance Claim Processing',
    description: 'Comprehensive insurance claim workflow with fraud detection, investigation, and multi-level approvals',
    complexity: 5,
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL">
  <process id="Process_7" name="Insurance Claim Processing">
    <startEvent id="StartEvent_1" name="Claim Submitted"/>
    <task id="Task_1" name="Register Claim"/>
    <task id="Task_2" name="Initial Review"/>
    <exclusiveGateway id="Gateway_1" name="Complete?"/>
    <task id="Task_3" name="Request Documents"/>
    <parallelGateway id="Gateway_2" name="Initial Checks"/>
    <task id="Task_4" name="Verify Policy"/>
    <task id="Task_5" name="Check Coverage"/>
    <task id="Task_6" name="Fraud Detection Scan"/>
    <parallelGateway id="Gateway_3" name="Join Checks"/>
    <exclusiveGateway id="Gateway_4" name="Policy Valid?"/>
    <task id="Task_7" name="Reject Claim"/>
    <endEvent id="EndEvent_1" name="Claim Rejected"/>
    <exclusiveGateway id="Gateway_5" name="Fraud Alert?"/>
    <task id="Task_8" name="Flag for Investigation"/>
    <task id="Task_9" name="Assign Investigator"/>
    <parallelGateway id="Gateway_6" name="Investigation Tasks"/>
    <task id="Task_10" name="Site Inspection"/>
    <task id="Task_11" name="Interview Claimant"/>
    <task id="Task_12" name="Review Documents"/>
    <task id="Task_13" name="Check History"/>
    <parallelGateway id="Gateway_7" name="Join Investigation"/>
    <task id="Task_14" name="Investigation Report"/>
    <exclusiveGateway id="Gateway_8" name="Legitimate?"/>
    <task id="Task_15" name="Calculate Claim Amount"/>
    <exclusiveGateway id="Gateway_9" name="Amount Range?"/>
    <task id="Task_16" name="Auto Process"/>
    <task id="Task_17" name="Senior Adjuster Review"/>
    <task id="Task_18" name="Manager Approval"/>
    <task id="Task_19" name="Director Approval"/>
    <exclusiveGateway id="Gateway_10" name="Approved?"/>
    <task id="Task_20" name="Request More Info"/>
    <task id="Task_21" name="Negotiate Settlement"/>
    <task id="Task_22" name="Legal Review"/>
    <exclusiveGateway id="Gateway_11" name="Settlement Agreed?"/>
    <task id="Task_23" name="Prepare Payment"/>
    <parallelGateway id="Gateway_12" name="Payment Process"/>
    <task id="Task_24" name="Generate Check"/>
    <task id="Task_25" name="Update Records"/>
    <task id="Task_26" name="Notify Finance"/>
    <task id="Task_27" name="Close Claim"/>
    <parallelGateway id="Gateway_13" name="Join Payment"/>
    <parallelGateway id="Gateway_14" name="Final Steps"/>
    <task id="Task_28" name="Send Payment"/>
    <task id="Task_29" name="Customer Notification"/>
    <task id="Task_30" name="Update Analytics"/>
    <task id="Task_31" name="Quality Review"/>
    <parallelGateway id="Gateway_15" name="Join Final"/>
    <task id="Task_32" name="Archive Documents"/>
    <endEvent id="EndEvent_2" name="Claim Completed"/>
    <sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1"/>
    <sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="Task_2"/>
    <sequenceFlow id="Flow_3" sourceRef="Task_2" targetRef="Gateway_1"/>
    <sequenceFlow id="Flow_4" sourceRef="Gateway_1" targetRef="Task_3" name="No"/>
    <sequenceFlow id="Flow_5" sourceRef="Task_3" targetRef="Task_2"/>
    <sequenceFlow id="Flow_6" sourceRef="Gateway_1" targetRef="Gateway_2" name="Yes"/>
    <sequenceFlow id="Flow_7" sourceRef="Gateway_2" targetRef="Task_4"/>
    <sequenceFlow id="Flow_8" sourceRef="Gateway_2" targetRef="Task_5"/>
    <sequenceFlow id="Flow_9" sourceRef="Gateway_2" targetRef="Task_6"/>
    <sequenceFlow id="Flow_10" sourceRef="Task_4" targetRef="Gateway_3"/>
    <sequenceFlow id="Flow_11" sourceRef="Task_5" targetRef="Gateway_3"/>
    <sequenceFlow id="Flow_12" sourceRef="Task_6" targetRef="Gateway_3"/>
    <sequenceFlow id="Flow_13" sourceRef="Gateway_3" targetRef="Gateway_4"/>
    <sequenceFlow id="Flow_14" sourceRef="Gateway_4" targetRef="Task_7" name="Invalid"/>
    <sequenceFlow id="Flow_15" sourceRef="Task_7" targetRef="EndEvent_1"/>
    <sequenceFlow id="Flow_16" sourceRef="Gateway_4" targetRef="Gateway_5" name="Valid"/>
    <sequenceFlow id="Flow_17" sourceRef="Gateway_5" targetRef="Task_8" name="Yes"/>
    <sequenceFlow id="Flow_18" sourceRef="Task_8" targetRef="Task_9"/>
    <sequenceFlow id="Flow_19" sourceRef="Task_9" targetRef="Gateway_6"/>
    <sequenceFlow id="Flow_20" sourceRef="Gateway_6" targetRef="Task_10"/>
    <sequenceFlow id="Flow_21" sourceRef="Gateway_6" targetRef="Task_11"/>
    <sequenceFlow id="Flow_22" sourceRef="Gateway_6" targetRef="Task_12"/>
    <sequenceFlow id="Flow_23" sourceRef="Gateway_6" targetRef="Task_13"/>
    <sequenceFlow id="Flow_24" sourceRef="Task_10" targetRef="Gateway_7"/>
    <sequenceFlow id="Flow_25" sourceRef="Task_11" targetRef="Gateway_7"/>
    <sequenceFlow id="Flow_26" sourceRef="Task_12" targetRef="Gateway_7"/>
    <sequenceFlow id="Flow_27" sourceRef="Task_13" targetRef="Gateway_7"/>
    <sequenceFlow id="Flow_28" sourceRef="Gateway_7" targetRef="Task_14"/>
    <sequenceFlow id="Flow_29" sourceRef="Task_14" targetRef="Gateway_8"/>
    <sequenceFlow id="Flow_30" sourceRef="Gateway_8" targetRef="Task_7" name="Fraud"/>
    <sequenceFlow id="Flow_31" sourceRef="Gateway_8" targetRef="Task_15" name="Valid"/>
    <sequenceFlow id="Flow_32" sourceRef="Gateway_5" targetRef="Task_15" name="No"/>
    <sequenceFlow id="Flow_33" sourceRef="Task_15" targetRef="Gateway_9"/>
    <sequenceFlow id="Flow_34" sourceRef="Gateway_9" targetRef="Task_16" name="< $5000"/>
    <sequenceFlow id="Flow_35" sourceRef="Gateway_9" targetRef="Task_17" name="$5000-$25000"/>
    <sequenceFlow id="Flow_36" sourceRef="Gateway_9" targetRef="Task_18" name="$25000-$100000"/>
    <sequenceFlow id="Flow_37" sourceRef="Gateway_9" targetRef="Task_19" name="> $100000"/>
    <sequenceFlow id="Flow_38" sourceRef="Task_16" targetRef="Task_23"/>
    <sequenceFlow id="Flow_39" sourceRef="Task_17" targetRef="Gateway_10"/>
    <sequenceFlow id="Flow_40" sourceRef="Task_18" targetRef="Gateway_10"/>
    <sequenceFlow id="Flow_41" sourceRef="Task_19" targetRef="Gateway_10"/>
    <sequenceFlow id="Flow_42" sourceRef="Gateway_10" targetRef="Task_20" name="Need Info"/>
    <sequenceFlow id="Flow_43" sourceRef="Task_20" targetRef="Task_15"/>
    <sequenceFlow id="Flow_44" sourceRef="Gateway_10" targetRef="Task_21" name="Negotiate"/>
    <sequenceFlow id="Flow_45" sourceRef="Task_21" targetRef="Task_22"/>
    <sequenceFlow id="Flow_46" sourceRef="Task_22" targetRef="Gateway_11"/>
    <sequenceFlow id="Flow_47" sourceRef="Gateway_11" targetRef="Task_7" name="No"/>
    <sequenceFlow id="Flow_48" sourceRef="Gateway_11" targetRef="Task_23" name="Yes"/>
    <sequenceFlow id="Flow_49" sourceRef="Gateway_10" targetRef="Task_23" name="Approved"/>
    <sequenceFlow id="Flow_50" sourceRef="Task_23" targetRef="Gateway_12"/>
    <sequenceFlow id="Flow_51" sourceRef="Gateway_12" targetRef="Task_24"/>
    <sequenceFlow id="Flow_52" sourceRef="Gateway_12" targetRef="Task_25"/>
    <sequenceFlow id="Flow_53" sourceRef="Gateway_12" targetRef="Task_26"/>
    <sequenceFlow id="Flow_54" sourceRef="Gateway_12" targetRef="Task_27"/>
    <sequenceFlow id="Flow_55" sourceRef="Task_24" targetRef="Gateway_13"/>
    <sequenceFlow id="Flow_56" sourceRef="Task_25" targetRef="Gateway_13"/>
    <sequenceFlow id="Flow_57" sourceRef="Task_26" targetRef="Gateway_13"/>
    <sequenceFlow id="Flow_58" sourceRef="Task_27" targetRef="Gateway_13"/>
    <sequenceFlow id="Flow_59" sourceRef="Gateway_13" targetRef="Gateway_14"/>
    <sequenceFlow id="Flow_60" sourceRef="Gateway_14" targetRef="Task_28"/>
    <sequenceFlow id="Flow_61" sourceRef="Gateway_14" targetRef="Task_29"/>
    <sequenceFlow id="Flow_62" sourceRef="Gateway_14" targetRef="Task_30"/>
    <sequenceFlow id="Flow_63" sourceRef="Gateway_14" targetRef="Task_31"/>
    <sequenceFlow id="Flow_64" sourceRef="Task_28" targetRef="Gateway_15"/>
    <sequenceFlow id="Flow_65" sourceRef="Task_29" targetRef="Gateway_15"/>
    <sequenceFlow id="Flow_66" sourceRef="Task_30" targetRef="Gateway_15"/>
    <sequenceFlow id="Flow_67" sourceRef="Task_31" targetRef="Gateway_15"/>
    <sequenceFlow id="Flow_68" sourceRef="Gateway_15" targetRef="Task_32"/>
    <sequenceFlow id="Flow_69" sourceRef="Task_32" targetRef="EndEvent_2"/>
  </process>
</definitions>`
  }
];
