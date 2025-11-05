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
  }
];
